// packages/brain/memory.ts
import { BrainMemory } from "./types";

export function compileBrainMemory(clientState: any): BrainMemory {
  const resume = clientState?.resumeAnalysis;
  const github = clientState?.GitHubAnalysis;
  const linkedin = clientState?.linkedinAnalysis;
  const interviews = clientState?.interviewSessions || [];
  const applications = clientState?.jobApplications || [];
  const profile = clientState?.profile;
  
  const skills = profile?.skills || resume?.detectedKeywords || ["TypeScript", "Next.js", "React", "Node.js"];
  const goals = clientState?.weeklyGoals || [];
  const weakTopics = resume?.missingKeywords || ["System Design", "Dynamic Programming"];
  const favoriteCompanies = clientState?.favoriteCompanies || ["Google", "Stripe", "Netflix"];
  const salaryExpectation = clientState?.salaryExpectation || "$150,000 - $180,000";

  const resumeHistory = resume ? [{
    filename: resume.fileName || "resume.pdf",
    score: resume.overallScore || 0,
    analyzedAt: resume.analyzedAt || new Date().toISOString()
  }] : [];

  const githubAudits = github ? [{
    repoName: github.repoName || "GitHub Portfolio",
    score: github.portfolioScore || 0,
    date: github.analyzedAt || new Date().toISOString()
  }] : [];

  const linkedinImprovements = linkedin ? [{
    score: linkedin.overallScore || 0,
    date: linkedin.analyzedAt || new Date().toISOString()
  }] : [];

  const interviewHistory = interviews.map((i: any) => ({
    company: i.company || "Target",
    score: i.scorecard?.overallScore || 0,
    mode: i.mode || "Technical",
    date: i.timestamp || new Date().toISOString()
  }));

  const learningProgress = clientState?.learningProgress || {
    "Dynamic Programming": 45,
    "System Design": 60,
    "STAR behavioral format": 80
  };

  return {
    resumeHistory,
    interviewHistory,
    githubAudits,
    linkedinImprovements,
    applications: applications.map((app: any) => ({
      id: app.id,
      company: app.company,
      role: app.role,
      status: app.status,
      appliedDate: app.appliedDate
    })),
    goals: goals.map((g: any) => typeof g === "string" ? g : g.title),
    skills,
    certificates: profile?.certificates || [],
    learningProgress,
    weakTopics,
    favoriteCompanies,
    salaryExpectation
  };
}
