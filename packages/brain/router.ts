// packages/brain/router.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

// Robust resolver to locate workspace files in any runtime context
export function resolveWorkspacePath(filename: string): string {
  // 1. Try relative to process.cwd()
  let target = path.resolve(process.cwd(), filename);
  if (fs.existsSync(target)) return target;

  // 2. Try going up 2 levels (if inside apps/web)
  target = path.resolve(process.cwd(), "../../", filename);
  if (fs.existsSync(target)) return target;

  // 3. Try relative to this file's folder (packages/brain)
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    let current = __dirname;
    for (let i = 0; i < 5; i++) {
      const check = path.resolve(current, filename);
      if (fs.existsSync(check)) return check;
      current = path.dirname(current);
    }
  } catch {}

  return path.resolve(process.cwd(), filename);
}

export function loadAgentRegistry(): AgentInfo[] {
  const registryPath = resolveWorkspacePath("agent-registry.json");
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
    const agentFilePath = resolveWorkspacePath(filename);
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
