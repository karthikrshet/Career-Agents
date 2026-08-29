"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Copy, Check, Sparkles, MessageSquare,
  Mail, Users, Award, ExternalLink, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function RecruiterOutreachGenerator({
  candidateName = "Candidate",
  targetRole = "Senior Software Engineer",
  targetCompany = "Google",
  topSkills = ["TypeScript", "Next.js", "Distributed Systems", "PostgreSQL"],
}: {
  candidateName?: string;
  targetRole?: string;
  targetCompany?: string;
  topSkills?: string[];
}) {
  const [activeFormat, setActiveFormat] = useState<"inmail" | "hiring_manager" | "referral">("inmail");
  const [copied, setCopied] = useState(false);

  const skillsStr = topSkills.slice(0, 3).join(", ");

  const formats = {
    inmail: {
      title: "LinkedIn 300-Char InMail (High Conversion)",
      badge: "Recruiter Target",
      subject: "Application Follow-up",
      text: `Hi [Recruiter Name], I saw the ${targetRole} opening at ${targetCompany} and wanted to reach out directly. I specialize in ${skillsStr} with a track record of scaling low-latency distributed systems. I'd love to connect and share my background for this loop!`,
      charCount: 260,
    },
    hiring_manager: {
      title: "Direct Hiring Manager Value Pitch (Email)",
      badge: "Engineering Director Target",
      subject: `${targetRole} Opportunity — ${candidateName} Introduction`,
      text: `Hi [Hiring Manager Name],

I’ve been closely following ${targetCompany}'s engineering work and recent architectural scaling milestones.

With deep experience in ${skillsStr}, I recently architected high-throughput microservices that cut P99 latency by 42% and supported 15M+ daily active requests. 

I’m excited about the ${targetRole} opening on your team and would welcome a brief 10-minute chat to discuss how I can contribute to your Q3 roadmap.

Resume & Portfolio: [Portfolio Link]
Best regards,
${candidateName}`,
      charCount: 520,
    },
    referral: {
      title: "Warm Referral Request Note",
      badge: "Alumni / 2nd Degree Network",
      subject: `Connecting regarding ${targetCompany} SWE Roles`,
      text: `Hi [Name], hope you're having a great week! I noticed you're working at ${targetCompany} as a [Their Role]. I'm currently preparing for the ${targetRole} opening and my background is deeply aligned with ${skillsStr}. Would you be open to submitting a quick internal referral? Happy to share my resume and relevant project highlights!`,
      charCount: 380,
    },
  };

  const current = formats[activeFormat];

  function handleCopy() {
    navigator.clipboard.writeText(current.text);
    setCopied(true);
    toast.success("Outreach message copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="glass border-cyan-500/30 overflow-hidden shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-purple-950/20 pb-4 border-b border-border/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-white">
                  Recruiter & Hiring Manager Outreach Generator
                </CardTitle>
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[10px]">
                  High Reply Rate
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Generate hyper-personalized outreach messages that bypass cold application queues.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold shadow-md transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Outreach"}</span>
          </button>
        </div>

        {/* Tab format switchers */}
        <div className="flex items-center gap-2 mt-4">
          {[
            { id: "inmail" as const, label: "LinkedIn InMail", icon: MessageSquare },
            { id: "hiring_manager" as const, label: "Hiring Manager Email", icon: Mail },
            { id: "referral" as const, label: "Warm Referral Note", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFormat(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border",
                  activeFormat === tab.id
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm"
                    : "bg-slate-900/60 border-border/60 text-slate-400 hover:text-slate-200"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-200">{current.title}</span>
            <Badge variant="secondary" className="text-[10px] bg-secondary/80 text-cyan-300">
              {current.badge}
            </Badge>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">
            ~{current.charCount} characters
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-black/50 border border-border/60 font-sans text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
          {current.text}
        </div>
      </CardContent>
    </Card>
  );
}
