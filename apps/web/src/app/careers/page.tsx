"use client";

import Link from "next/link";
import { Briefcase, ArrowRight, Star, Heart, MapPin, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export default function CareersPage() {
  const jobs = [
    { title: "Senior AI Research Engineer", dept: "Engineering", loc: "San Francisco / Remote", type: "Full-time" },
    { title: "Staff Frontend Developer (Next.js)", dept: "Engineering", loc: "New York / Remote", type: "Full-time" },
    { title: "AI Product Designer", dept: "Design", loc: "London / Hybrid", type: "Full-time" },
    { title: "Developer Relations Manager", dept: "Marketing", loc: "Remote", type: "Full-time" },
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
            <Star className="w-3.5 h-3.5" /> Join the Agentic Career Future
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Build the Operating System for <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">Modern Careers</span>
          </h1>
          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We are creating an open-source multi-agent platform designed to evaluate resumes, audit portfolios, run mock interviews, and optimize professional footprints.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full space-y-16">
        {/* Core Values */}
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-900 bg-slate-900/30">
              <CardContent className="p-6 text-left space-y-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm">Open & Collaborative</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We believe open source builds better, safer, and more transparent tools. All our registries and maps are public.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-900 bg-slate-900/30">
              <CardContent className="p-6 text-left space-y-3">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm">Empowering Engineers</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We help engineers master technical interviews, analyze ATS resume gates, and chart optimal paths forward.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-900 bg-slate-900/30">
              <CardContent className="p-6 text-left space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm">Agent-First Mentality</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We run highly focused specialist agents collaborating over common graphs and model contexts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Opportunities list */}
        <div className="space-y-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-white tracking-tight">Open Opportunities</h2>
            <p className="text-xs text-slate-400 mt-1">Explore current openings across our core platform and infrastructure engineering teams.</p>
          </div>
          <div className="space-y-3">
            {jobs.map(job => (
              <div 
                key={job.title}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl border border-slate-900 bg-slate-900/10 hover:border-slate-800 hover:bg-slate-900/30 transition-all gap-4"
              >
                <div>
                  <h4 className="font-bold text-sm text-white">{job.title}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                    <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">{job.dept}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> {job.loc}</span>
                  </div>
                </div>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs border-slate-800 text-slate-300 hover:bg-slate-900">
                    Apply Now <ArrowRight className="w-3 h-3 ml-1.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className="border-t border-slate-900 bg-slate-950 py-16 text-center space-y-6">
        <div className="max-w-2xl mx-auto px-6 space-y-3">
          <h3 className="text-xl font-bold text-white tracking-tight">Want to contribute to the Career OS core framework?</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Career Agents is built on open standards, model context protocols, and public index registries. Find us on GitHub and make your first pull request.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <a href="https://github.com/karthikrshet/Career-Agents" target="_blank" rel="noopener noreferrer">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md text-xs">
                Browse Repository
              </Button>
            </a>
            <Link href="/contact">
              <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-950 text-xs">
                Contact Recruiting
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
