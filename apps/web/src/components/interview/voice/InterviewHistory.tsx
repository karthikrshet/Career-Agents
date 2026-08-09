"use client";

import React from "react";
import { History, Building2, Calendar, Award, ChevronRight, Play, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { scoreToColor } from "@/lib/utils";
import type { InterviewSession } from "@/types";

interface InterviewHistoryProps {
  sessions: InterviewSession[];
  onSelectSession: (session: InterviewSession) => void;
}

export function InterviewHistory({ sessions, onSelectSession }: InterviewHistoryProps) {
  if (!sessions || sessions.length === 0) {
    return null;
  }

  return (
    <Card className="border-white/10 bg-[#080d21] shadow-2xl rounded-3xl overflow-hidden text-left">
      <CardHeader className="pb-3 border-b border-white/5">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
          <History className="w-4 h-4 text-cyan-400" />
          Past Interview History ({sessions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2 max-h-[260px] overflow-y-auto no-scrollbar">
        {sessions.map((s) => {
          const overall = s.scorecard?.overallScore;
          return (
            <div
              key={s.id}
              onClick={() => onSelectSession(s)}
              className="group p-3 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-cyan-400">
                  <Building2 className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {s.company} — {s.role}
                  </p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="capitalize">{s.mode}</span>
                    <span>•</span>
                    <span>{new Date(s.startedAt).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {overall !== undefined ? (
                  <Badge variant="outline" className={`font-mono text-xs font-bold border-white/10 ${scoreToColor(overall)}`}>
                    {overall}/100
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-[10px]">
                    Draft
                  </Badge>
                )}
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
