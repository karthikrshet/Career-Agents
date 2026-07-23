"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, CheckCircle, Circle, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const COMPANIES = [
  {
    id: "google",
    name: "Google",
    tier: 1 as const,
    hiringProcess: "Phone Screen → 4-5 Onsite Rounds → Hiring Committee",
    url: "https://careers.google.com",
    modules: [
      { id: "m1", category: "dsa", title: "Blind 75 LeetCode Problems", completed: false },
      { id: "m2", category: "system_design", title: "Design YouTube / Google Search", completed: false },
      { id: "m3", category: "behavioral", title: "Googleyness & Leadership Questions", completed: false },
      { id: "m4", category: "resume", title: "Resume tailored for Google JD", completed: false },
      { id: "m5", category: "mock", title: "Mock Interview (2x Technical)", completed: false },
    ],
  },
  {
    id: "meta",
    name: "Meta",
    tier: 1 as const,
    hiringProcess: "Recruiter Screen → Technical Phone → 2-3 Onsite Loops",
    url: "https://metacareers.com",
    modules: [
      { id: "m1", category: "dsa", title: "Meta-tagged LeetCode (Trees, Graphs, BFS/DFS)", completed: false },
      { id: "m2", category: "system_design", title: "Design Instagram Feed / Messenger", completed: false },
      { id: "m3", category: "behavioral", title: "Impactful Work & Moving Fast Stories", completed: false },
      { id: "m4", category: "resume", title: "Quantified impact bullets", completed: false },
      { id: "m5", category: "mock", title: "Mock Interview (System Design)", completed: false },
    ],
  },
  {
    id: "amazon",
    name: "Amazon",
    tier: 1 as const,
    hiringProcess: "OA → Phone Screen → 5-6 Onsite (Leadership Principles)",
    url: "https://amazon.jobs",
    modules: [
      { id: "m1", category: "behavioral", title: "16 Leadership Principles (STAR stories)", completed: false },
      { id: "m2", category: "dsa", title: "Arrays, Strings, DP (OA format)", completed: false },
      { id: "m3", category: "system_design", title: "Design Amazon Warehouse / Delivery", completed: false },
      { id: "m4", category: "resume", title: "Leadership impact quantified", completed: false },
      { id: "m5", category: "mock", title: "Bar Raiser Mock Interview", completed: false },
    ],
  },
  {
    id: "microsoft",
    name: "Microsoft",
    tier: 1 as const,
    hiringProcess: "Phone Screen → 4-5 Onsite Rounds",
    url: "https://careers.microsoft.com",
    modules: [
      { id: "m1", category: "dsa", title: "OOP, Arrays, Trees, DP", completed: false },
      { id: "m2", category: "system_design", title: "Design Azure Services / Teams", completed: false },
      { id: "m3", category: "behavioral", title: "Growth Mindset Stories", completed: false },
      { id: "m4", category: "resume", title: "Cloud / Azure experience highlighted", completed: false },
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    tier: 1 as const,
    hiringProcess: "Work Trials → Take-home → 4-5 Onsite",
    url: "https://stripe.com/jobs",
    modules: [
      { id: "m1", category: "dsa", title: "Coding fundamentals (Stripe style)", completed: false },
      { id: "m2", category: "system_design", title: "Design Payment Processing at Scale", completed: false },
      { id: "m3", category: "behavioral", title: "High-standards engineering stories", completed: false },
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    tier: 1 as const,
    hiringProcess: "Intro → Technical → Research / Product Fit",
    url: "https://openai.com/careers",
    modules: [
      { id: "m1", category: "dsa", title: "ML system coding (Python)", completed: false },
      { id: "m2", category: "system_design", title: "Design LLM Inference Infrastructure", completed: false },
      { id: "m3", category: "behavioral", title: "Mission alignment & research taste", completed: false },
    ],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  dsa: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  system_design: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  behavioral: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  resume: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  mock: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function PrepHubPage() {
  const companyProgress = useStore((s) => s.companyProgress);
  const togglePrepModule = useStore((s) => s.togglePrepModule);
  const [expanded, setExpanded] = useState<string | null>("google");

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Topbar title="Company Prep Hub" subtitle="Structured preparation tracks for top tech companies" />

      <div className="flex-1 p-6 space-y-4">
        {COMPANIES.map((company, i) => {
          const progress = companyProgress[company.id] || {};
          const completed = company.modules.filter((m) => progress[m.id]).length;
          const pct = Math.round((completed / company.modules.length) * 100);
          const isExpanded = expanded === company.id;

          return (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className={cn("glass glass-hover overflow-hidden", pct === 100 && "border-emerald-500/20")}>
                <button
                  className="w-full"
                  onClick={() => setExpanded(isExpanded ? null : company.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-bold text-sm">
                        {company.name[0]}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{company.name}</CardTitle>
                          <Badge variant={company.tier === 1 ? "default" : "secondary"} className="text-[10px]">
                            Tier {company.tier}
                          </Badge>
                          {pct === 100 && <Badge variant="success" className="text-[10px]">Complete</Badge>}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <Progress value={pct} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground shrink-0">{completed}/{company.modules.length}</span>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                    </div>
                  </CardHeader>
                </button>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                  >
                    <CardContent className="pt-0 space-y-2">
                      <p className="text-xs text-muted-foreground mb-3">{company.hiringProcess}</p>
                      {company.modules.map((mod) => {
                        const done = !!progress[mod.id];
                        return (
                          <button
                            key={mod.id}
                            onClick={() => togglePrepModule(company.id, mod.id)}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                              done
                                ? "border-emerald-500/20 bg-emerald-500/5"
                                : "border-border hover:border-border/80 hover:bg-secondary/30"
                            )}
                          >
                            {done
                              ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                              : <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                            }
                            <span className={cn("flex-1 text-sm", done && "line-through text-muted-foreground")}>
                              {mod.title}
                            </span>
                            <span className={cn("text-[10px] px-1.5 py-0.5 rounded border", CATEGORY_COLORS[mod.category])}>
                              {mod.category.replace("_", " ")}
                            </span>
                          </button>
                        );
                      })}
                      <div className="pt-2">
                        <a href={company.url} target="_blank" rel="noopener noreferrer">
                          <button className="text-xs text-primary hover:underline flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            View {company.name} Careers
                          </button>
                        </a>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}


