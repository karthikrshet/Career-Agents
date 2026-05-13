// apps/web/src/app/roadmap/page.tsx
"use client";

import { ArrowLeft, CheckCircle2, Circle, Clock } from "lucide-react";
import Link from "next/link";

export default function RoadmapPage() {
  const roadmapItems = [
    {
      quarter: "Q1 2026",
      status: "completed",
      title: "Core AI Gateway & RAG Caching",
      desc: "SSRF prevention routing layers, cost estimation counters, fallback provider loops, and hybrid vector search."
    },
    {
      quarter: "Q2 2026",
      status: "completed",
      title: "Multi-Agent Orchestrator Pipeline",
      desc: "Simultaneous execution loops for specialist agent selections and structured JSON outputs validations."
    },
    {
      quarter: "Q3 2026",
      status: "active",
      title: "PostgreSQL Session Sync & NextAuth",
      desc: "Replacing guest localStorage stores with database persistence and role access rules."
    },
    {
      quarter: "Q4 2026",
      status: "planned",
      title: "VS Code & Browser Extension Connectors",
      desc: "Direct integration to highlight weak accomplishments syntax or pull interview scorecards right from IDE environments."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative py-20">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-white transition mb-12">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to landing
        </Link>

        <h1 className="text-3xl font-extrabold text-white mb-6">Development Roadmap</h1>
        <p className="text-sm text-slate-400 mb-12 max-w-2xl leading-relaxed">
          Track our milestones as we build the Open Source AI Career Operating System.
        </p>

        <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-900">
          {roadmapItems.map(item => (
            <div key={item.quarter} className="relative pl-10">
              <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center border border-slate-900 z-10">
                {item.status === "completed" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {item.status === "active" && <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />}
                {item.status === "planned" && <Circle className="w-4 h-4 text-slate-600" />}
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-widest text-indigo-500 font-bold bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                  {item.quarter}
                </span>
                <h3 className="text-sm font-bold text-white mt-2 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xl">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
