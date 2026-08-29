// packages/pipeline/radar.ts
// Deep Company Radar & Architectural Intelligence Engine

export interface CompanyArchitectureCaseStudy {
  title: string;
  system: string;
  problemSolved: string;
  keyInnovations: string[];
  interviewRelevance: string;
}

export interface CompensationLevel {
  level: string;
  title: string;
  totalCompUSD: string;
  baseSalaryUSD: string;
  equityAnnualUSD: string;
  expectations: string;
}

export interface CompanyRadarDossier {
  id: string;
  name: string;
  logo: string;
  tier: 1 | 2 | 3;
  headline: string;
  techStack: string[];
  engineeringPrinciples: string[];
  interviewStages: {
    stage: string;
    duration: string;
    focus: string;
    passingBar: string;
  }[];
  architectureCaseStudies: CompanyArchitectureCaseStudy[];
  compensationLadder: CompensationLevel[];
  taggedAgents: string[];
  frequentlyAskedQuestions: {
    type: "system_design" | "coding" | "behavioral";
    question: string;
    evalCriteria: string;
  }[];
}

export const COMPANY_RADAR_REGISTRY: Record<string, CompanyRadarDossier> = {
  google: {
    id: "google",
    name: "Google",
    logo: "🟢",
    tier: 1,
    headline: "Global distributed computing, planetary-scale storage, search & AI infra",
    techStack: ["Go", "C++", "Java", "Python", "Kubernetes", "Borg", "Spanner", "Bigtable"],
    engineeringPrinciples: [
      "Focus on the user and all else will follow",
      "Fast is better than slow",
      "Democracy on the web works",
      "Googliness (Navigating ambiguity, constructive disagreement, bias for impact)",
    ],
    interviewStages: [
      { stage: "Recruiter Screen", duration: "30 min", focus: "Background & Level Calibration", passingBar: "Clear articulation of impact & level alignment" },
      { stage: "Technical Phone Screen", duration: "45 min", focus: "1 Medium/Hard DSA Problem", passingBar: "Optimal Big-O time/space complexity with zero syntax hesitation" },
      { stage: "Onsite: 3x DSA Coding", duration: "3x 45 min", focus: "Algorithms, Trees, Graphs, DP", passingBar: "Clean modular code, proactive testing of edge cases" },
      { stage: "Onsite: System Design", duration: "45 min", focus: "Distributed Systems at Scale (Spanner/YouTube)", passingBar: "CAP theorem fluency, partitioning, sharding, backpressure handling" },
      { stage: "Onsite: Googliness & Leadership", duration: "45 min", focus: "STAR Behavioral & Ambiguity", passingBar: "Demonstrated ownership, empathy, and intellectual humility" },
    ],
    architectureCaseStudies: [
      {
        title: "Google Spanner: Globally Distributed SQL Database",
        system: "Spanner",
        problemSolved: "External consistency across globally replicated databases without sacrificing high availability.",
        keyInnovations: ["TrueTime API using GPS and Atomic Clocks", "Paxos-based consensus groups", "Multi-version concurrency control (MVCC)"],
        interviewRelevance: "Essential for answering global database replication, distributed transactions, and strong consistency questions.",
      },
      {
        title: "Borg: The Predecessor to Kubernetes",
        system: "Borg Cluster Management",
        problemSolved: "Running hundreds of thousands of jobs across millions of servers with high CPU/memory utilization.",
        keyInnovations: ["Container isolation before Docker", "Priority-based preemption", "Centralized scheduler with optimistic concurrency"],
        interviewRelevance: "Referenced in cluster management, service orchestration, and resource scheduling interview tracks.",
      },
    ],
    compensationLadder: [
      { level: "L3", title: "Software Engineer II (Entry)", totalCompUSD: "$195,000 - $225,000", baseSalaryUSD: "$145,000", equityAnnualUSD: "$55,000", expectations: "Executes well-defined tasks, produces clean unit-tested code." },
      { level: "L4", title: "Software Engineer III (Mid)", totalCompUSD: "$270,000 - $315,000", baseSalaryUSD: "$175,000", equityAnnualUSD: "$100,000", expectations: "Owns medium-sized features, collaborates across teams, navigates ambiguity." },
      { level: "L5", title: "Senior Software Engineer", totalCompUSD: "$380,000 - $450,000", baseSalaryUSD: "$215,000", equityAnnualUSD: "$185,000", expectations: "Leads technical strategy for a major subsystem, mentors engineers, sets architectural standards." },
      { level: "L6", title: "Staff Software Engineer", totalCompUSD: "$550,000 - $680,000", baseSalaryUSD: "$270,000", equityAnnualUSD: "$320,000", expectations: "Cross-org impact, solves ambiguous multi-quarter infrastructure bottlenecks." },
    ],
    taggedAgents: ["google-interview-coach", "google-swe-coach", "system-design-coach", "technical-interview-coach"],
    frequentlyAskedQuestions: [
      { type: "system_design", question: "Design Google Drive / Distributed File Sync Engine", evalCriteria: "Chunking, delta sync, conflict resolution, metadata store scaling" },
      { type: "coding", question: "Median of Two Sorted Arrays (O(log(min(m, n))))", evalCriteria: "Binary search on partition points, handling odd/even lengths" },
      { type: "behavioral", question: "Tell me about a time you solved an ambiguous problem without explicit requirements.", evalCriteria: "Structured discovery, user interviews, iterative prototyping" },
    ],
  },

  meta: {
    id: "meta",
    name: "Meta",
    logo: "🔵",
    tier: 1,
    headline: "Social graph infrastructure, AI recommendation engines & real-time messaging",
    techStack: ["React", "GraphQL", "Python", "PHP/Hack", "C++", "TAO", "Memcached", "PyTorch"],
    engineeringPrinciples: [
      "Move Fast",
      "Focus on Long-Term Impact",
      "Build Awesome Things",
      "Live in the Future",
      "Be Open and Direct",
    ],
    interviewStages: [
      { stage: "Recruiter Screen", duration: "30 min", focus: "Role Fit & Experience", passingBar: "Proven track record of high delivery velocity" },
      { stage: "Technical Screen", duration: "45 min", focus: "2 Medium LeetCode Problems", passingBar: "Solving both problems cleanly within 40 minutes" },
      { stage: "Onsite: 2x Coding", duration: "2x 45 min", focus: "Speed, Correctness, Big-O", passingBar: "Rapid code completion with minimal hints" },
      { stage: "Onsite: System Design", duration: "45 min", focus: "Meta Scale Architecture (Newsfeed/Messenger)", passingBar: "Fan-out on write vs read, caching hierarchies, real-time WebSockets" },
      { stage: "Onsite: Behavioral (JEDI)", duration: "45 min", focus: "Judgment, Execution, Diversity, Impact", passingBar: "High ownership, quantifiable business metrics, resolving team friction" },
    ],
    architectureCaseStudies: [
      {
        title: "Meta TAO: The Distributed Social Graph Data Store",
        system: "TAO (The Associations and Objects)",
        problemSolved: "Serving billions of social graph queries per second with sub-millisecond latencies across worldwide datacenters.",
        keyInnovations: ["Two-tier caching layer over MySQL shards", "Object-Association graph API", "Asynchronous cache invalidation and write-through cache"],
        interviewRelevance: "The gold standard pattern for Feed, Social Graph, and Caching interview rounds.",
      },
    ],
    compensationLadder: [
      { level: "E3", title: "Software Engineer (Entry)", totalCompUSD: "$190,000 - $220,000", baseSalaryUSD: "$140,000", equityAnnualUSD: "$55,000", expectations: "High coding speed, delivers bug-free commits." },
      { level: "E4", title: "Software Engineer (Mid)", totalCompUSD: "$280,000 - $325,000", baseSalaryUSD: "$175,000", equityAnnualUSD: "$110,000", expectations: "High impact velocity, unblocks peers, ships core roadmap items." },
      { level: "E5", title: "Senior Software Engineer", totalCompUSD: "$400,000 - $480,000", baseSalaryUSD: "$220,000", equityAnnualUSD: "$200,000", expectations: "Independent pillar owner, moves metrics decisively." },
      { level: "E6", title: "Staff Software Engineer", totalCompUSD: "$600,000 - $750,000", baseSalaryUSD: "$280,000", equityAnnualUSD: "$380,000", expectations: "Shapes multi-team tech direction, drives high-scale architectural revolutions." },
    ],
    taggedAgents: ["meta-mock-interactor", "meta-impact-evaluator", "system-design-coach"],
    frequentlyAskedQuestions: [
      { type: "system_design", question: "Design Facebook Newsfeed with Top-K Ranking", evalCriteria: "Fan-out on publish, Redis feed queues, ranking service latency" },
      { type: "coding", question: "Minimum Window Substring (Sliding Window)", evalCriteria: "Two pointers, hash map frequency counts, optimal O(N) runtime" },
      { type: "behavioral", question: "Describe your most impactful project and how you personally moved the core metric.", evalCriteria: "Quantifiable metric delta, overcoming roadblocks, velocity" },
    ],
  },

  amazon: {
    id: "amazon",
    name: "Amazon",
    logo: "🟠",
    tier: 1,
    headline: "Cloud computing (AWS), global e-commerce logistics, DynamoDB & microservices",
    techStack: ["Java", "Python", "AWS DynamoDB", "Lambda", "S3", "Kafka", "Coral RPC"],
    engineeringPrinciples: [
      "Customer Obsession",
      "Ownership",
      "Invent and Simplify",
      "Are Right, A Lot",
      "Learn and Be Curious",
      "Hire and Develop the Best",
      "Insist on the Highest Standards",
      "Think Big",
      "Bias for Action",
      "Frugality",
      "Earn Trust",
      "Dive Deep",
      "Have Backbone; Disagree and Commit",
      "Deliver Results",
      "Strive to be Earth's Best Employer",
      "Success and Scale Bring Broad Responsibility",
    ],
    interviewStages: [
      { stage: "Online Assessment (OA)", duration: "90 min", focus: "2 Coding Questions + Work Simulation", passingBar: "100% test cases passed + strong LP alignment" },
      { stage: "Technical Phone Screen", duration: "60 min", focus: "1 Coding Question + 2 LP Behavioral Questions", passingBar: "Clean code + STAR answers with metrics" },
      { stage: "The Loop (4-5 Rounds)", duration: "4-5x 60 min", focus: "1x Bar Raiser, 2x System Design/OOD, 2x Coding", passingBar: "Every interviewer covers 2 LPs; Bar Raiser must vote Hire" },
    ],
    architectureCaseStudies: [
      {
        title: "Amazon Dynamo: High Available Key-Value Storage",
        system: "DynamoDB / Dynamo Core",
        problemSolved: "Zero downtime checkout during massive shopping events like Prime Day.",
        keyInnovations: ["Consistent Hashing with Virtual Nodes", "Sloppy Quorum & Hinted Handoff", "Vector Clocks for Conflict Detection"],
        interviewRelevance: "Canonical reading for any distributed database or NoSQL system design interview.",
      },
    ],
    compensationLadder: [
      { level: "SDE I (L4)", title: "Software Development Engineer I", totalCompUSD: "$175,000 - $205,000", baseSalaryUSD: "$140,000", equityAnnualUSD: "$40,000", expectations: "Writes clean, maintainable code following AWS best practices." },
      { level: "SDE II (L5)", title: "Software Development Engineer II", totalCompUSD: "$250,000 - $310,000", baseSalaryUSD: "$175,000", equityAnnualUSD: "$95,000", expectations: "Designs services, leads on-call rotation, mentors juniors." },
      { level: "SDE III (L6)", title: "Senior Software Development Engineer", totalCompUSD: "$360,000 - $440,000", baseSalaryUSD: "$210,000", equityAnnualUSD: "$160,000", expectations: "Architects org-wide distributed systems, writes 2-pagers/6-pagers." },
      { level: "Principal (L7)", title: "Principal SDE", totalCompUSD: "$520,000 - $680,000", baseSalaryUSD: "$260,000", equityAnnualUSD: "$300,000", expectations: "Technical authority for entire business unit, sets multi-year vision." },
    ],
    taggedAgents: ["amazon-bar-raiser-simulator", "amazon-leadership-calibrator", "system-design-coach"],
    frequentlyAskedQuestions: [
      { type: "behavioral", question: "Tell me about a time you made a decision with incomplete information (Bias for Action).", evalCriteria: "Calculated risk-taking, rollback plan, fast iteration" },
      { type: "system_design", question: "Design an Amazon Flash Sale / Ticketmaster Reservation Service", evalCriteria: "Distributed locking, Redis TTL holds, database row contention" },
      { type: "coding", question: "Word Break II / LRU Cache Implementation", evalCriteria: "Memoization, doubly linked list + hash map, edge cases" },
    ],
  },

  anthropic: {
    id: "anthropic",
    name: "Anthropic",
    logo: "✳️",
    tier: 1,
    headline: "AI safety and research company, creators of Claude, Constitutional AI & Frontier Models",
    techStack: ["Python", "PyTorch", "Rust", "TypeScript", "Ray", "Triton", "Kubernetes", "AWS/GCP GPUs"],
    engineeringPrinciples: [
      "AI Safety as Core Mission",
      "Empirical Rigor & Scientific Method",
      "High Ownership in Small Teams",
      "Interpretability & Constitutional Guardrails",
    ],
    interviewStages: [
      { stage: "Recruiter Screen", duration: "30 min", focus: "Mission Alignment & Background", passingBar: "Deep interest in frontier AI safety" },
      { stage: "Technical Screen", duration: "60 min", focus: "PyTorch Deep Learning Coding / Systems", passingBar: "Writing custom attention layers or distributed tensor ops cleanly" },
      { stage: "Onsite Loop (4-5 Rounds)", duration: "4-5x 60 min", focus: "Transformer Architecture, ML Systems Design, Alignment Research, Culture", passingBar: "Deep understanding of GPU memory hierarchy, KV caching, RLHF" },
    ],
    architectureCaseStudies: [
      {
        title: "Constitutional AI & Automated Feedback Alignment",
        system: "Claude Training Pipeline",
        problemSolved: "Aligning frontier LLMs without exhaustive human labeling while avoiding harmful jailbreaks.",
        keyInnovations: ["RL from AI Feedback (RLAIF)", "Principle-guided self-critique loops", "Automated red-teaming"],
        interviewRelevance: "Crucial for AI Safety, Model Alignment, and LLM Post-Training interviews.",
      },
    ],
    compensationLadder: [
      { level: "Member of Technical Staff", title: "MTS (Senior / Staff Level)", totalCompUSD: "$400,000 - $650,000", baseSalaryUSD: "$250,000 - $320,000", equityAnnualUSD: "$200,000 - $350,000", expectations: "Operates with high autonomy, drives frontier model capability/safety." },
      { level: "Research Scientist / Lead", title: "Principal MTS", totalCompUSD: "$650,000 - $1,100,000+", baseSalaryUSD: "$320,000+", equityAnnualUSD: "$450,000+", expectations: "Pioneers novel architectures, safety techniques, or distributed training clusters." },
    ],
    taggedAgents: ["anthropic-ai-coach", "anthropic-interview-coach", "ai-engineer-career-coach"],
    frequentlyAskedQuestions: [
      { type: "system_design", question: "Design a High-Throughput LLM Inference Server with Continuous Batching & KV Caching", evalCriteria: "PagedAttention, KV memory calculation, speculative decoding" },
      { type: "coding", question: "Implement Multi-Head Attention in PyTorch from scratch without using nn.MultiheadAttention", evalCriteria: "Tensor reshaping, scaled dot-product attention, masking" },
    ],
  },
};

