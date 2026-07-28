// packages/ai-router/services/router.ts
import { AIProviderId, RouterMode, AIMessage, RouterLog } from "../types";
import { PROVIDER_REGISTRY } from "./provider-registry";
import { classifyGatewayError } from "../utils/error-handler";
import { recordRouterLog } from "./analytics";
import { secureFetch, safeLogger } from "../../security";

const ENV_KEY_MAP: Record<string, string> = {
  openai: "OPENAI_API_KEY",
  claude: "ANTHROPIC_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  gemini: "GEMINI_API_KEY",
  groq: "GROQ_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
  deepseek: "DEEPSEEK_API_KEY",
  mistral: "MISTRAL_API_KEY",
  cohere: "COHERE_API_KEY",
  together: "TOGETHER_API_KEY",
};

export interface RouterConfig {
  mode: RouterMode;
  providerOrder?: AIProviderId[];
  keys: Record<AIProviderId, string[]>; // Support [primary, secondary, backup] rotation list
  baseUrls?: Record<AIProviderId, string>;
  modelNames?: Record<AIProviderId, string>;
  temperature?: number;
  maxTokens?: number;
  streaming?: boolean;
  retryCount?: number;
  retryDelayMs?: number;
}

const DEFAULT_FALLBACK_ORDER: AIProviderId[] = [
  "gemini",
  "claude",
  "openai",
  "groq",
  "deepseek",
];

