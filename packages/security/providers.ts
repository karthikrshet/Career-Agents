// packages/security/providers.ts

export const PROVIDER_DOMAINS: Record<string, string[]> = {
  openai: ["api.openai.com"],
  anthropic: ["api.anthropic.com"],
  claude: ["api.anthropic.com"],
  gemini: ["generativelanguage.googleapis.com"],
  groq: ["api.groq.com"],
  openrouter: ["openrouter.ai"],
  deepseek: ["api.deepseek.com"],
  together: ["api.together.xyz"],
  mistral: ["api.mistral.ai"],
  cohere: ["api.cohere.ai"],
  github: ["api.github.com"],
  fireworks: ["api.fireworks.ai"],
  perplexity: ["api.perplexity.ai"],
  xai: ["api.x.ai"],
  ai21: ["api.ai21.com"],
  piston: ["emkc.org"],
};

export const PROVIDER_ENDPOINTS = {
  openai: "https://api.openai.com/v1/chat/completions",
  anthropic: "https://api.anthropic.com/v1/messages",
  claude: "https://api.anthropic.com/v1/messages",
  gemini: "https://generativelanguage.googleapis.com/v1beta",
  groq: "https://api.groq.com/openai/v1/chat/completions",
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
  deepseek: "https://api.deepseek.com/chat/completions",
  together: "https://api.together.xyz/v1/chat/completions",
  mistral: "https://api.mistral.ai/v1/chat/completions",
  cohere: "https://api.cohere.ai/v1/chat/completions",
  ollama: "http://localhost:11434/v1/chat/completions",
  lmstudio: "http://localhost:1234/v1/chat/completions",
  fireworks: "https://api.fireworks.ai/inference/v1/chat/completions",
  perplexity: "https://api.perplexity.ai/chat/completions",
  xai: "https://api.x.ai/v1/chat/completions",
  ai21: "https://api.ai21.com/studio/v1/chat/completions",
};

export function validateProviderHost(hostname: string, provider: string): boolean {
  const normalizedProvider = provider.toLowerCase();
  
  if (normalizedProvider === "azure") {
    // Matches resource.openai.azure.com
    return hostname.endsWith(".openai.azure.com");
  }
  
  if (normalizedProvider === "ollama" || normalizedProvider === "lmstudio") {
    // Only allow local access
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  }

  if (normalizedProvider === "openai-compat" || normalizedProvider === "custom") {
    // We allow any public host since SSRF rebinding check resolves host and checks for private IP subnets
    return true;
  }
  
  const allowed = PROVIDER_DOMAINS[normalizedProvider];
  if (!allowed) {
    return false;
  }
  
  return allowed.includes(hostname);
}
