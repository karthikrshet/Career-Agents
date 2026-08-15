"use client";

import { ArrowLeft, GitCommit, Sparkles, Check } from "lucide-react";
import Link from "next/link";

export default function ChangelogPage() {
  const releases = [
    {
      version: "v17.0.0",
      date: "August 15, 2026",
      title: "167-Agent Ecosystem, MCP 31 Tools & 20-Language Coding Studio",
      notes: [
        "Expanded registry to 167 specialized AI agents across 19 technical divisions.",
        "Integrated Model Context Protocol (MCP) JSON-RPC 2.0 runtime with 31 tool endpoints.",
        "Launched 20-Language In-Browser Coding Studio with sandboxed multi-file compilers.",
        "Engineered PixelBlast Bayer WebGL dithered canvas engine with interactive touch ripples.",
        "Integrated Star STAR Mock Voice audio coach with live conversational latency evaluation.",
      ],
    },
    {
      version: "v16.0.0",
      date: "July 28, 2026",
      title: "Local SQLite Architecture & Forensic ATS Audit",
      notes: [
        "Implemented local-first browser SQLite database persistence for candidate data privacy.",
        "Engineered Forensic ATS Parser & Match Calibrator with Google XYZ quantified bullet rewrites.",
        "Added GitHub repository proof-of-work analyzer and architecture modularity scoring.",
        "Implemented multi-provider LLM gateway fallback loops across 15+ endpoints.",
      ],
    },
    {
      version: "v15.0.0",
      date: "June 14, 2026",
      title: "Initial Multi-Agent Career Orchestrator",
      notes: [
        "Launched DAG agent execution pipeline with structured JSON schema outputs.",
        "Created initial Chrome Extension copilot overlay for job boards.",
        "Published open-source career agent registries and division taxonomy maps.",
      ],
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
            <Sparkles className="w-3.5 h-3.5" /> Release Notes
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Platform <span className="text-sky-400">Changelog</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
            Continuous improvements, agent additions, protocol expansions, and architectural upgrades.
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-8 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
          {releases.map((rel) => (
            <div key={rel.version} className="relative pl-10">
              <div className="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-[#070b14] flex items-center justify-center border border-white/10 z-10">
                <GitCommit className="w-3.5 h-3.5 text-sky-400" />
              </div>

              <div className="p-6 rounded-2xl bg-[#070b14] border border-white/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-black bg-sky-400 px-2.5 py-0.5 rounded-full">
                      {rel.version}
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">{rel.title}</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{rel.date}</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  {rel.notes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-normal">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
