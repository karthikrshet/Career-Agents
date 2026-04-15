"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Terminal, Shield, Cpu, Database, Play, 
  CheckCircle, ChevronDown, ChevronRight, FileText, 
  ArrowRight, Key, Server
} from "lucide-react";

interface EndpointInfo {
  method: "GET" | "POST";
  path: string;
  description: string;
  authRequired: boolean;
  requestBody?: string;
  responseBody: string;
  curlExample: string;
}

const ENDPOINTS: EndpointInfo[] = [
  {
    method: "POST",
    path: "/api/copilot",
    description: "Streams AI response tokens using Server-Sent Events (SSE). Automatically routes user queries to matched registry agents.",
    authRequired: false,
    requestBody: `{
  "messages": [
    { "role": "user", "content": "Review my resume for a Google SWE role." }
  ],
  "config": {
    "provider": "groq",
    "model": "llama-3.3-70b-versatile"
  },
  "context": {
    "profile": { "name": "Jane Doe", "targetRole": "SWE" }
  }
}`,
    responseBody: `event: message
data: {"choices": [{"delta": {"content": "Let's review..."}}]}

event: message
data: [DONE]`,
    curlExample: `curl -X POST http://localhost:3000/api/copilot \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"Hi"}]}'`
  },
  {
    method: "POST",
    path: "/api/interview",
    description: "Generates tailored interview questions or evaluates answers using the STAR method.",
    authRequired: false,
    requestBody: `{
  "action": "generate",
  "company": "Google",
  "role": "Software Engineer",
  "mode": "behavioral"
}`,
    responseBody: `{
  "questions": [
    { "id": "q1", "text": "Tell me about a time you solved a hard problem." }
  ]
}`,
    curlExample: `curl -X POST http://localhost:3000/api/interview \\
  -H "Content-Type: application/json" \\
  -d '{"action":"generate","company":"Google"}'`
  },
  {
    method: "POST",
    path: "/api/resume/analyze",
    description: "Analyzes uploaded resume text, checking for section integrity, keywords, and weak action verbs.",
    authRequired: false,
    requestBody: `{
  "text": "Jane Doe... Experience: Spearheaded api migration..."
}`,
    responseBody: `{
  "atsScore": 82,
  "weakBullets": [
    { "original": "helped build page", "suggested": "Orchestrated page design" }
  ],
  "missingKeywords": ["Kubernetes", "CI/CD"]
}`,
    curlExample: `curl -X POST http://localhost:3000/api/resume/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Jane Doe resume text..."}'`
  },
  {
    method: "POST",
    path: "/api/github/analyze",
    description: "Fetches user metrics, repo counts, star weights, and language profiles from the GitHub REST API.",
    authRequired: false,
    requestBody: `{
  "username": "karthikrshet"
}`,
    responseBody: `{
  "username": "karthikrshet",
  "portfolioScore": 88,
  "publicRepos": 42,
  "languages": [{ "name": "TypeScript", "percent": 75 }]
}`,
    curlExample: `curl -X POST http://localhost:3000/api/github/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"username":"karthikrshet"}'`
  },
  {
    method: "POST",
    path: "/api/linkedin/analyze",
    description: "Optimizes LinkedIn profile headline copy, about summary, and calculates recruiter visibility index.",
    authRequired: false,
    requestBody: `{
  "profile": { "headline": "SWE at Google" }
}`,
    responseBody: `{
  "overallScore": 75,
  "visibilityIndex": 80,
  "recommendations": ["Add specialization keywords"]
}`,
    curlExample: `curl -X POST http://localhost:3000/api/linkedin/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"profile":{"headline":"SWE"}}'`
  },
  {
    method: "POST",
    path: "/api/reports/generate",
    description: "Compiles complete career analysis reports and generates PDF, HTML, Word, or Excel download streams.",
    authRequired: false,
    requestBody: `{
  "format": "pdf",
  "data": { "careerScore": 85 }
}`,
    responseBody: `[Binary PDF Buffer stream]`,
    curlExample: `curl -X POST http://localhost:3000/api/reports/generate \\
  -H "Content-Type: application/json" \\
  -d '{"format":"pdf","data":{}}'`
  },
  {
    method: "POST",
    path: "/api/parse-file",
    description: "Parses uploaded PDF, DOCX, TXT, ODT, or RTF document file parameters into plain text.",
    authRequired: false,
    requestBody: `[multipart/form-data payload with file field]`,
    responseBody: `{
  "text": "Extracted text content...",
  "fileName": "resume.pdf",
  "wordCount": 420
}`,
    curlExample: `curl -X POST -F "file=@resume.pdf" http://localhost:3000/api/parse-file`
  },
  {
    method: "POST",
    path: "/api/parse-file/url",
    description: "Downloads and parses a resume file hosted on a public URL.",
    authRequired: false,
    requestBody: `{
  "url": "https://example.com/resume.pdf"
}`,
    responseBody: `{
  "text": "Parsed text content..."
}`,
    curlExample: `curl -X POST http://localhost:3000/api/parse-file/url \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com/resume.pdf"}'`
  },
  {
    method: "POST",
    path: "/api/providers/test",
    description: "Verifies connection latency and credential parameters for the configured AI provider.",
    authRequired: false,
    requestBody: `{
  "provider": "groq",
  "apiKey": "gsk_..."
}`,
    responseBody: `{
  "success": true,
  "latencyMs": 140
}`,
    curlExample: `curl -X POST http://localhost:3000/api/providers/test \\
  -H "Content-Type: application/json" \\
  -d '{"provider":"groq","apiKey":"gsk_..."}'`
  },
  {
    method: "GET",
    path: "/api/profile",
    description: "Retrieves the authenticated user session profile info from NextAuth.",
    authRequired: true,
    responseBody: `{
  "user": { "name": "Jane", "email": "jane@example.com" }
}`,
    curlExample: `curl -X GET http://localhost:3000/api/profile`
  }
];

