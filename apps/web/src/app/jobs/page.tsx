"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bookmark, BookmarkCheck, ExternalLink, Filter,
  MapPin, DollarSign, Briefcase, Globe, Zap, Building2,
  ChevronDown, X, RefreshCw, Loader2, Star, Clock
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { useGatewayStore } from "@/lib/gateway-store";
import { cn, generateId, resolveApiKey } from "@/lib/utils";

// ─── Job data structure ──────────────────────────────────────────────────────
interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  countryCode?: string;
  countryFlag?: string;
  domainCategory?: string;
  type: "Remote" | "Hybrid" | "Onsite";
  salary?: string;
  experience: string;
  experienceLevel?: "Entry" | "Mid" | "Senior" | "Lead";
  tech: string[];
  source: string;
  sourceUrl: string;
  postedAt: string;
  visaSponsorship: boolean;
  bookmarked?: boolean;
  atsMatch?: number;
  description?: string;
}

// ─── Filter Constants ──────────────────────────────────────────────────────────

// ─── ATS Match color helper ──────────────────────────────────────────────────
const COUNTRIES = [
  { id: "all", label: "Global / All Locations", flag: "🌐" },
  { id: "us", label: "United States", flag: "🇺🇸" },
  { id: "in", label: "India", flag: "🇮🇳" },
  { id: "uk", label: "United Kingdom", flag: "🇬🇧" },
  { id: "ca", label: "Canada", flag: "🇨🇦" },
  { id: "de", label: "Germany / Europe", flag: "🇩🇪" },
  { id: "remote", label: "Remote Worldwide", flag: "🌐" },
];

const DOMAINS = [
  { id: "all", label: "All Specializations" },
  { id: "software-engineer", label: "Software Engineering" },
  { id: "frontend-engineer", label: "Frontend Engineering" },
  { id: "backend-engineer", label: "Backend Engineering" },
  { id: "fullstack-engineer", label: "Full Stack Engineering" },
  { id: "ai-engineer", label: "AI / ML & Data Science" },
  { id: "cloud-engineer", label: "Cloud & DevOps" },
  { id: "cybersecurity-engineer", label: "Cybersecurity" },
  { id: "product-manager", label: "Product Management" },
  { id: "ux-designer", label: "UX / UI Design" },
];

const EXPERIENCE_LEVELS = [
  { id: "all", label: "All Experience Levels" },
  { id: "entry", label: "0–2 years (Entry / Fresher)" },
  { id: "mid", label: "2–5 years (Mid Level)" },
  { id: "senior", label: "5–8 years (Senior)" },
  { id: "lead", label: "8+ years (Staff / Lead)" },
];

function getFlagEmoji(flagOrLoc?: string): string {
  if (!flagOrLoc) return "🌐";
  const s = flagOrLoc.toLowerCase().trim();
  if (s.includes("in") || s.includes("india") || s.includes("bengaluru") || s.includes("delhi") || s.includes("mumbai") || s.includes("hyderabad") || s === "🇮🇳") return "🇮🇳";
  if (s.includes("us") || s.includes("united states") || s.includes("california") || s.includes("san francisco") || s.includes("ny") || s === "🇺🇸") return "🇺🇸";
  if (s.includes("uk") || s.includes("united kingdom") || s.includes("london") || s.includes("manchester") || s === "🇬🇧") return "🇬🇧";
  if (s.includes("ca") || s.includes("canada") || s.includes("toronto") || s.includes("vancouver") || s === "🇨🇦") return "🇨🇦";
  if (s.includes("de") || s.includes("germany") || s.includes("berlin") || s.includes("europe") || s.includes("eu") || s === "🇩🇪") return "🇩🇪";
  return "🌐";
}

