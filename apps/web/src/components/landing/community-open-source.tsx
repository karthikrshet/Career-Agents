"use client";

import React from "react";
import { GitBranch, ShieldCheck, Terminal, Layers, Code2, Users, ArrowUpRight } from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function CommunityOpenSource() {
  const highlights = [
    {
      title: "100% Local-First Data Security",
      desc: "All resume data, portfolio scans, and telemetry remain on your local SQLite storage. No unauthorized external telemetry.",
      icon: ShieldCheck,
      color: "text-cyan-400",
    },
    {
      title: "Native MCP Protocol Support",
      desc: "Export 31 developer tools to Claude Desktop, Cursor, or local LLMs through native Model Context Protocol.",
      icon: Terminal,
      color: "text-purple-400",
    },
    {
      title: "15+ LLM Provider Gateways",
      desc: "Automatic failover across Groq, Gemini, Claude, OpenAI, and local offline models via Ollama or LM Studio.",
      icon: Layers,
      color: "text-indigo-400",
    },
    {
      title: "Open Source Under MIT License",
      desc: "Fully open source codebase allowing customization, self-hosting, and community contribution.",
      icon: Code2,
      color: "text-emerald-400",
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-4">
          <GithubIcon className="w-3.5 h-3.5" /> Open Source &amp; Architecture
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Built for Developers, Powered by{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
            Open Source Community
          </span>
        </h2>
        <p className="mt-4 text-base text-slate-300">
          Career Agents is built on verifiable open architecture, providing complete transparency, local data privacy, and extensible AI tooling.
        </p>
      </div>

      {/* Grid Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="card-glass p-8 rounded-3xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed pl-14">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* GitHub Callout Footer */}
      <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-black to-purple-950/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 text-slate-300">
          <GithubIcon className="w-5 h-5 text-white" />
          <span>Star the project on GitHub, inspect the code, or contribute new AI agent personas.</span>
        </div>
        <a
          href="https://github.com/karthikrshet/Career-Agents"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-bold text-cyan-300 hover:text-white transition-colors whitespace-nowrap"
        >
          <span>View GitHub Repo</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
