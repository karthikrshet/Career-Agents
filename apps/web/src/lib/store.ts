"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CareerMetrics, UserProfile, ResumeAnalysis, GitHubAnalysis,
  LinkedInAnalysis, InterviewSession, JobApplication, CopilotSession, CopilotFolder,
  ActivityEntry, AppSettings, AIProviderConfig, CompanyTrack, PrepModule
} from "@/types";
import { calculateCareerScore, generateId } from "@/lib/utils";

const DEFAULT_AI_CONFIG: AIProviderConfig = {
  provider: "groq",
  model: "llama3-70b-8192",
  temperature: 0.7,
  maxTokens: 4096,
  streaming: true,
};

const DEFAULT_SETTINGS: AppSettings = {
  aiProvider: DEFAULT_AI_CONFIG,
  theme: "dark",
  language: "en",
  notifications: true,
  telemetry: false,
};

const DEFAULT_METRICS: CareerMetrics = {
  careerScore: 0,
  resumeScore: 0,
  githubScore: 0,
  linkedinScore: 0,
  interviewScore: 0,
  applicationScore: 0,
  lastUpdated: new Date().toISOString(),
};

interface CareerOSStore {
  // Profile
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;

  // Metrics
  metrics: CareerMetrics;
  updateResumeScore: (score: number) => void;
  updateGithubScore: (score: number) => void;
  updateLinkedinScore: (score: number) => void;
  updateInterviewScore: (score: number) => void;

  // Resume
  resumeAnalysis: ResumeAnalysis | null;
  setResumeAnalysis: (analysis: ResumeAnalysis) => void;

  // GitBranch
  GitHubAnalysis: GitHubAnalysis | null;
  setGitHubAnalysis: (analysis: GitHubAnalysis) => void;

  // Link2
  linkedinAnalysis: LinkedInAnalysis | null;
  setLinkedinAnalysis: (analysis: LinkedInAnalysis) => void;

  // Interview
  interviewSessions: InterviewSession[];
  currentSession: InterviewSession | null;
  addInterviewSession: (session: InterviewSession) => void;
  setCurrentSession: (session: InterviewSession | null) => void;
  updateSessionScorecard: (sessionId: string, session: Partial<InterviewSession>) => void;

  // Job Tracker
  jobApplications: JobApplication[];
  addJobApplication: (job: JobApplication) => void;
  updateJobApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteJobApplication: (id: string) => void;
  updateApplicationScore: (score: number) => void;

  // Company Prep
  companyProgress: Record<string, Record<string, boolean>>;
  togglePrepModule: (companyId: string, moduleId: string) => void;

  // Copilot
  copilotSessions: CopilotSession[];
  currentCopilotSession: CopilotSession | null;
  copilotFolders: CopilotFolder[];
  startCopilotSession: () => void;
  appendCopilotMessage: (role: "user" | "assistant", content: string) => void;
  createCopilotFolder: (name: string, color?: string) => void;
  deleteCopilotFolder: (id: string) => void;
  renameCopilotFolder: (id: string, name: string) => void;
  updateSessionFolder: (sessionId: string, folderId?: string) => void;
  toggleSessionPin: (sessionId: string) => void;
  toggleSessionFavorite: (sessionId: string) => void;
  toggleSessionArchive: (sessionId: string) => void;
  deleteCopilotSession: (id: string) => void;
  renameCopilotSession: (id: string, title: string) => void;
  setCopilotSessions: (sessions: CopilotSession[]) => void;

  // Activity Feed
  activityFeed: ActivityEntry[];
  addActivity: (entry: Omit<ActivityEntry, "id" | "timestamp">) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  updateAIProvider: (config: Partial<AIProviderConfig>) => void;
}

