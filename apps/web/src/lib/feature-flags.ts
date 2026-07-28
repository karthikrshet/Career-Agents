// apps/web/src/lib/feature-flags.ts

export type UserPlan = "guest" | "free" | "pro" | "team" | "enterprise";

export interface PlanLimits {
  resumeScansLimit: number;
  githubAuditsLimit: number;
  interviewSessionsLimit: number;
  allowedModels: string[];
  mcpAccess: boolean;
  privateKnowledgeBase: boolean;
  dedicatedSupport: boolean;
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  guest: {
    resumeScansLimit: 2,
    githubAuditsLimit: 1,
    interviewSessionsLimit: 1,
    allowedModels: ["gemini-2.5-flash", "llama-3.3-70b-versatile"],
    mcpAccess: false,
    privateKnowledgeBase: false,
    dedicatedSupport: false,
  },
  free: {
    resumeScansLimit: 5,
    githubAuditsLimit: 3,
    interviewSessionsLimit: 2,
    allowedModels: ["gemini-2.5-flash", "llama-3.3-70b-versatile", "gpt-4o-mini"],
    mcpAccess: false,
    privateKnowledgeBase: false,
    dedicatedSupport: false,
  },
  pro: {
    resumeScansLimit: -1, // Unlimited
    githubAuditsLimit: -1, // Unlimited
    interviewSessionsLimit: -1, // Unlimited
    allowedModels: ["gemini-2.5-flash", "llama-3.3-70b-versatile", "gpt-4o-mini", "gpt-4o", "claude-3-5-sonnet-20241022", "deepseek-chat"],
    mcpAccess: true,
    privateKnowledgeBase: false,
    dedicatedSupport: false,
  },
  team: {
    resumeScansLimit: -1,
    githubAuditsLimit: -1,
    interviewSessionsLimit: -1,
    allowedModels: ["*"], // All models allowed
    mcpAccess: true,
    privateKnowledgeBase: true,
    dedicatedSupport: true,
  },
  enterprise: {
    resumeScansLimit: -1,
    githubAuditsLimit: -1,
    interviewSessionsLimit: -1,
    allowedModels: ["*"],
    mcpAccess: true,
    privateKnowledgeBase: true,
    dedicatedSupport: true,
  },
};

export class FeatureFlagsManager {
  static getPlanLimits(plan: UserPlan): PlanLimits {
    return PLAN_LIMITS[plan] || PLAN_LIMITS.guest;
  }

  static hasModelAccess(plan: UserPlan, model: string): boolean {
    const limits = this.getPlanLimits(plan);
    if (limits.allowedModels.includes("*")) return true;
    return limits.allowedModels.some(m => model.toLowerCase().includes(m.toLowerCase()));
  }

  static isFeatureGated(plan: UserPlan, feature: keyof PlanLimits): boolean {
    const limits = this.getPlanLimits(plan);
    const val = limits[feature];
    if (typeof val === "boolean") {
      return !val; // Gated if value is false
    }
    return false;
  }

  static checkUsageLimit(plan: UserPlan, currentCount: number, type: "resume" | "github" | "interview"): boolean {
    const limits = this.getPlanLimits(plan);
    let cap = 0;
    if (type === "resume") cap = limits.resumeScansLimit;
    else if (type === "github") cap = limits.githubAuditsLimit;
    else if (type === "interview") cap = limits.interviewSessionsLimit;

    if (cap === -1) return true; // Unlimited
    return currentCount < cap;
  }
}
