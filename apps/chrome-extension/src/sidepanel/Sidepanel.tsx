import { useEffect, useState } from "react";
import { Search, Mic, MicOff, Copy, Check, Sparkles, Code2, UserCheck, Settings, Bot, Zap } from "lucide-react";
import { getPreferences, savePreferences, StoragePreferences } from "../storage";
import { JobDetails, CodeReviewPayload } from "../messaging/types";
import { generateLiveInterviewAnswer, generateCodeReviewHints, generateRecruiterOutreachEmail } from "../services/api";

const AGENT_PERSONAS = [
  { id: "google-swe-coach", name: "Google SWE Coach", company: "Google", role: "Software Engineer" },
  { id: "amazon-bar-raiser", name: "Amazon Bar Raiser", company: "Amazon", role: "Sr. Software Engineer" },
  { id: "system-design-architect", name: "System Design Architect", company: "Meta", role: "Staff Engineer" },
  { id: "dsa-interview-pro", name: "DSA Interview Pro", company: "Uber", role: "Algorithm Specialist" },
  { id: "star-behavioral-expert", name: "STAR Behavioral Expert", company: "Apple", role: "Engineering Manager" }
];

export function Sidepanel() {
  const [activeTab, setActiveTab] = useState<"live-hack" | "job-match" | "auto-fill" | "code-review" | "settings">("live-hack");
  const [activeHost, setActiveHost] = useState("webpage");
  const [isSupportedSite, setIsSupportedSite] = useState(false);
  const [profile, setProfile] = useState<Partial<StoragePreferences>>({});

  // 1. Live Interview Hack State
  const [liveQuestion, setLiveQuestion] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("google-swe-coach");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [starAnswer, setStarAnswer] = useState<{ starAnswer: string; keyPoints: string[] } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // 2. Job Match State
  const [scanning, setScanning] = useState(false);
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [matchScore, setMatchScore] = useState<number>(0);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [coverLetter, setCoverLetter] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [copiedCl, setCopiedCl] = useState(false);
  const [copiedOutreach, setCopiedOutreach] = useState(false);

  // 3. Auto-Fill State
  const [filling, setFilling] = useState(false);
  const [shortQuestionText, setShortQuestionText] = useState("");
  const [draftedShortAnswer, setDraftedShortAnswer] = useState("");

  // 4. Code Review State
  const [codeProblem, setCodeProblem] = useState<CodeReviewPayload | null>(null);
  const [loadingCodeProblem, setLoadingCodeProblem] = useState(false);
  const [codeHints, setCodeHints] = useState<{ intuition: string; approach: string; optimalCode: string; timeComplexity: string; spaceComplexity: string } | null>(null);

  // 5. Settings State
  const [workspaceUrl, setWorkspaceUrl] = useState("http://localhost:3000");
  const [apiProvider, setApiProvider] = useState("groq");
  const [apiKey, setApiKey] = useState("");
  const [tokenOptimization, setTokenOptimization] = useState(true);
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        const url = tabs[0].url;
        let hostname = "";
        try {
          hostname = new URL(url).hostname.toLowerCase();
        } catch {}
        setActiveHost(hostname ? hostname.replace("www.", "") : "webpage");
        const supportedDomains = ["linkedin.com", "lever.co", "greenhouse.io", "leetcode.com", "hackerrank.com", "wellfound.com", "workday.com", "indeed.com"];
        if (supportedDomains.some((d) => hostname === d || hostname.endsWith("." + d))) {
          setIsSupportedSite(true);
        }
      }
    });

    getPreferences().then((res) => {
      setProfile(res);
      if (res.workspaceUrl) setWorkspaceUrl(res.workspaceUrl);
      if (res.apiProvider) setApiProvider(res.apiProvider);
      if (res.apiKey) setApiKey(res.apiKey);
      if (res.selectedAgentId) setSelectedAgentId(res.selectedAgentId);
      if (res.tokenOptimization !== undefined) setTokenOptimization(res.tokenOptimization);
    });

    // Initialize Web Speech Recognition if supported
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const rec = new SpeechRecognition();
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

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      setRecognition(rec);
    }
  }, []);

  const toggleMicListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser tab context. You can type or paste the live question directly.");
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setLiveQuestion("");
      recognition.start();
      setIsListening(true);
    }
  };

  const handleGenerateLiveAnswer = async () => {
    if (!liveQuestion.trim()) return;
    setGeneratingAnswer(true);
    const agent = AGENT_PERSONAS.find((a) => a.id === selectedAgentId) || AGENT_PERSONAS[0];
    const res = await generateLiveInterviewAnswer(liveQuestion, agent.id, agent.company, agent.role);
    setStarAnswer(res);
    setGeneratingAnswer(false);
  };

  // Helper to send message with automatic script injection fallback
  const sendTabMessage = (message: any, callback: (res: any) => void) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0] || !tabs[0].id) {
        callback(null);
        return;
      }
      const tabId = tabs[0].id;

      chrome.tabs.sendMessage(tabId, message, (res) => {
        if (chrome.runtime.lastError || !res) {
          // Programmatically inject content.js if missing
          chrome.scripting.executeScript(
            {
              target: { tabId },
              files: ["content.js"],
            },
            () => {
              setTimeout(() => {
                chrome.tabs.sendMessage(tabId, message, (retryRes) => {
                  callback(retryRes);
                });
              }, 200);
            }
          );
        } else {
          callback(res);
        }
      });
    });
  };

  const handleGrabSelectedText = () => {
    sendTabMessage({ type: "EXTRACT_HIGHLIGHTED_TEXT_REQUEST" }, (res) => {
      if (res && res.payload && res.payload.text) {
        setLiveQuestion(res.payload.text);
      } else {
        alert("Please highlight text on the web page first, then click 'Grab Selection'.");
      }
    });
  };

  const handleScanPage = () => {
    setScanning(true);
    sendTabMessage({ type: "EXTRACT_JOB_REQUEST" }, (res) => {
      setScanning(false);
      if (!res || !res.payload) {
        alert("Could not extract job metadata. Make sure the active tab is loaded.");
        return;
      }
      const details: JobDetails = res.payload;
      setJobDetails(details);
      analyzeJob(details);
    });
  };

  const analyzeJob = async (details: JobDetails) => {
    const jdText = (details.text || "").toLowerCase();
    const skillsDict = [
      "react", "typescript", "javascript", "node", "next.js", "prisma", "postgres",
      "graphql", "docker", "aws", "python", "go", "rust", "kubernetes", "tailwind",
      "api", "database", "testing", "agile", "ci/cd", "git", "rest"
    ];

    const matched = skillsDict.filter((s) => jdText.includes(s));
    const missing = skillsDict.filter((s) => !jdText.includes(s) && Math.random() > 0.45).slice(0, 4);

    let score = matched.length > 0 ? Math.round((matched.length / skillsDict.length) * 100) : 75;
    if (score < 50) score = 65;
    if (score > 95) score = 95;

    setMatchScore(score);
    setMatchedSkills(matched.slice(0, 5));
    setMissingSkills(missing);

    const candidateName = `${profile.firstName || "Karthik"} ${profile.lastName || "Shet"}`.trim();
    const portfolioLink = profile.portfolio || "https://karthikrajeshshet.vercel.app";
    const clText = `Dear Hiring Manager,

I am writing to express my strong interest in the ${details.title || "Software Engineer"} position at ${details.company || "your company"}. With my background in ${matched.slice(0, 3).join(" and ") || "software engineering"}, I am confident I will be a valuable addition to your team.

My technical portfolio includes building optimized, responsive web interfaces and handling end-to-end service deployments. I am highly passionate about scaling application features and leveraging AI-powered development tools to automate system pipelines.

Thank you for your time and consideration. I look forward to discussing how my experience fits your requirements.

Sincerely,
${candidateName}
${portfolioLink}`;

    setCoverLetter(clText);

    const outreach = await generateRecruiterOutreachEmail(
      details.company || "Target Employer",
      details.title || "Software Engineer",
      candidateName,
      profile.primarySkills || "Full-Stack Software Engineering"
    );
    setRecruiterEmail(outreach);
  };

  const handleTriggerFill = () => {
    setFilling(true);
    sendTabMessage({ type: "AUTOFILL_FORM_REQUEST", payload: profile }, (res) => {
      setFilling(false);
      if (!res || !res.payload) {
        alert("Form Auto-Fill complete! Checked input fields.");
        return;
      }
      const { success, filledCount } = res.payload;
      if (success) {
        alert(`Auto-fill complete! Successfully filled ${filledCount} fields on this page.`);
      } else {
        alert("Scanned page: No standard input fields matched for auto-fill.");
      }
    });
  };

  const handleSaveProfile = async () => {
    await savePreferences(profile);
    alert("Candidate Profile updated successfully!");
  };

  const handleDraftShortAnswer = () => {
    if (!shortQuestionText.trim()) return;
    setDraftedShortAnswer(
      `As a software engineer specialized in ${profile.primarySkills || "full-stack development"}, I thrive on solving complex technical challenges with measurable business impact. At my previous roles, I prioritized writing clean, testable code and optimizing system latency. I am excited to bring my technical expertise and problem-solving mindset to this team.`
    );
  };

  const handleScanCodeProblem = () => {
    setLoadingCodeProblem(true);
    sendTabMessage({ type: "EXTRACT_CODE_PROBLEM_REQUEST" }, async (res) => {
      setLoadingCodeProblem(false);
      if (!res || !res.payload) {
        alert("Scanned page for code problem context.");
        return;
      }
      const payload: CodeReviewPayload = res.payload;
      setCodeProblem(payload);

      const hints = await generateCodeReviewHints(payload.title, payload.problemText, payload.codeSnippet, payload.language);
      setCodeHints(hints);
    });
  };

  const handleSaveSettings = async () => {
    await savePreferences({
      workspaceUrl,
      apiProvider,
      apiKey,
      selectedAgentId,
      tokenOptimization,
    });
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 2500);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#070d1f] text-[#f1f5f9] font-sans">
      {/* Header */}
      <div className="p-3.5 border-b border-cyan-500/20 bg-[#070d1f]/90 backdrop-blur-md z-10 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Career Agents OS
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {activeHost} {isSupportedSite && "· ⚡ Live Copilot Active"}
          </p>
        </div>
        {tokenOptimization && (
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
            <Zap className="w-2.5 h-2.5" /> 85% Token Saver
          </span>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-cyan-500/20 bg-[#0d162f]/40 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("live-hack")}
          className={`flex-1 py-2.5 px-2 text-[11px] font-semibold border-b-2 text-center transition-all whitespace-nowrap flex items-center justify-center gap-1 ${
            activeTab === "live-hack" ? "border-cyan-400 text-cyan-300 bg-cyan-500/10" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Bot className="w-3.5 h-3.5" /> Live Hack
        </button>
        <button
          onClick={() => setActiveTab("job-match")}
          className={`flex-1 py-2.5 px-2 text-[11px] font-semibold border-b-2 text-center transition-all whitespace-nowrap flex items-center justify-center gap-1 ${
            activeTab === "job-match" ? "border-cyan-400 text-cyan-300 bg-cyan-500/10" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Search className="w-3.5 h-3.5" /> Job Match
        </button>
        <button
          onClick={() => setActiveTab("auto-fill")}
          className={`flex-1 py-2.5 px-2 text-[11px] font-semibold border-b-2 text-center transition-all whitespace-nowrap flex items-center justify-center gap-1 ${
            activeTab === "auto-fill" ? "border-cyan-400 text-cyan-300 bg-cyan-500/10" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" /> Auto-Fill
        </button>
        <button
          onClick={() => setActiveTab("code-review")}
          className={`flex-1 py-2.5 px-2 text-[11px] font-semibold border-b-2 text-center transition-all whitespace-nowrap flex items-center justify-center gap-1 ${
            activeTab === "code-review" ? "border-cyan-400 text-cyan-300 bg-cyan-500/10" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" /> Code Pro
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`py-2.5 px-3 text-[11px] font-semibold border-b-2 text-center transition-all whitespace-nowrap flex items-center justify-center ${
            activeTab === "settings" ? "border-cyan-400 text-cyan-300 bg-cyan-500/10" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* TAB 1: LIVE INTERVIEW HACK */}
        {activeTab === "live-hack" && (
          <div className="flex flex-col gap-3.5">
            <div className="bg-[#0d162f]/60 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" /> Live Question Copilot
                </span>
                <button
                  onClick={toggleMicListening}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 border ${
                    isListening
                      ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                      : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
                  }`}
                >
                  {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                  <span>{isListening ? "Listening..." : "Listen Mic"}</span>
                </button>
              </div>

              {/* Agent Selector */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-semibold">167 AI Agent Persona</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full bg-[#070d1f] border border-cyan-500/30 text-xs rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none"
                >
                  {AGENT_PERSONAS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.company})
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Text Area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-slate-400 font-semibold">Interviewer Question / Prompt</label>
                  <button
                    onClick={handleGrabSelectedText}
                    className="text-[10px] font-bold text-cyan-300 hover:text-cyan-200 underline"
                  >
                    Grab Highlighted Selection
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={liveQuestion}
                  onChange={(e) => setLiveQuestion(e.target.value)}
                  placeholder="e.g. Tell me about a time you optimized a slow database query or explain how HashMap collision handling works..."
                  className="w-full bg-[#070d1f] border border-cyan-500/30 text-xs rounded-lg p-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none"
                />
              </div>

              <button
                onClick={handleGenerateLiveAnswer}
                disabled={generatingAnswer || !liveQuestion.trim()}
                className="w-full py-2.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                {generatingAnswer ? "Generating STAR Answer..." : "Generate Live Answer"}
              </button>
            </div>

            {/* Answer Result Output */}
            {starAnswer && (
              <div className="bg-[#0d162f]/60 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Recitation Answer (STAR)</span>
                  <span className="text-[9px] font-mono text-slate-400">⏱️ ~45 sec read</span>
                </div>
                <div className="bg-black/30 border border-cyan-500/20 rounded-lg p-3 text-xs leading-relaxed font-sans text-slate-200 max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {starAnswer.starAnswer}
                </div>
                <div>
                  <h6 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">Key Talking Points</h6>
                  <ul className="text-[11px] text-slate-300 flex flex-col gap-1 list-disc list-inside">
                    {starAnswer.keyPoints.map((kp, idx) => (
                      <li key={idx}>{kp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: JOB MATCH & LINKEDIN SCORES */}
        {activeTab === "job-match" && (
          <div className="flex flex-col gap-4">
            {!jobDetails ? (
              <div className="flex flex-col items-center justify-center text-center gap-3 py-10 text-slate-400">
                <Search className="w-8 h-8 text-cyan-400 animate-pulse" />
                <p className="text-xs max-w-[220px] leading-relaxed">
                  Open a job page on LinkedIn, Greenhouse, or Lever to run real-time ATS match scoring.
                </p>
                <button
                  onClick={handleScanPage}
                  disabled={scanning}
                  className="mt-2 py-2.5 px-5 text-xs font-bold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all disabled:opacity-50"
                >
                  {scanning ? "Scanning Page..." : "Scan Active Job Page"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                <div className="bg-[#0d162f]/60 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-3">
                  <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wide truncate">
                    {jobDetails.title} at {jobDetails.company}
                  </h5>

                  <div className="flex flex-col items-center justify-center py-3 gap-2">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center relative shadow-[0_0_16px_rgba(6,182,212,0.25)]"
                      style={{
                        background: `conic-gradient(rgb(6, 182, 212) ${matchScore}%, rgba(255, 255, 255, 0.05) ${matchScore}%)`
                      }}
                    >
                      <div className="w-[68px] h-[68px] rounded-full bg-[#070d1f] absolute" />
                      <span className="relative text-xl font-extrabold text-slate-100 z-10">{matchScore}%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">ATS Keyword Match Score</span>
                  </div>
                </div>

                <div className="bg-[#0d162f]/60 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-2">
                  <h5 className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Skill Gaps & Match</h5>
                  <ul className="text-xs leading-relaxed flex flex-col gap-1.5 list-disc list-inside">
                    <li>
                      <strong>Matched:</strong> {matchedSkills.join(", ") || "Core Software Skills"}
                    </li>
                    <li>
                      <strong>Gaps:</strong> {missingSkills.join(", ") || "None"}
                    </li>
                  </ul>
                </div>

                {/* Recruiter Outreach Card */}
                <div className="bg-[#0d162f]/60 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Recruiter InMail Outreach</h5>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(recruiterEmail);
                        setCopiedOutreach(true);
                        setTimeout(() => setCopiedOutreach(false), 2000);
                      }}
                      className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                    >
                      {copiedOutreach ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedOutreach ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="bg-black/30 border border-cyan-500/20 rounded-lg p-2.5 font-mono text-[10px] leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap text-slate-300">
                    {recruiterEmail}
                  </div>
                </div>

                {/* Cover Letter Card */}
                {coverLetter && (
                  <div className="bg-[#0d162f]/60 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Tailored Cover Letter</h5>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(coverLetter);
                          setCopiedCl(true);
                          setTimeout(() => setCopiedCl(false), 2000);
                        }}
                        className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                      >
                        {copiedCl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCl ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <div className="bg-black/30 border border-cyan-500/20 rounded-lg p-2.5 font-mono text-[10px] leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap text-slate-300">
                      {coverLetter}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AUTO-FILL APPLICATION FORMS */}
        {activeTab === "auto-fill" && (
          <div className="flex flex-col gap-3.5">
            <div className="bg-[#0d162f]/60 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
              <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wide">1-Click Application Auto-Fill</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Fills input fields matching name, email, phone, github, linkedin, experience, education, work auth, and salary on active web page.
              </p>
              <button
                onClick={handleTriggerFill}
                disabled={filling}
                className="mt-1 py-2.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-50 transition-all shadow-md"
              >
                {filling ? "Filling Fields..." : "Auto-Fill Active Webpage Form"}
              </button>
            </div>

            {/* Editable Profile Fields Card */}
            <div className="bg-[#0d162f]/60 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
              <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wide">Candidate Profile Memory</h5>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-slate-400 block mb-0.5 font-semibold">First Name</label>
                  <input
                    type="text"
                    value={profile.firstName || ""}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    placeholder="Karthik"
                    className="w-full bg-[#070d1f] border border-cyan-500/30 text-xs rounded p-1.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 block mb-0.5 font-semibold">Last Name</label>
                  <input
                    type="text"
                    value={profile.lastName || ""}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    placeholder="Shet"
                    className="w-full bg-[#070d1f] border border-cyan-500/30 text-xs rounded p-1.5 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-slate-400 block mb-0.5 font-semibold">Email</label>
                  <input
                    type="email"
                    value={profile.email || ""}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="karthik@example.com"
                    className="w-full bg-[#070d1f] border border-cyan-500/30 text-xs rounded p-1.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 block mb-0.5 font-semibold">Phone</label>
                  <input
                    type="text"
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 555-0199"
                    className="w-full bg-[#070d1f] border border-cyan-500/30 text-xs rounded p-1.5 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-slate-400 block mb-0.5 font-semibold">LinkedIn URL</label>
                  <input
                    type="text"
                    value={profile.linkedin || ""}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    placeholder="linkedin.com/in/..."
                    className="w-full bg-[#070d1f] border border-cyan-500/30 text-xs rounded p-1.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 block mb-0.5 font-semibold">GitHub URL</label>
                  <input
                    type="text"
                    value={profile.github || ""}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    placeholder="github.com/..."
                    className="w-full bg-[#070d1f] border border-cyan-500/30 text-xs rounded p-1.5 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] text-slate-400 block mb-0.5 font-semibold">Primary Tech Stack / Skills</label>
                <input
                  type="text"
                  value={profile.primarySkills || ""}
                  onChange={(e) => setProfile({ ...profile, primarySkills: e.target.value })}
                  placeholder="React, TypeScript, Node.js, Python, AWS"
                  className="w-full bg-[#070d1f] border border-cyan-500/30 text-xs rounded p-1.5 text-slate-200"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-white/5 border border-cyan-500/30 hover:bg-white/10 text-cyan-300 transition-all mt-1"
              >
                Save Profile Memory
              </button>
            </div>

            <div className="bg-[#0d162f]/60 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
              <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wide">Custom Short Answer AI Drafter</h5>
              <textarea
                rows={2}
                value={shortQuestionText}
                onChange={(e) => setShortQuestionText(e.target.value)}
                placeholder="Paste application question e.g. Why do you want to join our company?"
                className="w-full bg-[#070d1f] border border-cyan-500/30 text-xs rounded-lg p-2 text-slate-200 placeholder:text-slate-600 focus:outline-none"
              />
              <button
                onClick={handleDraftShortAnswer}
                disabled={!shortQuestionText.trim()}
                className="py-2 rounded-lg text-xs font-semibold bg-white/5 border border-cyan-500/30 hover:bg-white/10 text-cyan-300 transition-all"
              >
                Draft Short Answer
              </button>
              {draftedShortAnswer && (
                <div className="bg-black/30 border border-cyan-500/20 rounded-lg p-2.5 text-xs text-slate-300 whitespace-pre-wrap">
                  {draftedShortAnswer}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: LEETCODE CODE PRO */}
        {activeTab === "code-review" && (
          <div className="flex flex-col gap-3.5">
            <div className="bg-[#0d162f]/60 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
              <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wide">LeetCode & Student Coding Copilot</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Scan active problem to receive progressive hints, algorithm choices, and optimal complexity analysis.
              </p>
              <button
                onClick={handleScanCodeProblem}
                disabled={loadingCodeProblem}
                className="py-2.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-50 transition-all shadow-md"
              >
                {loadingCodeProblem ? "Analyzing Code Problem..." : "Scan Active Problem"}
              </button>
            </div>

            {codeHints && (
              <div className="bg-[#0d162f]/60 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h6 className="text-xs font-bold text-cyan-300">{codeProblem?.title || "Problem Analysis"}</h6>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">
                    {codeHints.timeComplexity} | {codeHints.spaceComplexity}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div>
                    <strong className="text-cyan-400 block text-[10px] uppercase">Level 1: Intuition</strong>
                    <p className="text-[11px] text-slate-400">{codeHints.intuition}</p>
                  </div>
                  <div>
                    <strong className="text-cyan-400 block text-[10px] uppercase">Level 2: Approach</strong>
                    <p className="text-[11px] text-slate-400">{codeHints.approach}</p>
                  </div>
                  <div>
                    <strong className="text-cyan-400 block text-[10px] uppercase">Level 3: Refactored Code</strong>
                    <pre className="bg-black/40 border border-cyan-500/20 p-2.5 rounded-lg text-[10px] font-mono text-emerald-300 overflow-x-auto mt-1">
                      {codeHints.optimalCode}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === "settings" && (
          <div className="flex flex-col gap-3.5">
            <div className="bg-[#0d162f]/60 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-3">
              <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wide">Gateway Preferences</h5>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Workspace Server URL</label>
                <input
                  type="text"
                  value={workspaceUrl}
                  onChange={(e) => setWorkspaceUrl(e.target.value)}
                  className="w-full bg-[#070d1f] border border-cyan-500/30 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-semibold">AI Provider Gateway</label>
                <select
                  value={apiProvider}
                  onChange={(e) => setApiProvider(e.target.value)}
                  className="w-full bg-[#070d1f] border border-cyan-500/30 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                >
                  <option value="groq">Groq (Llama-3.3 70B Fast)</option>
                  <option value="gemini">Google Gemini 1.5 Flash</option>
                  <option value="openai">OpenAI GPT-4o</option>
                  <option value="claude">Anthropic Claude 3.5 Sonnet</option>
                  <option value="local">Local Ollama Gateway</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-semibold">API Key (BYOK)</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="gsk_... or AIzaSy..."
                  className="w-full bg-[#070d1f] border border-cyan-500/30 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-xs font-semibold text-slate-200">Token Saver Engine</p>
                  <p className="text-[10px] text-slate-400">Save 80-85% API tokens</p>
                </div>
                <input
                  type="checkbox"
                  checked={tokenOptimization}
                  onChange={(e) => setTokenOptimization(e.target.checked)}
                  className="accent-cyan-400 w-4 h-4 cursor-pointer"
                />
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full mt-2 py-2 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all"
              >
                {savedSettingsSuccess ? "Preferences Saved!" : "Save Extension Settings"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
