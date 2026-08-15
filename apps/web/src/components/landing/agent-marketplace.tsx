"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Search,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import agentRegistry from "../../../../../agent-registry.json";

export function AgentMarketplace() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Resume & ATS",
    "Interview & STAR",
    "GitHub & Code",
    "LinkedIn & Brand",
    "Career Strategy",
  ];

  const agents = agentRegistry?.agents || [];

  const filteredAgents = agents.filter((agent: any) => {
    const matchesQuery =
      !query ||
      agent.name.toLowerCase().includes(query.toLowerCase()) ||
      agent.role?.toLowerCase().includes(query.toLowerCase()) ||
      agent.description?.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;

    if (selectedCategory === "Resume & ATS") {
      return (
        agent.name.toLowerCase().includes("resume") ||
        agent.name.toLowerCase().includes("ats") ||
        agent.id.includes("resume")
      );
    }
    if (selectedCategory === "Interview & STAR") {
      return (
        agent.name.toLowerCase().includes("interview") ||
        agent.name.toLowerCase().includes("star") ||
        agent.id.includes("interview")
      );
    }
    if (selectedCategory === "GitHub & Code") {
      return (
        agent.name.toLowerCase().includes("github") ||
        agent.name.toLowerCase().includes("code") ||
        agent.name.toLowerCase().includes("repository")
      );
    }
    if (selectedCategory === "LinkedIn & Brand") {
      return (
        agent.name.toLowerCase().includes("linkedin") ||
        agent.name.toLowerCase().includes("outreach") ||
        agent.name.toLowerCase().includes("brand")
      );
    }
    if (selectedCategory === "Career Strategy") {
      return (
        agent.name.toLowerCase().includes("salary") ||
        agent.name.toLowerCase().includes("negotiator") ||
        agent.name.toLowerCase().includes("strategy") ||
        agent.name.toLowerCase().includes("executive")
      );
    }

    return true;
  });

  return (
    <section id="agents" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 font-sans">
      {/* Background Precision Grid & Glow */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 bg-sky-500/08 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium mb-3">
          <Bot className="w-3.5 h-3.5" /> 167 Specialized AI Agents
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Explore the Agent <span className="text-sky-400">Ecosystem</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
          Search and filter across 167 specialized AI agents categorized by technical divisions and career workflows.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 relative z-10">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search 167 agents by name, role or skill..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070b14] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 transition-all font-sans"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-sky-500 text-black font-semibold shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                  : "bg-[#070b14] border border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Agents Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">
        <AnimatePresence>
          {filteredAgents.slice(0, 12).map((agent: any) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-2xl bg-[#070b14] border border-white/10 hover:border-sky-500/30 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-slate-400 border border-white/10">
                    {agent.id}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">
                  {agent.name}
                </h3>
                <div className="text-xs text-sky-400 font-medium mt-0.5">
                  {agent.role || "Specialist Agent"}
                </div>

                <p className="mt-3 text-xs text-slate-300 line-clamp-3 leading-relaxed font-normal">
                  {agent.description || agent.systemPromptSnippet || "Specialized AI agent ready to audit, analyze, and optimize your career assets."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-sans">
                <span className="text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Operational
                </span>
                <Link
                  href={`/dashboard?agent=${agent.id}`}
                  className="flex items-center gap-1 font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <span>Launch Agent</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Note */}
      <div className="mt-10 text-center relative z-10">
        <p className="text-xs text-slate-400 font-mono">
          Showing {Math.min(12, filteredAgents.length)} of {agents.length} active agents across 19 technical divisions.
        </p>
      </div>
    </section>
  );
}
