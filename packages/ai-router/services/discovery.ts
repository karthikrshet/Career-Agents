// packages/ai-router/services/discovery.ts
import { PROVIDER_REGISTRY } from "./provider-registry";
import { AIProviderId } from "../types";
import { secureFetch, safeLogger } from "../../security";

const DYNAMIC_MODEL_CACHE: Record<string, { models: string[]; timestamp: number }> = {};
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const STATIC_FALLBACK_MODELS: Record<AIProviderId, string[]> = {
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "o1-preview", "o1-mini"],
  claude: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"],
  anthropic: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"],
  gemini: ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
  groq: ["llama-3.3-70b-versatile", "llama3-70b-8192", "mixtral-8x7b-32768", "gemma2-9b-it"],
  openrouter: ["meta-llama/llama-3.1-405b", "google/gemini-2.0-flash-exp", "anthropic/claude-3.5-sonnet"],
  together: ["meta-llama/Llama-3-70b-chat-hf", "mistralai/Mixtral-8x7B-Instruct-v0.1"],
  deepseek: ["deepseek-chat", "deepseek-reasoner"],
  mistral: ["mistral-large-latest", "codestral-latest"],
  cohere: ["command-r-plus", "command-r"],
  azure: ["gpt-4o", "gpt-4o-mini"],
  ollama: ["llama3.3", "mistral", "codellama", "deepseek-coder"],
  lmstudio: ["local-model"],
  xai: ["grok-2", "grok-beta"],
  grok: ["grok-2", "grok-beta"],
  fireworks: ["accounts/fireworks/models/llama-v3-70b-instruct", "accounts/fireworks/models/mixtral-8x22b-instruct"],
  perplexity: ["llama-3.1-sonar-large-128k-online", "llama-3.1-sonar-small-128k-online"],
  ai21: ["jamba-1.5-large", "jamba-1.5-mini"],
  "openai-compat": ["custom-model"],
  custom: ["custom-model"],
};

export async function fetchAvailableModels(
  providerId: AIProviderId,
  apiKey?: string,
  customBaseUrl?: string
): Promise<string[]> {
  const cacheKey = `${providerId}-${customBaseUrl || ""}`;
  const cached = DYNAMIC_MODEL_CACHE[cacheKey];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.models;
  }

  const registry = PROVIDER_REGISTRY[providerId];
  if (!registry) return STATIC_FALLBACK_MODELS[providerId] || ["default"];

  // Local/no-auth models
  if (["ollama", "lmstudio"].includes(providerId)) {
    try {
      // Only allow customBaseUrl override for ollama/lmstudio if it's local
      const endpoint = (customBaseUrl && (customBaseUrl.includes("localhost") || customBaseUrl.includes("127.0.0.1") || customBaseUrl.includes("::1")))
        ? customBaseUrl
        : registry.apiEndpoint;
      const res = await secureFetch(`${endpoint}/models`, {
        signal: AbortSignal.timeout(4000),
        allowedProvider: providerId,
      });
      if (res.ok) {
        const data = await res.json();
        const models = (data.data || []).map((m: any) => m.id);
        if (models.length > 0) {
          DYNAMIC_MODEL_CACHE[cacheKey] = { models, timestamp: Date.now() };
          return models;
        }
      }
    } catch {}
    return STATIC_FALLBACK_MODELS[providerId];
  }

  // Auth models but no key provided
  if (!apiKey) {
    return STATIC_FALLBACK_MODELS[providerId] || ["default"];
  }

  try {
    // Only allow customBaseUrl override for azure
    const endpoint = (providerId === "azure" && customBaseUrl) ? customBaseUrl : registry.apiEndpoint;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (providerId === "gemini") {
      // Gemini models endpoint format
      const res = await secureFetch(`${endpoint}/models?key=${apiKey}`, {
        signal: AbortSignal.timeout(6000),
        allowedProvider: "gemini",
      });
      if (res.ok) {
        const data = await res.json();
        const models = (data.models || []).map((m: any) => m.name.replace("models/", ""));
        if (models.length > 0) {
          DYNAMIC_MODEL_CACHE[cacheKey] = { models, timestamp: Date.now() };
          return models;
        }
      }
    } else {
      // Standard OpenAI compat layout
      if (registry.authType === "bearer") {
        headers["Authorization"] = `Bearer ${apiKey}`;
      } else if (providerId === "claude" || providerId === "anthropic") {
        headers["x-api-key"] = apiKey;
        headers["anthropic-version"] = "2023-06-01";
        headers["dangerously-allow-browser"] = "true";
      }

      const res = await secureFetch(`${endpoint}/models`, {
        headers,
        signal: AbortSignal.timeout(6000),
        allowedProvider: providerId,
      });

      if (res.ok) {
        const data = await res.json();
        const models = (data.data || []).map((m: any) => m.id);
        if (models.length > 0) {
          DYNAMIC_MODEL_CACHE[cacheKey] = { models, timestamp: Date.now() };
          return models;
        }
      }
    }
  } catch (err) {
    safeLogger.warn(`Dynamic model discovery failed for ${providerId}, falling back to static lists.`, err);
  }

  return STATIC_FALLBACK_MODELS[providerId] || ["default"];
}
