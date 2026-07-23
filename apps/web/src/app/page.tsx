"use client";

import React, { useState } from "react";

export default function Home() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState("dashboard");

  // Core metrics state (cached/saved simulation)
  const [metrics, setMetrics] = useState({
    careerScore: 68,
    resumeScore: 72,
    githubScore: 60,
    linkedinScore: 65,
    interviewReadiness: 55,
  });

  // Resume Upload State
  const [resumeText, setResumeText] = useState("");
  const [resumeReport, setResumeReport] = useState<any>(null);

  // GitHub username State
  const [githubUser, setGithubUser] = useState("");
  const [githubReport, setGithubReport] = useState<any>(null);

  // LinkedIn text State
  const [linkedinText, setLinkedinText] = useState("");
  const [linkedinReport, setLinkedinReport] = useState<any>(null);

  // Mock Interview Console State
  const [selectedCompany, setSelectedCompany] = useState("google");
  const [selectedMode, setSelectedMode] = useState("behavioral");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [interviewScore, setInterviewScore] = useState<number | null>(null);
  const [chatLog, setChatLog] = useState<Array<{ sender: string; text: string }>>([]);

  const mockQuestions: Record<string, Record<string, string[]>> = {
    google: {
      behavioral: [
        "Tell me about a time you solved a complex technical conflict with a coworker. What was your process?",
        "Give an example of a project where you took leadership outside your core task boundaries.",
      ],
      technical: [
        "Explain the runtime and memory complexity of building a heap vs a balanced BST.",
        "How does the V8 engine manage garbage collection, and how do you avoid latency spikes?",
      ]
    },
    stripe: {
      behavioral: [
        "Describe a time you built an API that had significant usability challenges. How did you iterate?",
      ],
      technical: [
        "How do you design idempotent API endpoints to prevent double-billing on retries?",
      ]
    }
  };

  // Run Resume analysis simulation
  const handleAnalyzeResume = () => {
    if (!resumeText) return;
    const words = resumeText.toLowerCase().split(/\s+/);
    const score = Math.min(98, Math.max(45, 50 + Math.round(words.length * 0.1)));
    
    const newReport = {
      overallScore: score,
      categoryScores: {
        experience: Math.min(100, score - 5),
        projects: Math.min(100, score + 10),
        skills: Math.min(100, score + 5),
        education: 100,
        formatting: 80
      },
      recommendations: [
        "Ensure every work experience bullet lists a quantifiable metric ($, %, counts).",
        "Add secondary technical skills keywords into your profile."
      ]
    };
    setResumeReport(newReport);
    setMetrics(prev => ({
      ...prev,
      resumeScore: score,
      careerScore: Math.round((score + prev.githubScore + prev.linkedinScore + prev.interviewReadiness) / 4)
    }));
  };

  // Run GitHub simulation
  const handleAnalyzeGithub = () => {
    if (!githubUser) return;
    const score = Math.min(95, Math.max(50, 55 + (githubUser.length * 2)));
    const newReport = {
      score,
      grade: score >= 85 ? "A" : score >= 70 ? "B" : "C",
      reposCount: 12,
      starsCount: Math.round(score * 0.8),
      languages: ["TypeScript", "JavaScript", "Python"],
      strengths: ["Clean README files mapped on primary repos.", "Solid coding activity in public repositories."],
      weaknesses: ["Low repository star count.", "Many forks lack custom documentation."]
    };
    setGithubReport(newReport);
    setMetrics(prev => ({
      ...prev,
      githubScore: score,
      careerScore: Math.round((prev.resumeScore + score + prev.linkedinScore + prev.interviewReadiness) / 4)
    }));
  };

  // Run LinkedIn simulation
  const handleAnalyzeLinkedin = () => {
    if (!linkedinText) return;
    const score = Math.min(95, Math.max(45, 50 + Math.round(linkedinText.length * 0.05)));
    const newReport = {
      score,
      suggestions: [
        "Format headline using pipes (|) to improve layout hierarchy.",
        "Expand summary description to outline your principal stacks."
      ],
      headlineRewrites: [
        "Software Engineer | React & TypeScript Developer | Delivering High-Performance User Interfaces",
        "Backend Specialist | Express & PG Node APIs | Scaling Cloud Operations"
      ]
    };
    setLinkedinReport(newReport);
    setMetrics(prev => ({
      ...prev,
      linkedinScore: score,
      careerScore: Math.round((prev.resumeScore + prev.githubScore + score + prev.interviewReadiness) / 4)
    }));
  };

  // Start Mock Interview Loop
  const startInterview = () => {
    const pool = mockQuestions[selectedCompany]?.[selectedMode] || mockQuestions.google.behavioral;
    setInterviewStarted(true);
    setCurrentQuestionIdx(0);
    setChatLog([{ sender: "system", text: `Welcome to your ${selectedCompany.toUpperCase()} mock interview. Let's begin.` }, { sender: "interviewer", text: pool[0] }]);
    setInterviewScore(null);
  };

  const submitAnswer = () => {
    if (!userAnswer) return;
    const pool = mockQuestions[selectedCompany]?.[selectedMode] || mockQuestions.google.behavioral;
    const newLog = [...chatLog, { sender: "user", text: userAnswer }];
    
    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < pool.length) {
      setCurrentQuestionIdx(nextIdx);
      newLog.push({ sender: "system", text: "Answer logged. Next question:" });
      newLog.push({ sender: "interviewer", text: pool[nextIdx] });
      setChatLog(newLog);
      setUserAnswer("");
    } else {
      const finalS = Math.round(65 + Math.random() * 25);
      newLog.push({ sender: "system", text: "Interview completed! Compiling scorecard report..." });
      setChatLog(newLog);
      setInterviewScore(finalS);
      setMetrics(prev => ({
        ...prev,
        interviewReadiness: finalS,
        careerScore: Math.round((prev.resumeScore + prev.githubScore + prev.linkedinScore + finalS) / 4)
      }));
      setInterviewStarted(false);
      setUserAnswer("");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#060913] text-slate-100 font-sans">
      {/* Sidebar navigation */}
      <aside className="w-64 bg-[#0a0f1d] border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl font-bold tracking-tight text-sky-400">CAREER OS</span>
            <span className="bg-sky-500/20 text-sky-400 text-xs px-2 py-0.5 rounded font-mono">v2.0.0</span>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition ${activeTab === "dashboard" ? "bg-sky-500/10 text-sky-400 font-medium" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
            >
              📊 Core Dashboard
            </button>
            <button
              onClick={() => setActiveTab("resume")}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition ${activeTab === "resume" ? "bg-sky-500/10 text-sky-400 font-medium" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
            >
              🧾 Resume Studio
            </button>
            <button
              onClick={() => setActiveTab("github")}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition ${activeTab === "github" ? "bg-sky-500/10 text-sky-400 font-medium" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
            >
              🖥️ GitHub Analyzer
            </button>
            <button
              onClick={() => setActiveTab("linkedin")}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition ${activeTab === "linkedin" ? "bg-sky-500/10 text-sky-400 font-medium" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
            >
              🤝 LinkedIn Auditor
            </button>
            <button
              onClick={() => setActiveTab("interview")}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition ${activeTab === "interview" ? "bg-sky-500/10 text-sky-400 font-medium" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
            >
              🗣️ Interview Coach
            </button>
          </nav>
        </div>

        <div className="text-xs text-slate-500 border-t border-slate-800/60 pt-4">
          Open-Source Product Platform
        </div>
      </aside>

      {/* Main content display */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Core Dashboard View */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">System Dashboard</h1>
                <p className="text-sm text-slate-400">Unified profile metrics monitoring and goals checklist.</p>
              </div>
              <div className="glass px-6 py-3 rounded-xl border border-slate-800 flex items-center gap-4">
                <span className="text-sm text-slate-400">Career Readiness Score</span>
                <span className="text-2xl font-black text-sky-400">{metrics.careerScore}%</span>
              </div>
            </header>

            {/* Visual Dials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Resume Score", value: metrics.resumeScore, icon: "🧾" },
                { title: "GitHub Grade", value: metrics.githubScore, icon: "🖥️" },
                { title: "LinkedIn Score", value: metrics.linkedinScore, icon: "🤝" },
                { title: "Interview Ready", value: metrics.interviewReadiness, icon: "🗣️" }
              ].map((item, idx) => (
                <div key={idx} className="glass p-5 rounded-xl border border-slate-800 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-2xl font-black text-slate-100">{item.value}%</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-400">{item.title}</h3>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div className="bg-sky-400 h-full rounded-full" style={{ width: `${item.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sub-sections layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-xl border border-slate-800 space-y-4">
                <h2 className="text-lg font-bold text-white">Active Preparation Roadmap</h2>
                <div className="space-y-3">
                  {[
                    { days: "Day 1-30", title: "Complete algorithmic complexity revisions and resume formatting." },
                    { days: "Day 31-60", title: "Develop mock API configurations and integrate database scripts." },
                    { days: "Day 61-90", title: "Perform weekly interactive interview mock loops." }
                  ].map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start p-3 bg-slate-900/40 border border-slate-800/40 rounded-lg">
                      <span className="bg-sky-500/10 text-sky-400 text-xs px-2.5 py-1 rounded font-mono font-bold whitespace-nowrap">{step.days}</span>
                      <p className="text-sm text-slate-300">{step.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass p-6 rounded-xl border border-slate-800 space-y-4">
                <h2 className="text-lg font-bold text-white">Weekly Targets checklist</h2>
                <div className="space-y-2">
                  {[
                    { id: 1, title: "Rewrite weak resume bullet points with metrics", done: true },
                    { id: 2, title: "Practice distributed cache questions", done: false },
                    { id: 3, title: "Optimize GitHub repositories readme headings", done: false }
                  ].map((goal, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-900/30 border border-slate-800/20 rounded-lg">
                      <input type="checkbox" checked={goal.done} readOnly className="accent-sky-500 h-4 w-4 rounded" />
                      <span className={`text-sm ${goal.done ? "line-through text-slate-500" : "text-slate-300"}`}>{goal.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resume Studio View */}
        {activeTab === "resume" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Resume Studio</h1>
              <p className="text-sm text-slate-400">Audit your formatting structures and score overall keyword density.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 glass p-6 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Paste Resume Content</h3>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste details of your experience, skills, and projects here..."
                  className="w-full h-80 bg-slate-900 border border-slate-800 rounded-lg p-4 text-sm text-slate-300 focus:outline-none focus:border-sky-500"
                />
                <button
                  onClick={handleAnalyzeResume}
                  className="bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm transition"
                >
                  Analyze Resume
                </button>
              </div>

              <div className="glass p-6 rounded-xl border border-slate-800 space-y-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Analysis Report card</h3>
                
                {resumeReport ? (
                  <div className="space-y-6">
                    <div className="text-center p-4 bg-slate-900/55 rounded-lg border border-slate-800">
                      <div className="text-3xl font-black text-sky-400">{resumeReport.overallScore}/100</div>
                      <div className="text-xs text-slate-500 mt-1">Overall ATS Index</div>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(resumeReport.categoryScores).map(([cat, score]: any) => (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span className="capitalize">{cat}</span>
                            <span>{score}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-sky-400 h-full" style={{ width: `${score}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 border-t border-slate-800 pt-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase">Recommendations:</h4>
                      {resumeReport.recommendations.map((rec: string, i: number) => (
                        <div key={i} className="text-xs text-slate-300 pl-3 border-l border-red-500">
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 text-center py-20">
                    Paste your resume details and trigger analysis to generate reports.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* GitHub Analyzer View */}
        {activeTab === "github" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">GitHub Portfolio Analyzer</h1>
              <p className="text-sm text-slate-400">Audit your repository templates, languages, stars, and readme outlines.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 glass p-6 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Configure username</h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value)}
                    placeholder="Enter GitHub username (e.g. karthikrshet)"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500"
                  />
                  <button
                    onClick={handleAnalyzeGithub}
                    className="bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm transition"
                  >
                    Analyze Username
                  </button>
                </div>
                
                {githubReport && (
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <h3 className="text-sm font-bold text-white">Ecosystem Strengths:</h3>
                    <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
                      {githubReport.strengths.map((str: string, i: number) => <li key={i}>{str}</li>)}
                    </ul>

                    <h3 className="text-sm font-bold text-white mt-4">Identified Weaknesses:</h3>
                    <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
                      {githubReport.weaknesses.map((w: string, i: number) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              <div className="glass p-6 rounded-xl border border-slate-800 space-y-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">GitHub Grading</h3>
                {githubReport ? (
                  <div className="space-y-6">
                    <div className="text-center p-4 bg-slate-900/55 rounded-lg border border-slate-800">
                      <div className="text-4xl font-black text-sky-400">{githubReport.grade}</div>
                      <div className="text-xs text-slate-500 mt-1">Portfolio Grade Index (Score: {githubReport.score})</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-slate-900/30 rounded border border-slate-850">
                        <div className="text-lg font-bold text-white">{githubReport.reposCount}</div>
                        <div className="text-[10px] text-slate-500">Repositories</div>
                      </div>
                      <div className="p-3 bg-slate-900/30 rounded border border-slate-850">
                        <div className="text-lg font-bold text-white">{githubReport.starsCount}</div>
                        <div className="text-[10px] text-slate-500">Total Stars</div>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-slate-800 pt-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase">Top Languages:</h4>
                      <div className="flex gap-2">
                        {githubReport.languages.map((l: string) => (
                          <span key={l} className="bg-sky-500/10 text-sky-400 text-xs px-2.5 py-1 rounded font-mono">{l}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 text-center py-20">
                    Input a username to fetch portfolio analysis.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* LinkedIn Auditor View */}
        {activeTab === "linkedin" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">LinkedIn profile Reviewer</h1>
              <p className="text-sm text-slate-400">Review tagline signaling hooks and About copy narrative structures.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 glass p-6 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Paste LinkedIn Summary / Headline</h3>
                <textarea
                  value={linkedinText}
                  onChange={(e) => setLinkedinText(e.target.value)}
                  placeholder="Paste your tagline description and About section content..."
                  className="w-full h-80 bg-slate-900 border border-slate-800 rounded-lg p-4 text-sm text-slate-300 focus:outline-none focus:border-sky-500"
                />
                <button
                  onClick={handleAnalyzeLinkedin}
                  className="bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm transition"
                >
                  Analyze Profile
                </button>
              </div>

              <div className="glass p-6 rounded-xl border border-slate-800 space-y-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Auditing suggestions</h3>
                {linkedinReport ? (
                  <div className="space-y-6">
                    <div className="text-center p-4 bg-slate-900/55 rounded-lg border border-slate-800">
                      <div className="text-3xl font-black text-sky-400">{linkedinReport.score}/100</div>
                      <div className="text-xs text-slate-500 mt-1">LinkedIn Score card</div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase">Suggested tagline rewrites:</h4>
                      {linkedinReport.headlineRewrites.map((h: string, idx: number) => (
                        <div key={idx} className="p-2.5 bg-slate-900/50 border border-slate-800 rounded text-xs text-sky-300">
                          {h}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 border-t border-slate-800 pt-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase">Suggested Improvements:</h4>
                      {linkedinReport.suggestions.map((s: string, i: number) => (
                        <div key={i} className="text-xs text-slate-300 pl-3 border-l border-red-500">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 text-center py-20">
                    Paste LinkedIn text segments to start review.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mock Interview Coach View */}
        {activeTab === "interview" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Mock Interview Engine</h1>
              <p className="text-sm text-slate-400">Interactive QA simulator calibrated for Tier-1 engineering requirements.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-xl border border-slate-800 space-y-4 h-fit">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Configure Session</h3>
                
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Target Company</label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    disabled={interviewStarted}
                    className="w-full bg-slate-900 border border-slate-850 rounded p-2 text-sm focus:outline-none"
                  >
                    <option value="google">Google</option>
                    <option value="stripe">Stripe</option>
                    <option value="amazon">Amazon</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Session Mode</label>
                  <select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    disabled={interviewStarted}
                    className="w-full bg-slate-900 border border-slate-850 rounded p-2 text-sm focus:outline-none"
                  >
                    <option value="behavioral">Behavioral (STAR)</option>
                    <option value="technical">Technical (Core Stacks)</option>
                  </select>
                </div>

                <button
                  onClick={startInterview}
                  disabled={interviewStarted}
                  className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold py-2.5 rounded-lg text-sm transition"
                >
                  Start Simulation
                </button>

                {interviewScore !== null && (
                  <div className="p-4 bg-slate-900 border border-slate-850 rounded-lg text-center mt-6">
                    <div className="text-3xl font-black text-sky-400">{interviewScore}%</div>
                    <div className="text-xs text-slate-500 mt-1">Interview Readiness Score</div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 glass rounded-xl border border-slate-800 overflow-hidden flex flex-col h-[500px]">
                <div className="bg-slate-900/80 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Simulator console</span>
                  {interviewStarted && (
                    <span className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded font-mono uppercase animate-pulse">Session Active</span>
                  )}
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-4 font-mono text-sm">
                  {chatLog.length === 0 ? (
                    <div className="text-slate-500 text-center py-24">
                      Select target options and configure session to start mock interview panels.
                    </div>
                  ) : (
                    chatLog.map((log, idx) => (
                      <div key={idx} className={`p-3 rounded-lg max-w-[85%] ${log.sender === "system" ? "bg-slate-850/30 text-sky-400 border border-sky-900/10" : log.sender === "interviewer" ? "bg-slate-900/80 text-sky-300 border border-slate-800" : "bg-sky-500/10 text-slate-200 border border-sky-500/20 ml-auto"}`}>
                        <div className="text-[10px] text-slate-500 mb-1 uppercase font-bold">{log.sender}</div>
                        <div>{log.text}</div>
                      </div>
                    ))
                  )}
                </div>

                {interviewStarted && (
                  <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-4">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                      placeholder="Type your response here..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded px-4 py-2 text-sm focus:outline-none focus:border-sky-500"
                    />
                    <button
                      onClick={submitAnswer}
                      className="bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold px-4 py-2 rounded text-sm transition"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
