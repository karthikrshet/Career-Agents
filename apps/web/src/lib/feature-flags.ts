// apps/web/src/lib/feature-flags.ts

export type UserPlan = "guest" | "free" | "pro" | "team" | "enterprise";

export interface PlanLimits {
  resumeScansLimit: number;
  githubAuditsLimit: number;
  interviewSessionsLimit: number;
  copilotLimit: number;
  allowedModels: string[];
  mcpAccess: boolean;
  privateKnowledgeBase: boolean;
  dedicatedSupport: boolean;
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  guest: {
    resumeScansLimit: -1,
    githubAuditsLimit: -1,
    interviewSessionsLimit: -1,
    copilotLimit: -1,
    allowedModels: ["*"],
    mcpAccess: true,
    privateKnowledgeBase: true,
    secondaryModelsAllowed: true,
    dedicatedSupport: true,
  } as any,
  free: {
    resumeScansLimit: -1,
    githubAuditsLimit: -1,
    interviewSessionsLimit: -1,
    copilotLimit: -1,
    allowedModels: ["*"],
    mcpAccess: true,
    privateKnowledgeBase: true,
    dedicatedSupport: true,
  },
  pro: {
    resumeScansLimit: -1, // Unlimited
    githubAuditsLimit: -1, // Unlimited
    interviewSessionsLimit: -1, // Unlimited
    copilotLimit: -1, // Unlimited
    allowedModels: ["*"],
    mcpAccess: true,
    privateKnowledgeBase: true,
    dedicatedSupport: true,
  },
  team: {
    resumeScansLimit: -1,
    githubAuditsLimit: -1,
    interviewSessionsLimit: -1,
    copilotLimit: -1,
    allowedModels: ["*"],
    mcpAccess: true,
    privateKnowledgeBase: true,
    dedicatedSupport: true,
  },
  enterprise: {
    resumeScansLimit: -1,
    githubAuditsLimit: -1,
    interviewSessionsLimit: -1,
    copilotLimit: -1,
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
    return true; // All models available to everyone without limit
  }

  static isFeatureGated(plan: UserPlan, feature: keyof PlanLimits): boolean {
    return false; // All features ungated for everyone
  }

  static checkUsageLimit(plan: UserPlan, currentCount: number, type: "resume" | "github" | "interview" | "copilot"): boolean {
    return true; // Unlimited usage across all features and Career Copilot
  }
}
