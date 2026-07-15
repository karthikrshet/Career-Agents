"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { generateId } from "@/lib/utils";
import type {
  AgentItem,
  ExtendedInterviewMode,
  TranscriptMessage,
  VoiceSessionData,
} from "@/components/interview/voice/types";
import type { InterviewDifficulty } from "@/types";

export function useInterviewSession() {
  const [sessionId, setSessionId] = useState<string>("");
  const [history, setHistory] = useState<TranscriptMessage[]>([]);
  const [completedSessionData, setCompletedSessionData] = useState<VoiceSessionData | null>(null);

  const startSession = useCallback(async (params: {
    agent: AgentItem;
    company: string;
    role: string;
    mode: ExtendedInterviewMode;
    difficulty: InterviewDifficulty;
    language: string;
    provider?: string;
    apiKey?: string;
    model?: string;
  }) => {
    const newId = generateId();
    setSessionId(newId);
    setHistory([]);
    setCompletedSessionData(null);

    try {
      const res = await fetch("/api/interview/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          agent: params.agent,
          company: params.company,
          role: params.role,
          mode: params.mode,
          difficulty: params.difficulty,
          language: params.language,
          aiConfig: {
            provider: params.provider || "gemini",
            apiKey: params.apiKey,
            model: params.model,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to start interview session");
      }

      const data = await res.json();
      const firstQ = data.question;

      const firstMsg: TranscriptMessage = {
        id: generateId(),
        speaker: "agent",
        content: firstQ,
        timestamp: new Date().toISOString(),
      };

      setHistory([firstMsg]);
      return firstQ;
    } catch (err: any) {
      toast.error(err.message || "Could not launch interview.");
      throw err;
    }
  }, []);

  const submitAnswer = useCallback(async (answerText: string, params: {
    agent: AgentItem;
    company: string;
    role: string;
    mode: ExtendedInterviewMode;
    difficulty: InterviewDifficulty;
    language: string;
    provider?: string;
    apiKey?: string;
    model?: string;
  }) => {
    const userMsg: TranscriptMessage = {
      id: generateId(),
      speaker: "candidate",
      content: answerText,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...history, userMsg];
    setHistory(newHistory);

    try {
      const res = await fetch("/api/interview/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "next_question",
          agent: params.agent,
          company: params.company,
          role: params.role,
          mode: params.mode,
          difficulty: params.difficulty,
          language: params.language,
          history: newHistory,
          aiConfig: {
            provider: params.provider || "gemini",
            apiKey: params.apiKey,
            model: params.model,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch follow-up question");
      }

      const data = await res.json();
      const nextQ = data.question;

      const agentMsg: TranscriptMessage = {
        id: generateId(),
        speaker: "agent",
        content: nextQ,
        timestamp: new Date().toISOString(),
      };

      setHistory((h) => [...h, agentMsg]);
      return nextQ;
    } catch (err: any) {
      toast.error(err.message || "Failed to generate follow-up question.");
      throw err;
    }
  }, [history]);

  const evaluateSession = useCallback(async (durationSeconds: number, params: {
    agent: AgentItem;
    company: string;
    role: string;
    mode: ExtendedInterviewMode;
    difficulty: InterviewDifficulty;
    language: string;
    durationMinutes: number;
    provider?: string;
    apiKey?: string;
    model?: string;
  }) => {
    try {
      const res = await fetch("/api/interview/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate",
          agent: params.agent,
          company: params.company,
          role: params.role,
          mode: params.mode,
          difficulty: params.difficulty,
          language: params.language,
          history,
          aiConfig: {
            provider: params.provider || "gemini",
            apiKey: params.apiKey,
            model: params.model,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Evaluation failed");
      }

      const evalData = await res.json();

      const sessionObj: VoiceSessionData = {
        id: sessionId,
        agentId: params.agent.id,
        agentName: params.agent.name,
        company: params.company,
        role: params.role,
        mode: params.mode,
        difficulty: params.difficulty,
        language: params.language,
        targetDurationMinutes: params.durationMinutes,
        startedAt: new Date(Date.now() - durationSeconds * 1000).toISOString(),
        completedAt: new Date().toISOString(),
        durationSeconds,
        history,
        scorecard: evalData.scores ? evalData : undefined,
        isDemoMode: evalData.isDemoMode,
      };

      setCompletedSessionData(sessionObj);
      return sessionObj;
    } catch (err: any) {
      toast.error(err.message || "Failed to generate evaluation scorecard.");
      throw err;
    }
  }, [history, sessionId]);

  return {
    sessionId,
    history,
    completedSessionData,
    startSession,
    submitAnswer,
    evaluateSession,
  };
}
