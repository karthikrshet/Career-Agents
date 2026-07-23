"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState("dashboard");

  // Core profile metrics state (linked)
  const [metrics, setMetrics] = useState({
    careerScore: 62,
    resumeScore: 70,
    githubScore: 60,
    linkedinScore: 65,
    interviewReadiness: 55,
  });

  // Re-calculate Career Readiness Score whenever any child score changes
  useEffect(() => {
    const { resumeScore, githubScore, linkedinScore, interviewReadiness } = metrics;
    const avg = Math.round((resumeScore + githubScore + linkedinScore + interviewReadiness) / 4);
    setMetrics(prev => prev.careerScore !== avg ? { ...prev, careerScore: avg } : prev);
  }, [metrics]);

  // Resume State
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState<string | null>(null);
  const [resumeReport, setResumeReport] = useState<any>(null);

  // GitHub State
  const [githubUser, setGithubUser] = useState("");
  const [githubReport, setGithubReport] = useState<any>(null);

  // LinkedIn State
  const [linkedinText, setLinkedinText] = useState("");
  const [linkedinReport, setLinkedinReport] = useState<any>(null);

  // Mock Interview State
  const [selectedCompany, setSelectedCompany] = useState("google");
  const [selectedMode, setSelectedMode] = useState("behavioral");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Medium");
  const [selectedRound, setSelectedRound] = useState("Screening");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: string; text: string }>>([]);
  const [interviewScorecard, setInterviewScorecard] = useState<any>(null);
  const [codeContent, setCodeContent] = useState("// Write your technical solution here...\n");
  const [interviewTimer, setInterviewTimer] = useState(1800); // 30 minutes in seconds

  // Job Tracker State
  const [jobs, setJobs] = useState([
    { id: 1, company: "Google", role: "Software Engineer III", status: "Interview Scheduled", salary: "$165,000", location: "Mountain View, CA", notes: "DSA loop scheduled next Tuesday.", date: "2026-07-20" },
    { id: 2, company: "Stripe", role: "Frontend Architect", status: "OA Pending", salary: "$180,000", location: "Remote", notes: "Idempotent payment flow design task.", date: "2026-07-22" },
    { id: 3, company: "Meta", role: "Production Engineer", status: "Wishlist", salary: "$175,000", location: "Menlo Park, CA", notes: "Referral submitted via alumni.", date: "2026-07-23" }
  ]);
  const [newJob, setNewJob] = useState({ company: "", role: "", status: "Wishlist", salary: "", location: "", notes: "" });

  // Company Prep Checkmarks
  const [prepProgress, setPrepProgress] = useState({
    google: { dsa: true, systemDesign: false, behavioral: true, mock: false, resume: true },
    stripe: { dsa: false, systemDesign: true, behavioral: false, mock: false, resume: false }
  });

  // AI Copilot State
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotChat, setCopilotChat] = useState<Array<{ role: string; text: string }>>([
    { role: "assistant", text: "Hello! I am your Career Copilot. Ask me to review your resume, audit your GitHub, prepare for target interview loops, or generate roadmaps." }
  ]);

  // General lists
  const mockQuestions: Record<string, Record<string, string[]>> = {
    google: {
      behavioral: [
        "Tell me about a time you solved a complex technical conflict with a teammate.",
        "Give an example of a project where you took leadership outside your core boundaries."
      ],
      technical: [
        "How would you design a rate limiter for APIs handling 100k requests per second?",
        "Explain the runtime and memory complexity of building a heap vs a balanced BST."
      ]
    },
    stripe: {
      behavioral: [
        "Describe a time you built an API that had usability challenges. How did you iterate?"
      ],
      technical: [
        "How do you design idempotent API endpoints to prevent double-billing on retries?",
        "Design a globally distributed ledger system for multi-currency transactions."
      ]
    }
  };

  // Add job handler
  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.company || !newJob.role) return;
    setJobs(prev => [
      ...prev,
      {
        id: Date.now(),
        ...newJob,
        date: new Date().toISOString().split("T")[0]
      }
    ]);
    setNewJob({ company: "", role: "", status: "Wishlist", salary: "", location: "", notes: "" });
  };

  // Run Resume analysis simulation
  const handleAnalyzeResume = () => {
    if (!resumeText && !resumeFile) return;
    const wordCount = resumeText.split(/\s+/).filter(Boolean).length || 450;
    const score = Math.min(98, Math.max(45, 55 + Math.round(wordCount * 0.08)));
    
    const newReport = {
      overallScore: score,
      categoryScores: {
        experience: Math.min(100, score - 5),
        projects: Math.min(100, score + 10),
        skills: Math.min(100, score + 5),
        formatting: 85
      },
      weakBullets: [
        "Led frontend team to construct next-gen dashboards.",
        "Responsible for handling server database operations."
      ],
      suggestedRewrites: [
        "Designed and shipped visual frontend analytics dashboards, increasing user conversion metrics by 18%.",
        "Orchestrated PostgreSQL database migrations and query caching, reducing latency spikes by 35%."
      ],
      missingKeywords: ["Distributed Systems", "Idempotency", "Microservices", "Telemetry"],
      recommendedAgents: ["resume-formatting-specialist", "achievement-quantification-coach"]
    };

    setResumeReport(newReport);
    setMetrics(prev => ({ ...prev, resumeScore: score }));
  };

  // Run GitHub wrapped analysis simulation
  const handleAnalyzeGithub = () => {
    if (!githubUser) return;
    const score = Math.min(95, Math.max(50, 52 + (githubUser.length * 3)));
    const newReport = {
      score,
      followers: 42,
      reposCount: 18,
      starsCount: Math.round(score * 0.9),
      forksCount: Math.round(score * 0.2),
      languages: [
        { name: "TypeScript", percent: 65 },
        { name: "JavaScript", percent: 20 },
        { name: "Go", percent: 15 }
      ],
      pinnedProjects: [
        { name: "career-os-dashboard", stars: 12, quality: "Excellent" },
        { name: "mcp-stdio-adapter", stars: 8, quality: "Good" }
      ],
      readmeAnalysis: {
        grade: score >= 80 ? "High Quality" : "Needs Detail",
        strengths: ["Detailed installation step instructions.", "Lists active API reference keys."],
        weaknesses: ["Missing automated tests badges.", "Lacks clean contributing guidelines links."]
      },
      recommendations: [
        "Incorporate conventional commit styles to increase project trust indices.",
        "Add a clean architectural flow chart using Mermaid in your primary repositories README."
      ]
    };
    setGithubReport(newReport);
    setMetrics(prev => ({ ...prev, githubScore: score }));
  };

  // Run LinkedIn simulation
  const handleAnalyzeLinkedin = () => {
    if (!linkedinText) return;
    const score = Math.min(95, Math.max(45, 52 + Math.round(linkedinText.length * 0.04)));
    const newReport = {
      score,
      recruiterScore: Math.round(score * 0.95),
      visibilityIndex: score >= 80 ? "High Signaling" : "Moderate",
      suggestions: [
        "Format tagline narrative using pipes (|) to structure role specializations.",
        "Add key industry terms (e.g. Distributed Consensus, API Scaffolding) to summary hooks."
      ],
      headlineRewrites: [
        "Principal Software Architect | Go & TS microservices | Shipped cloud engines serving 200k daily users",
        "Full Stack Developer | Specialist in React visual dashboards | 35% latency reduction contributor"
      ],
      suggestedSkills: ["Distributed Consensus", "Telemetry logging", "API orchestration"]
    };
    setLinkedinReport(newReport);
    setMetrics(prev => ({ ...prev, linkedinScore: score }));
  };

  // Start Mock Interview Loop
  const startInterview = () => {
    const pool = mockQuestions[selectedCompany]?.[selectedMode] || mockQuestions.google.behavioral;
    setInterviewStarted(true);
    setCurrentQuestionIdx(0);
    setInterviewTimer(1800);
    setChatLog([
      { sender: "system", text: `Welcome to the ${selectedCompany.toUpperCase()} ${selectedRound} (${selectedDifficulty}) loop. Standby for initialization.` },
      { sender: "interviewer", text: pool[0] }
    ]);
    setInterviewScorecard(null);
  };

  const submitAnswer = () => {
    if (!userAnswer && selectedMode !== "technical") return;
    const pool = mockQuestions[selectedCompany]?.[selectedMode] || mockQuestions.google.behavioral;
    const nextIdx = currentQuestionIdx + 1;
    const newLog = [...chatLog];
    
    if (userAnswer) {
      newLog.push({ sender: "user", text: userAnswer });
    }
    if (selectedMode === "technical") {
      newLog.push({ sender: "system", text: `[Submitting Technical Code Solution: ${codeContent.substring(0, 40)}...]` });
    }

    if (nextIdx < pool.length) {
      setCurrentQuestionIdx(nextIdx);
      newLog.push({ sender: "interviewer", text: pool[nextIdx] });
      setChatLog(newLog);
      setUserAnswer("");
    } else {
      const score = Math.round(65 + Math.random() * 25);
      newLog.push({ sender: "system", text: "Interview completed! Scoring feedback card compiled." });
      setChatLog(newLog);
      
      const card = {
        score,
        metrics: {
          starStructure: score >= 80 ? "Strong STAR logic structure" : "Check STAR format",
          technicalPrecision: score >= 75 ? "Excellent algorithmic accuracy" : "Refine complexity metrics",
          communication: "Clear delivery, structured pace"
        },
        feedback: [
          "Be specific about project bounds and metric scales.",
          "Write Big-O complexity estimations explicitly before starting solution coding."
        ]
      };
      setInterviewScorecard(card);
      setMetrics(prev => ({ ...prev, interviewReadiness: score }));
      setInterviewStarted(false);
      setUserAnswer("");
    }
  };

  // Ask Copilot
  const handleAskCopilot = (customPrompt?: string) => {
    const query = customPrompt || copilotQuery;
    if (!query) return;
    const newChat = [...copilotChat, { role: "user", text: query }];
    setCopilotChat(newChat);
    setCopilotQuery("");

    setTimeout(() => {
      let response = "I have analyzed your request. I suggest running the 'career-agents list' or 'career-agents review' subcommands in the CLI for detailed outputs.";
      if (query.toLowerCase().includes("resume")) {
        response = "To optimize your resume: paste it in the Resume Studio tab or run `career-agents review resume.pdf` in your terminal. Ensure every bullet utilizes strong action verbs and quantifies scope.";
      } else if (query.toLowerCase().includes("github")) {
        response = "For GitHub analysis: use the GitHub Analyzer tab. I will audit your pinned repositories and README files to compute your public open-source readiness scorecard.";
      } else if (query.toLowerCase().includes("google")) {
        response = "To prepare for Google: toggle the Company Prep Hub to Google and check off core DSA paths. Then start a mock loop simulation here in the Interview Lab.";
      }
      setCopilotChat(prev => [...prev, { role: "assistant", text: response }]);
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-[#04060f] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-[#080d1a] border-r border-slate-800/80 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800/40">
            <svg className="w-8 h-8 text-sky-400" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" />
              <path d="M30 65 L45 40 L58 52 L72 30" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block">CAREER OS</span>
              <span className="text-xs text-sky-400 font-mono">Release v1.4.0</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition flex items-center gap-3 ${activeTab === "dashboard" ? "bg-sky-500/10 text-sky-400 font-medium" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
            >
              <span>📊</span> Core Dashboard
            </button>
            <button
              onClick={() => setActiveTab("resume")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition flex items-center gap-3 ${activeTab === "resume" ? "bg-sky-500/10 text-sky-400 font-medium" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
            >
              <span>🧾</span> Resume Studio Pro
            </button>
            <button
              onClick={() => setActiveTab("github")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition flex items-center gap-3 ${activeTab === "github" ? "bg-sky-500/10 text-sky-400 font-medium" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
            >
              <span>🖥️</span> GitHub Wrapped
            </button>
            <button
              onClick={() => setActiveTab("linkedin")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition flex items-center gap-3 ${activeTab === "linkedin" ? "bg-sky-500/10 text-sky-400 font-medium" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
            >
              <span>🤝</span> LinkedIn Optimizer
            </button>
            <button
              onClick={() => setActiveTab("interview")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition flex items-center gap-3 ${activeTab === "interview" ? "bg-sky-500/10 text-sky-400 font-medium" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
            >
              <span>🗣️</span> Interview Lab
            </button>
            <button
              onClick={() => setActiveTab("tracker")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition flex items-center gap-3 ${activeTab === "tracker" ? "bg-sky-500/10 text-sky-400 font-medium" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
            >
              <span>🎯</span> Job Tracker
            </button>
            <button
              onClick={() => setActiveTab("prephub")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition flex items-center gap-3 ${activeTab === "prephub" ? "bg-sky-500/10 text-sky-400 font-medium" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
            >
              <span>🏢</span> Company Prep Hub
            </button>
            <button
              onClick={() => setActiveTab("copilot")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition flex items-center gap-3 ${activeTab === "copilot" ? "bg-sky-500/10 text-sky-400 font-medium" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
            >
              <span>🤖</span> Career Copilot AI
            </button>
            <button
              onClick={() => setActiveTab("plugins")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition flex items-center gap-3 ${activeTab === "plugins" ? "bg-sky-500/10 text-sky-400 font-medium" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
            >
              <span>🔌</span> Marketplace
            </button>
            <button
              onClick={() => setActiveTab("mcp")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition flex items-center gap-3 ${activeTab === "mcp" ? "bg-sky-500/10 text-sky-400 font-medium" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
            >
              <span>⚙️</span> MCP Integrations
            </button>
          </nav>
        </div>

        <div className="text-xs text-slate-500 border-t border-slate-850 pt-4 font-mono">
          Ecosystem Product Console
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* TAB 1: CORE DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <header className="flex justify-between items-center pb-4 border-b border-slate-900">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">Career Readiness Command</h1>
                <p className="text-sm text-slate-400">Linked profile indices audits, pipeline targets, and progress checklist diagnostics.</p>
              </div>
              <div className="glass px-6 py-3.5 rounded-xl border border-slate-850 flex items-center gap-4 bg-slate-900/50">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Readiness Index</span>
                <span className="text-3xl font-black text-sky-400">{metrics.careerScore}%</span>
              </div>
            </header>

            {/* Core Metrics Dials */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Resume Score", value: metrics.resumeScore, desc: "ATS formatting & content audits", icon: "🧾" },
                { title: "GitHub Wrapped", value: metrics.githubScore, desc: "Pinned repo and readme checks", icon: "🖥️" },
                { title: "LinkedIn Score", value: metrics.linkedinScore, desc: "Headline and tagline audits", icon: "🤝" },
                { title: "Interview Ready", value: metrics.interviewReadiness, desc: "STAR behavioral loops checks", icon: "🗣️" }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#090f1e] p-5 rounded-xl border border-slate-850/80 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xl font-bold text-slate-100">{item.value}%</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-200">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                  <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div className="bg-sky-400 h-full rounded-full transition-all duration-500" style={{ width: `${item.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pipeline and Goals Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Active Pipeline Status */}
              <div className="lg:col-span-2 bg-[#090f1e]/80 p-6 rounded-xl border border-slate-850 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white">Active Vacancies Funnel</h2>
                  <button onClick={() => setActiveTab("tracker")} className="text-xs text-sky-400 hover:underline">View Tracker</button>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { label: "Wishlist", count: jobs.filter(j => j.status === "Wishlist").length, color: "bg-slate-700/20 text-slate-400" },
                    { label: "OA Pending", count: jobs.filter(j => j.status === "OA Pending").length, color: "bg-amber-500/10 text-amber-400" },
                    { label: "Interview", count: jobs.filter(j => j.status === "Interview Scheduled").length, color: "bg-sky-500/10 text-sky-400" },
                    { label: "Offers", count: jobs.filter(j => j.status === "Offer").length, color: "bg-green-500/10 text-green-400" },
                    { label: "Rejected", count: jobs.filter(j => j.status === "Rejected").length, color: "bg-red-500/10 text-red-400" }
                  ].map((pipe, idx) => (
                    <div key={idx} className={`p-4 rounded-lg text-center ${pipe.color} border border-slate-850/50`}>
                      <span className="block text-2xl font-black">{pipe.count}</span>
                      <span className="text-xxs uppercase tracking-wider block mt-1 font-mono">{pipe.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly checklist */}
              <div className="bg-[#090f1e]/80 p-6 rounded-xl border border-slate-850 space-y-4">
                <h2 className="text-lg font-bold text-white">Weekly Goals Checklist</h2>
                <div className="space-y-2">
                  {[
                    { title: "Rewrite weak resume bullet points with metrics", done: resumeReport !== null },
                    { title: "Audit public GitHub repository counts", done: githubReport !== null },
                    { title: "Analyze tagline keywords density", done: linkedinReport !== null },
                    { title: "Practice distributed cache interview loop", done: interviewScorecard !== null }
                  ].map((goal, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-950/40 border border-slate-850/50 rounded-lg">
                      <input type="checkbox" checked={goal.done} readOnly className="accent-sky-500 h-4 w-4 rounded" />
                      <span className={`text-xs ${goal.done ? "line-through text-slate-500" : "text-slate-300"}`}>{goal.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preparation Tracks & Recent Reports */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Target prep track details */}
              <div className="bg-[#090f1e]/80 p-6 rounded-xl border border-slate-850 space-y-4">
                <h2 className="text-lg font-bold text-white">Target Company Progress</h2>
                <div className="space-y-3">
                  {[
                    { company: "Google Prep Track", done: Object.values(prepProgress.google).filter(Boolean).length, total: 5 },
                    { company: "Stripe Prep Track", done: Object.values(prepProgress.stripe).filter(Boolean).length, total: 5 }
                  ].map((track, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/30 rounded-lg border border-slate-850/40">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-bold text-slate-200">{track.company}</span>
                        <span className="font-mono text-sky-400">{track.done}/{track.total} Modules Clear</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-sky-500 h-full rounded-full" style={{ width: `${(track.done / track.total) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reports Center */}
              <div className="bg-[#090f1e]/80 p-6 rounded-xl border border-slate-850 space-y-4">
                <h2 className="text-lg font-bold text-white">Recent Artifact Reports</h2>
                <div className="space-y-2">
                  {resumeReport && (
                    <div className="flex justify-between items-center p-3 bg-slate-950/20 border border-slate-850/50 rounded-lg text-xs">
                      <span>🧾 Resume Score Audit: {resumeReport.overallScore}%</span>
                      <button onClick={() => setActiveTab("resume")} className="text-sky-400 hover:underline">Review</button>
                    </div>
                  )}
                  {githubReport && (
                    <div className="flex justify-between items-center p-3 bg-slate-950/20 border border-slate-850/50 rounded-lg text-xs">
                      <span>🖥️ GitHub Wrapped Grade: {githubReport.grade}</span>
                      <button onClick={() => setActiveTab("github")} className="text-sky-400 hover:underline">Review</button>
                    </div>
                  )}
                  {interviewScorecard && (
                    <div className="flex justify-between items-center p-3 bg-slate-950/20 border border-slate-850/50 rounded-lg text-xs">
                      <span>🗣️ Mock Score Card: {interviewScorecard.score}/100</span>
                      <button onClick={() => setActiveTab("interview")} className="text-sky-400 hover:underline">Review</button>
                    </div>
                  )}
                  {!resumeReport && !githubReport && !interviewScorecard && (
                    <p className="text-xs text-slate-500 text-center py-4">No reports generated yet. Run audits in the specialty tabs.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: RESUME STUDIO PRO */}
        {activeTab === "resume" && (
          <div className="space-y-6">
            <header>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Resume Studio Pro</h1>
              <p className="text-sm text-slate-400">Validate formatting structures, audit weak bullets, and download ATS reports.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Input Section */}
              <div className="lg:col-span-2 bg-[#090f1e] p-6 rounded-xl border border-slate-850 space-y-4">
                <h3 className="text-md font-bold text-white">Upload and Parse</h3>
                
                {/* Simulated Drag & Drop Zone */}
                <div className="border-2 border-dashed border-slate-850 rounded-xl p-8 text-center bg-slate-950/30 hover:border-sky-500/50 transition cursor-pointer">
                  <span>📄</span>
                  <p className="text-sm text-slate-300 mt-2">Drag & Drop your PDF, DOCX, or TXT resume here</p>
                  <p className="text-xs text-slate-500 mt-1">Maximum file size: 5MB</p>
                  <input type="file" onChange={(e) => setResumeFile(e.target.files?.[0]?.name || "resume.pdf")} className="hidden" id="fileUpload" />
                  <label htmlFor="fileUpload" className="mt-4 inline-block bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs px-4 py-2 rounded-lg border border-sky-500/30 transition">Select File</label>
                  {resumeFile && <p className="text-xs text-green-400 mt-2">Target selected: {resumeFile}</p>}
                </div>

                <div className="text-center text-xs text-slate-500">OR PASTE RAW RESUME TEXT</div>

                <textarea
                  className="w-full h-48 bg-slate-950/60 border border-slate-850 rounded-lg p-4 text-xs font-mono text-slate-300 focus:outline-none focus:border-sky-500"
                  placeholder="Paste complete copy of your resume here to run full bullet analysis..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />

                <button
                  onClick={handleAnalyzeResume}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-bold transition"
                >
                  Analyze Resume Compatibility
                </button>
              </div>

              {/* Scorer and Reports Output Panel */}
              <div className="bg-[#090f1e] p-6 rounded-xl border border-slate-850 space-y-6">
                <h3 className="text-md font-bold text-white">Compatibility Scorecard</h3>
                
                {resumeReport ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <span className="text-5xl font-black text-sky-400">{resumeReport.overallScore}%</span>
                      <span className="block text-xs text-slate-400 mt-2">Overall ATS compatibility rating</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Experience Metrics</span>
                        <span>{resumeReport.categoryScores.experience}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Projects Quantification</span>
                        <span>{resumeReport.categoryScores.projects}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Technical Skills</span>
                        <span>{resumeReport.categoryScores.skills}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>ATS Formatting Rules</span>
                        <span>{resumeReport.categoryScores.formatting}%</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-850 pt-4 space-y-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase">Recommended Agents</h4>
                      <div className="flex flex-wrap gap-2">
                        {resumeReport.recommendedAgents.map((agent: string, idx: number) => (
                          <span key={idx} className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xxs px-2.5 py-1 rounded font-mono">{agent}</span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-850 pt-4 space-y-2">
                      <h4 className="text-xs font-bold text-slate-300 uppercase">Export Report</h4>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                        <button className="bg-slate-900/60 p-2 rounded hover:bg-slate-800 text-sky-400 border border-slate-850">JSON</button>
                        <button className="bg-slate-900/60 p-2 rounded hover:bg-slate-800 text-sky-400 border border-slate-850">HTML</button>
                        <button className="bg-slate-900/60 p-2 rounded hover:bg-slate-800 text-sky-400 border border-slate-850">Markdown</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-12">Submit resume copy to compile audit scorecard metrics.</p>
                )}
              </div>

            </div>

            {/* Bullet analysis details */}
            {resumeReport && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#090f1e] p-6 rounded-xl border border-slate-850 space-y-4">
                  <h3 className="text-md font-bold text-red-400">Detected Weak Bullet Accomplishments</h3>
                  <ul className="space-y-3 text-xs text-slate-300 list-disc list-inside">
                    {resumeReport.weakBullets.map((bullet: string, idx: number) => (
                      <li key={idx} className="p-2 bg-red-500/5 rounded border border-red-500/10">{bullet}</li>
                    ))}
                  </ul>
                  
                  <h3 className="text-md font-bold text-slate-300 pt-4">Missing Keywords Signaling</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeReport.missingKeywords.map((kw: string, idx: number) => (
                      <span key={idx} className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2.5 py-1 rounded font-mono">{kw}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#090f1e] p-6 rounded-xl border border-slate-850 space-y-4">
                  <h3 className="text-md font-bold text-green-400">Suggested Action-Verb Rewrites</h3>
                  <ul className="space-y-3 text-xs text-slate-300 list-disc list-inside">
                    {resumeReport.suggestedRewrites.map((suggested: string, idx: number) => (
                      <li key={idx} className="p-2 bg-green-500/5 rounded border border-green-500/10">{suggested}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GITHUB WRAPPED */}
        {activeTab === "github" && (
          <div className="space-y-6">
            <header>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">GitHub Portfolio Analyzer</h1>
              <p className="text-sm text-slate-400">Audit repository metrics, pinned code configurations, and README signaling.</p>
            </header>

            <div className="bg-[#090f1e] p-6 rounded-xl border border-slate-850 space-y-4 max-w-xl">
              <h3 className="text-md font-bold text-white">Select User Profile</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Enter GitHub Username (e.g. karthikrshet)"
                  className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-sky-500"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                />
                <button
                  onClick={handleAnalyzeGithub}
                  className="bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold px-6 py-2.5 rounded-lg transition"
                >
                  Analyze
                </button>
              </div>
            </div>

            {githubReport && (
              <div className="space-y-6">
                {/* Top overview grids */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-[#0b132b] p-5 rounded-xl border border-slate-850 text-center">
                    <span className="text-3xl font-black text-sky-400">{githubReport.score}%</span>
                    <span className="block text-xs text-slate-400 uppercase mt-2">Portfolio Grade</span>
                  </div>
                  <div className="bg-[#090f1e] p-5 rounded-xl border border-slate-850 text-center">
                    <span className="text-3xl font-black text-indigo-400">{githubReport.starsCount}</span>
                    <span className="block text-xs text-slate-400 uppercase mt-2">Traction Stars</span>
                  </div>
                  <div className="bg-[#090f1e] p-5 rounded-xl border border-slate-850 text-center">
                    <span className="text-3xl font-black text-indigo-400">{githubReport.reposCount}</span>
                    <span className="block text-xs text-slate-400 uppercase mt-2">Repositories Count</span>
                  </div>
                  <div className="bg-[#090f1e] p-5 rounded-xl border border-slate-850 text-center">
                    <span className="text-3xl font-black text-indigo-400">{githubReport.followers}</span>
                    <span className="block text-xs text-slate-400 uppercase mt-2">Followers</span>
                  </div>
                </div>

                {/* Languages and Grid Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Pinned Projects & Language Stack */}
                  <div className="lg:col-span-2 bg-[#090f1e] p-6 rounded-xl border border-slate-850 space-y-4">
                    <h3 className="text-md font-bold text-white">Pinned Repositories Audit</h3>
                    <div className="space-y-3">
                      {githubReport.pinnedProjects.map((proj: any, idx: number) => (
                        <div key={idx} className="p-4 bg-slate-950/30 rounded-lg border border-slate-850/60 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-slate-200 block">{proj.name}</span>
                            <span className="text-slate-500 font-mono">Stars: {proj.stars}</span>
                          </div>
                          <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-bold uppercase text-xxs font-mono">{proj.quality}</span>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-md font-bold text-white pt-4">Contribution Heatmap Map</h3>
                    {/* Simulated Github Contribution Grid */}
                    <div className="flex flex-wrap gap-1 p-2 bg-slate-950/20 rounded border border-slate-850/50">
                      {Array.from({ length: 96 }).map((_, i) => {
                        const colors = ["bg-slate-900", "bg-emerald-950", "bg-emerald-800", "bg-emerald-500", "bg-emerald-300"];
                        const roll = Math.floor(Math.random() * 5);
                        return <div key={i} className={`w-3.5 h-3.5 rounded-sm ${colors[roll]}`} />;
                      })}
                    </div>
                  </div>

                  {/* README audits & Recommendations */}
                  <div className="bg-[#090f1e] p-6 rounded-xl border border-slate-850 space-y-6">
                    <div>
                      <h3 className="text-md font-bold text-white">README Quality Rating</h3>
                      <span className="inline-block bg-sky-500/10 text-sky-400 border border-sky-500/30 px-3 py-1 rounded font-bold text-xs uppercase font-mono mt-2">{githubReport.readmeAnalysis.grade}</span>
                    </div>

                    <div className="space-y-2 border-t border-slate-850 pt-4 text-xs">
                      <h4 className="font-bold text-slate-300">Signaling Strengths</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-400">
                        {githubReport.readmeAnalysis.strengths.map((str: string, idx: number) => (
                          <li key={idx}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 border-t border-slate-850 pt-4 text-xs">
                      <h4 className="font-bold text-slate-300">Target Recommendations</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-400">
                        {githubReport.recommendations.map((rec: string, idx: number) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: LINKEDIN OPTIMIZER */}
        {activeTab === "linkedin" && (
          <div className="space-y-6">
            <header>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">LinkedIn Profile Optimizer</h1>
              <p className="text-sm text-slate-400">Audit tagline keywords density, summary narrative copy, and recruiter search visibility indexes.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Input Area */}
              <div className="lg:col-span-2 bg-[#090f1e] p-6 rounded-xl border border-slate-850 space-y-4">
                <h3 className="text-md font-bold text-white">Profile Headline and Summary Content</h3>
                <textarea
                  className="w-full h-56 bg-slate-950/60 border border-slate-850 rounded-lg p-4 text-xs font-mono text-slate-300 focus:outline-none focus:border-sky-500"
                  placeholder="Paste your active LinkedIn headline and 'About' summary narrative here..."
                  value={linkedinText}
                  onChange={(e) => setLinkedinText(e.target.value)}
                />
                <button
                  onClick={handleAnalyzeLinkedin}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-bold transition"
                >
                  Audit Recruiter Search Signaling
                </button>
              </div>

              {/* Audit score outputs */}
              <div className="bg-[#090f1e] p-6 rounded-xl border border-slate-850 space-y-6">
                <h3 className="text-md font-bold text-white">Recruiter Signaling Metrics</h3>
                
                {linkedinReport ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <span className="text-5xl font-black text-sky-400">{linkedinReport.score}%</span>
                      <span className="block text-xs text-slate-400 mt-2">Overall profile hook score</span>
                    </div>

                    <div className="space-y-3 text-xs font-mono">
                      <div className="flex justify-between border-b border-slate-850 pb-2">
                        <span>Recruiter Score</span>
                        <span>{linkedinReport.recruiterScore}/100</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-850 pb-2">
                        <span>Visibility Index</span>
                        <span className="text-green-400 font-bold uppercase">{linkedinReport.visibilityIndex}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-300 uppercase">Suggested Skills Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {linkedinReport.suggestedSkills.map((sk: string, idx: number) => (
                          <span key={idx} className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xxs px-2.5 py-1 rounded font-mono">{sk}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-12">Submit copy text to evaluate search visibility indexes.</p>
                )}
              </div>

            </div>

            {/* Rewrites list suggestions */}
            {linkedinReport && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#090f1e] p-6 rounded-xl border border-slate-850 space-y-4">
                  <h3 className="text-md font-bold text-white">Layout and Tagline Suggestions</h3>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-2">
                    {linkedinReport.suggestions.map((s: string, idx: number) => (
                      <li key={idx} className="p-2 bg-slate-950/20 rounded border border-slate-850">{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#090f1e] p-6 rounded-xl border border-slate-850 space-y-4">
                  <h3 className="text-md font-bold text-white">Suggested Headline Rewrite Formats</h3>
                  <div className="space-y-3">
                    {linkedinReport.headlineRewrites.map((r: string, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-950/30 rounded border border-slate-850/60 text-xs font-mono text-slate-300 relative">
                        <p>{r}</p>
                        <button className="absolute right-2 bottom-2 text-xxs text-sky-400 hover:underline">Copy Form</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: INTERVIEW LAB */}
        {activeTab === "interview" && (
          <div className="space-y-6">
            <header>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Interactive Mock Interview Lab</h1>
              <p className="text-sm text-slate-400">Launch context-aware loops, code on system boards, and score response structures.</p>
            </header>

            {!interviewStarted ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Configuration panel */}
                <div className="md:col-span-2 bg-[#090f1e] p-6 rounded-xl border border-slate-850 space-y-6">
                  <h3 className="text-md font-bold text-white">Configure Interview Loop</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-2 uppercase">Target Company</label>
                      <select
                        className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-slate-300 focus:outline-none focus:border-sky-500"
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                      >
                        <option value="google">Google</option>
                        <option value="stripe">Stripe</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-2 uppercase">Interview Mode</label>
                      <select
                        className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-slate-300 focus:outline-none focus:border-sky-500"
                        value={selectedMode}
                        onChange={(e) => setSelectedMode(e.target.value)}
                      >
                        <option value="behavioral">Behavioral (STAR)</option>
                        <option value="technical">Technical (Coding)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-2 uppercase">Difficulty</label>
                      <select
                        className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-slate-300"
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-2 uppercase">Round Stage</label>
                      <select
                        className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-slate-300"
                        value={selectedRound}
                        onChange={(e) => setSelectedRound(e.target.value)}
                      >
                        <option value="Screening">Initial Screening</option>
                        <option value="Onsite">Onsite Technical Loop</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={startInterview}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold rounded-lg transition"
                  >
                    Start Simulated Loop
                  </button>
                </div>

                {/* Scorecard history */}
                <div className="bg-[#090f1e] p-6 rounded-xl border border-slate-850 space-y-4">
                  <h3 className="text-md font-bold text-white">Session Scorecard</h3>
                  {interviewScorecard ? (
                    <div className="space-y-4">
                      <div className="text-center py-4 border-b border-slate-850">
                        <span className="text-4xl font-black text-sky-400">{interviewScorecard.score}/100</span>
                        <span className="block text-xs text-slate-400 mt-1">STAR alignment rating</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <p><strong className="text-slate-300">Methodology:</strong> {interviewScorecard.metrics.starStructure}</p>
                        <p><strong className="text-slate-300">Accuracy:</strong> {interviewScorecard.metrics.technicalPrecision}</p>
                        <p><strong className="text-slate-300">Delivery:</strong> {interviewScorecard.metrics.communication}</p>
                      </div>
                      <div className="border-t border-slate-850 pt-3 text-xs">
                        <strong className="block text-red-400 uppercase mb-1">Constructive Gaps:</strong>
                        <ul className="list-disc list-inside text-slate-400 space-y-1">
                          {interviewScorecard.feedback.map((fb: string, i: number) => (
                            <li key={i}>{fb}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-12">Complete interview loop session to view scoring reports.</p>
                  )}
                </div>

              </div>
            ) : (
              // Active interview loops UI
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Dialogue console */}
                <div className="bg-[#090f1e] p-6 rounded-xl border border-slate-850 flex flex-col justify-between h-[500px]">
                  <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                    <div className="flex justify-between items-center text-xs font-mono text-slate-500 border-b border-slate-850 pb-2">
                      <span>Loop: {selectedCompany.toUpperCase()} ({selectedMode.toUpperCase()})</span>
                      <span className="text-sky-400">Timer: {Math.floor(interviewTimer / 60)}:{(interviewTimer % 60).toString().padStart(2, "0")}</span>
                    </div>

                    <div className="space-y-3">
                      {chatLog.map((log, idx) => (
                        <div key={idx} className={`p-3 rounded-lg text-xs ${log.sender === "user" ? "bg-sky-500/10 border border-sky-500/20 text-slate-200 self-end ml-12" : log.sender === "system" ? "bg-slate-950 text-slate-500 text-center font-mono" : "bg-slate-900 border border-slate-850 text-slate-300 mr-12"}`}>
                          <strong className="block text-xxs uppercase text-sky-400 tracking-wider mb-1">{log.sender}</strong>
                          <p>{log.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-850 flex gap-3">
                    <input
                      type="text"
                      className="flex-1 bg-slate-950 border border-slate-850 rounded px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      placeholder="Type response code or behavioral response structure here..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                    />
                    <button
                      onClick={submitAnswer}
                      className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-6 py-2 rounded transition"
                    >
                      Submit
                    </button>
                  </div>
                </div>

                {/* Technical loop Code Editor panel (if mode is technical) */}
                <div className="bg-[#090f1e] p-6 rounded-xl border border-slate-850 flex flex-col justify-between h-[500px]">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-2 text-xs text-slate-400">
                    <span>Integrated Coding Console</span>
                    <span className="font-mono text-xxs">Language: JavaScript (ES6)</span>
                  </div>

                  <textarea
                    className="flex-1 w-full bg-slate-950 font-mono text-xs text-emerald-400 p-4 border border-slate-850 rounded mt-3 focus:outline-none"
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    disabled={selectedMode !== "technical"}
                  />

                  <div className="pt-3 border-t border-slate-850 flex justify-end gap-2">
                    <button className="bg-slate-900 text-slate-400 border border-slate-850 text-xs px-4 py-1.5 rounded hover:bg-slate-800 transition">Reset Board</button>
                    <button className="bg-sky-600/20 text-sky-400 border border-sky-500/30 text-xs px-4 py-1.5 rounded hover:bg-sky-500/10 transition">Verify Lint</button>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 6: JOB TRACKER */}
        {activeTab === "tracker" && (
          <div className="space-y-6">
            <header>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Job Application Tracker</h1>
              <p className="text-sm text-slate-400">Maintain records of targets, pending online assessments, technical stages, and salary details.</p>
            </header>

            {/* Add Job Form */}
            <form onSubmit={handleAddJob} className="bg-[#090f1e] p-6 rounded-xl border border-slate-850 grid grid-cols-1 md:grid-cols-6 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block text-slate-400 mb-1">Company Name</label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-slate-200"
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  placeholder="Stripe"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-400 mb-1">Role Title</label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-slate-200"
                  value={newJob.role}
                  onChange={(e) => setNewJob({ ...newJob, role: e.target.value })}
                  placeholder="Frontend Architect"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Status</label>
                <select
                  className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-slate-200"
                  value={newJob.status}
                  onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
                >
                  <option value="Wishlist">Wishlist</option>
                  <option value="OA Pending">OA Pending</option>
                  <option value="Interview Scheduled">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded transition">Add Target</button>
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-400 mb-1">Salary Estimate</label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-slate-200"
                  value={newJob.salary}
                  onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                  placeholder="$165,000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-slate-200"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  placeholder="Remote"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-400 mb-1">Target Notes</label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-slate-200"
                  value={newJob.notes}
                  onChange={(e) => setNewJob({ ...newJob, notes: e.target.value })}
                  placeholder="Referral submitted."
                />
              </div>
            </form>

            {/* Jobs Table list */}
            <div className="bg-[#090f1e] rounded-xl border border-slate-850 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-850 text-slate-400 uppercase font-mono tracking-wider">
                    <th className="p-4">Company</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Salary</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Notes</th>
                    <th className="p-4">Added Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60">
                  {jobs.map(job => (
                    <tr key={job.id} className="hover:bg-slate-900/35 transition">
                      <td className="p-4 font-bold text-slate-200">{job.company}</td>
                      <td className="p-4 text-slate-300">{job.role}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold font-mono text-xxs ${job.status === "Interview Scheduled" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : job.status === "OA Pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : job.status === "Offer" ? "bg-green-500/10 text-green-400 border border-green-500/20" : job.status === "Rejected" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-slate-850 text-slate-400"}`}>{job.status}</span>
                      </td>
                      <td className="p-4 text-slate-300 font-mono">{job.salary || "N/A"}</td>
                      <td className="p-4 text-slate-300">{job.location || "N/A"}</td>
                      <td className="p-4 text-slate-400">{job.notes}</td>
                      <td className="p-4 text-slate-500 font-mono">{job.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 7: COMPANY PREP HUB */}
        {activeTab === "prephub" && (
          <div className="space-y-6">
            <header>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Company Preparation Hub</h1>
              <p className="text-sm text-slate-400">Target loop tracks, review pre-mapped DSA patterns, system design architectures, and behavioral templates.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Google Track */}
              <div className="bg-[#090f1e] p-6 rounded-xl border border-slate-850 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                  <h3 className="text-lg font-bold text-white">Google preparation track</h3>
                  <span className="bg-sky-500/10 text-sky-400 text-xs px-2 py-0.5 rounded font-mono font-bold">Tier 1 Target</span>
                </div>
                
                <div className="space-y-3">
                  {[
                    { key: "resume", label: "Optimized Resume for Google keywords" },
                    { key: "dsa", label: "DSA algorithms complexity patterns (BST, graphs)" },
                    { key: "systemDesign", label: "Scalable global system architecture" },
                    { key: "behavioral", label: "Googliness values STAR answers check" },
                    { key: "mock", label: "Clear Google mock screening session" }
                  ].map((mod, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-950/20 rounded border border-slate-850/60 text-xs">
                      <span>{mod.label}</span>
                      <input
                        type="checkbox"
                        checked={(prepProgress.google as any)[mod.key]}
                        onChange={(e) => setPrepProgress({
                          ...prepProgress,
                          google: { ...prepProgress.google, [mod.key]: e.target.checked }
                        })}
                        className="accent-sky-500 h-4.5 w-4.5 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Stripe Track */}
              <div className="bg-[#090f1e] p-6 rounded-xl border border-slate-850 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                  <h3 className="text-lg font-bold text-white">Stripe preparation track</h3>
                  <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-0.5 rounded font-mono font-bold">Fintech Target</span>
                </div>

                <div className="space-y-3">
                  {[
                    { key: "resume", label: "Optimized Resume for Stripe API keywords" },
                    { key: "dsa", label: "Transaction concurrent ledger design algorithms" },
                    { key: "systemDesign", label: "Idempotent payment endpoints schemas" },
                    { key: "behavioral", label: "STAR alignment for API usability loops" },
                    { key: "mock", label: "Clear Stripe mock session" }
                  ].map((mod, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-950/20 rounded border border-slate-850/60 text-xs">
                      <span>{mod.label}</span>
                      <input
                        type="checkbox"
                        checked={(prepProgress.stripe as any)[mod.key]}
                        onChange={(e) => setPrepProgress({
                          ...prepProgress,
                          stripe: { ...prepProgress.stripe, [mod.key]: e.target.checked }
                        })}
                        className="accent-indigo-500 h-4.5 w-4.5 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 8: CAREER COPILOT AI CHAT */}
        {activeTab === "copilot" && (
          <div className="space-y-6">
            <header>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Career Copilot AI Console</h1>
              <p className="text-sm text-slate-400">Ask questions, request resume bullets review, formulate prep roadmaps, or fetch recommended agent indices.</p>
            </header>

            <div className="bg-[#090f1e] rounded-xl border border-slate-850 flex flex-col justify-between h-[520px]">
              
              {/* Dialogue Log */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {copilotChat.map((msg, idx) => (
                  <div key={idx} className={`p-4 rounded-xl text-xs max-w-2xl ${msg.role === "user" ? "bg-sky-500/10 border border-sky-500/25 ml-auto text-slate-200" : "bg-slate-900 border border-slate-850 text-slate-300"}`}>
                    <strong className="block uppercase text-xxs text-sky-400 tracking-wider mb-1">{msg.role}</strong>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Input section & Shortcut triggers */}
              <div className="p-4 border-t border-slate-850 space-y-3 bg-slate-950/20">
                <div className="flex gap-2 text-xxs font-mono">
                  <button onClick={() => handleAskCopilot("Review my resume")} className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-sky-400 px-3 py-1.5 rounded transition">Review Resume</button>
                  <button onClick={() => handleAskCopilot("Audit my GitHub profile")} className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-sky-400 px-3 py-1.5 rounded transition">Audit GitHub</button>
                  <button onClick={() => handleAskCopilot("Prepare me for Google")} className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-sky-400 px-3 py-1.5 rounded transition">Google Roadmap</button>
                  <button onClick={() => handleAskCopilot("Optimize LinkedIn headline")} className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-sky-400 px-3 py-1.5 rounded transition">Headline Rewrite</button>
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                    placeholder="Ask Career Copilot to review files, target loops, or retrieve roadmap checklists..."
                    value={copilotQuery}
                    onChange={(e) => setCopilotQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAskCopilot()}
                  />
                  <button
                    onClick={() => handleAskCopilot()}
                    className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-6 py-2.5 rounded-lg transition"
                  >
                    Send
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 9: MARKETPLACE */}
        {activeTab === "plugins" && (
          <div className="space-y-6">
            <header>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Plugin Marketplace</h1>
              <p className="text-sm text-slate-400">Discover and extend terminal-based commands hooks and diagnostic modules.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "sample-plugin", desc: "Basic command extensions hello handler.", status: "Active", author: "Core" },
                { name: "salary-estimator", desc: "Grades target location ranges for swe roles.", status: "Install", author: "Community" },
                { name: "jira-exporter", desc: "Binds sprint task list checks into weekly goals.", status: "Install", author: "Community" }
              ].map((plug, idx) => (
                <div key={idx} className="bg-[#090f1e] p-5 rounded-xl border border-slate-850 flex flex-col justify-between h-40">
                  <div>
                    <div className="flex justify-between items-center text-xs border-b border-slate-850 pb-2">
                      <span className="font-bold text-slate-200 font-mono">{plug.name}</span>
                      <span className="text-slate-500">By {plug.author}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">{plug.desc}</p>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button className={`text-xs px-4 py-1.5 rounded font-bold transition border ${plug.status === "Active" ? "bg-sky-500/10 text-sky-400 border-sky-500/30" : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"}`}>{plug.status}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: MCP CONFIGS */}
        {activeTab === "mcp" && (
          <div className="space-y-6">
            <header>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Model Context Protocol Integrations</h1>
              <p className="text-sm text-slate-400">Connect the Career OS stdio server interface with Cursor, Claude Desktop, and IDE environments.</p>
            </header>

            <div className="bg-[#090f1e] p-6 rounded-xl border border-slate-850 space-y-6 max-w-3xl">
              
              <div>
                <h3 className="text-md font-bold text-white mb-2">1. Claude Desktop Setup</h3>
                <p className="text-xs text-slate-400 mb-3">Add the server object configuration under `%APPDATA%/Claude/claude_desktop_config.json`:</p>
                <pre className="bg-slate-950 p-4 rounded border border-slate-850 text-xxs font-mono text-emerald-400">
{`{
  "mcpServers": {
    "career-agents": {
      "command": "npx",
      "args": ["-y", "career-agents", "mcp"]
    }
  }
}`}
                </pre>
              </div>

              <div className="border-t border-slate-850 pt-4">
                <h3 className="text-md font-bold text-white mb-2">2. Cursor Configuration</h3>
                <p className="text-xs text-slate-400 mb-3">Go to Settings &rarr; Features &rarr; MCP &rarr; Add New MCP Server:</p>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 font-mono">
                  <li><strong>Name:</strong> career-agents</li>
                  <li><strong>Type:</strong> stdio</li>
                  <li><strong>Command:</strong> npx -y career-agents mcp</li>
                </ul>
              </div>

              <div className="border-t border-slate-850 pt-4">
                <h3 className="text-md font-bold text-white mb-2">3. Windsurf Integration</h3>
                <p className="text-xs text-slate-400 mb-3">Configure standard stdio transport inside `~/.codeium/windsurf/mcp_config.json`:</p>
                <pre className="bg-slate-950 p-4 rounded border border-slate-850 text-xxs font-mono text-emerald-400">
{`{
  "mcpServers": {
    "career-agents": {
      "command": "npx",
      "args": ["-y", "career-agents", "mcp"]
    }
  }
}`}
                </pre>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
