// packages/ai/router.ts
import { AIProviderBase, AICompletionOptions, AIProviderName } from "./provider";
import { OpenAIProvider } from "./openai";
import { ClaudeProvider } from "./claude";
import { GeminiProvider } from "./gemini";
import { GroqProvider } from "./groq";
import { OpenRouterProvider } from "./openrouter";
import { OllamaProvider } from "./ollama";
import { AzureProvider } from "./azure";

const PROVIDER_REGISTRY: Record<AIProviderName, new () => AIProviderBase> = {
  openai: OpenAIProvider,
  claude: ClaudeProvider,
  anthropic: ClaudeProvider,
  gemini: GeminiProvider,
  groq: GroqProvider,
  openrouter: OpenRouterProvider,
  ollama: OllamaProvider,
  azure: AzureProvider,
  // Standard OpenAI-compatible providers share the OpenAIProvider class with specific default base URLs
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

export async function generate(options: AICompletionOptions): Promise<string> {
  const providerName = options.config.provider;
  const ProviderClass = PROVIDER_REGISTRY[providerName];

  if (!ProviderClass) {
    throw new Error(`AI Provider '${providerName}' is not registered or supported.`);
  }

  const provider = new ProviderClass();

  // If this is an OpenAI-compatible provider and no baseUrl is specified, inject the default endpoint
  const config = { ...options.config };
  if (!config.baseUrl && DEFAULT_ENDPOINTS[providerName]) {
    config.baseUrl = DEFAULT_ENDPOINTS[providerName];
  }

  return provider.generate({
    ...options,
    config,
  });
}
