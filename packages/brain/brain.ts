// packages/brain/brain.ts
import { compileBrainMemory } from "./memory";
import { createBrainExecutionPlan } from "./planner";
import { searchKnowledgeBase, formatCitations } from "./knowledge";
import { compileBrainContext } from "./context";
import { getCachedAgentPrompt } from "./router";
import { BrainMessage, BrainMemory } from "./types";
import { routeCompletion } from "../ai-router/services/router";

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

export async function processThroughBrain(
  query: string,
  history: BrainMessage[],
  clientState: any,
  enabledPlugins?: Record<string, boolean>,
  gatewayConfig?: any
): Promise<BrainResult> {
  const startTime = Date.now();

  // 1. Compile permanent memory from client state
  const memory = compileBrainMemory(clientState);

  // 2. Query Knowledge Base for RAG context
  const ragMatches = await searchKnowledgeBase(query, 3);
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
  const matched = plan.matchedAgents.slice(0, 2); // Run top 2 agents in parallel for latency optimization

  // 5. Execute Specialist Agents in parallel via LLM Gateway
  const agentResults: string[] = [];
  
  const hasKeys = Object.values(gatewayConfig?.keys || {}).some((arr: any) => Array.isArray(arr) && arr.some((k: string) => k && k.trim() !== ""));
  const hasEnvKey = !!(process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.OPENROUTER_API_KEY);

  if (gatewayConfig && matched.length > 0 && (hasKeys || hasEnvKey)) {
    const promises = matched.map(async (agent) => {
      const prompt = getCachedAgentPrompt(agent.filename);
      const agentSystemPrompt = `You are the specialized agent "${agent.name}" (Role: ${agent.division}).
Your Goal is: ${agent.description}

Here is the agent instructions:
${prompt}

Analyze the candidate's query: "${query}"
And provide your specialized advice. Focus on actionable transition recommendations.
Limit your response to 120 words. Do not write introductory or conversational headers, write only your direct analysis.`;

      try {
        const agentConfig = {
          ...gatewayConfig,
          maxTokens: 512,
          retryCount: 0,
          retryDelayMs: 100,
          streaming: false,
        };
        const response = await routeCompletion(
          [
            { role: "system", content: agentSystemPrompt },
            { role: "user", content: query }
          ],
          agentConfig
        );
        return `### [Agent: ${agent.name} (${agent.division})] Specialized Analysis:\n${response}`;
      } catch (err: any) {
        return `### [Agent: ${agent.name}] Analysis failed: ${err.message}`;
      }
    });

    const results = await Promise.all(promises);
    agentResults.push(...results);
  }

  // 6. Merge outputs intelligently & inject 167 Specialist Agents context
  let agentPrompts = "";
  if (matched.length > 0) {
    agentPrompts += "\n\n=== 167 SPECIALIST AGENT MARKETPLACE CONTEXT ===\n";
    agentPrompts += matched.map((a) => {
      const prompt = getCachedAgentPrompt(a.filename);
      const cleanPromptSnippet = prompt ? prompt.slice(0, 350).trim() : a.description;
      return `[Specialist Agent Active: ${a.name} (Division: ${a.division})]\nGoal: ${a.description}\nCore Persona & Guidance: ${cleanPromptSnippet}`;
    }).join("\n\n");
    agentPrompts += "\n=============================================";
  }

  if (agentResults.length > 0) {
    agentPrompts += "\n\n=== SPECIALIST AGENT CRITIQUES ===\n" + agentResults.join("\n\n") + "\n=================================";
  }

  // 7. Append active plugins instructions
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
  const totalTimeTaken = Date.now() - startTime;
  
  const provider = gatewayConfig?.provider || "openai";
  const promptTokens = Math.round(query.split(/\s+/).length * 1.3);
  const completionTokens = 250; // Mock estimate for streaming delta
  const costEstimate = (promptTokens * 0.0000015 + completionTokens * 0.000002).toFixed(6);

  const thinkingIndicator = ""; // Hidden from frontend output stream

  return {
    systemPrompt: finalSystemPrompt,
    thinkingIndicator,
    timeline: plan.timeline,
    confidence: plan.timeline.confidence,
    timeTakenMs: totalTimeTaken,
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
