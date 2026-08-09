"use client";

import React from "react";
import { Brain, Layers } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface InterviewProgressProps {
  currentRound: number;
  totalQuestionsAnswered: number;
}

export function InterviewProgress({ currentRound, totalQuestionsAnswered }: InterviewProgressProps) {
  return (
    <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-mono">
      <Brain className="w-3.5 h-3.5 text-purple-400" />
      <span className="text-slate-300 font-medium">Round {currentRound}</span>
      <span className="text-slate-500">•</span>
      <span className="text-slate-400">{totalQuestionsAnswered} answered</span>
    </div>
  );
}
