"use client";

import Link from "next/link";
import { ArrowRight, Layout, Download, FileText, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export default function TemplatesPage() {
  const templates = [
    { name: "Jake's Clean LaTeX Template", description: "The gold standard for software engineering. Ultra-scannable single column layout.", score: "98% ATS Match" },
    { name: "Deedy Harvard CV Layout", description: "Double-column design prioritizing technical skills and project highlights.", score: "92% ATS Match" },
    { name: "Executive Professional PDF", description: "Elegant layout designed for Product Managers and Engineering Leaders.", score: "95% ATS Match" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Navbar Hero */}
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-white text-base tracking-tight hover:opacity-90 transition-opacity">
            <span className="bg-gradient-to-r from-indigo-500 to-sky-400 bg-clip-text text-transparent">Career Agents</span>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/10">
              Launch Console
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 border-b border-slate-900 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[10px] uppercase font-bold tracking-wider text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" /> High-Performance Resume Templates
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            ATS-Optimized <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">Resume Templates</span>
          </h1>
          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Download verified templates designed to bypass ATS parsers and grab recruiters' attention.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full space-y-16">
        {/* Template Catalog */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map(t => (
            <Card key={t.name} className="border-slate-900 bg-slate-900/30 flex flex-col justify-between overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="aspect-[3/4] bg-slate-950/60 rounded-lg border border-slate-900 flex items-center justify-center text-slate-600 relative overflow-hidden group">
                  <FileText className="w-12 h-12 text-slate-700 group-hover:scale-110 transition-transform" />
                  <div className="absolute top-3 right-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-bold">
                    {t.score}
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-white">{t.name}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{t.description}</p>
                </div>
              </CardContent>
              <div className="p-6 pt-0">
                <a href="https://github.com/karthikrshet/Career-Agents" target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold h-8 gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Download Template
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>

        {/* ATS Guidelines */}
        <div className="p-8 rounded-2xl border border-slate-900 bg-slate-900/20 space-y-4">
          <div className="flex items-center gap-2 text-white">
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm">ATS Parser Best Practices</h3>
          </div>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
            <li>Never use text inside tables, text boxes, or headers/footers (many parsers ignore these entirely).</li>
            <li>Maintain a standard hierarchy (Experience, Education, Projects, Skills) with clear headings.</li>
            <li>Prefer standard bullet points with active verbs using the STAR method.</li>
            <li>Always output in PDF or DOCX formats with selectable text. Never upload scanned images of text.</li>
          </ul>
        </div>
      </main>

      {/* CTA Section */}
      <section className="border-t border-slate-900 bg-slate-950 py-16 text-center space-y-4">
        <div className="max-w-xl mx-auto px-6 space-y-2">
          <Layout className="w-8 h-8 text-indigo-400 mx-auto" />
          <h3 className="text-lg font-bold text-white tracking-tight">Evaluate your resume layout in seconds</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ready to test your parsed score? Upload your resume directly to our ATS scanner and get custom model recommendations.
          </p>
          <div className="pt-2">
            <Link href="/resume">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/10">
                Launch Resume Studio <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
