// apps/web/src/app/api/linkedin/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { AIProviderConfig } from "@/types";
import { generate } from "packages/ai/router";

export async function POST(req: NextRequest) {
  try {
    const { headline, summary, config }: { headline: string; summary: string; config: AIProviderConfig } = await req.json();
    const messages = [
      {
        role: "system" as const,
        content: `You are a LinkedIn profile optimization expert. Create an optimized LinkedIn headline using the pipe-separated format.
Rules:
- Maximum 220 characters
- Include primary title | Top skill | Secondary value prop
- Include relevant keywords for ATS
- Sound human, not robotic
Return ONLY the headline, no explanations or quotes.`,
      },
      {
        role: "user" as const,
        content: `Current headline: "${headline}"\nAbout section: "${summary.slice(0, 500)}"`,
      },
    ];

    const rewrite = await generate({
      messages,
      config: {
        ...config,
        streaming: false,
      },
    });

    return NextResponse.json({ rewrite: rewrite.trim() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
