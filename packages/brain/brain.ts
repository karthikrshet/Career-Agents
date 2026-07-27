// packages/brain/brain.ts
import { compileBrainMemory } from "./memory";
import { createBrainExecutionPlan } from "./planner";
import { searchKnowledgeBase, formatCitations } from "./knowledge";
import { compileBrainContext } from "./context";
import { getCachedAgentPrompt } from "./router";
import { BrainMessage, BrainMemory } from "./types";

export interface BrainResult {
  systemPrompt: string;
  thinkingIndicator: string;
  timeline: any;
  confidence: number;
  timeTakenMs: number;
  intent: string;
  intentConfidence: number;
  rationale: string;
}

export function processThroughBrain(
  query: string,
  history: BrainMessage[],
  clientState: any,
  enabledPlugins?: Record<string, boolean>
): BrainResult {
  // 1. Compile permanent memory from client state
  const memory = compileBrainMemory(clientState);

  // 2. Query Knowledge Base for RAG context
  const ragMatches = searchKnowledgeBase(query, 3);
  const citations = formatCitations(ragMatches);

  // 3. Compile core prompt context
  const context = compileBrainContext(
    clientState?.profile,
    clientState?.metrics,
    memory,
    citations
  );

  // 4. Plan agent execution sequence
  const plan = createBrainExecutionPlan(query);
  
  // 5. Append agent instructions
  let agentPrompts = "";
  if (plan.matchedAgents.length > 0) {
    for (const agent of plan.matchedAgents) {
      const prompt = getCachedAgentPrompt(agent.filename);
      if (prompt) {
        agentPrompts += `\n\n[Agent Role: ${agent.name}]\n${prompt}`;
      }
    }
  }

  // 6. Append active plugins instructions
  let pluginPrompt = "";
  if (enabledPlugins) {
    if (enabledPlugins["star-coach"]) {
      pluginPrompt += `\n\n[Plugin Active: STAR Behavioral Coach]\nInstruction: Always structure behavioral responses in STAR format (Situation, Task, Action, Result). Highlight metrics and outcomes.`;
    }
    if (enabledPlugins["leetcode-tracker"]) {
      pluginPrompt += `\n\n[Plugin Active: LeetCode Tracker Connector]\nInstruction: Focus heavily on algorithmic correctness, time/space complexity (Big O notation), and suggest LeetCode problem recommendations.`;
    }
  }

  const finalSystemPrompt = `${context.fullPrompt}${pluginPrompt}${agentPrompts}`;

  const memorySize = Math.round(JSON.stringify(memory).length / 1024) + "KB";
  const filesList: string[] = [];
  if (clientState?.resumeAnalysis?.fileName) filesList.push(clientState.resumeAnalysis.fileName);
  if (clientState?.GitHubAnalysis?.repoName) filesList.push(clientState.GitHubAnalysis.repoName);
  const filesUsed = filesList.length > 0 ? filesList.join(",") : "None";
  const citationsCount = ragMatches.length;
  const activeModelName = clientState?.activeModel || "Claude 3.5 Sonnet";

  const allTimelineSteps = plan.timeline.steps.map(s => s.agentName).join(", ");
  const runningCount = plan.timeline.steps.length;
  const thinkingIndicator = `<thinking>AI Brain executing dynamic route: classified intent as "${plan.intent}" (${plan.intentConfidence}% confidence). Found ${runningCount} specialist agents [${allTimelineSteps}]. Confidence: ${plan.timeline.confidence}%. Mapped execution chain in ${plan.timeline.totalTimeMs}ms. Memory: ${memorySize}. Files: ${filesUsed}. Citations: ${citationsCount}. Models: ${activeModelName}.</thinking>\n\n`;

  return {
    systemPrompt: finalSystemPrompt,
    thinkingIndicator,
    timeline: plan.timeline,
    confidence: plan.timeline.confidence,
    timeTakenMs: plan.timeline.totalTimeMs,
    intent: plan.intent,
    intentConfidence: plan.intentConfidence,
    rationale: plan.rationale,
  };
}

export * from "./types";
export * from "./memory";
export * from "./planner";
export * from "./router";
export * from "./context";
export * from "./skills";
export * from "./knowledge";
export * from "./history";
export * from "./summary";
export * from "./intent";
export * from "./search";


