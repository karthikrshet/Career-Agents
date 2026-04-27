// packages/ai-router/types/index.ts

export type AIProviderId =
  | "openai"
  | "anthropic"
  | "claude"
  | "gemini"
  | "groq"
  | "openrouter"
  | "together"
  | "deepseek"
  | "mistral"
  | "cohere"
  | "azure"
  | "ollama"
  | "lmstudio"
  | "xai"
  | "fireworks"
  | "perplexity"
  | "ai21"
  | "openai-compat"
  | "custom";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export type AIErrorCode =
  | "AUTH_FAILED"
  | "MODEL_NOT_FOUND"
  | "RATE_LIMITED"
  | "QUOTA_EXCEEDED"
  | "CONTEXT_TOO_LONG"
  | "INVALID_INPUT"
  | "UNAVAILABLE"
  | "TIMEOUT"
  | "UNKNOWN";

export interface AIProviderError {
  code: AIErrorCode;
  provider: string;
  providerName: string;
  statusCode: number;
  retryable: boolean;
  retryAfterSeconds?: number;
  userMessage: string;
  userDetail: string;
  suggestions: string[];
}

export type RouterMode =
  | "auto"
  | "coding"
  | "reasoning"
  | "vision"
  | "fast"
  | "cheap"
  | "long-context"
  | "balanced"
  | "creative";

export interface ProviderCapabilities {
  supportsStreaming: boolean;
  supportsVision: boolean;
  supportsImages: boolean;
  supportsAudio: boolean;
  supportsToolCalling: boolean;
  supportsJSON: boolean;
  supportsReasoning: boolean;
  supportsLongContext: boolean;
  supportsEmbeddings: boolean;
  supportsFunctionCalling: boolean;
  supportsFiles: boolean;
  supportsPDF: boolean;
  supportsCode: boolean;
  supportsMarkdown: boolean;
  supportsMermaid: boolean;
  supportsArtifacts: boolean;
}

export interface ProviderRegistryEntry {
  id: AIProviderId;
  displayName: string;
  logo: string;
  website: string;
  documentation: string;
  pricingUrl: string;
  capabilities: ProviderCapabilities;
  maxContext: number; // in tokens
  pricing: {
    inputPerMillion: number; // in USD
    outputPerMillion: number; // in USD
  };
  apiEndpoint: string;
  authType: "apiKey" | "bearer" | "custom" | "none";
}

export interface HealthCheckReport {
  timestamp: string;
  healthy: boolean;
  status: "connected" | "offline" | "missing_key" | "invalid_key" | "quota_exceeded" | "rate_limited" | "auth_failed" | "model_not_found" | "healthy" | "limited" | "exceeded" | "unavailable" | string;
  latencyMs?: number;
  error?: string;
  apiVersion?: string;
  sdkVersion?: string;
  response?: string;
  tokenUsage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  providerVersion?: string;
  checkedSteps: {
    step: string;
    passed: boolean;
    error?: string;
  }[];
}

export interface UsageAnalytics {
  requestsToday: number;
  requestsWeekly: number;
  requestsMonthly: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUSD: number;
  averageLatencyMs: number;
  successRatePercent: number;
  errorCounts: Record<AIErrorCode, number>;
}

export interface RouterLog {
  id: string;
  timestamp: string;
  query: string;
  mode: RouterMode;
  executionChain: {
    provider: AIProviderId;
    model: string;
    status: "success" | "failed";
    latencyMs: number;
    error?: string;
  }[];
  finalProvider: AIProviderId;
  finalModel: string;
  inputTokens: number;
  outputTokens: number;
  costUSD: number;
  durationMs: number;
  status: "completed" | "failed";
}
