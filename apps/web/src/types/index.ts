// Career OS — Type Definitions

export type AIProvider =
  | "openai" | "anthropic" | "gemini" | "groq"
  | "openrouter" | "azure" | "deepseek" | "ollama" | "lmstudio";

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  baseUrl?: string; // for ollama / lmstudio / azure
  streaming: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  githubUsername?: string;
  linkedinUrl?: string;
  targetRole?: string;
  targetCompany?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareerMetrics {
  careerScore: number;
  resumeScore: number;
  githubScore: number;
  linkedinScore: number;
  interviewScore: number;
  applicationScore: number;
  lastUpdated: string;
}

// Resume
export interface ResumeAnalysis {
  id: string;
  fileName: string;
  rawText: string;
  overallScore: number;
  atsScore: number;
  sections: {
    hasExperience: boolean;
    hasEducation: boolean;
    hasSkills: boolean;
    hasProjects: boolean;
    hasSummary: boolean;
  };
  weakBullets: WeakBullet[];
  missingKeywords: string[];
  detectedKeywords: string[];
  recommendations: string[];
  aiRewrite?: string;
  analyzedAt: string;
}

export interface WeakBullet {
  original: string;
  issue: "passive_verb" | "no_metric" | "vague" | "too_short";
  suggested: string;
}

// GitBranch
export interface GitHubAnalysis {
  username: string;
  avatarUrl: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  portfolioScore: number;
  languages: { name: string; percent: number; color: string }[];
  pinnedRepos: GitHubRepo[];
  readmeGrade: "Excellent" | "Good" | "Needs Work" | "Missing";
  contributionData: number[]; // 52 weeks
  recommendations: string[];
  analyzedAt: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  hasReadme: boolean;
  hasLicense: boolean;
  hasCi: boolean;
  url: string;
}

// Link2
export interface LinkedInAnalysis {
  overallScore: number;
  recruiterScore: number;
  visibilityIndex: "High" | "Medium" | "Low";
  headlineAnalysis: {
    current: string;
    issues: string[];
    rewrites: string[];
  };
  summaryAnalysis: {
    wordCount: number;
    keywordDensity: number;
    missingKeywords: string[];
    suggestions: string[];
  };
  suggestedSkills: string[];
  analyzedAt: string;
}

// Interview
export type InterviewMode = "behavioral" | "technical" | "system_design" | "hr";
export type InterviewDifficulty = "Easy" | "Medium" | "Hard" | "Expert";
export type InterviewRound = "Screening" | "Technical" | "System Design" | "Onsite" | "HR";

export interface InterviewSession {
  id: string;
  company: string;
  role: string;
  mode: InterviewMode;
  difficulty: InterviewDifficulty;
  round: InterviewRound;
  questions: InterviewQuestion[];
  responses: InterviewResponse[];
  scorecard?: InterviewScorecard;
  startedAt: string;
  completedAt?: string;
}

export interface InterviewQuestion {
  id: string;
  text: string;
  type: InterviewMode;
  followUp?: string;
}

export interface InterviewResponse {
  questionId: string;
  answer: string;
  codeAnswer?: string;
  submittedAt: string;
}

export interface InterviewScorecard {
  overallScore: number;
  dimensions: {
    starStructure: number;
    technicalAccuracy: number;
    communication: number;
    problemSolving: number;
    leadership: number;
    cultureAdd: number;
  };
  strengths: string[];
  improvements: string[];
  aiSummary: string;
}

// Job Tracker
export type JobStatus = "Wishlist" | "Applied" | "OA" | "Phone Screen" | "Onsite" | "Offer" | "Rejected" | "Withdrawn";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  location: string;
  salary?: string;
  referral?: string;
  recruiter?: string;
  notes: string;
  appliedDate: string;
  lastUpdated: string;
  url?: string;
  tags: string[];
}

// Company Prep
export interface CompanyTrack {
  id: string;
  name: string;
  logo?: string;
  tier: 1 | 2 | 3;
  modules: PrepModule[];
  resources: string[];
  hiringProcess: string;
}

export interface PrepModule {
  id: string;
  title: string;
  category: "dsa" | "system_design" | "behavioral" | "resume" | "mock";
  completed: boolean;
  notes?: string;
}

// Copilot
export interface CopilotMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  toolCall?: string;
}

export interface CopilotSession {
  id: string;
  title: string;
  messages: CopilotMessage[];
  createdAt: string;
  updatedAt: string;
}

// Activity
export interface ActivityEntry {
  id: string;
  type: "resume" | "GitBranch" | "Link2" | "interview" | "job" | "copilot" | "report";
  title: string;
  description: string;
  score?: number;
  timestamp: string;
}

// Settings
export interface AppSettings {
  aiProvider: AIProviderConfig;
  theme: "dark" | "light" | "system";
  language: string;
  notifications: boolean;
  telemetry: boolean;
}

// Plugin
export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  downloads: number;
  enabled: boolean;
  installed: boolean;
  category: string;
  tags: string[];
}


