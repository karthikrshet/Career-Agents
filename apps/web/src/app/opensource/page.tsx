"use client";

import { ArrowLeft, Star, GitFork, Heart, Shield, Code, Terminal, Sparkles, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OpenSourcePage() {
  const steps = [
    {
      icon: Terminal,
      title: "1. Clone and Install Dependencies",
      code: "git clone https://github.com/karthikrshet/Career-Agents.git\ncd apps/web && npm install",
    },
    {
      icon: Code,
      title: "2. Build & Generate Schema Mappings",
      code: "python scripts/generate-data.py\npython scripts/validate.py",
    },
    {
      icon: Shield,
      title: "3. Run Local Dev Server",
      code: "npm run dev",
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
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" /> MIT Licensed Platform
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            100% Free &amp; <span className="text-sky-400">Open Source</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Career Agents is built on the foundation of open transparency. Audit our ATS scoring logic, run the 31 MCP server tools locally, or contribute new prompt templates to our 167 specialized agent registry.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a href="https://github.com/karthikrshet/Career-Agents" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Star on GitHub</span>
              </Button>
            </a>
            <a href="https://github.com/karthikrshet/Career-Agents/fork" target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="bg-white/[0.04] hover:bg-white/[0.08] text-white border-white/10 text-xs font-medium px-5 py-2.5 rounded-lg flex items-center gap-2">
                <GitFork className="w-3.5 h-3.5 text-sky-400" />
                <span>Fork Repository</span>
              </Button>
            </a>
          </div>
        </div>

        {/* Quickstart Setup Steps */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">Local Developer Quickstart</h2>
          <div className="space-y-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="p-5 rounded-2xl bg-[#070b14] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Icon className="w-4 h-4 text-sky-400" />
                    <span>{step.title}</span>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-sky-300 overflow-x-auto">
                    <code>{step.code}</code>
                  </pre>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contribution Guidelines Strip */}
        <div className="p-6 rounded-2xl bg-[#070b14] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Strict Registry Validation Pipeline</h3>
            <p className="text-xs text-slate-400 font-mono">
              Every PR must pass `python scripts/validate.py` with 0 schema anomalies before merge.
            </p>
          </div>
          <Link href="/docs">
            <Button size="sm" className="bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 text-xs px-4 py-2 rounded-lg shrink-0 font-mono">
              Read Contributor Guide →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
