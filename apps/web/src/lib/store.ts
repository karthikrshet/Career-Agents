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
  autoFallback: true,
  retryCount: 3,
  retryDelayMs: 1000,
  providerOrder: ["groq", "gemini", "openai", "claude"],
  githubToken: "",
  linkedinKeywordScanner: true,
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

interface CareerAgentsStore {
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
  duplicateCopilotSession: (id: string) => void;
  setCopilotSessions: (sessions: CopilotSession[]) => void;

  // Activity Feed
  activityFeed: ActivityEntry[];
  addActivity: (entry: Omit<ActivityEntry, "id" | "timestamp">) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  updateAIProvider: (config: Partial<AIProviderConfig>) => void;

  // Plugins
  installedPlugins: Record<string, boolean>;
  enabledPlugins: Record<string, boolean>;
  installPlugin: (id: string) => void;
  uninstallPlugin: (id: string) => void;
  enablePlugin: (id: string) => void;
  disablePlugin: (id: string) => void;
  updatePlugin: (id: string) => void;
}

export const useStore = create<CareerAgentsStore>()(
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
        if (!analysis || analysis.overallScore == null) {
          get().updateResumeScore(0);
        } else {
          get().updateResumeScore(analysis.overallScore);
          const roleLabel = analysis.targetRoleName || "General ATS Audit";
          get().addActivity({
            type: "resume",
            title: "Resume Analyzed",
            description: `${analysis.fileName || "Resume"} scored ${analysis.overallScore}% for ${roleLabel}`,
            score: analysis.overallScore,
          });
        }
      },

      // GitBranch
      GitHubAnalysis: null,
      setGitHubAnalysis: (analysis) => {
        set({ GitHubAnalysis: analysis });
        if (!analysis || analysis.portfolioScore == null) {
          get().updateGithubScore(0);
        } else {
          get().updateGithubScore(analysis.portfolioScore);
          get().addActivity({
            type: "GitBranch",
            title: "GitBranch Profile Analyzed",
            description: `@${analysis.username} scored ${analysis.portfolioScore}%`,
            score: analysis.portfolioScore,
          });
        }
      },

      // Link2
      linkedinAnalysis: null,
      setLinkedinAnalysis: (analysis) => {
        set({ linkedinAnalysis: analysis });
        if (!analysis || analysis.overallScore == null) {
          get().updateLinkedinScore(0);
        } else {
          get().updateLinkedinScore(analysis.overallScore);
          get().addActivity({
            type: "Link2",
            title: "Link2 Profile Optimized",
            description: `Profile scored ${analysis.overallScore}% visibility`,
            score: analysis.overallScore,
          });
        }
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
          if (updates && updates.scorecard && updates.scorecard.overallScore != null) {
            get().updateInterviewScore(updates.scorecard.overallScore);
            get().addActivity({
              type: "interview",
              title: "Interview Session Completed",
              description: `${state.currentSession?.company || "General"} ${state.currentSession?.mode || "Prep"} — ${updates.scorecard.overallScore}/100`,
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
      duplicateCopilotSession: (id) =>
        set((state) => {
          const session = state.copilotSessions.find((s) => s.id === id);
          if (!session) return {};
          const duplicated = {
            ...session,
            id: generateId(),
            title: `${session.title} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            pinned: false,
            favorite: false,
            archived: false,
          };
          return {
            copilotSessions: [duplicated, ...state.copilotSessions],
            currentCopilotSession: duplicated,
          };
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

      // Plugins Default State & Actions
      installedPlugins: {},
      enabledPlugins: {},
      installPlugin: (id) =>
        set((state) => ({
          installedPlugins: { ...state.installedPlugins, [id]: true }
        })),
      uninstallPlugin: (id) =>
        set((state) => {
          const installed = { ...state.installedPlugins };
          const enabled = { ...state.enabledPlugins };
          delete installed[id];
          delete enabled[id];
          return { installedPlugins: installed, enabledPlugins: enabled };
        }),
      enablePlugin: (id) =>
        set((state) => ({
          enabledPlugins: { ...state.enabledPlugins, [id]: true }
        })),
      disablePlugin: (id) =>
        set((state) => ({
          enabledPlugins: { ...state.enabledPlugins, [id]: false }
        })),
      updatePlugin: (id) =>
        set((state) => {
          return {};
        }),
    }),
    {
      name: "career-agents-store",
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
        copilotFolders: state.copilotFolders,
        activityFeed: state.activityFeed,
        settings: state.settings,
        installedPlugins: state.installedPlugins,
        enabledPlugins: state.enabledPlugins,
      }),
    }
  )
);


