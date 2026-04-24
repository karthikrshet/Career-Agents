// packages/brain/intent.ts

export type BrainIntent =
  | "resume"
  | "github"
  | "linkedin"
  | "interview"
  | "coding"
  | "system_design"
  | "career_advice"
  | "salary"
  | "job_search"
  | "architecture"
  | "debug"
  | "learning"
  | "roadmap"
  | "research"
  | "general_ai"
  | "general_programming";

export interface IntentResult {
  intent: BrainIntent;
  confidence: number; // 0-100
  matchedKeywords: string[];
}

const INTENT_PATTERNS: Record<BrainIntent, string[]> = {
  resume: ["resume", "cv", "ats", "dossier", "bullet", "ats score", "work history", "education", "experience"],
  github: ["github", "git", "repo", "repository", "commits", "pull request", "branch", "pr", "commit history"],
  linkedin: ["linkedin", "headline", "profile summary", "connection request", "recruiter outreach", "networking"],
  interview: ["interview", "mock", "question", "star method", "phone screen", "onsite", "screening", "hr round", "behavioral"],
  coding: ["code", "programming", "javascript", "typescript", "python", "java", "c++", "go", "rust", "function", "algorithm"],
  system_design: ["system design", "scale", "scalability", "load balancer", "distributed", "microservices", "sharding", "database scale"],
  career_advice: ["career", "advice", "career goals", "certifications", "promotion", "industry trend", "coaching"],
  salary: ["salary", "negotiation", "offer", "compensation", "equity", "stock options", "sign-on", "total comp", "tc"],
  job_search: ["job", "apply", "hiring", "openings", "wellfound", "remoteok", "greenhouse", "lever", "ashby", "board"],
  architecture: ["architecture", "design pattern", "clean code", "uml", "diagram", "solid principles", "oop"],
  debug: ["debug", "error", "bug", "crash", "exception", "stack trace", "fix", "resolve", "broken", "run-time"],
  learning: ["learn", "study", "dsa", "dynamic programming", "explain", "tutorial", "how does", "what is"],
  roadmap: ["roadmap", "weekly plan", "30-day", "plan", "milestone", "schedule", "progress track"],
  research: ["research", "paper", "comparison", "benchmarks", "survey", "state of the art", "comparison of"],
  general_ai: ["chatgpt", "claude", "gemini", "prompt", "llm", "gpt", "model", "ai", "artificial intelligence"],
  general_programming: ["docker", "kubernetes", "k8s", "sql", "database", "query", "api", "rest", "graphql", "html", "css", "yaml", "json", "xml"],
};

export function detectUserIntent(query: string): IntentResult {
  const cleanQuery = query.toLowerCase();
  let bestIntent: BrainIntent = "general_ai";
  let maxScore = 0;
  let matchedList: string[] = [];

  for (const [intent, keywords] of Object.entries(INTENT_PATTERNS) as [BrainIntent, string[]][]) {
    let score = 0;
    const matches: string[] = [];
    for (const kw of keywords) {
      if (cleanQuery.includes(kw)) {
        score += kw.split(" ").length * 5; // multi-word keywords match higher weight
        matches.push(kw);
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestIntent = intent;
      matchedList = matches;
    }
  }

  // Fallback to simple query string analysis if no match
  if (maxScore === 0) {
    if (/explain|how to|what is/i.test(cleanQuery)) {
      bestIntent = "learning";
      maxScore = 20;
    } else if (/error|failed|undefined|null/i.test(cleanQuery)) {
      bestIntent = "debug";
      maxScore = 20;
    } else if (/design|architecture/i.test(cleanQuery)) {
      bestIntent = "architecture";
      maxScore = 20;
    }
  }

  const confidence = maxScore > 0 ? Math.min(99, 50 + maxScore) : 80;

  return {
    intent: bestIntent,
    confidence,
    matchedKeywords: matchedList,
  };
}
