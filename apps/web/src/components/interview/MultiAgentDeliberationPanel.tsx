"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Scale, Cpu, Briefcase, Award, CheckCircle2,
  AlertTriangle, Sparkles, MessageSquare, ChevronDown, ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CommitteePersonaReview {
  personaId: string;
  name: string;
  role: string;
  emoji: string;
  score: number;
  verdict: "Strong Hire" | "Hire" | "Leaning Hire" | "Leaning No Hire" | "No Hire";
  feedback: string;
  concerns: string[];
}

export function MultiAgentDeliberationPanel({
  active = false,
  consensusScore = 80,
  dimensions,
  strengths = [],
  improvements = [],
  reviews: explicitReviews,
}: {
  active?: boolean;
  consensusScore?: number;
  dimensions?: Record<string, number>;
  strengths?: string[];
  improvements?: string[];
  reviews?: CommitteePersonaReview[];
}) {
  // Construct dynamic reviews based on actual session dimensions and feedback if available
  const computedReviews: CommitteePersonaReview[] = React.useMemo(() => {
    if (explicitReviews && explicitReviews.length > 0) return explicitReviews;

    const techScore = Math.min(100, Math.max(0, Math.round(((dimensions?.technicalAccuracy ?? (consensusScore / 10)) * 10))));
    const starScore = Math.min(100, Math.max(0, Math.round(((dimensions?.starStructure ?? (consensusScore / 10)) * 10))));
    const bizScore = Math.min(100, Math.max(0, Math.round(((dimensions?.problemSolving ?? dimensions?.leadership ?? (consensusScore / 10)) * 10))));

    const getVerdict = (s: number): CommitteePersonaReview["verdict"] => {
      if (s >= 85) return "Strong Hire";
      if (s >= 70) return "Hire";
      if (s >= 55) return "Leaning Hire";
      if (s >= 40) return "Leaning No Hire";
      return "No Hire";
    };

    return [
      {
        personaId: "staff_architect",
        name: "Staff Distributed Systems Architect",
        role: "Technical Depth & Scalability",
        emoji: "🏗️",
        score: techScore,
        verdict: getVerdict(techScore),
        feedback: strengths[0]
          ? `Technical evaluation: ${strengths[0]}`
          : "Evaluated technical depth, system trade-offs, and computational correctness.",
        concerns: improvements.slice(0, 1),
      },
      {
        personaId: "bar_raiser",
        name: "Amazon Bar Raiser / Culture Calibration",
        role: "Leadership & STAR Rigor",
        emoji: "⚖️",
        score: starScore,
        verdict: getVerdict(starScore),
        feedback: strengths[1]
          ? `Behavioral evaluation: ${strengths[1]}`
          : "Evaluated Situation, Task, Action, Result framing and quantifiable leadership impact.",
        concerns: improvements.slice(1, 2),
      },
      {
        personaId: "hiring_manager",
        name: "Engineering Director",
        role: "Velocity & Business Impact",
        emoji: "💼",
        score: bizScore,
        verdict: getVerdict(bizScore),
        feedback: strengths[2] || strengths[0]
          ? `Execution assessment: ${strengths[2] || strengths[0]}`
          : "Assessed execution velocity, stakeholder clarity, and business outcomes.",
        concerns: improvements.slice(2, 3),
      },
    ];
  }, [explicitReviews, dimensions, consensusScore, strengths, improvements]);

  const [selectedPersona, setSelectedPersona] = useState<string>("staff_architect");
  const current = computedReviews.find((r) => r.personaId === selectedPersona) || computedReviews[0];

  const overallVerdict =
    consensusScore >= 80 ? "STRONG HIRE" : consensusScore >= 65 ? "HIRE" : "NEEDS PRACTICE";

  return (
    <Card className="glass border-cyan-500/30 overflow-hidden shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-slate-900/40 pb-4 border-b border-border/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-white">
                  Multi-Agent Hiring Committee Deliberation
                </CardTitle>
                <Badge variant="default" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[10px]">
                  Swarm Consensus
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Concurrent evaluation from Staff Architect, Bar Raiser & Hiring Director
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-border/60">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Consensus Bar</p>
              <p className="text-lg font-bold text-emerald-400">{consensusScore}/100</p>
            </div>
            <Badge
              className={cn(
                "text-xs px-2.5 py-1 font-bold",
                consensusScore >= 70
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/40"
              )}
            >
              {overallVerdict}
            </Badge>
          </div>
        </div>

        {/* Persona Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
          {computedReviews.map((r) => {
            const isSelected = selectedPersona === r.personaId;
            return (
              <button
                key={r.personaId}
                onClick={() => setSelectedPersona(r.personaId)}
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-xl border text-left transition-all",
                  isSelected
                    ? "bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-400/30 text-white"
                    : "bg-slate-900/40 border-border/50 hover:bg-slate-800/40 text-slate-300"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base">{r.emoji}</span>
                  <div className="truncate">
                    <p className="text-xs font-bold truncate">{r.name.split(" / ")[0]}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{r.role}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-xs font-mono font-bold px-1.5 py-0.5 rounded",
                    r.score >= 80 ? "text-emerald-400" : r.score >= 60 ? "text-amber-400" : "text-red-400"
                  )}
                >
                  {r.score}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.personaId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <span className="text-xl">{current.emoji}</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{current.name}</h4>
                  <p className="text-xs text-cyan-400">{current.role}</p>
                </div>
              </div>
              <Badge
                className={cn(
                  "text-xs px-2.5 py-0.5 font-bold",
                  current.verdict.includes("Hire")
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                )}
              >
                {current.verdict.toUpperCase()} ({current.score}/100)
              </Badge>
            </div>

            {/* In-depth Review */}
            <div className="space-y-2">
              <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                Committee Member Assessment
              </p>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-border/40">
                "{current.feedback}"
              </p>
            </div>

            {/* Probed Concerns & Actionable Remediation */}
            {current.concerns && current.concerns.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs uppercase font-bold text-amber-400 tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Key Points for Remediation & Probing</span>
                </div>
                <ul className="space-y-1.5">
                  {current.concerns.map((c, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-300 flex items-start gap-2 bg-amber-500/5 p-2 rounded-lg border border-amber-500/20"
                    >
                      <span className="text-amber-400 shrink-0">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