export default function APIDocsPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col h-full bg-[#05070f] text-foreground overflow-auto">
      {/* Header */}
      <div className="border-b border-border/80 bg-card/60 backdrop-blur-md px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Server className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">OpenAPI Documentation</h1>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                v3.0.0
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Complete REST API specification and developer endpoints for Career Agents
            </p>
          </div>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
          >
            Back to Dashboard <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Info Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0b0e17] rounded-xl border border-border/80 p-6 space-y-4">
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Authentication
            </h2>
            <div className="flex gap-3">
              <Key className="h-5 w-5 text-yellow-500 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Most AI-powered routes authenticate using keys passed inside the request payload body, preserving local guest privacy. GET endpoints use standard NextAuth session cookies.
              </p>
            </div>
          </div>

          <div className="bg-[#0b0e17] rounded-xl border border-border/80 p-6 space-y-4">
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Global Headers
            </h2>
            <div className="space-y-3">
              <div className="flex items-start justify-between text-xs border-b border-border/60 pb-2">
                <span className="font-mono text-muted-foreground">Content-Type</span>
                <span className="font-mono text-foreground">application/json</span>
              </div>
              <div className="flex items-start justify-between text-xs">
                <span className="font-mono text-muted-foreground">Accept</span>
                <span className="font-mono text-foreground">application/json</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0b0e17] rounded-xl border border-border/80 p-6 space-y-4">
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Rate Limits
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Standard API routes enforce a rate limit window of **60 requests per minute** per IP client. When exceeded, the system responds with a `429 Too Many Requests` code.
            </p>
          </div>
        </div>

        {/* Endpoints List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold tracking-tight mb-4">Endpoints Catalog</h2>
          {ENDPOINTS.map((ep, idx) => {
            const isExpanded = expandedIndex === idx;
            const isPost = ep.method === "POST";

            return (
              <div 
                key={ep.path} 
                className="bg-[#0b0e17] border border-border/80 rounded-xl overflow-hidden transition-all duration-200"
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-card/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                      isPost 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {ep.path}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {ep.authRequired && (
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-red-500/10 text-red-400 border border-red-500/20">
                        Auth Required
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="border-t border-border/80 p-6 space-y-5 bg-[#070911]/60">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {ep.description}
                    </p>

                    {ep.requestBody && (
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-muted-foreground">Request Payload Schema</span>
                        <pre className="p-4 rounded-lg bg-[#03050a] border border-border/60 text-xs font-mono overflow-auto max-h-48 text-emerald-400">
                          {ep.requestBody}
                        </pre>
                      </div>
                    )}

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-muted-foreground">Response Schema</span>
                      <pre className="p-4 rounded-lg bg-[#03050a] border border-border/60 text-xs font-mono overflow-auto max-h-48 text-blue-400">
                        {ep.responseBody}
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-muted-foreground">cURL Example</span>
                      <pre className="p-4 rounded-lg bg-[#03050a] border border-border/60 text-xs font-mono overflow-auto text-yellow-400">
                        {ep.curlExample}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
