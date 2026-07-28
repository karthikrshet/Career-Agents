// apps/web/src/app/opensource/page.tsx
"use client";

import { ArrowLeft, Star, GitFork, Heart, Shield, Code, Terminal, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OpenSourcePage() {
  const steps = [
    {
      icon: Terminal,
      title: "1. Clone and Install Dependencies",
      desc: "git clone https://github.com/karthikrshet/Career-Agents.git\nnpm install",
      code: true
    },
    {
      icon: Code,
      title: "2. Build & Generate Schema Mappings",
      desc: "python scripts/generate-data.py\npython scripts/validate.py",
      code: true
    },
    {
      icon: Shield,
      title: "3. Run local dev client server",
      desc: "npm run dev",
      code: true
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative py-20">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-white transition mb-12">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to landing
        </Link>

        <div className="max-w-3xl mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            100% Free & Open Source
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed mb-8">
            Career Agents is built on the philosophy of open transparency. Audit our security gating algorithms, 
            run the MCP server locally, or extend our 146 agent prompt files.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="https://github.com/karthikrshet/Career-Agents" target="_blank" rel="noreferrer">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                <Star className="w-4 h-4 fill-white" />
                Star on GitHub
              </Button>
            </a>
            <a href="https://github.com/karthikrshet/Career-Agents/fork" target="_blank" rel="noreferrer">
              <Button variant="outline" className="border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                <GitFork className="w-4 h-4" />
                Fork Repository
              </Button>
            </a>
          </div>
        </div>

        <div className="border border-slate-900 bg-slate-950/40 p-8 rounded-2xl mb-12">
          <h3 className="text-sm font-bold text-white mb-6">Local Developer Guide</h3>
          
          <div className="space-y-6">
            {steps.map(step => (
              <div key={step.title} className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <step.icon className="w-4 h-4 text-indigo-400" />
                  {step.title}
                </h4>
                {step.code ? (
                  <pre className="bg-slate-950 border border-slate-900 p-4 rounded-xl text-[10px] text-indigo-300 font-mono overflow-x-auto leading-relaxed select-all">
                    {step.desc}
                  </pre>
                ) : (
                  <p className="text-xs text-slate-500">{step.desc}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border border-slate-900 bg-slate-950/60 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 shrink-0">
              <Heart className="w-5 h-5 text-indigo-400 fill-indigo-400/25" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-1">Sponsor Career Agents</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">Help fund GPU compute boundaries, sandbox servers, and package deployments.</p>
            </div>
          </div>
          <Button variant="outline" className="border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5">
            Sponsor Project
          </Button>
        </div>
      </div>
    </div>
  );
}
