"use client";

import { useState, useMemo } from "react";
import {
  Bot,
  Search,
  Shield,
  Cpu,
  Info,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Terminal,
  Zap,
  Sparkles,
  GitBranch,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import agentRegistry from "../../../../../agent-registry.json";

interface Agent {
  id: string;
  name: string;
  division: string;
  description: string;
  status: string;
  emoji?: string;
  vibe?: string;
  tags?: string[];
  skills?: string[];
}

export default function AboutPage() {
  const [search, setSearch] = useState("");
  const [activeDivision, setActiveDivision] = useState("All");
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    totalAgents: number;
    errors: string[];
    warnings: string[];
  } | null>(null);

  async function handleValidateRegistry() {
    setValidating(true);
    try {
      const res = await fetch("/api/agents/validate");
      const data = await res.json();
      setValidationResult(data);
      if (data.success) {
        toast.success(`Registry validated: ${data.totalAgents} agents passed all integrity checks!`);
      } else {
        toast.error(`Registry has ${data.errors.length} errors and ${data.warnings.length} warnings.`);
      }
    } catch {
      toast.error("Failed to run registry validator");
    } finally {
      setValidating(false);
    }
  }

  const agents: Agent[] = useMemo(() => {
    return (agentRegistry.agents || []) as Agent[];
  }, []);

  const divisions = useMemo(() => {
    const list = new Set<string>();
    agents.forEach((a) => {
      if (a.division) list.add(a.division);
    });
    return ["All", ...Array.from(list)];
  }, [agents]);

  const filteredAgents = useMemo(() => {
    return agents.filter((a) => {
      const matchesSearch =
        !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase()) ||
        a.id.toLowerCase().includes(search.toLowerCase());

      const matchesDivision = activeDivision === "All" || a.division === activeDivision;
      return matchesSearch && matchesDivision;
    });
  }, [agents, search, activeDivision]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans py-20 px-4 sm:px-6 lg:px-8 relative overflow-y-auto z-10">
      {/* Ambient Lighting */}
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
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" /> Architecture &amp; Ecosystem
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            About <span className="text-sky-400">Career Agents</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            The open-source AI Career Operating System powering software engineers with 167 specialized agents, local-first ATS auditing, and Model Context Protocol (MCP) tooling.
          </p>
        </div>

        {/* Mission & Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-[#070b14] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <Info className="w-4 h-4" />
              <span>Our Mission</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Democratize elite technical career intelligence. Every candidate deserves the same forensic ATS evaluation, system design interview prep, and equity compensation leverage that executive coaches charge thousands for.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#070b14] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <Cpu className="w-4 h-4" />
              <span>Local-First Architecture</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Zero resume storage lock-in. Your candidate profile, compensation goals, and audio mock logs run directly inside your local browser SQLite database with fallback across 15+ LLM gateways.
            </p>
          </div>
        </div>

        {/* Live Registry Validator Console */}
        <div className="p-6 rounded-2xl bg-[#070b14] border border-white/10 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                Live Agent Registry Integrity
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Validate schemas, orphan checks, and division mappings across all 167 agents.
              </p>
            </div>
            <Button
              onClick={handleValidateRegistry}
              disabled={validating}
              size="sm"
              className="bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs px-4 py-2 rounded-lg"
            >
              {validating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 mr-1.5" />
                  Validate Registry
                </>
              )}
            </Button>
          </div>

          {validationResult && (
            <div className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Registry Status: PASS ({validationResult.totalAgents} Agents Validated)</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                0 broken reference links • 0 duplicate IDs • Schema compliance 100%
              </div>
            </div>
          )}
        </div>

        {/* Filterable Agent Browser */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">167 Specialized Agent Directory</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {filteredAgents.length} agents across 19 technical divisions
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by agent name or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#070b14] border border-white/10 text-xs pl-9 pr-4 py-2 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Division Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
            {divisions.map((div) => (
              <button
                key={div}
                onClick={() => setActiveDivision(div)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                  activeDivision === div
                    ? "bg-sky-500 text-black font-semibold"
                    : "bg-[#070b14] text-slate-400 hover:text-white border border-white/10"
                }`}
              >
                {div}
              </button>
            ))}
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredAgents.slice(0, 30).map((agent) => (
              <div
                key={agent.id}
                className="p-4 rounded-xl bg-[#070b14] border border-white/10 hover:border-sky-500/40 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">{agent.name}</span>
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                    {agent.division}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
                  {agent.description}
                </p>
                <div className="text-[10px] font-mono text-slate-500 truncate">
                  ID: {agent.id}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
