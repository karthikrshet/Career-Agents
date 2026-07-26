// packages/agents/planner.ts
import { classifyIntent, findMatchingAgents, AgentInfo, CareerIntent } from "./router";

export interface AgentExecutionPlan {
  intent: CareerIntent;
  query: string;
  matchedAgents: AgentInfo[];
  executionSequence: string[];
  rationale: string;
}

export function generateExecutionPlan(query: string): AgentExecutionPlan {
  const intent = classifyIntent(query);
  const matched = findMatchingAgents(query, intent);
  
  const executionSequence = matched.map(a => a.id);
  
  let rationale = `Detected candidate query focus: "${intent.replace("_", " ")}". `;
  if (matched.length > 0) {
    rationale += `Assembled agent workspace expert team: ${matched.map(a => a.name).join(", ")}.`;
  } else {
    rationale += "No specialized agents required. Routing to master Career Copilot.";
  }

  return {
    intent,
    query,
    matchedAgents: matched,
    executionSequence,
    rationale
  };
}
