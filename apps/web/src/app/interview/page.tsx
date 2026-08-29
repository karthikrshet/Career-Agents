"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, Play, Square, ChevronRight, Loader2, Timer,
  CheckCircle, AlertCircle, Star, Building2, Brain, Sparkles,
  Layers, Users, Shield, Award, MessageSquare, Volume2, MicOff
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { useGatewayStore } from "@/lib/gateway-store";
import { generateId, cn, scoreToColor, scoreToGrade, resolveApiKey } from "@/lib/utils";
import { SystemDesignCanvas } from "@/components/interview/SystemDesignCanvas";
import { MultiAgentDeliberationPanel } from "@/components/interview/MultiAgentDeliberationPanel";
import type { InterviewSession, InterviewMode, InterviewDifficulty, InterviewRound } from "@/types";

const COMPANIES = ["Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix", "Stripe", "Airbnb", "Uber", "OpenAI", "Anthropic"];
const MODES: InterviewMode[] = ["behavioral", "technical", "system_design", "hr"];
const DIFFICULTIES: InterviewDifficulty[] = ["Easy", "Medium", "Hard", "Expert"];
const ROUNDS: InterviewRound[] = ["Screening", "Technical", "System Design", "Onsite", "HR"];

const SAMPLE_QUESTIONS: Record<InterviewMode, string[]> = {
  behavioral: [
    "Tell me about a time you led a complex technical project under a tight deadline.",
    "Describe a situation where you had to resolve a serious disagreement on system architecture.",
    "Give an example of a production outage or bug you caused, and how you engineered the postmortem fix.",
    "Tell me about a time you had to influence cross-functional stakeholders without direct authority.",
    "Describe your most impactful technical contribution and how you measured its business success.",
  ],
  technical: [
    "Implement an in-memory thread-safe LRU cache with O(1) get and put operations.",
    "Design a distributed rate limiter that supports 100k requests per second with Redis and sliding windows.",
    "Explain the difference between TCP and UDP and when you'd choose each in high-scale systems.",
    "How would you optimize a slow database query operating on a partitioned table with 500M rows?",
    "Implement a function to detect and resolve cycle deadlocks in a resource allocation graph.",
  ],
  system_design: [
    "Design a Planetary-Scale Video Streaming Platform like YouTube (Ingestion, Transcoding, CDN, Recommendations).",
    "Design a Globally Distributed Key-Value Store with Strong Consistency (Spanner/Dynamo).",
    "Architect a Real-Time Ride Matching & Geolocation Tracking Service like Uber.",
    "Design an End-to-End Notification System (Push, Email, SMS) with Rate Limiting & Deduping at 1B events/day.",
    "Design a High-Throughput Financial Ledger with Idempotency & Double-Entry Bookkeeping like Stripe.",
  ],
  hr: [
    "Why are you targeting our engineering team and product mission?",
    "What is your target total compensation expectation across Base, Equity, and Bonus?",
    "Where do you envision your technical leadership trajectory over the next 3 to 5 years?",
    "What are your biggest engineering superpowers and active areas of growth?",
    "Do you have competing offers or active hiring committee loops in progress?",
  ],
};

type Stage = "config" | "session" | "scorecard";

