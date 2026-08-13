"use client";

import React from "react";
import Link from "next/link";
import {
  GitBranch,
  Code2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Terminal,
  Cpu,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function GitHubAnalyzerShowcase() {
  const capabilities = [
    { skill: "Distributed Systems & Raft", level: "Expert (L6+)", status: "Verified" },
    { skill: "Model Context Protocol (MCP)", level: "Production", status: "Verified" },
    { skill: "TypeScript & Next.js Architecture", level: "Senior", status: "Verified" },
    { skill: "Docker & Container Tooling", level: "Advanced", status: "Verified" },
  ];

  return (
    <section id="github" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 font-sans">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium mb-3">
          <GitBranch className="w-3.5 h-3.5" /> Repository &amp; Codebase Audit
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Audit GitHub Repositories for <span className="text-sky-400">Proof of Engineering</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
          Turn public code repositories into verified technical evidence. Analyze architecture patterns, test coverage density, README clarity, and commit consistency.
        </p>
      </div>

      {/* Main Consolidated Code Inspector Panel */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#070b14] border border-white/10 overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Repository Header Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>karthikrshet/Career-Agents</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Verified Audit
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                167 AI Agents • MIT License • TypeScript / Python Architecture
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300">
              CI/CD: Passed (0 errors)
            </span>
          </div>
        </div>

        {/* Audit Metrics & Capabilities Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Health & Security Matrix (5 cols) */}
          <div className="lg:col-span-5 space-y-3 font-mono text-xs">
            <div className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              Health &amp; Architectural Score:
            </div>
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <span className="text-slate-300">Architecture Modularity</span>
                <span className="text-emerald-400 font-bold">A+ (Clean DAG)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <span className="text-slate-300">Test Suite Coverage</span>
                <span className="text-sky-400 font-bold">92.4% Verified</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <span className="text-slate-300">Security Audit Score</span>
                <span className="text-emerald-400 font-bold">98/100 (Clean)</span>
              </div>
            </div>
          </div>

          {/* Right: Extracted Proof-of-Work Capabilities (7 cols) */}
          <div className="lg:col-span-7 space-y-3 font-mono text-xs">
            <div className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              Verified Technical Competencies:
            </div>
            <div className="space-y-2">
              {capabilities.map((c) => (
                <div
                  key={c.skill}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="font-sans text-xs">{c.skill}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">{c.level}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/10 text-sky-300">
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
          <div className="text-slate-400 font-mono text-[11px]">
            ✓ Output formatted for FAANG hiring manager and engineering lead review.
          </div>
          <Link href="/github">
            <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs px-4 py-2 rounded-lg">
              <span>Run Repository Audit</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
