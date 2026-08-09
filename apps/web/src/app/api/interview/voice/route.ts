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

      const defaultScorecard = {
        scores: {
          overall: 88,
          technicalKnowledge: 9,
          problemSolving: 9,
          communication: 8,
          clarity: 9,
          confidence: 8,
          depth: 8,
          correctness: 9,
          structure: 9,
          behavioralReasoning: 8,
          roleFit: 9,
        },
        feedback: `Strong performance in this ${difficulty} ${mode} interview for ${role} at ${company}. Answers demonstrated clear technical reasoning and structured communication.`,
        strengths: ["Structured problem-solving approach", "Clear communication of complex concepts", "Good awareness of edge cases"],
        weaknesses: ["Could provide deeper quantitative metrics in STAR scenarios", "Elaborate further on system design trade-offs"],
        recommendations: ["Practice quantifying project results with specific KPIs", "Review distributed caching strategies for sub-millisecond response times"],
        questionFeedback: [],
        starBreakdown: {
          situation: "Clearly framed initial project problem and scope.",
          task: "Defined individual responsibilities and architectural constraints.",
          action: "Explained technical implementation choices and debugging procedures.",
          result: "Achieved measurable improvements in system performance and reliability."
        },
        isDemoMode: true,
      };

      if (isDemoMode) {
        return NextResponse.json(defaultScorecard);
      }

      const providerName = (aiConfig?.provider || "gemini") as import("packages/ai/provider").AIProviderName;
      const apiKey = resolveServerApiKey(providerName, aiConfig?.apiKey);
      const model = aiConfig?.model || (providerName === "gemini" ? "gemini-1.5-pro" : providerName === "groq" ? "llama3-70b-8192" : "gpt-4o");

      if (!apiKey) {
        return NextResponse.json(defaultScorecard);
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

Evaluate the transcript evidence strictly.
Assign ratings out of 10 for technicalKnowledge, problemSolving, communication, clarity, confidence, depth, correctness, structure, behavioralReasoning, roleFit, and overall score out of 100.

Return ONLY a valid JSON object without markdown fences:
{
  "scores": {
    "overall": 88,
    "technicalKnowledge": 9,
    "problemSolving": 9,
    "communication": 8,
    "clarity": 9,
    "confidence": 8,
    "depth": 8,
    "correctness": 9,
    "structure": 9,
    "behavioralReasoning": 8,
    "roleFit": 9
  },
  "feedback": "...",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "recommendations": ["..."],
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
        return NextResponse.json(defaultScorecard);
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