export const useStore = create<CareerOSStore>()(
  persist(
    (set, get) => ({
      // Profile
      profile: null,
      setProfile: (profile) => set({ profile }),

      // Metrics
      metrics: DEFAULT_METRICS,

      updateResumeScore: (score) =>
        set((state) => {
          const m = { ...state.metrics, resumeScore: score, lastUpdated: new Date().toISOString() };
          m.careerScore = calculateCareerScore(m.resumeScore, m.githubScore, m.linkedinScore, m.interviewScore, m.applicationScore);
          return { metrics: m };
        }),

      updateGithubScore: (score) =>
        set((state) => {
          const m = { ...state.metrics, githubScore: score, lastUpdated: new Date().toISOString() };
          m.careerScore = calculateCareerScore(m.resumeScore, m.githubScore, m.linkedinScore, m.interviewScore, m.applicationScore);
          return { metrics: m };
        }),

      updateLinkedinScore: (score) =>
        set((state) => {
          const m = { ...state.metrics, linkedinScore: score, lastUpdated: new Date().toISOString() };
          m.careerScore = calculateCareerScore(m.resumeScore, m.githubScore, m.linkedinScore, m.interviewScore, m.applicationScore);
          return { metrics: m };
        }),

      updateInterviewScore: (score) =>
        set((state) => {
          const m = { ...state.metrics, interviewScore: score, lastUpdated: new Date().toISOString() };
          m.careerScore = calculateCareerScore(m.resumeScore, m.githubScore, m.linkedinScore, m.interviewScore, m.applicationScore);
          return { metrics: m };
        }),

      // Resume
      resumeAnalysis: null,
      setResumeAnalysis: (analysis) => {
        set({ resumeAnalysis: analysis });
        get().updateResumeScore(analysis.overallScore);
        get().addActivity({
          type: "resume",
          title: "Resume Analyzed",
          description: `${analysis.fileName} scored ${analysis.overallScore}%`,
          score: analysis.overallScore,
        });
      },

      // GitBranch
      GitHubAnalysis: null,
      setGitHubAnalysis: (analysis) => {
        set({ GitHubAnalysis: analysis });
        get().updateGithubScore(analysis.portfolioScore);
        get().addActivity({
          type: "GitBranch",
          title: "GitBranch Profile Analyzed",
          description: `@${analysis.username} scored ${analysis.portfolioScore}%`,
          score: analysis.portfolioScore,
        });
      },

      // Link2
      linkedinAnalysis: null,
      setLinkedinAnalysis: (analysis) => {
        set({ linkedinAnalysis: analysis });
        get().updateLinkedinScore(analysis.overallScore);
        get().addActivity({
          type: "Link2",
          title: "Link2 Profile Optimized",
          description: `Profile scored ${analysis.overallScore}% visibility`,
          score: analysis.overallScore,
        });
      },

      // Interview
      interviewSessions: [],
      currentSession: null,
      addInterviewSession: (session) =>
        set((state) => ({ interviewSessions: [session, ...state.interviewSessions] })),
      setCurrentSession: (session) => set({ currentSession: session }),
      updateSessionScorecard: (sessionId, updates) =>
        set((state) => {
          const sessions = state.interviewSessions.map((s) =>
            s.id === sessionId ? { ...s, ...updates } : s
          );
          if (updates.scorecard) {
            get().updateInterviewScore(updates.scorecard.overallScore);
            get().addActivity({
              type: "interview",
              title: "Interview Session Completed",
              description: `${state.currentSession?.company} ${state.currentSession?.mode} — ${updates.scorecard.overallScore}/100`,
              score: updates.scorecard.overallScore,
            });
          }
          return { interviewSessions: sessions, currentSession: null };
        }),

      // Job Tracker
      jobApplications: [],
      addJobApplication: (job) => {
        set((state) => {
          const apps = [job, ...state.jobApplications];
          const score = Math.min(100, Math.round((apps.length / 10) * 100));
          get().updateApplicationScore(score);
          return { jobApplications: apps };
        });
        get().addActivity({
          type: "job",
          title: "Application Added",
          description: `${job.role} at ${job.company}`,
        });
      },
      updateJobApplication: (id, updates) =>
        set((state) => ({
          jobApplications: state.jobApplications.map((j) => (j.id === id ? { ...j, ...updates, lastUpdated: new Date().toISOString() } : j)),
        })),
      deleteJobApplication: (id) =>
        set((state) => ({ jobApplications: state.jobApplications.filter((j) => j.id !== id) })),

      // Company Prep
      companyProgress: {},
      togglePrepModule: (companyId, moduleId) =>
        set((state) => ({
          companyProgress: {
            ...state.companyProgress,
            [companyId]: {
              ...(state.companyProgress[companyId] || {}),
              [moduleId]: !(state.companyProgress[companyId]?.[moduleId]),
            },
          },
        })),

      // App score helper (defined inline to avoid TS declaration tricks)
      updateApplicationScore: (score: number) =>
        set((state) => {
          const m = { ...state.metrics, applicationScore: score, lastUpdated: new Date().toISOString() };
          m.careerScore = calculateCareerScore(m.resumeScore, m.githubScore, m.linkedinScore, m.interviewScore, m.applicationScore);
          return { metrics: m };
        }),

      // Copilot
      copilotSessions: [],
      currentCopilotSession: null,
      copilotFolders: [],
      startCopilotSession: () => {
        const session: CopilotSession = {
          id: generateId(),
          title: "New Conversation",
          messages: [{
            id: generateId(),
            role: "assistant",
            content: "Hello! I am Career Copilot, your AI-powered career assistant. I have access to your profile, resume analysis, GitHub data, and more. How can I help you today?\n\nQuick actions:\n- Type **analyze my resume** to get AI feedback\n- Type **prepare me for Google** to generate a study plan\n- Type **review my GitHub** to get portfolio tips",
            timestamp: new Date().toISOString(),
          }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pinned: false,
          archived: false,
          favorite: false,
        };
        set((state) => ({
          currentCopilotSession: session,
          copilotSessions: [session, ...state.copilotSessions],
        }));
      },
      appendCopilotMessage: (role, content) =>
        set((state) => {
          if (!state.currentCopilotSession) return {};
          const msg = { id: generateId(), role, content, timestamp: new Date().toISOString() };
          const updated = {
            ...state.currentCopilotSession,
            messages: [...state.currentCopilotSession.messages, msg],
            updatedAt: new Date().toISOString(),
          };
          return {
            currentCopilotSession: updated,
            copilotSessions: state.copilotSessions.map((s) => (s.id === updated.id ? updated : s)),
          };
        }),
      createCopilotFolder: (name, color) =>
        set((state) => ({
          copilotFolders: [...state.copilotFolders, { id: generateId(), name, color, createdAt: new Date().toISOString() }],
        })),
      deleteCopilotFolder: (id) =>
        set((state) => ({
          copilotFolders: state.copilotFolders.filter((f) => f.id !== id),
          copilotSessions: state.copilotSessions.map((s) => (s.folderId === id ? { ...s, folderId: undefined } : s)),
        })),
      renameCopilotFolder: (id, name) =>
        set((state) => ({
          copilotFolders: state.copilotFolders.map((f) => (f.id === id ? { ...f, name } : f)),
        })),
      updateSessionFolder: (sessionId, folderId) =>
        set((state) => {
          const updatedSessions = state.copilotSessions.map((s) => (s.id === sessionId ? { ...s, folderId } : s));
          const current = state.currentCopilotSession && state.currentCopilotSession.id === sessionId
            ? { ...state.currentCopilotSession, folderId }
            : state.currentCopilotSession;
          return { copilotSessions: updatedSessions, currentCopilotSession: current };
        }),
      toggleSessionPin: (sessionId) =>
        set((state) => {
          const updatedSessions = state.copilotSessions.map((s) => (s.id === sessionId ? { ...s, pinned: !s.pinned } : s));
          const current = state.currentCopilotSession && state.currentCopilotSession.id === sessionId
            ? { ...state.currentCopilotSession, pinned: !state.currentCopilotSession.pinned }
            : state.currentCopilotSession;
          return { copilotSessions: updatedSessions, currentCopilotSession: current };
        }),
      toggleSessionFavorite: (sessionId) =>
        set((state) => {
          const updatedSessions = state.copilotSessions.map((s) => (s.id === sessionId ? { ...s, favorite: !s.favorite } : s));
          const current = state.currentCopilotSession && state.currentCopilotSession.id === sessionId
            ? { ...state.currentCopilotSession, favorite: !state.currentCopilotSession.favorite }
            : state.currentCopilotSession;
          return { copilotSessions: updatedSessions, currentCopilotSession: current };
        }),
      toggleSessionArchive: (sessionId) =>
        set((state) => {
          const updatedSessions = state.copilotSessions.map((s) => (s.id === sessionId ? { ...s, archived: !s.archived } : s));
          const current = state.currentCopilotSession && state.currentCopilotSession.id === sessionId
            ? { ...state.currentCopilotSession, archived: !state.currentCopilotSession.archived }
            : state.currentCopilotSession;
          return { copilotSessions: updatedSessions, currentCopilotSession: current };
        }),
      deleteCopilotSession: (id) =>
        set((state) => {
          const updatedSessions = state.copilotSessions.filter((s) => s.id !== id);
          const current = state.currentCopilotSession && state.currentCopilotSession.id === id ? null : state.currentCopilotSession;
          return { copilotSessions: updatedSessions, currentCopilotSession: current };
        }),
      renameCopilotSession: (id, title) =>
        set((state) => {
          const updatedSessions = state.copilotSessions.map((s) => (s.id === id ? { ...s, title } : s));
          const current = state.currentCopilotSession && state.currentCopilotSession.id === id ? { ...state.currentCopilotSession, title } : state.currentCopilotSession;
          return { copilotSessions: updatedSessions, currentCopilotSession: current };
        }),
      setCopilotSessions: (sessions) =>
        set(() => ({ copilotSessions: sessions })),

      // Activity
      activityFeed: [],
      addActivity: (entry) =>
        set((state) => ({
          activityFeed: [
            { ...entry, id: generateId(), timestamp: new Date().toISOString() },
            ...state.activityFeed.slice(0, 49),
          ],
        })),

      // Settings
      settings: DEFAULT_SETTINGS,
      updateSettings: (updates) =>
        set((state) => ({ settings: { ...state.settings, ...updates } })),
      updateAIProvider: (config) =>
        set((state) => ({
          settings: {
            ...state.settings,
            aiProvider: { ...state.settings.aiProvider, ...config },
          },
        })),
    }),
    {
      name: "career-os-store",
      partialize: (state) => ({
        profile: state.profile,
        metrics: state.metrics,
        resumeAnalysis: state.resumeAnalysis,
        GitHubAnalysis: state.GitHubAnalysis,
        linkedinAnalysis: state.linkedinAnalysis,
        interviewSessions: state.interviewSessions,
        jobApplications: state.jobApplications,
        companyProgress: state.companyProgress,
        copilotSessions: state.copilotSessions,
        activityFeed: state.activityFeed,
        settings: state.settings,
      }),
    }
  )
);


