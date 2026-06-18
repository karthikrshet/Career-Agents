"use client";

import React, { useState } from "react";
import { Star, Quote, CheckCircle2, Building2 } from "lucide-react";

export function TestimonialsCarousel() {
  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Staff Software Engineer",
      company: "Stripe",
      avatar: "👨‍💻",
      quote: "Career Agents' ATS Auditor identified keyword gaps I had missed for months. Within 3 weeks of rewriting my resume with the Agent Orchestrator, I landed interviews at Stripe, Meta, and OpenAI.",
      rating: 5,
    },
    {
      name: "Elena Rostova",
      role: "AI Systems Researcher",
      company: "OpenAI",
      avatar: "👩‍🔬",
      quote: "The GitHub Analyzer scanned my research repositories and compiled proof-of-work documentation that turned my interview loop into a deep architectural conversation.",
      rating: 5,
    },
    {
      name: "Marcus Chen",
      role: "Senior Frontend Lead",
      company: "Vercel",
      avatar: "👨‍💼",
      quote: "The Voice STAR Mock Interview Lab gave me realistic feedback on my system design clarity. It felt like practicing with a principal engineer.",
      rating: 5,
    },
    {
      name: "Sophia Patel",
      role: "Backend Engineer",
      company: "Google",
      avatar: "👩‍💻",
      quote: "The Chrome Extension auto-filling applications while calculating ATS match scores saved me 20+ hours every week. Absolutely game-changing.",
      rating: 5,
    },
  ];

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-4">
          <Star className="w-3.5 h-3.5 text-amber-400" /> User Testimonials &amp; Success Stories
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Loved by Engineers At{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            World-Class Tech Companies
          </span>
        </h2>
      </div>

      {/* Testimonial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="p-8 rounded-3xl bg-[#090d18] border border-white/10 hover:border-cyan-500/30 backdrop-blur-2xl transition-all duration-300 space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl p-2 rounded-2xl bg-white/5 border border-white/10">{t.avatar}</div>
                <div>
                  <div className="font-bold text-white text-base">{t.name}</div>
                  <div className="text-xs text-cyan-400 font-medium">{t.role} • {t.company}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed italic">
              "{t.quote}"
            </p>

            <div className="pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Offer Placement
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
