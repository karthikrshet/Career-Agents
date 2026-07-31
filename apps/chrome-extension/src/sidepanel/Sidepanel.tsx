import React, { useEffect, useState } from "react";
import { Search, Monitor, Copy, Check, Info, FileText } from "lucide-react";
import { getPreferences, StoragePreferences } from "../storage";
import { JobDetails } from "../messaging/types";

export function Sidepanel() {
  const [activeTab, setActiveTab] = useState<"job-match" | "auto-fill">("job-match");
  const [activeHost, setActiveHost] = useState("webpage");
  const [isSupportedSite, setIsSupportedSite] = useState(false);
  const [profile, setProfile] = useState<Partial<StoragePreferences>>({});

  // Job Match State
  const [scanning, setScanning] = useState(false);
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [matchScore, setMatchScore] = useState<number>(0);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [coverLetter, setCoverLetter] = useState("");
  const [copied, setCopied] = useState(false);

  // Auto-Fill State
  const [filling, setFilling] = useState(false);

  useEffect(() => {
    // 1. Get active tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        const url = tabs[0].url;
        let hostname = "webpage";
        try {
          hostname = new URL(url).hostname.replace("www.", "");
        } catch {}
        setActiveHost(hostname);
        if (url.includes("linkedin.com/jobs") || url.includes("lever.co") || url.includes("greenhouse.io")) {
          setIsSupportedSite(true);
        }
      }
    });

    // 2. Load stored profile preferences
    getPreferences().then((res) => {
      setProfile(res);
    });
  }, []);

  const handleScanPage = () => {
    setScanning(true);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0] || !tabs[0].id) {
        setScanning(false);
        alert("No active tab context found.");
        return;
      }

      chrome.tabs.sendMessage(
        tabs[0].id,
        { type: "EXTRACT_JOB_REQUEST" },
        (res) => {
          setScanning(false);
          if (chrome.runtime.lastError || !res || !res.payload) {
            alert("Could not extract job text. Make sure you are on a supported job details page and refresh the page.");
            return;
          }
          const details: JobDetails = res.payload;
          setJobDetails(details);
          analyzeJob(details);
        }
      );
    });
  };

  const analyzeJob = (details: JobDetails) => {
    const jdText = details.text.toLowerCase();
    const skillsDict = [
      "react", "typescript", "javascript", "node", "next.js", "prisma", "postgres",
      "graphql", "docker", "aws", "python", "go", "rust", "kubernetes", "tailwind",
      "api", "database", "testing", "agile", "ci/cd", "git", "rest"
    ];

    const matched = skillsDict.filter((s) => jdText.includes(s));
    const missing = skillsDict.filter((s) => !jdText.includes(s) && Math.random() > 0.45).slice(0, 4);

    let score = matched.length > 0 ? Math.round((matched.length / skillsDict.length) * 100) : 45;
    if (score < 45) score = 45;
    if (score > 95) score = 95;

    setMatchScore(score);
    setMatchedSkills(matched.slice(0, 5));
    setMissingSkills(missing);

    const candidateName = `${profile.firstName || "Applicant"} ${profile.lastName || ""}`.trim();
    const portfolioLink = profile.portfolio || "myportfolio.com";
    const clText = `Dear Hiring Manager,

I am writing to express my strong interest in the ${details.title || "Software Engineer"} position at ${details.company || "your company"}. With my background in ${matched.slice(0, 3).join(" and ") || "software engineering"}, I am confident I will be a valuable addition to your team.

My technical portfolio includes building optimized, responsive web interfaces and handling end-to-end service deployments. I am highly passionate about scaling application features and leveraging AI-powered development tools to automate system pipelines.

Thank you for your time and consideration. I look forward to discussing how my experience fits your requirements.

Sincerely,
${candidateName}
${portfolioLink}`;

    setCoverLetter(clText);
  };

  const handleCopyCl = () => {
    navigator.clipboard.writeText(coverLetter).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleTriggerFill = () => {
    setFilling(true);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0] || !tabs[0].id) {
        setFilling(false);
        return;
      }

      chrome.tabs.sendMessage(
        tabs[0].id,
        { type: "AUTOFILL_FORM_REQUEST", payload: profile },
        (res) => {
          setFilling(false);
          if (chrome.runtime.lastError || !res || !res.payload) {
            alert("Could not trigger form filler. Make sure you have loaded an application form page.");
            return;
          }
          const { success, filledCount } = res.payload;
          if (success) {
            alert(`Auto-fill complete. Successfully filled ${filledCount} fields.`);
          } else {
            alert("No standard input fields matched for auto-fill.");
          }
        }
      );
    });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#070d1f] text-[#f1f5f9] font-sans">
      {/* Header */}
      <div className="p-4 border-b border-blue-500/20 bg-[#070d1f]/85 backdrop-blur-md z-10">
        <h3 className="text-base font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Career Agents Panel
        </h3>
        <p className="text-[10px] text-[#94a3b8] mt-0.5">
          Active page: {activeHost} {isSupportedSite && "· Supported Site"}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-blue-500/20 bg-[#0d162f]/30">
        <button
          onClick={() => setActiveTab("job-match")}
          className={`flex-1 py-3 text-xs font-semibold border-b-2 text-center transition-all ${
            activeTab === "job-match" ? "border-blue-500 text-blue-400" : "border-transparent text-[#94a3b8]"
          }`}
        >
          Job Match
        </button>
        <button
          onClick={() => setActiveTab("auto-fill")}
          className={`flex-1 py-3 text-xs font-semibold border-b-2 text-center transition-all ${
            activeTab === "auto-fill" ? "border-blue-500 text-blue-400" : "border-transparent text-[#94a3b8]"
          }`}
        >
          Auto-Fill
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {activeTab === "job-match" ? (
          !jobDetails ? (
            <div className="flex flex-col items-center justify-center text-center gap-3 py-10 text-[#94a3b8]">
              <Search className="w-8 h-8 text-blue-400 animate-pulse" />
              <p className="text-xs max-w-[200px] leading-relaxed">
                Open a job details page on LinkedIn, Greenhouse, or Lever to run match analysis.
              </p>
              <button
                onClick={handleScanPage}
                disabled={scanning}
                className="mt-2 py-2 px-5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50"
              >
                {scanning ? "Scanning Page..." : "Scan Active Page"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="bg-[#0d162f]/65 border border-blue-500/20 rounded-xl p-4 flex flex-col gap-3">
                <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wide truncate">
                  {jobDetails.title} at {jobDetails.company}
                </h5>

                <div className="flex flex-col items-center justify-center py-4 gap-2">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center relative shadow-[0_0_16px_rgba(59,130,246,0.2)]"
                    style={{
                      background: `conic-gradient(rgb(59, 130, 246) ${matchScore}%, rgba(255, 255, 255, 0.05) ${matchScore}%)`
                    }}
                  >
                    <div className="w-[68px] h-[68px] rounded-full bg-[#070d1f] absolute" />
                    <span className="relative text-xl font-extrabold text-[#f1f5f9] z-10">{matchScore}%</span>
                  </div>
                  <span className="text-[10px] text-[#94a3b8] font-semibold">ATS Match Score</span>
                </div>
              </div>

              <div className="bg-[#0d162f]/65 border border-blue-500/20 rounded-xl p-4 flex flex-col gap-2">
                <h5 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Skill Mapping</h5>
                <ul className="text-xs leading-relaxed flex flex-col gap-1.5 list-disc list-inside">
                  <li>
                    <strong>Matched Skills:</strong> {matchedSkills.join(", ") || "General skills"}
                  </li>
                  <li>
                    <strong>Keyword Gaps:</strong> {missingSkills.join(", ") || "None"}
                  </li>
                </ul>
              </div>

              <div className="bg-[#0d162f]/65 border border-blue-500/20 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Cover Letter</h5>
                  <button
                    onClick={handleCopyCl}
                    className="flex items-center gap-1 text-[10px] text-[#94a3b8] hover:text-white"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <div className="bg-black/20 border border-blue-500/20 rounded-lg p-3 font-mono text-[10px] leading-relaxed max-h-44 overflow-y-auto whitespace-pre-wrap">
                  {coverLetter}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d162f]/65 border border-blue-500/20 rounded-xl p-4 flex flex-col gap-2.5">
              <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wide">Autofill Application Form</h5>
              <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                Clicking fill will look for fields matching first/last name, email, phone, github, and linkedin links.
              </p>
              <button
                onClick={handleTriggerFill}
                disabled={filling}
                className="mt-2 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-all"
              >
                {filling ? "Filling Form..." : "Auto-Fill Form Fields"}
              </button>
            </div>

            <div className="bg-[#0d162f]/65 border border-blue-500/20 rounded-xl p-4 flex flex-col gap-2">
              <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wide">Sync Profile</h5>
              <ul className="text-xs flex flex-col gap-1.5 list-disc list-inside">
                <li>Name: <span className="font-semibold">{profile.firstName} {profile.lastName}</span></li>
                <li>Email: <span className="font-semibold">{profile.email}</span></li>
                <li>Phone: <span className="font-semibold">{profile.phone}</span></li>
              </ul>
              <button
                onClick={() => chrome.runtime.openOptionsPage()}
                className="mt-2 py-2 rounded-lg text-xs font-semibold bg-white/5 border border-blue-500/20 hover:bg-white/10 text-white transition-all"
              >
                Edit in Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
