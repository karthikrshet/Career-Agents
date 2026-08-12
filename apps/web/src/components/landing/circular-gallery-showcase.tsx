"use client";

import React from "react";
import { CircularGallery, GradientText } from "@/components/react-bits";
import { Sparkles, Layers, Cpu, ShieldCheck, Terminal, Rocket, Bot } from "lucide-react";

export function CircularGalleryShowcase() {
  const galleryItems = [
    {
      id: "ai-eng",
      title: "AI Engineering & LLM Architecture",
      category: "18 Autonomous Agents",
      description: "Agents specialized in RAG chunking, semantic cache, vector quantization, and fine-tuning evaluation.",
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      tag: "18 Agents",
      gradient: "from-cyan-500/20 via-blue-600/10 to-transparent",
    },
    {
      id: "faang-prep",
      title: "FAANG & Principal Prep Track",
      category: "16 Specialized Agents",
      description: "System design simulators, Google L6 concurrency drills, Meta E6 distributed caches, and Apple Core OS tracks.",
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      tag: "16 Agents",
      gradient: "from-purple-500/20 via-pink-600/10 to-transparent",
    },
    {
      id: "cybersec",
      title: "Cybersecurity & Zero-Trust IAM",
      category: "14 Autonomous Agents",
      description: "Threat modeling, OWASP ASVS checks, cloud policy audits, and cryptosystem design review.",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      tag: "14 Agents",
      gradient: "from-emerald-500/20 via-teal-600/10 to-transparent",
    },
    {
      id: "data-eng",
      title: "Data Streaming & Lakehouse",
      category: "15 Specialized Agents",
      description: "Kafka partition sizing, Spark optimization, dbt DAG auditing, and Snowflake warehouse cost tuning.",
      icon: <Layers className="w-6 h-6 text-amber-400" />,
      tag: "15 Agents",
      gradient: "from-amber-500/20 via-orange-600/10 to-transparent",
    },
    {
      id: "mcp-tools",
      title: "Universal MCP Tool Registry",
      category: "Model Context Protocol",
      description: "Direct tool invocation across Cursor, Claude Desktop, Antigravity, and VS Code extensions.",
      icon: <Terminal className="w-6 h-6 text-sky-400" />,
      tag: "Open Standard",
      gradient: "from-sky-500/20 via-indigo-600/10 to-transparent",
    },
    {
      id: "devrel-gtm",
      title: "Technical GTM & DevRel Studio",
      category: "12 Autonomous Agents",
      description: "Technical blogging, benchmark synthesis, SDK documentation, and API launch runbooks.",
      icon: <Rocket className="w-6 h-6 text-rose-400" />,
      tag: "12 Agents",
      gradient: "from-rose-500/20 via-red-600/10 to-transparent",
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-medium mb-4">
          <Bot className="w-3.5 h-3.5" /> 3D Interactive Ecosystem
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explore the{" "}
          <GradientText
            colors={["#c084fc", "#38bdf8", "#818cf8", "#f472b6", "#c084fc"]}
            animationSpeed={6}
            className="inline-flex"
          >
            146 Agent Ecosystem
          </GradientText>
        </h2>
        <p className="mt-4 text-base text-slate-300">
          Drag horizontally or use controls to spin the 3D cylinder and inspect agent divisions.
        </p>
      </div>

      <div className="relative rounded-3xl border border-white/10 bg-[#050814]/80 backdrop-blur-2xl p-4 sm:p-8 overflow-hidden shadow-[0_0_80px_rgba(192,132,252,0.12)]">
        <CircularGallery
          items={galleryItems}
          textColor="#ffffff"
          borderRadius={18}
          scrollEase={0.06}
        />
      </div>
    </section>
  );
}
