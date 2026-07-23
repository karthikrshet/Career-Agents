import { NextRequest, NextResponse } from "next/server";
import type { AIProviderConfig } from "@/types";

async function callAI(messages: any[], config: AIProviderConfig): Promise<string> {
  const ENDPOINTS: Record<string, string> = {
    groq: "https://api.groq.com/openai/v1/chat/completions",
    openai: "https://api.openai.com/v1/chat/completions",
    anthropic: "https://api.anthropic.com/v1/messages",
    gemini: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    openrouter: "https://openrouter.ai/api/v1/chat/completions",
    deepseek: "https://api.deepseek.com/chat/completions",
    ollama: "http://localhost:11434/v1/chat/completions",
    lmstudio: "http://localhost:1234/v1/chat/completions",
  };
  const url = config.baseUrl || ENDPOINTS[config.provider];
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (config.provider === "anthropic") {
    headers["x-api-key"] = config.apiKey || "";
    headers["anthropic-version"] = "2023-06-01";
  } else {
    headers["Authorization"] = `Bearer ${config.apiKey || ""}`;
  }
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ model: config.model, messages, temperature: 0.7, max_tokens: 512, stream: false }),
  });
  const json = await res.json();
  return json.choices?.[0]?.message?.content || "";
}

export async function POST(req: NextRequest) {
  try {
    const { headline, summary, config }: { headline: string; summary: string; config: AIProviderConfig } = await req.json();
    const messages = [
      {
        role: "system",
        content: `You are a Link2 profile optimization expert. Create an optimized Link2 headline using the pipe-separated format.
Rules:
- Maximum 220 characters
- Include primary title | Top skill | Secondary value prop
- Include relevant keywords for ATS
- Sound human, not robotic
Return ONLY the headline, no explanations or quotes.`,
      },
      {
        role: "user",
        content: `Current headline: "${headline}"\nAbout section: "${summary.slice(0, 500)}"`,
      },
    ];
    const rewrite = await callAI(messages, config);
    return NextResponse.json({ rewrite: rewrite.trim() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


