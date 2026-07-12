import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { enforceRequestLimits } from "packages/security";
import { generate } from "packages/ai/router";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const clientIp = (
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1"
    ).trim();

    const limitResponse = enforceRequestLimits(req, clientIp, { isUser: !!session?.user });
    if (limitResponse) return limitResponse;

    const body = await req.json();
    const { action, agent, company, role, mode, difficulty, language, history, aiConfig } = body;

    if (!agent || !agent.name || !agent.description) {
      return NextResponse.json({ error: "Missing agent configuration details" }, { status: 400 });
    }

    const provider = aiConfig?.provider || "gemini";
    const apiKey = resolveServerApiKey(provider, aiConfig?.apiKey);
    const model = aiConfig?.model || (provider === "gemini" ? "gemini-1.5-pro" : provider === "groq" ? "llama3-70b-8192" : "gpt-4o");

    const activeConfig = {
      ...aiConfig,
      apiKey,
      model,
    };

    if (action === "next_question") {
      const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
        {
          role: "system",
          content: `You are the AI Interviewer agent named "${agent.name}".
Your persona and background:
${agent.description}

You are conducting a live, professional mock interview with a candidate for a ${role || "Software Engineer"} position at ${company || "a top tech company"}.
Interview Mode: ${mode || "technical"} (Difficulty: ${difficulty || "Medium"})
Conversation Language: ${language || "English"}

Instructions for your behavior:
1. Act as a skilled interviewer matching your persona.
2. If there is no previous conversation history, greet the candidate briefly and ask the first main question suitable for this difficulty, mode, and agent style.
3. If the conversation history is NOT empty, analyze the candidate's last answer. Ask a relevant, challenging follow-up question:
   - For TECHNICAL/DSA: If their answer contains programming logic, code, or algorithms, ask them about optimization (e.g., time/space complexity), potential bug fixes, edge cases (e.g., duplicate values, empty arrays, null pointer dereferences, overflow), concurrency, or alternative data structures.
   - For BEHAVIORAL: Dig deeper into their actions or metrics in their story (following the STAR framework - Situation, Task, Action, Result).
   - For SYSTEM DESIGN: Challenge their design's failure modes, scaling, cache invalidation, database choice, or system bottlenecks.
4. Keep your questions concise, natural, and friendly (1 to 3 sentences maximum), as they will be spoken aloud to the candidate using Text-to-Speech.
5. Do NOT write any markdown formatting (no bold **, no bullet points, no code blocks), meta-talk, or prefixes like "Agent:" or "Interviewer:". Return ONLY the exact, plain-text question you would speak.`,
        },
      ];

      // Format previous conversation history
      if (history && Array.isArray(history)) {
        history.forEach((msg: any) => {
          messages.push({
            role: msg.role === "agent" ? "assistant" : "user",
            content: msg.content,
          });
        });
      }

      const questionText = await generate({
        messages,
        config: activeConfig,
      });

      return NextResponse.json({ question: questionText.trim() });
    } else if (action === "evaluate") {
      const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
        {
          role: "system",
          content: `You are an expert interview coach evaluating a 1-on-1 conversational mock interview.
The interview was conducted by the AI Interviewer "${agent.name}" (${agent.description}) for a ${role || "Software Engineer"} position at ${company || "a top tech company"}.
Interview Mode: ${mode || "technical"} (Difficulty: ${difficulty || "Medium"})
Language: ${language || "English"}

Review the entire transcripts/history of the interview.
Evaluate the candidate's answers based on completeness, depth, communication skills, problem-solving ability, and adherence to the STAR framework (Situation, Task, Action, Result).
Determine scores out of 10 for:
1. situation
2. task
3. action
4. result
5. ownership
6. leadership
7. communication
8. technicalDepth (or coding correctness if technical)
9. problemSolving
10. confidence
And an overall score out of 100.

If user answers are extremely short, placeholder, or insubstantial (e.g., "Hi", "Hello", "Thanks", "Ok", "I don't know"), evaluate them strictly and award very low ratings (such as 0 or 1 out of 10, and overall less than 15 out of 100). Do not fabricate high scores for empty answers.

You MUST return ONLY a valid JSON object. Do not include markdown fences, comments, or explanations.
JSON Format:
{
  "scores": {
    "situation": N,
    "task": N,
    "action": N,
    "result": N,
    "ownership": N,
    "leadership": N,
    "communication": N,
    "technicalDepth": N,
    "problemSolving": N,
    "confidence": N,
    "overall": N
  },
  "feedback": "...",
  "strengths": ["...", "...", "..."],
  "improvements": ["...", "...", "..."],
  "starEvaluation": {
    "situation": "...",
    "task": "...",
    "action": "...",
    "result": "..."
  }
}
`,
        },
      ];

      // Format previous conversation history
      if (history && Array.isArray(history)) {
        let conversationText = "";
        history.forEach((msg: any, index: number) => {
          const sender = msg.role === "agent" ? agent.name : "Candidate";
          conversationText += `[${sender}]: ${msg.content}\n\n`;
        });
        messages.push({ role: "user", content: `Here is the full interview transcript:\n\n${conversationText}` });
      } else {
        return NextResponse.json({ error: "No history found for evaluation" }, { status: 400 });
      }

      const evaluationRaw = await generate({
        messages,
        config: activeConfig,
      });

      const cleanJSON = evaluationRaw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJSON);

      if (!parsed || !parsed.scores || typeof parsed.scores.overall !== "number") {
        throw new Error("Invalid response format received from evaluation agent");
      }

      return NextResponse.json(parsed);
    }

    return NextResponse.json({ error: "Invalid action. Use 'next_question' or 'evaluate'." }, { status: 400 });
  } catch (error: any) {
    console.error("Voice Agent API Route error:", error);
    return NextResponse.json({ error: error.message || "Voice Agent API error" }, { status: 500 });
  }
}
