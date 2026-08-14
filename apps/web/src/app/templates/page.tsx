"use client";

import Link from "next/link";
import { ArrowRight, Layout, Download, FileText, CheckCircle2, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TemplatesPage() {
  const templates = [
    {
      name: "Jake's Clean LaTeX & ATS Standard",
      description: "The gold standard for software engineering. Ultra-scannable single-column layout with 0 parsing errors.",
      score: "99.4% ATS Match",
      format: "LaTeX / PDF",
    },
    {
      name: "Staff Engineer Markdown Portfolio",
      description: "Optimized for Senior, Staff, and Tech Lead roles emphasizing system design architecture and business impact.",
      score: "98.2% ATS Match",
      format: "Markdown / HTML",
    },
    {
      name: "Modern Minimalist DOCX",
      description: "Compatible with older enterprise Workday and Taleo ATS gateways requiring traditional structured tables.",
      score: "96.8% ATS Match",
      format: "DOCX / Word",
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
            <Sparkles className="w-3.5 h-3.5" /> ATS-Calibrated Schemas
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            ATS-Optimized <span className="text-sky-400">Resume Templates</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
            Pre-compiled templates designed to pass Greenhouse, Lever, Ashby, and Workday parsers with 0 layout parsing faults.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-2xl bg-[#070b14] border border-white/10 hover:border-sky-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="aspect-[4/3] bg-black/40 rounded-xl border border-white/10 flex flex-col items-center justify-center relative p-4">
                  <FileText className="w-10 h-10 text-sky-400" />
                  <span className="text-[11px] font-mono text-slate-400 mt-2">{t.format}</span>
                  <div className="absolute top-3 right-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    {t.score}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{t.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal mt-1">
                    {t.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Link href="/resume">
                  <Button size="sm" className="w-full bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs py-2 rounded-lg gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    <span>Use in Resume Studio</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
