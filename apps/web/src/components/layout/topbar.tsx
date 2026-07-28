/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Search, User, Globe, BookOpen, HelpCircle, MessageSquare, History } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn, scoreToColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/layout/command-palette";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const profile = useStore((s) => s.profile);
  const metrics = useStore((s) => s.metrics);
  const activityFeed = useStore((s) => s.activityFeed);
  const [showNotifications, setShowNotifications] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const recent = activityFeed.slice(0, 5);

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className="flex items-center gap-4 px-6 py-4 border-b border-border bg-card/30 backdrop-blur-sm">
        {/* Page title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-foreground truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Navigation Shortcut Buttons */}
          <div className="hidden lg:flex items-center gap-1.5 mr-2 border-r border-border/50 pr-3">
            <Link href="/" title="Landing Page" className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted/10">
              <Globe className="w-3.5 h-3.5" />
            </Link>
            <Link href="/docs" title="Documentation" className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted/10">
              <BookOpen className="w-3.5 h-3.5" />
            </Link>
            <a href="https://github.com/karthikrshet/Career-Agents" target="_blank" rel="noopener noreferrer" title="GitHub Repository" className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted/10">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
            <Link href="/contact" title="Support Help" className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted/10">
              <HelpCircle className="w-3.5 h-3.5" />
            </Link>
            <a href="https://discord.gg/careeragents" target="_blank" rel="noopener noreferrer" title="Join Discord" className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted/10">
              <MessageSquare className="w-3.5 h-3.5" />
            </a>
            <Link href="/changelog" title="Changelog Updates" className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted/10">
              <History className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Search / Command Palette trigger */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground border border-border/50 rounded-lg px-3 py-1.5 h-auto text-xs"
            onClick={() => setPaletteOpen(true)}
            id="topbar-command-palette-btn"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
            <kbd className="ml-1 inline-flex items-center gap-0.5 rounded border border-border px-1 py-0.5 text-[10px] font-mono opacity-60">
              ⌘K
            </kbd>
          </Button>

          {/* Score chip */}
          {metrics.careerScore > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-border text-xs font-medium">
              <span className="text-muted-foreground">Score</span>
              <span className={cn("font-bold", scoreToColor(metrics.careerScore))}>
                {metrics.careerScore}
              </span>
            </div>
          )}

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
              id="topbar-notifications-btn"
            >
              <Bell className="w-4 h-4" />
              {recent.length > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Button>

            {showNotifications && (
              <div className="absolute right-0 top-10 w-80 glass border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold">Recent Activity</p>
                </div>
                {recent.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No activity yet. Start by analyzing your resume.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {recent.map((entry) => (
                      <div key={entry.id} className="px-4 py-3 hover:bg-secondary/30 transition-colors">
                        <p className="text-sm font-medium text-foreground">{entry.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{entry.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center cursor-pointer shrink-0">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>
        </div>
      </header>

      {/* Command Palette */}
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
