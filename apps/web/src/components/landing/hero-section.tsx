"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  ChevronRight,
  Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] pt-32 pb-16 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden z-10 font-sans">
      {/* Top Release Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(56,189,248,0.15)] hover:border-cyan-400/50 transition-all cursor-pointer group mb-6"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="text-xs font-semibold text-cyan-300">
          Career Agents v15.0 Enterprise
        </span>
        <span className="text-xs text-slate-500">|</span>
        <span className="text-xs text-slate-300 group-hover:text-white flex items-center gap-1 transition-colors">
          The AI Career Operating System
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-4xl font-extrabold text-white tracking-tight"
      >
        <span>Career Agents</span>
        <br />
        <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.3)]">
          The AI Career Operating System
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-5 max-w-2xl text-base sm:text-lg text-slate-300 font-normal leading-relaxed"
      >
        An open-source AI platform empowering software engineers, candidates, and recruiters using{" "}
        <span className="text-cyan-300 font-semibold">146 specialized AI agents</span>, real-time ATS scoring, STAR interview drills, and Model Context Protocol (MCP) tool integration.
      </motion.p>

      {/* Primary Actions Row */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3.5 max-w-xl"
      >
        <Link href="/dashboard" data-cursor="magnetic">
          <Button
            size="lg"
            className="relative group bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs px-7 py-5 rounded-xl shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_35px_rgba(56,189,248,0.55)] transition-all duration-200"
          >
            <Sparkles className="w-4 h-4 mr-2 text-cyan-200 group-hover:rotate-12 transition-transform" />
            <span>Launch Platform</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>

        <a
          href="https://github.com/karthikrshet/Career-Agents"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="pointer"
        >
          <Button
            size="lg"
            variant="outline"
            className="bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border-white/10 hover:border-cyan-500/40 text-xs font-medium px-5 py-5 rounded-xl backdrop-blur-md transition-all"
          >
            <GithubIcon className="w-4 h-4 mr-2" />
            <span>GitHub Repository</span>
          </Button>
        </a>
      </motion.div>

      {/* Trust Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium"
      >
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400" /> 100% Local-First Data Security
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-400" /> 15+ LLM Provider Gateways
        </span>
        <span className="flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-emerald-400" /> Model Context Protocol (MCP)
        </span>
      </motion.div>
    </section>
  );
}
