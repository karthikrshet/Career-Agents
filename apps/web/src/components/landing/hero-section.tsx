"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  ChevronRight,
  Terminal,
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
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden z-10 font-sans">
      {/* Top Release Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-sm hover:border-sky-500/30 transition-all cursor-pointer group mb-6 max-w-full"
      >
        <span className="flex h-2 w-2 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
        </span>
        <span className="text-[11px] sm:text-xs font-medium text-slate-200 truncate">
          167 AI Agents Across 19 Divisions
        </span>
        <span className="text-slate-600 hidden sm:inline">|</span>
        <span className="text-[11px] sm:text-xs text-sky-400 font-medium group-hover:text-sky-300 items-center gap-1 hidden sm:flex transition-colors">
          Explore Registry
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </motion.div>

      {/* Main Headline */}
      <div className="max-w-4xl space-y-3">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1]"
        >
          Career Agents
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl sm:text-4xl md:text-5xl font-bold text-sky-400 tracking-tight leading-snug"
        >
          The AI Career Operating System
        </motion.h2>
      </div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-5 max-w-2xl text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed px-2"
      >
        An open-source platform empowering software engineers and technical candidates with{" "}
        <span className="text-white font-semibold">167 specialized AI agents</span>, local-first ATS resume auditing, STAR mock interview labs, and Model Context Protocol (MCP) tool integration.
      </motion.p>

      {/* Primary Actions Row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto"
      >
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button
            size="sm"
            className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow-md transition-all duration-200"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>

        <a
          href="https://github.com/karthikrshet/Career-Agents"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto"
        >
          <Button
            size="sm"
            variant="outline"
            className="w-full sm:w-auto bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border-white/10 hover:border-white/20 text-xs sm:text-sm font-medium px-5 py-2.5 rounded-lg transition-all"
          >
            <GithubIcon className="w-3.5 h-3.5 mr-1.5" />
            <span>Open Source on GitHub</span>
          </Button>
        </a>
      </motion.div>

      {/* Trust Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400 font-medium"
      >
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Local-First Security
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
          <Zap className="w-3.5 h-3.5 text-sky-400" /> 15+ LLM Gateways
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
          <Terminal className="w-3.5 h-3.5 text-sky-400" /> MCP Ready
        </span>
      </motion.div>
    </section>
  );
}
