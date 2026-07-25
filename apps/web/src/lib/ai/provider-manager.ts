// apps/web/src/lib/ai/provider-manager.ts
import { AIMessage, AIProviderConfig } from "@/types";

export interface AIProvider {
  id: string;
  name: string;
  models: string[];
  supportsStreaming: boolean;
  supportsVision: boolean;
  supportsTools: boolean;
  supportsFiles: boolean;
  chat(messages: AIMessage[], config: AIProviderConfig): Promise<string>;
  stream(messages: AIMessage[], config: AIProviderConfig, onChunk: (chunk: string) => void): Promise<string>;
  health(config: AIProviderConfig): Promise<boolean>;
}

// Helper to resolve API keys from environment variables first, then fallback to user input
function getApiKey(provider: string, config: AIProviderConfig): string {
  const envKey = `${provider.toUpperCase()}_API_KEY`;
  const key = process.env[envKey] || config.apiKey || "";
  return key;
}

// ─── OpenAI Provider ────────────────────────────────────────────────────────
export class OpenAIProvider implements AIProvider {
  id = "openai";
  name = "OpenAI";
  models = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "o1-preview", "o1-mini"];
  supportsStreaming = true;
  supportsVision = true;
  supportsTools = true;
  supportsFiles = true;

  async chat(messages: AIMessage[], config: AIProviderConfig): Promise<string> {
    const key = getApiKey(this.id, config);
    if (!key) throw new Error("API key not configured");

    const url = config.baseUrl || "https://api.openai.com/v1/chat/completions";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: config.model || "gpt-4o-mini",
        messages,
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens || 4096,
        stream: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI Error: ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async stream(messages: AIMessage[], config: AIProviderConfig, onChunk: (chunk: string) => void): Promise<string> {
    const key = getApiKey(this.id, config);
    if (!key) throw new Error("API key not configured");

    const url = config.baseUrl || "https://api.openai.com/v1/chat/completions";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: config.model || "gpt-4o-mini",
        messages,
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens || 4096,
        stream: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI Stream Error: ${err}`);
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let full = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const dataStr = line.slice(6).trim();
          if (dataStr === "[DONE]") continue;

          try {
            const json = JSON.parse(dataStr);
            const content = json.choices?.[0]?.delta?.content || "";
            if (content) {
              full += content;
              onChunk(content);
            }
          } catch {}
        }
      }
    } finally {
      reader.releaseLock();
    }

    return full;
  }

  async health(config: AIProviderConfig): Promise<boolean> {
    try {
      const testMsg = [{ role: "user" as const, content: "Hello" }];
      const tempConfig = { ...config, model: "gpt-4o-mini", maxTokens: 5 };
      await this.chat(testMsg, tempConfig);
      return true;
    } catch {
      return false;
    }
  }
}

// ─── Claude / Anthropic Provider ────────────────────────────────────────────
export class ClaudeProvider implements AIProvider {
  id = "claude";
  name = "Anthropic Claude";
  models = ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307", "claude-3-opus-20240229"];
  supportsStreaming = true;
  supportsVision = true;
  supportsTools = true;
  supportsFiles = true;

  async chat(messages: AIMessage[], config: AIProviderConfig): Promise<string> {
    const key = getApiKey("anthropic", config);
    if (!key) throw new Error("API key not configured");

    const url = config.baseUrl || "https://api.anthropic.com/v1/messages";
    const system = messages.find((m) => m.role === "system")?.content;
    const userMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role, content: m.content }));

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.model || "claude-3-5-sonnet-20241022",
        system,
        messages: userMessages,
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens || 4096,
        stream: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Claude Error: ${err}`);
    }

    const data = await res.json();
    return data.content?.[0]?.text || "";
  }

  async stream(messages: AIMessage[], config: AIProviderConfig, onChunk: (chunk: string) => void): Promise<string> {
    const key = getApiKey("anthropic", config);
    if (!key) throw new Error("API key not configured");

    const url = config.baseUrl || "https://api.anthropic.com/v1/messages";
    const system = messages.find((m) => m.role === "system")?.content;
    const userMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role, content: m.content }));

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.model || "claude-3-5-sonnet-20241022",
        system,
        messages: userMessages,
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens || 4096,
        stream: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Claude Stream Error: ${err}`);
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let full = "";
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            const dataStr = trimmed.slice(6);
            try {
              const json = JSON.parse(dataStr);
              if (json.type === "content_block_delta" && json.delta?.text) {
                const text = json.delta.text;
                full += text;
                onChunk(text);
              }
            } catch {}
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return full;
  }

  async health(config: AIProviderConfig): Promise<boolean> {
    try {
      const testMsg = [{ role: "user" as const, content: "Hello" }];
      const tempConfig = { ...config, model: "claude-3-haiku-20240307", maxTokens: 5 };
      await this.chat(testMsg, tempConfig);
      return true;
    } catch {
      return false;
    }
  }
}

// ─── Gemini Provider ────────────────────────────────────────────────────────
export class GeminiProvider implements AIProvider {
  id = "gemini";
  name = "Google Gemini";
  models = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-pro"];
  supportsStreaming = true;
  supportsVision = true;
  supportsTools = true;
  supportsFiles = true;

  async chat(messages: AIMessage[], config: AIProviderConfig): Promise<string> {
    const key = getApiKey(this.id, config);
    if (!key) throw new Error("API key not configured");

    const url = config.baseUrl || "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: config.model || "gemini-1.5-flash",
        messages,
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens || 4096,
        stream: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini Error: ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async stream(messages: AIMessage[], config: AIProviderConfig, onChunk: (chunk: string) => void): Promise<string> {
    const key = getApiKey(this.id, config);
    if (!key) throw new Error("API key not configured");

    const url = config.baseUrl || "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: config.model || "gemini-1.5-flash",
        messages,
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens || 4096,
        stream: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini Stream Error: ${err}`);
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let full = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const dataStr = line.slice(6).trim();
          if (dataStr === "[DONE]") continue;

          try {
            const json = JSON.parse(dataStr);
            const content = json.choices?.[0]?.delta?.content || "";
            if (content) {
              full += content;
              onChunk(content);
            }
          } catch {}
        }
      }
    } finally {
      reader.releaseLock();
    }

    return full;
  }

  async health(config: AIProviderConfig): Promise<boolean> {
    try {
      const testMsg = [{ role: "user" as const, content: "Hello" }];
      const tempConfig = { ...config, model: "gemini-1.5-flash", maxTokens: 5 };
      await this.chat(testMsg, tempConfig);
      return true;
    } catch {
      return false;
    }
  }
}

