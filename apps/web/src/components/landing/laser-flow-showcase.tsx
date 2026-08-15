"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Terminal, ArrowRight, ShieldCheck, Cpu, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LaserFlowShowcase() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const revealImgRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 font-sans">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium mb-3">
          <Terminal className="w-3.5 h-3.5" /> Architecture Explorer
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          System Architecture &amp; <span className="text-sky-400">Agent Pipeline</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300">
          Hover across the interactive inspection canvas below to reveal live runtime layers.
        </p>
      </div>

      {/* Interactive Laser Flow Reveal Box */}
      <div
        ref={containerRef}
        className="relative min-h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#070b14] shadow-lg group cursor-crosshair"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const el = revealImgRef.current;
          if (el) {
            el.style.setProperty("--mx", `${x}px`);
            el.style.setProperty("--my", `${y}px`);
          }
        }}
        onMouseLeave={() => {
          const el = revealImgRef.current;
          if (el) {
            el.style.setProperty("--mx", "-9999px");
            el.style.setProperty("--my", "-9999px");
          }
        }}
      >
        {/* Base Visible UI Content */}
        <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-between h-full min-h-[480px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-white tracking-wide">
                  Model Context Protocol (MCP) Server
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  port: 3001 | status: READY
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-sky-300">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping" />
              Interactive Inspection Canvas
            </div>
          </div>

          {/* Center Card Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="rounded-xl p-5 bg-white/[0.02] border border-white/10 hover:border-sky-500/30 transition-all">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 mb-3">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">167 AI Agents</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Structured across 19 technical divisions: AI Engineering, FAANG Prep, Cybersecurity, Data, Cloud &amp; DevRel.
              </p>
            </div>

            <div className="rounded-2xl p-5 bg-white/[0.02] border border-white/10 hover:border-sky-500/30 transition-all">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 mb-3">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Multi-Provider LLMs</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Seamless local &amp; cloud gateway switching: Ollama, OpenAI, Anthropic, Gemini, Groq, and DeepSeek.
              </p>
            </div>

            <div className="rounded-2xl p-5 bg-white/[0.02] border border-white/10 hover:border-sky-500/30 transition-all">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Local-First Storage</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Resumes, mock interviews, and repo audits operate locally via SQLite and indexed JSON schemas.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="text-xs text-slate-400 font-mono">
              ✓ Open standard integration with Cursor, Claude Code, Windsurf &amp; Antigravity
            </div>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="sm" className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs px-5 py-2 rounded-xl">
                Open Workspace <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Hover Radial Spotlight Reveal Overlay */}
        <div
          ref={revealImgRef}
          className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-150"
          style={{
            background: "radial-gradient(circle at var(--mx, -9999px) var(--my, -9999px), rgba(14, 165, 233, 0.15) 0px, rgba(14, 165, 233, 0.05) 160px, transparent 300px)",
            mixBlendMode: "screen",
          }}
        />
      </div>
    </section>
  );
}
