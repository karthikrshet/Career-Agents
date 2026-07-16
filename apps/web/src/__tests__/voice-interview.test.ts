import {
  StartSessionSchema,
  NextQuestionSchema,
  EvaluateSessionSchema,
} from "@/components/interview/voice/types";

export function runVoiceSchemaTests(): { success: boolean; results: string[] } {
  const results: string[] = [];

  const validStart = StartSessionSchema.safeParse({
    action: "start",
    agent: { id: "interviewer-agent", name: "Mock Interviewer", description: "Technical Interviewer" },
    company: "Google",
    role: "Software Engineer",
    mode: "technical",
    difficulty: "Medium",
    language: "en-US",
  });
  results.push(`StartSessionSchema: ${validStart.success ? "PASS" : "FAIL"}`);

  const invalidStart = StartSessionSchema.safeParse({
    action: "start",
    agent: { id: "" },
  });
  results.push(`InvalidStartSessionSchema: ${!invalidStart.success ? "PASS (Correctly Rejected)" : "FAIL"}`);

  const validNext = NextQuestionSchema.safeParse({
    action: "next_question",
    agent: { id: "coach-1", name: "Career Coach" },
    company: "Stripe",
    role: "Backend Engineer",
    mode: "dsa",
    difficulty: "Hard",
    language: "en-US",
    history: [
      { speaker: "agent", content: "What is the time complexity of QuickSort?" },
      { speaker: "candidate", content: "Average time complexity is O(N log N)." },
    ],
  });
  results.push(`NextQuestionSchema: ${validNext.success ? "PASS" : "FAIL"}`);

  const validEval = EvaluateSessionSchema.safeParse({
    action: "evaluate",
    agent: { id: "coach-1", name: "Career Coach" },
    company: "Meta",
    role: "Full Stack Engineer",
    mode: "system_design",
    difficulty: "Expert",
    language: "en-US",
    history: [
      { speaker: "agent", content: "How do you handle database replication?" },
      { speaker: "candidate", content: "Using primary-replica architecture with read scaling." },
    ],
  });
  results.push(`EvaluateSessionSchema: ${validEval.success ? "PASS" : "FAIL"}`);

  const allPassed = validStart.success && !invalidStart.success && validNext.success && validEval.success;
  return { success: allPassed, results };
}
