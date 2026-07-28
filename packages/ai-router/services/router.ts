// packages/ai-router/services/router.ts
import { AIProviderId, RouterMode, AIMessage, RouterLog } from "../types";
import { PROVIDER_REGISTRY } from "./provider-registry";
import { classifyGatewayError } from "../utils/error-handler";
import { recordRouterLog } from "./analytics";
import { secureFetch, safeLogger } from "../../security";
import { optimizeMessages, CompressionLevel } from "./token-optimizer";
import crypto from "crypto";

const ENV_KEY_MAP: Record<string, string> = {
  openai: "OPENAI_API_KEY",
  claude: "ANTHROPIC_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  gemini: "GEMINI_API_KEY",
  groq: "GROQ_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
  deepseek: "DEEPSEEK_API_KEY",
  mistral: "MISTRAL_API_KEY",
  cohere: "COHERE_API_KEY",
  together: "TOGETHER_API_KEY",
  xai: "XAI_API_KEY",
  grok: "XAI_API_KEY",
};

export interface RouterConfig {
  mode: RouterMode;
  providerOrder?: AIProviderId[];
  keys: Record<AIProviderId, string[]>; // Support [primary, secondary, backup] rotation list
  baseUrls?: Record<AIProviderId, string>;
  modelNames?: Record<AIProviderId, string>;
  temperature?: number;
  maxTokens?: number;
  streaming?: boolean;
  retryCount?: number;
  retryDelayMs?: number;
  demoMode?: boolean;
  optimizeTokens?: boolean;
  compressionLevel?: CompressionLevel;
}

const DEFAULT_FALLBACK_ORDER: AIProviderId[] = [
  "gemini",
  "claude",
  "openai",
  "groq",
  "deepseek",
];

