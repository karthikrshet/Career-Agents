// Real ATS Resume Analysis Engine

import type { ResumeAnalysis, WeakBullet } from "@/types";
import { generateId } from "@/lib/utils";

// ─── Weak verb detection ───────────────────────────────────────────────────
const WEAK_VERBS: string[] = [
  "led", "managed", "handled", "worked", "helped", "assisted", "responsible",
  "was", "were", "did", "made", "used", "got", "had", "done", "oversaw",
  "participated", "involved", "contributed", "supported", "maintained",
  "worked on", "dealt with", "took care of", "in charge of", "ensured",
  "processed", "reviewed", "monitored", "coordinated", "facilitated",
];

const STRONG_VERB_MAP: Record<string, string> = {
  "led": "Directed",
  "managed": "Orchestrated",
  "worked": "Delivered",
  "helped": "Enabled",
  "assisted": "Collaborated with",
  "responsible for": "Owned",
  "participated": "Contributed to",
  "oversaw": "Supervised",
  "maintained": "Optimized",
  "coordinated": "Aligned",
};

// ─── ATS Keywords ─────────────────────────────────────────────────────────
const ATS_KEYWORDS = [
  "TypeScript", "JavaScript", "Python", "React", "Node.js", "Next.js",
  "AWS", "GCP", "Azure", "Docker", "Kubernetes", "PostgreSQL", "MongoDB",
  "Redis", "GraphQL", "REST", "API", "microservices", "CI/CD", "Git",
  "Agile", "distributed", "scalable", "performance", "optimization",
  "system design", "algorithms", "data structures", "machine learning",
];

// ─── Metric detection ─────────────────────────────────────────────────────
const METRIC_REGEX = /(\d+\.?\d*\s*(%|x|X|users?|customers?|requests?|ms|seconds?|minutes?|hours?|days?|months?|years?|k|M|B|\$|€|£|million|billion|thousand|hundred))/i;

function detectWeakBullets(lines: string[]): WeakBullet[] {
  const results: WeakBullet[] = [];

  for (const line of lines) {
    if (line.trim().length < 20) continue;
    const lower = line.toLowerCase().trim();

    // Check for weak verb at start
    let weakVerb: string | null = null;
    for (const verb of WEAK_VERBS) {
      if (lower.startsWith(verb + " ") || lower.startsWith(verb.toLowerCase() + " ")) {
        weakVerb = verb;
        break;
      }
    }

    if (weakVerb) {
      const strongVerb = STRONG_VERB_MAP[weakVerb] || "Delivered";
      const rest = line.trim().slice(weakVerb.length).trim();
      results.push({
        original: line.trim(),
        issue: "passive_verb",
        suggested: `${strongVerb} ${rest.charAt(0).toLowerCase()}${rest.slice(1)}`,
      });
      continue;
    }

    // Check for missing metrics
    if (line.length > 40 && !METRIC_REGEX.test(line)) {
      results.push({
        original: line.trim(),
        issue: "no_metric",
        suggested: line.trim() + ", resulting in measurable impact (add %, users, or dollar values)",
      });
    }
  }

  return results.slice(0, 10); // cap at 10
}

function detectKeywords(text: string): { found: string[]; missing: string[] } {
  const found = ATS_KEYWORDS.filter((kw) =>
    new RegExp(`\\b${kw.replace(/[.+]/g, "\\$&")}\\b`, "i").test(text)
  );
  const missing = ATS_KEYWORDS.filter((kw) => !found.includes(kw)).slice(0, 8);
  return { found, missing };
}

function detectSections(text: string) {
  const lower = text.toLowerCase();
  return {
    hasExperience: /experience|work history|employment/i.test(lower),
    hasEducation: /education|university|degree|bachelor|master|phd/i.test(lower),
    hasSkills: /skills|technologies|tech stack|proficient/i.test(lower),
    hasProjects: /projects?|portfolio|built|developed/i.test(lower),
    hasSummary: /summary|objective|profile|about/i.test(lower),
  };
}

function computeAtsScore(
  sections: ReturnType<typeof detectSections>,
  weakBullets: WeakBullet[],
  missingKeywords: string[],
  textLength: number
): number {
  let score = 50;

  // Section presence (30 pts)
  if (sections.hasExperience) score += 8;
  if (sections.hasEducation) score += 5;
  if (sections.hasSkills) score += 8;
  if (sections.hasProjects) score += 5;
  if (sections.hasSummary) score += 4;

  // Content length (10 pts)
  if (textLength > 300) score += 5;
  if (textLength > 600) score += 5;

  // Penalise weak bullets
  score -= Math.min(20, weakBullets.length * 3);

  // Penalise missing keywords
  score -= Math.min(10, missingKeywords.length);

  return Math.max(0, Math.min(100, Math.round(score)));
}

export async function analyzeResumeText(
  rawText: string,
  fileName: string
): Promise<ResumeAnalysis> {
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 10 && (l.startsWith("-") || /^[A-Z]/.test(l)));

  const sections = detectSections(rawText);
  const weakBullets = detectWeakBullets(lines);
  const { found, missing } = detectKeywords(rawText);
  const atsScore = computeAtsScore(sections, weakBullets, missing, rawText.split(/\s+/).length);

  const recommendations: string[] = [];
  if (!sections.hasSummary) recommendations.push("Add a professional summary section at the top.");
  if (!sections.hasProjects) recommendations.push("Include a Projects section showcasing 2-3 key builds.");
  if (weakBullets.length > 3) recommendations.push("Rewrite passive-voice bullets with strong action verbs and quantified results.");
  if (missing.length > 4) recommendations.push(`Add missing keywords to your Skills section: ${missing.slice(0, 4).join(", ")}.`);
  if (rawText.split(/\s+/).length < 300) recommendations.push("Expand your resume — aim for 400-600 words for optimal ATS parsing.");

  return {
    id: generateId(),
    fileName,
    rawText,
    overallScore: atsScore,
    atsScore,
    sections,
    weakBullets,
    missingKeywords: missing,
    detectedKeywords: found,
    recommendations,
    analyzedAt: new Date().toISOString(),
  };
}


