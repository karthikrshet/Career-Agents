"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Terminal, Cpu, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import GradientWaves from "@/components/react-bits/GradientWaves";
import CurvedInput from "@/components/react-bits/CurvedInput";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function CTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (val: string) => {
    if (val && val.includes("@")) {
      setSubmitted(true);
    }
  };

  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 font-sans">
      <div className="relative rounded-3xl bg-[#070b14] border border-white/10 p-8 sm:p-14 text-center overflow-hidden shadow-2xl">
        {/* Background Fluid GradientWaves WebGL Shader */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <GradientWaves
            horizonColor="#030712"
            waveColor="#0ea5e9"
            crestColor="#38bdf8"
            speed={0.35}
            amplitude={2.0}
            waveScale={0.5}
            brightness={1.1}
            opacity={0.8}
            mouseInteraction={true}
          />
        </div>

        {/* Ambient Radial Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium">
            Local-First AI Architecture
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ready to Accelerate Your <span className="text-sky-400">Engineering Career?</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Join thousands of software engineers using 167 specialized AI agents to audit resumes, practice mock interview loops, and negotiate top-tier compensation.
          </p>

          {/* Interactive CurvedInput Form */}
          <div className="max-w-md mx-auto pt-2 pb-2">
            {submitted ? (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You&apos;re in! We&apos;ve sent your workspace setup link.</span>
              </div>
            ) : (
              <CurvedInput
                value={email}
                onChange={setEmail}
                onSubmit={handleSubmit}
                placeholder="Enter your email to launch"
                buttonText="Get Started"
                width="100%"
                height={54}
                bend={16}
                fontSize={13}
                theme="dark"
                buttonColor="#0ea5e9"
                buttonTextColor="#000000"
              />
            )}
          </div>

          {/* Secondary Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/dashboard">
              <Button
                size="sm"
                className="bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs px-5 py-2.5 rounded-lg shadow-md transition-all"
              >
                <span>Launch Web Platform</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>

            <a
              href="https://github.com/karthikrshet/Career-Agents"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                variant="outline"
                className="bg-white/[0.04] hover:bg-white/[0.08] text-white border-white/10 text-xs font-medium px-5 py-2.5 rounded-lg transition-all"
              >
                <GithubIcon className="w-3.5 h-3.5 mr-1.5" />
                <span>Star on GitHub</span>
              </Button>
            </a>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Local SQLite
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-sky-400" /> 15+ Gateways
            </span>
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-sky-400" /> MCP Ready
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
