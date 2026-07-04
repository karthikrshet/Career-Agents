// apps/web/src/app/api/resume/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { AIProviderConfig } from "@/types";
import { generate } from "packages/ai/router";
import { enforceRequestLimits } from "packages/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const clientIp = (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1").trim();
    const limitResponse = enforceRequestLimits(req, clientIp);
    if (limitResponse) return limitResponse;

    const { text, config, targetRole = "Software Engineer", jobDescription = "" }: { text: string; config: AIProviderConfig; targetRole?: string; jobDescription?: string } = await req.json();

    const rolePromptContext = `Target Role: ${targetRole}${jobDescription ? `\nJob Description Context: ${jobDescription.slice(0, 300)}` : ""}`;

    const messages = [
      {
        role: "system" as const,
        content: `You are a professional resume writing expert specializing in tailoring resumes for ${targetRole}.
Rules:
- Start every bullet with a strong action verb
- Include quantified results wherever possible (%, time saved, users/revenue impacted)
- Highlight core skills and competencies relevant to ${targetRole}
- Use XYZ format: Accomplished [X] as measured by [Y] by doing [Z]
- Remove passive language (was responsible for, helped, assisted)
- Keep it concise, professional, and ATS-friendly
Return only the improved resume text, no explanations.`,
      },
      {
        role: "user" as const,
        content: `${rolePromptContext}\n\nRewrite this resume:\n\n${text}`,
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
    const reqId = "REQ-" + Math.floor(10000 + Math.random() * 90000);
    console.error(`[${reqId}] Resume analyze API failed:`, e);
    return NextResponse.json({ 
      error: `Unable to evaluate because AI provider is unavailable. Reference ID: ${reqId}. Please try again.` 
    }, { status: 500 });
  }
}
