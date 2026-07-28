// packages/ai-router/services/health.ts
import { HealthCheckReport, AIProviderId } from "../types";
import { PROVIDER_REGISTRY } from "./provider-registry";
import { fetchAvailableModels } from "./discovery";
import { secureFetch } from "../../security";
import { classifyGatewayError } from "../utils/error-handler";

class ResponseError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

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
  const hasKey = !!apiKey && apiKey.trim() !== "";
  report.checkedSteps.push({
    step: "1. Validate API Key Presence",
    passed: !needsKey || hasKey,
    error: needsKey && !hasKey ? "API Key not configured" : undefined,
  });

  if (needsKey && !hasKey) {
    report.status = "missing_key";
    report.error = "API key not configured";
    return report;
  }

  let endpoint = registry.apiEndpoint;
  if (["azure", "ollama", "lmstudio"].includes(providerId) && customBaseUrl) {
    endpoint = customBaseUrl;
  }
  const targetModel = modelName || "default";

  // 2. Authentication handshake check
  const startTime = Date.now();
  let authPassed = false;
  let authErrorMsg = "";
  let classifiedStatus = "unavailable";

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (providerId === "gemini") {
      const res = await secureFetch(`${endpoint}/models?key=${apiKey}`, {
        signal: AbortSignal.timeout(6000),
        allowedProvider: "gemini",
      });
      if (!res.ok) {
        const bodyText = await res.text();
        throw new ResponseError(res.status, bodyText);
      }
    } else if (registry.authType !== "none") {
      if (registry.authType === "bearer") {
        headers["Authorization"] = `Bearer ${apiKey}`;
      } else if (providerId === "claude" || providerId === "anthropic") {
        headers["x-api-key"] = apiKey!;
        headers["anthropic-version"] = "2023-06-01";
        headers["dangerously-allow-browser"] = "true";
      }

      // Check models list
      const res = await secureFetch(`${endpoint}/models`, {
        headers,
        signal: AbortSignal.timeout(6000),
        allowedProvider: providerId,
      });
      if (!res.ok) {
        const bodyText = await res.text();
        throw new ResponseError(res.status, bodyText);
      }
    }
    
    authPassed = true;
    report.checkedSteps.push({
      step: "2 & 3. Authentication & Model List Handshake",
      passed: true,
    });
  } catch (err: any) {
    authErrorMsg = err.message || "Failed model list query request handshake";
    
    // Classify Error
    if (err instanceof ResponseError) {
      const classified = classifyGatewayError(providerId, err.status, err.message);
      if (classified.code === "AUTH_FAILED") classifiedStatus = "invalid_key";
      else if (classified.code === "QUOTA_EXCEEDED") classifiedStatus = "quota_exceeded";
      else if (classified.code === "RATE_LIMITED") classifiedStatus = "rate_limited";
      else if (classified.code === "MODEL_NOT_FOUND") classifiedStatus = "model_not_found";
      else if (err.status === 403) classifiedStatus = "auth_failed";
      else classifiedStatus = "offline";
    } else {
      classifiedStatus = "offline";
    }

    report.checkedSteps.push({
      step: "2 & 3. Authentication & Model List Handshake",
      passed: false,
      error: authErrorMsg,
    });
  }

  if (!authPassed) {
    report.status = classifiedStatus;
    report.error = authErrorMsg;
    return report;
  }

  // 4. Small completion verification request
  let completionPassed = false;
  let completionError = "";
  let responseText = "";
  let version = "v1";

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (providerId === "gemini") {
      const model = targetModel === "default" ? "gemini-2.5-flash" : targetModel;
      const res = await secureFetch(`${endpoint}/models/${model.includes("gemini") ? model : "gemini-2.5-flash"}:generateContent?key=${apiKey}`, {
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
      if (!res.ok) {
        const bodyText = await res.text();
        throw new ResponseError(res.status, bodyText);
      } else {
        const json = await res.json();
        responseText = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
      }
    } else {
      if (registry.authType === "bearer") {
        headers["Authorization"] = `Bearer ${apiKey}`;
      } else if (providerId === "claude" || providerId === "anthropic") {
        headers["x-api-key"] = apiKey!;
        headers["anthropic-version"] = "2023-06-01";
        headers["dangerously-allow-browser"] = "true";
      }

      const model = targetModel === "default" ? "gpt-4o-mini" : targetModel;
      
      const res = await secureFetch(`${endpoint}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 5,
        }),
        signal: AbortSignal.timeout(6000),
        allowedProvider: providerId,
      });

      completionPassed = res.ok;
      if (!res.ok) {
        const bodyText = await res.text();
        throw new ResponseError(res.status, bodyText);
      } else {
        const json = await res.json();
        responseText = json.choices?.[0]?.message?.content || json.content?.[0]?.text || "";
        version = res.headers.get("x-request-id") || "v1";
      }
    }

    report.checkedSteps.push({
      step: "4 & 5. Completion Verification Request",
      passed: true,
    });
  } catch (err: any) {
    completionError = err.message || "Network exception during completion test";
    
    if (err instanceof ResponseError) {
      const classified = classifyGatewayError(providerId, err.status, err.message);
      if (classified.code === "AUTH_FAILED") classifiedStatus = "invalid_key";
      else if (classified.code === "QUOTA_EXCEEDED") classifiedStatus = "quota_exceeded";
      else if (classified.code === "RATE_LIMITED") classifiedStatus = "rate_limited";
      else if (classified.code === "MODEL_NOT_FOUND") classifiedStatus = "model_not_found";
      else if (err.status === 403) classifiedStatus = "auth_failed";
      else classifiedStatus = "offline";
    } else {
      classifiedStatus = "offline";
    }

    report.checkedSteps.push({
      step: "4 & 5. Completion Verification Request",
      passed: false,
      error: completionError,
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
  report.status = completionPassed ? "connected" : classifiedStatus;
  report.apiVersion = version;
  report.sdkVersion = "7.0.0-gateway";
  report.response = responseText;
  report.providerVersion = version;
  report.tokenUsage = {
    inputTokens: 2,
    outputTokens: responseText.split(/\s+/).filter(Boolean).length,
    totalTokens: 2 + responseText.split(/\s+/).filter(Boolean).length,
  };

  if (!completionPassed) {
    report.error = completionError;
  }

  return report;
}
