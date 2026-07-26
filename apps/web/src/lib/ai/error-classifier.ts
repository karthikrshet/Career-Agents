// src/lib/ai/error-classifier.ts
// Parses raw provider HTTP errors into clean, user-facing AIProviderError objects.
// NEVER exposes raw JSON, API URLs, stack traces, or provider internals to the client.

import type { AIErrorCode, AIProviderError } from "@/types";

// Provider display names
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
};

// Parse Retry-After seconds from various formats
function parseRetryAfter(raw?: string | null): number | undefined {
  if (!raw) return undefined;
  // "52s" or "52" or ISO timestamp
  const seconds = parseInt(raw.replace(/s$/i, ""), 10);
  if (!isNaN(seconds) && seconds > 0) return Math.min(seconds, 300); // cap at 5 min
  return undefined;
}

// Try to extract retryDelay from Google's retryInfo structure
function extractGeminiRetryDelay(body: string): number | undefined {
  try {
    const obj = JSON.parse(body);
    const details = obj?.error?.details || [];
    for (const d of details) {
      if (d["@type"]?.includes("RetryInfo") && d.retryDelay) {
        return parseRetryAfter(d.retryDelay);
      }
    }
  } catch {}
  return undefined;
}

// Core classification function — call this inside every provider's error handler
export function classifyProviderError(
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

  // ─── Detect error code from status + body ───────────────────────────────

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
    // Differentiate quota exhaustion vs rate limit
    if (
      bodyLower.includes("quota") ||
      bodyLower.includes("resource_exhausted") ||
      bodyLower.includes("exceeded") ||
      bodyLower.includes("free tier") ||
      bodyLower.includes("billing")
    ) {
      code = "QUOTA_EXCEEDED";
      retryable = false; // quota resets next day, not retryable immediately
      retryAfterSeconds = extractGeminiRetryDelay(body) ?? parseRetryAfter(retryAfterHeader) ?? 60;
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

  // ─── Build user-facing message ───────────────────────────────────────────
  const messages = buildUserMessages(code, providerName, retryAfterSeconds);

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

function buildUserMessages(
  code: AIErrorCode,
  providerName: string,
  retryAfterSeconds?: number
): { title: string; detail: string; suggestions: string[] } {
  switch (code) {
    case "QUOTA_EXCEEDED":
      return {
        title: `${providerName} quota exceeded`,
        detail: `${providerName} has reached its daily API quota. This is a provider-side limitation, not an application error.`,
        suggestions: [
          retryAfterSeconds
            ? `Quota may reset in ~${Math.ceil(retryAfterSeconds / 3600)} hours`
            : "Wait until the quota resets (usually midnight UTC)",
          "Switch to another AI provider in Settings",
          `Upgrade your ${providerName} billing plan`,
          "Use a different API key",
          "Try Groq — it has a generous free tier",
        ],
      };

    case "AUTH_FAILED":
      return {
        title: `${providerName} authentication failed`,
        detail: `The API key for ${providerName} is invalid, expired, or missing. Verify it in Settings.`,
        suggestions: [
          `Double-check your ${providerName} API key in Settings`,
          "Make sure the key has the correct permissions",
          "Generate a new API key from the provider dashboard",
          "Ensure the key is saved (not just typed)",
        ],
      };

    case "RATE_LIMITED":
      return {
        title: `${providerName} rate limit reached`,
        detail: `You're sending requests too quickly. ${providerName} has temporarily paused responses.`,
        suggestions: [
          retryAfterSeconds ? `Auto-retry in ${retryAfterSeconds} seconds` : "Wait a few seconds and try again",
          "Reduce the frequency of requests",
          "Upgrade your API plan for higher rate limits",
          "Switch to another provider temporarily",
        ],
      };

    case "MODEL_NOT_FOUND":
      return {
        title: `Model not found`,
        detail: `The selected model is not available on ${providerName}. It may have been renamed or deprecated.`,
        suggestions: [
          "Switch to a different model in Settings",
          `Check ${providerName}'s documentation for available models`,
          "Use the provider's default model",
        ],
      };

    case "TIMEOUT":
      return {
        title: `${providerName} request timed out`,
        detail: `The request to ${providerName} took too long. This is usually a temporary issue.`,
        suggestions: [
          "Try again — timeouts are usually temporary",
          "Switch to a faster provider like Groq",
          "Use a smaller model for quicker responses",
          "Check your network connection",
        ],
      };

    case "CONTEXT_TOO_LONG":
      return {
        title: `Message too long`,
        detail: `The conversation is too long for the selected model's context window.`,
        suggestions: [
          "Start a new conversation",
          "Switch to a model with a larger context window (e.g. Gemini 1.5 Pro, Claude)",
          "Summarize the conversation and continue",
        ],
      };

    case "INVALID_INPUT":
      return {
        title: `Invalid request to ${providerName}`,
        detail: `${providerName} rejected the request due to an invalid parameter or content policy.`,
        suggestions: [
          "Try rephrasing your message",
          "Check the model and temperature settings",
          "Switch to a different provider",
        ],
      };

    case "UNAVAILABLE":
      return {
        title: `${providerName} is currently unavailable`,
        detail: `${providerName}'s servers are temporarily unreachable. This is usually resolved within minutes.`,
        suggestions: [
          "Try again in a moment",
          "Switch to another provider while this one recovers",
          "Check the provider's status page",
          "Use a local model (Ollama, LM Studio) as a fallback",
        ],
      };

    default:
      return {
        title: `AI provider error`,
        detail: `An unexpected error occurred with ${providerName}. Please try again or switch providers.`,
        suggestions: [
          "Try sending the message again",
          "Switch to another AI provider in Settings",
          "Check your network connection",
        ],
      };
  }
}

// Convenience — build a friendly error for "no API key" cases
export function missingKeyError(provider: string): AIProviderError {
  const providerName = PROVIDER_NAMES[provider] || provider;
  return {
    code: "AUTH_FAILED",
    provider,
    providerName,
    statusCode: 0,
    retryable: false,
    userMessage: `${providerName} API key not configured`,
    userDetail: `No API key is set for ${providerName}. Add your key in Settings → AI Provider.`,
    suggestions: [
      `Get a free API key from ${providerName}`,
      "Add the key in Settings → AI Provider",
      "Or use a local provider like Ollama (no key required)",
    ],
  };
}

// Convenience — build a "no providers available" error
export function noProvidersError(): AIProviderError {
  return {
    code: "UNAVAILABLE",
    provider: "none",
    providerName: "All Providers",
    statusCode: 503,
    retryable: false,
    userMessage: "No AI providers available",
    userDetail:
      "All configured AI providers have failed or have no API keys set. Add at least one provider in Settings.",
    suggestions: [
      "Add an API key in Settings → AI Provider",
      "Install Ollama for offline AI (no key required)",
      "Try Groq — it offers a free API tier",
    ],
  };
}
