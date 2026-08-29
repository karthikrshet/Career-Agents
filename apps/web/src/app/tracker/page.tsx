"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  KanbanSquare, Plus, Trash2, ExternalLink,
  LayoutList, LayoutGrid, X, Calendar, Sparkles,
  ArrowRight, DollarSign, Clock, CheckCircle2,
  TrendingUp, Award, Building2, MapPin
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { generateId, cn, timeAgo } from "@/lib/utils";
import type { JobApplication, JobStatus } from "@/types";

const STATUSES: JobStatus[] = ["Wishlist", "Applied", "OA", "Phone Screen", "Onsite", "Offer", "Rejected", "Withdrawn"];

const STATUS_COLORS: Record<JobStatus, string> = {
  Wishlist: "bg-slate-500/10 border-slate-500/30 text-slate-400",
  Applied: "bg-sky-500/10 border-sky-500/30 text-sky-400",
  OA: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
  "Phone Screen": "bg-violet-500/10 border-violet-500/30 text-violet-400",
  Onsite: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  Offer: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
  Rejected: "bg-red-500/10 border-red-500/30 text-red-400",
  Withdrawn: "bg-gray-500/10 border-gray-500/30 text-gray-400",
};

const KANBAN_COLS: JobStatus[] = ["Wishlist", "Applied", "OA", "Phone Screen", "Onsite", "Offer", "Rejected"];

