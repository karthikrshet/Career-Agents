// apps/web/src/app/docs/page.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, BookOpen, Terminal, Code, Settings, Cpu, Shield, Globe } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const DOCS_SECTIONS = [
  {
    id: "install",
    label: "Installation",
    icon: Terminal,
    content: (
      <div className="space-y-4 text-xs text-slate-400">
        <p>Ensure you have Node.js version 18+ installed on your system. Run these commands inside your local environment:</p>
        <pre className="bg-slate-950 border border-slate-900 p-4 rounded-xl text-[10px] text-indigo-300 font-mono overflow-x-auto leading-relaxed">
          {`# Clone repository\ngit clone https://github.com/karthikrshet/Career-Agents.git\ncd Career-Agents\n\n# Install project packages\nnpm install`}
        </pre>
      </div>
    )
  },
  {
    id: "setup",
    label: "Quick Start",
    icon: Code,
    content: (
      <div className="space-y-4 text-xs text-slate-400">
        <p>Populate your root `.env` file with target API keys. Copy the example configuration block:</p>
        <pre className="bg-slate-950 border border-slate-900 p-4 rounded-xl text-[10px] text-indigo-300 font-mono overflow-x-auto leading-relaxed">
          {`# Standard provider configurations\nGEMINI_API_KEY="your-key-here"\nOPENAI_API_KEY="your-key-here"\n\n# Database connection\nDATABASE_URL="postgresql://postgres:postgres@localhost:5432/career_agents"`}
        </pre>
        <p>Run the mapping compiler to build search indexes:</p>
        <pre className="bg-slate-950 border border-slate-900 p-4 rounded-xl text-[10px] text-indigo-300 font-mono overflow-x-auto leading-relaxed">
          {`python scripts/generate-data.py\npython scripts/validate.py`}
        </pre>
      </div>
    )
  },
  {
    id: "mcp",
    label: "MCP Integration",
    icon: Cpu,
    content: (
      <div className="space-y-4 text-xs text-slate-400">
        <p>Expose tools to cursor, cline, or standard Claude desktop configurations. Add this server definition to your `claude_desktop_config.json`:</p>
        <pre className="bg-slate-950 border border-slate-900 p-4 rounded-xl text-[10px] text-indigo-300 font-mono overflow-x-auto leading-relaxed">
          {`"mcpServers": {\n  "career-agents": {\n    "command": "node",\n    "args": ["d:/CodeMyFYP-Agents/mcp/server.js"]\n  }\n}`}
        </pre>
        <p>Verify integration by running the local tests: `node scripts/test-mcp.js`.</p>
      </div>
    )
  },
  {
    id: "env",
    label: "Environment Variables",
    icon: Settings,
    content: (
      <div className="space-y-4 text-xs text-slate-400">
        <table className="w-full text-left border-collapse border border-slate-900 text-[10px]">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-900 text-slate-200">
              <th className="p-2 border-r border-slate-900">Variable</th>
              <th className="p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-900">
              <td className="p-2 font-mono border-r border-slate-900 text-indigo-400">DATABASE_URL</td>
              <td className="p-2">PostgreSQL connection string.</td>
            </tr>
            <tr className="border-b border-slate-900">
              <td className="p-2 font-mono border-r border-slate-900 text-indigo-400">NEXTAUTH_SECRET</td>
              <td className="p-2">Secret token to sign NextAuth session cookies.</td>
            </tr>
            <tr className="border-b border-slate-900">
              <td className="p-2 font-mono border-r border-slate-900 text-indigo-400">GEMINI_API_KEY</td>
              <td className="p-2">Google Gemini API key.</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("install");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative py-20">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-white transition mb-12">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to landing
        </Link>

        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Documentation Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Developer APIs, setup scripts, environment variables, and MCP configurations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-1 bg-slate-950 border border-slate-900 p-4 rounded-xl h-fit">
            {DOCS_SECTIONS.map(sec => (
              <button
                key={sec.id}
                onClick={() => setActiveTab(sec.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-left transition",
                  activeTab === sec.id
                    ? "bg-indigo-600/10 text-indigo-400"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                )}
              >
                <sec.icon className="w-4 h-4 shrink-0" />
                {sec.label}
              </button>
            ))}
          </div>

          <div className="md:col-span-3 border border-slate-900 bg-slate-950/40 p-8 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">
              {DOCS_SECTIONS.find(s => s.id === activeTab)?.label}
            </h3>
            {DOCS_SECTIONS.find(s => s.id === activeTab)?.content}
          </div>
        </div>
      </div>
    </div>
  );
}
