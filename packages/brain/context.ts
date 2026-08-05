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

When the candidate requests a resume, CV, cover letter, or ATS document:
1. Generate a top-tier, 100% ATS-compliant, executive-level resume with STAR-method bullet points and high-impact metrics.
2. DO NOT include meta-conversational filler inside the document body (such as "Here is your resume:" or "This is a resume PDF").
3. Format standard ATS headings clearly: SUMMARY, SKILLS, EXPERIENCE, EDUCATION, PROJECTS.
4. At the end of your response, ALWAYS append downloadable file directives:
   [FILE_GENERATE: type="pdf" filename="Candidate_ATS_Resume.pdf" title="ATS-Optimized Resume (PDF)"]
   [FILE_GENERATE: type="docx" filename="Candidate_ATS_Resume.docx" title="ATS-Optimized Resume (Word)"]

When the user asks for any other PDF, DOCX, Excel spreadsheet, ZIP archive, Markdown document, or exported file (e.g. study plan, ATS report, cover letter, or code package):
1. Provide a comprehensive, high-value, professional response containing the complete document text.
2. NEVER state "I cannot give you a PDF file". You CAN generate and provide downloadable files!
3. Append file generation directives:
   [FILE_GENERATE: type="pdf" filename="Document_Title.pdf" title="Career Document"]
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
