"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  FileText,
  Mic,
  Terminal,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  Play,
  RotateCcw,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<"telemetry" | "ats" | "interview" | "mcp">("telemetry");
  const [isSimulating, setIsSimulating] = useState(true);
  const [simStep, setSimStep] = useState(0);

  // Auto-simulation ticker
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setSimStep((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const tabs = [
    { id: "telemetry", label: "Agent Telemetry", icon: Activity },
    { id: "ats", label: "ATS Scorecard", icon: FileText },
    { id: "interview", label: "STAR Mock Coach", icon: Mic },
    { id: "mcp", label: "MCP Server", icon: Terminal },
  ] as const;

  const telemetryLogs = [
    "[14:22:01.104] [orchestrator] Initializing concurrent DAG with 5 specialized agent nodes...",
    "[14:22:01.240] [ats-parser] Extraction complete: 4 roles, 28 technical skills, 0 syntax faults.",
    "[14:22:01.395] [ats-calibrator] Match ratio: 96.8% for Staff Systems Engineer track. 3 bullet rewrites compiled.",
    "[14:22:01.512] [github-inspector] Audited 12 repositories: Verified Golang, Rust, Docker & Distributed Systems.",
  ];

  return (
    <section id="dashboard" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 font-sans">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Interactive Product Workspace
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Experience the <span className="text-sky-400">AI Mission Control</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
          Inspect live agent telemetry, run local resume audits, simulate mock interview loops, and explore Model Context Protocol (MCP) server endpoints in real time.
        </p>
      </div>

      {/* Main Mission Control Console Interface */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#070b14] border border-white/10 overflow-hidden shadow-2xl">
        {/* Top Console Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-white/10 bg-white/[0.02]">
          {/* Tab Selector Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsSimulating(false);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-sky-500 text-black font-bold shadow"
                      : "text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Status Controls */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              167 Agents Online
            </span>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white text-[11px] flex items-center gap-1"
            >
              {isSimulating ? <RotateCcw className="w-3 h-3 animate-spin text-sky-400" /> : <Play className="w-3 h-3 text-sky-400" />}
              <span>{isSimulating ? "Live Feed" : "Paused"}</span>
            </button>
          </div>
        </div>

        {/* Console Body Area */}
        <div className="p-4 sm:p-8">
          <AnimatePresence mode="wait">
            {activeTab === "telemetry" && (
              <motion.div
                key="telemetry"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Metric Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-slate-400 text-[11px] mb-1">Active Pipeline</div>
                    <div className="text-sm sm:text-base font-bold text-white">Concurrent DAG</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-slate-400 text-[11px] mb-1">Total Latency</div>
                    <div className="text-sm sm:text-base font-bold text-sky-400">184ms (p99)</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-slate-400 text-[11px] mb-1">LLM Fallback</div>
                    <div className="text-sm sm:text-base font-bold text-emerald-400">0 Faults</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-slate-400 text-[11px] mb-1">Storage Mode</div>
                    <div className="text-sm sm:text-base font-bold text-white">Local SQLite</div>
                  </div>
                </div>

                {/* Live Console Output Box */}
                <div className="p-4 sm:p-5 rounded-xl bg-black/70 border border-white/10 font-mono text-xs space-y-2 text-slate-300 overflow-x-auto">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px] text-slate-400">
                    <span className="text-white font-bold flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-sky-400" /> Real-Time Telemetry Stream
                    </span>
                    <span className="text-sky-300">dag_execution_id: #8f92a4</span>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    {telemetryLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`transition-opacity ${idx <= simStep ? "opacity-100 text-slate-200" : "opacity-30"}`}
                      >
                        <span className={idx === simStep ? "text-sky-400 font-semibold" : "text-slate-400"}>
                          {log}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "ats" && (
              <motion.div
                key="ats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="p-4 sm:p-6 rounded-xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono text-sky-400 font-semibold uppercase">
                      ATS Match Calibration
                    </div>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      Staff Infrastructure &amp; Systems Engineer (L6)
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-emerald-400 font-mono">96.8%</div>
                    <div className="text-[11px] text-slate-400 font-mono">Calibrated Score</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-slate-300 space-y-2">
                  <div className="text-slate-400 font-semibold">Recommended Bullet Rewrite:</div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10 text-slate-400 line-through">
                    - Built backend services and reduced query latency using cache.
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 font-medium">
                    ✓ Architected distributed Redis cluster caching layer across 14 microservices, slashing p99 API latency from 420ms to 48ms under 2.4M QPS load.
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "interview" && (
              <motion.div
                key="interview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="p-4 sm:p-6 rounded-xl bg-black/50 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-sky-400 font-semibold">STAR Question #04 • Behavioral &amp; System Failure</span>
                    <span className="text-slate-400">Rubric: Meta E6 / Google L6</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    &ldquo;Describe a critical production outage where cascading failure occurred across services. How did you diagnose the root cause and prevent recurrence?&rdquo;
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10">
                    <div className="text-slate-400 text-[11px]">Situation &amp; Task</div>
                    <div className="text-emerald-400 font-bold mt-1">98/100 (Strong Context)</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10">
                    <div className="text-slate-400 text-[11px]">Action (Trade-Offs)</div>
                    <div className="text-emerald-400 font-bold mt-1">94/100 (Circuit Breaker)</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10">
                    <div className="text-slate-400 text-[11px]">Result &amp; Impact</div>
                    <div className="text-emerald-400 font-bold mt-1">96/100 (Zero Recurrence)</div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "mcp" && (
              <motion.div
                key="mcp"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="p-4 sm:p-5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs space-y-2 text-slate-300">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px] text-slate-400">
                    <span className="text-sky-400 font-bold">mcp://tools/career_ops_audit</span>
                    <span className="text-emerald-400 font-semibold">JSON-RPC 2.0 Ready</span>
                  </div>
                  <pre className="text-slate-300 text-xs overflow-x-auto leading-relaxed pt-1">
{`{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "career_pipeline_match",
    "arguments": {
      "candidate_id": "karthik_profile",
      "target_role": "Staff Distributed Systems Engineer",
      "ats_rubric": ["architecture", "concurrency", "fault_tolerance"]
    }
  }
}`}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Row */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">
              ✓ Compatible with Claude Code, Cursor, Windsurf, and Antigravity IDE
            </span>
            <Link href="/dashboard">
              <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs px-4 py-2 rounded-lg">
                <span>Launch Full Console</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
