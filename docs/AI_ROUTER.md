# Career Agents — AI Router Architecture

This document details the unified AI Router architecture of Career Agents. It explains how standard OpenAI-compatible endpoints are integrated, model selections, fallback mechanisms, latency tracking, and error categorization.

---

## Architecture Overview

Career Agents supports 14 AI backends through two complementary routing subsystems:

1. **Client-side direct streaming (`apps/web/src/lib/ai.ts`)**:
   Used by the Career Copilot window to stream tokens instantly into the UI. It sends API requests directly from the user's browser, authenticating with the client's API keys saved in `localStorage`.

2. **Server-side package router (`packages/ai/`)**:
   A modular npm package structure located at `packages/ai/` and utilized by server-side routes like `/api/resume/analyze`, `/api/interview`, `/api/linkedin/analyze`, and `/api/reports/generate`.

---

## Package Router Structure

The `packages/ai/` directory contains:

- `provider.ts`: Defines the abstract base class `AIProviderBase` and completion parameter structures.
- `router.ts`: Manages provider class registry and registers aliases for standard OpenAI-compatible endpoints.
- `openai.ts`, `claude.ts`, `gemini.ts`, `groq.ts`, `openrouter.ts`, `ollama.ts`, `azure.ts`: Individual provider adapter implementations.

---

## OpenAI-Compatible Providers

To minimize boilerplate, OpenAI-compatible APIs (like DeepSeek, Mistral, Cohere, together, xAI, LM Studio) share the core `OpenAIProvider` class. They are registered under their provider name in `packages/ai/router.ts` and default endpoints are injected automatically if no base URL is defined:

```typescript
// packages/ai/router.ts
const PROVIDER_REGISTRY: Record<AIProviderName, new () => AIProviderBase> = {
  openai: OpenAIProvider,
  claude: ClaudeProvider,
  anthropic: ClaudeProvider,
  gemini: GeminiProvider,
  groq: GroqProvider,
  openrouter: OpenRouterProvider,
  ollama: OllamaProvider,
  azure: AzureProvider,
  deepseek: OpenAIProvider,
  together: OpenAIProvider,
  mistral: OpenAIProvider,
  cohere: OpenAIProvider,
  xai: OpenAIProvider,
  lmstudio: OpenAIProvider,
};

const DEFAULT_ENDPOINTS: Partial<Record<AIProviderName, string>> = {
  deepseek: "https://api.deepseek.com/chat/completions",
  together: "https://api.together.xyz/v1/chat/completions",
  mistral: "https://api.mistral.ai/v1/chat/completions",
  cohere: "https://api.cohere.ai/v1/chat/completions",
  xai: "https://api.x.ai/v1/chat/completions",
  lmstudio: "http://localhost:1234/v1/chat/completions",
};
```

---

## Configuration & Priority Rules

When a request requires AI execution, the configuration parameters are resolved with the following priority hierarchy:

1. **User Key Injection:** The route checks if an `aiConfig` or `config` parameter is provided in the request body (originating from settings in the user's browser). If a key exists, it is prioritized.
2. **Environment Variable Fallback:** If the client key is absent, the router checks server-side environment variables (`GROQ_API_KEY`, `OPENAI_API_KEY`, etc.).
3. **No Auth Fallback (Local Development):** Local tools (Ollama, LM Studio) operate without keys and bypass authentication checks.

---

## Error Classification & Latency Tracking

The app classifies AI API errors into a standard schema in `apps/web/src/lib/ai/error-classifier.ts`. This allows the UI to render user-friendly banners and suggested next actions (such as switching providers or rotating keys):

```typescript
export interface ClassifiedAIError {
  code: number;
  message: string;
  classification: 'unauthorized' | 'rate_limit' | 'quota_exceeded' | 'unavailable' | 'unknown';
  actions: ('retry' | 'switch_provider' | 'check_key')[];
}

export function classifyAIError(error: any): ClassifiedAIError {
  const status = error.status || error.statusCode || 500;
  const msg = error.message || "";
  
  if (status === 401 || msg.includes("invalid api key") || msg.includes("unauthorized")) {
    return {
      code: 401,
      message: "Authentication failed. Please verify your API key in Settings.",
      classification: 'unauthorized',
      actions: ['check_key', 'switch_provider']
    };
  }
  
  if (status === 429 || msg.includes("rate limit") || msg.includes("too many requests")) {
    return {
      code: 429,
      message: "Rate limit exceeded. Switch providers or try again in a moment.",
      classification: 'rate_limit',
      actions: ['retry', 'switch_provider']
    };
  }
  
  if (status === 403 || msg.includes("quota exceeded") || msg.includes("insufficient_quota")) {
    return {
      code: 403,
      message: "Insufficient quota or credits on this API account.",
      classification: 'quota_exceeded',
      actions: ['check_key', 'switch_provider']
    };
  }
  
  return {
    code: status,
    message: msg || "An unexpected error occurred contacting the AI provider.",
    classification: 'unknown',
    actions: ['retry']
  };
}
```

Latency measurements are performed by wrapping completion executions:
```typescript
const start = Date.now();
const response = await provider.generate(options);
const latencyMs = Date.now() - start;
```
Latency metrics are returned to clients via response payloads and can be inspected in the developer console.
