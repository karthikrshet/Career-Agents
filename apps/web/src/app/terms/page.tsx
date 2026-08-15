"use client";

import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
            <FileText className="w-3.5 h-3.5" /> Legal Terms
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Terms of Service</h1>
          <p className="text-xs font-mono text-slate-500">Effective Date: August 15, 2026</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal p-6 sm:p-8 rounded-2xl bg-[#070b14] border border-white/10">
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-white">1. MIT Open Source License</h2>
            <p>
              Career Agents is open-source software licensed under the MIT License. You are free to modify, distribute, fork, and use the codebase for personal, educational, and commercial purposes subject to standard license terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-white">2. Acceptable Use of Hosted Gateways</h2>
            <p>
              When utilizing our hosted demo gateways or shared testing servers, automated scraping, abusive concurrency floods, and unauthorized reverse-engineering are prohibited and subject to rate limits.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-white">3. Disclaimer of Warranties</h2>
            <p>
              The platform and AI agent outputs (e.g. ATS match scores, salary negotiation models, STAR coaching feedback) are provided for educational and career acceleration purposes without guaranteed interview or employment outcomes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
