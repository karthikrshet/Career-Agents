"use client";

import { useState } from "react";
import { Bell, Search, User, Terminal } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn, scoreToColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const profile = useStore((s) => s.profile);
  const metrics = useStore((s) => s.metrics);
  const activityFeed = useStore((s) => s.activityFeed);
  const [showNotifications, setShowNotifications] = useState(false);

  const recent = activityFeed.slice(0, 5);

  return (
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
  );
}


