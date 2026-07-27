// AI Provider Abstraction Layer
// Supports: Groq, OpenAI, Anthropic, Gemini, OpenRouter, Ollama, LM Studio, DeepSeek, Azure

import type { AIProviderConfig, AIProvider } from "@/types";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AICompletionOptions {
  messages: AIMessage[];
  config: AIProviderConfig;
  signal?: AbortSignal;
  onChunk?: (chunk: string) => void;
}

// ─── Provider Endpoint Registry ───────────────────────────────────────────
const PROVIDER_ENDPOINTS: Record<AIProvider, string> = {
  groq:       "https://api.groq.com/openai/v1/chat/completions",
  openai:     "https://api.openai.com/v1/chat/completions",
  anthropic:  "https://api.anthropic.com/v1/messages",
  claude:     "https://api.anthropic.com/v1/messages",
  gemini:     "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
  deepseek:   "https://api.deepseek.com/chat/completions",
  ollama:     "http://localhost:11434/v1/chat/completions",
  lmstudio:   "http://localhost:1234/v1/chat/completions",
  azure:      "", // dynamic via baseUrl
  together:   "https://api.together.xyz/v1/chat/completions",
  mistral:    "https://api.mistral.ai/v1/chat/completions",
  cohere:     "https://api.cohere.ai/v1/chat/completions",
  xai:        "https://api.x.ai/v1/chat/completions",
};

export const PROVIDER_MODELS: Record<AIProvider, string[]> = {
  groq:       ["llama-3.3-70b-versatile", "llama3-70b-8192", "mixtral-8x7b-32768", "gemma2-9b-it"],
  openai:     ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "o1-preview", "o1-mini"],
  anthropic:  ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307", "claude-3-opus-20240229"],
  claude:     ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307", "claude-3-opus-20240229"],
  gemini:     ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-pro"],
  openrouter: ["meta-llama/llama-3.1-405b", "google/gemini-2.0-flash-exp", "anthropic/claude-3.5-sonnet"],
  deepseek:   ["deepseek-chat", "deepseek-reasoner"],
  ollama:     ["llama3.3", "mistral", "codellama", "deepseek-coder"],
  lmstudio:   ["local-model"],
  azure:      ["gpt-4-azure", "gpt-35-turbo-azure"],
  together:   ["meta-llama/Llama-3-70b-chat-hf", "mistralai/Mixtral-8x7B-Instruct-v0.1"],
  mistral:    ["mistral-large-latest", "codestral-latest"],
  cohere:     ["command-r-plus", "command-r"],
  xai:        ["grok-2", "grok-beta"],
};

// ─── OpenAI-compatible completion ─────────────────────────────────────────
async function openAICompat(opts: AICompletionOptions): Promise<string> {
  const { messages, config, signal, onChunk } = opts;
  const url = config.baseUrl || PROVIDER_ENDPOINTS[config.provider];

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (config.provider === "anthropic") {
    headers["x-api-key"] = config.apiKey || "";
    headers["anthropic-version"] = "2023-06-01";
  } else {
    headers["Authorization"] = `Bearer ${config.apiKey || ""}`;
  }

  const body: Record<string, unknown> = {
    model: config.model,
    messages,
    temperature: config.temperature,
    max_tokens: config.maxTokens,
    stream: !!onChunk && config.streaming,
  };

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI provider error (${res.status}): ${err.slice(0, 200)}`);
  }

  if (onChunk && config.streaming) {
    // SSE streaming
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let full = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
      for (const line of lines) {
        const data = line.slice(6);
        if (data === "[DONE]") continue;
        try {
          const json = JSON.parse(data);
          const delta = json.choices?.[0]?.delta?.content || "";
          if (delta) {
            full += delta;
            onChunk(delta);
          }
        } catch {
          // skip malformed chunks
        }
      }
    }
    return full;
  } else {
    const json = await res.json();
    return json.choices?.[0]?.message?.content || "";
  }
}

// ─── Public API ───────────────────────────────────────────────────────────
export async function complete(opts: AICompletionOptions): Promise<string> {
  return openAICompat(opts);
}

export async function streamComplete(
  messages: AIMessage[],
  config: AIProviderConfig,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  return openAICompat({ messages, config, signal, onChunk });
}

export function buildCareerContext(profile: any, metrics: any): string {
  return `You are Career Copilot, an advanced AI assistant embedded inside Career Agents.

User Profile:
- Name: ${profile?.name || "Unknown"}
- Target Role: ${profile?.targetRole || "Not specified"}
- Target Company: ${profile?.targetCompany || "Not specified"}

Career Metrics:
- Overall Career Score: ${metrics?.careerScore || 0}/100
- Resume Score: ${metrics?.resumeScore || 0}/100
- GitBranch Score: ${metrics?.githubScore || 0}/100
- Link2 Score: ${metrics?.linkedinScore || 0}/100
- Interview Score: ${metrics?.interviewScore || 0}/100

Your role is to give specific, actionable career advice. Use the user's actual scores to provide context-aware guidance.
Be concise, professional, and direct. Use markdown formatting for readability.`;
}