export default function InterviewPage() {
  const interviewSessions = useStore((s) => s.interviewSessions);
  const addInterviewSession = useStore((s) => s.addInterviewSession);
  const updateSessionScorecard = useStore((s) => s.updateSessionScorecard);
  const settings = useStore((s) => s.settings);
  const updateAIProvider = useStore((s) => s.updateAIProvider);
  const activeProvider = useGatewayStore((s) => s.activeProvider);

  const [stage, setStage] = useState<Stage>("config");
  const [company, setCompany] = useState("Google");
  const [mode, setMode] = useState<InterviewMode>("behavioral");
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>("Medium");
  const [round, setRound] = useState<InterviewRound>("Technical");
  const [enableSwarmDeliberation, setEnableSwarmDeliberation] = useState(true);

  // Active session states
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [questionIndex, setQI] = useState(0);
  const [answer, setAnswer] = useState("");
  const [responses, setResponses] = useState<{ questionId: string; answer: string }[]>([]);
  const [timerSec, setTimerSec] = useState(0);
  const [activeTab, setActiveTab] = useState<"text" | "architecture">("text");

  // Speech recording simulation state
  const [isRecording, setIsRecording] = useState(false);

  // Evaluation states
  const [evaluating, setEvaluating] = useState(false);
  const [evalError, setEvalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (stage === "session") {
      timerRef.current = setInterval(() => setTimerSec((t) => t + 1), 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [stage]);

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  function toggleSpeechRecording() {
    if (!isRecording) {
      setIsRecording(true);
      toast.success("Voice capture active. Speak clearly into your microphone.");
      // Web Speech recognition support if available
      if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        try {
          const rec = new SpeechRec();
          rec.continuous = true;
          rec.interimResults = true;
          rec.onresult = (e: any) => {
            let transcript = "";
            for (let i = e.resultIndex; i < e.results.length; ++i) {
              transcript += e.results[i][0].transcript;
            }
            if (transcript) {
              setAnswer((prev) => (prev ? prev + " " + transcript : transcript));
            }
          };
          rec.start();
        } catch {}
      }
    } else {
      setIsRecording(false);
      toast.info("Voice capture paused.");
    }
  }

  function startSession() {
    const qs = SAMPLE_QUESTIONS[mode].slice(0, 3).map((text) => ({
      id: generateId(),
      text,
      type: mode,
    }));
    const s: InterviewSession = {
      id: generateId(),
      company,
      role: "Software Engineer",
      mode,
      difficulty,
      round,
      questions: qs,
      responses: [],
      startedAt: new Date().toISOString(),
    };
    addInterviewSession(s);
    setSession(s);
    setQI(0);
    setResponses([]);
    setTimerSec(0);
    setActiveTab(mode === "system_design" ? "architecture" : "text");
    setStage("session");
  }

  function submitAnswer() {
    if (!answer.trim() && activeTab === "text") return;
    if (!session) return;
    const q = session.questions[questionIndex];
    const newResp = [...responses, { questionId: q.id, answer: answer.trim() || "[Architecture Diagram Submitted]" }];
    setResponses(newResp);
    setAnswer("");
    if (questionIndex + 1 < session.questions.length) {
      setQI((i) => i + 1);
    } else {
      finishSession(session, newResp);
    }
  }

  function handleRetryEvaluation() {
    if (session) {
      finishSession(session, responses);
    }
  }

  function handleSaveDraft() {
    if (!session) return;
    updateSessionScorecard(session.id, {
      responses: responses.map((r) => ({ ...r, submittedAt: new Date().toISOString() })),
      completedAt: new Date().toISOString(),
    });
    toast.success("Draft saved successfully to past sessions.");
    setStage("config");
    setSession(null);
  }

  async function finishSession(s: InterviewSession, resps: typeof responses) {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setEvaluating(true);
    setEvalError(false);
    setErrorMessage("");
    setStage("scorecard");

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate",
          company: s.company,
          role: s.role,
          mode: s.mode,
          difficulty: s.difficulty,
          swarmDeliberation: enableSwarmDeliberation,
          responses: resps.map((r) => {
            const questionText = s.questions.find((q) => q.id === r.questionId)?.text || "";
            return { question: questionText, answer: r.answer };
          }),
          aiConfig: {
            provider: useGatewayStore.getState().activeProvider,
            apiKey: resolveApiKey(useGatewayStore.getState().activeProvider, settings),
            model: useGatewayStore.getState().activeModel,
            temperature: useGatewayStore.getState().temperature || 0.7,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Unable to evaluate because AI provider is unavailable.");
      }

      const parsed = await res.json();

      if (!parsed || !parsed.scores || typeof parsed.scores.overall !== "number") {
        throw new Error("Unable to evaluate because AI provider is unavailable.");
      }

      const scorecard = {
        overallScore: parsed.scores.overall ?? 82,
        dimensions: {
          starStructure: Math.round(
            ((parsed.scores.situation ?? 8) + (parsed.scores.task ?? 8) +
             (parsed.scores.action ?? 9) + (parsed.scores.result ?? 8)) / 4
          ),
          technicalAccuracy: parsed.scores.technicalDepth ?? parsed.scores.technical ?? 8,
          communication: parsed.scores.communication ?? 8,
          problemSolving: parsed.scores.problemSolving ?? 8,
          leadership: parsed.scores.leadership ?? 8,
          cultureAdd: parsed.scores.confidence ?? parsed.scores.ownership ?? 8,
        },
        strengths: parsed.strengths || [
          "Strong articulation of architectural components and trade-offs.",
          "Clear ownership using STAR framework actions.",
          "Correct identification of high-scale bottlenecks.",
        ],
        improvements: parsed.improvements || [
          "Quantify latency and storage metric deltas with exact percentages.",
          "Explore multi-datacenter failover scenarios in more depth.",
        ],
        aiSummary: parsed.feedback || "Consensus reached: Candidate meets the bar for target company loop.",
      };

      updateSessionScorecard(s.id, {
        responses: resps.map((r) => ({ ...r, submittedAt: new Date().toISOString() })),
        scorecard,
        completedAt: new Date().toISOString(),
      });

      const updatedSession = { ...s, scorecard, responses: resps.map((r) => ({ ...r, submittedAt: new Date().toISOString() })) };
      setSession(updatedSession);
      setEvaluating(false);
    } catch (err: any) {
      setEvaluating(false);
      setEvalError(true);
      setErrorMessage(err.message || "Unable to evaluate because AI provider is unavailable.");
    }
  }

  return (
    <div className="flex flex-col h-full overflow-auto bg-[#03060f] text-slate-100 font-sans">
      <Topbar
        title="Interactive Interview Studio"
        subtitle="AI-powered mock interviews, System Design whiteboard, and Multi-Agent Hiring Committee Deliberation"
      />

      <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* Config stage */}
          {stage === "config" && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              {/* Voice Agent Promotion Card */}
              <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 to-indigo-950/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-mono font-semibold text-cyan-400 uppercase tracking-wide">Next-Level Feature</p>
                    <p className="text-xs font-bold text-white">Interactive AI Voice Agent Lab</p>
                    <p className="text-[11px] text-slate-300 leading-normal">Practice live spoken mock interviews with 167 specialized agents & speech waveform.</p>
                  </div>
                </div>
                <Link href="/interview/voice">
                  <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium text-xs whitespace-nowrap shrink-0 h-8">
                    Try Voice Lab <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center mx-auto mb-4 text-violet-400 shadow-lg">
                  <Brain className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-white">Configure Your Interview Studio</h2>
                <p className="text-sm text-slate-400 mt-2">
                  Select your target company, interview round, and activate multi-agent hiring committee deliberation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 mb-2 block font-semibold">Target Company</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary/70 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  >
                    {COMPANIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 mb-2 block font-semibold">Interview Track / Mode</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary/70 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={mode}
                    onChange={(e) => setMode(e.target.value as InterviewMode)}
                  >
                    {MODES.map((m) => (
                      <option key={m} value={m}>
                        {m.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 mb-2 block font-semibold">Difficulty Calibration</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary/70 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as InterviewDifficulty)}
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 mb-2 block font-semibold">Interview Round Format</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary/70 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={round}
                    onChange={(e) => setRound(e.target.value as InterviewRound)}
                  >
                    {ROUNDS.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swarm Deliberation Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xs font-bold text-white">Multi-Agent Swarm Deliberation</p>
                    <p className="text-[11px] text-muted-foreground">
                      Concurrently evaluates your response across Staff Architect, Bar Raiser & Hiring Director.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableSwarmDeliberation}
                  onChange={(e) => setEnableSwarmDeliberation(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
              </div>

              <Button
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold h-11 rounded-xl shadow-lg"
                size="lg"
                onClick={startSession}
              >
                <Play className="w-4 h-4 mr-2" />
                Launch Mock Interview Session
              </Button>

              {/* Past sessions */}
              {interviewSessions.length > 0 && (
                <div className="pt-4 border-t border-border/40">
                  <p className="text-xs uppercase font-bold text-muted-foreground mb-3 tracking-wider">
                    Recent Past Sessions
                  </p>
                  <div className="space-y-2">
                    {interviewSessions.slice(0, 3).map((s) => (
                      <div key={s.id} className="glass rounded-xl p-3 flex items-center gap-3 border border-border/60">
                        <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white">{s.company} — {s.mode}</p>
                          <p className="text-[10px] text-muted-foreground">{new Date(s.startedAt).toLocaleDateString()}</p>
                        </div>
                        {s.scorecard && (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs">
                            {s.scorecard.overallScore}/100
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Session stage */}
          {stage === "session" && session && (
            <motion.div
              key="session"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-border/60">
                <div className="flex items-center gap-3">
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-xs px-3 py-1 font-bold">
                    {session.company}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">{session.mode.toUpperCase()}</Badge>
                  <Badge variant="outline" className="text-xs text-amber-400 border-amber-400/30">
                    {session.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  {/* Speech-to-Text Button */}
                  <button
                    onClick={toggleSpeechRecording}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                      isRecording
                        ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse ring-2 ring-red-400/20"
                        : "bg-slate-800 text-slate-300 border-border hover:bg-slate-700"
                    )}
                  >
                    {isRecording ? <Mic className="w-3.5 h-3.5 text-red-400" /> : <MicOff className="w-3.5 h-3.5" />}
                    <span>{isRecording ? "Listening..." : "Voice Input"}</span>
                  </button>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground glass px-3 py-1.5 rounded-full border border-border/60">
                    <Timer className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-mono font-bold text-white">{formatTime(timerSec)}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Question {questionIndex + 1} of {session.questions.length}</span>
                  <span>{responses.length} answered</span>
                </div>
                <Progress value={((questionIndex) / session.questions.length) * 100} className="h-2" />
              </div>

              {/* Active Question Prompt */}
              <Card className="glass border-cyan-500/30 bg-gradient-to-r from-cyan-950/20 to-slate-900/40">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-bold text-cyan-400 tracking-wider mb-1">
                        Question {questionIndex + 1}
                      </p>
                      <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                        {session.questions[questionIndex].text}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Input Mode Selector (Text / Architecture Canvas) */}
              <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                <button
                  onClick={() => setActiveTab("text")}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                    activeTab === "text"
                      ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Text & STAR Response</span>
                </button>

                <button
                  onClick={() => setActiveTab("architecture")}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                    activeTab === "architecture"
                      ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>System Design Canvas & Whiteboard</span>
                </button>
              </div>

              {/* Workspace Tab Content */}
              {activeTab === "text" ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <label className="font-semibold text-slate-300">Your Response (STAR Format recommended)</label>
                    <span className="font-mono">{answer.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                  <textarea
                    className="w-full h-56 p-4 rounded-2xl bg-secondary/50 border border-border/80 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                    placeholder="Structure your answer using Situation, Task, Action, Result. Quantify metric deltas where possible..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <SystemDesignCanvas />
                  <textarea
                    className="w-full h-24 p-3 rounded-xl bg-secondary/50 border border-border/80 text-xs text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Add architectural notes, scaling trade-offs, and failure mode explanations..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>
              )}

              {/* Session Navigation Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <Button variant="ghost" onClick={() => setStage("config")}>
                  Exit Session
                </Button>

                <Button
                  onClick={submitAnswer}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-6 h-10 rounded-xl"
                  disabled={!answer.trim() && activeTab === "text"}
                >
                  {questionIndex + 1 < session.questions.length ? (
                    <>
                      <span>Next Question</span>
                      <ChevronRight className="w-4 h-4 ml-1.5" />
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4 mr-1.5" />
                      <span>Submit to Hiring Committee</span>
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Scorecard stage */}
          {stage === "scorecard" && (
            <motion.div
              key="scorecard"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {evaluating ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                    <Sparkles className="w-5 h-5 text-amber-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <p className="text-base font-bold text-white">Hiring Committee Deliberation in Progress...</p>
                  <p className="text-xs text-muted-foreground">
                    Staff Architect, Amazon Bar Raiser & Hiring Director are scoring your responses.
                  </p>
                </div>
              ) : evalError ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center space-y-4 max-w-lg mx-auto glass">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto animate-bounce" />
                  <div className="space-y-1">
                    <p className="text-base font-bold text-red-400">Evaluation Failed</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {errorMessage || "Unable to evaluate because AI provider is unavailable."}
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center pt-3">
                    <Button size="sm" onClick={handleRetryEvaluation}>
                      Retry Evaluation
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleSaveDraft}>
                      Save Draft
                    </Button>
                  </div>
                </div>
              ) : session?.scorecard ? (
                <div className="space-y-6">
                  {/* Hiring Committee Multi-Agent Panel */}
                  <MultiAgentDeliberationPanel
                    consensusScore={session.scorecard.overallScore}
                    dimensions={session.scorecard.dimensions}
                    strengths={session.scorecard.strengths}
                    improvements={session.scorecard.improvements}
                  />

                  {/* Dimension Scores */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(session.scorecard.dimensions).map(([key, value]) => (
                      <Card key={key} className="glass border-border/60">
                        <CardContent className="p-4">
                          <p className="text-xs text-muted-foreground mb-1 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <div className="flex items-end gap-2">
                            <span className={cn("text-xl font-bold font-mono", scoreToColor((value as number) * 10))}>
                              {value as number}
                            </span>
                            <span className="text-xs text-muted-foreground mb-0.5">/10</span>
                          </div>
                          <Progress value={(value as number) * 10} className="h-1.5 mt-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="glass border-emerald-500/20">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <CardTitle className="text-sm font-bold text-white">Demonstrated Strengths</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {session.scorecard.strengths.map((s, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                              <Star className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="glass border-amber-500/20">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          <CardTitle className="text-sm font-bold text-white">Targeted Remediation Areas</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {session.scorecard.improvements.map((s, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                              <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <Button onClick={() => setStage("config")} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold">
                      Start New Mock Session
                    </Button>
                    <Link href="/prephub">
                      <Button variant="outline" className="border-border/80 text-xs">
                        Return to Company PrepHub
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
