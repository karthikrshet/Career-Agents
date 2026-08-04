/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  BookOpen,
  MessageSquare,
  History,
  Menu,
  X,
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
  GitBranch,
  Terminal,
  Settings,
  Info,
  Award
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/layout/command-palette";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface TopbarProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const DEFAULT_SUBTITLES: Record<string, string> = {
  "/dashboard": "Overview workspace and career readiness analytics",
  "/resume": "ATS resume optimization, bullet rewrites, and keyword gaps",
  "/interview": "AI-powered mock interviews with STAR scorecard",
  "/jobs": "Explore open technical roles and AI matches",
  "/tracker": "Kanban pipeline for tracking your job applications",
  "/prephub": "Structured company preparation tracks",
  "/playground": "Interactive code environment & algorithmic testing",
  "/linkedin": "LinkedIn profile optimization & visibility scorer",
  "/linkedin-ai": "AI content generator for LinkedIn posts and recruiter outreach",
  "/reports": "Generate and export your career analysis reports",
  "/copilot": "Real-time AI copilot stream & multi-agent assistance",
  "/marketplace": "146 agent catalog and plugin integrations",
  "/workflows": "Automated multi-agent execution pipelines",
  "/github": "Live portfolio health audit from GitHub API",
  "/mcp": "Model Context Protocol server & diagnostic endpoint",
  "/settings": "Gateway preferences, API keys, and model routing",
  "/credits": "Platform contributors, repository stats, and acknowledgements",
};

const MOBILE_NAV_GROUPS = [
  {
    section: "CAREER STUDIO",
    items: [
      { label: "Overview Workspace", href: "/dashboard", icon: LayoutDashboard },
      { label: "Resume Studio", href: "/resume", icon: FileText },
      { label: "STAR Interview Lab", href: "/interview", icon: Mic },
      { label: "Job Hub", href: "/jobs", icon: Briefcase },
      { label: "Job Tracker", href: "/tracker", icon: Kanban },
      { label: "Prep Hub", href: "/prephub", icon: Building2 },
      { label: "Code Playground", href: "/playground", icon: Code },
      { label: "LinkedIn Optimizer", href: "/linkedin", icon: Link2 },
      { label: "LinkedIn AI Content", href: "/linkedin-ai", icon: Sparkles },
      { label: "Reports", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    section: "AI ECOSYSTEM",
    items: [
      { label: "AI Copilot Stream", href: "/copilot", icon: Bot },
      { label: "146 Agent Marketplace", href: "/marketplace", icon: Sparkles },
      { label: "Workflow Pipelines", href: "/workflows", icon: GitFork },
    ],
  },
  {
    section: "DEVELOPER & SYSTEM",
    items: [
      { label: "GitHub Analyzer", href: "/github", icon: GitBranch },
      { label: "MCP Protocol Server", href: "/mcp", icon: Terminal },
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Credits", href: "/credits", icon: Award },
    ],
  },
];

export function Topbar({ title, subtitle, className = "" }: TopbarProps) {
  const pathname = usePathname();
  const profile = useStore((s) => s.profile);
  const metrics = useStore((s) => s.metrics);
  const activityFeed = useStore((s) => s.activityFeed);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const careerScore = metrics?.careerScore || 26;
  const recent = activityFeed?.slice(0, 5) || [];
  const displaySubtitle = subtitle || DEFAULT_SUBTITLES[pathname] || "AI Career Operating System";

  const triggerCommandPalette = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  return (
    <>
      <header className={cn("sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#050814]/90 px-4 sm:px-6 backdrop-blur-md font-sans", className)}>
        {/* Left Title Section */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-300 hover:text-white shrink-0 w-9 h-9"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-tight truncate">{title}</h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-normal leading-tight mt-0.5 truncate max-w-[150px] sm:max-w-md">{displaySubtitle}</p>
          </div>
        </div>

        {/* Right Action Icons & Score */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick External Icons */}
          <div className="hidden lg:flex items-center gap-1.5 pr-2 border-r border-white/10 text-slate-400">
            <Link href="/docs" className="p-1.5 hover:text-cyan-300 rounded-lg hover:bg-white/5 transition-colors" title="Docs">
              <BookOpen className="w-4 h-4" />
            </Link>
            <a href="https://github.com/karthikrshet/Career-Agents" target="_blank" rel="noopener noreferrer" className="p-1.5 hover:text-white rounded-lg hover:bg-white/5 transition-colors" title="GitHub">
              <GithubIcon className="w-4 h-4" />
            </a>
            <a href="https://github.com/karthikrshet/Career-Agents/discussions" target="_blank" rel="noopener noreferrer" className="p-1.5 hover:text-indigo-300 rounded-lg hover:bg-white/5 transition-colors" title="Discussions">
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>

          {/* Search Trigger */}
          <button
            onClick={triggerCommandPalette}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/10 text-slate-300 border border-white/10">⌘K</kbd>
          </button>

          {/* Score Pill Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-xs font-mono">
            <span className="text-slate-400">Score</span>
            <span className="font-bold text-indigo-300">{careerScore}</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
            >
              <Bell className="w-4 h-4" />
              {recent.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </Button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#090d18] border border-white/10 p-4 shadow-2xl z-50 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-white border-b border-white/10 pb-2">
                    <span>Recent Activity</span>
                    <History className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  {recent.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No recent activity</p>
                  ) : (
                    <div className="space-y-2">
                      {recent.map((act) => (
                        <div key={act.id} className="text-xs space-y-0.5 p-2 rounded-lg bg-white/5 border border-white/10">
                          <p className="font-medium text-white">{act.title}</p>
                          <p className="text-[10px] text-slate-400">{act.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Avatar */}
          <Link href="/settings" className="flex items-center gap-2 pl-2 border-l border-white/10 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-[0_0_12px_rgba(56,189,248,0.3)]">
              <div className="w-full h-full bg-[#050814] rounded-full flex items-center justify-center text-cyan-300 font-extrabold text-xs">
                {profile?.name ? profile.name[0].toUpperCase() : "U"}
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#050814] border-r border-white/10 p-6 z-50 md:hidden flex flex-col h-full overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
                  <img src="/branding/logo.svg" alt="Logo" className="w-8 h-8" />
                  <span className="font-extrabold text-sm text-white">Career Agents</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="flex-1 space-y-6">
                {MOBILE_NAV_GROUPS.map((section: any) => (
                  <div key={section.section}>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-2">
                      {section.section}
                    </p>
                    <div className="space-y-1">
                      {section.items.map((item: any) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors",
                              isActive
                                ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                            )}
                          >
                            <item.icon className="w-4 h-4 shrink-0 text-cyan-400" />
                            <span suppressHydrationWarning>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <CommandPalette />
    </>
  );
}
