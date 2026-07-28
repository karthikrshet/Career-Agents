// apps/web/src/app/features/page.tsx
"use client";

import { motion } from "framer-motion";
import {
  FileText, GitBranch, Link2, Mic, Bot, Workflow, Cpu, Terminal, Shield, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FeaturesPage() {
  const featuresList = [
    {
      icon: FileText,
      title: "Resume Studio Intelligence",
      desc: "Performs full forensic text parsers across PDF and docx uploads, highlighting passive verbs and missing keywords. Generates structured STAR accomplishments critiques with score metrics.",
    },
    {
      icon: GitBranch,
      title: "GitHub Analyzer",
      desc: "Integrates directly with public repository APIs to grade documentation health, code formatting, language statistics, and stars. Generates custom transition learning roadmaps.",
    },
    {
      icon: Link2,
      title: "LinkedIn Profile Optimizer",
      desc: "Evaluates keyword densities across headlines, summary bios, and experience cards to boost search visibility rankings.",
    },
    {
      icon: Mic,
      title: "Interview Lab Coach",
      desc: "Simulates actual behavioral and technical coding interviews. Grades responses for STAR formatting coverage and filler word density.",
    },
    {
      icon: Bot,
      title: "AI Copilot Workspace",
      desc: "Houses permanent conversation memory logs, folders syncing, and custom templates with direct fallback gateways.",
    },
    {
      icon: Workflow,
      title: "Low-Code Workflow Builder",
      desc: "Connects 146 specialized AI agent roles using drag-and-drop node graph connectors to automate multi-stage career tasks.",
    },
    {
      icon: Cpu,
      title: "MCP Server Integration",
      desc: "Exposes 19+ JSON-RPC semantic tools that link registry indices to terminal pipelines or code editors.",
    },
    {
      icon: Terminal,
      title: "Secure Code Playground",
      desc: "Compiles and executes code snippets within Piston execution sandboxes, measuring output, memory overheads, and run timings.",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative py-20">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-white transition mb-12">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to landing
        </Link>

        <div className="max-w-2xl mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Ecosystem Features
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Career Agents operates on a modular architecture of specialized utilities, RAG caches, and secure sandboxes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {featuresList.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="border border-slate-900 bg-slate-950/40 p-8 rounded-2xl flex gap-6 hover:border-slate-800 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <f.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="border border-slate-900 bg-slate-950/60 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 shrink-0">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-1">SSRF and CSP Hardened Gateway</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">Our gateway enforces strict network checks to prevent server side request forgery and log injection.</p>
            </div>
          </div>
          <Link href="/dashboard">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg">
              Launch Application
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
