import React, { useEffect, useState } from "react";
import {
  Search, Mic, MicOff, Copy, Check, Sparkles, Code2,
  Settings, Bot, Zap, Share2, BookOpen, Send, CheckCircle,
  AlertCircle, ArrowRight, ExternalLink, RefreshCw, FileText,
  UserCheck, ShieldCheck, Target, Plus, Download, Mail
} from "lucide-react";
import { getPreferences, savePreferences, StoragePreferences } from "../storage";
import {
  JobDetails,
  CodeReviewPayload,
  LinkedInProfilePayload,
  GitHubRepoPayload,
  AutofillProfile,
} from "../messaging/types";
import {
  generateSwarmDeliberation,
  generateJobTailoring,
  generateCodeComplexityProfile,
  generateLinkedInPost,
  generateGitHubCaseStudy,
  generateShortAnswerEssay,
} from "../services/api";

export function Sidepanel() {
  const [activeTab, setActiveTab] = useState<
    "live-interview" | "ats-tailor" | "code-profiler" | "linkedin" | "github" | "autofill" | "settings"
  >("live-interview");

  const [activeHost, setActiveHost] = useState("webpage");
  const [profile, setProfile] = useState<Partial<StoragePreferences>>({});

  // 1. Live Interview State
  const [liveQuestion, setLiveQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [generatingSwarm, setGeneratingSwarm] = useState(false);
  const [swarmResult, setSwarmResult] = useState<any>(null);

  // 2. ATS Job Matcher & Tailor State
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [tailorResult, setTailorResult] = useState<any>(null);
  const [tailoring, setTailoring] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 3. LeetCode / Big-O Profiler State
  const [codePayload, setCodePayload] = useState<CodeReviewPayload | null>(null);
  const [codeProfilerResult, setCodeProfilerResult] = useState<any>(null);
  const [profilingCode, setProfilingCode] = useState(false);

  // 4. LinkedIn Post & Inbound Magnet State
  const [postType, setPostType] = useState<"scaling" | "outage" | "transition">("scaling");
  const [generatedPost, setGeneratedPost] = useState("");
  const [generatingPost, setGeneratingPost] = useState(false);

  // 5. GitHub Case Study State
  const [githubRepo, setGithubRepo] = useState<GitHubRepoPayload | null>(null);
  const [caseStudyText, setCaseStudyText] = useState("");
  const [generatingCaseStudy, setGeneratingCaseStudy] = useState(false);

  // 6. Autofill & Short Answer State
  const [customPrompt, setCustomPrompt] = useState("");
  const [draftedAnswer, setDraftedAnswer] = useState("");
  const [autofilling, setAutofilling] = useState(false);
  const [autofillSuccessCount, setAutofillSuccessCount] = useState<number | null>(null);

  // 7. Settings State
  const [workspaceUrl, setWorkspaceUrl] = useState("http://localhost:3000");
  const [apiProvider, setApiProvider] = useState("groq");
  const [apiKey, setApiKey] = useState("");
  const [savedSettings, setSavedSettings] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        const url = tabs[0].url;
        let hostname = "";
        try {
          hostname = new URL(url).hostname.toLowerCase().replace("www.", "");
        } catch {}
        setActiveHost(hostname || "webpage");
      }
    });

    getPreferences().then((res) => {
      setProfile(res);
      if (res.workspaceUrl) setWorkspaceUrl(res.workspaceUrl);
      if (res.apiProvider) setApiProvider(res.apiProvider);
      if (res.apiKey) setApiKey(res.apiKey);
    });

    // Auto extract metadata from current page
    handleExtractFromPage();
  }, []);

  function handleExtractFromPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]?.id) return;
      const tabId = tabs[0].id;

      // Try Job Extract
      chrome.tabs.sendMessage(tabId, { type: "EXTRACT_JOB_REQUEST" }, (response) => {
        if (response && response.payload && response.payload.title) {
          setJobDetails(response.payload);
        }
      });

      // Try Code Problem Extract
      chrome.tabs.sendMessage(tabId, { type: "EXTRACT_CODE_PROBLEM_REQUEST" }, (response) => {
        if (response && response.payload && response.payload.problemText) {
          setCodePayload(response.payload);
        }
      });

      // Try GitHub Extract
      chrome.tabs.sendMessage(tabId, { type: "EXTRACT_GITHUB_REPO_REQUEST" }, (response) => {
        if (response && response.payload && response.payload.name) {
          setGithubRepo(response.payload);
        }
      });
    });
  }

  // Live Speech Recognition Toggle
  function toggleVoiceListening() {
    if (isListening) {
      setIsListening(false);
      return;
    }
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRec = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setLiveQuestion(transcript.trim());
        }
      };

      rec.onstart = () => setIsListening(true);
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      rec.start();
    } else {
      alert("Speech recognition not supported in this browser window.");
    }
  }

  async function handleRunSwarm() {
    if (!liveQuestion.trim()) return;
    setGeneratingSwarm(true);
    const result = await generateSwarmDeliberation(
      liveQuestion,
      jobDetails?.company || "Target Company",
      jobDetails?.title || "Senior Software Engineer"
    );
    setSwarmResult(result);
    setGeneratingSwarm(false);
  }

  async function handleRunJobTailor() {
    setTailoring(true);
    const title = jobDetails?.title || "Senior Software Engineer";
    const company = jobDetails?.company || "Target Company";
    const text = jobDetails?.text || "High throughput distributed systems and cloud infrastructure.";
    const result = await generateJobTailoring(title, company, text, profile.primarySkills);
    setTailorResult(result);
    setTailoring(false);
  }

  async function handleRunCodeProfiler() {
    setProfilingCode(true);
    const code = codePayload?.codeSnippet || "def solve(nums):\n  return []";
    const lang = codePayload?.language || "python";
    const result = await generateCodeComplexityProfile(code, lang);
    setCodeProfilerResult(result);
    setProfilingCode(false);
  }

  async function handleGeneratePost() {
    setGeneratingPost(true);
    const text = await generateLinkedInPost(postType);
    setGeneratedPost(text);
    setGeneratingPost(false);
  }

  async function handleGenerateCaseStudy() {
    setGeneratingCaseStudy(true);
    const name = githubRepo?.name || "Career-Agents";
    const desc = githubRepo?.description || "Open Source Career Intelligence OS";
    const lang = githubRepo?.language || "TypeScript";
    const text = await generateGitHubCaseStudy(name, desc, lang);
    setCaseStudyText(text);
    setGeneratingCaseStudy(false);
  }

  function handleAutofillForm() {
    setAutofilling(true);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]?.id) return;
      const autofillPayload: AutofillProfile = {
        firstName: profile.firstName || "Alex",
        lastName: profile.lastName || "Morgan",
        fullName: `${profile.firstName || "Alex"} ${profile.lastName || "Morgan"}`,
        email: profile.email || "alex.morgan@example.com",
        phone: profile.phone || "+1 (555) 234-5678",
        linkedin: profile.linkedin || "linkedin.com/in/alex-morgan",
        github: profile.github || "github.com/alex-morgan",
        portfolio: profile.portfolio || "https://alexmorgan.dev",
        location: profile.location || "San Francisco, CA",
        primarySkills: profile.primarySkills || "TypeScript, React, PostgreSQL, Docker, AWS",
      };

      chrome.tabs.sendMessage(
        tabs[0].id,
        { type: "AUTOFILL_FORM_REQUEST", payload: autofillPayload },
        (res) => {
          setAutofilling(false);
          if (res && res.payload) {
            setAutofillSuccessCount(res.payload.filledCount || 0);
          }
        }
      );
    });
  }

  async function handleDraftShortAnswer() {
    if (!customPrompt.trim()) return;
    const answer = await generateShortAnswerEssay(customPrompt, jobDetails?.company || "Target Company");
    setDraftedAnswer(answer);
  }

  async function handleSaveSettings() {
    await savePreferences({ workspaceUrl, apiProvider, apiKey });
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  }

  function handleCopy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#070b14] text-slate-100 font-sans text-xs select-none">
      {/* Top Header Bar */}
      <div className="p-3 bg-slate-900 border-b border-border/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-white text-xs">Career Agents Copilot</h1>
            <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[150px]">
              🌐 {activeHost}
            </p>
          </div>
        </div>

        <button
          onClick={handleExtractFromPage}
          title="Refresh Page Extraction"
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-1 p-2 bg-[#0a0f1d] border-b border-border/40 overflow-x-auto shrink-0">
        {[
          { id: "live-interview" as const, label: "🎙️ Interview", title: "Live Interview Swarm" },
          { id: "ats-tailor" as const, label: "🎯 ATS Tailor", title: "Job Scanner & Tailor" },
          { id: "code-profiler" as const, label: "⚡ Big-O", title: "LeetCode Big-O Profiler" },
          { id: "linkedin" as const, label: "💼 LinkedIn", title: "Viral Post Creator" },
          { id: "github" as const, label: "🐙 GitHub", title: "Repo Case Study" },
          { id: "autofill" as const, label: "📝 Autofill", title: "Application Form Autofill" },
          { id: "settings" as const, label: "⚙️ Setup", title: "Extension Settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.title}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold shrink-0 transition-all border ${
              activeTab === tab.id
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Tab Content Panels */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* TAB 1: LIVE INTERVIEW SWARM */}
        {activeTab === "live-interview" && (
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-xs">Live Interview Swarm Copilot</p>
                <p className="text-[10px] text-muted-foreground">Voice listening & Bar Raiser consensus</p>
              </div>
              <button
                onClick={toggleVoiceListening}
                className={`p-2 rounded-xl border flex items-center gap-1 text-[10px] font-bold transition-all ${
                  isListening
                    ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
                    : "bg-slate-800 text-slate-300 border-border/60 hover:text-white"
                }`}
              >
                {isListening ? <Mic className="w-3.5 h-3.5 text-red-400" /> : <MicOff className="w-3.5 h-3.5" />}
                <span>{isListening ? "Listening..." : "Mic"}</span>
              </button>
            </div>

            <textarea
              className="w-full h-20 p-2.5 rounded-xl bg-slate-900 border border-border/60 text-xs text-white resize-none focus:outline-none focus:ring-1 focus:ring-cyan-400 leading-relaxed"
              placeholder="Paste or speak live interview question (e.g. 'Tell me about a time you optimized database latency')..."
              value={liveQuestion}
              onChange={(e) => setLiveQuestion(e.target.value)}
            />

            <button
              onClick={handleRunSwarm}
              disabled={generatingSwarm || !liveQuestion.trim()}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{generatingSwarm ? "Deliberating..." : "Deliberate Swarm & Generate STAR"}</span>
            </button>

            {swarmResult && (
              <div className="space-y-2.5 pt-1">
                {/* Swarm Deliberation Summary */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white">Panel Consensus Verdict</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px] border border-emerald-500/30">
                      {swarmResult.recommendation} ({swarmResult.consensusScore}%)
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {swarmResult.personas.map((p: any, i: number) => (
                      <div key={i} className="p-2 rounded-lg bg-black/40 border border-border/30 text-[10.5px]">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{p.name}</span>
                          <span className="text-emerald-400 font-mono">{p.score}%</span>
                        </div>
                        <p className="text-muted-foreground mt-0.5 leading-tight">{p.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STAR Structured Response */}
                <div className="p-3 rounded-xl bg-black/60 border border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-cyan-300">STAR Response (45-sec Verbal Pitch)</span>
                    <button
                      onClick={() => handleCopy(swarmResult.starAnswer, "star")}
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === "star" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === "star" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/90 font-sans text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
                    {swarmResult.starAnswer}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ATS SCANNER & 1-CLICK TAILOR */}
        {activeTab === "ats-tailor" && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-border/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs truncate max-w-[200px]">
                  {jobDetails?.title || "Active Job Posting"}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                  {jobDetails?.company || "Target Co"}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{jobDetails?.location || "Detected on active tab"}</p>
            </div>

            <button
              onClick={handleRunJobTailor}
              disabled={tailoring}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{tailoring ? "Analyzing ATS & Keywords..." : "1-Click ATS Tailor Application"}</span>
            </button>

            {tailorResult && (
              <div className="space-y-3 pt-1">
                {/* Match score & keywords */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">ATS Match Score</span>
                    <span className="text-emerald-400 font-bold font-mono text-sm">{tailorResult.matchScore}%</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Matched Keywords</p>
                    <div className="flex flex-wrap gap-1">
                      {tailorResult.matchedKeywords.map((kw: string) => (
                        <span key={kw} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                          ✓ {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Google XYZ Bullets */}
                <div className="p-3 rounded-xl bg-black/60 border border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 text-[11px]">Tailored Google XYZ Bullets</span>
                    <button
                      onClick={() => handleCopy(tailorResult.tailoredBullets.join("\n"), "bullets")}
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === "bullets" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Bullets</span>
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {tailorResult.tailoredBullets.map((b: string, i: number) => (
                      <p key={i} className="p-2 rounded-lg bg-slate-900 text-xs font-mono text-slate-200 leading-relaxed">
                        • {b}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="p-3 rounded-xl bg-black/60 border border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-[11px]">Custom 3-Paragraph Cover Letter</span>
                    <button
                      onClick={() => handleCopy(tailorResult.coverLetter, "cl")}
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === "cl" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Letter</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                    {tailorResult.coverLetter}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LEETCODE / BIG-O PROFILER */}
        {activeTab === "code-profiler" && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-border/60 space-y-1">
              <span className="font-bold text-white text-xs truncate block">
                {codePayload?.title || "LeetCode / Algorithmic Problem"}
              </span>
              <p className="text-[10px] text-muted-foreground font-mono">{codePayload?.language || "Python / TypeScript"}</p>
            </div>

            <button
              onClick={handleRunCodeProfiler}
              disabled={profilingCode}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{profilingCode ? "Profiling Complexity..." : "Profile Time & Space Complexity"}</span>
            </button>

            {codeProfilerResult && (
              <div className="space-y-2.5 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-border/60">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground">Time Complexity</p>
                    <p className="text-xs font-bold font-mono text-cyan-400 mt-0.5">{codeProfilerResult.timeComplexity}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-border/60">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground">Space Complexity</p>
                    <p className="text-xs font-bold font-mono text-purple-400 mt-0.5">{codeProfilerResult.spaceComplexity}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-border/60 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Critical Edge Cases</p>
                  {codeProfilerResult.edgeCases.map((ec: any, i: number) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-900 text-[10.5px]">
                      <span className="font-bold text-slate-200">{ec.name}</span>
                      <p className="text-cyan-300 font-mono text-[10px]">Input: {ec.input}</p>
                      <p className="text-muted-foreground">{ec.behavior}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-border/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Optimal Solution</span>
                    <button
                      onClick={() => handleCopy(codeProfilerResult.optimalCode, "optimal_code")}
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === "optimal_code" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-slate-900 text-[11px] font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                    {codeProfilerResult.optimalCode}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: LINKEDIN VIRAL POST GENERATOR */}
        {activeTab === "linkedin" && (
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-border/60">
              <p className="font-bold text-white text-xs">LinkedIn Thought-Leadership Generator</p>
              <p className="text-[10px] text-muted-foreground">Inbound recruiter magnet posts</p>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "scaling" as const, label: "⚡ Scaling" },
                { id: "outage" as const, label: "🛠️ Outage" },
                { id: "transition" as const, label: "💡 Mindset" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setPostType(t.id)}
                  className={`py-1.5 rounded-lg text-[10px] font-semibold border ${
                    postType === t.id ? "bg-cyan-500/20 text-cyan-300 border-cyan-400" : "bg-slate-900 border-border text-slate-400"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleGeneratePost}
              disabled={generatingPost}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{generatingPost ? "Drafting Viral Post..." : "Generate LinkedIn Post"}</span>
            </button>

            {generatedPost && (
              <div className="p-3 rounded-xl bg-black/60 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-200">Generated Post</span>
                  <button
                    onClick={() => handleCopy(generatedPost, "li_post")}
                    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === "li_post" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Post</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-all max-h-48 overflow-y-auto">
                  {generatedPost}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: GITHUB ARCHITECTURE CASE STUDY */}
        {activeTab === "github" && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-border/60 space-y-1">
              <span className="font-bold text-white text-xs truncate block">
                {githubRepo?.name || "GitHub Repository Page"}
              </span>
              <p className="text-[10px] text-muted-foreground">{githubRepo?.description || "Extract architecture from current repo"}</p>
            </div>

            <button
              onClick={handleGenerateCaseStudy}
              disabled={generatingCaseStudy}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{generatingCaseStudy ? "Generating Case Study..." : "Generate Architecture Case Study"}</span>
            </button>

            {caseStudyText && (
              <div className="p-3 rounded-xl bg-black/60 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-200">Resume-Ready Case Study</span>
                  <button
                    onClick={() => handleCopy(caseStudyText, "gh_case")}
                    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === "gh_case" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Markdown</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {caseStudyText}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: FORM AUTOFILL & SHORT ANSWER AI */}
        {activeTab === "autofill" && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-border/60 space-y-1">
              <p className="font-bold text-white text-xs">Universal Form Autofill</p>
              <p className="text-[10px] text-muted-foreground">Fills Greenhouse, Lever, Workday, and LinkedIn forms</p>
            </div>

            <button
              onClick={handleAutofillForm}
              disabled={autofilling}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{autofilling ? "Filling Fields..." : "1-Click Autofill Application Form"}</span>
            </button>

            {autofillSuccessCount !== null && (
              <p className="text-[11px] text-emerald-400 text-center font-semibold">
                ✓ Filled {autofillSuccessCount} form inputs successfully!
              </p>
            )}

            <div className="p-3 rounded-xl bg-black/60 border border-border/60 space-y-2 pt-2">
              <span className="font-bold text-slate-200 text-[11px]">AI Short-Answer Question Drafter</span>
              <textarea
                className="w-full h-16 p-2 rounded-lg bg-slate-900 border border-border text-xs text-white resize-none focus:outline-none focus:ring-1 focus:ring-cyan-400"
                placeholder="Paste application question (e.g. 'Why do you want to work at this company?')..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
              <button
                onClick={handleDraftShortAnswer}
                disabled={!customPrompt.trim()}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-cyan-500/30"
              >
                Draft Short Answer
              </button>

              {draftedAnswer && (
                <div className="p-2.5 rounded-lg bg-slate-900 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
                  {draftedAnswer}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: SETUP & SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-border/60 space-y-2.5">
              <p className="font-bold text-white text-xs">Local Next.js Workspace Sync</p>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">Backend Server URL</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg bg-slate-950 border border-border text-xs text-white"
                  value={workspaceUrl}
                  onChange={(e) => setWorkspaceUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">AI Provider Engine</label>
                <select
                  className="w-full p-2 rounded-lg bg-slate-950 border border-border text-xs text-white"
                  value={apiProvider}
                  onChange={(e) => setApiProvider(e.target.value)}
                >
                  <option value="groq">Groq (Ultra-Fast 500 T/s)</option>
                  <option value="openai">OpenAI (GPT-4o)</option>
                  <option value="gemini">Google Gemini 2.0 Flash</option>
                  <option value="anthropic">Claude 3.5 Sonnet</option>
                  <option value="deepseek">DeepSeek R1 / V3</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">Custom API Key (Optional)</label>
                <input
                  type="password"
                  className="w-full p-2 rounded-lg bg-slate-950 border border-border text-xs text-white"
                  placeholder="gsk_... / sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs"
              >
                {savedSettings ? "✓ Settings Saved" : "Save Preferences"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
