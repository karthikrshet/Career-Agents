// packages/agents/context.ts
import type { UserProfile, CareerMetrics, ResumeAnalysis, GitHubAnalysis, LinkedInAnalysis, JobApplication } from "@/types";

export interface CandidateContext {
  profile?: UserProfile | null;
  metrics?: CareerMetrics | null;
  resumeAnalysis?: ResumeAnalysis | null;
  GitHubAnalysis?: GitHubAnalysis | null;
  linkedinAnalysis?: LinkedInAnalysis | null;
  jobApplications?: JobApplication[] | null;
}

export function compileCandidateContext(context: CandidateContext): string {
  let prompt = `\n\n[Candidate Dossier Profile Context Index]`;
  
  if (!context) {
    return prompt + "\nNo active candidate profile loaded.";
  }

  const { profile, metrics, resumeAnalysis, GitHubAnalysis, linkedinAnalysis, jobApplications } = context;

  prompt += `
Candidate Profile:
- Name: ${profile?.name || "Guest Candidate"}
- Target Role: ${profile?.targetRole || "Software Engineer"}
- Target Company: ${profile?.targetCompany || "Not specified"}

Performance Metrics:
- Overall Career Score: ${metrics?.careerScore || 0}/100
- Resume Score: ${metrics?.resumeScore || 0}/100
- GitHub Score: ${metrics?.githubScore || 0}/100
- LinkedIn Score: ${metrics?.linkedinScore || 0}/100
- Interview Score: ${metrics?.interviewScore || 0}/100

Resume Audit:
- ATS Score: ${resumeAnalysis?.atsScore || 0}%
- Missing Keywords: ${resumeAnalysis?.missingKeywords ? JSON.stringify(resumeAnalysis.missingKeywords) : "[]"}

GitHub Portfolio:
- Public Repos: ${GitHubAnalysis?.publicRepos || 0}
- Stars Count: ${GitHubAnalysis?.totalStars || 0}
- README Quality: ${GitHubAnalysis?.readmeGrade || "N/A"}

LinkedIn Status:
- Headline Analysis: ${linkedinAnalysis?.headlineAnalysis?.current || "N/A"}
- Recruiter Visibility Index: ${linkedinAnalysis?.visibilityIndex || 0}/100

Job Application Pipeline (Last 5 applications):
${jobApplications ? JSON.stringify(jobApplications.slice(0, 5)) : "[]"}
`;

  return prompt;
}
