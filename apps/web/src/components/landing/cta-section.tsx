"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function CTASection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="relative rounded-3xl bg-gradient-to-r from-cyan-950/80 via-[#090d18] to-indigo-950/80 border border-cyan-500/30 p-8 sm:p-14 text-center overflow-hidden shadow-[0_0_80px_rgba(56,189,248,0.2)] backdrop-blur-2xl">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" /> Start Free • 100% Local-First Security
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ready to Land Your Dream{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Software Engineering Role?
            </span>
          </h2>

          <p className="text-base text-slate-300 leading-relaxed">
            Join thousands of developers, researchers, and candidates using 146 specialized AI agents to audit resumes, conquer technical mock interviews, and land top offers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/dashboard" data-cursor="magnetic">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm px-8 py-6 rounded-xl shadow-[0_0_30px_rgba(56,189,248,0.4)]"
              >
                <span>Launch Platform Free</span>
                <ArrowRight className="w-4 h-4 ml-2" />
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
                className="bg-white/5 hover:bg-white/10 text-white border-white/10 text-sm font-medium px-6 py-6 rounded-xl"
              >
                <GithubIcon className="w-4 h-4 mr-2" />
                <span>GitHub Repository (2.4k ★)</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
