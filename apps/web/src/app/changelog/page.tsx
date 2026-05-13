// apps/web/src/app/changelog/page.tsx
"use client";

import { ArrowLeft, GitCommit, Zap } from "lucide-react";
import Link from "next/link";

export default function ChangelogPage() {
  const releases = [
    {
      version: "v8.0.0",
      date: "July 28, 2026",
      title: "Enterprise SaaS & Portal Release",
      notes: [
        "Reorganized App Router mapping root pages to dashboard contexts.",
        "Created premium marketing platform landing, pricing, enterprise, and security routes.",
        "Implemented PostgreSQL-backed session, profile, and RAG vector indexes storage.",
        "Integrated NextAuth session adapters.",
        "Wired secure code playground returns mapping exit codes and memory overheads."
      ]
    },
    {
      version: "v4.0.0",
      date: "July 3, 2026",
      title: "AI Gateway and Multi-Agent Orchestrator",
      notes: [
        "Engineered the multi-provider routing completion loops with failover rules.",
        "Introduced the Brain agent scheduler planner.",
        "Added local forensic PDF, DOCX, Excel, and PPTX text extraction engines.",
        "Launched the initial low-code workspace workflow builder."
      ]
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

        <h1 className="text-3xl font-extrabold text-white mb-6">Changelog</h1>
        <p className="text-sm text-slate-400 mb-12 max-w-2xl leading-relaxed">
          Stable release notes and project changes.
        </p>

        <div className="space-y-12 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-900">
          {releases.map(rel => (
            <div key={rel.version} className="relative pl-10">
              <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center border border-slate-900 z-10">
                <GitCommit className="w-4 h-4 text-indigo-400" />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-bold text-white bg-indigo-600 px-2.5 py-0.5 rounded-full">
                    {rel.version}
                  </span>
                  <span className="text-[10px] text-slate-500">{rel.date}</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-3 mb-4">{rel.title}</h3>
                <ul className="space-y-2 text-xs text-slate-400 list-disc list-inside">
                  {rel.notes.map((note, idx) => (
                    <li key={idx} className="leading-relaxed">{note}</li>
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