export function getCompanyRadar(companyId: string): CompanyRadarDossier | null {
  const normalized = companyId.toLowerCase().trim();
  return COMPANY_RADAR_REGISTRY[normalized] || null;
}

export function listAllCompanyRadars(): CompanyRadarDossier[] {
  return Object.values(COMPANY_RADAR_REGISTRY);
}

export function calculateCompanyReadiness(
  companyId: string,
  userStats: {
    dsaScore?: number;
    systemDesignScore?: number;
    behavioralScore?: number;
    resumeScore?: number;
  }
): {
  overallReadiness: number;
  breakdown: {
    category: string;
    score: number;
    status: "Ready" | "Needs Practice" | "Critical Gap";
  }[];
  verdict: string;
} {
  const dsa = userStats.dsaScore ?? 70;
  const sys = userStats.systemDesignScore ?? 65;
  const beh = userStats.behavioralScore ?? 75;
  const res = userStats.resumeScore ?? 80;

  const overall = Math.round(dsa * 0.35 + sys * 0.3 + beh * 0.2 + res * 0.15);

  const getStatus = (val: number): "Ready" | "Needs Practice" | "Critical Gap" => {
    if (val >= 80) return "Ready";
    if (val >= 60) return "Needs Practice";
    return "Critical Gap";
  };

  return {
    overallReadiness: overall,
    breakdown: [
      { category: "Algorithms & DSA", score: dsa, status: getStatus(dsa) },
      { category: "System Design & Architecture", score: sys, status: getStatus(sys) },
      { category: "Company Principles & Behavioral (STAR)", score: beh, status: getStatus(beh) },
      { category: "ATS Resume Keyword Alignment", score: res, status: getStatus(res) },
    ],
    verdict:
      overall >= 80
        ? "Target Company Ready: Loop pass probability is high."
        : overall >= 65
        ? "Competitive: 2-3 focused mock rounds recommended."
        : "Foundational Gaps: Follow the structured Company PrepHub roadmap.",
  };
}
