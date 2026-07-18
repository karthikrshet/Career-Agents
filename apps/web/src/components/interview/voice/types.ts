import { z } from "zod";
import type { InterviewMode, InterviewDifficulty, AIProvider } from "@/types";

export type InterviewFSMState =
  | "IDLE"
  | "CONFIGURING"
  | "STARTING"
  | "INTERVIEWER_SPEAKING"
  | "LISTENING"
  | "PROCESSING"
  | "WAITING_FOR_NEXT_QUESTION"
  | "PAUSED"
  | "COMPLETED"
  | "ERROR";

export type MicStatus =
  | "READY"
  | "LISTENING"
  | "PROCESSING"
  | "SPEAKING"
  | "PAUSED"
  | "ERROR";

export type VoiceMode = "voice" | "text";

export type ExtendedInterviewMode =
  | "behavioral"
  | "technical"
  | "dsa"
  | "system_design"
  | "frontend"
  | "backend"
  | "fullstack"
  | "ai_ml"
  | "devops"
  | "database"
  | "cloud"
  | "hr"
  | "managerial"
  | "mixed";

export interface AgentItem {
  id: string;
  name: string;
  division: string;
  description: string;
  emoji?: string;
  color?: string;
  vibe?: string;
  skills?: string[];
  capabilities?: string[];
  filename?: string;
}

export interface VoiceLanguage {
  name: string;
  code: string;
}

export interface TranscriptMessage {
  id: string;
  speaker: "agent" | "candidate" | "system";
  content: string;
  timestamp: string;
  audioDurationMs?: number;
}

export interface VoiceScorecard {
  overallScore: number;
  technicalKnowledge: number;
  problemSolving: number;
  communication: number;
  clarity: number;
  confidence: number;
  depth: number;
  correctness: number;
  structure: number;
  behavioralReasoning: number;
  roleFit: number;
  scores?: {
    overall?: number;
    technicalKnowledge?: number;
    problemSolving?: number;
    communication?: number;
    clarity?: number;
    confidence?: number;
    depth?: number;
    correctness?: number;
    structure?: number;
    behavioralReasoning?: number;
    roleFit?: number;
  };
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  questionFeedback: { question: string; answer: string; feedback: string; score: number }[];
  starBreakdown?: { situation?: string; task?: string; action?: string; result?: string };
}

export interface VoiceSessionData {
  id: string;
  agentId: string;
  agentName: string;
  company: string;
  role: string;
  mode: ExtendedInterviewMode;
  difficulty: InterviewDifficulty;
  language: string;
  targetDurationMinutes: number;
  startedAt: string;
  completedAt?: string;
  durationSeconds: number;
  history: TranscriptMessage[];
  scorecard?: VoiceScorecard;
  isDemoMode?: boolean;
}

// ─── Zod Schemas for Security & API Input Validation ─────────────────────────

export const AgentConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  division: z.string().optional(),
});

export const AIConfigSchema = z.object({
  provider: z.string().default("gemini"),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  baseUrl: z.string().optional(),
  apiKey: z.string().optional(),
});

export const StartSessionSchema = z.object({
  action: z.literal("start"),
  agent: AgentConfigSchema,
  company: z.string().min(1),
  role: z.string().min(1),
  mode: z.string().min(1),
  difficulty: z.string().min(1),
  language: z.string().default("en-US"),
  aiConfig: AIConfigSchema.optional(),
});

export const NextQuestionSchema = z.object({
  action: z.literal("next_question"),
  agent: AgentConfigSchema,
  company: z.string().min(1),
  role: z.string().min(1),
  mode: z.string().min(1),
  difficulty: z.string().min(1),
  language: z.string().default("en-US"),
  history: z.array(
    z.object({
      id: z.string().optional(),
      speaker: z.string(),
      content: z.string(),
      timestamp: z.string().optional(),
    })
  ),
  aiConfig: AIConfigSchema.optional(),
});

export const EvaluateSessionSchema = z.object({
  action: z.literal("evaluate"),
  agent: AgentConfigSchema,
  company: z.string().min(1),
  role: z.string().min(1),
  mode: z.string().min(1),
  difficulty: z.string().min(1),
  language: z.string().default("en-US"),
  history: z.array(
    z.object({
      speaker: z.string(),
      content: z.string(),
      timestamp: z.string().optional(),
    })
  ),
  aiConfig: AIConfigSchema.optional(),
});
