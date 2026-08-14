"use client";

import Link from "next/link";
import { Briefcase, ArrowRight, Star, Heart, MapPin, Zap, ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CareersPage() {
  const jobs = [
    { title: "Staff Distributed Systems Engineer", dept: "Core Runtime", loc: "San Francisco / Remote", type: "Full-time", track: "Go / Raft / Concurrency" },
    { title: "Senior AI Compiler & Model Engineer", dept: "Agent Architecture", loc: "New York / Remote", type: "Full-time", track: "MCP / PyTorch / LLM Routing" },
    { title: "Staff Frontend Engineer (Next.js & WebGL)", dept: "Product Experience", loc: "Remote", type: "Full-time", track: "TypeScript / Canvas / Three.js" },
    { title: "Developer Relations & Ecosystem Lead", dept: "Open Source", loc: "Remote", type: "Full-time", track: "Community & Integrations" },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans py-20 px-4 sm:px-6 lg:px-8 relative overflow-y-auto z-10">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-14">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to landing
        </Link>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium">
            <Star className="w-3.5 h-3.5" /> Join Our Team
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Build the Operating System for <span className="text-sky-400">Engineering Careers</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Help us engineer an open-source multi-agent platform empowering software engineers with 167 specialized agents, local ATS auditing, and Model Context Protocol (MCP) tooling.
          </p>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-[#070b14] border border-white/10 space-y-3">
            <div className="p-2 w-fit rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Open &amp; Transparent</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              We believe open source builds better, safer tools. All our agent registries, schemas, and pipelines are fully public.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#070b14] border border-white/10 space-y-3">
            <div className="p-2 w-fit rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400">
              <Heart className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Candidate-First</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              We empower software engineers with uncompromised local privacy, eliminating proprietary black-box recruiter barriers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#070b14] border border-white/10 space-y-3">
            <div className="p-2 w-fit rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Rigorous Engineering</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              From WebGL shaders to JSON-RPC tools and sub-100ms vector search, we prioritize performance and test integrity.
            </p>
          </div>
        </div>

        {/* Open Roles */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Open Roles</h2>
              <p className="text-xs text-slate-400 mt-0.5">Explore full-time engineering and developer relations positions</p>
            </div>
            <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-md border border-sky-400/20">
              4 Roles Open
            </span>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.title}
                className="p-5 rounded-2xl bg-[#070b14] border border-white/10 hover:border-sky-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-white">{job.title}</h3>
                    <span className="text-[10px] font-mono bg-white/[0.04] text-slate-300 px-2 py-0.5 rounded border border-white/10">
                      {job.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                    <span>{job.dept}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-400" /> {job.loc}
                    </span>
                    <span>•</span>
                    <span className="text-sky-300">{job.track}</span>
                  </div>
                </div>

                <Link href="/contact">
                  <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs px-4 py-2 rounded-lg shrink-0">
                    <span>Apply Now</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
