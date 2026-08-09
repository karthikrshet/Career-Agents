"use client";

import React, { useState, useMemo } from "react";
import {
  Bot, Search, Sparkles, Filter, CheckCircle2, UserCheck, Code,
  GitBranch, Shield, Zap, Target, Briefcase, Terminal, Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AgentItem } from "./types";
import agentRegistry from "../../../../../../agent-registry.json";

const ALL_AGENTS = (agentRegistry?.agents || []) as AgentItem[];

interface AgentSelectorProps {
  selectedAgent: AgentItem;
  onSelectAgent: (agent: AgentItem) => void;
}

export function AgentSelector({ selectedAgent, onSelectAgent }: AgentSelectorProps) {
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("All");

  const divisionsList = useMemo(() => {
    const set = new Set(ALL_AGENTS.map((a) => a.division));
    return ["All", ...Array.from(set)];
  }, []);

  const filteredAgents = useMemo(() => {
    return ALL_AGENTS.filter((agent) => {
      const matchesSearch =
        !search ||
        agent.name.toLowerCase().includes(search.toLowerCase()) ||
        agent.description?.toLowerCase().includes(search.toLowerCase()) ||
        (agent.vibe && agent.vibe.toLowerCase().includes(search.toLowerCase()));

      const matchesDivision = divisionFilter === "All" || agent.division === divisionFilter;
      return matchesSearch && matchesDivision;
    });
  }, [search, divisionFilter]);

  const getAgentIcon = (division: string) => {
    switch (division?.toLowerCase()) {
      case "career":
        return <Briefcase className="w-4 h-4" />;
      case "engineering":
      case "ai-engineering":
        return <Code className="w-4 h-4" />;
      case "cybersecurity":
        return <Shield className="w-4 h-4" />;
      case "devrel":
        return <Terminal className="w-4 h-4" />;
      case "startup":
        return <Zap className="w-4 h-4" />;
      case "faang":
      case "company-interviews":
        return <Target className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  return (
    <Card className="border-white/10 bg-[#080d21] shadow-2xl rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-white/5 py-3 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              1. Choose Interviewer Agent ({filteredAgents.length} available)
            </CardTitle>
            <CardDescription className="text-[11px] text-slate-400 mt-0.5">
              Select an agent from our 146-agent registry to conduct your session with its distinct persona.
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 bg-cyan-500/10 font-mono text-[10px] w-fit py-0.5 px-2">
            <Sparkles className="w-3 h-3 mr-1" /> Selected: {selectedAgent.name}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 space-y-3">
        {/* Search and Division Filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search agents by name, vibe, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto no-scrollbar max-w-full pb-0.5">
            {divisionsList.slice(0, 6).map((div) => (
              <button
                key={div}
                onClick={() => setDivisionFilter(div)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 capitalize",
                  divisionFilter === div
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-white/[0.02] text-slate-400 hover:bg-white/5 border border-transparent"
                )}
              >
                {div}
              </button>
            ))}
          </div>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
          {filteredAgents.map((agent) => {
            const isSelected = selectedAgent.id === agent.id;
            return (
              <div
                key={agent.id}
                onClick={() => onSelectAgent(agent)}
                className={cn(
                  "group p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5",
                  isSelected
                    ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "bg-white/[0.01] hover:bg-white/[0.03] border-white/5"
                )}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: isSelected ? `${agent.color || "#06b6d4"}20` : "rgba(255,255,255,0.03)",
                    borderColor: isSelected ? agent.color || "#06b6d4" : "rgba(255,255,255,0.08)",
                    color: agent.color || "#06b6d4",
                  }}
                >
                  {getAgentIcon(agent.division)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className="font-semibold text-xs text-white truncate group-hover:text-cyan-300 transition-colors">
                      {agent.name}
                    </h3>
                    <Badge variant="outline" className="text-[9px] uppercase font-mono px-1 py-0 border-white/10 text-slate-400 shrink-0">
                      {agent.division}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                    {agent.description}
                  </p>

                  {agent.vibe && (
                    <p className="text-[10px] text-cyan-400/90 font-mono mt-1 truncate">
                      Vibe: {agent.vibe}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          {filteredAgents.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-500 text-xs">
              No matching agents found. Try searching for another term.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
