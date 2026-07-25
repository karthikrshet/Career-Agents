// packages/ai/claude.ts
import { AIProviderBase, AICompletionOptions, AIProviderName } from "./provider";

export class ClaudeProvider extends AIProviderBase {
  name: AIProviderName = "claude";

  async generate(options: AICompletionOptions): Promise<string> {
    const { messages, config, signal, onChunk } = options;
    const url = config.baseUrl || "https://api.anthropic.com/v1/messages";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey || "",
      "anthropic-version": "2023-06-01",
    };

    // Extract system message for Anthropic API
    const system = messages.find((m) => m.role === "system")?.content;
    const userMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    const body = {
      model: config.model,
      system,
      messages: userMessages,
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
      throw new Error(`Claude error (${res.status}): ${err.slice(0, 250)}`);
    }

    if (onChunk && config.streaming) {
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      try {
        let buffer = "";
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
                  fullText += text;
                  onChunk(text);
                }
              } catch {
                // Ignore parsing errors for non-JSON lines or incomplete data
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return fullText;
    } else {
      const json = await res.json();
      return json.content?.[0]?.text || "";
    }
  }
}
