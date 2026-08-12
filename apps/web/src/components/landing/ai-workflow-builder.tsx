"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  GitBranch,
  Mic,
  Award,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function AIWorkflowBuilder() {
  const [activeStep, setActiveStep] = useState(1);

  const workflowSteps = [
    {
      id: 1,
      num: "01",
      name: "Resume Parsing",
      agent: "ATS Parser Agent",
      role: "Structural Parser",
      icon: FileText,
      desc: "Extracts contact information, work experience metrics, education, and technical skills into standardized structured JSON schemas.",
      metrics: [
        { label: "Parse Accuracy", value: "99.4%" },
        { label: "Latency", value: "140ms" },
        { label: "Extracted Skills", value: "28 Skills" },
      ],
      output: `{\n  "status": "PARSED_SUCCESS",\n  "experience_blocks": 4,\n  "extracted_skills": ["Golang", "Kubernetes", "Kafka", "PostgreSQL", "Distributed Systems"],\n  "syntax_anomalies": 0\n}`,
    },
    {
      id: 2,
      num: "02",
      name: "ATS Calibration",
      agent: "ATS Match Calibrator",
      role: "Keyword Scorer",
      icon: CheckCircle2,
      desc: "Cross-references parsed resume data against target job descriptions, identifying keyword gaps and impact bullet improvements.",
      metrics: [
        { label: "Match Score", value: "96.8%" },
        { label: "Keyword Alignment", value: "24/25 Matched" },
        { label: "Bullet Rewrites", value: "3 Optimized" },
      ],
      output: `{\n  "target_track": "Staff Infrastructure Engineer (L6)",\n  "ats_score": 96.8,\n  "keyword_density": "Optimal (4.2%)",\n  "bullet_enhancements": 3,\n  "calibrated_status": "READY_FOR_SUBMISSION"\n}`,
    },
    {
      id: 3,
      num: "03",
      name: "Skill Gap Audit",
      agent: "GitHub & Code Inspector",
      role: "Codebase Auditor",
      icon: GitBranch,
      desc: "Audits public GitHub repositories, commit velocity, test coverage, and distributed system patterns to build proof-of-work profiles.",
      metrics: [
        { label: "Repos Scanned", value: "12 Repos" },
        { label: "Test Density", value: "88.2%" },
        { label: "Verified Stack", value: "Go, Rust, Docker" },
      ],
      output: `{\n  "repositories_audited": 12,\n  "code_quality_rating": "A+",\n  "verified_competencies": ["Distributed Sharding", "Concurrent Go Channels", "Docker Containers"],\n  "proof_of_work": "VERIFIED"\n}`,
    },
    {
      id: 4,
      num: "04",
      name: "Interview Prep",
      agent: "Voice STAR Mock Coach",
      role: "Simulation Coach",
      icon: Mic,
      desc: "Conducts real-time interactive technical mock interviews using STAR evaluation for behavioral, architectural, and system design tracks.",
      metrics: [
        { label: "STAR Score", value: "94/100" },
        { label: "Trade-Off Depth", value: "High (L6+)" },
        { label: "Pacing", value: "125 wpm" },
      ],
      output: `{\n  "simulation_type": "System Design Outage & Failure Recovery",\n  "star_clarity_score": 94,\n  "tradeoff_analysis": "EXCELLENT",\n  "latency_awareness": "HIGH_SIGNAL"\n}`,
    },
    {
      id: 5,
      num: "05",
      name: "Offer Strategy",
      agent: "Salary & Equity Negotiator",
      role: "Compensation Strategist",
      icon: Award,
      desc: "Generates custom compensation counter-offer drafts, equity valuation modeling, and negotiation playbooks.",
      metrics: [
        { label: "Target Base", value: "$240k - $275k" },
        { label: "Equity Target", value: "$180k/yr" },
        { label: "Sign-on Target", value: "$45,000" },
      ],
      output: `{\n  "negotiation_leverage": "STRONG",\n  "market_percentile": "90th Percentile",\n  "counter_offer_script": "COMPILED",\n  "equity_vesting_review": "CONFIRMED"\n}`,
    },
  ];

  const currentStep = workflowSteps.find((s) => s.id === activeStep) || workflowSteps[0];
  const StepIcon = currentStep.icon;

  return (
    <section id="workflow" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 font-sans">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium mb-3">
          <Layers className="w-3.5 h-3.5" /> Autonomous 5-Step Pipeline
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          How Career Agents <span className="text-sky-400">Transforms Your Search</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
          An automated intelligence pipeline where specialized AI agents collaborate concurrently from resume upload to final job offer.
        </p>
      </div>

      {/* Horizontal Interactive Step Pipeline Graph */}
      <div className="mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-3.5 sm:p-4 rounded-xl text-left transition-all flex flex-col justify-between border ${
                  isActive
                    ? "bg-[#070b14] border-sky-500 shadow-md text-white"
                    : "bg-[#050811] border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isActive
                        ? "bg-sky-500 text-black"
                        : "bg-white/[0.04] text-slate-400"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {step.num}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    {step.name}
                  </h3>
                  <div className={`text-[11px] font-mono mt-0.5 ${isActive ? "text-sky-400 font-semibold" : "text-slate-400"}`}>
                    {step.agent}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Real-Time Inspector */}
      <div className="rounded-2xl bg-[#070b14] border border-white/10 overflow-hidden shadow-2xl p-5 sm:p-8 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Header Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400">
                  <StepIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-sky-400 font-semibold uppercase">
                    Phase {currentStep.num} • {currentStep.role}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {currentStep.name} — {currentStep.agent}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                <Activity className="w-3.5 h-3.5" />
                <span>Execution Complete</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {currentStep.desc}
            </p>

            {/* Metrics Strip */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 font-mono text-xs">
              {currentStep.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-black/40 border border-white/10"
                >
                  <div className="text-slate-400 text-[10px] sm:text-[11px] truncate">{m.label}</div>
                  <div className="text-sm font-bold text-white mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Output Stream Terminal */}
            <div className="p-4 rounded-xl bg-black/80 border border-white/10 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-white font-bold">
                  <Terminal className="w-3.5 h-3.5 text-sky-400" /> Output Stream
                </span>
                <span className="text-sky-300">
                  agent://{currentStep.agent.toLowerCase().replace(/\s+/g, "-")}
                </span>
              </div>
              <pre className="text-emerald-400 text-[11px] sm:text-xs overflow-x-auto leading-relaxed pt-1">
                <code>{currentStep.output}</code>
              </pre>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
