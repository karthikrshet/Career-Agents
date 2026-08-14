"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, CheckCircle2, Calendar, Sparkles, ChevronRight, Target, Flag } from "lucide-react";

export function CareerRoadmapTimeline() {
  const [activeDay, setActiveDay] = useState(30);

  const roadmaps = [
    {
      day: 30,
      phase: "Phase 1",
      title: "Foundation & ATS Calibration",
      desc: "Audit your master resume, quantify bullet impacts, and configure local agent environment.",
      goals: [
        "Audit master resume with ATS Calibrator Agent",
        "Quantify 100% of bullet points with Google XYZ impact formulas",
        "Clean public GitHub profile & optimize top 3 repository READMEs",
        "Calibrate LinkedIn profile headline and experience entries",
      ],
      deliverable: "ATS Score 95%+ & verified proof-of-work portfolio",
    },
    {
      day: 60,
      phase: "Phase 2",
      title: "System Design & Mock Labs",
      desc: "Master large-scale distributed architectures and STAR behavioral responses.",
      goals: [
        "Complete 20 STAR-structured behavioral interview drills with AI voice coach",
        "Conduct 10 System Design mock sessions (Rate Limiters, Microservices, Spanner)",
        "Build 1 production-ready distributed system portfolio project",
        "Apply to top 15 target company roles using Chrome Extension",
      ],
      deliverable: "High-signal mock interview scores across L5/L6 rubrics",
    },
    {
      day: 90,
      phase: "Phase 3",
      title: "Active Applications & Interview Loops",
      desc: "Execute on-site interview loops with continuous agent feedback.",
      goals: [
        "Maintain active interview loops with 5+ top tech companies",
        "Execute technical coding rounds and architecture presentations",
        "Recalibrate strategy weekly using Copilot telemetry",
        "Receive first formal job offer package",
      ],
      deliverable: "Multiple concurrent offer rounds in pipeline",
    },
    {
      day: 180,
      phase: "Phase 4",
      title: "Offer Negotiation & Onboarding",
      desc: "Maximize total compensation and onboard seamlessly.",
      goals: [
        "Run Offer Negotiator Agent to maximize base salary and equity grant",
        "Evaluate competing term sheets with market percentile benchmarks",
        "Accept top offer and onboard successfully into Senior/Staff engineering role",
      ],
      deliverable: "Target compensation signed & start date locked",
    },
    {
      day: 365,
      phase: "Phase 5",
      title: "Staff Promotion & Leadership",
      desc: "Accelerate track to Principal / Staff Engineer with continuous impact tracking.",
      goals: [
        "Track quarterly impact milestones for promotion readiness",
        "Expand open-source presence and domain authority",
        "Mentor team members and drive architectural standards",
      ],
      deliverable: "Fast-track L6+ promotion roadmap completed",
    },
  ];

  const currentRoadmap = roadmaps.find((r) => r.day === activeDay) || roadmaps[0];

  return (
    <section id="roadmap" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 font-sans">
      {/* Background Precision Grid & Glow */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-sky-500/08 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium mb-3">
          <Compass className="w-3.5 h-3.5" /> Step-by-Step Execution Plan
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Your 365-Day <span className="text-sky-400">Career Trajectory</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
          A structured engineering roadmap engineered to take you from resume audit to Staff Engineer promotion.
        </p>
      </div>

      {/* Timeline Step Buttons (Horizontal on Desktop, Scrollable on Mobile) */}
      <div className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto no-scrollbar pb-3 mb-8 relative z-10 justify-start sm:justify-center">
        {roadmaps.map((r) => {
          const isActive = activeDay === r.day;
          return (
            <button
              key={r.day}
              onClick={() => setActiveDay(r.day)}
              className={`px-4 sm:px-6 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 ${
                isActive
                  ? "bg-sky-500 text-black border-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.3)] font-bold"
                  : "bg-[#070b14] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{r.day} Days</span>
            </button>
          );
        })}
      </div>

      {/* Active Roadmap Detailed Card */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoadmap.day}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-[#070b14] border border-white/10 shadow-2xl space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
              <div>
                <span className="text-xs font-mono text-sky-400 uppercase tracking-wider font-semibold">
                  {currentRoadmap.phase} • Day 1 to Day {currentRoadmap.day}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                  {currentRoadmap.title}
                </h3>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300 w-max flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-sky-400" /> Milestone Target
              </div>
            </div>

            <p className="text-sm text-slate-300 font-normal leading-relaxed">
              {currentRoadmap.desc}
            </p>

            {/* Goals Checklist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentRoadmap.goals.map((goal, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3 text-xs text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-normal">{goal}</span>
                </div>
              ))}
            </div>

            {/* Key Deliverable Bar */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <span className="flex items-center gap-2 text-slate-400">
                <Flag className="w-3.5 h-3.5 text-sky-400" /> Verified Outcome:
              </span>
              <span className="text-emerald-400 font-medium">{currentRoadmap.deliverable}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
