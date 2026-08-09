"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Play, Square, Sparkles, Brain, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useGatewayStore } from "@/lib/gateway-store";
import { generateId, resolveApiKey } from "@/lib/utils";
import type { InterviewDifficulty, InterviewSession } from "@/types";

import type {
  InterviewFSMState,
  MicStatus,
  VoiceMode,
  ExtendedInterviewMode,
  AgentItem,
  TranscriptMessage,
  VoiceSessionData,
} from "./types";

import { BrowserSupportBanner } from "./BrowserSupportBanner";
import { MicrophonePermission } from "./MicrophonePermission";
import { AgentSelector } from "./AgentSelector";
import { InterviewConfiguration } from "./InterviewConfiguration";
import { VoiceSettings } from "./VoiceSettings";
import { InterviewerOrb } from "./InterviewerOrb";
import { AudioVisualizer } from "./AudioVisualizer";
import { InterviewTimer } from "./InterviewTimer";
import { InterviewProgress } from "./InterviewProgress";
import { QuestionCard } from "./QuestionCard";
import { AnswerComposer } from "./AnswerComposer";
import { VoiceControls } from "./VoiceControls";
import { TranscriptPanel } from "./TranscriptPanel";
import { InterviewScorecard } from "./InterviewScorecard";
import { InterviewHistory } from "./InterviewHistory";
import agentRegistry from "../../../../../../agent-registry.json";

const ALL_AGENTS = (agentRegistry?.agents || []) as AgentItem[];

import { VoiceHeaderBanner } from "./VoiceHeaderBanner";

interface VoiceInterviewShellProps {
  initialSessionId?: string;
}