function atsColor(score?: number) {
  if (!score) return "text-muted-foreground";
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

export default function JobsPage() {
  const { settings } = useStore();
  const resumeAnalysis = useStore((s) => s.resumeAnalysis);
  const addJobApplication = useStore((s) => s.addJobApplication);

  const [jobsList, setJobsList] = useState<JobListing[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [query, setQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");
  const [expFilter, setExpFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<"All" | "Remote" | "Hybrid" | "Onsite">("All");
  const [visaFilter, setVisaFilter] = useState(false);

  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ca-job-bookmarks");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

  const [generating, setGenerating] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [generated, setGenerated] = useState<{ type: string; content: string } | null>(null);

  const fetchLiveJobs = async () => {
    setLoadingJobs(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (countryFilter !== "all") params.set("country", countryFilter);
      if (domainFilter !== "all") params.set("domain", domainFilter);
      if (expFilter !== "all") params.set("experience", expFilter);
      if (typeFilter !== "All") params.set("type", typeFilter);
      if (visaFilter) params.set("visa", "true");

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const detected = resumeAnalysis?.detectedKeywords || ["TypeScript", "React", "Node.js", "Python"];
        const scored = data.map((job: JobListing) => {
          const matches = job.tech.filter(t => detected.some(d => d.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(d.toLowerCase())));
          const matchRatio = matches.length / Math.max(1, job.tech.length);
          const score = Math.round(matchRatio * 50 + 45);
          return { ...job, atsMatch: Math.min(98, Math.max(35, score)) };
        });
        setJobsList(scored);
        if (scored.length > 0 && !selectedJob) {
          setSelectedJob(scored[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load live jobs", err);
      toast.error("Error connecting to live job scraper.");
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchLiveJobs();
  }, [countryFilter, domainFilter, expFilter, typeFilter, visaFilter, resumeAnalysis]);

  function toggleBookmark(id: string) {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast.info("Removed from saved jobs"); }
      else { next.add(id); toast.success("Job saved!"); }
      if (typeof window !== "undefined") localStorage.setItem("ca-job-bookmarks", JSON.stringify(Array.from(next)));
      return next;
    });
  }

  function handleSaveToTracker(job: JobListing) {
    addJobApplication({
      id: generateId(),
      company: job.company,
      role: job.title,
      location: job.location,
      status: "Wishlist",
      salary: job.salary,
      url: job.sourceUrl,
      notes: `Imported from Live Job Hub. Tech stack: ${job.tech.join(", ")}. Experience required: ${job.experience}.`,
      appliedDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString(),
      tags: job.tech.slice(0, 3),
    });
    toast.success(`Saved "${job.title}" to Job Tracker pipeline!`);
  }

  function copyMissingKeywords(job: JobListing) {
    const candidateKeywords = resumeAnalysis?.detectedKeywords || [];
    const missing = job.tech.filter(t => !candidateKeywords.some(c => c.toLowerCase().includes(t.toLowerCase())));
    const listToCopy = missing.length > 0 ? missing : job.tech;
    navigator.clipboard.writeText(listToCopy.join(", "));
    toast.success(`Copied keywords: ${listToCopy.join(", ")}`);
  }

  async function handleGenerate(job: JobListing, type: "cover-letter" | "referral" | "followup") {
    const activeProvider = useGatewayStore.getState().activeProvider;
    const gatewayConfig = {
      provider: activeProvider,
      model: useGatewayStore.getState().activeModel,
      apiKey: resolveApiKey(activeProvider, settings),
      baseUrl: settings.baseUrls?.[activeProvider] || settings.aiProvider.baseUrl,
      temperature: useGatewayStore.getState().temperature,
      maxTokens: useGatewayStore.getState().maxTokens,
    };

    setSelectedJob(job);
    setGenerating(type);
    setGenerated(null);

    try {
      const candidateName = useStore.getState().profile?.name || "the candidate";
      const candidateSkills = resumeAnalysis?.detectedKeywords?.join(", ") || job.tech.join(", ");
      const prompts: Record<string, string> = {
        "cover-letter": `Write a high-converting cover letter for ${candidateName} applying for "${job.title}" at ${job.company} (${job.location}). Emphasize experience: ${job.experience} and skills: ${candidateSkills}. Keep under 280 words.`,
        "referral": `Write a direct LinkedIn referral request for "${job.title}" at ${job.company}. Highlight core competencies: ${candidateSkills}. Keep under 110 words.`,
        "followup": `Write a professional follow-up email for a job application to "${job.title}" at ${job.company}. Keep under 100 words.`,
      };

      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompts[type] }],
          context: { profile: { name: candidateName }, resumeAnalysis },
          config: gatewayConfig,
          settings: { 
            ...settings,
            demoMode: useGatewayStore.getState().demoMode 
          },
        }),
      });

      if (!res.ok || !res.body) throw new Error("AI generation failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line.slice(6));
            const delta = parsed?.choices?.[0]?.delta?.content || "";
            result += delta;
          } catch {}
        }
      }
      setGenerated({ type, content: result.trim() });
    } catch (err: any) {
      toast.error("Generation failed — check your AI provider settings.");
    } finally {
      setGenerating(null);
    }
  }

  function copyGenerated() {
    if (!generated) return;
    navigator.clipboard.writeText(generated.content);
    toast.success("Copied to clipboard!");
  }

  const bookmarkedJobs = jobsList.filter(j => bookmarks.has(j.id));

  return (
    <div className="flex h-full flex-col overflow-hidden font-sans">
      <Topbar title="Live Global Job Search & Online Scraper" subtitle={`${jobsList.length} live opportunities matched with ATS score`} />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Search & Global Filter Bar */}
        <div className="space-y-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search live jobs, companies, skills (e.g. React, Python, Remote, India)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchLiveJobs()}
                className="pl-9 h-11 bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 font-sans focus:border-primary"
              />
            </div>
            <Button onClick={fetchLiveJobs} disabled={loadingJobs} className="h-11 px-5 gap-2 font-semibold shadow-md">
              {loadingJobs ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Scrape Live Jobs
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(v => !v)}
              className={cn("h-11 gap-2 border-slate-800 bg-slate-950/50 text-slate-200 hover:bg-slate-800 font-medium", showFilters && "border-primary text-primary")}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={cn("w-3 h-3 transition-transform", showFilters && "rotate-180")} />
            </Button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-slate-800/80"
              >
                {/* Country / Location Selector */}
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Country / Location</label>
                  <select
                    value={countryFilter}
                    onChange={e => setCountryFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-sans text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer shadow-sm [&>option]:bg-slate-900 [&>option]:text-slate-100 [&>option]:py-1.5"
                  >
                    {COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.flag} {c.label}</option>)}
                  </select>
                </div>

                {/* Domain / Specialization Selector */}
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Role Specialization</label>
                  <select
                    value={domainFilter}
                    onChange={e => setDomainFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-sans text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer shadow-sm [&>option]:bg-slate-900 [&>option]:text-slate-100 [&>option]:py-1.5"
                  >
                    {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                  </select>
                </div>

                {/* Experience Level Selector */}
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Experience Level</label>
                  <select
                    value={expFilter}
                    onChange={e => setExpFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-sans text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer shadow-sm [&>option]:bg-slate-900 [&>option]:text-slate-100 [&>option]:py-1.5"
                  >
                    {EXPERIENCE_LEVELS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
                  </select>
                </div>

                {/* Work Type & Visa */}
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Work Setup & Visa</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(["All", "Remote", "Hybrid", "Onsite"] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all",
                          typeFilter === t ? "bg-primary text-primary-foreground border-primary shadow-sm" : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200")}
                      >
                        {t}
                      </button>
                    ))}
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium cursor-pointer ml-auto">
                      <input
                        type="checkbox"
                        checked={visaFilter}
                        onChange={e => setVisaFilter(e.target.checked)}
                        className="w-3.5 h-3.5 rounded accent-primary bg-slate-900 border-slate-700"
                      />
                      Visa Only
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Listings Column */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {jobsList.length} Live Positions Found
              </p>
              {resumeAnalysis && (
                <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 bg-emerald-500/5">
                  ATS Match active against: {resumeAnalysis.targetRoleName || "Target Role"}
                </Badge>
              )}
            </div>

            {loadingJobs ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 bg-slate-900/40 rounded-2xl border border-slate-800">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-xs text-slate-400 font-medium">Scraping live job opportunities from RemoteOK, Arbeitnow, Remotive, Greenhouse & Lever...</p>
              </div>
            ) : (
              <>
                {jobsList.map((job, i) => {
                  const candidateKeywords = resumeAnalysis?.detectedKeywords || [];
                  const matchedTech = job.tech.filter(t => candidateKeywords.some(c => c.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(c.toLowerCase())));
                  const missingTech = job.tech.filter(t => !matchedTech.includes(t));
                  const flag = getFlagEmoji(job.countryFlag || job.countryCode || job.location);

                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                    >
                      <Card
                        className={cn(
                          "border-slate-800/80 bg-slate-900/50 hover:border-primary/50 transition-all cursor-pointer group shadow-sm",
                          selectedJob?.id === job.id && "border-primary/70 bg-primary/10 shadow-primary/5"
                        )}
                        onClick={() => { setSelectedJob(job); setGenerated(null); }}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-base">{flag}</span>
                                <h3 className="font-bold text-sm text-slate-100 group-hover:text-primary transition-colors truncate">
                                  {job.title}
                                </h3>
                                {job.atsMatch && (
                                  <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800", atsColor(job.atsMatch))}>
                                    {job.atsMatch}% ATS Match
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                                <span className="flex items-center gap-1 font-semibold text-slate-200"><Building2 className="w-3 h-3 text-primary" /> {job.company}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-400" /> {job.location}</span>
                                {job.salary && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-amber-400" /> {job.salary}</span>}
                                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-sky-400" /> {job.experience}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-500" /> {job.postedAt}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={e => { e.stopPropagation(); toggleBookmark(job.id); }}
                                className={cn("p-1.5 rounded-lg border transition-all",
                                  bookmarks.has(job.id)
                                    ? "text-amber-400 border-amber-500/40 bg-amber-500/10"
                                    : "text-slate-400 border-slate-800 hover:text-amber-400 hover:border-amber-500/30"
                                )}
                                title="Bookmark Job"
                              >
                                {bookmarks.has(job.id) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                              </button>
                              <a
                                href={job.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-all"
                                title="Open Original Job Link"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>

                          {/* Tech keywords match badges */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                            <Badge variant="outline" className={cn("py-0 px-1.5 font-bold",
                              job.type === "Remote" ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" :
                                job.type === "Hybrid" ? "border-sky-500/40 text-sky-400 bg-sky-500/10" : "border-orange-500/40 text-orange-400 bg-orange-500/10"
                            )}>
                              {job.type}
                            </Badge>
                            {job.visaSponsorship && (
                              <Badge variant="outline" className="py-0 px-1.5 border-violet-500/40 text-violet-400 bg-violet-500/10 font-bold">Visa Sponsored ✓</Badge>
                            )}

                            {matchedTech.map(t => (
                              <Badge key={t} variant="outline" className="py-0 px-1.5 border-emerald-500/40 text-emerald-300 bg-emerald-500/5 font-semibold">
                                ✓ {t}
                              </Badge>
                            ))}
                            {missingTech.map(t => (
                              <Badge key={t} variant="outline" className="py-0 px-1.5 border-amber-500/30 text-amber-300 bg-amber-500/5 font-semibold">
                                + {t}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
                {jobsList.length === 0 && (
                  <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 text-slate-400 space-y-3">
                    <Search className="w-10 h-10 mx-auto opacity-40 text-primary" />
                    <p className="text-sm font-semibold text-slate-200">No jobs matching your query or selected filters.</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">Try selecting "Global / All Locations" or clicking "Reset All Filters" to view all active remote opportunities.</p>
                    <Button variant="outline" size="sm" onClick={() => { setQuery(""); setCountryFilter("all"); setDomainFilter("all"); setExpFilter("all"); setTypeFilter("All"); }} className="border-slate-700 bg-slate-900 text-slate-200">
                      Reset All Filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Side Panel: Selected Job Actions & AI Tools */}
          <div className="space-y-4">
            {selectedJob ? (
              <AnimatePresence mode="wait">
                <motion.div key={selectedJob.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                  <Card className="border-slate-800 bg-slate-900/80 sticky top-4 shadow-xl backdrop-blur-md">
                    <CardContent className="p-5 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{getFlagEmoji(selectedJob.countryFlag || selectedJob.countryCode || selectedJob.location)}</span>
                          <h3 className="font-extrabold text-base text-slate-100 leading-tight">{selectedJob.title}</h3>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{selectedJob.company} · {selectedJob.location}</p>
                        <p className="text-xs font-bold text-primary mt-1">{selectedJob.salary || "Competitive Salary"} · {selectedJob.experience}</p>
                      </div>

                      {/* Job Description preview if available */}
                      {selectedJob.description && (
                        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300 leading-relaxed line-clamp-5">
                          {selectedJob.description}
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-9 gap-1.5 border-slate-800 bg-slate-950/60 text-slate-200 hover:bg-slate-800 font-semibold"
                          onClick={() => handleSaveToTracker(selectedJob)}
                        >
                          <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                          Save to Tracker
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-9 gap-1.5 border-slate-800 bg-slate-950/60 text-slate-200 hover:bg-slate-800 font-semibold"
                          onClick={() => copyMissingKeywords(selectedJob)}
                        >
                          <Zap className="w-3.5 h-3.5 text-sky-400" />
                          Copy Keywords
                        </Button>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-800">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Application Copilot</p>
                        {[
                          { id: "cover-letter", label: "Tailored Cover Letter", icon: "📄" },
                          { id: "referral", label: "LinkedIn Referral Request", icon: "🤝" },
                          { id: "followup", label: "Follow-Up Email", icon: "📧" },
                        ].map(action => (
                          <Button
                            key={action.id}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start gap-2 text-xs h-9 border-slate-800 bg-slate-950/60 text-slate-200 hover:bg-slate-800 font-medium"
                            onClick={() => handleGenerate(selectedJob, action.id as any)}
                            disabled={!!generating}
                          >
                            {generating === action.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <span>{action.icon}</span>
                            )}
                            {action.label}
                          </Button>
                        ))}
                      </div>

                      <a
                        href={selectedJob.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity shadow-md"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Apply on {selectedJob.source}
                      </a>

                      {/* Generated AI Content */}
                      {generated && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 pt-2 border-t border-slate-800">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Generated {generated.type === "cover-letter" ? "Cover Letter" : generated.type === "referral" ? "Referral Request" : "Follow-up Email"}
                            </p>
                            <button onClick={copyGenerated} className="text-[10px] text-primary hover:underline font-bold">Copy Text</button>
                          </div>
                          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap font-sans">
                            {generated.content}
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            ) : (
              <Card className="border-slate-800 bg-slate-900/40">
                <CardContent className="p-8 text-center">
                  <Briefcase className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                  <p className="text-sm text-slate-400">Select a job to view company details, match ATS keywords, and generate AI cover letters.</p>
                </CardContent>
              </Card>
            )}

            {/* Saved Jobs sidebar */}
            {bookmarkedJobs.length > 0 && (
              <Card className="border-slate-800 bg-slate-900/40">
                <CardContent className="p-4 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Star className="w-3 h-3 text-amber-400" /> Bookmarked Jobs ({bookmarkedJobs.length})
                  </p>
                  {bookmarkedJobs.map(j => (
                    <div
                      key={j.id}
                      onClick={() => { setSelectedJob(j); setGenerated(null); }}
                      className="flex items-center justify-between text-xs cursor-pointer p-2 rounded-lg hover:bg-slate-800/60 group"
                    >
                      <div>
                        <p className="text-slate-200 font-medium group-hover:text-primary transition-colors truncate max-w-[140px]">{j.title}</p>
                        <p className="text-slate-400 text-[10px]">{j.company} · {getFlagEmoji(j.countryFlag || j.countryCode || j.location)}</p>
                      </div>
                      <BookmarkCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
