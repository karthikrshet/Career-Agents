// packages/ai-router/utils/error-handler.ts
import { AIProviderError, AIErrorCode } from "../types";

const PROVIDER_NAMES: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic Claude",
  claude: "Anthropic Claude",
  gemini: "Google Gemini",
  groq: "Groq",
  openrouter: "OpenRouter",
  together: "Together AI",
  deepseek: "DeepSeek",
  mistral: "Mistral AI",
  cohere: "Cohere",
  xai: "xAI Grok",
  azure: "Azure OpenAI",
  ollama: "Ollama (Local)",
  lmstudio: "LM Studio (Local)",
  fireworks: "Fireworks AI",
  perplexity: "Perplexity",
  ai21: "AI21 Labs",
};

export function parseRetryAfter(raw?: string | null): number | undefined {
  if (!raw) return undefined;
  const seconds = parseInt(raw.replace(/s$/i, ""), 10);
  if (!isNaN(seconds) && seconds > 0) return Math.min(seconds, 300);
  return undefined;
}

export function classifyGatewayError(
  provider: string,
  statusCode: number,
  rawBody: string,
  retryAfterHeader?: string | null
): AIProviderError {
  const providerName = PROVIDER_NAMES[provider] || provider;
  const body = rawBody || "";
  const bodyLower = body.toLowerCase();

  let code: AIErrorCode = "UNKNOWN";
  let retryable = false;
  let retryAfterSeconds: number | undefined;

  if (statusCode === 401 || statusCode === 403) {
    code = "AUTH_FAILED";
    retryable = false;
  } else if (statusCode === 404) {
    code = "MODEL_NOT_FOUND";
    retryable = false;
  } else if (statusCode === 408 || statusCode === 504) {
    code = "TIMEOUT";
    retryable = true;
  } else if (statusCode === 422) {
    code = "INVALID_INPUT";
    retryable = false;
  } else if (statusCode === 429) {
    if (
      bodyLower.includes("quota") ||
      bodyLower.includes("resource_exhausted") ||
      bodyLower.includes("exceeded") ||
      bodyLower.includes("free tier") ||
      bodyLower.includes("billing")
    ) {
      code = "QUOTA_EXCEEDED";
      retryable = false;
      retryAfterSeconds = parseRetryAfter(retryAfterHeader) ?? 60;
    } else {
      code = "RATE_LIMITED";
      retryable = true;
      retryAfterSeconds = parseRetryAfter(retryAfterHeader) ?? 10;
    }
  } else if (statusCode === 500 || statusCode === 502 || statusCode === 503) {
    code = "UNAVAILABLE";
    retryable = true;
    retryAfterSeconds = parseRetryAfter(retryAfterHeader) ?? 5;
  } else if (statusCode === 400) {
    if (bodyLower.includes("context") || bodyLower.includes("too long") || bodyLower.includes("token")) {
      code = "CONTEXT_TOO_LONG";
      retryable = false;
    } else {
      code = "INVALID_INPUT";
      retryable = false;
    }
  } else if (statusCode === 0 || bodyLower.includes("network") || bodyLower.includes("econnrefused")) {
    code = "UNAVAILABLE";
    retryable = true;
    retryAfterSeconds = 3;
  }

  const messages = buildErrorDetail(code, providerName, retryAfterSeconds);

  return {
    code,
    provider,
    providerName,
    statusCode,
    retryable,
    retryAfterSeconds,
    userMessage: messages.title,
    userDetail: messages.detail,
    suggestions: messages.suggestions,
  };
}

function buildErrorDetail(
  code: AIErrorCode,
  providerName: string,
  retryAfterSeconds?: number
): { title: string; detail: string; suggestions: string[] } {
  switch (code) {
    case "QUOTA_EXCEEDED":
      return {
        title: `${providerName} quota exceeded`,
        detail: `The API key for ${providerName} has exhausted its available free tier or subscription quota limit.`,
        suggestions: [
          retryAfterSeconds
            ? `Retry after ~${retryAfterSeconds} seconds`
            : "Wait until your provider quota resets (usually at midnight UTC)",
          "Switch to another active provider under Settings",
          "Add or rotate a backup key under settings config",
        ],
      };
    case "AUTH_FAILED":
      return {
        title: `${providerName} authentication failed`,
        detail: `The API key provided for ${providerName} is invalid, expired, or deactivated.`,
        suggestions: [
          "Double-check the API key copy-pasted in settings panel",
          "Ensure the key is active in your provider developers console",
        ],
      };
    case "RATE_LIMITED":
      return {
        title: `${providerName} rate limit reached`,
        detail: `You are sending request prompt sequences too quickly. ${providerName} has temporarily throttled actions.`,
        suggestions: [
          `Auto-retry will attempt again in ${retryAfterSeconds || 5} seconds`,
          "Limit quick consecutive queries in chat windows",
        ],
      };
    case "MODEL_NOT_FOUND":
      return {
        title: "Selected model unavailable",
        detail: `The requested model could not be loaded or mapped for ${providerName}.`,
        suggestions: [
          "Choose a default fallback model under settings configurations",
          "Run model discovery lookup to get the list of active models",
        ],
      };
    case "CONTEXT_TOO_LONG":
      return {
        title: "Prompt context size limit exceeded",
        detail: `The compiled agent workspace templates and chat histories exceed the target model context size.`,
        suggestions: [
          "Toggle active plugins or clean up past chat folders",
          "Switch to a large-context model like Gemini 2.5",
        ],
      };
    case "UNAVAILABLE":
      return {
        title: `${providerName} service unavailable`,
        detail: `Failed to establish connection handshake to the ${providerName} endpoint servers.`,
        suggestions: [
          "Confirm your local network connection is active",
          "If self-hosted local (Ollama/LM Studio), make sure the local server process is running",
        ],
      };
    default:
      return {
        title: "AI provider service error",
        detail: "An unexpected error occurred while routing prompts to the AI provider backend.",
        suggestions: [
          "Try resending the query in a few seconds",
          "Check active provider status indicators",
        ],
      };
  }
}
