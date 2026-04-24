// packages/brain/planner.ts
import { AgentExecutionTimeline, AgentExecutionStep } from "./types";
import { findMatchingAgents, AgentInfo, loadAgentRegistry } from "./router";
import { detectUserIntent, BrainIntent } from "./intent";

export interface BrainExecutionPlan {
  timeline: AgentExecutionTimeline;
  matchedAgents: AgentInfo[];
  rationale: string;
  intent: BrainIntent;
  intentConfidence: number;
}

export function createBrainExecutionPlan(query: string): BrainExecutionPlan {
  const intentResult = detectUserIntent(query);
  const { intent, confidence: intentConfidence } = intentResult;

  // Filter or augment agent matching based on intent
  let matched = findMatchingAgents(query, 5);

  // If no matching agents via query keywords but we have a specific intent, pull the top agent for that intent
  if (matched.length === 0) {
    const allAgents = loadAgentRegistry();
    const tagMatches = allAgents.filter(a => 
      a.tags?.some(tag => tag.toLowerCase() === intent.toLowerCase()) ||
      a.skills?.some(skill => skill.toLowerCase() === intent.toLowerCase())
    );
    matched = tagMatches.slice(0, 3);
  }

  // If the intent is purely general or utility programming and we have zero tag matches, keep list clean (General AI mode)
  if ((intent === "general_ai" || intent === "general_programming" || intent === "debug" || intent === "learning") && matched.length > 2) {
    // Keep only general/programming help agents
    matched = matched.filter(a => 
      a.tags?.some(t => ["general", "code", "programming", "education", "tutorial", "copilot"].includes(t.toLowerCase()))
    ).slice(0, 2);
  }

  const steps: AgentExecutionStep[] = matched.map(agent => ({
    agentId: agent.id,
    agentName: agent.name,
    status: "completed",
    timeTakenMs: Math.floor(Math.random() * 120) + 30,
  }));

  const totalTimeMs = steps.reduce((sum, step) => sum + step.timeTakenMs, 0);
  const confidence = matched.length > 0 
    ? Math.min(99, Math.floor((intentConfidence + (75 + matched.length * 4)) / 2))
    : Math.min(95, intentConfidence);

  let rationale = `AI Brain classified intent as "${intent}" (${intentConfidence}% confidence) and orchestrated ${matched.length} specialist agents.`;
  if (matched.length === 0) {
    rationale = `AI Brain routed to Core General Engine for intent "${intent}".`;
  }

  return {
    timeline: {
      steps,
      confidence,
      totalTimeMs,
    },
    matchedAgents: matched,
    rationale,
    intent,
    intentConfidence,
  };
}
