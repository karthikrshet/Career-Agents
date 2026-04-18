// packages/brain/types.ts

export type BrainRole = "system" | "user" | "assistant";

export interface BrainMessage {
  id: string;
  role: BrainRole;
  content: string | any[];
  timestamp: string;
}

export interface BrainMemory {
  resumeHistory: { filename: string; score: number; analyzedAt: string }[];
  interviewHistory: { company: string; score: number; mode: string; date: string }[];
  githubAudits: { repoName: string; score: number; date: string }[];
  linkedinImprovements: { score: number; date: string }[];
  applications: { id: string; company: string; role: string; status: string; appliedDate: string }[];
  goals: string[];
  skills: string[];
  certificates: string[];
  learningProgress: Record<string, number>; // e.g. { "Dynamic Programming": 60 }
  weakTopics: string[];
  favoriteCompanies: string[];
  salaryExpectation?: string;
}

export interface AgentExecutionStep {
  agentId: string;
  agentName: string;
  status: "idle" | "running" | "completed" | "failed";
  timeTakenMs: number;
}

export interface AgentExecutionTimeline {
  steps: AgentExecutionStep[];
  confidence: number; // 0-100
  totalTimeMs: number;
}

export interface BrainSession {
  sessionId: string;
  history: BrainMessage[];
  summary?: string;
  memory: BrainMemory;
}
