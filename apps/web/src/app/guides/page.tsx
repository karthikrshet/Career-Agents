"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Award, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GuidesPage() {
  const guides = [
    {
      title: "Staff & Principal System Design Blueprint",
      description: "Learn how to approach distributed caching, Raft consensus, database sharding, and rate limiter architectures in 45-minute interviews.",
      time: "15 min read",
      tag: "System Design",
    },
    {
      title: "Mastering the STAR Evaluation Method",
      description: "How to structure behavioral and architectural answers (Situation, Task, Action, Result) with high-signal trade-offs and quantified metrics.",
      time: "8 min read",
      tag: "Interview Prep",
    },
    {
      title: "Forensic ATS Keyword Calibration Heuristics",
      description: "Uncover how ATS parsers evaluate semantic density and rewrite bullet points into Google XYZ format for maximum recruiter visibility.",
      time: "10 min read",
      tag: "Resume Studio",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans py-20 px-4 sm:px-6 lg:px-8 relative overflow-y-auto z-10">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to landing
        </Link>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" /> Engineering Career Playbooks
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Developer <span className="text-sky-400">Career Guides</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
            Accelerate your engineering journey with system design frameworks, coding playground playbooks, and compensation negotiation tactics.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guides.map((g) => (
            <div
              key={g.title}
              className="p-6 rounded-2xl bg-[#070b14] border border-white/10 hover:border-sky-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-400/20">
                    {g.tag}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {g.time}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                  {g.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {g.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Link href="/docs">
                  <Button size="sm" variant="outline" className="w-full bg-white/[0.04] hover:bg-white/[0.08] text-white border-white/10 text-xs font-semibold py-2 rounded-lg">
                    <span>Read Playbook</span>
                    <ArrowRight className="w-3 h-3 ml-1.5 text-sky-400" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Advice */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#070b14] border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Award className="w-4 h-4 text-sky-400" />
            <span>Staff Engineering Negotiation Philosophy</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Never negotiate compensation against arbitrary base salary numbers. Always anchor your discussions on verified market percentile bands, multi-year equity grant refreshers, and proven technical impact.
          </p>
        </div>
      </div>
    </div>
  );
}
