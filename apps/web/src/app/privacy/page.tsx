"use client";

import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto space-y-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to landing
        </Link>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium">
            <Shield className="w-3.5 h-3.5" /> Data Protection
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
          <p className="text-xs font-mono text-slate-500">Effective Date: August 15, 2026</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal p-6 sm:p-8 rounded-2xl bg-[#070b14] border border-white/10">
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-white">1. Local-First Data Philosophy</h2>
            <p>
              Career Agents is architected with a local-first philosophy. Your uploaded resumes, cover letters, mock interview audio recordings, and GitHub analysis reports run in your browser or local SQLite database. We do not store, sell, or monetize candidate data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-white">2. LLM Gateway Processing</h2>
            <p>
              When you trigger AI analysis (e.g. ATS match scoring or STAR mock feedback), requests are dispatched directly to your configured provider (OpenAI, Anthropic, Google Gemini, Groq) using zero-data-retention enterprise API contracts.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-white">3. Cookies and Analytics</h2>
            <p>
              We only use essential functional session cookies required for user authentication and UI state persistence. We do not use cross-site tracking or advertising cookies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
