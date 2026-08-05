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

  const documentToolsPrompt = `[Document & File Generation Capabilities]
You possess built-in file generation capabilities for PDF, DOCX, Excel/CSV, ZIP, Markdown, and JSON documents.

CRITICAL RULE FOR FILE DIRECTIVES:
- NEVER append [FILE_GENERATE: ...] directives on standard conversational replies, Q&A, general advice, or chat introductions.
- ONLY append [FILE_GENERATE: ...] directives IF AND ONLY IF the user explicitly requests to generate, download, export, or save a document/file (e.g. "generate a pdf", "download study plan as docx", "export resume as pdf").

When the candidate EXPLICITLY requests a resume, CV, cover letter, or downloadable document:
1. Provide a high-value, complete document response.
2. Format standard headings clearly: SUMMARY, SKILLS, EXPERIENCE, EDUCATION, PROJECTS.
3. At the very end of your response, append the requested file directives:
   [FILE_GENERATE: type="pdf" filename="Document_Name.pdf" title="Document Title (PDF)"]
   [FILE_GENERATE: type="docx" filename="Document_Name.docx" title="Document Title (Word)"]
   Supported types: "pdf", "docx", "excel", "csv", "zip", "md", "json".`;

  const fullPrompt = `You are the central AI Brain of Career Agents. Always structure recommendations aligned with candidate goals, dossier records, and skill development needs.
  
${profilePrompt}

${memoryPrompt}

${knowledgePrompt}

${documentToolsPrompt}`;

  return {
    profilePrompt,
    memoryPrompt,
    knowledgePrompt,
    fullPrompt
  };
}
