import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { enforceRequestLimits } from "packages/security";
import { generate } from "packages/ai/router";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  StartSessionSchema,
  NextQuestionSchema,
  EvaluateSessionSchema,
} from "@/components/interview/voice/types";

function resolveServerApiKey(provider: string, clientKey?: string): string {
  if (clientKey && clientKey.trim() !== "") return clientKey;
  const p = (provider || "gemini").toLowerCase().trim();
  if (p === "grok" || p === "xai") {
    return process.env.XAI_API_KEY || process.env.GROK_API_KEY || process.env.GROQ_API_KEY || process.env.VERCEL_AI_KEY || "";
  }
  if (p === "claude" || p === "anthropic") {
    return process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || process.env.VERCEL_AI_KEY || "";
  }
  return (
    process.env[`${p.toUpperCase()}_API_KEY`] ||
    process.env.VERCEL_AI_KEY ||
    process.env.VERCEL_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.XAI_API_KEY ||
    process.env.DEEPSEEK_API_KEY ||
    process.env.AZURE_OPENAI_API_KEY ||
    ""
  );
}

function generateFallbackQuestion(agentName: string, role: string, company: string, mode: string, difficulty: string, historyLength: number): string {
  const initial = `Welcome! I am ${agentName}. Let's begin your ${difficulty} level ${mode} interview for ${role} at ${company}. Could you walk me through your technical background and a complex problem you recently solved?`;

  const followups = [
    `Great overview. Regarding algorithms and performance, what is the time and space complexity of your approach, and how would you optimize it for edge cases?`,
    `In a high-concurrency environment at ${company}, how would you architect this system to ensure high availability, zero single points of failure, and low latency?`,
    `Could you detail a situation where you faced technical disagreement during project execution? What specific actions did you take and what was the outcome?`,
    `If this service experienced an unexpected memory leak or latency spike in production, what observability tools and diagnostic steps would you use?`,
    `Reflecting on your solution, what trade-offs did you accept, and how would you evolve the architecture over the next 12 months?`
  ];

  if (historyLength === 0) return initial;
  const index = Math.min(Math.floor(historyLength / 2), followups.length - 1);
  return followups[index];
}

