"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, CheckCircle2, Calendar, Sparkles, ChevronRight } from "lucide-react";

export function CareerRoadmapTimeline() {
  const [activeDay, setActiveDay] = useState(30);

  const roadmaps = [
    {
      day: 30,
      title: "30 Days: Foundation & ATS Calibration",
      goals: [
        "Audit master resume with ATS Calibrator Agent",
        "Quantify 100% of bullet points with impact metrics",
        "Clean public GitHub profile & optimize top 3 repository READMEs",
        "Calibrate LinkedIn profile headline and experience entries",
      ],
    },
    {
      day: 60,
      title: "60 Days: System Design & Mock Interviews",
      goals: [
        "Complete 20 STAR-structured behavioral interview drills",
        "Conduct 10 System Design mock sessions (Rate Limiters, Microservices, Spanner)",
        "Build 1 production-ready full-stack portfolio project",
        "Apply to top 15 target company roles using Chrome Extension",
      ],
    },
    {
      day: 90,
      title: "90 Days: Active Applications & Interview Loops",
      goals: [
        "Maintain active interview loops with 5+ top tech companies",
        "Execute technical coding rounds and architecture presentations",
        "Recalibrate strategy weekly using Copilot telemetry",
        "Receive first formal job offer package",
      ],
    },
    {
      day: 180,
      title: "180 Days: Negotiation & Onboarding",
      goals: [
        "Run Offer Negotiator Agent to maximize base salary and equity grant",
        "Accept top offer and onboard successfully into Senior/Staff engineering role",
      ],
    },
    {
      day: 365,
      title: "365 Days: Staff Promotion & Career Growth",
      goals: [
        "Track quarterly impact milestones for promotion readiness",
        "Expand open-source presence and domain authority",
      ],
    },
  ];

  return (
    <section id="roadmap" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-4">
          <Compass className="w-3.5 h-3.5" /> Dynamic Career Roadmap
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Personalized Career Execution{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Timeline
          </span>
        </h2>
        <p className="mt-4 text-base text-slate-300">
          A structured step-by-step roadmap guiding engineering candidates from resume audit to senior offer negotiation.
        </p>
      </div>

      {/* Timeline Switcher Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {roadmaps.map((r) => (
          <button
            key={r.day}
            onClick={() => setActiveDay(r.day)}
            className={`px-5 py-3 rounded-2xl text-xs font-mono font-bold transition-all duration-200 ${
              activeDay === r.day
                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_25px_rgba(56,189,248,0.3)]"
                : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {r.day} Days
          </button>
        ))}
      </div>

      {/* Timeline Milestone Details Card */}
      <AnimatePresence mode="wait">
        {roadmaps
          .filter((r) => r.day === activeDay)
          .map((roadmap) => (
            <motion.div
              key={roadmap.day}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="p-8 rounded-3xl bg-[#090d18] border border-cyan-500/20 backdrop-blur-2xl max-w-4xl mx-auto space-y-6 shadow-[0_0_60px_rgba(56,189,248,0.1)]"
            >
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">{roadmap.title}</h3>
              </div>

              <div className="space-y-3">
                {roadmap.goals.map((goal, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3 text-sm text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{goal}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </section>
  );
}
