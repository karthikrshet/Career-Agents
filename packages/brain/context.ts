// packages/brain/context.ts
import { BrainMemory } from "./types";

export interface CompiledBrainContext {
  profilePrompt: string;
  memoryPrompt: string;
  knowledgePrompt: string;
  fullPrompt: string;
}

export function compileBrainContext(
  profile: any,
  metrics: any,
  memory: BrainMemory,
  knowledgeCitations: string
): CompiledBrainContext {
  const profilePrompt = `[Candidate Dossier Profile]
- Name: ${profile?.name || "Guest Candidate"}
- Target Role: ${profile?.targetRole || "Software Engineer"}
- Target Company: ${profile?.targetCompany || "Not specified"}`;

  const memoryPrompt = `[Career Operating System Memory]
- Overall Career Score: ${metrics?.careerScore || 0}/100
- Resume ATS Score: ${memory.resumeHistory?.[0]?.score || 0}/100
- GitHub Audit Score: ${memory.githubAudits?.[0]?.score || 0}/100
- LinkedIn Optimization Score: ${memory.linkedinImprovements?.[0]?.score || 0}/100
- Salary Expectation: ${memory.salaryExpectation || "Not configured"}
- Target Companies: ${memory.favoriteCompanies.join(", ") || "None specified"}
- Active Learning Progress: ${JSON.stringify(memory.learningProgress)}
- Tracked Skills: ${memory.skills.join(", ")}
- Identified Skill Gaps & Weak Topics: ${memory.weakTopics.join(", ")}
- Active Goals: ${memory.goals.join(", ")}`;

  const knowledgePrompt = knowledgeCitations ? `[Knowledge Citations]\n${knowledgeCitations}` : "";

  const fullPrompt = `You are the central AI Brain of Career Agents. Always structure recommendations aligned with candidate goals, dossier records, and skill development needs.
  
${profilePrompt}

${memoryPrompt}

${knowledgePrompt}`;

  return {
    profilePrompt,
    memoryPrompt,
    knowledgePrompt,
    fullPrompt
  };
}
