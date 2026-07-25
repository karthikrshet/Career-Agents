// packages/ai/ollama.ts
import { AIProviderBase, AICompletionOptions, AIProviderName } from "./provider";

export class OllamaProvider extends AIProviderBase {
  name: AIProviderName = "ollama";

  async generate(options: AICompletionOptions): Promise<string> {
    const { messages, config, signal, onChunk } = options;
    const url = config.baseUrl || "http://localhost:11434/v1/chat/completions";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (config.apiKey) {
      headers["Authorization"] = `Bearer ${config.apiKey}`;
    }

    const body = {
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens || 4096,
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
      throw new Error(`Ollama error (${res.status}): ${err.slice(0, 250)}`);
    }

    if (onChunk && config.streaming) {
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;

            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content || "";
              if (content) {
                fullText += content;
                onChunk(content);
              }
            } catch {
              // Ignore invalid JSON chunks
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return fullText;
    } else {
      const json = await res.json();
      return json.choices?.[0]?.message?.content || "";
    }
  }
}
