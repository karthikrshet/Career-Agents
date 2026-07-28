// apps/web/src/app/pricing/page.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [currency, setCurrency] = useState<"usd" | "inr">("usd");

  const plans = [
    {
      id: "free",
      name: "Free / Guest",
      price: { monthly: { usd: 0, inr: 0 }, yearly: { usd: 0, inr: 0 } },
      desc: "Instant career audits without any signup or credentials required.",
      features: [
        "3 Resume STAR evaluations",
        "1 GitHub repository analysis",
        "1 Interview Lab session (Text/Chat)",
        "Standard latency fallback routing"
      ]
    },
    {
      id: "pro",
      name: "Professional",
      price: { monthly: { usd: 29, inr: 2400 }, yearly: { usd: 19, inr: 1600 } },
      desc: "For active job seekers target-matching interviews at tech companies.",
      features: [
        "Unlimited resume STAR evaluations",
        "Unlimited GitHub repository audits",
        "Unlimited Mock Interviews with voice critique",
        "Advanced models (Claude 3.5 Sonnet, GPT-4o)",
        "MCP Server tools integration",
        "Priority API queue access"
      ],
      popular: true
    },
    {
      id: "team",
      name: "Team & Cohort",
      price: { monthly: { usd: 79, inr: 6500 }, yearly: { usd: 59, inr: 4900 } },
      desc: "Collaborative workspaces for bootcamps, university cohorts, and recruitment firms.",
      features: [
        "Everything in Professional",
        "Shared candidate workspaces",
        "Collaborative candidate scorecards",
        "Private RAG vector database sync",
        "Dedicated onboarding support"
      ]
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
        "Dedicated account engineers",
        "Zero-retention data privacy guarantees"
      ]
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

        <div className="text-center max-w-xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Simple Pricing Plans
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed mb-8">
            Upgrade your token counts and specialist models as your job search scales.
          </p>

          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 bg-slate-950 border border-slate-900 p-2 rounded-xl">
            {/* Billing Cycle Toggle */}
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-semibold transition",
                  billingCycle === "monthly" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-semibold transition",
                  billingCycle === "yearly" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                )}
              >
                Yearly (Save 30%)
              </button>
            </div>

            {/* Currency Selector */}
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
              <button
                onClick={() => setCurrency("usd")}
                className={cn(
                  "px-3.5 py-1.5 rounded text-xs font-semibold transition",
                  currency === "usd" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                )}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency("inr")}
                className={cn(
                  "px-3.5 py-1.5 rounded text-xs font-semibold transition",
                  currency === "inr" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                )}
              >
                INR
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {plans.map(plan => {
            const hasPrice = typeof plan.price !== "string";
            const price = hasPrice
              ? (plan.price as any)[billingCycle][currency]
              : "Custom";

            return (
              <div
                key={plan.id}
                className={cn(
                  "border rounded-2xl p-6 flex flex-col justify-between relative",
                  plan.popular
                    ? "border-indigo-500 bg-indigo-950/10 shadow-lg shadow-indigo-600/5"
                    : "border-slate-900 bg-slate-950/40"
                )}
              >
                {plan.popular && (
                  <span className="bg-indigo-600 text-white text-[8px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full absolute top-0 right-6 -translate-y-1/2">
                    Most Popular
                  </span>
                )}

                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-2">{plan.name}</h4>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-3xl font-extrabold text-white">
                      {hasPrice ? `${currency === "usd" ? "$" : "₹"}${price}` : "Custom"}
                    </span>
                    {hasPrice && <span className="text-[10px] text-slate-500">/mo</span>}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed mb-6">{plan.desc}</p>

                  <ul className="space-y-3 text-[10px] text-slate-400">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Button
                    className={cn(
                      "w-full text-xs py-2 rounded-lg font-semibold transition",
                      plan.popular
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-300"
                    )}
                  >
                    Select Plan
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border border-slate-900 bg-slate-950/60 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 shrink-0">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-1">Developer Sponsorship Program</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">Are you a core open-source contributor or student? Email us for free Professional tier upgrades.</p>
            </div>
          </div>
          <Button variant="outline" className="border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 text-xs font-semibold px-4 py-2 rounded-lg">
            Apply Sponsor
          </Button>
        </div>
      </div>
    </div>
  );
}
