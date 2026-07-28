"use client";

import { useState, useMemo } from "react";
import { Bot, Search, Shield, Cpu, Info, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  const [validationResult, setValidationResult] = useState<{ success: boolean; totalAgents: number; errors: string[]; warnings: string[] } | null>(null);

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
    <div className="flex flex-col h-full overflow-auto">
      <Topbar title="About Platform" subtitle="Mission, architecture, and dynamic agents registry" />

      <div className="flex-1 p-6 space-y-6">
        {/* Mission & Vision Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="glass text-left">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-400" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                To democratize career development by providing engineers with a unified, high-fidelity personal workspace. 
                Career Agents continuously monitors your resume, GitHub commits, and profile visibility, matching them with specialized 
                coaching models to survival-test your candidacy for top-tier companies.
              </p>
            </CardContent>
          </Card>

          <Card className="glass text-left">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                An open-source developer copilot ecosystem where personal profiles remain fully sovereign. 
                By utilizing local databases, client configurations (MCP), and multi-agent intent routers, we build 
                a secure pipeline that coaches technical expertise without compromising credentials or privacy.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Modular Architecture Layout */}
        <Card className="glass text-left">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Modular Core Architecture
            </CardTitle>
            <CardDescription>Pipeline execution path of the Career Agents workspace</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-lg border border-border/40 bg-secondary/10 space-y-1">
              <span className="font-semibold block text-primary">1. Dossier Context Gateway</span>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Natively extracts text from resumes, GitHub profiles, and workspace metrics to construct context.
              </p>
            </div>
            <div className="p-3.5 rounded-lg border border-border/40 bg-secondary/10 space-y-1">
              <span className="font-semibold block text-sky-400">2. Intent Router Classifier</span>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Classifies queries dynamically, matching tags against the 146 active registry.
              </p>
            </div>
            <div className="p-3.5 rounded-lg border border-border/40 bg-secondary/10 space-y-1">
              <span className="font-semibold block text-emerald-400">3. Multi-Agent Orchestrator</span>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Loads and executes system prompts of matched specialized agents to generate combined prompt structures.
              </p>
            </div>
            <div className="p-3.5 rounded-lg border border-border/40 bg-secondary/10 space-y-1">
              <span className="font-semibold block text-indigo-400">4. Streaming Response Gateway</span>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Proxies streams to client layouts, executing plugin post-processing filters (STAR breakdowns or Big-O analysis).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 146 Specialized Agents Registry */}
        <Card className="glass text-left">
          <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="w-4 h-4 text-violet-400" />
                Specialized AI Agents Registry ({agents.length} Active)
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Dynamic metadata database for all registered platform agents</span>
                {validationResult && (
                  <span className="flex items-center gap-1 text-[10px] font-medium mt-0.5">
                    {validationResult.success ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Integrity OK
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" /> Integrity Failed ({validationResult.errors.length} errors)
                      </span>
                    )}
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                disabled={validating}
                onClick={handleValidateRegistry}
                className="h-8 text-xs font-semibold px-3 bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20"
              >
                {validating && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                Validate Registry
              </Button>
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search agents by name or tag..."
                  className="pl-8 text-xs h-8 bg-secondary/30"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Division Filters */}
            <div className="flex flex-wrap gap-1 border-b border-border/40 pb-3">
              {divisions.map((divName) => (
                <button
                  key={divName}
                  onClick={() => setActiveDivision(divName)}
                  className="px-2.5 py-1 rounded text-[10px] font-medium transition-all capitalize border border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                  style={{
                    backgroundColor: activeDivision === divName ? "rgba(139, 92, 246, 0.1)" : "transparent",
                    borderColor: activeDivision === divName ? "rgba(139, 92, 246, 0.3)" : undefined,
                    color: activeDivision === divName ? "#a78bfa" : undefined
                  }}
                >
                  {divName}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-1">
              {filteredAgents.map((agent) => (
                <div key={agent.id} className="p-3.5 rounded-lg border border-border/50 hover:border-border transition-all flex flex-col justify-between space-y-2 bg-card/10 text-xs">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5 font-sans">
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <span className="text-base shrink-0">{agent.emoji || "🤖"}</span>
                        <span className="truncate">{agent.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-[8px] uppercase tracking-wider shrink-0 scale-95">{agent.division}</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal line-clamp-3 mb-2">{agent.description}</p>
                  </div>
                  <div className="pt-2 border-t border-border/20 space-y-1.5 text-[10px] text-muted-foreground font-mono">
                    <div>Category: <span className="text-foreground capitalize">{agent.division}</span></div>
                    <div>Version: <span className="text-foreground">1.0.0</span></div>
                    <div>Tools: <span className="text-foreground">["context_audit", "coach_rewrite"]</span></div>
                    <div className="flex items-center gap-1">Status: <Badge variant="success" className="text-[8px] h-3.5 py-0 px-1 font-semibold">LIVE</Badge></div>
                    <div>Priority: <span className="text-foreground">Medium</span></div>
                    <div>Dependencies: <span className="text-foreground">["ai_router"]</span></div>
                    <div>Provider: <span className="text-foreground">Gemini</span></div>
                  </div>
                </div>
              ))}
              {filteredAgents.length === 0 && (
                <div className="col-span-full py-10 text-center text-muted-foreground text-xs">
                  No agents matched your search filter query.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
