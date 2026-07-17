"use client";

import React, { useState } from "react";
import { CheckCircle, AlertTriangle, Brain, Star, Award, ChevronRight, Sparkles, BookOpen, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { scoreToColor, scoreToGrade } from "@/lib/utils";
import { ExportInterviewReport } from "./ExportInterviewReport";
import type { VoiceSessionData } from "./types";

interface InterviewScorecardProps {
  session: VoiceSessionData;
  onNewSession: () => void;
}

export function InterviewScorecard({ session, onNewSession }: InterviewScorecardProps) {
  const scorecard = session.scorecard;
  const [activeCoachTab, setActiveCoachTab] = useState<"summary" | "coach">("summary");

  if (!scorecard) {
    return (
      <div className="p-12 text-center text-slate-400">
        No evaluation data available for this session.
      </div>
    );
  }

  const dimensions = [
    { key: "technicalKnowledge", label: "Technical Knowledge", val: scorecard.technicalKnowledge },
    { key: "problemSolving", label: "Problem Solving", val: scorecard.problemSolving },
    { key: "communication", label: "Communication", val: scorecard.communication },
    { key: "clarity", label: "Clarity", val: scorecard.clarity },
    { key: "confidence", label: "Confidence", val: scorecard.confidence },
    { key: "depth", label: "Depth", val: scorecard.depth },
    { key: "correctness", label: "Correctness", val: scorecard.correctness },
    { key: "structure", label: "STAR Structure", val: scorecard.structure },
    { key: "behavioralReasoning", label: "Behavioral Reasoning", val: scorecard.behavioralReasoning },
    { key: "roleFit", label: "Role Fit", val: scorecard.roleFit },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left pb-12">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#080d21] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
            <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono">
              {session.agentName}
            </Badge>
            <Badge variant="outline" className="border-white/10 text-slate-400 capitalize">
              {session.mode}
            </Badge>
            <Badge variant="outline" className="border-white/10 text-slate-400">
              {session.difficulty}
            </Badge>
            {session.isDemoMode && (
              <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10">
                Simulated Demo Mode
              </Badge>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Interview Scorecard & Evidence Report
          </h2>
          <p className="text-slate-400 text-sm">
            Mock interview for {session.role} at {session.company} · Duration: {Math.round(session.durationSeconds / 60)} minutes
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/10 rounded-2xl p-4 shrink-0">
          <div className="text-center">
            <span className={`text-4xl sm:text-5xl font-mono font-black ${scoreToColor(scorecard.overallScore)}`}>
              {scorecard.overallScore}
            </span>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
              / 100 Overall
            </div>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="text-center px-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">
              {scoreToGrade(scorecard.overallScore)}
            </span>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Band</div>
          </div>
        </div>
      </div>

      {/* 10 Dimension Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {dimensions.map((d) => (
          <Card key={d.key} className="border-white/5 bg-[#080d21]">
            <CardContent className="p-4 text-center">
              <p className="text-[10px] text-slate-400 mb-1.5 font-medium truncate">
                {d.label}
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className={`text-2xl font-mono font-extrabold ${scoreToColor((d.val || 0) * 10)}`}>
                  {d.val || 0}
                </span>
                <span className="text-slate-600 text-xs font-mono">/10</span>
              </div>
              <Progress value={(d.val || 0) * 10} className="h-1 mt-2.5" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-white/10 bg-[#080d21]">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              Observed Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3">
              {scorecard.strengths?.map((str, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2.5">
                  <Star className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 fill-emerald-500/20" />
                  <span className="leading-relaxed">{str}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#080d21]">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              Recommended Improvements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3">
              {scorecard.weaknesses?.map((w, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2.5">
                  <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{w}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* AI Coach Diagnostic Summary */}
      <Card className="border-white/10 bg-[#080d21] shadow-xl">
        <CardHeader className="pb-3 border-b border-white/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-purple-300">
              <Brain className="w-4 h-4 text-purple-400" />
              AI Coach Detailed Diagnostic
            </CardTitle>
            <div className="flex rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] p-1">
              <button
                onClick={() => setActiveCoachTab("summary")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeCoachTab === "summary" ? "bg-purple-500/20 text-purple-300" : "text-slate-400"
                }`}
              >
                Overall Evaluation
              </button>
              <button
                onClick={() => setActiveCoachTab("coach")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeCoachTab === "coach" ? "bg-purple-500/20 text-purple-300" : "text-slate-400"
                }`}
              >
                7-Day Prep Roadmap
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {activeCoachTab === "summary" ? (
            <div className="space-y-4">
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {scorecard.feedback}
              </p>

              {scorecard.starBreakdown && (
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    STAR Framework Evidence Analysis
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                    {scorecard.starBreakdown.situation && (
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                        <span className="font-bold text-cyan-400 block mb-1">SITUATION</span>
                        <p className="text-slate-300">{scorecard.starBreakdown.situation}</p>
                      </div>
                    )}
                    {scorecard.starBreakdown.task && (
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                        <span className="font-bold text-cyan-400 block mb-1">TASK</span>
                        <p className="text-slate-300">{scorecard.starBreakdown.task}</p>
                      </div>
                    )}
                    {scorecard.starBreakdown.action && (
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                        <span className="font-bold text-cyan-400 block mb-1">ACTION</span>
                        <p className="text-slate-300">{scorecard.starBreakdown.action}</p>
                      </div>
                    )}
                    {scorecard.starBreakdown.result && (
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                        <span className="font-bold text-cyan-400 block mb-1">RESULT</span>
                        <p className="text-slate-300">{scorecard.starBreakdown.result}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                Actionable 7-Day Improvement Plan
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {scorecard.recommendations?.map((rec, i) => (
                  <li key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
                    <BookOpen className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export and Navigation Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        <ExportInterviewReport session={session} />
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.history.pushState(null, "", "/interview/voice");
              }
              onNewSession();
            }}
            className="border-white/10 bg-white/5 text-slate-300 hover:text-white"
          >
            ← Back to Launcher
          </Button>
          <Button
            onClick={onNewSession}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm px-6 py-5 rounded-xl border-0"
          >
            Start New Interview Session
          </Button>
        </div>
      </div>
    </div>
  );
}
