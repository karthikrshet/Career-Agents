"use client";

import { ArrowLeft, CheckCircle2, Circle, Clock, Sparkles } from "lucide-react";
import Link from "next/link";

export default function RoadmapPage() {
  const roadmapItems = [
    {
      quarter: "Q1 2026",
      status: "completed",
      title: "167-Agent Registry & Multi-Division Architecture",
      desc: "Compiled 167 specialized AI agents across 19 technical divisions with deterministic JSON validation tests.",
    },
    {
      quarter: "Q2 2026",
      status: "completed",
      title: "Model Context Protocol (MCP) Server Integration",
      desc: "Native JSON-RPC 2.0 protocol supporting 31 tool endpoints for Claude Code, Cursor, Windsurf, and Antigravity.",
    },
    {
      quarter: "Q3 2026",
      status: "completed",
      title: "20-Language Coding Studio & Algorithm Sandbox",
      desc: "In-browser execution engine for Python, C++, TypeScript, Rust, Go, and Java with test judge telemetry.",
    },
    {
      quarter: "Q4 2026",
      status: "active",
      title: "Voice STAR Mock Interview Simulation & Waveforms",
      desc: "Real-time voice dialog coach with live latency measurement and L6 Staff architecture scoring rubrics.",
    },
    {
      quarter: "Q1 2027",
      status: "planned",
      title: "Collaborative Cohort Workspaces & Team Calibration",
      desc: "Shared recruitment and university pipeline dashboards with local SQLite synchronization.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans py-20 px-4 sm:px-6 lg:px-8 relative overflow-y-auto z-10">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-10">
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
            <Sparkles className="w-3.5 h-3.5" /> Engineering Milestones
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Development <span className="text-sky-400">Roadmap</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
            Track our progress as we build the open-source AI Career Operating System for software engineers worldwide.
          </p>
        </div>

        {/* Timeline Flow */}
        <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
          {roadmapItems.map((item) => (
            <div key={item.quarter} className="relative pl-10">
              <div className="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-[#070b14] flex items-center justify-center border border-white/10 z-10">
                {item.status === "completed" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {item.status === "active" && <Clock className="w-4 h-4 text-sky-400 animate-pulse" />}
                {item.status === "planned" && <Circle className="w-4 h-4 text-slate-600" />}
              </div>

              <div className="p-5 rounded-2xl bg-[#070b14] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-sky-400 font-bold font-mono">
                    {item.quarter}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      item.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : item.status === "active"
                        ? "bg-sky-500/10 text-sky-400"
                        : "bg-white/[0.04] text-slate-500"
                    }`}
                  >
                    {item.status === "completed" ? "Shipped" : item.status === "active" ? "In Progress" : "Planned"}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
