"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Zap, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-4">
          <Zap className="w-3.5 h-3.5" /> Transparent Pricing &amp; Open Source
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Simple, Transparent{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Plans
          </span>
        </h2>
        <p className="mt-4 text-base text-slate-300">
          Start 100% free with local-first open-source capabilities or upgrade for high-concurrency cloud LLM failover.
        </p>

        {/* Annual Toggle Switch */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={`text-xs font-medium ${!annual ? "text-white" : "text-slate-400"}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setAnnual((prev) => !prev)}
            className="relative w-14 h-8 rounded-full bg-white/10 p-1 transition-colors border border-white/10"
          >
            <div
              className={`w-6 h-6 rounded-full bg-cyan-400 shadow-md transition-transform ${
                annual ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-xs font-medium flex items-center gap-1.5 ${annual ? "text-white" : "text-slate-400"}`}>
            Yearly Billing
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tier 1: Free Open Source */}
        <div className="p-8 rounded-3xl bg-[#090d18] border border-white/10 backdrop-blur-2xl space-y-6 flex flex-col justify-between">
          <div>
            <div className="text-sm font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">
              Community Edition
            </div>
            <h3 className="text-2xl font-bold text-white">Open Source</h3>
            <p className="text-xs text-slate-400 mt-1">100% free forever for personal developer usage.</p>
            <div className="mt-6 text-4xl font-extrabold text-white font-mono">$0</div>

            <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All 146 Specialized AI Agents</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Native Model Context Protocol (MCP) Server</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Local SQLite Data Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Local Ollama &amp; LM Studio Integration</span>
              </div>
            </div>
          </div>

          <a href="https://github.com/karthikrshet/Career-Agents" target="_blank" rel="noopener noreferrer" className="mt-8">
            <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs font-semibold py-3 rounded-xl">
              Clone on GitHub
            </Button>
          </a>
        </div>

        {/* Tier 2: Pro Engineer (Popular) */}
        <div className="relative p-8 rounded-3xl bg-[#090d18] border-2 border-cyan-500 shadow-[0_0_50px_rgba(56,189,248,0.2)] backdrop-blur-2xl space-y-6 flex flex-col justify-between">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg">
            Most Popular
          </div>

          <div>
            <div className="text-sm font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">
              Pro Candidate
            </div>
            <h3 className="text-2xl font-bold text-white">Pro Engineer</h3>
            <p className="text-xs text-slate-400 mt-1">For active job seekers who want high-speed cloud LLMs.</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white font-mono">
                ${annual ? "15" : "19"}
              </span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-semibold text-white">Unlimited High-Speed Groq &amp; Gemini Gateways</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Chrome Extension Auto-Fill Suite</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Unlimited STAR Voice Mock Interviews</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>GitHub Repository &amp; Code Quality Auditing</span>
              </div>
            </div>
          </div>

          <Link href="/dashboard" className="mt-8">
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.4)]">
              Start Free Trial
            </Button>
          </Link>
        </div>

        {/* Tier 3: Enterprise Team */}
        <div className="p-8 rounded-3xl bg-[#090d18] border border-white/10 backdrop-blur-2xl space-y-6 flex flex-col justify-between">
          <div>
            <div className="text-sm font-mono text-purple-400 font-bold uppercase tracking-wider mb-2">
              University &amp; Cohort
            </div>
            <h3 className="text-2xl font-bold text-white">Team &amp; Enterprise</h3>
            <p className="text-xs text-slate-400 mt-1">For bootcamps, universities, and recruiting cohorts.</p>
            <div className="mt-6 text-4xl font-extrabold text-white font-mono">Custom</div>

            <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Custom RAG Index &amp; Shared Team Knowledge</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Dedicated Enterprise SLA &amp; Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Custom LLM Provider Endpoints</span>
              </div>
            </div>
          </div>

          <Link href="/contact" className="mt-8">
            <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs font-semibold py-3 rounded-xl">
              Contact Enterprise Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
