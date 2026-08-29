"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Download, Copy, Check, Sparkles,
  Printer, X, Eye, ShieldCheck, Code, Globe
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ResumeDataPayload {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  targetRole?: string;
  summary?: string;
  skills?: string[];
  experience?: {
    company: string;
    role: string;
    period: string;
    location?: string;
    bullets: string[];
  }[];
  education?: {
    school: string;
    degree: string;
    year: string;
  }[];
  projects?: {
    name: string;
    tech: string;
    bullets: string[];
  }[];
}

export function LiveResumePreviewModal({
  resumeData,
  open = false,
  onClose,
}: {
  resumeData?: ResumeDataPayload;
  open?: boolean;
  onClose?: () => void;
}) {
  const [template, setTemplate] = useState<"classic" | "silicon_valley" | "executive">("silicon_valley");
  const [copied, setCopied] = useState(false);

  const data: ResumeDataPayload = resumeData || {
    name: "Alex Morgan",
    email: "alex.morgan@engineer.dev",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alex-morgan",
    github: "github.com/alexmorgan-dev",
    targetRole: "Senior Software Engineer",
    summary: "Senior Software Engineer with 6+ years of experience architecting high-scale distributed systems and cloud infrastructure. Proven track record of reducing P99 latency by 42% and scaling services to 15M+ daily active requests.",
    skills: ["TypeScript", "Next.js", "Go", "Python", "PostgreSQL", "Redis", "Kafka", "Docker", "Kubernetes", "AWS", "gRPC", "Distributed Systems"],
    experience: [
      {
        company: "Apex Distributed Cloud",
        role: "Senior Software Engineer",
        period: "2022 — Present",
        location: "San Francisco, CA",
        bullets: [
          "Architected and deployed high-throughput event processing pipelines using Go and Kafka, processing 15M+ daily events with 99.99% service availability.",
          "Overhauled database query indexing on a 500M+ row PostgreSQL cluster, cutting P99 API response times by 42% and reducing compute costs by $55,000/yr.",
          "Led a squad of 5 engineers delivering core microservices architecture on Kubernetes with automated CI/CD canary deployments.",
        ],
      },
      {
        company: "Nexus Technologies",
        role: "Software Engineer II",
        period: "2020 — 2022",
        location: "Seattle, WA",
        bullets: [
          "Engineered full-stack features in TypeScript, React, and Node.js, onboarding 120k+ active enterprise users within 6 months.",
          "Designed multi-tier caching layer using Redis and CDN edge invalidation, achieving sub-20ms average response time globally.",
        ],
      },
    ],
    education: [
      {
        school: "University of California, Berkeley",
        degree: "B.S. in Computer Science & Engineering",
        year: "2016 — 2020",
      },
    ],
    projects: [
      {
        name: "Career-Agents Intelligence Platform",
        tech: "TypeScript, Python, Next.js, OpenAI, Redis",
        bullets: [
          "Built multi-agent career copilot orchestrating 167 AI agent personas and real-time ATS resume scoring.",
        ],
      },
    ],
  };

  function handlePrint() {
    window.print();
  }

  function handleCopyMarkdown() {
    const md = `# ${data.name}
${data.email} | ${data.phone} | ${data.location} | [LinkedIn](${data.linkedin}) | [GitHub](${data.github})

## Professional Summary
${data.summary}

## Technical Skills
${data.skills?.join(", ")}

## Work Experience
${data.experience?.map((exp) => `### ${exp.role} — ${exp.company} (${exp.period})\n${exp.bullets.map((b) => `- ${b}`).join("\n")}`).join("\n\n")}

## Education
${data.education?.map((edu) => `### ${edu.degree} — ${edu.school} (${edu.year})`).join("\n\n")}
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    toast.success("Resume Markdown copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-[#0a0f1d] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col"
      >
        {/* Modal Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Live ATS 1-Page Resume Preview</h3>
              <p className="text-xs text-muted-foreground">Certified single-column layout for Workday, Greenhouse & Taleo</p>
            </div>
          </div>

          {/* Template Switcher */}
          <div className="flex items-center gap-2">
            {[
              { id: "silicon_valley" as const, label: "Silicon Valley Tech" },
              { id: "classic" as const, label: "Classic ATS Minimal" },
              { id: "executive" as const, label: "Executive High-Density" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all",
                  template === t.id
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                    : "bg-slate-800/60 border-border text-slate-400 hover:text-white"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleCopyMarkdown} variant="outline" className="text-xs h-8">
              {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              Markdown
            </Button>
            <Button size="sm" onClick={handlePrint} className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs h-8">
              <Printer className="w-3.5 h-3.5 mr-1" />
              Print / Save PDF
            </Button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The 1-Page Clean White Canvas Document */}
        <div className="p-8 bg-slate-950 flex justify-center overflow-x-auto">
          <div
            id="printable-resume"
            className="w-full max-w-[750px] bg-white text-slate-900 p-8 shadow-2xl rounded-sm font-sans text-xs leading-relaxed print:shadow-none print:p-0"
          >
            {/* Header */}
            <div className="text-center border-b border-slate-300 pb-3 mb-3">
              <h1 className="text-xl font-bold tracking-tight text-slate-950 uppercase">{data.name}</h1>
              <p className="text-[11px] text-slate-700 mt-1 font-medium">
                {data.location} · {data.phone} · <a href={`mailto:${data.email}`} className="text-blue-700 underline">{data.email}</a> · <a href={`https://${data.linkedin}`} className="text-blue-700 underline">{data.linkedin}</a> · <a href={`https://${data.github}`} className="text-blue-700 underline">{data.github}</a>
              </p>
            </div>

            {/* Summary */}
            {data.summary && (
              <div className="mb-3">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
                  Professional Summary
                </h2>
                <p className="text-[11px] text-slate-800 leading-normal">{data.summary}</p>
              </div>
            )}

            {/* Technical Skills */}
            {data.skills && data.skills.length > 0 && (
              <div className="mb-3">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
                  Technical Skills & Core Competencies
                </h2>
                <p className="text-[11px] text-slate-800 font-mono">
                  <strong className="text-slate-950 font-sans">Core Technologies: </strong>
                  {data.skills.join(" · ")}
                </p>
              </div>
            )}

            {/* Work Experience */}
            {data.experience && data.experience.length > 0 && (
              <div className="mb-3">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
                  Work Experience
                </h2>
                <div className="space-y-2.5">
                  {data.experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="font-bold text-slate-950">{exp.role} <span className="font-normal text-slate-700">| {exp.company}</span></span>
                        <span className="font-mono text-slate-600 text-[10.5px]">{exp.period}</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 mt-1 text-[11px] text-slate-800">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <div className="mb-3">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
                  Education
                </h2>
                <div className="space-y-1">
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-950">{edu.school} — <span className="font-normal text-slate-800">{edu.degree}</span></span>
                      <span className="font-mono text-slate-600 text-[10.5px]">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
                  Key Engineering Projects
                </h2>
                <div className="space-y-1.5">
                  {data.projects.map((proj, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-950">{proj.name} <span className="font-mono text-slate-600 text-[10px]">({proj.tech})</span></span>
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 mt-0.5 text-[11px] text-slate-800">
                        {proj.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
