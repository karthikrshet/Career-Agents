"use client";

import Link from "next/link";
import { ArrowLeft, ShieldAlert, ShieldCheck } from "lucide-react";

export default function DpaPage() {
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
            <ShieldAlert className="w-3.5 h-3.5" /> GDPR &amp; CCPA Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Data Processing Agreement (DPA)</h1>
          <p className="text-xs font-mono text-slate-500">Effective Date: August 15, 2026</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal p-6 sm:p-8 rounded-2xl bg-[#070b14] border border-white/10">
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-white">1. Scope and Applicability</h2>
            <p>
              This DPA governs the processing of candidate data (resumes, interview audio logs, GitHub portfolio metrics) submitted by enterprise customers and recruitment cohort teams to Career Agents hosted services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-white">2. Roles and Controller Safeguards</h2>
            <p>
              Under GDPR and CCPA regulations, the enterprise customer acts as the Data Controller, and Career Agents acts strictly as the Data Processor, executing instructions in accordance with candidate consent and contractual boundaries.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-white">3. Technical Security Controls</h2>
            <p>
              All candidate data is protected using TLS 1.3 in transit and AES-256 encryption at rest, accompanied by strict local-first data isolation principles and role-based access control (RBAC).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
