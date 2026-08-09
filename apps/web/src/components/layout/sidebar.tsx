"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Mic,
  Briefcase,
  Kanban,
  Building2,
  Code,
  Link2,
  BarChart3,
  Bot,
  Sparkles,
  GitFork,
  Terminal,
  Settings,
  Info,
  Award,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  GitBranch,
  Volume2
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useStore } from "@/lib/store";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const metrics = useStore((s) => s.metrics);

  const careerScore = metrics?.careerScore || 26;

  const toggleGroup = (groupTitle: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  const navGroups = [
    {
      title: "CAREER STUDIO",
      items: [
        { name: "Overview Workspace", href: "/dashboard", icon: LayoutDashboard },
        { name: "Resume Studio", href: "/resume", icon: FileText },
        { name: "STAR Interview Lab", href: "/interview", icon: Mic },
        { name: "Voice Agent Lab", href: "/interview/voice", icon: Volume2 },
        { name: "Job Hub", href: "/jobs", icon: Briefcase },
        { name: "Job Tracker", href: "/tracker", icon: Kanban },
        { name: "Prep Hub", href: "/prephub", icon: Building2 },
        { name: "Code Playground", href: "/playground", icon: Code },
        { name: "LinkedIn Optimizer", href: "/linkedin", icon: Link2 },
        { name: "LinkedIn AI Content", href: "/linkedin-ai", icon: Sparkles },
        { name: "Reports & Diagnostics", href: "/reports", icon: BarChart3 },
      ],
    },
    {
      title: "AI ECOSYSTEM",
      items: [
        { name: "AI Copilot Stream", href: "/copilot", icon: Bot },
        { name: "146 Agent Marketplace", href: "/marketplace", icon: Sparkles },
        { name: "Workflow Pipelines", href: "/workflows", icon: GitFork },
      ],
    },
    {
      title: "DEVELOPER TOOLS",
      items: [
        { name: "GitHub Analyzer", href: "/github", icon: GitBranch },
        { name: "MCP Protocol Server", href: "/mcp", icon: Terminal },
      ],
    },
    {
      title: "WORKSPACE & SYSTEM",
      items: [
        { name: "Settings & API Keys", href: "/settings", icon: Settings },
        { name: "Credits & Open Source", href: "/credits", icon: Award },
      ],
    },
  ];

  return (
    <aside className="hidden md:flex w-64 h-screen sticky top-0 bg-[#050814] border-r border-white/10 flex-col justify-between p-4 z-30 font-sans shrink-0">
      <div className="space-y-5 overflow-y-auto no-scrollbar">
        {/* Header Logo */}
        <div className="px-2 pt-1">
          <Logo size="md" variant="sidebar" showTagline={true} />
        </div>

        {/* Career Score Widget */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Career Score
            </span>
            <span className="font-mono font-bold text-white text-sm">{careerScore}</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, careerScore))}%` }}
            />
          </div>
        </div>

        {/* Grouped Sidebar Navigation */}
        <div className="space-y-4">
          {navGroups.map((group) => {
            const isCollapsed = collapsedGroups[group.title];
            return (
              <div key={group.title} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
                >
                  <span>{group.title}</span>
                  {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {!isCollapsed && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            isActive
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                          <span suppressHydrationWarning>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Telemetry Status */}
      <div className="pt-3 border-t border-white/10 px-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Local SQLite Ready
        </span>
        <span className="text-slate-500">v16.0</span>
      </div>
    </aside>
  );
}
