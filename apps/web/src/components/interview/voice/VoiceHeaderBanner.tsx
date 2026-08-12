"use client";

import React from "react";
import { Sparkles, ArrowUpRight, Volume2, Bot, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface VoiceHeaderBannerProps {
  onStartClick?: () => void;
}

export function VoiceHeaderBanner({ onStartClick }: VoiceHeaderBannerProps) {
  return (
    <div className="w-full mb-6 rounded-2xl border border-amber-500/30 bg-[#0c0d17] p-5 sm:p-6 shadow-2xl relative overflow-hidden text-left">
      {/* Background Subtle Radial Amber Glow */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <Badge
            variant="outline"
            className="border-amber-500/40 text-amber-400 bg-amber-500/10 font-mono text-[11px] uppercase tracking-wider px-3 py-1 rounded-full w-fit flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            SPEECH & CONVERSATIONAL AI LAB v1.0
          </Badge>

          <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight leading-tight">
            Unlock 1-on-1 Spoken AI Voice Interviews
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Practice real-time spoken technical, DSA, system design, and behavioral mock interviews with 167 specialized AI agents across 27 BCP-47 languages with evidence-based STAR scorecards.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2.5">
          <Link
            href="/interview"
            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5"
          >
            <span>← Back to Interviews</span>
          </Link>
          <button
            onClick={onStartClick}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 border-0"
          >
            <span>Explore Voice Agents</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
