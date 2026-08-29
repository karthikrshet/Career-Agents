// packages/agents/debate-engine.ts
import { CandidateContext, compileCandidateContext } from "./context";
import { AgentInfo } from "./router";

export interface DebatePersona {
  id: string;
  name: string;
  role: string;
  emoji: string;
  focusArea: string;
  evaluationCriteria: string[];
  tone: string;
}

export const CORE_DEBATE_PERSONAS: Record<string, DebatePersona> = {
  bar_raiser: {
    id: "bar_raiser",
    name: "Amazon Bar Raiser / Culture Calibration",
    role: "Leadership & Cultural Calibrator",
    emoji: "⚖️",
    focusArea: "Leadership Principles, STAR Rigor, Integrity, and Long-Term Judgment",
    evaluationCriteria: [
      "Was the Situation & Task clear?",
      "Were the Actions personally owned ('I' vs 'We')?",
      "Are Results quantified with concrete metrics and business impact?",
      "Are there warning signs of poor ownership or blame-shifting?",
    ],
    tone: "Analytical, uncompromising on standards, probing for depth.",
  },
  staff_architect: {
    id: "staff_architect",
    name: "Staff Distributed Systems Architect",
    role: "Technical & System Scalability Lead",
    emoji: "🏗️",
    focusArea: "High Availability, Latency/Throughput, CAP Theorem, Edge Cases, and Trade-offs",
    evaluationCriteria: [
      "Are Big-O time and space complexities explicitly stated and optimal?",
      "Does the design account for network partitions, backpressure, and caching layers?",
      "Are data models, schema choices, and partitioning keys sound?",
      "Did the candidate identify bottlenecks proactively?",
    ],
    tone: "Deeply technical, precision-oriented, architectural.",
  },
  hiring_manager: {
    id: "hiring_manager",
    name: "Engineering Director / Hiring Manager",
    role: "Execution Velocity & Cross-Functional Alignment",
    emoji: "💼",
    focusArea: "Delivery, Stakeholder Influence, Pragmatism, and Business ROI",
    evaluationCriteria: [
      "Can this person ship high-quality software on schedule?",
      "Do they communicate complex engineering concepts clearly?",
      "Do they balance technical debt with business urgency?",
      "Will they elevate the engineering team's standard?",
    ],
    tone: "Strategic, pragmatic, team-oriented, ROI-focused.",
  },
  negotiation_coach: {
    id: "negotiation_coach",
    name: "Executive Compensation & Negotiation Strategist",
    role: "Offer Maximizer & Level Calibrator",
    emoji: "💰",
    focusArea: "Market Leveling (L5/L6/L7), Total Compensation, and Competing Leverage",
    evaluationCriteria: [
      "Is the candidate positioned at the correct seniority level?",
      "Are unique differentiators clearly articulated?",
      "Is the leverage strategy sound against current market bands?",
    ],
    tone: "Strategic, empowering, tactically sharp.",
  },
};

export interface SwarmDeliberationPayload {
  personas: DebatePersona[];
  deliberationPrompt: string;
  scoringMatrix: {
    technicalRigorWeight: number;
    behavioralImpactWeight: number;
    architecturalScaleWeight: number;
    executionVelocityWeight: number;
  };
  synthesisDirective: string;
}

/**
 * Builds a multi-agent deliberation prompt that simulates an elite hiring committee
 * debate with distinct viewpoints, cross-examination, and final consensus.
 */
export function compileSwarmDebate(
  topic: string,
  candidateInput: string,
  context?: CandidateContext,
  selectedPersonaIds: string[] = ["staff_architect", "bar_raiser", "hiring_manager"]
): SwarmDeliberationPayload {
  const personas = selectedPersonaIds
    .map((id) => CORE_DEBATE_PERSONAS[id])
    .filter(Boolean);

  const contextBlock = context ? compileCandidateContext(context) : "";

  const personasSection = personas
    .map(
      (p) => `### Persona: ${p.name} (${p.emoji})
- **Role**: ${p.role}
- **Focus**: ${p.focusArea}
- **Tone**: ${p.tone}
- **Criteria**:
${p.evaluationCriteria.map((c) => `  * ${c}`).join("\n")}`
    )
    .join("\n\n");

  const deliberationPrompt = `You are orchestrating a real-time **AI Hiring Committee Deliberation Swarm** for top-tier technology companies.

## Target Question / Topic:
"${topic}"

## Candidate Response / Submission:
"""
${candidateInput}
"""

${contextBlock ? `## Candidate Dossier:\n${contextBlock}\n` : ""}

## Active Deliberation Panel Members:
${personasSection}

---

## Committee Deliberation Protocol:
1. **Round 1: Individual Critiques**:
   Each panel member delivers a targeted assessment from their dedicated perspective (Technical, Behavioral, or Strategic).
2. **Round 2: Cross-Examination & Debate**:
   Panel members challenge or reinforce each other's points (e.g. Staff Architect questions scalability trade-offs, Bar Raiser inspects leadership depth).
3. **Consensus Verdict & Unified Scorecard**:
   - **Consensus Verdict**: [STRONG HIRE | HIRE | LEANING HIRE | LEANING NO HIRE | STRONG NO HIRE]
   - **Composite Score**: (0-100)
   - **Dimension Scores**: Technical Rigor (/100), STAR/Leadership (/100), Architecture (/100), Communication (/100)
   - **3 Non-Negotiable Remediation Action Items**.

Provide the output in structured markdown with rich panel dialogue and an executive summary table.`;

  return {
    personas,
    deliberationPrompt,
    scoringMatrix: {
      technicalRigorWeight: 0.35,
      behavioralImpactWeight: 0.25,
      architecturalScaleWeight: 0.25,
      executionVelocityWeight: 0.15,
    },
    synthesisDirective: "Synthesize consensus with actionable feedback and concrete code/STAR examples.",
  };
}
