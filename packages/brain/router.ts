// packages/brain/router.ts
import fs from "fs";
import path from "path";

const promptCache: Record<string, string> = {};

export interface AgentInfo {
  id: string;
  name: string;
  division: string;
  description: string;
  filename: string;
  tags: string[];
  skills: string[];
  emoji?: string;
}

export function loadAgentRegistry(): AgentInfo[] {
  const registryPath = path.join(process.cwd(), "../../agent-registry.json");
  try {
    if (fs.existsSync(registryPath)) {
      const data = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
      return data.agents || [];
    }
  } catch (err) {
    console.error("Failed to load agent registry in packages/brain/router.ts", err);
  }
  return [];
}

export function getCachedAgentPrompt(filename: string): string {
  if (promptCache[filename]) return promptCache[filename];
  try {
    const agentFilePath = path.join(process.cwd(), "../../", filename);
    if (fs.existsSync(agentFilePath)) {
      const rawPrompt = fs.readFileSync(agentFilePath, "utf-8");
      const cleanPrompt = rawPrompt.replace(/^---[\s\S]*?---/, "").trim();
      promptCache[filename] = cleanPrompt;
      return cleanPrompt;
    }
  } catch {}
  return "";
}

export function findMatchingAgents(query: string, limit: number = 3): AgentInfo[] {
  const agents = loadAgentRegistry();
  const lq = query.toLowerCase();
  const scored: { agent: AgentInfo; score: number }[] = [];

  for (const agent of agents) {
    let score = 0;
    const nameLower = agent.name.toLowerCase();
    const descLower = agent.description.toLowerCase();

    if (lq.includes(nameLower)) score += 15;
    
    const keywords = nameLower.split(/\s+/);
    for (const kw of keywords) {
      if (kw.length > 3 && lq.includes(kw)) score += 3;
    }

    for (const tag of agent.tags || []) {
      if (lq.includes(tag.toLowerCase())) score += 2;
    }

    for (const skill of agent.skills || []) {
      if (lq.includes(skill.toLowerCase())) score += 2;
    }

    if (score >= 4) {
      scored.push({ agent, score });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .map(s => s.agent)
    .slice(0, limit);
}
