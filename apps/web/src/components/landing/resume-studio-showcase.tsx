"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Download,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResumeStudioShowcase() {
  const [activeVersion, setActiveVersion] = useState("v2.4");
  const [showRewritten, setShowRewritten] = useState(true);

  const keywords = [
    { word: "Distributed Systems", count: 4 },
    { word: "Golang Microservices", count: 6 },
    { word: "Kubernetes & Helm", count: 3 },
    { word: "Kafka Event Streaming", count: 2 },
    { word: "STAR Impact Metrics", count: 8 },
  ];

  return (
    <section id="resume" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 font-sans">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium mb-3">
          <FileText className="w-3.5 h-3.5" /> Resume Studio Suite
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Forensic ATS Auditing &amp; <span className="text-sky-400">Bullet Rewriting Engine</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
          Unpack ATS parser scoring logic before submitting applications. Instantly rewrite weak resume bullet points with quantified metrics and high-impact action verbs.
        </p>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: ATS Scorecard & Keywords (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-[#070b14] border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="text-xs font-mono text-sky-400 font-semibold uppercase">
                ATS Audit Scorecard
              </div>
              <div className="text-base font-bold text-white mt-0.5">
                Staff Infrastructure Engineer
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-slate-300 font-mono text-xs">
              {activeVersion}
            </span>
          </div>

          {/* ATS Score Stat */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/10">
            <div>
              <div className="text-3xl font-black text-sky-400 font-mono">96.8%</div>
              <div className="text-xs font-mono text-slate-400 mt-0.5">ATS Match Rate</div>
            </div>
            <div className="text-right text-xs font-mono text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Calibrated for FAANG
            </div>
          </div>

          {/* Keyword Calibration List */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Keyword Calibration:
            </div>
            <div className="space-y-1.5">
              {keywords.map((k) => (
                <div
                  key={k.word}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{k.word}</span>
                  </div>
                  <span className="font-mono text-[11px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                    {k.count}x Matches
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Export Formats */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Export Formats:</span>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/10">PDF</span>
              <span className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/10">DOCX</span>
              <span className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/10">LaTeX</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Bullet Optimization Engine (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-2xl bg-[#070b14] border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span className="text-base font-bold text-white">AI Bullet Optimization Engine</span>
            </div>
            <button
              onClick={() => setShowRewritten((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-mono hover:text-white transition-all"
            >
              <RefreshCw className="w-3 h-3 text-sky-400" /> Toggle Diff
            </button>
          </div>

          {/* Before & After Diff Boxes */}
          <div className="space-y-4 font-mono text-xs">
            {/* Original Weak Bullet */}
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 space-y-2">
              <div className="flex items-center justify-between text-red-400 font-semibold uppercase text-[11px]">
                <span>Original Bullet (Low ATS Impact)</span>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300">Score: 42/100</span>
              </div>
              <p className="text-slate-300 font-normal leading-relaxed text-xs">
                &ldquo;Maintained backend services and fixed bugs in Golang application.&rdquo;
              </p>
            </div>

            {/* AI Rewritten Quantified Bullet */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2.5">
              <div className="flex items-center justify-between text-emerald-400 font-semibold uppercase text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Optimized Rewrite (Staff L6 Standard)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Score: 98/100</span>
              </div>
              <p className="text-emerald-200 font-normal leading-relaxed text-xs">
                &ldquo;Architected high-throughput Golang microservices handling 2.4M daily requests, reducing P99 API latency by 42% and preventing $180k/yr in infrastructure overhead.&rdquo;
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  ✓ Quantified Latency (-42%)
                </span>
                <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  ✓ High-Impact Verb: Architected
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">
              Ready for single-click export and ATS application submission.
            </span>
            <Link href="/resume">
              <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs px-4 py-2 rounded-lg">
                <span>Open Resume Studio</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
