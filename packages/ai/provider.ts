// packages/ai/provider.ts
// Standard interfaces and base class for all AI provider adapters

export type AIProviderName =
  | "openai"
  | "anthropic"
  | "claude"
  | "gemini"
  | "groq"
  | "openrouter"
  | "ollama"
  | "azure"
  | "together"
  | "mistral"
  | "cohere"
  | "xai"
  | "deepseek"
  | "lmstudio";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIProviderConfig {
  provider: AIProviderName;
  apiKey?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  baseUrl?: string;
  streaming: boolean;
}

export interface AICompletionOptions {
  messages: AIMessage[];
  config: AIProviderConfig;
  signal?: AbortSignal;
  onChunk?: (chunk: string) => void;
}

export abstract class AIProviderBase {
  abstract name: AIProviderName;
  abstract generate(options: AICompletionOptions): Promise<string>;
}
