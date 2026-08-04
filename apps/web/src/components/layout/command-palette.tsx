"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bot,
  FileText,
  Mic,
  GitBranch,
  LayoutDashboard,
  Terminal,
  Settings,
  BookOpen,
  ArrowRight,
  Sparkles,
  Command,
  X
} from "lucide-react";
import agentRegistry from "../../../../../agent-registry.json";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const rawAgents = agentRegistry?.agents || [];

  const staticNavigation = [
    { title: "Dashboard Workspace", category: "Pages", href: "/dashboard", icon: LayoutDashboard },
    { title: "Resume Studio", category: "Pages", href: "/resume", icon: FileText },
    { title: "Interview Lab", category: "Pages", href: "/interview", icon: Mic },
    { title: "GitHub Code Auditor", category: "Pages", href: "/github", icon: GitBranch },
    { title: "AI Copilot Stream", category: "Pages", href: "/copilot", icon: Bot },
    { title: "Model Context Protocol (MCP)", category: "Developer", href: "/mcp", icon: Terminal },
    { title: "Developer Documentation", category: "Developer", href: "/docs", icon: BookOpen },
    { title: "Workspace Settings", category: "Settings", href: "/settings", icon: Settings },
  ];

  const agentItems = rawAgents.map((a: any) => ({
    title: a.name,
    category: `Agent — ${a.division}`,
    href: `/dashboard?agent=${encodeURIComponent(a.id)}`,
    icon: Bot,
  }));

  const allItems = [...staticNavigation, ...agentItems];

  const filteredItems = query.trim() === ""
    ? allItems.slice(0, 10)
    : allItems.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 12);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    if (href.startsWith("http")) {
      window.open(href, "_blank");
    } else {
      router.push(href);
    }
  };

  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex].href);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150 font-sans">
      <div
        className="w-full max-w-xl rounded-2xl bg-[#090d18] border border-cyan-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden"
        onKeyDown={handleKeyNavigation}
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents, pages, tools, or docs... (Esc to close)"
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching agents or pages found. Try searching for &quot;Resume&quot; or &quot;Interview&quot;.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={`${item.title}-${idx}`}
                  onClick={() => handleSelect(item.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer text-xs transition-colors ${
                    isSelected ? "bg-cyan-500/20 text-white border border-cyan-500/30" : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${isSelected ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" : "bg-white/5 border-white/10 text-slate-400"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white">{item.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.category}</div>
                    </div>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? "text-cyan-300 translate-x-1" : "text-slate-600"} transition-all`} />
                </div>
              );
            })
          )}
        </div>

        {/* Keyboard Tips Footer */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.01] flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">ESC</kbd> Close</span>
          </div>
          <span className="text-cyan-400">146 Agents Indexed</span>
        </div>
      </div>
    </div>
  );
}
