"use client";

import { ArrowLeft, Shield, Lock, Eye, CheckCircle2, Server, Key, EyeOff, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SecurityPage() {
  const securityDefenses = [
    {
      icon: Shield,
      title: "Local SQLite Sandboxing",
      desc: "Candidate data, resumes, and interview transcripts run directly inside local browser storage without involuntary cloud uploads.",
    },
    {
      icon: Lock,
      title: "Zero-Retention LLM Gateways",
      desc: "All LLM queries dispatched to OpenAI, Anthropic, or Gemini use enterprise zero-data-retention headers preventing training ingestion.",
    },
    {
      icon: Key,
      title: "Local Secret Key Isolation",
      desc: "Your personal provider API keys stay stored securely in your browser session and are never logged or proxied to external third parties.",
    },
    {
      icon: Server,
      title: "SSRF & Injection Hardening",
      desc: "Our MCP tool router strictly validates input schemas and limits URL fetching to verified domain allowlists.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans py-20 px-4 sm:px-6 lg:px-8 relative overflow-y-auto z-10">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to landing
        </Link>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium">
            <Shield className="w-3.5 h-3.5" /> Enterprise Security
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Security &amp; <span className="text-sky-400">Data Privacy</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
            Career Agents implements strict local-first security boundaries to protect credentials, candidate privacy, and developer environments.
          </p>
        </div>

        {/* Defenses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityDefenses.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.title} className="p-6 rounded-2xl bg-[#070b14] border border-white/10 space-y-3">
                <div className="p-2.5 w-fit rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{d.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">{d.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
