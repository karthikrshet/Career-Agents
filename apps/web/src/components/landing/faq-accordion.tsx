"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Search } from "lucide-react";

export function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [query, setQuery] = useState("");

  const faqs = [
    {
      q: "What is Career Agents?",
      a: "Career Agents is an open-source Career Intelligence Platform housing 146 specialized AI agents running concurrently to audit resumes, scan GitHub coding architectures, suggest LinkedIn content, track jobs via Kanbans, and run voice mock interviews.",
    },
    {
      q: "How do 146 AI agents collaborate?",
      a: "The AI Brain Orchestrator classifies user intent and selects a specialized sub-team of agents. For example, when you submit a resume, the ATS Calibrator, Bullet Rewrite Agent, and Skill Gap Analyst collaborate to generate a structured analysis scorecard.",
    },
    {
      q: "Can I run this without API keys?",
      a: "Yes. Career Agents includes a complete 'Demo Mode' toggle accessible on the /demo page. When Demo Mode is active, the system automatically feeds realistic, streaming mock responses for Copilot and analysis suites, allowing safe testing even when offline.",
    },
    {
      q: "Which LLM providers are supported?",
      a: "We support 15+ LLM providers including Groq, Google Gemini, OpenAI, Anthropic Claude, OpenRouter, DeepSeek, Together AI, Fireworks, Perplexity, Mistral, Cohere, xAI, and local offline models via Ollama and LM Studio.",
    },
    {
      q: "Is my resume data stored securely?",
      a: "Yes. Career Agents operates with a local-first architecture. All files, portfolio syncs, and telemetry events are saved on your local SQLite storage unless configured otherwise. Dynamic checks are shielded against SSRF and directory traversal.",
    },
    {
      q: "What is the Model Context Protocol (MCP) server?",
      a: "Career Agents exports a native MCP Server mapping 31 specialized developer tools (e.g. search_agents, recommend_agents, resume_score, career_gap_analysis). This allows external LLM clients like Claude Desktop or Cursor to fetch career context directly.",
    },
    {
      q: "How does the GitHub Analyzer evaluate code quality?",
      a: "It scans commits, language configurations, README documentation density, and testing directories. It highlights test coverage gaps and compiles customized tech stacks to optimize developer portfolios.",
    },
    {
      q: "How do I contribute to the open source project?",
      a: "You can star our GitHub repository, read AGENTS.md contributor guidelines, run validation checklists, compile database maps, and make pull requests.",
    },
  ];

  const filteredFaqs = query
    ? faqs.filter(
        (f) =>
          f.q.toLowerCase().includes(query.toLowerCase()) ||
          f.a.toLowerCase().includes(query.toLowerCase())
      )
    : faqs;

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-4">
          <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Got Questions? We Have Answers
        </h2>
      </div>

      {/* Search Input */}
      <div className="relative mb-8 max-w-xl mx-auto">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions or topics..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 backdrop-blur-md"
        />
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className="rounded-2xl bg-[#090d18] border border-white/10 overflow-hidden backdrop-blur-xl transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white hover:text-cyan-300 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
