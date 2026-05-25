"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Heart, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export default function GuidesPage() {
  const guides = [
    { title: "FAANG System Design Blueprint", description: "Learn how to approach distributed caching, database scaling, and rate limiter design in 45-minute interviews.", time: "15 min read" },
    { title: "Mastering the STAR Method", description: "How to structure behavioral answers (Situation, Task, Action, Result) with impact metrics and context.", time: "8 min read" },
    { title: "LinkedIn Algorithmic Optimization", description: "Uncover how recruiters search for talents on LinkedIn and adjust your profile keywords to maximize outbound inquiries.", time: "10 min read" },
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
            <Sparkles className="w-3.5 h-3.5" /> Technical Interview & Career Playbooks
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Developer <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">Career Guides</span>
          </h1>
          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Accelerate your career with system design frameworks, coding playground playbooks, and negotiation tactics.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map(g => (
            <Card key={g.title} className="border-slate-900 bg-slate-900/30 flex flex-col justify-between">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-semibold font-mono">
                  <Clock className="w-3 h-3" /> {g.time}
                </div>
                <h4 className="font-bold text-sm text-white">{g.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{g.description}</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Link href="/docs" className="w-full">
                  <Button size="sm" variant="outline" className="w-full border-slate-800 text-slate-300 hover:bg-slate-900 text-xs font-semibold h-8">
                    Read Playbook <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Featured Advice */}
        <div className="p-8 rounded-2xl border border-slate-900 bg-slate-900/20 space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Award className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm">Actionable Career Checklist</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Consistently update your portfolio repositories weekly, parse your resume structure after any job role changes, and benchmark your interview preparedness against realistic mock constraints to build unstoppable professional momentum.
          </p>
        </div>
      </main>

      {/* CTA Section */}
      <section className="border-t border-slate-900 bg-slate-950 py-16 text-center space-y-4">
        <div className="max-w-xl mx-auto px-6 space-y-2">
          <BookOpen className="w-8 h-8 text-indigo-400 mx-auto" />
          <h3 className="text-lg font-bold text-white tracking-tight">Access the Complete Career OS Documentation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Find developer setup guides, model parameters configuration tips, and registry contribution steps.
          </p>
          <div className="pt-2">
            <Link href="/docs">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/10">
                Go to Help Center
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
