"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, Play, Square, ChevronRight, Loader2, Timer,
  CheckCircle, AlertCircle, Star, Building2, Brain
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { generateId, cn, scoreToColor, scoreToGrade } from "@/lib/utils";
import type { InterviewSession, InterviewMode, InterviewDifficulty, InterviewRound } from "@/types";

const COMPANIES = ["Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix", "Stripe", "Airbnb", "Uber", "OpenAI"];
const MODES: InterviewMode[] = ["behavioral", "technical", "system_design", "hr"];
const DIFFICULTIES: InterviewDifficulty[] = ["Easy", "Medium", "Hard", "Expert"];
const ROUNDS: InterviewRound[] = ["Screening", "Technical", "System Design", "Onsite", "HR"];

const SAMPLE_QUESTIONS: Record<InterviewMode, string[]> = {
  behavioral: [
    "Tell me about a time you led a project under a tight deadline.",
    "Describe a situation where you had to resolve a conflict within your team.",
    "Give an example of when you made a mistake and how you handled it.",
    "Tell me about a time you had to influence stakeholders without authority.",
    "Describe your most impactful technical contribution and how you measured its success.",
  ],
  technical: [
    "Implement a function that finds the longest palindromic substring.",
    "Design a rate limiter that supports 100k requests per second.",
    "Explain the difference between TCP and UDP and when you'd choose each.",
    "How would you optimize a slow database query with millions of rows?",
    "Implement a thread-safe LRU cache in TypeScript.",
  ],
  system_design: [
    "Design Twitter's timeline feed for 100M daily active users.",
    "How would you build a distributed key-value store like Redis?",
    "Design an end-to-end notification system (push, email, SMS) at scale.",
    "Architect a real-time collaborative document editing system.",
    "Design the backend for a ride-sharing app like Uber.",
  ],
  hr: [
    "Why do you want to leave your current company?",
    "What's your expected compensation range?",
    "Where do you see yourself in 5 years?",
    "What are your biggest strengths and areas for improvement?",
    "Do you have any competing offers currently?",
  ],
};

type Stage = "config" | "session" | "scorecard";

