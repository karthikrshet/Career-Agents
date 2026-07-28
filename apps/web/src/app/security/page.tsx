// apps/web/src/app/security/page.tsx
"use client";

import { ArrowLeft, Shield, Lock, Eye, CheckCircle2, Server, Key, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SecurityPage() {
  const securityDefenses = [
    {
      icon: Shield,
      title: "Outbound SSRF Protection",
      desc: "Our secure routing gateway validates and filters target endpoints using strict DNS rebinding allowlists to prevent request forgery."
    },
    {
      icon: Server,
      title: "XSS & Input Sanitization",
      desc: "All client payloads undergo raw sanitization before indexing to block HTML and scripts inject operations."
    },
    {
      icon: Key,
      title: "Local Secret Protection",
      desc: "Sensitive keys and tokens remain strictly on the server env. Key exchanges never expose raw API tokens to the client browser."
    },
    {
      icon: EyeOff,
      title: "Log Forging Prevention",
      desc: "Our custom Winston safe logger cleans log lines by stripping out carriage returns, line feeds, and ANSI control characters."
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

        <div className="max-w-2xl mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Security & Compliance
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Career Agents implements enterprise-level security boundaries to protect credentials, data privacy, and networks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {securityDefenses.map(defense => (
            <div key={defense.title} className="border border-slate-900 bg-slate-950/40 p-8 rounded-2xl flex gap-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <defense.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-2">{defense.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{defense.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-slate-900 bg-slate-950/60 p-8 rounded-2xl">
          <h3 className="text-sm font-bold text-white mb-6">Coordinated Vulnerability Disclosure</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            We operate a dedicated security program. If you discover a vulnerability, please report it privately by mailing us at 
            <span className="text-indigo-400 font-semibold mx-1">coordinated-disclosure@career-agents.com</span>. 
            Do not post details on public issue trackers.
          </p>
          <Link href="/contact">
            <Button variant="outline" className="border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 text-xs font-semibold px-4 py-2.5 rounded-lg">
              Submit Security Report
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
