// packages/brain/skills.ts
import fs from "fs";
import path from "path";

export interface SkillCategory {
  name: string;
  skills: string[];
}

let uniqueSkillsCache: string[] = [];

export function getUniqueSkills(): string[] {
  if (uniqueSkillsCache.length > 0) return uniqueSkillsCache;
  const registryPath = path.join(process.cwd(), "../../agent-registry.json");
  try {
    if (fs.existsSync(registryPath)) {
      const data = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
      const allSkills = new Set<string>();
      for (const agent of data.agents || []) {
        for (const skill of agent.skills || []) {
          allSkills.add(skill);
        }
      }
      uniqueSkillsCache = Array.from(allSkills);
      return uniqueSkillsCache;
    }
  } catch (err) {
    console.error("Failed to load skills from agent-registry.json", err);
  }
  return ["TypeScript", "Next.js", "React", "Node.js", "SQL", "System Design", "LeetCode"];
}

export function searchAgentsBySkill(skillName: string): any[] {
  const registryPath = path.join(process.cwd(), "../../agent-registry.json");
  try {
    if (fs.existsSync(registryPath)) {
      const data = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
      const target = skillName.toLowerCase();
      return (data.agents || []).filter((agent: any) =>
        (agent.skills || []).some((s: string) => s.toLowerCase() === target)
      );
    }
  } catch {}
  return [];
}
