"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Search,
  Sparkles,
  FileText,
  Mic,
  GitBranch,
  Compass,
  ArrowUpRight,
  Filter,
  CheckCircle2
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
        agent.id.includes("github")
      );
    }
    if (selectedCategory === "LinkedIn & Brand") {
      return (
        agent.name.toLowerCase().includes("linkedin") ||
        agent.name.toLowerCase().includes("profile") ||
        agent.id.includes("linkedin")
      );
    }
    if (selectedCategory === "Career Strategy") {
      return (
        agent.name.toLowerCase().includes("career") ||
        agent.name.toLowerCase().includes("roadmap") ||
        agent.name.toLowerCase().includes("salary")
      );
    }

    return true;
  });

  return (
    <section id="marketplace" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" /> 146 Specialized AI Agents
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explore the Complete{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
            AI Agent Ecosystem
          </span>
        </h2>
        <p className="mt-4 text-base text-slate-300">
          Search and launch specialized AI agents designed for every step of your software engineering career pipeline.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Search Bar Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents by skill, domain, or role..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 backdrop-blur-md"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                  : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Agents Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredAgents.slice(0, 12).map((agent: any) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative group p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-400 border border-white/10">
                    ID: {agent.id}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {agent.name}
                </h3>
                <div className="text-xs text-cyan-400/90 font-medium mt-0.5">
                  {agent.role || "Specialist Agent"}
                </div>

                <p className="mt-3 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {agent.description || agent.systemPromptSnippet || "Specialized AI agent ready to audit, analyze, and optimize your career assets."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Operational
                </span>
                <Link
                  href={`/dashboard?agent=${agent.id}`}
                  className="flex items-center gap-1 font-semibold text-cyan-400 group-hover:translate-x-0.5 transition-transform"
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
      <div className="mt-10 text-center">
        <p className="text-xs text-slate-400">
          Showing {Math.min(12, filteredAgents.length)} of {agents.length} active agents. All agents run concurrently via the AI Brain Orchestrator.
        </p>
      </div>
    </section>
  );
}
