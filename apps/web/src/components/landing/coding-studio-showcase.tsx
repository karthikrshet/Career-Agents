"use client";

import React from "react";
import Link from "next/link";
import { Code2, Zap, Brain, Trophy, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CodingStudioShowcase() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#030712] via-[#090d16] to-[#030712] border-y border-border/40">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge className="bg-amber-500/15 border-amber-500/30 text-amber-400 font-mono text-xs py-1 px-4 rounded-full">
            ⚡ Enterprise Playground & Live Judge
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">Coding Studio</span> Workspace
          </h2>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed">
            Practice 240+ coding interview problems with 20-language execution, interactive algorithm visualizers, AI STAR interview coaching, and live virtual contests.
          </p>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#0c0d14] border border-border/60 hover:border-amber-500/40 transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">20-Language Compiler</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compile & run C++, Java, Python3, JS, TS, Rust, Go, Swift, Kotlin, and 11 more languages in isolated sandboxes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0d14] border border-border/60 hover:border-sky-500/40 transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Algorithm Visualizer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Step-by-step interactive animations for Two Pointers, Binary Search, Sorting, Stacks, Linked Lists, and Dynamic Programming.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0d14] border border-border/60 hover:border-indigo-500/40 transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">AI STAR Interview Coach</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get progressive hints, dry-run code explanations, complexity breakdowns, and STAR behavioral interview linkages.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0d14] border border-border/60 hover:border-emerald-500/40 transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Virtual Contests & Roadmaps</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Master Blind 75, NeetCode 150, company-specific question sets (Google, Meta, Amazon), and timed virtual contests.
            </p>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-transparent border border-amber-500/30 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
              <Sparkles className="w-4 h-4" /> Free Trial Unlocked For All Users
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white">Ready to Master Coding Interviews?</h3>
            <p className="text-xs text-slate-300">
              Access all 240+ problems, 20 compilers, and AI tutors right now in free trial mode or upgrade to Premium.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/playground">
              <Button size="lg" className="bg-amber-500 text-black hover:bg-amber-400 font-bold gap-2 text-xs rounded-xl shadow-lg">
                Launch Coding Studio <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="https://karthikrajeshshet.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 font-bold text-xs rounded-xl">
                Explore Premium Plan
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
