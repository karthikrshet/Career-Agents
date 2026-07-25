// apps/web/src/app/api/resume/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { AIProviderConfig } from "@/types";
import { generate } from "packages/ai/router";

export async function POST(req: NextRequest) {
  try {
    const { text, config }: { text: string; config: AIProviderConfig } = await req.json();

    const messages = [
      {
        role: "system" as const,
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
        role: "user" as const,
        content: `Rewrite this resume:\n\n${text}`,
      },
    ];

    const rewrite = await generate({
      messages,
      config: {
        ...config,
        streaming: false, // get full block synchronously
      },
    });

    return NextResponse.json({ rewrite });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
