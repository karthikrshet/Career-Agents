"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Sparkles,
  RefreshCw,
  Award,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResumeStudioShowcase() {
  const [activeVersion, setActiveVersion] = useState("v2.4");
  const [showRewritten, setShowRewritten] = useState(true);

  const keywords = [
    { word: "Distributed Systems", matched: true, count: 4 },
    { word: "Golang Microservices", matched: true, count: 6 },
    { word: "Kubernetes & Helm", matched: true, count: 3 },
    { word: "Kafka Event Streaming", matched: true, count: 2 },
    { word: "STAR Quantified Impact", matched: true, count: 8 },
  ];

  return (
    <section id="resume" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-4">
          <FileText className="w-3.5 h-3.5" /> Resume Studio Suite
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Forensic ATS Auditing &{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Bullet Rewriting Engine
          </span>
        </h2>
        <p className="mt-4 text-base text-slate-300">
          Unpack ATS parser scoring logic before submitting applications. Instantly rewrite weak resume bullet points with quantified metrics and high-impact action verbs.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: ATS Scorecard & Metrics (5 Cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#090d18] border border-cyan-500/20 backdrop-blur-2xl shadow-[0_0_50px_rgba(56,189,248,0.1)] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                ATS Audit Scorecard
              </div>
              <div className="text-lg font-bold text-white">Target: Staff Infrastructure Engineer</div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
              Ver: {activeVersion}
            </span>
          </div>

          {/* Large ATS Circular Gauge */}
          <div className="flex items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-8 border-cyan-400 text-4xl font-extrabold font-mono text-white shadow-[0_0_40px_rgba(56,189,248,0.4)]">
              96%
              <span className="absolute bottom-2 text-[10px] font-sans text-cyan-300 font-normal">
                ATS MATCH
              </span>
            </div>
          </div>

          {/* Keyword Match Checklist */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Keyword Calibration:
            </div>
            {keywords.map((k) => (
              <div
                key={k.word}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs"
              >
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{k.word}</span>
                </div>
                <span className="font-mono text-[11px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                  {k.count}x Matches
                </span>
              </div>
            ))}
          </div>

          {/* Export Formats */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400">Export Formats:</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-white/5 text-xs text-slate-300 border border-white/10">PDF</span>
              <span className="px-2 py-1 rounded bg-white/5 text-xs text-slate-300 border border-white/10">DOCX</span>
              <span className="px-2 py-1 rounded bg-white/5 text-xs text-slate-300 border border-white/10">MD</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Bullet Rewriter (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#090d18] border border-cyan-500/20 backdrop-blur-2xl shadow-[0_0_50px_rgba(56,189,248,0.1)] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-lg font-bold text-white">AI Bullet Optimization Engine</span>
            </div>
            <button
              onClick={() => setShowRewritten((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium hover:bg-cyan-500/20 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Toggle AI Rewrite
            </button>
          </div>

          {/* Before & After Cards */}
          <div className="space-y-4">
            {/* Original Weak Bullet */}
            <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs text-red-400 font-bold uppercase tracking-wider">
                <span>Original Weak Bullet (Low ATS Impact)</span>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300">Score: 42/100</span>
              </div>
              <p className="text-sm text-slate-300 font-mono">
                "Maintained backend services and fixed bugs in Golang application."
              </p>
            </div>

            {/* AI Rewritten Quantified Bullet */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Optimized AI Rewrite (FAANG Standard)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Score: 98/100</span>
              </div>
              <p className="text-sm text-emerald-200 font-mono leading-relaxed">
                "Architected high-throughput Golang microservices handling 2.4M daily requests, reducing P99 API latency by 42% and preventing $180k/yr in infrastructure overhead."
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">✓ Added Quantified Latency Reduction</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">✓ High-Impact Action Verb: Architected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
