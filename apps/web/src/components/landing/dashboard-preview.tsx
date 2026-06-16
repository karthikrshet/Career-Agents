"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Bot,
  Mic,
  Briefcase,
  Upload,
  GitBranch,
  Terminal,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<"overview" | "resume" | "interview" | "mcp">("overview");

  const tabs = [
    { id: "overview", label: "Workspace Overview", icon: LayoutDashboard },
    { id: "resume", label: "Resume ATS Audit", icon: FileText },
    { id: "interview", label: "STAR Mock Lab", icon: Mic },
    { id: "mcp", label: "MCP Tool Explorer", icon: Terminal },
  ];

  return (
    <section id="dashboard" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Interactive Product Workspace
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Experience the Real{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            AI Career Operating System
          </span>
        </h2>
        <p className="mt-4 text-base text-slate-300">
          Inspect live agent telemetry, run local resume audits, conduct STAR mock interviews, and trigger Model Context Protocol (MCP) developer tools.
        </p>
      </div>

      {/* Main SaaS Dashboard Container */}
      <div className="card-dashboard relative rounded-3xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-medium text-emerald-400">
              146 Agents Ready
            </span>
          </div>
        </div>

        {/* Tab Preview Content */}
        <div className="p-6 sm:p-8 min-h-[460px]">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Action Prompts Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card-glass p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span>Resume ATS Audit</span>
                        <FileText className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="text-sm font-bold text-white">Upload Your Resume</div>
                      <div className="text-xs text-slate-400 mt-1">
                        Run ATS Calibrator &amp; Bullet Rewriter on your PDF or DOCX file.
                      </div>
                    </div>
                    <Link href="/resume" className="mt-4">
                      <Button size="sm" className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs">
                        <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload File
                      </Button>
                    </Link>
                  </div>

                  <div className="card-glass p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span>GitHub Code Audit</span>
                        <GitBranch className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="text-sm font-bold text-white">Connect Repository</div>
                      <div className="text-xs text-slate-400 mt-1">
                        Scan test coverage, README density, and architecture patterns.
                      </div>
                    </div>
                    <Link href="/github" className="mt-4">
                      <Button size="sm" className="w-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs">
                        <GitBranch className="w-3.5 h-3.5 mr-1.5" /> Analyze Repo
                      </Button>
                    </Link>
                  </div>

                  <div className="card-glass p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span>Interview Prep</span>
                        <Mic className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-sm font-bold text-white">Start STAR Mock Session</div>
                      <div className="text-xs text-slate-400 mt-1">
                        Practice behavioral and system design questions with instant evaluation.
                      </div>
                    </div>
                    <Link href="/interview" className="mt-4">
                      <Button size="sm" className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs">
                        <Mic className="w-3.5 h-3.5 mr-1.5" /> Practice Now
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Real Telemetry Output Feed */}
                <div className="card-glass p-6 rounded-2xl space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-white font-bold flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" /> Agent Orchestrator Status Stream
                    </span>
                    <span className="text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      Local SQLite Ready
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-black/40 border border-white/10 text-slate-300">
                      <span className="text-cyan-400 font-bold">[SYSTEM]</span> Agent Brain initialized with 146 specialized prompt personas. Multi-provider LLM gateway ready.
                    </div>
                    <div className="p-3 rounded-lg bg-black/40 border border-white/10 text-slate-300">
                      <span className="text-purple-400 font-bold">[MCP]</span> Model Context Protocol server exposing 31 developer tools on localhost endpoint.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "resume" && (
              <motion.div
                key="resume"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" /> Resume Studio Audit Workflow
                </div>
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-4">
                  <Upload className="w-10 h-10 text-cyan-400 mx-auto opacity-80" />
                  <div className="text-base font-bold text-white">Upload your resume to perform a live ATS audit</div>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Supported formats: PDF, DOCX, TXT. Local-first parser processes all data securely on your device.
                  </p>
                  <Link href="/resume" className="inline-block">
                    <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs px-6 py-2 rounded-xl">
                      Open Resume Studio
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {activeTab === "interview" && (
              <motion.div
                key="interview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Mic className="w-4 h-4 text-emerald-400" /> STAR Behavioral &amp; Technical Interview Lab
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 text-xs">
                  <div className="font-semibold text-slate-200">Select Practice Category:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/40 cursor-pointer">
                      <div className="font-bold text-white">System Design</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Rate Limiters, Microservices, Spanner</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/40 cursor-pointer">
                      <div className="font-bold text-white">Behavioral STAR</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Leadership, Conflict, Trade-offs</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/40 cursor-pointer">
                      <div className="font-bold text-white">Coding Architecture</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Concurrency, Memory, Data Structures</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "mcp" && (
              <motion.div
                key="mcp"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" /> Native Model Context Protocol (MCP) Tools
                </div>
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 font-mono text-xs text-purple-300 space-y-2">
                  <div>{"// Registered MCP Tools available for Cursor, Claude Desktop & Agents:"}</div>
                  <div className="text-slate-300 pl-4">• search_agents(query: string)</div>
                  <div className="text-slate-300 pl-4">• recommend_agents(task: string)</div>
                  <div className="text-slate-300 pl-4">• resume_score(resumeId: string)</div>
                  <div className="text-slate-300 pl-4">• career_gap_analysis(profileId: string)</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
