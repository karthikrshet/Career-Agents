"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, GitBranch, Link2, Mic,
  KanbanSquare, Building2, Bot, BarChart3, Package,
  Cpu, Settings, ChevronLeft, ChevronRight, Zap,
  TrendingUp
} from "lucide-react";
import { cn, formatScore } from "@/lib/utils";
import { useStore } from "@/lib/store";

const NAV_ITEMS = [
  {
    section: "Core",
    items: [
      { href: "/", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/resume", icon: FileText, label: "Resume Studio" },
      { href: "/GitBranch", icon: GitBranch, label: "GitBranch Analyzer" },
      { href: "/Link2", icon: Link2, label: "Link2 Optimizer" },
      { href: "/interview", icon: Mic, label: "Interview Lab" },
    ],
  },
  {
    section: "Career",
    items: [
      { href: "/tracker", icon: KanbanSquare, label: "Job Tracker" },
      { href: "/prephub", icon: Building2, label: "Prep Hub" },
      { href: "/copilot", icon: Bot, label: "Career Copilot" },
      { href: "/reports", icon: BarChart3, label: "Reports" },
    ],
  },
  {
    section: "Platform",
    items: [
      { href: "/marketplace", icon: Package, label: "Marketplace" },
      { href: "/mcp", icon: Cpu, label: "MCP Server" },
      { href: "/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const metrics = useStore((s) => s.metrics);

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex flex-col h-full border-r border-border bg-card/50 overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 p-4 border-b border-border",
        collapsed && "justify-center"
      )}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-glow-sky">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              <span className="text-sm font-semibold text-foreground tracking-tight">Career OS</span>
              <span className="text-[10px] text-muted-foreground">v2.0 · Career Intelligence</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Score pill */}
      <AnimatePresence>
        {!collapsed && metrics.careerScore > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-3 mt-3"
          >
            <div className="glass rounded-lg px-3 py-2 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-muted-foreground mb-1">Career Score</div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.careerScore}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                  />
                </div>
              </div>
              <span className="text-xs font-semibold text-foreground shrink-0">
                {metrics.careerScore}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5 mt-2">
        {NAV_ITEMS.map((section) => (
          <div key={section.section}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 mb-1.5"
                >
                  {section.section}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "sidebar-item relative",
                      collapsed && "justify-center px-0",
                      isActive && "sidebar-item-active"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          className="truncate text-sm"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute inset-0 rounded-lg bg-primary/10 -z-10"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 -right-3 w-6 h-6 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all z-10"
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3" />
          : <ChevronLeft className="w-3 h-3" />
        }
      </button>
    </motion.aside>
  );
}


