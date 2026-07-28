// packages/agents/router.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export type CareerIntent =
  | "resume"
  | "github"
  | "linkedin"
  | "interview"
  | "job_search"
  | "career_advice"
  | "promotion"
  | "salary"
  | "relocation";

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

// Global cached agent registry
let agentRegistryCache: { agents: AgentInfo[] } | null = null;

// Robust resolver to locate workspace files in any runtime context
export function resolveWorkspacePath(filename: string): string {
  let target = path.resolve(process.cwd(), filename);
  if (fs.existsSync(target)) return target;

  target = path.resolve(process.cwd(), "../../", filename);
  if (fs.existsSync(target)) return target;

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

export function loadAgentRegistry(): { agents: AgentInfo[] } {
  if (agentRegistryCache) return agentRegistryCache;

  const registryPath = resolveWorkspacePath("agent-registry.json");
  try {
    if (fs.existsSync(registryPath)) {
      agentRegistryCache = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
      return agentRegistryCache!;
    }
  } catch (err) {
    console.error("Failed to load agent-registry.json in packages/agents/router.ts", err);
  }

  return { agents: [] };
}

export function classifyIntent(query: string): CareerIntent {
  const lq = query.toLowerCase();
  
  if (lq.includes("resume") || lq.includes("cv") || lq.includes("ats")) {
    return "resume";
  }
  if (lq.includes("github") || lq.includes("git") || lq.includes("portfolio")) {
    return "github";
  }
  if (lq.includes("linkedin") || lq.includes("headline") || lq.includes("visibility")) {
    return "linkedin";
  }
  if (lq.includes("interview") || lq.includes("prep") || lq.includes("mock") || lq.includes("questions")) {
    return "interview";
  }
  if (lq.includes("apply") || lq.includes("job") || lq.includes("tracker") || lq.includes("hiring")) {
    return "job_search";
  }
  if (lq.includes("salary") || lq.includes("negotiate") || lq.includes("compensation") || lq.includes("offer")) {
    return "salary";
  }
  if (lq.includes("promote") || lq.includes("promotion") || lq.includes("readiness") || lq.includes("performance review")) {
    return "promotion";
  }
  if (lq.includes("relocate") || lq.includes("relocation") || lq.includes("visa")) {
    return "relocation";
  }

  return "career_advice";
}

export function findMatchingAgents(query: string, intent?: CareerIntent): AgentInfo[] {
  const registry = loadAgentRegistry();
  const lq = query.toLowerCase();
  const targetIntent = intent || classifyIntent(query);
  
  const scored: { agent: AgentInfo; score: number }[] = [];

  for (const agent of registry.agents) {
    let score = 0;
    const nameLower = agent.name.toLowerCase();
    const descLower = agent.description.toLowerCase();

    // Match full name
    if (lq.includes(nameLower)) {
      score += 15;
    }

    // Keyword matching
    const keywords = nameLower.split(/\s+/);
    for (const kw of keywords) {
      if (kw.length > 3 && lq.includes(kw)) score += 3;
    }

    // Match tags
    for (const tag of agent.tags || []) {
      if (lq.includes(tag.toLowerCase())) score += 2;
    }

    // Match skills
    for (const skill of agent.skills || []) {
      if (lq.includes(skill.toLowerCase())) score += 2;
    }

    // Intent boosters
    if (targetIntent === "resume" && (agent.id.includes("resume") || agent.id.includes("ats"))) {
      score += 12;
    }
    if (targetIntent === "github" && (agent.id.includes("github") || agent.id.includes("portfolio"))) {
      score += 12;
    }
    if (targetIntent === "linkedin" && (agent.id.includes("linkedin") || agent.id.includes("profile"))) {
      score += 12;
    }
    if (targetIntent === "interview" && (agent.id.includes("interview") || agent.id.includes("prep"))) {
      score += 12;
    }

    if (score >= 5) {
      scored.push({ agent, score });
    }
  }

  // Sort descending and take top 3
  return scored
    .sort((a, b) => b.score - a.score)
    .map((s) => s.agent)
    .slice(0, 3);
}
