// apps/web/src/app/api/interview/route.ts
// AI-powered interview question generation + answer evaluation

import { NextResponse } from "next/server";
import { generate } from "packages/ai/router";

const SYSTEM_PROMPT_GENERATE = `You are an expert technical interviewer at a top-tier tech company.
Generate exactly 5 interview questions in JSON format for the given context.
Return ONLY valid JSON — no markdown fences, no explanations.
Format: {"questions": [{"id": "q1", "text": "...", "type": "...", "followUp": "..."}]}`;

const SYSTEM_PROMPT_EVALUATE = `You are an expert interview coach evaluating candidate answers using the STAR framework.
Evaluate the provided interview answers and return ONLY valid JSON.
Never include comments, explanations, or markdown blocks (e.g. do not wrap in \`\`\`json).

Evaluate these dimensions:
1. situation (out of 10)
2. task (out of 10)
3. action (out of 10)
4. result (out of 10)
5. ownership (out of 10)
6. leadership (out of 10)
7. communication (out of 10)
8. technicalDepth (out of 10)
9. problemSolving (out of 10)
10. confidence (out of 10)
11. overall (overall score out of 100)

If user answers are extremely short, placeholder, or insubstantial (e.g., "Hi", "Hello", "Thanks", "Ok", "I don't know"), evaluate them strictly and award very low ratings (such as 0 or 1 out of 10, and overall less than 15 out of 100). Do not fabricate high scores for empty answers.

Format:
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
    "overall": M
  },
  "feedback": "...",
  "strengths": ["..."],
  "improvements": ["..."]
}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, company, role, mode, difficulty, responses, aiConfig } = body;

    const provider = aiConfig?.provider || "gemini";
    const apiKey = aiConfig?.apiKey || process.env[`${provider.toUpperCase()}_API_KEY` || ""];
    const hasKey = !!apiKey || ["ollama", "lmstudio"].includes(provider);

    if (action === "generate") {
      if (!hasKey) {
        return NextResponse.json(generateSampleQuestions(mode, company));
      }
      return await generateQuestions({ company, role, mode, difficulty, aiConfig });
    } else if (action === "evaluate") {
      return await evaluateAnswers({ responses, company, mode, aiConfig });
    }

    return NextResponse.json({ error: "Invalid action. Use 'generate' or 'evaluate'." }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Interview API error" }, { status: 500 });
  }
}

async function generateQuestions({ company, role, mode, difficulty, aiConfig }: any) {
  const userPrompt = `Generate ${difficulty} ${mode} interview questions for a ${role || "Software Engineer"} position at ${company || "a top tech company"}.
Make them realistic and specific to the company culture and role.`;

  try {
    const provider = aiConfig?.provider || "gemini";
    const apiKey = aiConfig?.apiKey || process.env[`${provider.toUpperCase()}_API_KEY` || ""];

    const raw = await generate({
      messages: [
        { role: "system", content: SYSTEM_PROMPT_GENERATE },
        { role: "user", content: userPrompt },
      ],
      config: {
        ...aiConfig,
        apiKey,
        streaming: false,
      },
    });

    const cleanJSON = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanJSON);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(generateSampleQuestions(mode, company));
  }
}

async function evaluateAnswers({ responses, company, mode, aiConfig }: any) {
  const answersText = responses
    .map((r: any, i: number) => `Q${i + 1}: ${r.question}\nA: ${r.answer}`)
    .join("\n\n");

  const userPrompt = `Evaluate these ${mode} interview answers for ${company || "a top tech company"}:\n\n${answersText}`;

  try {
    const provider = aiConfig?.provider || "gemini";
    const apiKey = aiConfig?.apiKey || process.env[`${provider.toUpperCase()}_API_KEY` || ""];

    if (!apiKey && !["ollama", "lmstudio"].includes(provider)) {
      throw new Error("API key not configured");
    }

    const raw = await generate({
      messages: [
        { role: "system", content: SYSTEM_PROMPT_EVALUATE },
        { role: "user", content: userPrompt },
      ],
      config: {
        ...aiConfig,
        apiKey,
        streaming: false,
      },
    });

    const cleanJSON = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanJSON);
    
    if (!parsed || !parsed.scores || typeof parsed.scores.overall !== "number") {
      throw new Error("Invalid format received from model");
    }
    
    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Unable to evaluate because AI provider is unavailable.",
      actions: ["retry", "switch_provider", "save_draft"]
    }, { status: 503 });
  }
}

function generateSampleQuestions(mode: string, company: string) {
  const samples: Record<string, any[]> = {
    behavioral: [
      { id: "q1", text: `Tell me about a time you demonstrated ownership at a critical project at ${company || "your company"}.`, type: "behavioral", followUp: "What was the outcome and what did you learn?" },
      { id: "q2", text: "Describe a situation where you had to make a difficult decision with incomplete information.", type: "behavioral", followUp: "How did you validate your decision afterward?" },
      { id: "q3", text: "Tell me about a time you disagreed with your manager's technical decision.", type: "behavioral", followUp: "How did you resolve it?" },
      { id: "q4", text: "Give an example of when you went above and beyond your job requirements.", type: "behavioral", followUp: "What drove you to do that?" },
      { id: "q5", text: "Describe a time you had to learn a new technology quickly to meet a deadline.", type: "behavioral", followUp: "What was your learning strategy?" },
    ],
    technical: [
      { id: "q1", text: "Implement a function to find the kth largest element in an unsorted array in O(n) time.", type: "technical", followUp: "Can you optimize for the average case?" },
      { id: "q2", text: "Design a thread-safe rate limiter that supports distributed environments.", type: "technical", followUp: "How would you handle burst traffic?" },
      { id: "q3", text: "Explain how JavaScript's event loop and microtask queue work.", type: "technical", followUp: "How does this affect async/await behavior?" },
      { id: "q4", text: "How would you optimize a database query that scans 50M rows?", type: "technical", followUp: "What monitoring would you add?" },
      { id: "q5", text: "Implement a debounce and throttle function from scratch.", type: "technical", followUp: "When would you use each in production?" },
    ],
    system_design: [
      { id: "q1", text: `Design ${company === "Netflix" ? "Netflix's" : "a"} video streaming service for 100M concurrent users.`, type: "system_design", followUp: "How would you handle peak traffic during a major release?" },
      { id: "q2", text: "Design a distributed job scheduler (like AWS Lambda) with at-least-once delivery.", type: "system_design", followUp: "How do you handle idempotency?" },
      { id: "q3", text: "Architect a real-time collaborative code editor (like VS Code Live Share).", type: "system_design", followUp: "How do you resolve conflicts?" },
      { id: "q4", text: "Design a URL shortener that handles 100k reads per second.", type: "system_design", followUp: "How would you implement analytics?" },
      { id: "q5", text: "Design a notification system for a social platform with 500M users.", type: "system_design", followUp: "How do you prioritize notifications?" },
    ],
    hr: [
      { id: "q1", text: "Why are you interested in this role specifically?", type: "hr", followUp: "What excites you most about our mission?" },
      { id: "q2", text: "What are your salary expectations and current compensation?", type: "hr", followUp: "Are you considering other offers?" },
      { id: "q3", text: "Where do you see your career in 3-5 years?", type: "hr", followUp: "How does this role fit into that trajectory?" },
      { id: "q4", text: "What are your top 3 strengths that make you exceptional for this role?", type: "hr", followUp: "Can you give a recent example of each?" },
      { id: "q5", text: "Tell me about a failure or mistake and what you learned from it.", type: "hr", followUp: "How did it change your approach going forward?" },
    ],
  };
  return { questions: samples[mode] || samples.behavioral };
}
