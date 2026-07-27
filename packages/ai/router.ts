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
  let provider: AIProviderBase;

  switch (providerName) {
    case "openai":
    case "deepseek":
    case "together":
    case "mistral":
    case "cohere":
    case "xai":
    case "lmstudio":
      provider = new OpenAIProvider();
      break;
    case "claude":
    case "anthropic":
      provider = new ClaudeProvider();
      break;
    case "gemini":
      provider = new GeminiProvider();
      break;
    case "groq":
      provider = new GroqProvider();
      break;
    case "openrouter":
      provider = new OpenRouterProvider();
      break;
    case "ollama":
      provider = new OllamaProvider();
      break;
    case "azure":
      provider = new AzureProvider();
      break;
    default:
      throw new Error(`AI Provider '${providerName}' is not registered or supported.`);
  }

  const config = { ...options.config };
  if (!config.baseUrl && DEFAULT_ENDPOINTS[providerName]) {
    config.baseUrl = DEFAULT_ENDPOINTS[providerName];
  }

  return provider.generate({
    ...options,
    config,
  });
}
