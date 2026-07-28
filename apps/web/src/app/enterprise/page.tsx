// apps/web/src/app/enterprise/page.tsx
"use client";

import { ArrowLeft, Shield, Lock, Users, Cpu, FileText, Database } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EnterprisePage() {
  const specs = [
    {
      icon: Shield,
      title: "Identity & Governance",
      desc: "Integrate Okta, Azure AD, or Ping Identity via SAML 2.0 and OIDC. Enforce Role-Based Access Control (RBAC) to govern developer workspace activities."
    },
    {
      icon: Lock,
      title: "Zero-Retention Privacy",
      desc: "Ensure complete query containment. Customer data remains within VPC bounds and is never cached or used for training underlying LLM base models."
    },
    {
      icon: Cpu,
      title: "Custom Model Fine-Tuning",
      desc: "Connect private Llama, Mistral, or proprietary model checkpoints. Leverage dedicated LLM endpoints optimized for internal engineering rubrics."
    },
    {
      icon: Database,
      title: "Dedicated Storage Clouds",
      desc: "Deploy standalone PostgreSQL and hybrid vector databases inside your company's AWS, GCP, or Azure subscription partitions."
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
            Enterprise Careers OS
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Scale Career Agents across cohorts, bootcamps, and global developer workforces under high-availability SLAs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {specs.map(spec => (
            <div key={spec.title} className="border border-slate-900 bg-slate-950/40 p-8 rounded-2xl flex gap-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <spec.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-2">{spec.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{spec.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-slate-900 bg-slate-950/60 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xs font-bold text-white mb-1">Request Private Cloud Deployment Setup</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">Our enterprise solution architects are ready to assist you with Terraform cloud configurations.</p>
          </div>
          <Link href="/contact">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg">
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