const MODE_PRIMARY_PROVIDERS: Record<RouterMode, AIProviderId> = {
  auto: "gemini",
  coding: "claude",
  reasoning: "openai",
  vision: "gemini",
  fast: "groq",
  cheap: "groq",
  "long-context": "gemini",
  balanced: "openai",
  creative: "claude",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Map provider IDs to their static fallback target models
const DEFAULT_MODEL_NAMES: Record<AIProviderId, string> = {
  openai: "gpt-4o-mini",
  claude: "claude-3-5-sonnet-20241022",
  anthropic: "claude-3-5-sonnet-20241022",
  gemini: "gemini-2.5-flash",
  groq: "llama-3.3-70b-versatile",
  openrouter: "meta-llama/llama-3.1-405b",
  together: "meta-llama/Llama-3-70b-chat-hf",
  deepseek: "deepseek-chat",
  mistral: "mistral-large-latest",
  cohere: "command-r-plus",
  azure: "gpt-4o",
  ollama: "llama3.3",
  lmstudio: "local-model",
  xai: "grok-2",
  fireworks: "accounts/fireworks/models/llama-v3-70b-instruct",
  perplexity: "llama-3.1-sonar-large-128k-online",
  ai21: "jamba-1.5-large",
  "openai-compat": "custom-model",
  custom: "custom-model",
};

export async function routeCompletion(
  messages: AIMessage[],
  config: RouterConfig,
  onChunk?: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const startTime = Date.now();
  const query = messages[messages.length - 1]?.content || "";
  
  // 1. Resolve Primary Provider based on selected Mode
  let primaryProvider = MODE_PRIMARY_PROVIDERS[config.mode] || "openai";
  
  // Custom keyword heuristics overrides for "auto" mode
  if (config.mode === "auto") {
    const lq = query.toLowerCase();
    if (lq.includes("code") || lq.includes("refactor") || lq.includes("bug") || lq.includes("function")) {
      primaryProvider = "claude"; // Coding
    } else if (lq.includes("scorecard") || lq.includes("evaluate") || lq.includes("star") || lq.includes("calibrate")) {
      primaryProvider = "openai"; // Reasoning/Evaluation
    } else if (lq.includes("resume") || lq.includes("analyze") || lq.includes("file") || lq.includes("pdf")) {
      primaryProvider = "gemini"; // Vision & Long file context
    } else if (lq.includes("hi") || lq.includes("hello") || lq.length < 15) {
      primaryProvider = "groq"; // Fast speed chat
    }
  }

  // 2. Assemble execution chain fallback list starting with primary provider
  const providersOrder = config.providerOrder || DEFAULT_FALLBACK_ORDER;
  const executionChainList: AIProviderId[] = [
    primaryProvider,
    ...providersOrder.filter((p) => p !== primaryProvider),
  ];

  const executionChain: RouterLog["executionChain"] = [];
  let finalContent = "";
  let finalProvider: AIProviderId = "openai";
  let finalModel = "default";
  let completed = false;

  // 3. Run execution chain failover loop
  for (const providerId of executionChainList) {
    if (completed) break;

    const registry = PROVIDER_REGISTRY[providerId];
    if (!registry) continue;

    // 1. Resolve key list with priority: Client-saved keys -> Env vars -> Provider Disabled (Empty)
    let keyList = (config.keys[providerId] || []).filter(k => k && k.trim() !== "");
    if (keyList.length === 0) {
      const envVarName = ENV_KEY_MAP[providerId];
      const envKey = envVarName ? process.env[envVarName] : undefined;
      if (envKey && envKey.trim() !== "") {
        keyList = [envKey.trim()];
      }
    }

    const model = config.modelNames?.[providerId] || DEFAULT_MODEL_NAMES[providerId] || "default";
    
    // Ignore config.baseUrls endpoint overrides unless it's azure, ollama, or lmstudio
    let endpoint = registry.apiEndpoint;
    if (["azure", "ollama", "lmstudio"].includes(providerId) && config.baseUrls?.[providerId]) {
      endpoint = config.baseUrls[providerId];
    }
    
    // If key list is empty and provider requires authentication (is not local/ollama)
    const requiresAuth = registry.authType !== "none";
    if (requiresAuth && keyList.length === 0) {
      // Record this provider as unavailable in the execution chain
      executionChain.push({
        provider: providerId,
        model,
        latencyMs: 0,
        status: "failed",
        error: "Provider unavailable: API Key is missing or misconfigured.",
      });
      continue; // Skip calling this provider entirely
    }

    const keysToTry = keyList.length > 0 ? keyList : [""];

    for (let keyIdx = 0; keyIdx < keysToTry.length; keyIdx++) {
      const activeKey = keysToTry[keyIdx];
      const maxRetries = config.retryCount ?? 3;
      const retryDelay = config.retryDelayMs ?? 1000;

      let runStart = Date.now();
      let lastError: any = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        runStart = Date.now();
        try {
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
          };
  
          let responseText = "";

        if (providerId === "gemini") {
          // Google Gemini endpoint compilation
          const url = `${endpoint}/models/${model.includes("gemini") ? model : "gemini-2.5-flash"}:generateContent?key=${activeKey}`;
          const res = await secureFetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify({
              contents: [{ parts: [{ text: messages.map((m) => `${m.role}: ${m.content}`).join("\n") }] }],
              generationConfig: {
                temperature: config.temperature ?? 0.7,
                maxOutputTokens: config.maxTokens || 4096,
              },
            }),
            signal,
            allowedProvider: "gemini",
          });

          if (!res.ok) {
            const err = await res.text();
            let errorMessage = `Google API returned status code ${res.status}: ${err}`;
            if (res.status === 429 || err.toLowerCase().includes("quota") || err.toLowerCase().includes("exhausted")) {
              errorMessage = "Your Gemini API quota has been exceeded. Please retry in a few minutes, view the Google Developer Documentation link (https://ai.google.dev/gemini-api/docs/quota), or switch your provider/model settings (e.g. switch to OpenRouter, Groq, OpenAI, or mistral).";
            }
            throw new Error(errorMessage);
          }

          const json = await res.json();
          responseText = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (onChunk) {
            onChunk(responseText);
          }
        } else {
          // Standard OpenAI / OpenCompat endpoint execution
          if (registry.authType === "bearer") {
            headers["Authorization"] = `Bearer ${activeKey}`;
          } else if (providerId === "claude" || providerId === "anthropic") {
            headers["x-api-key"] = activeKey;
            headers["anthropic-version"] = "2023-06-01";
            headers["dangerously-allow-browser"] = "true";
          }

          const isStreaming = !!onChunk && config.streaming;
          const url = providerId === "claude" || providerId === "anthropic" 
            ? `${endpoint}/messages`
            : `${endpoint}/chat/completions`;

          const body = providerId === "claude" || providerId === "anthropic"
            ? {
                model,
                messages: messages.map((m) => ({ role: m.role === "system" ? "user" : m.role, content: m.content })),
                max_tokens: config.maxTokens || 4096,
                temperature: config.temperature ?? 0.7,
                stream: isStreaming,
              }
            : {
                model,
                messages,
                temperature: config.temperature ?? 0.7,
                max_tokens: config.maxTokens || 4096,
                stream: isStreaming,
              };

          const res = await secureFetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            signal,
            allowedProvider: providerId,
          });

          if (!res.ok) {
            const err = await res.text();
            let errorMessage = `Provider API returned status code ${res.status}: ${err}`;
            if (res.status === 429 || err.toLowerCase().includes("quota") || err.toLowerCase().includes("exhausted")) {
              errorMessage = `Your ${providerId.toUpperCase()} API quota has been exceeded. Please retry in a few minutes, view the provider's developer documentation, or switch your provider/model settings (e.g. switch to OpenRouter, Groq, OpenAI, or mistral).`;
            }
            throw new Error(errorMessage);
          }

          if (isStreaming) {
            const reader = res.body!.getReader();
            const decoder = new TextDecoder();
            
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

                for (const line of lines) {
                  const dataStr = line.slice(6).trim();
                  if (dataStr === "[DONE]") continue;

                  try {
                    const json = JSON.parse(dataStr);
                    const delta = json.choices?.[0]?.delta?.content || json.delta?.text || "";
                    if (delta) {
                      responseText += delta;
                      onChunk(delta);
                    }
                  } catch {}
                }
              }
            } finally {
              reader.releaseLock();
            }
          } else {
            const json = await res.json();
            responseText = json.choices?.[0]?.message?.content || json.content?.[0]?.text || "";
          }
        }

        finalContent = responseText;
        finalProvider = providerId;
        finalModel = model;
        completed = true;

        executionChain.push({
          provider: providerId,
          model,
          status: "success",
          latencyMs: Date.now() - runStart,
        });
        break; // break attempt loop
      } catch (err: any) {
        lastError = err;
        safeLogger.warn(`Gateway failed executing prompt with provider ${providerId} and key index ${keyIdx} on attempt ${attempt}`, err);
        if (attempt < maxRetries - 1) {
          await sleep(retryDelay);
        }
      }
    }

    if (completed) {
      break; // break key loop
    } else {
      executionChain.push({
        provider: providerId,
        model,
        status: "failed",
        latencyMs: Date.now() - runStart,
        error: lastError?.message || "Unknown execution error",
      });
    }
  }
}

  const durationMs = Date.now() - startTime;
  const inputLen = messages.reduce((acc, m) => acc + m.content.length, 0);
  const inputTokens = Math.round(inputLen / 4.1); // Estimate
  const outputTokens = Math.round(finalContent.length / 4.1); // Estimate
  
  // Calculate cost estimation in USD
  const registry = PROVIDER_REGISTRY[finalProvider];
  const inputCost = (inputTokens / 1000000) * (registry?.pricing?.inputPerMillion || 0.0);
  const outputCost = (outputTokens / 1000000) * (registry?.pricing?.outputPerMillion || 0.0);
  const costUSD = inputCost + outputCost;

  // Record logs
  const log: RouterLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    query,
    mode: config.mode,
    executionChain,
    finalProvider,
    finalModel,
    inputTokens,
    outputTokens,
    costUSD,
    durationMs,
    status: completed ? "completed" : "failed",
  };

  recordRouterLog(log);

  if (!completed) {
    throw new Error("AI Gateway: All configured providers in the fallback execution chain failed.");
  }

  return finalContent;
}