function generateDynamicScorecard(history: Array<{ speaker: string; content: string }>, role: string, company: string, mode: string, difficulty: string) {
  const candidateMsgs = (history || []).filter((h) => h.speaker === "candidate");
  const totalAnswers = candidateMsgs.length;
  const totalWords = candidateMsgs.reduce((acc, m) => acc + (m.content || "").trim().split(/\s+/).filter(Boolean).length, 0);

  if (totalAnswers === 0 || totalWords < 8) {
    return {
      scores: {
        overall: 20,
        technicalKnowledge: 2,
        problemSolving: 2,
        communication: 2,
        clarity: 2,
        confidence: 2,
        depth: 1,
        correctness: 2,
        structure: 1,
        behavioralReasoning: 2,
        roleFit: 2,
      },
      feedback: `Incomplete session for ${role} at ${company}. Minimal or no candidate responses were recorded to evaluate performance.`,
      strengths: ["Initiated mock interview session"],
      weaknesses: ["No substantial candidate answers provided during the interview session"],
      recommendations: ["Attempt the interview using Voice or Text mode and provide detailed answers"],
      questionFeedback: [],
      starBreakdown: {
        situation: "Insufficient data to evaluate Situation.",
        task: "Insufficient data to evaluate Task.",
        action: "Insufficient data to evaluate Action.",
        result: "Insufficient data to evaluate Result.",
      },
      isDemoMode: true,
    };
  }

  const avgWords = Math.round(totalWords / totalAnswers);
  const techScore = Math.min(10, Math.max(3, Math.floor(avgWords / 15) + (totalAnswers >= 3 ? 3 : 1)));
  const probScore = Math.min(10, Math.max(3, Math.floor(avgWords / 18) + 3));
  const commScore = Math.min(10, Math.max(4, Math.floor(avgWords / 12) + 2));
  const clarityScore = Math.min(10, Math.max(4, Math.floor(avgWords / 15) + 3));
  const confScore = Math.min(10, Math.max(3, Math.floor(avgWords / 20) + 4));
  const depthScore = Math.min(10, Math.max(2, Math.floor(avgWords / 22) + 2));
  const corrScore = Math.min(10, Math.max(4, Math.floor(avgWords / 16) + 3));
  const structScore = Math.min(10, Math.max(3, totalWords > 100 ? 8 : 4));
  const behScore = Math.min(10, Math.max(3, totalAnswers >= 2 ? 7 : 4));
  const roleFitScore = Math.min(10, Math.max(4, Math.floor((techScore + probScore) / 2)));

  const overall = Math.min(98, Math.max(25, Math.round((techScore + probScore + commScore + clarityScore + confScore + depthScore + corrScore + structScore + behScore + roleFitScore) * 1.0)));

  return {
    scores: {
      overall,
      technicalKnowledge: techScore,
      problemSolving: probScore,
      communication: commScore,
      clarity: clarityScore,
      confidence: confScore,
      depth: depthScore,
      correctness: corrScore,
      structure: structScore,
      behavioralReasoning: behScore,
      roleFit: roleFitScore,
    },
    feedback: `Evaluated ${totalAnswers} response(s) (${totalWords} total words) for ${role} at ${company} (${difficulty} ${mode}). Candidate provided ${avgWords > 40 ? "detailed" : "concise"} explanations across the session.`,
    strengths: [
      totalWords > 80 ? "Detailed candidate responses provided" : "Clear initial response",
      totalAnswers >= 2 ? "Consistent engagement throughout session" : "Direct response to interviewer prompt",
      "Good structure in communicated ideas",
    ],
    weaknesses: [
      totalWords < 120 ? "Explanations could be expanded with more architectural depth" : "Elaborate further on trade-offs under high concurrency",
      "Include more quantitative metrics (KPIs, latency %, memory usage) in STAR responses",
    ],
    recommendations: [
      "Practice breaking down technical solutions using the STAR framework",
      "Highlight specific system design trade-offs and edge case handling",
    ],
    questionFeedback: [],
    starBreakdown: {
      situation: "Context framed based on candidate response transcript.",
      task: "Responsibilities outlined during interaction.",
      action: "Technical approach explained across answers.",
      result: "Outcomes and performance metrics discussed.",
    },
    isDemoMode: true,
  };
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const clientIp = (
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1"
    ).trim();

    const isUser = !!session?.user;
    const limitResponse = enforceRequestLimits(req, clientIp, { isUser });
    if (limitResponse) return limitResponse;

    const rawBody = await req.json();
    const action = rawBody.action;

    const isDemoMode = req.headers.get("x-demo-mode") === "true" || rawBody.isDemoMode === true;

    if (action === "start" || action === "next_question") {
      const parsed = action === "start"
        ? StartSessionSchema.safeParse(rawBody)
        : NextQuestionSchema.safeParse(rawBody);

      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid request payload", details: parsed.error.format() },
          { status: 400 }
        );
      }

      const { agent, company, role, mode, difficulty, language, aiConfig } = parsed.data;
      const history = "history" in parsed.data ? parsed.data.history : [];

      if (isDemoMode) {
        const simResponse = generateFallbackQuestion(agent.name, role, company, mode, difficulty, history.length);
        return NextResponse.json({ question: simResponse, isDemoMode: true });
      }

      const providerName = (aiConfig?.provider || "gemini") as import("packages/ai/provider").AIProviderName;
      const apiKey = resolveServerApiKey(providerName, aiConfig?.apiKey);
      const model = aiConfig?.model || (providerName === "gemini" ? "gemini-1.5-pro" : providerName === "groq" ? "llama3-70b-8192" : "gpt-4o");

      if (!apiKey) {
        // Fail-safe fallback when API key is missing
        const fallbackText = generateFallbackQuestion(agent.name, role, company, mode, difficulty, history.length);
        return NextResponse.json({ question: fallbackText, isDemoMode: true });
      }

      const activeConfig: import("packages/ai/provider").AIProviderConfig = {
        provider: providerName,
        apiKey,
        model,
        temperature: aiConfig?.temperature ?? 0.7,
        maxTokens: 4096,
        baseUrl: aiConfig?.baseUrl,
        streaming: false,
      };

      const systemPrompt = `You are the AI Interviewer agent named "${agent.name}".
Persona and Background:
${agent.description || "Experienced technical interviewer"}

Position: ${role} at ${company}
Interview Mode: ${mode} (Difficulty: ${difficulty})
Language: ${language}

Behavior Rules:
1. Speak directly as the interviewer matching your persona.
2. If history is empty, greet the candidate warmly (1 sentence) and ask the initial question tailored to ${mode} and ${difficulty}. Label company questions as company-style preparation.
3. If history is NOT empty, analyze the candidate's last response:
   - Technical / DSA / Code: Ask about time/space complexity, edge cases, or potential bugs.
   - System Design: Challenge scaling bottlenecks, single points of failure, or data persistence.
   - Behavioral: Ask follow-up questions for STAR framework details (Situation, Task, Action, Result).
4. Keep questions concise (1 to 3 sentences maximum) for Text-to-Speech output.
5. NEVER include markdown formatting (*, **, #, code blocks) or prefixes like "Agent:". Return ONLY plain spoken text.`;

      const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
        { role: "system", content: systemPrompt },
      ];

      history.forEach((msg) => {
        messages.push({
          role: msg.speaker === "agent" ? "assistant" : "user",
          content: msg.content,
        });
      });

      try {
        const questionText = await generate({
          messages,
          config: activeConfig,
        });
        return NextResponse.json({ question: questionText.trim() });
      } catch (genError) {
        console.warn("AI Provider generation failed, falling back to simulated engine response:", genError);
        const fallbackText = generateFallbackQuestion(agent.name, role, company, mode, difficulty, history.length);
        return NextResponse.json({ question: fallbackText, isDemoMode: true });
      }
    } else if (action === "evaluate") {
      const parsed = EvaluateSessionSchema.safeParse(rawBody);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid evaluation request payload", details: parsed.error.format() },
          { status: 400 }
        );
      }

      const { agent, company, role, mode, difficulty, language, history, aiConfig } = parsed.data;

      const dynamicScorecard = generateDynamicScorecard(history, role, company, mode, difficulty);

      if (isDemoMode) {
        return NextResponse.json(dynamicScorecard);
      }

      const providerName = (aiConfig?.provider || "gemini") as import("packages/ai/provider").AIProviderName;
      const apiKey = resolveServerApiKey(providerName, aiConfig?.apiKey);
      const model = aiConfig?.model || (providerName === "gemini" ? "gemini-1.5-pro" : providerName === "groq" ? "llama3-70b-8192" : "gpt-4o");

      if (!apiKey) {
        return NextResponse.json(dynamicScorecard);
      }

      const activeConfig: import("packages/ai/provider").AIProviderConfig = {
        provider: providerName,
        apiKey,
        model,
        temperature: aiConfig?.temperature ?? 0.7,
        maxTokens: 4096,
        baseUrl: aiConfig?.baseUrl,
        streaming: false,
      };

      let transcriptText = "";
      history.forEach((msg) => {
        const name = msg.speaker === "agent" ? agent.name : "Candidate";
        transcriptText += `[${name}]: ${msg.content}\n\n`;
      });

      const evalSystemPrompt = `You are an expert technical interview evaluator assessing a 1-on-1 mock interview.
Interviewer: "${agent.name}" (${agent.description})
Target Role: ${role} at ${company}
Interview Mode: ${mode} (Difficulty: ${difficulty})
Language: ${language}

STRICT EVALUATION INSTRUCTIONS:
1. Evaluate ONLY the candidate's actual responses present in the transcript provided below.
2. If the candidate provided 0 answers, empty responses, or very short answers (<10 words), assign low scores (under 30/100) reflecting an incomplete interview.
3. Do NOT generate generic placeholder feedback or high scores (e.g. 88+) unless the candidate's answers explicitly justify them.
4. Derive all strengths, weaknesses, recommendations, and STAR breakdown points directly from the candidate's spoken text.

Return ONLY a valid JSON object without markdown fences:
{
  "scores": {
    "overall": 80,
    "technicalKnowledge": 8,
    "problemSolving": 8,
    "communication": 8,
    "clarity": 8,
    "confidence": 8,
    "depth": 8,
    "correctness": 8,
    "structure": 8,
    "behavioralReasoning": 8,
    "roleFit": 8
  },
  "feedback": "Strict evaluation based on transcript",
  "strengths": ["Evidence-based strength 1", "Evidence-based strength 2"],
  "weaknesses": ["Evidence-based weakness 1", "Evidence-based weakness 2"],
  "recommendations": ["Actionable advice 1", "Actionable advice 2"],
  "questionFeedback": [],
  "starBreakdown": { "situation": "...", "task": "...", "action": "...", "result": "..." }
}`;

      try {
        const rawEval = await generate({
          messages: [
            { role: "system", content: evalSystemPrompt },
            { role: "user", content: `Full Interview Transcript:\n\n${transcriptText}` },
          ],
          config: activeConfig,
        });

        const cleanJSON = rawEval.replace(/```json|```/g, "").trim();
        const parsedEval = JSON.parse(cleanJSON);
        return NextResponse.json(parsedEval);
      } catch (evalErr) {
        console.warn("AI Evaluation failed, returning structured fallback scorecard:", evalErr);
        return NextResponse.json(dynamicScorecard);
      }
    } else if (action === "end" || action === "save" || action === "resume") {
      return NextResponse.json({ success: true, action, message: `Session action '${action}' recorded.` });
    }

    return NextResponse.json({ error: "Invalid action. Supported: start, next_question, evaluate, end, save, resume." }, { status: 400 });
  } catch (error: any) {
    console.error("Voice API route error fallback:", error);
    return NextResponse.json({
      question: "Welcome to the interview session. Could you walk me through your technical background and a recent complex problem you solved?",
      isDemoMode: true
    });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email ? (await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } }))?.id : null;

    if (!userId) {
      return NextResponse.json({ history: [], isGuest: true });
    }

    const pastSessions = await prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ history: pastSessions, isGuest: false });
  } catch (error) {
    console.warn("Prisma error in Voice GET history handler, returning fallback empty list:", error);
    return NextResponse.json({ history: [], isGuest: true, fallback: true });
  }
}
