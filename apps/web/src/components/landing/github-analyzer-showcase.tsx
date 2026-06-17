"use client";

import React from "react";
import {
  GitBranch,
  Code2,
  Shield,
  CheckCircle2,
  Star,
  GitFork,
  Check,
  Zap,
  Terminal
} from "lucide-react";

export function GitHubAnalyzerShowcase() {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-medium mb-4">
          <GitBranch className="w-3.5 h-3.5" /> Repository & Codebase Audit
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Audit GitHub Repositories for{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-cyan-400 bg-clip-text text-transparent">
            Proof of Engineering
          </span>
        </h2>
        <p className="mt-4 text-base text-slate-300">
          Turn public code repositories into verified technical evidence. Analyze architecture patterns, test coverage density, README clarity, and commit consistency.
        </p>
      </div>

      {/* Main Glass Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Repository Overview */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090d18] border border-purple-500/20 backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-purple-400" />
              <span className="font-bold text-white">Repository Audit</span>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
              Audited
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="text-sm font-bold text-white flex items-center justify-between">
              <span>karthikrshet/Career-Agents</span>
              <span className="text-xs font-mono text-purple-400">★ 2.4k</span>
            </div>
            <p className="text-xs text-slate-400">
              Open-source AI Career Operating System with 146 specialized agents & MCP tools.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Test Suite Coverage</span>
              <span className="text-emerald-400 font-mono font-bold">98.4%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: "98.4%" }} />
            </div>

            <div className="flex justify-between text-xs text-slate-300">
              <span>README Documentation Density</span>
              <span className="text-cyan-400 font-mono font-bold">94%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: "94%" }} />
            </div>
          </div>
        </div>

        {/* Card 2: Security & Architecture Breakdown */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090d18] border border-purple-500/20 backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-white">Security & Clean Code</span>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              PASSED
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-slate-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Hardcoded Secrets
              </span>
              <span className="text-emerald-400 font-mono">Clean</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-slate-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Strict TypeScript Types
              </span>
              <span className="text-emerald-400 font-mono">100%</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-slate-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Modular Architecture
              </span>
              <span className="text-emerald-400 font-mono">Verified</span>
            </div>
          </div>
        </div>

        {/* Card 3: Simulated Contribution Matrix Heatmap */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090d18] border border-purple-500/20 backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-white">Commit Heatmap Matrix</span>
            </div>
            <span className="text-xs font-mono text-cyan-300">365 Days Active</span>
          </div>

          <div className="grid grid-cols-12 gap-1.5 p-3 rounded-2xl bg-white/[0.02] border border-white/10">
            {Array.from({ length: 60 }).map((_, i) => {
              const intensity = i % 5;
              const bg =
                intensity === 4
                  ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                  : intensity === 3
                  ? "bg-cyan-500"
                  : intensity === 2
                  ? "bg-cyan-700/60"
                  : intensity === 1
                  ? "bg-white/10"
                  : "bg-white/5";
              return <div key={i} className={`h-4 rounded-sm ${bg}`} />;
            })}
          </div>

          <div className="text-xs text-slate-400 text-center font-mono">
            1,420 Commits in the last 12 months • 99.8% Code Quality Score
          </div>
        </div>
      </div>
    </section>
  );
}