export function VoiceInterviewShell({ initialSessionId }: VoiceInterviewShellProps) {
  const [mounted, setMounted] = useState(false);
  // Auto-load or auto-start session if initialSessionId URL param is present
  useEffect(() => {
    if (initialSessionId && mounted && fsmState === "CONFIGURING") {
      const existing = interviewSessions.find((s) => s.id === initialSessionId);
      if (existing && existing.scorecard) {
        setCompletedSessionData({
          id: existing.id,
          agentId: selectedAgent.id,
          agentName: selectedAgent.name,
          company: existing.company,
          role: existing.role,
          mode: existing.mode as any,
          difficulty: existing.difficulty,
          language,
          targetDurationMinutes: durationMinutes,
          startedAt: existing.startedAt,
          completedAt: existing.completedAt || new Date().toISOString(),
          durationSeconds: 1200,
          history: (existing.responses || []).map((r) => ({
            id: r.questionId,
            speaker: "candidate",
            content: r.answer,
            timestamp: r.submittedAt || new Date().toISOString(),
          })),
          scorecard: existing.scorecard as any,
        });
        setFsmState("COMPLETED");
      } else {
        startSession(initialSessionId);
      }
    }
  }, [initialSessionId, mounted]);

  const interviewSessions = useStore((s) => s.interviewSessions);
  const addInterviewSession = useStore((s) => s.addInterviewSession);
  const updateSessionScorecard = useStore((s) => s.updateSessionScorecard);
  const settings = useStore((s) => s.settings);
  const activeProvider = useGatewayStore((s) => s.activeProvider);
  const activeModel = useGatewayStore((s) => s.activeModel);

  // FSM state
  const [fsmState, setFsmState] = useState<InterviewFSMState>("CONFIGURING");

  // Configuration settings
  const [selectedAgent, setSelectedAgent] = useState<AgentItem>(
    ALL_AGENTS.find((a) => a.id.includes("interview") || a.id.includes("coach")) || ALL_AGENTS[0]
  );
  const [company, setCompany] = useState("Google");
  const [role, setRole] = useState("Software Engineer");
  const [mode, setMode] = useState<ExtendedInterviewMode>("technical");
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>("Medium");
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [language, setLanguage] = useState("en-US");

  // Voice settings
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>("voice");
  const [isMuted, setIsMuted] = useState(false);

  // Session runtime
  const [history, setHistory] = useState<TranscriptMessage[]>([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [timerSec, setTimerSec] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [completedSessionData, setCompletedSessionData] = useState<VoiceSessionData | null>(null);

  // Audio capabilities
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState("");
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(true);
  const [hasSpeechSynthesis, setHasSpeechSynthesis] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Feature detection
  useEffect(() => {
    if (typeof window !== "undefined") {
      const rec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setHasSpeechRecognition(!!rec);
      setHasSpeechSynthesis(!!window.speechSynthesis);

      if (window.speechSynthesis) {
        const load = () => {
          const v = window.speechSynthesis.getVoices();
          setBrowserVoices(v);
        };
        load();
        window.speechSynthesis.onvoiceschanged = load;
      }
    }
  }, []);

  // Filter voices by language
  const filteredVoices = useMemo(() => {
    const prefix = language.split("-")[0];
    return browserVoices.filter((v) => v.lang.startsWith(prefix) || v.lang === language);
  }, [browserVoices, language]);

  useEffect(() => {
    if (filteredVoices.length > 0) {
      const pref = filteredVoices.find((v) => v.name.includes("Google") || v.name.includes("Natural")) || filteredVoices[0];
      setSelectedVoiceName(pref.name);
    }
  }, [filteredVoices]);

  // Session timer
  useEffect(() => {
    if (fsmState !== "CONFIGURING" && fsmState !== "COMPLETED" && fsmState !== "IDLE" && fsmState !== "PAUSED") {
      timerRef.current = setInterval(() => setTimerSec((t) => t + 1), 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [fsmState]);

  // Init speech recognition
  const SpeechRecognition = typeof window !== "undefined" ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = language;

      rec.onresult = (event: any) => {
        let text = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        if (text.trim() !== "") {
          setCurrentResponse(text);
        }
      };

      rec.onerror = (e: any) => {
        console.error("Speech Recognition error:", e);
        const errType = e.error || "";
        if (errType === "not-allowed" || errType === "service-not-allowed") {
          setPermissionGranted(false);
          setIsListening(false);
          // Only show toast if user was actively trying to record/listen
          if (isListening || fsmState === "LISTENING") {
            toast.info("Microphone access denied. Switched to Text Mode.");
            setVoiceMode("text");
            setFsmState("WAITING_FOR_NEXT_QUESTION");
          }
        } else if (errType !== "no-speech" && (isListening || fsmState === "LISTENING")) {
          toast.error(`Speech input notice: ${errType}`);
        }
      };

      rec.onend = () => {
        setIsListening(false);
        if (fsmState === "LISTENING") {
          setFsmState("WAITING_FOR_NEXT_QUESTION");
        }
      };

      recognitionRef.current = rec;
    }
  }, [language, SpeechRecognition, fsmState]);

  // TTS helper
  const speakQuestion = (text: string) => {
    if (isMuted || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;

    if (selectedVoiceName) {
      const v = browserVoices.find((voice) => voice.name === selectedVoiceName);
      if (v) utterance.voice = v;
    }

    utterance.onstart = () => setFsmState("INTERVIEWER_SPEAKING");
    utterance.onend = () => setFsmState("WAITING_FOR_NEXT_QUESTION");
    utterance.onerror = () => setFsmState("WAITING_FOR_NEXT_QUESTION");

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setPermissionGranted(true);
      toast.success("Microphone permission granted.");
    } catch (err) {
      setPermissionGranted(false);
      toast.info("Microphone access denied. Switched to Text Mode.");
      setVoiceMode("text");
    }
  };

  const toggleRecording = async () => {
    if (!permissionGranted) {
      await requestMicPermission();
    }

    if (!recognitionRef.current) {
      toast.error("Speech recognition unsupported. Switching to Text Mode.");
      setVoiceMode("text");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setFsmState("WAITING_FOR_NEXT_QUESTION");
    } else {
      stopSpeaking();
      setCurrentResponse("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setFsmState("LISTENING");
      } catch (err) {
        console.error("Mic start failed:", err);
      }
    }
  };

  const startSession = async (overrideId?: string) => {
    const rawId = generateId();
    const cleanRoleSlug = role.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const cleanCompanySlug = company.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const uniqueSlug = overrideId || `${cleanCompanySlug}-${cleanRoleSlug}-${rawId.slice(0, 8)}`;

    setSessionId(uniqueSlug);
    setHistory([]);
    setTimerSec(0);
    setCurrentResponse("");
    setFsmState("STARTING");

    if (typeof window !== "undefined" && window.location.pathname !== `/interview/voice/${uniqueSlug}`) {
      window.history.pushState(null, "", `/interview/voice/${uniqueSlug}`);
    }

    try {
      const res = await fetch("/api/interview/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          agent: selectedAgent,
          company,
          role,
          mode,
          difficulty,
          language,
          aiConfig: {
            provider: activeProvider || "gemini",
            apiKey: resolveApiKey(activeProvider || "gemini", settings),
            model: activeModel,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to launch interview session");
      }

      const data = await res.json();
      const firstQ = data.question;

      const agentMsg: TranscriptMessage = {
        id: generateId(),
        speaker: "agent",
        content: firstQ,
        timestamp: new Date().toISOString(),
      };

      setHistory([agentMsg]);
      setFsmState("WAITING_FOR_NEXT_QUESTION");

      if (autoSpeak) {
        setTimeout(() => speakQuestion(firstQ), 300);
      }
    } catch (err: any) {
      setFsmState("CONFIGURING");
      toast.error(err.message || "Could not launch interview.");
    }
  };

  const submitAnswer = async () => {
    const text = currentResponse.trim();
    if (!text) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    stopSpeaking();

    const userMsg: TranscriptMessage = {
      id: generateId(),
      speaker: "candidate",
      content: text,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setCurrentResponse("");
    setFsmState("PROCESSING");

    try {
      const res = await fetch("/api/interview/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "next_question",
          agent: selectedAgent,
          company,
          role,
          mode,
          difficulty,
          language,
          history: newHistory,
          aiConfig: {
            provider: activeProvider || "gemini",
            apiKey: resolveApiKey(activeProvider || "gemini", settings),
            model: activeModel,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch follow-up question");
      }

      const data = await res.json();
      const nextQ = data.question;

      const nextAgentMsg: TranscriptMessage = {
        id: generateId(),
        speaker: "agent",
        content: nextQ,
        timestamp: new Date().toISOString(),
      };

      setHistory((h) => [...h, nextAgentMsg]);
      setFsmState("WAITING_FOR_NEXT_QUESTION");

      if (autoSpeak) {
        setTimeout(() => speakQuestion(nextQ), 300);
      }
    } catch (err: any) {
      setFsmState("WAITING_FOR_NEXT_QUESTION");
      toast.error(err.message || "Failed to generate follow-up question.");
    }
  };

  const finishAndEvaluate = async () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    stopSpeaking();

    setFsmState("PROCESSING");

    try {
      const res = await fetch("/api/interview/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate",
          agent: selectedAgent,
          company,
          role,
          mode,
          difficulty,
          language,
          history,
          aiConfig: {
            provider: activeProvider || "gemini",
            apiKey: resolveApiKey(activeProvider || "gemini", settings),
            model: activeModel,
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
        agentId: selectedAgent.id,
        agentName: selectedAgent.name,
        company,
        role,
        mode,
        difficulty,
        language,
        targetDurationMinutes: durationMinutes,
        startedAt: new Date(Date.now() - timerSec * 1000).toISOString(),
        completedAt: new Date().toISOString(),
        durationSeconds: timerSec,
        history,
        scorecard: evalData.scores ? evalData : undefined,
        isDemoMode: evalData.isDemoMode,
      };

      setCompletedSessionData(sessionObj);
      setFsmState("COMPLETED");

      // Save to global Zustand store
      const legacySession: InterviewSession = {
        id: sessionId,
        company,
        role,
        mode: mode === "dsa" ? "technical" : (mode as any),
        difficulty,
        round: "Technical",
        questions: history.filter((h) => h.speaker === "agent").map((h, i) => ({ id: `q-${i}`, text: h.content, type: mode as any })),
        responses: history.filter((h) => h.speaker === "candidate").map((h, i) => ({ questionId: `q-${i}`, answer: h.content, submittedAt: h.timestamp })),
        startedAt: sessionObj.startedAt,
        completedAt: sessionObj.completedAt,
      };

      addInterviewSession(legacySession);
      updateSessionScorecard(sessionId, { scorecard: evalData });
    } catch (err: any) {
      setFsmState("WAITING_FOR_NEXT_QUESTION");
      toast.error(err.message || "Failed to generate evaluation scorecard.");
    }
  };

  const getMicStatus = (): MicStatus => {
    if (fsmState === "LISTENING") return "LISTENING";
    if (fsmState === "INTERVIEWER_SPEAKING") return "SPEAKING";
    if (fsmState === "PROCESSING" || fsmState === "STARTING") return "PROCESSING";
    if (fsmState === "PAUSED") return "PAUSED";
    if (fsmState === "ERROR") return "ERROR";
    return "READY";
  };

  const currentQuestionText = useMemo(() => {
    const lastAgent = [...history].reverse().find((h) => h.speaker === "agent");
    return lastAgent ? lastAgent.content : "";
  }, [history]);

  const questionsAnswered = useMemo(() => history.filter((h) => h.speaker === "candidate").length, [history]);

  return (
    <div className="flex flex-col w-full min-h-full space-y-4">
      <BrowserSupportBanner
        hasSpeechRecognition={hasSpeechRecognition}
        hasSpeechSynthesis={hasSpeechSynthesis}
        onSwitchToTextMode={() => setVoiceMode("text")}
      />

      <AnimatePresence mode="wait">
        {/* CONFIGURING STAGE */}
        {fsmState === "CONFIGURING" && (
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="max-w-7xl mx-auto space-y-4 pb-12 w-full"
          >
            <VoiceHeaderBanner onStartClick={startSession} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <AgentSelector selectedAgent={selectedAgent} onSelectAgent={setSelectedAgent} />
              </div>

              <div className="space-y-6">
                <InterviewConfiguration
                  company={company}
                  setCompany={setCompany}
                  role={role}
                  setRole={setRole}
                  mode={mode}
                  setMode={setMode}
                  difficulty={difficulty}
                  setDifficulty={setDifficulty}
                  durationMinutes={durationMinutes}
                  setDurationMinutes={setDurationMinutes}
                  language={language}
                  setLanguage={setLanguage}
                />

                <VoiceSettings
                  rate={rate}
                  setRate={setRate}
                  pitch={pitch}
                  setPitch={setPitch}
                  autoSpeak={autoSpeak}
                  setAutoSpeak={setAutoSpeak}
                  voiceMode={voiceMode}
                  setVoiceMode={setVoiceMode}
                  browserVoices={filteredVoices}
                  selectedVoiceName={selectedVoiceName}
                  setSelectedVoiceName={setSelectedVoiceName}
                />

                <button
                  onClick={() => startSession()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white font-bold text-sm shadow-lg hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 border-0"
                >
                  <Play className="w-4 h-4 fill-current" /> Start Live Interview
                </button>
              </div>
            </div>

            {interviewSessions.length > 0 && (
              <InterviewHistory
                sessions={interviewSessions}
                onSelectSession={(s) => {
                  if (typeof window !== "undefined") {
                    window.history.pushState(null, "", `/interview/voice/${s.id}`);
                  }
                  if (s.scorecard) {
                    setCompletedSessionData({
                      id: s.id,
                      agentId: selectedAgent.id,
                      agentName: selectedAgent.name,
                      company: s.company,
                      role: s.role,
                      mode: s.mode as any,
                      difficulty: s.difficulty,
                      language,
                      targetDurationMinutes: durationMinutes,
                      startedAt: s.startedAt,
                      completedAt: s.completedAt || new Date().toISOString(),
                      durationSeconds: 1200,
                      history: (s.responses || []).map((r) => ({
                        id: r.questionId,
                        speaker: "candidate",
                        content: r.answer,
                        timestamp: r.submittedAt || new Date().toISOString(),
                      })),
                      scorecard: s.scorecard as any,
                    });
                    setFsmState("COMPLETED");
                    toast.success(`Loaded session: ${s.company} — ${s.role}`);
                  } else {
                    toast.info(`Draft session loaded for ${s.company}`);
                  }
                }}
              />
            )}
          </motion.div>
        )}

        {/* LIVE SESSION STAGE */}
        {fsmState !== "CONFIGURING" && fsmState !== "COMPLETED" && (
          <motion.div
            key="session"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-5xl mx-auto space-y-5 w-full flex-1 flex flex-col justify-between pb-12"
          >
            {/* Top Bar Status */}
            <div className="flex items-center justify-between bg-[#080d21] border border-white/10 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    stopSpeaking();
                    setFsmState("CONFIGURING");
                    if (typeof window !== "undefined") {
                      window.history.pushState(null, "", "/interview/voice");
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1 shrink-0"
                >
                  ← Back
                </button>
                <MicrophonePermission
                  status={getMicStatus()}
                  permissionGranted={permissionGranted}
                  onRequestPermission={requestMicPermission}
                />
                <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
                  {selectedAgent.name} · {company} ({role})
                </span>
              </div>

              <div className="flex items-center gap-3">
                <InterviewTimer elapsedSeconds={timerSec} targetDurationMinutes={durationMinutes} />
                <InterviewProgress currentRound={questionsAnswered + 1} totalQuestionsAnswered={questionsAnswered} />
              </div>
            </div>

            {/* Central Orb and Visualizer */}
            <div className="bg-slate-950/40 border border-white/10 rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center justify-center">
              <InterviewerOrb agent={selectedAgent} fsmState={fsmState} />
              <AudioVisualizer fsmState={fsmState} />
            </div>

            {/* Active Question Card */}
            <QuestionCard
              agentName={selectedAgent.name}
              agentEmoji={selectedAgent.emoji}
              questionText={currentQuestionText}
              roundNumber={questionsAnswered + 1}
              onReplaySpeech={() => speakQuestion(currentQuestionText)}
            />

            {/* Answer Composer */}
            <AnswerComposer
              voiceMode={voiceMode}
              setVoiceMode={setVoiceMode}
              isListening={isListening}
              onToggleRecording={toggleRecording}
              currentResponse={currentResponse}
              setCurrentResponse={setCurrentResponse}
              onSubmitAnswer={submitAnswer}
              onFinishSession={finishAndEvaluate}
              fsmState={fsmState}
              hasUserAnswered={questionsAnswered > 0}
            />

            {/* Live Transcript Panel */}
            <TranscriptPanel
              history={history}
              agentName={selectedAgent.name}
              agentEmoji={selectedAgent.emoji}
              isProcessing={fsmState === "PROCESSING"}
            />

            {/* Fixed Bottom Control Bar */}
            <VoiceControls
              isListening={isListening}
              onToggleRecording={toggleRecording}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
              isPaused={fsmState === "PAUSED"}
              onTogglePause={() => setFsmState(fsmState === "PAUSED" ? "WAITING_FOR_NEXT_QUESTION" : "PAUSED")}
              voiceMode={voiceMode}
              onToggleVoiceMode={() => setVoiceMode(voiceMode === "voice" ? "text" : "voice")}
              onEndInterview={finishAndEvaluate}
              fsmState={fsmState}
            />
          </motion.div>
        )}

        {/* COMPLETED SCORECARD STAGE */}
        {fsmState === "COMPLETED" && completedSessionData && (
          <motion.div
            key="scorecard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <InterviewScorecard
              session={completedSessionData}
              onNewSession={() => setFsmState("CONFIGURING")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
