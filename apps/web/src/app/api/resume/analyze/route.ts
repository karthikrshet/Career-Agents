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

async function callAI(messages: any[], config: AIProviderConfig): Promise<string> {
  const url = config.baseUrl || PROVIDER_ENDPOINTS[config.provider];
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
    body: JSON.stringify({ model: config.model, messages, temperature: config.temperature, max_tokens: 2048, stream: false }),
  });
  const json = await res.json();
  return json.choices?.[0]?.message?.content || "";
}

export async function POST(req: NextRequest) {
  try {
    const { text, config }: { text: string; config: AIProviderConfig } = await req.json();
    const messages = [
      {
        role: "system",
        content: `You are a professional resume writing expert. You will be given a resume and must rewrite it in a professional, achievement-focused style.
Rules:
- Start every bullet with a strong action verb
- Include quantified results wherever possible (%, time saved, users impacted)
- Use XYZ format: Accomplished [X] as measured by [Y] by doing [Z]
- Remove passive language (was responsible for, helped, assisted)
- Keep it concise and ATS-friendly
Return only the improved resume text, no explanations.`,
      },
      {
        role: "user",
        content: `Rewrite this resume:\n\n${text}`,
      },
    ];

    const rewrite = await callAI(messages, config);
    return NextResponse.json({ rewrite });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