export default function InterviewPage() {
  const interviewSessions = useStore((s) => s.interviewSessions);
  const addInterviewSession = useStore((s) => s.addInterviewSession);
  const updateSessionScorecard = useStore((s) => s.updateSessionScorecard);
  const settings = useStore((s) => s.settings);
  const updateAIProvider = useStore((s) => s.updateAIProvider);

  const [stage, setStage] = useState<Stage>("config");
  const [company, setCompany] = useState("Google");
  const [mode, setMode] = useState<InterviewMode>("behavioral");
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>("Medium");
  const [round, setRound] = useState<InterviewRound>("Technical");
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [questionIndex, setQI] = useState(0);
  const [answer, setAnswer] = useState("");
  const [responses, setResponses] = useState<{ questionId: string; answer: string }[]>([]);
  const [timerSec, setTimerSec] = useState(0);
  const [evaluating, setEvaluating] = useState(false);
  const [evalError, setEvalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (stage === "session") {
      timerRef.current = setInterval(() => setTimerSec((t) => t + 1), 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [stage]);

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
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
    setStage("session");
  }

  function submitAnswer() {
    if (!answer.trim() || !session) return;
    const q = session.questions[questionIndex];
    const newResp = [...responses, { questionId: q.id, answer }];
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
          responses: resps.map((r) => {
            const questionText = s.questions.find((q) => q.id === r.questionId)?.text || "";
            return { question: questionText, answer: r.answer };
          }),
          aiConfig: {
            provider: settings.aiProvider.provider,
            apiKey: settings.aiProvider.apiKey,
            model: settings.aiProvider.model,
            temperature: settings.aiProvider.temperature || 0.7
          }
        })
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
        overallScore: parsed.scores.overall ?? 0,
        dimensions: {
          starStructure: Math.round(
            ((parsed.scores.situation ?? 0) + (parsed.scores.task ?? 0) +
             (parsed.scores.action ?? 0) + (parsed.scores.result ?? 0)) / 4
          ),
          technicalAccuracy: parsed.scores.technicalDepth ?? parsed.scores.technical ?? 0,
          communication: parsed.scores.communication ?? 0,
          problemSolving: parsed.scores.problemSolving ?? 0,
          leadership: parsed.scores.leadership ?? 0,
          cultureAdd: parsed.scores.confidence ?? parsed.scores.ownership ?? 0,
        },
        strengths: parsed.strengths || [],
        improvements: parsed.improvements || [],
        aiSummary: parsed.feedback || "Evaluation complete.",
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
    <div className="flex flex-col h-full overflow-auto">
      <Topbar title="Interview Lab" subtitle="AI-powered mock interviews with STAR scorecard" />

      <div className="flex-1 p-6">
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
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-7 h-7 text-violet-400" />
                </div>
                <h2 className="text-xl font-semibold">Configure Your Session</h2>
                <p className="text-sm text-muted-foreground mt-2">Set up a realistic mock interview tailored to your target company and role.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-medium">Company</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  >
                    {COMPANIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-medium">Interview Mode</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={mode}
                    onChange={(e) => setMode(e.target.value as InterviewMode)}
                  >
                    {MODES.map((m) => <option key={m} value={m}>{m.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-medium">Difficulty</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as InterviewDifficulty)}
                  >
                    {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-medium">Round</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={round}
                    onChange={(e) => setRound(e.target.value as InterviewRound)}
                  >
                    {ROUNDS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={startSession}>
                <Play className="w-4 h-4 mr-2" />
                Start Interview Session
              </Button>

              {/* Past sessions */}
              {interviewSessions.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-3 font-medium">Past Sessions</p>
                  <div className="space-y-2">
                    {interviewSessions.slice(0, 3).map((s) => (
                      <div key={s.id} className="glass rounded-lg p-3 flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{s.company} — {s.mode}</p>
                          <p className="text-xs text-muted-foreground">{new Date(s.startedAt).toLocaleDateString()}</p>
                        </div>
                        {s.scorecard && (
                          <Badge variant={s.scorecard.overallScore >= 70 ? "success" : "warning"}>
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
              className="max-w-3xl mx-auto space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{session.company}</Badge>
                  <Badge variant="info">{session.mode}</Badge>
                  <Badge variant="warning">{session.difficulty}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground glass px-3 py-1.5 rounded-full">
                  <Timer className="w-3.5 h-3.5" />
                  {formatTime(timerSec)}
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Question {questionIndex + 1} of {session.questions.length}</span>
                  <span>{responses.length} answered</span>
                </div>
                <Progress value={((questionIndex) / session.questions.length) * 100} />
              </div>

              {/* Question */}
              <Card className="glass glass-accent">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Brain className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Question {questionIndex + 1}</p>
                      <p className="text-base font-medium leading-relaxed">{session.questions[questionIndex].text}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Answer */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block font-medium">Your Answer</label>
                <textarea
                  className="w-full h-40 px-4 py-3 rounded-xl bg-secondary border border-border text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Type your answer here. Use STAR format: Situation, Task, Action, Result."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground mt-1">{answer.split(/\s+/).filter(Boolean).length} words</p>
              </div>

              <div className="flex gap-3">
                <Button onClick={submitAnswer} disabled={!answer.trim()}>
                  {questionIndex + 1 < session.questions.length ? (
                    <><ChevronRight className="w-4 h-4" /> Next Question</>
                  ) : (
                    <><Square className="w-4 h-4" /> Finish Session</>
                  )}
                </Button>
                <Button variant="ghost" onClick={() => setStage("config")}>Exit</Button>
              </div>
            </motion.div>
          )}

          {/* Scorecard stage */}
          {stage === "scorecard" && (
            <motion.div
              key="scorecard"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              {evaluating ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Evaluating your responses using AI...</p>
                </div>
              ) : evalError ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center space-y-4 max-w-lg mx-auto glass">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto animate-bounce" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-red-400">Evaluation Failed</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {errorMessage || "Unable to evaluate because AI provider is unavailable."}
                    </p>
                  </div>
                  
                  {/* Inline Provider Switcher (Issue 14 & 15) */}
                  <div className="space-y-1.5 border border-border/40 p-3 rounded-lg bg-secondary/20 text-left">
                    <label className="text-[10px] text-muted-foreground block font-semibold mb-1 uppercase tracking-wider">Switch AI Provider</label>
                    <select
                      className="w-full px-2 py-1.5 rounded bg-secondary border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                      value={settings.aiProvider.provider}
                      onChange={(e) => {
                        const newProvider = e.target.value as import("@/types").AIProvider;
                        const defaultModelMap: Record<string, string> = {
                          openai: "gpt-4o",
                          claude: "claude-3-5-sonner",
                          gemini: "gemini-1.5-pro",
                          groq: "llama3-70b-8192"
                        };
                        updateAIProvider({
                          provider: newProvider,
                          model: defaultModelMap[newProvider] || "gemini-1.5-pro"
                        });
                        toast.info(`Switched active provider to ${newProvider}`);
                      }}
                    >
                      <option value="gemini">Gemini</option>
                      <option value="groq">Groq</option>
                      <option value="claude">Claude</option>
                      <option value="openai">OpenAI</option>
                    </select>
                  </div>

                  <div className="flex gap-2 justify-center pt-2">
                    <Button size="sm" onClick={handleRetryEvaluation}>
                      Retry
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleSaveDraft}>
                      Save Draft
                    </Button>
                  </div>
                </div>
              ) : session?.scorecard ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold">Interview Scorecard</h2>
                      <p className="text-sm text-muted-foreground">{session.company} · {session.mode} · {session.difficulty}</p>
                    </div>
                    <div className={cn("rounded-xl p-4 text-center border", session.scorecard.overallScore >= 70 ? "border-emerald-500/20 bg-emerald-500/5" : "border-amber-500/20 bg-amber-500/5")}>
                      <div className={cn("text-3xl font-bold", scoreToColor(session.scorecard.overallScore))}>
                        {session.scorecard.overallScore}
                      </div>
                      <div className="text-[10px] text-muted-foreground">/ 100</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(session.scorecard.dimensions).map(([key, value]) => (
                      <Card key={key} className="glass">
                        <CardContent className="p-4">
                          <p className="text-xs text-muted-foreground mb-2 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <div className="flex items-end gap-2">
                            <span className={cn("text-xl font-bold", scoreToColor((value as number) * 10))}>{value as number}</span>
                            <span className="text-xs text-muted-foreground mb-0.5">/10</span>
                          </div>
                          <Progress value={(value as number) * 10} className="h-1 mt-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="glass">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <CardTitle className="text-sm">Strengths</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {session.scorecard.strengths.map((s, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2 text-left">
                              <Star className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="glass">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          <CardTitle className="text-sm">Areas to Improve</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {session.scorecard.improvements.map((s, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2 text-left">
                              <ChevronRight className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => setStage("config")}>New Session</Button>
                    <Button variant="outline" onClick={() => toast.info("Export coming soon")}>Export Report</Button>
                  </div>
                </>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


