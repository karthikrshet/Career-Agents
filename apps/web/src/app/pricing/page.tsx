"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [currency, setCurrency] = useState<"usd" | "inr">("usd");

  const plans = [
    {
      id: "free",
      name: "Community & Local",
      price: { monthly: { usd: 0, inr: 0 }, yearly: { usd: 0, inr: 0 } },
      desc: "Instant career audits without any signup or credentials required.",
      features: [
        "167 open-source agents access",
        "Local SQLite browser database",
        "ATS resume structure parser",
        "Standard latency fallback routing",
        "Community GitHub support",
      ],
    },
    {
      id: "pro",
      name: "Professional Candidate",
      price: { monthly: { usd: 29, inr: 2400 }, yearly: { usd: 19, inr: 1600 } },
      desc: "For active software engineers target-matching senior & staff interview loops.",
      features: [
        "Unlimited resume STAR evaluations",
        "Unlimited GitHub repository audits",
        "Voice STAR mock coach with audio rubric",
        "31 Model Context Protocol (MCP) tools",
        "Claude 3.5 Sonnet & GPT-4o gateways",
        "Priority API execution queue",
      ],
      popular: true,
    },
    {
      id: "team",
      name: "Team & Cohort",
      price: { monthly: { usd: 79, inr: 6500 }, yearly: { usd: 59, inr: 4900 } },
      desc: "Collaborative workspaces for bootcamps, university cohorts, and recruitment firms.",
      features: [
        "Everything in Professional",
        "Shared candidate pipeline workspaces",
        "Collaborative ATS scorecards",
        "Private RAG vector database sync",
        "Dedicated onboarding support",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise SLA",
      price: "Custom",
      desc: "Dedicated model fine-tuning and strict SLA deployments for large teams.",
      features: [
        "Everything in Team plan",
        "Private VPC deployment (AWS, GCP)",
        "SSO, SAML, and custom RBAC policies",
        "99.9% API availability SLA",
        "Zero-retention privacy guarantees",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans py-20 px-4 sm:px-6 lg:px-8 relative overflow-y-auto z-10">
      {/* Ambient Lighting Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to landing
        </Link>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium">
            Transparent Pricing
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Transparent Plans for <span className="text-sky-400">Engineering Careers</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Run open-source agents locally for free or scale with high-throughput cloud LLM gateways and voice mock infrastructure.
          </p>

          {/* Toggle Controls */}
          <div className="flex items-center justify-center gap-4 pt-4 text-xs font-mono">
            <div className="p-1 rounded-lg bg-[#070b14] border border-white/10 flex items-center gap-1">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  billingCycle === "monthly" ? "bg-sky-500 text-black font-semibold" : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  billingCycle === "yearly" ? "bg-sky-500 text-black font-semibold" : "text-slate-400 hover:text-white"
                }`}
              >
                Yearly (Save 35%)
              </button>
            </div>

            <div className="p-1 rounded-lg bg-[#070b14] border border-white/10 flex items-center gap-1">
              <button
                onClick={() => setCurrency("usd")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  currency === "usd" ? "bg-white/10 text-white font-semibold" : "text-slate-400"
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency("inr")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  currency === "inr" ? "bg-white/10 text-white font-semibold" : "text-slate-400"
                }`}
              >
                INR (₹)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {plans.map((plan) => {
            const isPopular = plan.popular;
            const price =
              typeof plan.price === "string"
                ? plan.price
                : currency === "usd"
                ? `$${plan.price[billingCycle].usd}`
                : `₹${plan.price[billingCycle].inr}`;

            return (
              <div
                key={plan.id}
                className={`p-6 rounded-2xl bg-[#070b14] flex flex-col justify-between transition-all border ${
                  isPopular
                    ? "border-sky-500/60 shadow-[0_0_30px_rgba(14,165,233,0.15)]"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">{plan.name}</h3>
                    {isPopular && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-400/30">
                        Popular
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-3xl font-black text-white font-mono">{price}</div>
                    {typeof plan.price !== "string" && (
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        per user / {billingCycle === "monthly" ? "month" : "year"}
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 font-normal leading-relaxed">
                    {plan.desc}
                  </p>

                  {/* Feature Checklist */}
                  <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <Link href="/dashboard">
                    <Button
                      size="sm"
                      className={`w-full text-xs font-semibold py-2 rounded-lg transition-all ${
                        isPopular
                          ? "bg-sky-500 hover:bg-sky-400 text-black shadow-sm"
                          : "bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10"
                      }`}
                    >
                      <span>{plan.id === "free" ? "Start Free" : "Get Started"}</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Assurance */}
        <div className="p-6 rounded-2xl bg-[#070b14] border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2 text-white font-medium">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Local-first architecture guarantee: Your resumes are never sold or trained upon.</span>
          </div>
          <div>Cancel or switch plans anytime with single-click billing management.</div>
        </div>
      </div>
    </div>
  );
}
