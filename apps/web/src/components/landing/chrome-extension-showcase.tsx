"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Zap,
  Sparkles,
  ChevronRight,
  Globe,
  ExternalLink,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ChromeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

export function ChromeExtensionShowcase() {
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, title: "1. Detect Role", desc: "Auto-parses LinkedIn & Greenhouse" },
    { id: 2, title: "2. Real-Time ATS", desc: "96.8% Instant match calibration" },
    { id: 3, title: "3. Skill Gap", desc: "Identifies 2 missing keywords" },
    { id: 4, title: "4. Auto-Fill", desc: "1-click tailored ATS form submission" },
    { id: 5, title: "5. STAR Prep", desc: "Generates custom interview questions" },
  ];

  return (
    <section id="extension" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 font-sans">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium mb-3">
          <ChromeIcon className="w-3.5 h-3.5" /> Browser Copilot Extension
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Supercharge Applications <span className="text-sky-400">Right in Your Browser</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
          The Career Agents Chrome Extension seamlessly embeds into LinkedIn, Indeed, and Greenhouse. Parse roles, calculate real-time ATS scores, and auto-fill forms in seconds.
        </p>
      </div>

      {/* Step Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 justify-start sm:justify-center">
        {steps.map((s) => (
          <button
            key={s.id}
            onClick={() => setStep(s.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              step === s.id
                ? "bg-sky-500 text-black font-bold shadow"
                : "bg-[#070b14] border border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {/* Browser Simulation Container */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#070b14] border border-white/10 overflow-hidden shadow-2xl">
        {/* Browser Top Navigation Bar */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-white/10 bg-white/[0.02]">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="flex-1 max-w-xl mx-auto flex items-center gap-2 px-3 py-1 rounded-lg bg-black/50 border border-white/10 text-xs font-mono text-slate-400">
            <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-slate-200 truncate">https://www.linkedin.com/jobs/view/3948201/</span>
          </div>

          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Copilot Active</span>
          </div>
        </div>

        {/* Browser Body Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 p-4 sm:p-8 gap-6">
          {/* Left: Job Page Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4 p-5 sm:p-6 rounded-xl bg-black/40 border border-white/10 text-xs">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Staff Infrastructure Software Engineer
                </h3>
                <div className="text-sky-400 font-mono mt-0.5">
                  Stripe • San Francisco, CA (Hybrid)
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 font-mono text-slate-300">
                $260k - $340k
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed font-normal">
              Stripe is looking for a Staff Infrastructure Engineer to join our Core Storage and Database Platform team. You will lead the architectural evolution of our multi-region distributed databases.
            </p>

            <div className="space-y-1.5 pt-2">
              <div className="font-semibold text-white">Core Requirements:</div>
              <div className="flex items-center gap-2 text-slate-400">
                <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>8+ years building high-concurrency backend services in Go or C++</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Deep expertise in Raft consensus, Spanner, or distributed storage</span>
              </div>
            </div>
          </div>

          {/* Right: Floating Copilot Panel (5 cols) */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-xl bg-[#090e1c] border border-sky-500/30 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-white text-xs">Career Agents Copilot</span>
              </div>
              <span className="text-[10px] font-mono text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded">
                Step {step}/5
              </span>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 font-mono text-xs"
                >
                  <div className="text-emerald-400 font-semibold">✓ Role Detected &amp; Parsed</div>
                  <p className="text-slate-300 font-normal text-[11px] leading-relaxed">
                    Extracted role title, tech stack requirements (Golang, Distributed Storage), and compensation bounds.
                  </p>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-slate-400 text-[11px]">
                    Candidate profile match ready for evaluation.
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Calibrated ATS Score:</span>
                    <span className="text-lg font-bold text-emerald-400">96.8%</span>
                  </div>
                  <p className="text-slate-300 font-normal text-[11px] leading-relaxed">
                    High signal match across Raft consensus, Go concurrency, and distributed data systems.
                  </p>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 font-mono text-xs"
                >
                  <div className="text-sky-400 font-semibold">Skill Gap Diagnosis:</div>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div>✓ Raft Consensus (Verified via GitHub)</div>
                    <div>✓ Distributed Spanner (Calibrated in v2.4)</div>
                    <div className="text-emerald-400">✓ 0 Critical missing skills</div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 font-mono text-xs"
                >
                  <div className="text-emerald-400 font-semibold">✓ 1-Click Form Calibrated</div>
                  <p className="text-slate-300 font-normal text-[11px] leading-relaxed">
                    ATS application form fields populated with tailored cover note and verified resume JSON.
                  </p>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 font-mono text-xs"
                >
                  <div className="text-sky-400 font-semibold">STAR Interview Focus:</div>
                  <p className="text-slate-300 font-normal text-[11px] leading-relaxed">
                    Generated 5 custom mock questions on distributed consensus failure modes and high-throughput microservices.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setStep((prev) => (prev % 5) + 1)}
              className="w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{step === 5 ? "Restart Simulation" : "Next Copilot Step"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
