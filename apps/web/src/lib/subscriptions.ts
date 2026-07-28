// apps/web/src/lib/subscriptions.ts
import { prisma } from "./db";
import { UserPlan } from "./feature-flags";

export interface PlanPricing {
  id: string;
  name: string;
  description: string;
  monthly: { usd: number; inr: number; stripePriceId: string };
  yearly: { usd: number; inr: number; stripePriceId: string };
  features: string[];
}

export const ACTIVE_PLANS: Record<Exclude<UserPlan, "guest">, PlanPricing> = {
  free: {
    id: "free",
    name: "Free Candidate Plan",
    description: "Essential career tools for candidates in job hunting.",
    monthly: { usd: 0, inr: 0, stripePriceId: "" },
    yearly: { usd: 0, inr: 0, stripePriceId: "" },
    features: [
      "5 Resume ATS Scans",
      "3 GitHub Portfolio Audits",
      "2 AI Interview Prep Sessions",
      "Basic LLM gateway models access"
    ]
  },
  pro: {
    id: "pro",
    name: "Professional Plan",
    description: "Unlimited coaching metrics and high-fidelity evaluations.",
    monthly: { usd: 29, inr: 2400, stripePriceId: "price_pro_monthly" },
    yearly: { usd: 19, inr: 1600, stripePriceId: "price_pro_yearly" },
    features: [
      "Unlimited Resume STAR Audits",
      "Unlimited GitHub Analyzer runs",
      "Unlimited Mock Interviews & Audio evaluations",
      "Advanced models (Claude 3.5 Sonnet, GPT-4o)",
      "MCP Server tool access"
    ]
  },
  team: {
    id: "team",
    name: "Team & Group Plan",
    description: "Shared workspaces for bootcamps, university cohorts, and recruitment pools.",
    monthly: { usd: 79, inr: 6500, stripePriceId: "price_team_monthly" },
    yearly: { usd: 59, inr: 4900, stripePriceId: "price_team_yearly" },
    features: [
      "Everything in Pro Plan",
      "Shared cohort workspace",
      "Collaborative candidate scorecards",
      "Private vector knowledge base",
      "Priority API queue access"
    ]
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise SLA Plan",
    description: "Custom AI deployment pipelines for large recruitment firms and universities.",
    monthly: { usd: 299, inr: 25000, stripePriceId: "price_ent_monthly" },
    yearly: { usd: 249, inr: 20000, stripePriceId: "price_ent_yearly" },
    features: [
      "Everything in Team Plan",
      "Private cloud database deployment (PostgreSQL/Vector)",
      "Single Sign-On (SSO) & SAML integration",
      "RBAC organizational policies",
      "Dedicated account team & custom model endpoints"
    ]
  }
};

export async function getUserPlan(userId?: string): Promise<UserPlan> {
  if (!userId) return "guest";

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
      }
    });

    if (!user) return "guest";

    // In the future, this queries active Stripe subscription tables.
    // For now, if the user has a registered record in PostgreSQL, they default to "free" tier.
    if (user.email.endsWith("@google.com") || user.email.endsWith("@meta.com")) {
      return "pro"; // Demo enterprise upgrade
    }

    return "free";
  } catch {
    return "guest";
  }
}