// ─── Groq Provider ──────────────────────────────────────────────────────────
export class GroqProvider implements AIProvider {
  id = "groq";
  name = "Groq";
  models = ["llama-3.3-70b-versatile", "llama3-70b-8192", "mixtral-8x7b-32768", "gemma2-9b-it"];
  supportsStreaming = true;
  supportsVision = false;
  supportsTools = true;
  supportsFiles = false;

  async chat(messages: AIMessage[], config: AIProviderConfig): Promise<string> {
    const key = getApiKey(this.id, config);
    if (!key) throw new Error("API key not configured");

    const url = config.baseUrl || "https://api.groq.com/openai/v1/chat/completions";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: config.model || "llama3-70b-8192",
        messages,
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens || 4096,
        stream: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Groq Error: ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async stream(messages: AIMessage[], config: AIProviderConfig, onChunk: (chunk: string) => void): Promise<string> {
    const key = getApiKey(this.id, config);
    if (!key) throw new Error("API key not configured");

    const url = config.baseUrl || "https://api.groq.com/openai/v1/chat/completions";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: config.model || "llama3-70b-8192",
        messages,
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens || 4096,
        stream: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Groq Stream Error: ${err}`);
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let full = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const dataStr = line.slice(6).trim();
          if (dataStr === "[DONE]") continue;

          try {
            const json = JSON.parse(dataStr);
            const content = json.choices?.[0]?.delta?.content || "";
            if (content) {
              full += content;
              onChunk(content);
            }
          } catch {}
        }
      }
    } finally {
      reader.releaseLock();
    }

    return full;
  }

  async health(config: AIProviderConfig): Promise<boolean> {
    try {
      const testMsg = [{ role: "user" as const, content: "Hello" }];
      const tempConfig = { ...config, model: "llama3-8b-8192", maxTokens: 5 };
      await this.chat(testMsg, tempConfig);
      return true;
    } catch {
      return false;
    }
  }
}

// ─── OpenAI-Compatible Wrapper Class for generic providers ───────────────────
export class OpenCompatProvider implements AIProvider {
  constructor(
    public id: string,
    public name: string,
    public models: string[],
    private defaultEndpoint: string,
    public supportsVision = false,
    public supportsTools = true,
    public supportsFiles = false
  ) {}

  supportsStreaming = true;

  async chat(messages: AIMessage[], config: AIProviderConfig): Promise<string> {
    const key = getApiKey(this.id, config);
    if (!key && !this.defaultEndpoint.includes("localhost")) {
      throw new Error("API key not configured");
    }

    const url = config.baseUrl || this.defaultEndpoint;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (key) headers["Authorization"] = `Bearer ${key}`;

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens || 4096,
        stream: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`${this.name} Error: ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async stream(messages: AIMessage[], config: AIProviderConfig, onChunk: (chunk: string) => void): Promise<string> {
    const key = getApiKey(this.id, config);
    if (!key && !this.defaultEndpoint.includes("localhost")) {
      throw new Error("API key not configured");
    }

    const url = config.baseUrl || this.defaultEndpoint;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (key) headers["Authorization"] = `Bearer ${key}`;

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens || 4096,
        stream: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`${this.name} Stream Error: ${err}`);
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let full = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const dataStr = line.slice(6).trim();
          if (dataStr === "[DONE]") continue;

          try {
            const json = JSON.parse(dataStr);
            const content = json.choices?.[0]?.delta?.content || "";
            if (content) {
              full += content;
              onChunk(content);
            }
          } catch {}
        }
      }
    } finally {
      reader.releaseLock();
    }

    return full;
  }

  async health(config: AIProviderConfig): Promise<boolean> {
    try {
      const testMsg = [{ role: "user" as const, content: "Hello" }];
      const tempConfig = { ...config, maxTokens: 5 };
      await this.chat(testMsg, tempConfig);
      return true;
    } catch {
      return false;
    }
  }
}

