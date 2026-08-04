"use client";

import React from "react";
import { Building2, Code2, ShieldCheck } from "lucide-react";

export function TrustedCompanies() {
  const targetCompanies = [
    { name: "Google", domain: "Staff & Principal Software Roles" },
    { name: "Meta", domain: "E6+ Distributed Systems Lead" },
    { name: "Stripe", domain: "Core Infra & Payment Engineering" },
    { name: "OpenAI", domain: "AI Systems & Model Infrastructure" },
    { name: "Vercel", domain: "Frontend Architecture & Edge" },
    { name: "Perplexity", domain: "Search & Retrieval Systems" },
    { name: "Apple", domain: "Core OS Platform Engineering" },
    { name: "Microsoft", domain: "Cloud & Cybersecurity Lead" },
    { name: "Amazon", domain: "AWS Scalable Systems" },
  ];

  return (
    <section className="relative py-14 border-y border-white/10 bg-[#050814]/70 backdrop-blur-md overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
        <p className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-widest">
          Optimized for Applications &amp; Technical Interviews At Leading Companies
        </p>
      </div>

      {/* Edge Gradient Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050814] to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050814] to-transparent z-20 pointer-events-none" />

      {/* Marquee Track */}
      <div className="flex overflow-hidden group">
        <div className="flex gap-6 animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
          {[...targetCompanies, ...targetCompanies].map((company, idx) => (
            <div
              key={`${company.name}-${idx}`}
              className="card-glass flex items-center gap-3 px-5 py-3 rounded-xl hover:border-cyan-500/40 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="text-left">
                <div className="text-sm font-bold text-slate-100 tracking-wide">{company.name}</div>
                <div className="text-[10px] text-slate-400 font-medium">{company.domain}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
