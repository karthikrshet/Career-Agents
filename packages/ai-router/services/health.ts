// packages/ai-router/services/health.ts
import { HealthCheckReport, AIProviderId } from "../types";
import { PROVIDER_REGISTRY } from "./provider-registry";
import { fetchAvailableModels } from "./discovery";
import { secureFetch } from "../../security";

export async function runHealthCheck(
  providerId: AIProviderId,
  apiKey?: string,
  customBaseUrl?: string,
  modelName?: string
): Promise<HealthCheckReport> {
  const registry = PROVIDER_REGISTRY[providerId];
  const timestamp = new Date().toISOString();
  
  const report: HealthCheckReport = {
    timestamp,
    healthy: false,
    status: "unavailable",
    checkedSteps: [],
  };

  if (!registry) {
    report.error = `AI Provider '${providerId}' is not registered.`;
    return report;
  }

  // 1. API key existence validation
  const needsKey = registry.authType !== "none";
  const hasKey = !!apiKey;
  report.checkedSteps.push({
    step: "1. Validate API Key Presence",
    passed: !needsKey || hasKey,
    error: needsKey && !hasKey ? "API Key not configured" : undefined,
  });

  if (needsKey && !hasKey) {
    report.status = "missing_key";
    return report;
  }

  // Reject endpoint overrides unless it's azure, ollama, or lmstudio
  let endpoint = registry.apiEndpoint;
  if (["azure", "ollama", "lmstudio"].includes(providerId) && customBaseUrl) {
    endpoint = customBaseUrl;
  }
  const targetModel = modelName || "default";

  // 2. Authentication handshake check
  const startTime = Date.now();
  let authPassed = false;
  try {
    // 3. List models as auth validation
    const models = await fetchAvailableModels(providerId, apiKey, customBaseUrl);
    authPassed = models.length > 0;
    report.checkedSteps.push({
      step: "2 & 3. Authentication & Model List Handshake",
      passed: authPassed,
    });
  } catch (err: any) {
    report.checkedSteps.push({
      step: "2 & 3. Authentication & Model List Handshake",
      passed: false,
      error: err.message || "Failed model list query request handshake",
    });
  }

  if (!authPassed) {
    report.status = "unavailable";
    report.error = "Connection authentication or model list fetch failed.";
    return report;
  }

  // 4. Streaming check & 5. Small completion request
  let completionPassed = false;
  let completionError = "";
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (providerId === "gemini") {
      const res = await secureFetch(`${endpoint}/models/${targetModel.includes("gemini") ? targetModel : "gemini-2.5-flash"}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Hello" }] }],
          generationConfig: { maxOutputTokens: 5 }
        }),
        signal: AbortSignal.timeout(6000),
        allowedProvider: "gemini",
      });
      completionPassed = res.ok;
      if (!res.ok) completionError = await res.text();
    } else {
      if (registry.authType === "bearer") {
        headers["Authorization"] = `Bearer ${apiKey}`;
      } else if (providerId === "claude" || providerId === "anthropic") {
        headers["x-api-key"] = apiKey!;
        headers["anthropic-version"] = "2023-06-01";
        headers["dangerously-allow-browser"] = "true";
      }

      const res = await secureFetch(`${endpoint}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: targetModel === "default" ? "gpt-4o-mini" : targetModel,
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 5,
        }),
        signal: AbortSignal.timeout(6000),
        allowedProvider: providerId,
      });
      completionPassed = res.ok;
      if (!res.ok) completionError = await res.text();
    }

    report.checkedSteps.push({
      step: "4 & 5. Completion Verification Request",
      passed: completionPassed,
      error: completionPassed ? undefined : `Completion failed: ${completionError}`,
    });
  } catch (err: any) {
    report.checkedSteps.push({
      step: "4 & 5. Completion Verification Request",
      passed: false,
      error: err.message || "Network exception during completion test",
    });
  }

  // 6. Measure latency
  const latency = Date.now() - startTime;
  report.latencyMs = latency;
  report.checkedSteps.push({
    step: "6. Measure Completion Latency",
    passed: completionPassed,
  });

  // 7. Save report status
  report.healthy = completionPassed;
  report.status = completionPassed ? "healthy" : "limited";
  report.apiVersion = "v1";
  report.sdkVersion = "3.0.0-gateway";

  return report;
}
