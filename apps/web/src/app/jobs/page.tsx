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
import { cn, generateId } from "@/lib/utils";

// ─── Job data structure ──────────────────────────────────────────────────────
interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Remote" | "Hybrid" | "Onsite";
  salary?: string;
  experience: string;
  tech: string[];
  source: string;
  sourceUrl: string;
  postedAt: string;
  visaSponsorship: boolean;
  bookmarked?: boolean;
  atsMatch?: number;
}

// ─── Curated sample job listings (real company careers links) ────────────────
const SAMPLE_JOBS: JobListing[] = [
  {
    id: "g1", title: "Senior Software Engineer, Infrastructure", company: "Google", location: "Mountain View, CA",
    type: "Hybrid", salary: "$180k–$280k", experience: "5+ years", tech: ["Go", "Python", "Kubernetes", "Distributed Systems"],
    source: "Google Careers", sourceUrl: "https://careers.google.com/jobs/results/?category=SOFTWARE_ENGINEERING", postedAt: "2d ago", visaSponsorship: true, atsMatch: 82
  },
  {
    id: "m1", title: "Software Engineer, Full Stack", company: "Meta", location: "Menlo Park, CA",
    type: "Hybrid", salary: "$170k–$250k", experience: "3+ years", tech: ["React", "TypeScript", "GraphQL", "Python"],
    source: "Meta Careers", sourceUrl: "https://www.metacareers.com/jobs", postedAt: "1d ago", visaSponsorship: true, atsMatch: 91
  },
  {
    id: "s1", title: "Senior Full Stack Engineer", company: "Stripe", location: "Remote",
    type: "Remote", salary: "$160k–$240k", experience: "4+ years", tech: ["Ruby", "TypeScript", "React", "Go"],
    source: "Stripe Careers", sourceUrl: "https://stripe.com/jobs/search", postedAt: "3d ago", visaSponsorship: false, atsMatch: 76
  },
  {
    id: "n1", title: "Senior Backend Engineer", company: "Netflix", location: "Los Gatos, CA",
    type: "Onsite", salary: "$200k–$350k", experience: "5+ years", tech: ["Java", "Python", "Kafka", "AWS", "Microservices"],
    source: "Netflix Jobs", sourceUrl: "https://jobs.netflix.com/search", postedAt: "5d ago", visaSponsorship: true, atsMatch: 68
  },
  {
    id: "o1", title: "Software Engineer, Platform", company: "OpenAI", location: "San Francisco, CA",
    type: "Hybrid", salary: "$200k–$370k", experience: "4+ years", tech: ["Python", "Go", "Kubernetes", "ML Systems"],
    source: "OpenAI Careers", sourceUrl: "https://openai.com/careers", postedAt: "1d ago", visaSponsorship: true, atsMatch: 88
  },
  {
    id: "a1", title: "iOS Engineer, Core UX", company: "Apple", location: "Cupertino, CA",
    type: "Onsite", salary: "$160k–$260k", experience: "4+ years", tech: ["Swift", "Objective-C", "Xcode", "UIKit"],
    source: "Apple Jobs", sourceUrl: "https://jobs.apple.com", postedAt: "4d ago", visaSponsorship: true, atsMatch: 55
  },
  {
    id: "u1", title: "Staff Software Engineer, Maps", company: "Uber", location: "San Francisco, CA",
    type: "Hybrid", salary: "$220k–$330k", experience: "7+ years", tech: ["Go", "Java", "Kafka", "Geospatial"],
    source: "Uber Careers", sourceUrl: "https://www.uber.com/us/en/careers", postedAt: "2d ago", visaSponsorship: false, atsMatch: 72
  },
  {
    id: "ai1", title: "ML Engineer, LLM Infrastructure", company: "Anthropic", location: "Remote",
    type: "Remote", salary: "$220k–$400k", experience: "5+ years", tech: ["Python", "JAX", "CUDA", "Distributed Training"],
    source: "Anthropic Careers", sourceUrl: "https://www.anthropic.com/careers", postedAt: "6h ago", visaSponsorship: true, atsMatch: 79
  },
  {
    id: "v1", title: "Frontend Engineer, Design Systems", company: "Vercel", location: "Remote",
    type: "Remote", salary: "$150k–$210k", experience: "3+ years", tech: ["React", "TypeScript", "Next.js", "CSS"],
    source: "Vercel Careers", sourceUrl: "https://vercel.com/careers", postedAt: "1d ago", visaSponsorship: false, atsMatch: 95
  },
  {
    id: "l1", title: "Backend Engineer, Payments", company: "Linear", location: "Remote",
    type: "Remote", salary: "$140k–$200k", experience: "3+ years", tech: ["TypeScript", "Node.js", "PostgreSQL", "Stripe API"],
    source: "Linear Jobs", sourceUrl: "https://linear.app/careers", postedAt: "3d ago", visaSponsorship: false, atsMatch: 88
  },
  {
    id: "h1", title: "Senior Engineer, Developer Platform", company: "Hashnode", location: "Remote",
    type: "Remote", salary: "$120k–$170k", experience: "3+ years", tech: ["TypeScript", "GraphQL", "React", "MongoDB"],
    source: "Hashnode Careers", sourceUrl: "https://hashnode.com/careers", postedAt: "2d ago", visaSponsorship: false, atsMatch: 83
  },
  {
    id: "c1", title: "Software Engineer, Cloud Infrastructure", company: "Cloudflare", location: "Remote",
    type: "Remote", salary: "$150k–$230k", experience: "4+ years", tech: ["Rust", "Go", "C++", "Edge Computing"],
    source: "Cloudflare Careers", sourceUrl: "https://www.cloudflare.com/careers/jobs", postedAt: "1d ago", visaSponsorship: true, atsMatch: 66
  },
];

