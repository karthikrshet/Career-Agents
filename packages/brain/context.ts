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
When the user asks for a PDF, DOCX, Excel spreadsheet, ZIP archive, Markdown document, or exported file (e.g. resume, study plan, ATS report, cover letter, or code package):
1. Provide a comprehensive, high-value, professional response containing the complete document text.
2. NEVER state "I cannot give you a PDF file". You CAN generate and provide downloadable files!
3. At the end of your response, ALWAYS append a file generation directive using exact tag format:
   [FILE_GENERATE: type="pdf" filename="Document_Title.pdf" title="ATS Resume & Career Strategy"]
   Supported types: "pdf", "docx", "excel", "csv", "zip", "md", "json".
   Example: [FILE_GENERATE: type="pdf" filename="Karthik_Resume_ATS.pdf" title="ATS Optimized Resume"]
   Example: [FILE_GENERATE: type="docx" filename="Google_Prep_Plan.docx" title="Google Interview Study Plan"]
   Example: [FILE_GENERATE: type="excel" filename="Job_Application_Tracker.csv" title="Job Application Log"]
   Example: [FILE_GENERATE: type="zip" filename="Portfolio_Codebase.zip" title="Algorithm Benchmark Source"]`;

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
