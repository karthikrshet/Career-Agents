// packages/agents/executor.ts
import { getCachedAgentPrompt } from "./cache";
import { compileCandidateContext, CandidateContext } from "./context";
import { generateExecutionPlan, AgentExecutionPlan } from "./planner";

export interface ExecutionPayload {
  systemPrompt: string;
  thinkingIndicator: string;
  plan: AgentExecutionPlan;
}

export function compileAndExecuteAgents(
  query: string,
  context: CandidateContext,
  enabledPlugins?: Record<string, boolean>
): ExecutionPayload {
  const plan = generateExecutionPlan(query);
  const contextPrompt = compileCandidateContext(context);
  
  let pluginPrompt = "";
  if (enabledPlugins) {
    if (enabledPlugins["star-coach"]) {
      pluginPrompt += `\n\n[Plugin Active: STAR Behavioral Coach]\nInstruction: Always structure behavioral responses in STAR format (Situation, Task, Action, Result). Highlight metrics and outcomes for each bullet.`;
    }
    if (enabledPlugins["leetcode-tracker"]) {
      pluginPrompt += `\n\n[Plugin Active: LeetCode Tracker Connector]\nInstruction: Focus heavily on algorithmic correctness, time/space complexity (Big O notation), and suggest LeetCode problem recommendations.`;
    }
    if (enabledPlugins["salary-intel"]) {
      pluginPrompt += `\n\n[Plugin Active: Salary Intelligence]\nInstruction: Focus recommendations on compensation negotiation tactics, salary benchmarks, and levels alignment.`;
    }
    if (enabledPlugins["resume-pdf"]) {
      pluginPrompt += `\n\n[Plugin Active: Resume PDF Parser]\nInstruction: Tailor suggestions specifically for PDF layout compliance and parsing logic.`;
    }
  }

  let agentPrompts = "";
  let thinkingIndicator = "";

  if (plan.matchedAgents.length > 0) {
    const agentNames = plan.matchedAgents.map((a) => `${a.name} (${a.emoji || "🤖"})`).join(", ");
    thinkingIndicator = `<thinking>Orchestrating career agent team: ${agentNames}. Merging system prompt requirements...</thinking>\n\n`;

    for (const agent of plan.matchedAgents) {
      const cleanPrompt = getCachedAgentPrompt(agent.filename);
      if (cleanPrompt) {
        agentPrompts += `\n\n[Agent Role: ${agent.name}]\n${cleanPrompt}`;
      }
    }
  }

  const systemPrompt = `You are Career Copilot, an AI career workspace assistant. Always use candidates' dossier metrics to deliver hyper-personalized guidance.
${contextPrompt}
${pluginPrompt}
${agentPrompts}`;

  return {
    systemPrompt,
    thinkingIndicator,
    plan
  };
}
