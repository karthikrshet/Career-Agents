"use client";

import Link from "next/link";
import { ShieldAlert, FileText, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DpaPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 border-b border-slate-900 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[10px] uppercase font-bold tracking-wider text-indigo-400">
            <ShieldAlert className="w-3.5 h-3.5" /> GDPR & Enterprise Privacy
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Data Processing <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">Agreement (DPA)</span>
          </h1>
          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Review the terms governing personal data processing for Career Agents enterprise customers.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full space-y-8 text-slate-300">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">1. Scope and Applicability</h3>
          <p className="text-xs leading-relaxed">
            This DPA applies to processing of personal data (e.g. resumes, profile information, audit history logs) submitted by enterprise users or team plan admins to the Career Agents platform services.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">2. Roles and Responsibilities</h3>
          <p className="text-xs leading-relaxed">
            Under data protection regulations (GDPR, CCPA), the enterprise client acts as the Data Controller, and Career Agents acts as the Data Processor. We process data strictly in compliance with controller instructions.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">3. Technical and Organizational Security</h3>
          <p className="text-xs leading-relaxed">
            We implement strict security measures to protect customer data:
          </p>
          <ul className="text-xs space-y-2 list-disc list-inside">
            <li><strong>Data Encryption:</strong> Encrypted in transit using TLS 1.3 and at rest in our databases using AES-256 keys.</li>
            <li><strong>Access Controls:</strong> Role-based access constraints limiting personnel check clearances to server databases.</li>
            <li><strong>Sub-processing Rules:</strong> We utilize secure cloud providers (like Vercel and Supabase) adhering strictly to standard contractual clauses.</li>
          </ul>
        </div>
      </main>

      {/* CTA Section */}
      <section className="border-t border-slate-900 bg-slate-950 py-16 text-center space-y-4">
        <div className="max-w-xl mx-auto px-6 space-y-2">
          <ShieldCheck className="w-8 h-8 text-indigo-400 mx-auto" />
          <h3 className="text-lg font-bold text-white tracking-tight">Enterprise Compliance Center</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Have questions about standard contractual clauses (SCCs) or data protection requirements? Contact our privacy team.
          </p>
          <div className="pt-2">
            <Link href="/contact">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/10">
                Contact Privacy Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
