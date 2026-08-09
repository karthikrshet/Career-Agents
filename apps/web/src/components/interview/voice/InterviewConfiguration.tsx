"use client";

import React from "react";
import { Sliders, Building2, Briefcase, Globe, Clock, Layers, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExtendedInterviewMode, VoiceLanguage } from "./types";
import type { InterviewDifficulty } from "@/types";

const COMPANIES = [
  "Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Stripe",
  "OpenAI", "Anthropic", "Uber", "Atlassian", "Salesforce", "Adobe",
  "Juspay", "Infosys", "TCS", "Wipro", "Deloitte", "Startup", "Custom Company"
];

const MODES: { value: ExtendedInterviewMode; label: string }[] = [
  { value: "behavioral", label: "Behavioral (STAR Framework)" },
  { value: "technical", label: "Technical General" },
  { value: "dsa", label: "Data Structures & Algorithms" },
  { value: "system_design", label: "System Design & Architecture" },
  { value: "frontend", label: "Frontend Engineering" },
  { value: "backend", label: "Backend Engineering" },
  { value: "fullstack", label: "Full Stack Engineering" },
  { value: "ai_ml", label: "AI / Machine Learning" },
  { value: "devops", label: "DevOps & Cloud Infra" },
  { value: "database", label: "Database Engineering" },
  { value: "cloud", label: "Cloud Architecture" },
  { value: "hr", label: "HR & Culture Screen" },
  { value: "managerial", label: "Managerial & Leadership" },
  { value: "mixed", label: "Mixed (Technical + Behavioral)" },
];

const DIFFICULTIES: InterviewDifficulty[] = ["Easy", "Medium", "Hard", "Expert"];
const DURATIONS = [10, 20, 30, 45, 60];

const LANGUAGES: VoiceLanguage[] = [
  { name: "English (US)", code: "en-US" },
  { name: "English (UK)", code: "en-GB" },
  { name: "German (Germany)", code: "de-DE" },
  { name: "French (France)", code: "fr-FR" },
  { name: "Spanish (Spain)", code: "es-ES" },
  { name: "Spanish (Mexico)", code: "es-MX" },
  { name: "Portuguese (Brazil)", code: "pt-BR" },
  { name: "Hindi (India)", code: "hi-IN" },
  { name: "Kannada (India)", code: "kn-IN" },
  { name: "Tamil (India)", code: "ta-IN" },
  { name: "Telugu (India)", code: "te-IN" },
  { name: "Japanese (Japan)", code: "ja-JP" },
  { name: "Korean (South Korea)", code: "ko-KR" },
  { name: "Italian (Italy)", code: "it-IT" },
  { name: "Chinese (Mandarin)", code: "zh-CN" },
  { name: "Dutch (Netherlands)", code: "nl-NL" },
  { name: "Arabic (Saudi Arabia)", code: "ar-SA" },
  { name: "Turkish (Turkey)", code: "tr-TR" },
  { name: "Polish (Poland)", code: "pl-PL" },
  { name: "Swedish (Sweden)", code: "sv-SE" },
  { name: "Norwegian (Norway)", code: "no-NO" },
  { name: "Danish (Denmark)", code: "da-DK" },
  { name: "Finnish (Finland)", code: "fi-FI" },
  { name: "Indonesian (Indonesia)", code: "id-ID" },
  { name: "Vietnamese (Vietnam)", code: "vi-VN" },
  { name: "Thai (Thailand)", code: "th-TH" },
  { name: "Ukrainian (Ukraine)", code: "uk-UA" },
];

interface InterviewConfigurationProps {
  company: string;
  setCompany: (val: string) => void;
  role: string;
  setRole: (val: string) => void;
  mode: ExtendedInterviewMode;
  setMode: (val: ExtendedInterviewMode) => void;
  difficulty: InterviewDifficulty;
  setDifficulty: (val: InterviewDifficulty) => void;
  durationMinutes: number;
  setDurationMinutes: (val: number) => void;
  language: string;
  setLanguage: (val: string) => void;
}

export function InterviewConfiguration({
  company,
  setCompany,
  role,
  setRole,
  mode,
  setMode,
  difficulty,
  setDifficulty,
  durationMinutes,
  setDurationMinutes,
  language,
  setLanguage,
}: InterviewConfigurationProps) {
  return (
    <Card className="border-white/10 bg-[#080d21] shadow-2xl rounded-2xl">
      <CardHeader className="py-3 px-4 border-b border-white/5">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
          <Sliders className="w-4 h-4 text-cyan-400" />
          2. Session Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 space-y-3">
        {/* Company & Role */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
            <label className="flex items-center gap-1">
              <Building2 className="w-3 h-3 text-cyan-400" /> Target Company
            </label>
            <Badge variant="outline" className="text-[9px] border-white/10 text-slate-400 py-0 px-1.5">
              Company-style preparation
            </Badge>
          </div>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#0b1029] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {COMPANIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-cyan-400" /> Target Role
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Mode & Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyan-400" /> Interview Type
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as ExtendedInterviewMode)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#0b1029] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as InterviewDifficulty)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#0b1029] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Target Duration & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" /> Target Duration
            </label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#0b1029] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {DURATIONS.map((dur) => (
                <option key={dur} value={dur}>
                  {dur} Minutes
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-400" /> Language ({LANGUAGES.length})
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#0b1029] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
