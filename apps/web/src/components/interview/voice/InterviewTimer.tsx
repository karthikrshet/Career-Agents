"use client";

import React from "react";
import { Timer, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InterviewTimerProps {
  elapsedSeconds: number;
  targetDurationMinutes: number;
}

export function InterviewTimer({ elapsedSeconds, targetDurationMinutes }: InterviewTimerProps) {
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const targetSeconds = targetDurationMinutes * 60;
  const isOvertime = elapsedSeconds > targetSeconds;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200 bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-full shadow-sm">
        <Timer className="w-3.5 h-3.5 text-cyan-400" />
        <span>{formatTime(elapsedSeconds)}</span>
        <span className="text-slate-500 font-normal">/ {targetDurationMinutes}m</span>
      </div>

      {isOvertime && (
        <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10 text-[10px] py-1 px-2">
          <AlertCircle className="w-3 h-3 mr-1" /> Recommended time reached
        </Badge>
      )}
    </div>
  );
}
