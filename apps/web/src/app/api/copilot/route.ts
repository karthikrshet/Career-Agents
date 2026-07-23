import { NextRequest, NextResponse } from "next/server";
import type { AIProviderConfig } from "@/types";

const PROVIDER_ENDPOINTS: Record<string, string> = {
  groq:       "https://api.groq.com/openai/v1/chat/completions",
  openai:     "https://api.openai.com/v1/chat/completions",
  anthropic:  "https://api.anthropic.com/v1/messages",
  gemini:     "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
  deepseek:   "https://api.deepseek.com/chat/completions",
  ollama:     "http://localhost:11434/v1/chat/completions",
  lmstudio:   "http://localhost:1234/v1/chat/completions",
};

export async function POST(req: NextRequest) {
  const { messages, config }: { messages: any[]; config: AIProviderConfig } = await req.json();

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

  const upstream = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens || 4096,
      stream: true,
    }),
  });

  if (!upstream.ok) {
    const err = await upstream.text();
    return NextResponse.json({ error: err }, { status: upstream.status });
  }

  // Proxy the SSE stream back to client
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
            controller.close();
            break;
          }
          controller.enqueue(value);
        }
      } catch {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}


