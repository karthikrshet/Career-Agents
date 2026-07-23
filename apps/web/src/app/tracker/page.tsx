"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  KanbanSquare, Plus, Trash2, ExternalLink,
  LayoutList, LayoutGrid, X, Calendar
} from "lucide-react";
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
  Wishlist: "bg-slate-500/10 border-slate-500/20 text-slate-400",
  Applied: "bg-sky-500/10 border-sky-500/20 text-sky-400",
  OA: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
  "Phone Screen": "bg-violet-500/10 border-violet-500/20 text-violet-400",
  Onsite: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  Offer: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  Rejected: "bg-red-500/10 border-red-500/20 text-red-400",
  Withdrawn: "bg-gray-500/10 border-gray-500/20 text-gray-400",
};

const KANBAN_COLS: JobStatus[] = ["Applied", "OA", "Phone Screen", "Onsite", "Offer", "Rejected"];

export default function TrackerPage() {
  const jobApplications = useStore((s) => s.jobApplications);
  const addJobApplication = useStore((s) => s.addJobApplication);
  const updateJobApplication = useStore((s) => s.updateJobApplication);
  const deleteJobApplication = useStore((s) => s.deleteJobApplication);

  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ company: "", role: "", location: "", salary: "", url: "", notes: "" });
  const [editId, setEditId] = useState<string | null>(null);

  function handleAdd() {
    if (!form.company || !form.role) { toast.error("Company and Role are required"); return; }
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
    toast.success("Application added");
  }

  const byStatus = (status: JobStatus) =>
    jobApplications.filter((j) => j.status === status);

  const stats = {
    total: jobApplications.length,
    active: jobApplications.filter((j) => !["Rejected", "Withdrawn"].includes(j.status)).length,
    offers: byStatus("Offer").length,
    responseRate: jobApplications.length > 0
      ? Math.round((jobApplications.filter((j) => j.status !== "Applied" && j.status !== "Wishlist").length / jobApplications.length) * 100)
      : 0,
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Topbar title="Job Tracker" subtitle="Kanban pipeline for your job search" />

      <div className="flex-1 p-6 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Applied", value: stats.total, color: "text-sky-400" },
            { label: "Active", value: stats.active, color: "text-violet-400" },
            { label: "Offers", value: stats.offers, color: "text-emerald-400" },
            { label: "Response Rate", value: `${stats.responseRate}%`, color: "text-amber-400" },
          ].map((s) => (
            <Card key={s.label} className="glass">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={cn("text-2xl font-bold mt-1", s.color)}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="w-4 h-4" /> Add Application
          </Button>
          <div className="ml-auto flex items-center gap-1 glass rounded-lg p-1">
            <button
              onClick={() => setView("kanban")}
              className={cn("p-2 rounded-md transition-colors", view === "kanban" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("table")}
              className={cn("p-2 rounded-md transition-colors", view === "table" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")}
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
              <Card className="glass border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Add New Application</CardTitle>
                    <Button size="icon-sm" variant="ghost" onClick={() => setShowAdd(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: "company", placeholder: "Company", label: "Company *" },
                    { key: "role", placeholder: "Software Engineer", label: "Role *" },
                    { key: "location", placeholder: "San Francisco, CA", label: "Location" },
                    { key: "salary", placeholder: "$150k–$180k", label: "Salary Range" },
                    { key: "url", placeholder: "https://...", label: "Job URL" },
                    { key: "notes", placeholder: "Referral, notes...", label: "Notes" },
                  ].map(({ key, placeholder, label }) => (
                    <div key={key}>
                      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                      <Input
                        placeholder={placeholder}
                        value={(form as any)[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div className="col-span-full flex gap-2">
                    <Button onClick={handleAdd}>Add Application</Button>
                    <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kanban view */}
        {view === "kanban" && (
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-max pb-4">
              {KANBAN_COLS.map((status) => (
                <div key={status} className="w-64 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", STATUS_COLORS[status])}>
                      {status}
                    </span>
                    <span className="text-xs text-muted-foreground">{byStatus(status).length}</span>
                  </div>
                  <div className="space-y-2">
                    {byStatus(status).map((job) => (
                      <motion.div
                        key={job.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Card className="glass glass-hover cursor-pointer">
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold truncate">{job.company}</p>
                                <p className="text-xs text-muted-foreground truncate">{job.role}</p>
                                {job.location && (
                                  <p className="text-[10px] text-muted-foreground/60 mt-1">{job.location}</p>
                                )}
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteJobApplication(job.id); toast.success("Removed"); }}
                                className="shrink-0 p-1 rounded hover:bg-secondary transition-colors"
                              >
                                <Trash2 className="w-3 h-3 text-muted-foreground/50 hover:text-red-400" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <select
                                className="flex-1 text-[10px] bg-secondary border border-border rounded px-1.5 py-1 text-muted-foreground focus:outline-none"
                                value={job.status}
                                onChange={(e) => updateJobApplication(job.id, { status: e.target.value as JobStatus })}
                              >
                                {STATUSES.map((s) => <option key={s}>{s}</option>)}
                              </select>
                              {job.url && (
                                <a href={job.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                  <ExternalLink className="w-3 h-3 text-muted-foreground/50 hover:text-primary" />
                                </a>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground/50 mt-1">{timeAgo(job.appliedDate)}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                    {byStatus(status).length === 0 && (
                      <div className="rounded-xl border-2 border-dashed border-border h-20 flex items-center justify-center">
                        <p className="text-xs text-muted-foreground/40">No applications</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table view */}
        {view === "table" && (
          <Card className="glass overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Company", "Role", "Status", "Location", "Applied", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jobApplications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground text-sm">
                        No applications yet. Click "Add Application" to get started.
                      </td>
                    </tr>
                  ) : (
                    jobApplications.map((job) => (
                      <tr key={job.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                        <td className="px-4 py-3 font-medium">{job.company}</td>
                        <td className="px-4 py-3 text-muted-foreground">{job.role}</td>
                        <td className="px-4 py-3">
                          <span className={cn("px-2 py-0.5 rounded-full text-xs border", STATUS_COLORS[job.status])}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{job.location || "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{timeAgo(job.appliedDate)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => { deleteJobApplication(job.id); toast.success("Removed"); }}
                            className="p-1 rounded hover:bg-secondary transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-red-400" />
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