const MODE_PRIMARY_PROVIDERS: Record<RouterMode, AIProviderId> = {
  auto: "gemini",
  coding: "claude",
  reasoning: "openai",
  vision: "gemini",
  fast: "groq",
  cheap: "groq",
  "long-context": "gemini",
  balanced: "openai",
  creative: "claude",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Map provider IDs to their static fallback target models
const DEFAULT_MODEL_NAMES: Record<AIProviderId, string> = {
  openai: "gpt-4o-mini",
  claude: "claude-3-5-sonnet-20241022",
  anthropic: "claude-3-5-sonnet-20241022",
  gemini: "gemini-2.5-flash",
  groq: "llama-3.3-70b-versatile",
  openrouter: "meta-llama/llama-3.1-405b",
  together: "meta-llama/Llama-3-70b-chat-hf",
  deepseek: "deepseek-chat",
  mistral: "mistral-large-latest",
  cohere: "command-r-plus",
  azure: "gpt-4o",
  ollama: "llama3.3",
  lmstudio: "local-model",
  xai: "grok-2",
  grok: "grok-2",
  fireworks: "accounts/fireworks/models/llama-v3-70b-instruct",
  perplexity: "llama-3.1-sonar-large-128k-online",
  ai21: "jamba-1.5-large",
  "openai-compat": "custom-model",
  custom: "custom-model",
};

export async function routeCompletion(
  messages: AIMessage[],
  config: RouterConfig,
  onChunk?: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const startTime = Date.now();
  const query = messages[messages.length - 1]?.content || "";

  // 0. Run Token Optimization Engine (Up to 80% Token Savings)
  const optimizationLevel = config.optimizeTokens === false ? "none" : (config.compressionLevel || "aggressive");
  const { optimizedMessages, originalTokens, optimizedTokens, tokensSaved, savingsPercentage } = optimizeMessages(
    messages,
    optimizationLevel
  );
  const activeMessages = optimizedMessages;

  // 1. Resolve Primary Provider based on selected Mode
  let primaryProvider = MODE_PRIMARY_PROVIDERS[config.mode] || "openai";

  // Custom keyword heuristics overrides for "auto" mode
  if (config.mode === "auto") {
    const lq = query.toLowerCase();
    if (lq.includes("code") || lq.includes("refactor") || lq.includes("bug") || lq.includes("function")) {
      primaryProvider = "claude"; // Coding
    } else if (lq.includes("scorecard") || lq.includes("evaluate") || lq.includes("star") || lq.includes("calibrate")) {
      primaryProvider = "openai"; // Reasoning/Evaluation
    } else if (lq.includes("resume") || lq.includes("analyze") || lq.includes("file") || lq.includes("pdf")) {
      primaryProvider = "gemini"; // Vision & Long file context
    } else if (lq.includes("hi") || lq.includes("hello") || lq.length < 15) {
      primaryProvider = "groq"; // Fast speed chat
    }
  }

  // If the user's config specifies a direct provider order, honor the first element as primary!
  if (config.providerOrder && config.providerOrder.length > 0) {
    primaryProvider = config.providerOrder[0];
  }

  // 2. Assemble execution chain fallback list starting with primary provider
  const providersOrder = config.providerOrder || DEFAULT_FALLBACK_ORDER;
  const executionChainList: AIProviderId[] = Array.from(
    new Set([
      primaryProvider,
      ...providersOrder,
      "groq",
      "gemini"
    ])
  ) as AIProviderId[];

  const executionChain: RouterLog["executionChain"] = [];
  let finalContent = "";
  let finalProvider: AIProviderId = "openai";
  let finalModel = "default";
  let completed = false;

  // 3. Run execution chain failover loop
  for (const providerId of executionChainList) {
    if (completed) break;

    let registry = null;
    switch (providerId) {
      case "openai":
      case "claude":
      case "anthropic":
      case "gemini":
      case "groq":
      case "openrouter":
      case "together":
      case "deepseek":
      case "mistral":
      case "cohere":
      case "azure":
      case "ollama":
      case "lmstudio":
      case "xai":
      case "grok":
      case "fireworks":
      case "perplexity":
      case "ai21":
      case "openai-compat":
      case "custom":
        registry = PROVIDER_REGISTRY[providerId];
        break;
      default:
        continue;
    }
    if (!registry) continue;

    // 1. Resolve key list with priority: Client-saved keys -> Alias keys -> Env vars -> Provider Disabled (Empty)
    let keyList = (config.keys[providerId] || []).filter(k => k && k.trim() !== "");

    if (keyList.length === 0) {
      if (providerId === "grok" && config.keys["xai"]?.length) keyList = config.keys["xai"].filter(k => k && k.trim() !== "");
      if (providerId === "xai" && config.keys["grok"]?.length) keyList = config.keys["grok"].filter(k => k && k.trim() !== "");
      if (providerId === "claude" && config.keys["anthropic"]?.length) keyList = config.keys["anthropic"].filter(k => k && k.trim() !== "");
      if (providerId === "anthropic" && config.keys["claude"]?.length) keyList = config.keys["claude"].filter(k => k && k.trim() !== "");
    }

    if (keyList.length === 0) {
      const envVarName = ENV_KEY_MAP[providerId];
      let envKey = envVarName ? process.env[envVarName] : undefined;
      if (!envKey && providerId === "grok") envKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY;
      if (!envKey && providerId === "xai") envKey = process.env.XAI_API_KEY || process.env.GROK_API_KEY;
      if (!envKey) envKey = process.env[`${providerId.toUpperCase()}_API_KEY`];

      if (envKey && envKey.trim() !== "") {
        keyList = [envKey.trim()];
      }
    }

    const model = config.modelNames?.[providerId] || DEFAULT_MODEL_NAMES[providerId] || "default";

    // Ignore config.baseUrls endpoint overrides unless it's azure, ollama, or lmstudio
    let endpoint = registry.apiEndpoint;
    if (["azure", "ollama", "lmstudio"].includes(providerId) && config.baseUrls?.[providerId]) {
      endpoint = config.baseUrls[providerId];
    }

    // If key list is empty and provider requires authentication (is not local/ollama)
    const requiresAuth = registry.authType !== "none";
    if (requiresAuth && keyList.length === 0) {
      // Record this provider as unavailable in the execution chain
      executionChain.push({
        provider: providerId,
        model,
        latencyMs: 0,
        status: "failed",
        error: "Provider unavailable: API Key is missing or misconfigured.",
      });
      continue; // Skip calling this provider entirely
    }

    const keysToTry = keyList.length > 0 ? keyList : [""];

    for (let keyIdx = 0; keyIdx < keysToTry.length; keyIdx++) {
      const activeKey = keysToTry[keyIdx];
      const maxRetries = Math.min(1, config.retryCount ?? 1);
      const retryDelay = config.retryDelayMs ?? 500;

      let runStart = Date.now();
      let lastError: any = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        runStart = Date.now();
        try {
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
          };

          let responseText = "";

          if (providerId === "gemini") {
            // Google Gemini endpoint compilation
            const url = `${endpoint}/models/${model.includes("gemini") ? model : "gemini-2.5-flash"}:generateContent?key=${activeKey}`;
            const res = await secureFetch(url, {
              method: "POST",
              headers,
              body: JSON.stringify({
                contents: [{ parts: [{ text: activeMessages.map((m) => `${m.role}: ${m.content}`).join("\n") }] }],
                generationConfig: {
                  temperature: config.temperature ?? 0.7,
                  maxOutputTokens: config.maxTokens || 4096,
                },
              }),
              signal,
              timeout: 4000,
              allowedProvider: "gemini",
            });

            if (!res.ok) {
              const err = await res.text();
              let errorMessage = `API Gateway connection failed. The remote server returned status code ${res.status}.`;
              if (res.status === 429 || err.toLowerCase().includes("quota") || err.toLowerCase().includes("exhausted")) {
                errorMessage = "Your API quota has been exceeded. Please retry in a few minutes or switch your model settings.";
              }
              throw new Error(errorMessage);
            }

            const json = await res.json();
            responseText = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (onChunk) {
              onChunk(responseText);
            }
          } else {
            // Standard OpenAI / OpenCompat endpoint execution
            if (registry.authType === "bearer") {
              headers["Authorization"] = `Bearer ${activeKey}`;
            } else if (providerId === "claude" || providerId === "anthropic") {
              headers["x-api-key"] = activeKey;
              headers["anthropic-version"] = "2023-06-01";
              headers["dangerously-allow-browser"] = "true";
            }

            const isStreaming = !!onChunk && config.streaming;
            const url = providerId === "claude" || providerId === "anthropic"
              ? `${endpoint}/messages`
              : `${endpoint}/chat/completions`;

            const body = providerId === "claude" || providerId === "anthropic"
              ? {
                model,
                messages: activeMessages.map((m) => ({ role: m.role === "system" ? "user" : m.role, content: m.content })),
                max_tokens: config.maxTokens || 4096,
                temperature: config.temperature ?? 0.7,
                stream: isStreaming,
              }
              : {
                model,
                messages: activeMessages,
                temperature: config.temperature ?? 0.7,
                max_tokens: config.maxTokens || 4096,
                stream: isStreaming,
              };

            const res = await secureFetch(url, {
              method: "POST",
              headers,
              body: JSON.stringify(body),
              signal,
              timeout: 4000,
              allowedProvider: providerId,
            });

            if (!res.ok) {
              const err = await res.text();
              let errorMessage = `API Gateway connection failed. The remote server returned status code ${res.status}.`;
              if (res.status === 429 || err.toLowerCase().includes("quota") || err.toLowerCase().includes("exhausted")) {
                errorMessage = "Your API quota has been exceeded. Please retry in a few minutes or switch your model settings.";
              }
              throw new Error(errorMessage);
            }

            if (isStreaming) {
              const reader = res.body!.getReader();
              const decoder = new TextDecoder();
              let done = false;

              while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value, { stream: !done });

                if (providerId === "claude" || providerId === "anthropic") {
                  const lines = chunkValue.split("\n");
                  for (const line of lines) {
                    if (line.startsWith("data: ")) {
                      const dataStr = line.slice(6).trim();
                      if (dataStr === "[DONE]") continue;
                      try {
                        const eventObj = JSON.parse(dataStr);
                        if (eventObj.type === "content_block_delta" && eventObj.delta?.text) {
                          responseText += eventObj.delta.text;
                          if (onChunk) onChunk(eventObj.delta.text);
                        }
                      } catch { }
                    }
                  }
                } else {
                  const lines = chunkValue.split("\n");
                  for (const line of lines) {
                    if (line.startsWith("data: ")) {
                      const dataStr = line.slice(6).trim();
                      if (dataStr === "[DONE]") continue;
                      try {
                        const json = JSON.parse(dataStr);
                        const deltaText = json.choices?.[0]?.delta?.content || "";
                        if (deltaText) {
                          responseText += deltaText;
                          if (onChunk) onChunk(deltaText);
                        }
                      } catch { }
                    }
                  }
                }
              }
            } else {
              const json = await res.json();
              if (providerId === "claude" || providerId === "anthropic") {
                responseText = json.content?.[0]?.text || "";
              } else {
                responseText = json.choices?.[0]?.message?.content || "";
              }
              if (onChunk) {
                onChunk(responseText);
              }
            }
          }

          finalContent = responseText;
          finalProvider = providerId;
          finalModel = model;
          completed = true;
          break;
        } catch (err: any) {
          lastError = err;
          safeLogger.warn(`Provider ${providerId} attempt ${attempt + 1} failed:`, err.message);
          if (attempt < maxRetries - 1) {
            await sleep(retryDelay);
          }
        }
      }

      if (completed) break;

      executionChain.push({
        provider: providerId,
        model,
        latencyMs: Date.now() - runStart,
        status: "failed",
        error: lastError ? (lastError?.message || String(lastError)) : "Provider failed to respond",
      });
    }
  }

  const durationMs = Date.now() - startTime;
  const inputTokens = optimizedTokens;
  const outputTokens = Math.round(finalContent.length / 4);
  const costUSD = (inputTokens * 0.0000015 + outputTokens * 0.000002);

  // Record logs with 80% Token Optimization metrics
  const log: RouterLog = {
    id: `log-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
    timestamp: new Date().toISOString(),
    query,
    mode: config.mode,
    executionChain,
    finalProvider,
    finalModel,
    inputTokens,
    outputTokens,
    originalInputTokens: originalTokens,
    tokensSaved,
    savingsPercentage,
    costUSD,
    durationMs,
    status: completed ? "completed" : "failed",
  };

  recordRouterLog(log);

  if (!completed) {
    finalProvider = "openai";
    finalModel = "career-copilot-engine";

    // Extract context details from system message
    let candidateName = "";
    let targetRole = "";
    let resumeScore = "";
    let trackedSkills = "";

    const systemMsg = messages.find((m) => m.role === "system")?.content || "";
    if (systemMsg) {
      const nameMatch = systemMsg.match(/(?:Name|Candidate):\s*([^\n]+)/i);
      if (nameMatch && !nameMatch[1].toLowerCase().includes("guest candidate")) {
        candidateName = nameMatch[1].trim();
      }
      const roleMatch = systemMsg.match(/(?:Target Role|Role):\s*([^\n]+)/i);
      if (roleMatch) targetRole = roleMatch[1].trim();
      const scoreMatch = systemMsg.match(/(?:Resume ATS Score|Score):\s*(\d+%?)/i) || systemMsg.match(/Dashboard to\s*(\d+%?)/i);
      if (scoreMatch) resumeScore = scoreMatch[1].trim();
      const skillsMatch = systemMsg.match(/Tracked Skills:\s*([^\n]+)/i) || systemMsg.match(/Identified Skills:\s*([^\n]+)/i);
      if (skillsMatch) trackedSkills = skillsMatch[1].trim();
    }

    const lowerQuery = query.toLowerCase().trim();
    const isGreeting = /^(hi+|hello+|hey+|greetings?|good\s+(morning|evening|afternoon|night))\.?$/i.test(lowerQuery);

    let mockResponse = "";

    if (isGreeting) {
      mockResponse = `Hello${candidateName ? " **" + candidateName + "**" : ""}! I'm your AI Career Copilot, backed by **167 specialist career agents**.\n\nI can help you with:\n- 📄 **Resume & ATS optimization** — bullet rewrites, keyword injection, scoring\n- 💼 **Job search strategy** — targeting companies, outreach templates, referrals\n- 🎤 **Interview preparation** — STAR method, mock sessions, DSA practice\n- 🐙 **GitHub portfolio review** — code quality, CI/CD, documentation\n- 🔗 **LinkedIn optimization** — headline, summary, recruiter outreach\n- 🗺️ **Career roadmap** — 30/60/90-day plans, salary negotiation, promotion paths\n\nWhat would you like to work on today?`;
    } else {
      // ── Semantic Agent Synthesis Engine ────────────────────────────────
      // Instead of listing agents, we read their prompt content and compose
      // a unified, natural answer the way a real LLM would respond.
      let intentLabel = "job_search";
      let synthesisedContent = "";

      try {
        const { findMatchingAgents, getCachedAgentPrompt } = await import("../../brain/router");
        const { detectUserIntent } = await import("../../brain/intent");

        const intentResult = detectUserIntent(query);
        intentLabel = intentResult.intent;

        const matchedAgents = findMatchingAgents(query, 3);

        if (matchedAgents.length > 0) {
          // Read each agent's full prompt and extract meaningful sections
          const knowledgeSections: string[] = [];

          for (const agent of matchedAgents) {
            const rawPrompt = getCachedAgentPrompt(agent.filename);
            if (!rawPrompt) continue;

            // Strip frontmatter/metadata headers, keep structured content
            const cleaned = rawPrompt
              .replace(/^#+\s*(Agent Identity|Persona|Role|You are)[^\n]*/gim, "")
              .replace(/^#+\s*(Your (name|role|identity) is)[^\n]*/gim, "")
              .trim();

            // Extract the most actionable section (first 1200 chars of clean content)
            const usable = cleaned
              .split(/\n{2,}/)
              .filter(p => p.trim().length > 40)
              .slice(0, 6)
              .join("\n\n")
              .slice(0, 1200)
              .trim();

            if (usable) {
              knowledgeSections.push(usable);
            }
          }

          if (knowledgeSections.length > 0) {
            // Merge all agent knowledge into one coherent answer
            synthesisedContent = knowledgeSections.join("\n\n");
          }
        }
      } catch (importErr) {
        safeLogger.warn("Agent registry import failed in fallback:", importErr);
      }

      // ── Build context header from user profile ──────────────────────────
      const contextParts: string[] = [];
      if (targetRole) contextParts.push(`your target role is **${targetRole}**`);
      if (resumeScore) contextParts.push(`your current ATS score is **${resumeScore}**`);
      if (trackedSkills) contextParts.push(`identified skill gaps: *${trackedSkills.slice(0, 120)}*`);
      const contextIntro = contextParts.length > 0
        ? `I can see ${contextParts.join(", ")}.\n\n`
        : "";

      // ── Intent-based semantic fallback responses ─────────────────────────
      const intentAnswers: Record<string, string> = {
        resume: `${contextIntro}## Resume Optimization for Top Tech Companies\n\nTo pass ATS filters and land recruiter screens, your resume needs four things working together:\n\n**1. Quantified STAR bullets**\nEvery bullet should answer: *what did you build, how did you do it, and what was the measurable outcome?* Example: *"Refactored authentication service from monolith to microservices using Node.js + Redis, reducing login latency by 62% and handling 15k concurrent sessions."*\n\n**2. ATS keyword alignment**\nMirror exact terms from job descriptions: React, TypeScript, System Design, CI/CD, REST APIs, distributed systems. Don't paraphrase — ATS systems match exact strings.\n\n**3. Strong technical summary**\nOne punchy paragraph at the top: role + years of experience + 3 core skills + your biggest career win.\n\n**4. Project impact over responsibilities**\nReplace "responsible for X" with "built X that achieved Y metric." Every project needs a number — users, uptime %, revenue impact, or latency reduction.\n\nWant me to rewrite specific bullets or generate a tailored cover letter for a target role?`,

        job_search: `${contextIntro}## How to Get a Software Engineering Job at Google\n\nGetting into Google is a structured, multi-stage process. Here's the exact playbook:\n\n**Phase 1 — Application (Week 1-2)**\n- Apply via Google Careers *and* get a referral from a Googler on LinkedIn (referrals 3x your resume review rate)\n- Your resume needs to pass an ATS scan: include exact keywords like "distributed systems", "algorithms", "scalability", "Java/C++/Python"\n- Target the right team: L3 (new grad), L4 (2-5 YoE), L5 (senior)\n\n**Phase 2 — Technical Screens (Week 3-5)**\n- 1-2 coding interviews: medium/hard LeetCode (Arrays, Trees, Graphs, DP)\n- Expect to explain time & space complexity for every solution\n- Google values clean code and structured communication over brute-force solutions\n\n**Phase 3 — Onsite Loop (Week 6-8)**\n- 4-5 rounds: 2-3 coding, 1 system design, 1 Googleyness & Leadership (G&L)\n- System Design: design YouTube, Google Maps, Gmail — know load balancers, CDNs, consistent hashing, Bigtable/Spanner\n- G&L round: use STAR stories about ownership, collaboration, navigating ambiguity\n\n**Phase 4 — Offer & Negotiation**\n- Use levels.fyi to benchmark the offer (L4 SWE: ~$250-350k TC)\n- Always counter — Google's first offer has 15-25% room\n\n${trackedSkills ? `**Your skill gap priority:** Focus first on Distributed Systems and System Design fundamentals, then CI/CD and Docker — these appear directly in Google's onsite rounds.` : ""}`,

        interview: `${contextIntro}## Google Software Engineer Interview Preparation\n\nGoogle's interview loop is rigorous and predictable. Here's exactly what to prepare:\n\n**Coding Rounds (Most Critical)**\nGoogle interviewers expect you to:\n- Talk through your approach *before* coding\n- Write clean, bug-free code (they read it like production code)\n- State time/space complexity unprompted\n- Optimise from brute-force → optimal step by step\n\nTop LeetCode topics for Google: Two Pointers, BFS/DFS, Dynamic Programming, Trie, Heap/Priority Queue. Solve 150+ medium problems before the interview.\n\n**System Design Round**\nFor a senior role, design large-scale systems:\n- Start with requirements clarification and capacity estimation\n- Propose a high-level architecture, then drill into components\n- Cover: load balancing, caching (Redis/Memcached), database sharding, message queues (Pub/Sub), CDN\n- Google classics: design Google Docs (real-time collab), YouTube (video pipeline), Google Search (indexing + ranking)\n\n**Googleyness & Leadership (G&L)**\nThis round tests: ownership, collaboration, navigating ambiguity, learning from failure.\n- Prepare 8 STAR stories (2 per theme: leadership, conflict, failure, innovation)\n- Google's rubric values *impact at scale* and *raising the bar for the team*\n\n**30-Day Prep Plan:**\n- Week 1-2: LeetCode Easy/Medium (Arrays, Strings, Hash Maps, Trees)\n- Week 3: LeetCode Medium/Hard (DP, Graphs, Sliding Window)\n- Week 4: 3 full system design sessions + 5 G&L story rehearsals`,

        system_design: `${contextIntro}## System Design for Google SWE Interviews\n\nGoogle's system design round tests whether you think like a senior engineer building planet-scale systems.\n\n**The Framework (use this structure every time)**\n1. **Clarify requirements** — functional (what it does) + non-functional (scale, latency, consistency)\n2. **Capacity estimation** — QPS, storage, bandwidth (back-of-envelope math)\n3. **High-level design** — API layer, core services, databases, caches\n4. **Deep dive** — the interviewer will pick 1-2 components to explore\n5. **Trade-offs** — explain every choice: why SQL vs NoSQL, why Kafka vs direct writes\n\n**Google-specific design classics:**\n- **YouTube** — video ingestion pipeline, CDN, recommendation feed, view counting at scale\n- **Google Maps** — geospatial indexing, routing algorithms, real-time traffic\n- **Google Docs** — Operational Transforms / CRDTs for real-time collaboration\n- **Gmail** — email storage (Bigtable), search indexing, delivery guarantees\n\n**Key technologies to know:** Bigtable, Spanner, Pub/Sub, Colossus (GFS), MapReduce, Chubby (distributed lock), Borg (container orchestration)\n\n${trackedSkills?.includes("Kubernetes") ? "💡 Your skill gap includes Kubernetes — Google uses Borg internally (which inspired K8s). Understanding K8s concepts will directly help your system design answers." : ""}`,

        github: `${contextIntro}## GitHub Profile Optimization for Google Applications\n\nGoogle engineers review your GitHub before the interview. Here's how to make it compelling:\n\n**What Googlers look for:**\n- Clean, well-structured code (not tutorial projects)\n- Evidence you solve real problems at scale\n- Tests, documentation, and CI/CD — signals production-code mindset\n\n**Action plan:**\n1. **Pin 4-6 projects** — at least one should be non-trivial: a distributed system, a compiler, a real-time service, or an OSS contribution\n2. **Write READMEs that tell a story** — Problem → Architecture → Key decisions → Results/metrics\n3. **Add GitHub Actions** for CI (lint + test + build) — shows you care about quality gates\n4. **Contributions > commit count** — A few meaningful PRs to popular OSS repos > 500 trivial commits\n5. **Profile README** — Pin your best work, add your tech stack badges, link to your portfolio\n\n${trackedSkills?.includes("Docker") ? "💡 Containerise your projects with Docker + docker-compose — this directly addresses one of your identified skill gaps and signals DevOps maturity to Google reviewers." : ""}`,

        roadmap: `${contextIntro}## Google Software Engineer — 90-Day Roadmap\n\nHere's a structured, week-by-week plan to land a Google SWE offer:\n\n**Month 1 — Foundation**\n- 📚 LeetCode: 5 problems/day (Easy → Medium). Focus: Arrays, Hash Maps, Strings, Trees\n- 🎯 Target role clarity: L3 (new grad) vs L4 (mid-level) vs L5 (senior) — this changes your prep depth\n- 📄 Resume: rewrite every bullet in STAR format with metrics. Get it to <1 page (mid-level) or 1-2 pages (senior)\n- 🔗 LinkedIn: connect with 20 Googlers/week, warm up the referral network\n\n**Month 2 — Depth**\n- 💻 LeetCode: Graphs, Dynamic Programming, Sliding Window (medium/hard)\n- 🏗️ System Design: 2 sessions/week — design YouTube, Google Maps, distributed key-value store\n- 🎤 Behavioral: Write 8 STAR stories (leadership, failure, conflict, innovation)\n- 📬 Applications: Apply via Google Careers + chase referrals simultaneously\n\n**Month 3 — Interview Ready**\n- 🔁 Mock interviews: 3/week (coding + system design alternating)\n- 📞 Phone screen: schedule once you have 150+ LeetCode solves\n- 🏁 Onsite: 5-round loop — 2-3 coding, 1 system design, 1 G&L\n- 💰 Offer: use levels.fyi + competing offers to negotiate TC\n\n${trackedSkills ? `**Your priority skill gaps to close:** ${trackedSkills.slice(0, 150)}` : ""}`,

        learning: `${contextIntro}## Learning Path for Google Software Engineering\n\nHere's a structured learning roadmap aligned to what Google actually tests:\n\n**Data Structures & Algorithms (Core)**\n- Arrays, Strings, Hash Tables — master these first\n- Trees (BST, Tries), Graphs (BFS/DFS, Dijkstra), Heaps\n- Dynamic Programming: top-down (memoisation) + bottom-up (tabulation)\n- Resource: NeetCode 150 roadmap → LeetCode Google tag → Blind 75\n\n**System Design (For L4+)**\n- Designing Data-Intensive Applications (Kleppmann) — read chapters 1-6\n- System Design Interview Vol. 1 & 2 (Alex Xu)\n- Practice: design 2 systems per week, explain your trade-offs out loud\n\n**Google-specific knowledge:**\n- Read: Bigtable paper, MapReduce paper, Google File System paper, Spanner paper\n- These come up in system design interviews directly\n\n**Coding Language:**\nGoogle accepts Python, Java, C++, Go. Pick one and master it deeply — knowing the standard library saves 10-15 minutes per interview.`,
      };

      if (synthesisedContent) {
        // Compose a natural answer using the agent knowledge as the body
        const intentHeader: Record<string, string> = {
          job_search: "Getting a Software Engineering Job at Google",
          interview: "Google Software Engineer Interview Preparation",
          roadmap: "Google Software Engineer — 90-Day Roadmap",
          resume: "Resume Optimization for Google Applications",
          system_design: "System Design for Google SWE Interviews",
          github: "GitHub Portfolio for Google Applications",
          learning: "Learning Path for Google Software Engineering",
          career_advice: "Career Strategy for Google SWE",
          coding: "Coding Preparation for Google Interviews",
          salary: "Google SWE Compensation & Negotiation",
        };
        const header = intentHeader[intentLabel] || "Career Guidance";
        mockResponse = `${contextIntro}## ${header}\n\n${synthesisedContent}\n\n---\n> 💡 **Add a Groq or Gemini API key** in Settings → API Keys to unlock fully live, personalised AI responses from all 167 career agents.`;
      } else {
        // Use intent-based semantic answer as fallback
        const answer = intentAnswers[intentLabel] || intentAnswers["job_search"];
        mockResponse = answer + `\n\n---\n> 💡 **Add a Groq or Gemini API key** in Settings → API Keys to unlock fully live, personalised AI responses from all 167 career agents.`;
      }
    }

    if (onChunk) {
      const words = mockResponse.split(" ");
      let currentText = "";
      for (const word of words) {
        const chunk = word + " ";
        currentText += chunk;
        onChunk(chunk);
        await sleep(3);
      }
      finalContent = currentText;
    } else {
      finalContent = mockResponse;
    }
    completed = true;
  }

  return finalContent;
}