// ─── Azure OpenAI Custom Provider Class ──────────────────────────────────────
export class AzureOpenAIProvider implements AIProvider {
  id = "azure";
  name = "Azure OpenAI";
  models = ["gpt-4-azure", "gpt-35-turbo-azure"];
  supportsStreaming = true;
  supportsVision = true;
  supportsTools = true;
  supportsFiles = true;

  async chat(messages: AIMessage[], config: AIProviderConfig): Promise<string> {
    const key = getApiKey(this.id, config);
    const endpoint = config.baseUrl || process.env.AZURE_OPENAI_ENDPOINT || "";
    if (!key || !endpoint) throw new Error("Azure OpenAI credentials (key/endpoint) not configured");

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": key,
      },
      body: JSON.stringify({
        messages,
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens || 4096,
        stream: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Azure OpenAI Error: ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async stream(messages: AIMessage[], config: AIProviderConfig, onChunk: (chunk: string) => void): Promise<string> {
    const key = getApiKey(this.id, config);
    const endpoint = config.baseUrl || process.env.AZURE_OPENAI_ENDPOINT || "";
    if (!key || !endpoint) throw new Error("Azure OpenAI credentials (key/endpoint) not configured");

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": key,
      },
      body: JSON.stringify({
        messages,
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens || 4096,
        stream: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Azure OpenAI Stream Error: ${err}`);
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let full = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const dataStr = line.slice(6).trim();
          if (dataStr === "[DONE]") continue;

          try {
            const json = JSON.parse(dataStr);
            const content = json.choices?.[0]?.delta?.content || "";
            if (content) {
              full += content;
              onChunk(content);
            }
          } catch {}
        }
      }
    } finally {
      reader.releaseLock();
    }

    return full;
  }

  async health(config: AIProviderConfig): Promise<boolean> {
    try {
      const testMsg = [{ role: "user" as const, content: "Hello" }];
      const tempConfig = { ...config, maxTokens: 5 };
      await this.chat(testMsg, tempConfig);
      return true;
    } catch {
      return false;
    }
  }
}

// ─── Provider Registry ───────────────────────────────────────────────────────
const PROVIDER_REGISTRY: Record<string, AIProvider> = {
  openai: new OpenAIProvider(),
  claude: new ClaudeProvider(),
  gemini: new GeminiProvider(),
  groq: new GroqProvider(),
  openrouter: new OpenCompatProvider("openrouter", "OpenRouter", ["meta-llama/llama-3.1-405b", "google/gemini-2.0-flash-exp", "anthropic/claude-3.5-sonnet"], "https://openrouter.ai/api/v1/chat/completions"),
  together: new OpenCompatProvider("together", "Together AI", ["meta-llama/Llama-3-70b-chat-hf", "mistralai/Mixtral-8x7B-Instruct-v0.1"], "https://api.together.xyz/v1/chat/completions"),
  deepseek: new OpenCompatProvider("deepseek", "DeepSeek", ["deepseek-chat", "deepseek-reasoner"], "https://api.deepseek.com/chat/completions"),
  cohere: new OpenCompatProvider("cohere", "Cohere", ["command-r-plus", "command-r"], "https://api.cohere.ai/v1/chat/completions"),
  mistral: new OpenCompatProvider("mistral", "Mistral AI", ["mistral-large-latest", "codestral-latest"], "https://api.mistral.ai/v1/chat/completions"),
  lmstudio: new OpenCompatProvider("lmstudio", "LM Studio", ["local-model"], "http://localhost:1234/v1/chat/completions"),
  ollama: new OpenCompatProvider("ollama", "Ollama (Local)", ["llama3.3", "mistral", "codellama", "deepseek-coder"], "http://localhost:11434/v1/chat/completions"),
  azure: new AzureOpenAIProvider(),
};

export function getProvider(id: string): AIProvider {
  // Support both "claude" and "anthropic" keys mapped to ClaudeProvider
  const mappedId = id === "anthropic" ? "claude" : id;
  const provider = PROVIDER_REGISTRY[mappedId];
  if (!provider) {
    throw new Error(`AI Provider '${id}' is not supported or registered.`);
  }
  return provider;
}

export function getAllProviders(): AIProvider[] {
  return Object.values(PROVIDER_REGISTRY);
}
