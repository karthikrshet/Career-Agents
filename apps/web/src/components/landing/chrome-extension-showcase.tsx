"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Zap,
  Sparkles,
  Bookmark,
  Send,
  HelpCircle,
  FileCheck,
  Building,
  Globe,
  ExternalLink,
  ChevronRight
} from "lucide-react";

const ChromeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);
import { Button } from "@/components/ui/button";

export function ChromeExtensionShowcase() {
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, title: "1. Detect Job Page", desc: "Auto-parses LinkedIn, Indeed, Glassdoor" },
    { id: 2, title: "2. Real-Time ATS Score", desc: "Instantly audits match against your profile" },
    { id: 3, title: "3. Skill Gap Analysis", desc: "Highlights missing keywords & experience" },
    { id: 4, title: "4. One-Click Auto-Fill", desc: "Fills ATS form fields with calibrated data" },
    { id: 5, title: "5. Generate Questions", desc: "Extracts custom company interview prep" },
  ];

  return (
    <section id="extension" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-medium mb-4">
          <ChromeIcon className="w-3.5 h-3.5" /> Browser Copilot Extension
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Supercharge Job Applications{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 bg-clip-text text-transparent">
            Right Inside Your Browser
          </span>
        </h2>
        <p className="mt-4 text-base text-slate-300">
          The Career Agents Chrome Extension seamlessly embeds into LinkedIn, Indeed, and company job portals. Parse roles, calculate real-time ATS match scores, auto-fill forms, and generate interview questions in seconds.
        </p>
      </div>

      {/* Step Selector Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {steps.map((s) => (
          <button
            key={s.id}
            onClick={() => setStep(s.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              step === s.id
                ? "bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Browser Window Mockup */}
      <div className="relative rounded-2xl bg-[#090d18] border border-purple-500/20 shadow-[0_0_60px_rgba(168,85,247,0.15)] overflow-hidden backdrop-blur-2xl max-w-5xl mx-auto">
        {/* Browser Top Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <div className="flex-1 max-w-md mx-auto px-3 py-1 rounded-lg bg-black/40 border border-white/10 flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-300">https://www.linkedin.com/jobs/view/3948201/</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold flex items-center gap-1 border border-purple-500/30">
              <ChromeIcon className="w-3 h-3" /> Extension Active
            </span>
          </div>
        </div>

        {/* Browser Page Body Split */}
        <div className="grid grid-cols-1 md:grid-cols-3 min-h-[420px]">
          {/* Left Column: Simulated LinkedIn Web Page */}
          <div className="md:col-span-2 p-6 border-r border-white/10 bg-white/[0.01] space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="text-xl font-bold text-white">Staff Infrastructure Software Engineer</div>
                <div className="text-xs text-purple-400 font-medium mt-0.5 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" /> Stripe • San Francisco, CA (Hybrid)
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
                $260,000 - $340,000 / yr
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong className="text-white">About the role:</strong> Stripe is looking for a Staff Infrastructure Engineer to join our Core Storage and Database Platform team. You will lead the architectural evolution of our multi-region distributed databases handling trillions in volume.
              </p>
              <div>
                <strong className="text-white">Requirements:</strong>
                <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-400">
                  <li>8+ years building high-concurrency backend microservices in Go or C++</li>
                  <li>Deep expertise in Raft consensus, Spanner, or distributed storage engines</li>
                  <li>Track record of leading cross-functional platform engineering teams</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Career Agents Floating Drawer */}
          <div className="p-5 bg-[#0d1222] border-l border-purple-500/30 flex flex-col justify-between space-y-4 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">Career Agents Overlay</span>
                </div>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                  Step {step}/5
                </span>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-3"
                  >
                    <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200">
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-purple-400" /> Page Successfully Parsed
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1">
                        Parsed role title, company profile, tech stack requirements, and compensation bounds.
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-3 text-center"
                  >
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center rounded-full border-4 border-purple-400 text-3xl font-extrabold font-mono text-white shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                      94%
                    </div>
                    <div className="text-xs font-bold text-white">High ATS Compatibility Match</div>
                    <p className="text-[11px] text-slate-400">
                      Your master resume aligns with 18 of 19 primary candidate criteria.
                    </p>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-2 text-xs"
                  >
                    <div className="text-xs font-bold text-white">Detected Keyword Gaps:</div>
                    <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center justify-between">
                      <span>Distributed Raft Consensus</span>
                      <span className="font-mono text-[10px]">Add +2 bullets</span>
                    </div>
                    <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] flex items-center justify-between">
                      <span>Multi-Region Failover</span>
                      <span className="font-mono text-[10px]">Match Found</span>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-3 text-xs"
                  >
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                      <div className="font-bold flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-emerald-400" /> One-Click Auto-Fill Ready
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1">
                        Populated 12 application fields including Work Authorization, Portfolio URLs, and Tailored Summary.
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-2 text-xs"
                  >
                    <div className="text-xs font-bold text-white">Generated Stripe Specific Questions:</div>
                    <div className="p-2.5 rounded bg-white/5 border border-white/10 text-slate-300 text-[11px]">
                      "How do you approach database schema migrations at Stripe scale without locking tables?"
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Action Controls */}
            <div className="pt-3 border-t border-white/10 flex items-center gap-2">
              <Button
                onClick={() => setStep((prev) => (prev < 5 ? prev + 1 : 1))}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs py-2 rounded-lg"
              >
                <span>{step < 5 ? "Next Step →" : "Restart Demo"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
