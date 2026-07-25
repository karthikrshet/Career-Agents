// apps/web/src/components/layout/command-palette.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, GitBranch, Link2, Mic,
  KanbanSquare, BookOpen, Bot, BarChart3, Package,
  Settings, Zap, Search, ArrowRight, Building2, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

// Load local files at compile/bundle time
import agentRegistry from "../../../../../agent-registry.json";
import companiesRegistry from "../../../../../companies.json";

const PAGES = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, description: "Career overview & metrics" },
  { href: "/resume", label: "Resume Studio", icon: FileText, description: "ATS analysis, bullet rewriting" },
  { href: "/github", label: "GitHub Analyzer", icon: GitBranch, description: "Portfolio health & stats" },
  { href: "/linkedin", label: "LinkedIn Optimizer", icon: Link2, description: "Profile visibility score" },
  { href: "/interview", label: "Interview Lab", icon: Mic, description: "AI-powered mock interviews" },
  { href: "/tracker", label: "Job Tracker", icon: KanbanSquare, description: "Kanban application board" },
  { href: "/prephub", label: "PrepHub", icon: BookOpen, description: "Company-specific prep tracks" },
  { href: "/copilot", label: "Career Copilot", icon: Bot, description: "AI career assistant chat" },
  { href: "/reports", label: "Reports", icon: BarChart3, description: "Export career analysis" },
  { href: "/marketplace", label: "Marketplace", icon: Package, description: "Plugins & integrations" },
  { href: "/mcp", label: "MCP Server", icon: Zap, description: "Model Context Protocol config" },
  { href: "/settings", label: "Settings", icon: Settings, description: "AI providers & preferences" },
];

const ACTIONS = [
  { id: "analyze-resume", label: "Analyze Resume", icon: FileText, href: "/resume", description: "Upload & analyze your resume" },
  { id: "github-audit", label: "GitHub Audit", icon: GitBranch, href: "/github", description: "Audit your GitHub profile" },
  { id: "start-interview", label: "Start Interview Session", icon: Mic, href: "/interview", description: "Begin a mock interview" },
  { id: "open-copilot", label: "Open Career Copilot", icon: Bot, href: "/copilot", description: "Chat with AI assistant" },
  { id: "settings-ai", label: "Configure AI Provider", icon: Settings, href: "/settings", description: "Set up your API keys" },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const copilotSessions = useStore((s) => s.copilotSessions);

  const navigate = useCallback((href: string) => {
    router.push(href);
    onOpenChange(false);
    setQuery("");
  }, [router, onOpenChange]);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenChange]);

  if (!open) return null;

  const lq = query.toLowerCase();

  // Search local pages
  const filteredPages = PAGES.filter(
    (p) => p.label.toLowerCase().includes(lq) || p.description.toLowerCase().includes(lq)
  );

  // Search quick actions
  const filteredActions = ACTIONS.filter(
    (a) => a.label.toLowerCase().includes(lq) || a.description.toLowerCase().includes(lq)
  );

  // Search 146 Career Agents from registry
  const filteredAgents = agentRegistry.agents
    .filter(
      (agent) =>
        agent.name.toLowerCase().includes(lq) ||
        agent.description.toLowerCase().includes(lq) ||
        agent.tags.some((t) => t.toLowerCase().includes(lq))
    )
    .slice(0, 5); // Limit to top 5 hits

  // Search active chats
  const filteredChats = copilotSessions
    .filter((session) => session.title.toLowerCase().includes(lq))
    .slice(0, 3);

  // Search Target Companies
  const filteredCompanies = companiesRegistry.companies
    .filter(
      (company) =>
        company.name.toLowerCase().includes(lq) ||
        company.description.toLowerCase().includes(lq)
    )
    .slice(0, 3);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      onClick={() => onOpenChange(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg mx-4 glass rounded-2xl border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search pages, actions, agents, companies…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[420px] overflow-y-auto py-2 divide-y divide-border/40">
          {/* Quick Actions */}
          {filteredActions.length > 0 && (
            <div className="py-2">
              <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Quick Actions
              </p>
              {filteredActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => navigate(action.href)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-secondary/40 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <action.icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{action.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{action.description}</p>
                  </div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Active Chats */}
          {filteredChats.length > 0 && (
            <div className="py-2">
              <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Recent Chats
              </p>
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => navigate(`/copilot?chat=${chat.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-secondary/40 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{chat.title}</p>
                    <p className="text-[10px] text-muted-foreground">Open chat session</p>
                  </div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Career Agents */}
          {filteredAgents.length > 0 && (
            <div className="py-2">
              <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Career Agents
              </p>
              {filteredAgents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => navigate(`/copilot?agent=${agent.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-secondary/40 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-foreground">{agent.name}</span>
                      <span className="text-[9px] px-1 bg-indigo-500/10 text-indigo-400 rounded-sm font-medium">
                        {agent.division}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{agent.description}</p>
                  </div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Target Companies */}
          {filteredCompanies.length > 0 && (
            <div className="py-2">
              <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Companies
              </p>
              {filteredCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => navigate(`/prephub?company=${company.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-secondary/40 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{company.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{company.description}</p>
                  </div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Pages */}
          {filteredPages.length > 0 && (
            <div className="py-2">
              <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Pages
              </p>
              {filteredPages.map((page) => (
                <button
                  key={page.href}
                  onClick={() => navigate(page.href)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-secondary/40 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-muted transition-colors">
                    <page.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{page.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{page.description}</p>
                  </div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {filteredPages.length === 0 &&
            filteredActions.length === 0 &&
            filteredAgents.length === 0 &&
            filteredChats.length === 0 &&
            filteredCompanies.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-xs text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
              </div>
            )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-[9px] text-muted-foreground/60">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>ESC Close</span>
          <span className="ml-auto">⌘K to open</span>
        </div>
      </div>
    </div>
  );
}