export default function TrackerPage() {
  const jobApplications = useStore((s) => s.jobApplications);
  const addJobApplication = useStore((s) => s.addJobApplication);
  const updateJobApplication = useStore((s) => s.updateJobApplication);
  const deleteJobApplication = useStore((s) => s.deleteJobApplication);

  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ company: "", role: "", location: "", salary: "", url: "", notes: "" });

  function handleAdd() {
    if (!form.company || !form.role) {
      toast.error("Company and Role are required");
      return;
    }
    addJobApplication({
      id: generateId(),
      company: form.company,
      role: form.role,
      status: "Applied",
      location: form.location,
      salary: form.salary,
      notes: form.notes,
      url: form.url,
      tags: [],
      appliedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });
    setForm({ company: "", role: "", location: "", salary: "", url: "", notes: "" });
    setShowAdd(false);
    toast.success("Application added to pipeline!");
  }

  const byStatus = (status: JobStatus) =>
    jobApplications.filter((j) => j.status === status);

  const total = jobApplications.length;
  const active = jobApplications.filter((j) => !["Rejected", "Withdrawn"].includes(j.status)).length;
  const offers = byStatus("Offer").length;
  const onsites = byStatus("Onsite").length;
  const responseRate =
    total > 0
      ? Math.round(
          (jobApplications.filter((j) => j.status !== "Applied" && j.status !== "Wishlist").length / total) * 100
        )
      : 0;

  return (
    <div className="flex flex-col h-full overflow-auto bg-[#03060f] text-slate-100 font-sans">
      <Topbar
        title="Application Pipeline Radar"
        subtitle="Live Kanban workflow, offer velocity metrics & interview countdowns"
      />

      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Total Applications", value: total, color: "text-sky-400", sub: "Pipeline entries" },
            { label: "Active Pipelines", value: active, color: "text-violet-400", sub: "In discussion" },
            { label: "Onsite Loops", value: onsites, color: "text-amber-400", sub: "Final stages" },
            { label: "Offers Secured", value: offers, color: "text-emerald-400", sub: "Ready for negotiation" },
            { label: "Funnel Conversion", value: `${responseRate}%`, color: "text-cyan-400", sub: "Response velocity" },
          ].map((s) => (
            <Card key={s.label} className="glass border-border/60">
              <CardContent className="p-4">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">{s.label}</p>
                <p className={cn("text-2xl font-bold font-mono mt-1", s.color)}>{s.value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3">
          <Button
            size="sm"
            onClick={() => setShowAdd(!showAdd)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold h-9 rounded-xl shadow-md"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Add Target Role</span>
          </Button>

          <div className="flex items-center gap-1 glass rounded-xl p-1 border border-border/60">
            <button
              onClick={() => setView("kanban")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                view === "kanban" ? "bg-secondary text-cyan-400 font-bold" : "text-muted-foreground hover:text-foreground"
              )}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("table")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                view === "table" ? "bg-secondary text-cyan-400 font-bold" : "text-muted-foreground hover:text-foreground"
              )}
              title="Table Grid View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="glass border-cyan-500/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-white">Add New Target Role to Pipeline</CardTitle>
                    <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: "company", placeholder: "e.g. Google, Anthropic", label: "Company Name *" },
                    { key: "role", placeholder: "e.g. Senior Software Engineer", label: "Role Title *" },
                    { key: "location", placeholder: "e.g. San Francisco, CA / Remote", label: "Location / Work Mode" },
                    { key: "salary", placeholder: "e.g. $220k - $280k", label: "Target Compensation (TC)" },
                    { key: "url", placeholder: "https://...", label: "Job Posting URL" },
                    { key: "notes", placeholder: "Referral contact, recruiter name...", label: "Pipeline Notes" },
                  ].map(({ key, placeholder, label }) => (
                    <div key={key}>
                      <label className="text-xs text-muted-foreground mb-1 block font-medium">{label}</label>
                      <Input
                        placeholder={placeholder}
                        value={(form as any)[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        className="bg-secondary/60 border-border/80 text-xs rounded-xl"
                      />
                    </div>
                  ))}
                  <div className="col-span-full flex gap-2 pt-2">
                    <Button onClick={handleAdd} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs h-9 rounded-xl">
                      Save to Pipeline
                    </Button>
                    <Button variant="ghost" onClick={() => setShowAdd(false)} className="text-xs h-9">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kanban view */}
        {view === "kanban" && (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {KANBAN_COLS.map((status) => {
                const list = byStatus(status);
                return (
                  <div key={status} className="w-72 flex-shrink-0 flex flex-col">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold border font-mono", STATUS_COLORS[status])}>
                        {status}
                      </span>
                      <span className="text-xs font-mono font-bold text-muted-foreground">{list.length}</span>
                    </div>

                    <div className="space-y-2.5 flex-1 p-2 rounded-2xl bg-slate-900/40 border border-border/40 min-h-[400px]">
                      {list.map((job) => (
                        <motion.div
                          key={job.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <Card className="glass glass-hover border border-border/60 hover:border-cyan-500/40 transition-all shadow-md">
                            <CardContent className="p-3.5 space-y-2.5">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-white truncate">{job.company}</p>
                                  <p className="text-xs text-cyan-400 truncate">{job.role}</p>
                                  {job.location && (
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                                      <MapPin className="w-3 h-3 shrink-0" />
                                      <span className="truncate">{job.location}</span>
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteJobApplication(job.id);
                                    toast.success("Removed application");
                                  }}
                                  className="shrink-0 p-1 rounded hover:bg-secondary text-muted-foreground hover:text-red-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {job.salary && (
                                <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 w-fit">
                                  <DollarSign className="w-3 h-3" />
                                  <span>{job.salary}</span>
                                </div>
                              )}

                              {/* Stage advance dropdown & quick actions */}
                              <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                                <select
                                  className="flex-1 text-[10px] bg-secondary/80 border border-border/80 rounded-lg px-2 py-1 text-slate-200 focus:outline-none font-medium"
                                  value={job.status}
                                  onChange={(e) => updateJobApplication(job.id, { status: e.target.value as JobStatus })}
                                >
                                  {STATUSES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>

                                <Link href={`/interview?company=${job.company}`}>
                                  <button
                                    title="Launch Mock Interview for this company"
                                    className="p-1 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs"
                                  >
                                    <Sparkles className="w-3 h-3" />
                                  </button>
                                </Link>

                                {job.url && (
                                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                                    <button className="p-1 rounded-lg bg-secondary text-muted-foreground hover:text-white border border-border">
                                      <ExternalLink className="w-3 h-3" />
                                    </button>
                                  </a>
                                )}
                              </div>

                              <p className="text-[10px] text-muted-foreground font-mono">
                                Applied: {timeAgo(job.appliedDate)}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}

                      {list.length === 0 && (
                        <div className="rounded-xl border-2 border-dashed border-border/40 h-28 flex items-center justify-center text-center p-4">
                          <p className="text-xs text-muted-foreground/50">No applications in {status}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Table view */}
        {view === "table" && (
          <Card className="glass overflow-hidden border border-border/60">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-secondary/30">
                    {["Company", "Role Title", "Pipeline Stage", "Location", "Compensation", "Applied Date", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jobApplications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm">
                        No applications in tracker yet. Click "Add Target Role" above.
                      </td>
                    </tr>
                  ) : (
                    jobApplications.map((job) => (
                      <tr key={job.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">{job.company}</td>
                        <td className="px-4 py-3 text-cyan-400">{job.role}</td>
                        <td className="px-4 py-3">
                          <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border", STATUS_COLORS[job.status])}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300 text-xs">{job.location || "—"}</td>
                        <td className="px-4 py-3 text-emerald-400 font-mono text-xs">{job.salary || "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{timeAgo(job.appliedDate)}</td>
                        <td className="px-4 py-3 flex items-center gap-2">
                          <Link href={`/interview?company=${job.company}`}>
                            <button className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Mock
                            </button>
                          </Link>
                          <button
                            onClick={() => {
                              deleteJobApplication(job.id);
                              toast.success("Removed");
                            }}
                            className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
