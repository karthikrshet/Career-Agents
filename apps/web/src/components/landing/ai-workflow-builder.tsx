"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  GitBranch,
  Mic,
  Award,
  ArrowRight,
  Sparkles,
  Bot,
  Zap,
  Layers,
  ChevronRight
} from "lucide-react";

export function AIWorkflowBuilder() {
  const [activeStep, setActiveStep] = useState(1);

  const workflowSteps = [
    {
      id: 1,
      name: "Resume Parsing",
      agent: "ATS Parser Agent",
      icon: FileText,
      color: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-400",
      borderColor: "border-cyan-500/40",
      bgGlow: "shadow-[0_0_25px_rgba(56,189,248,0.25)]",
      desc: "Extracts contact information, work experience metrics, education, and technical skills into structured JSON.",
      output: "Parsed 4 core experience entries, 28 technical skills, zero parsing layout errors.",
    },
    {
      id: 2,
      name: "ATS Calibration",
      agent: "ATS Match Calibrator",
      icon: CheckCircle2,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-400",
      borderColor: "border-blue-500/40",
      bgGlow: "shadow-[0_0_25px_rgba(59,130,246,0.25)]",
      desc: "Compares parsed data against target job descriptions, identifying keyword gaps and impact bullet improvements.",
      output: "ATS Match Score: 96.8%. Recommended 3 bullet phrase rewrites.",
    },
    {
      id: 3,
      name: "Skill Gap Audit",
      agent: "GitHub & Code Inspector",
      icon: GitBranch,
      color: "from-purple-500 to-pink-600",
      textColor: "text-purple-400",
      borderColor: "border-purple-500/40",
      bgGlow: "shadow-[0_0_25px_rgba(168,85,247,0.25)]",
      desc: "Audits public GitHub repositories, commit history, test coverage, and architecture to build proof-of-work profiles.",
      output: "Scanned 12 repositories. Verified Distributed Systems, Golang, and Docker expertise.",
    },
    {
      id: 4,
      name: "Interview Prep",
      agent: "Voice STAR Mock Coach",
      icon: Mic,
      color: "from-pink-500 to-rose-600",
      textColor: "text-pink-400",
      borderColor: "border-pink-500/40",
      bgGlow: "shadow-[0_0_25px_rgba(244,63,94,0.25)]",
      desc: "Conducts real-time interactive mock interviews using STAR method evaluation for behavioral and system design.",
      output: "Mock Interview Completed. STAR Clarity Score: 94/100. Strong trade-off analysis.",
    },
    {
      id: 5,
      name: "Offer Strategy",
      agent: "Salary & Equity Negotiator",
      icon: Award,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/40",
      bgGlow: "shadow-[0_0_25px_rgba(16,185,129,0.25)]",
      desc: "Generates custom salary negotiation scripts, market compensation benchmarks, and counter-offer emails.",
      output: "Target Range: $250k - $280k Base + $150k Equity. Counter-offer draft ready.",
    },
  ];

  return (
    <section id="workflow" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-4">
          <Layers className="w-3.5 h-3.5" /> Automated Agent Pipeline
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How Career Agents{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Transforms Your Career
          </span>
        </h2>
        <p className="mt-4 text-base text-slate-300">
          An automated 5-step intelligence pipeline where specialized AI agents collaborate concurrently from resume upload to final job offer.
        </p>
      </div>

      {/* Visual Workflow Pipeline Graph */}
      <div className="relative mb-12">
        {/* Connection Line */}
        <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 -translate-y-1/2 z-0 opacity-30" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            const isSelected = activeStep === step.id;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`relative p-5 rounded-2xl bg-[#090d18] border transition-all duration-300 text-left cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? `${step.borderColor} ${step.bgGlow} bg-white/[0.05]`
                    : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-r ${step.color} text-white shadow-md`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      0{step.id}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{step.name}</h3>
                  <div className={`text-[11px] font-mono font-semibold ${step.textColor}`}>
                    {step.agent}
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    layoutId="activePill"
                    className="mt-4 pt-2 border-t border-white/10 text-[10px] text-cyan-300 font-mono flex items-center justify-between"
                  >
                    <span>Active Telemetry</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Telemetry Card */}
      <AnimatePresence mode="wait">
        {workflowSteps
          .filter((s) => s.id === activeStep)
          .map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="p-8 rounded-3xl bg-[#090d18]/90 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(56,189,248,0.15)] max-w-4xl mx-auto"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${step.color} text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                        Step 0{step.id} Telemetry
                      </div>
                      <h3 className="text-xl font-bold text-white">{step.name} — {step.agent}</h3>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
                    ● Agent Status: Execution Complete
                  </span>
                </div>

                <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                  <p>{step.desc}</p>

                  <div className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-emerald-300 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white mb-1">Execution Output Preview:</div>
                      <div>{step.output}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </AnimatePresence>
    </section>
  );
}