const SOURCES = ["All Sources", "Google Careers", "Meta Careers", "Stripe Careers", "Netflix Jobs", "OpenAI Careers", "Vercel Careers", "Anthropic Careers"];

// ─── ATS Match color helper ──────────────────────────────────────────────────
function atsColor(score?: number) {
  if (!score) return "text-muted-foreground";
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

export default function JobsPage() {
  const { settings } = useStore();
  const resumeAnalysis = useStore((s) => s.resumeAnalysis);

  const [jobsList, setJobsList] = useState<JobListing[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | "Remote" | "Hybrid" | "Onsite">("All");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [visaFilter, setVisaFilter] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ca-job-bookmarks");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  const [generating, setGenerating] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [generated, setGenerated] = useState<{ type: string; content: string } | null>(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          const scored = data.map((job: JobListing) => {
            const detected = resumeAnalysis?.detectedKeywords || [];
            if (detected.length === 0) return { ...job, atsMatch: 70 };
            const matches = job.tech.filter(t => detected.some(d => d.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(d.toLowerCase())));
            const score = Math.round((matches.length / Math.max(1, job.tech.length)) * 50 + 50);
            return { ...job, atsMatch: Math.min(98, score) };
          });
          setJobsList(scored);
        }
      } catch (err) {
        console.error("Failed to load live jobs", err);
      } finally {
        setLoadingJobs(false);
      }
    }
    loadJobs();
  }, [resumeAnalysis]);

  function toggleBookmark(id: string) {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast.info("Removed from bookmarks"); }
      else { next.add(id); toast.success("Job bookmarked!"); }
      if (typeof window !== "undefined") localStorage.setItem("ca-job-bookmarks", JSON.stringify(Array.from(next)));
      return next;
    });
  }

  function filteredJobs() {
    return jobsList.filter(job => {
      if (query && !job.title.toLowerCase().includes(query.toLowerCase()) && !job.company.toLowerCase().includes(query.toLowerCase()) && !job.tech.some(t => t.toLowerCase().includes(query.toLowerCase()))) return false;
      if (typeFilter !== "All" && job.type !== typeFilter) return false;
      if (visaFilter && !job.visaSponsorship) return false;
      if (sourceFilter !== "All Sources" && job.source !== sourceFilter) return false;
      return true;
    });
  }

  async function handleGenerate(job: JobListing, type: "cover-letter" | "referral" | "followup") {
    const aiKey = settings.aiProvider?.apiKey;
    const aiProvider = settings.aiProvider?.provider || "gemini";
    const aiModel = settings.aiProvider?.model;

    setSelectedJob(job);
    setGenerating(type);
    setGenerated(null);

    try {
      const candidateName = "the candidate";
      const candidateSkills = resumeAnalysis?.detectedKeywords?.join(", ") || job.tech.join(", ");
      const prompts: Record<string, string> = {
        "cover-letter": `Write a professional cover letter for ${candidateName} applying for "${job.title}" at ${job.company}. Highlight skills: ${candidateSkills}. Keep it under 300 words. Do not add placeholders — write it ready to send.`,
        "referral": `Write a short LinkedIn referral request message for "${job.title}" at ${job.company}. Mention key skills: ${candidateSkills}. Keep it under 120 words, conversational and direct.`,
        "followup": `Write a professional follow-up email for a job application to "${job.title}" at ${job.company}. Mention it has been 1 week since applying. Keep under 100 words.`,
      };

      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompts[type] }],
          context: { profile: { name: candidateName }, resumeAnalysis },
          settings: { 
            aiProvider: { provider: aiProvider, apiKey: aiKey, model: aiModel },
            demoMode: typeof window !== "undefined" ? localStorage.getItem("demo_mode_enabled") === "true" : false 
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

  const jobs = filteredJobs();
  const bookmarkedJobs = jobsList.filter(j => bookmarks.has(j.id));

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Topbar title="Job Hub" subtitle={`${jobs.length} opportunities · AI-powered search engine`} />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Search + Filter Bar */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies, technologies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-11 bg-card/50 border-border/60"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(v => !v)}
              className={cn("h-11 gap-2", showFilters && "border-primary text-primary")}
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
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                {/* Work type */}
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block mb-1">Work Type</label>
                  <div className="flex flex-wrap gap-1">
                    {(["All", "Remote", "Hybrid", "Onsite"] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        className={cn("px-2 py-0.5 rounded text-[10px] font-semibold border transition-all",
                          typeFilter === t ? "bg-primary text-primary-foreground border-primary" : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground")}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Source */}
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block mb-1">Source</label>
                  <select
                    value={sourceFilter}
                    onChange={e => setSourceFilter(e.target.value)}
                    className="w-full bg-secondary/40 border border-border/30 rounded px-2 py-1 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Visa */}
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="visa-filter"
                    checked={visaFilter}
                    onChange={e => setVisaFilter(e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-primary"
                  />
                  <label htmlFor="visa-filter" className="text-xs text-foreground cursor-pointer">Visa Sponsorship Only</label>
                </div>

                {/* Reset */}
                <div className="flex items-end">
                  <Button variant="ghost" size="sm" onClick={() => { setQuery(""); setTypeFilter("All"); setSourceFilter("All Sources"); setVisaFilter(false); }} className="h-8 text-xs gap-1.5 text-muted-foreground">
                    <RefreshCw className="w-3 h-3" /> Reset
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Listings Column */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              {jobs.length} positions found
            </p>
            {loadingJobs ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 bg-card/20 rounded-2xl border border-border/40">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground font-medium">Aggregating live job listings...</p>
              </div>
            ) : (
              <>
                {jobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Card
                      className={cn(
                        "border-border/50 hover:border-primary/30 transition-all cursor-pointer group",
                        selectedJob?.id === job.id && "border-primary/50 bg-primary/5"
                      )}
                      onClick={() => { setSelectedJob(job); setGenerated(null); }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                                {job.title}
                              </h3>
                              {job.atsMatch && (
                                <span className={cn("text-[10px] font-bold", atsColor(job.atsMatch))}>
                                  {job.atsMatch}% ATS match
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {job.company}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                              {job.salary && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</span>}
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.postedAt}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <Badge variant="outline" className={cn("text-[10px] py-0 px-1.5",
                                job.type === "Remote" ? "border-emerald-500/30 text-emerald-400" :
                                  job.type === "Hybrid" ? "border-sky-500/30 text-sky-400" : "border-orange-500/30 text-orange-400"
                              )}>
                                {job.type}
                              </Badge>
                              {job.visaSponsorship && (
                                <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-violet-500/30 text-violet-400">Visa ✓</Badge>
                              )}
                              {job.tech.slice(0, 4).map(t => (
                                <Badge key={t} variant="outline" className="text-[10px] py-0 px-1.5 text-muted-foreground">{t}</Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={e => { e.stopPropagation(); toggleBookmark(job.id); }}
                              className={cn("p-1.5 rounded-lg border transition-all",
                                bookmarks.has(job.id)
                                  ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
                                  : "text-muted-foreground border-border/40 hover:text-amber-400 hover:border-amber-500/30"
                              )}
                            >
                              {bookmarks.has(job.id) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                            </button>
                            <a
                              href={job.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="p-1.5 rounded-lg border border-border/40 text-muted-foreground hover:text-foreground hover:border-border transition-all"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                {jobs.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No jobs found. Try adjusting your filters.</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Side Panel: Selected Job Actions */}
          <div className="space-y-4">
            {selectedJob ? (
              <AnimatePresence mode="wait">
                <motion.div key={selectedJob.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                  <Card className="border-border/60 sticky top-0">
                    <CardContent className="p-5 space-y-4">
                      <div>
                        <h3 className="font-bold text-foreground">{selectedJob.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{selectedJob.company} · {selectedJob.location}</p>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">AI Automation</p>
                        {[
                          { id: "cover-letter", label: "Generate Cover Letter", icon: "📄" },
                          { id: "referral", label: "Referral Request", icon: "🤝" },
                          { id: "followup", label: "Follow-up Email", icon: "📧" },
                        ].map(action => (
                          <Button
                            key={action.id}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start gap-2 text-xs h-9"
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
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Apply on {selectedJob.source}
                      </a>

                      {/* Generated Content */}
                      {generated && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              Generated {generated.type === "cover-letter" ? "Cover Letter" : generated.type === "referral" ? "Referral Request" : "Follow-up Email"}
                            </p>
                            <button onClick={copyGenerated} className="text-[10px] text-primary hover:underline">Copy</button>
                          </div>
                          <div className="bg-secondary/30 border border-border/40 rounded-lg p-3 text-xs text-foreground leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
                            {generated.content}
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            ) : (
              <Card className="border-border/40">
                <CardContent className="p-8 text-center">
                  <Briefcase className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Select a job to generate AI cover letters, referral requests, or follow-up emails.</p>
                </CardContent>
              </Card>
            )}

            {/* Bookmarks sidebar */}
            {bookmarkedJobs.length > 0 && (
              <Card className="border-border/40">
                <CardContent className="p-4 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Star className="w-3 h-3 text-amber-400" /> Saved Jobs ({bookmarkedJobs.length})
                  </p>
                  {bookmarkedJobs.map(j => (
                    <div
                      key={j.id}
                      onClick={() => { setSelectedJob(j); setGenerated(null); }}
                      className="flex items-center justify-between text-xs cursor-pointer p-2 rounded-lg hover:bg-secondary/40 group"
                    >
                      <div>
                        <p className="text-foreground font-medium group-hover:text-primary transition-colors truncate max-w-[140px]">{j.title}</p>
                        <p className="text-muted-foreground">{j.company}</p>
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
