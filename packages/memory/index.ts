// packages/memory/index.ts
import type { UserProfile, CareerMetrics, ResumeAnalysis, GitHubAnalysis, LinkedInAnalysis, JobApplication, CopilotSession } from "@/types";

export interface CareerMemoryState {
  profile: UserProfile | null;
  metrics: CareerMetrics;
  resumeAnalysis: ResumeAnalysis | null;
  GitHubAnalysis: GitHubAnalysis | null;
  linkedinAnalysis: LinkedInAnalysis | null;
  jobApplications: JobApplication[];
  copilotSessions: CopilotSession[];
  weeklyGoals: string[];
  learningProgress: Record<string, number>;
}

// Caching layer for persistent candidate memory state
let currentMemoryState: CareerMemoryState = {
  profile: null,
  metrics: {
    careerScore: 0,
    resumeScore: 0,
    githubScore: 0,
    linkedinScore: 0,
    interviewScore: 0,
    applicationScore: 0,
    lastUpdated: new Date().toISOString(),
  },
  resumeAnalysis: null,
  GitHubAnalysis: null,
  linkedinAnalysis: null,
  jobApplications: [],
  copilotSessions: [],
  weeklyGoals: [],
  learningProgress: {},
};

export function getMemoryState(): CareerMemoryState {
  return currentMemoryState;
}

export function updateMemoryProfile(profile: UserProfile): void {
  currentMemoryState.profile = profile;
}

export function updateMemoryMetrics(metrics: CareerMetrics): void {
  currentMemoryState.metrics = metrics;
}

export function updateMemoryResume(analysis: ResumeAnalysis): void {
  currentMemoryState.resumeAnalysis = analysis;
}

export function updateMemoryGitHub(analysis: GitHubAnalysis): void {
  currentMemoryState.GitHubAnalysis = analysis;
}

export function updateMemoryLinkedIn(analysis: LinkedInAnalysis): void {
  currentMemoryState.linkedinAnalysis = analysis;
}

export function addMemoryJobApplication(app: JobApplication): void {
  currentMemoryState.jobApplications.push(app);
}

export function addMemoryCopilotSession(session: CopilotSession): void {
  currentMemoryState.copilotSessions.push(session);
}

export function setWeeklyGoals(goals: string[]): void {
  currentMemoryState.weeklyGoals = goals;
}

export function updateLearningProgress(skill: string, value: number): void {
  currentMemoryState.learningProgress[skill] = value;
}
