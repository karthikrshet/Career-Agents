// packages/ai-router/services/router.ts
import { AIProviderId, RouterMode, AIMessage, RouterLog } from "../types";
import { PROVIDER_REGISTRY } from "./provider-registry";
import { classifyGatewayError } from "../utils/error-handler";
import { recordRouterLog } from "./analytics";
import { secureFetch, safeLogger } from "../../security";
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
                contents: [{ parts: [{ text: messages.map((m) => `${m.role}: ${m.content}`).join("\n") }] }],
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
                messages: messages.map((m) => ({ role: m.role === "system" ? "user" : m.role, content: m.content })),
                max_tokens: config.maxTokens || 4096,
                temperature: config.temperature ?? 0.7,
                stream: isStreaming,
              }
              : {
                model,
                messages,
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
  const inputTokens = Math.round(query.length / 4);
  const outputTokens = Math.round(finalContent.length / 4);
  const costUSD = (inputTokens * 0.0000015 + outputTokens * 0.000002);

  // Record logs
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
      mockResponse = `Hello${candidateName ? " **" + candidateName + "**" : ""}! I'm your AI Career Copilot, backed by **146 specialist career agents**.\n\nI can help you with:\n- 📄 **Resume & ATS optimization** — bullet rewrites, keyword injection, scoring\n- 💼 **Job search strategy** — targeting companies, outreach templates, referrals\n- 🎤 **Interview preparation** — STAR method, mock sessions, DSA practice\n- 🐙 **GitHub portfolio review** — code quality, CI/CD, documentation\n- 🔗 **LinkedIn optimization** — headline, summary, recruiter outreach\n- 🗺️ **Career roadmap** — 30/60/90-day plans, salary negotiation, promotion paths\n\nWhat would you like to work on today?`;
    } else {
      // Agent-aware response engine: match query against the 146-agent registry
      let agentInsights = "";
      let intentLabel = "";

      try {
        // Dynamic import to avoid circular dep at module load time
        const { findMatchingAgents, getCachedAgentPrompt } = await import("../../brain/router");
        const { detectUserIntent } = await import("../../brain/intent");

        const intentResult = detectUserIntent(query);
        intentLabel = intentResult.intent;

        const matchedAgents = findMatchingAgents(query, 3);

        if (matchedAgents.length > 0) {
          const agentSections = matchedAgents.map((agent) => {
            const fullPrompt = getCachedAgentPrompt(agent.filename);
            // Extract actionable guidance from the agent's prompt (first 600 chars, clean markdown)
            const guidance = fullPrompt
              ? fullPrompt.replace(/#+\s*/g, "").replace(/\*\*/g, "").slice(0, 600).trim()
              : agent.description;

            return `**${agent.emoji || "🤖"} ${agent.name}** *(${agent.division})*\n${guidance}`;
          }).join("\n\n---\n\n");

          agentInsights = agentSections;
        }
      } catch (importErr) {
        safeLogger.warn("Agent registry import failed in fallback:", importErr);
      }

      // Build context prefix
      const contextLines: string[] = [];
      if (candidateName) contextLines.push(`Candidate: **${candidateName}**`);
      if (targetRole) contextLines.push(`Target Role: **${targetRole}**`);
      if (resumeScore) contextLines.push(`ATS Score: **${resumeScore}**`);
      if (trackedSkills) contextLines.push(`Skills: ${trackedSkills}`);
      const contextPrefix = contextLines.length > 0 ? contextLines.join(" · ") + "\n\n" : "";

      if (agentInsights) {
        mockResponse = `${contextPrefix}Here's what our specialist agents recommend for: *"${query}"*\n\n${agentInsights}\n\n---\n💡 **Tip:** Add a Groq or Gemini API key in **Settings → API Keys** to get live, personalised AI responses from our full Career Agent ecosystem.`;
      } else {
        // Broad intent-based responses when no specific agent matches
        const intentResponses: Record<string, string> = {
          resume: `**Resume Optimization Guidance**\n\n${contextPrefix}To land interviews at top tech companies, your resume needs:\n\n1. **Quantified STAR bullets** — *"Reduced API latency by 45% by refactoring to async microservices (Node.js + Go), supporting 10k concurrent users"*\n2. **ATS keyword alignment** — Mirror exact terms from job descriptions: React, TypeScript, System Design, CI/CD, REST APIs\n3. **Strong Summary** — One punchy paragraph: role + years + top 3 skills + biggest win\n4. **Project Impact** — Every project needs a metric: users, revenue, uptime, performance gain\n\nShare your resume or a job description and I'll provide a detailed ATS analysis.`,
          job_search: `**Job Search Strategy for Software Engineers**\n\n${contextPrefix}${targetRole ? `For **${targetRole}** roles, here's your action plan:\n\n` : ""}1. **Target companies by tier** — Dream (FAANG+), Realistic (Series B-D), Safe (stable mid-size)\n2. **Referral-first approach** — 70% of hires come via referrals. Find connections on LinkedIn who work at target companies\n3. **Optimise application materials** — ATS-friendly resume + tailored cover letter per company\n4. **Technical preparation** — LeetCode (Arrays, Trees, DP, Graphs), 2 system design problems/week\n5. **Timeline** — Applications → Phone screens (1-2 weeks) → Technical interviews (2-4 weeks) → Offer\n\n*Which companies are you targeting? I can help craft personalised outreach messages.*`,
          interview: `**Interview Preparation Roadmap**\n\n${contextPrefix}For software engineering interviews, master these areas:\n\n**Behavioral (STAR Method)**\n- Structure every answer: *Situation → Task → Action → Result*\n- Prepare 8-10 stories covering leadership, conflict, failure, success\n- Key questions: "Tell me about a time you disagreed with your manager", "Describe a technically complex project"\n\n**Technical (DSA)**\n- Arrays/Strings, Hash Maps, Trees/Graphs, Dynamic Programming, Sliding Window\n- Practice 2-3 LeetCode problems daily (Easy → Medium → Hard progression)\n\n**System Design**\n- URL shortener, Twitter feed, Uber, WhatsApp — know these cold\n- Master: load balancers, caching (Redis), databases (sharding/indexing), message queues\n\n*Would you like a mock interview session or a 30-day preparation plan?*`,
          github: `**GitHub Portfolio Optimisation**\n\n${contextPrefix}To pass technical recruiter reviews:\n\n1. **Pin 4-6 impressive projects** — Full-stack apps with real users or metrics\n2. **READMEs that sell** — Problem statement, tech stack badge row, screenshots, live demo link, setup guide\n3. **Consistent green grid** — Aim for daily commits; even documentation updates count\n4. **CI/CD pipelines** — Add GitHub Actions for lint, test, and deploy — shows production mindset\n5. **Code quality signals** — Tests (>60% coverage), TypeScript, ESLint, proper error handling\n\nShare your GitHub URL for a detailed audit.`,
          linkedin: `**LinkedIn Profile Optimisation**\n\n${contextPrefix}Key areas to maximise recruiter visibility:\n\n1. **Headline** — *"Software Engineer | React · Node.js · System Design | Open to Opportunities"*\n2. **About section** — 3 paragraphs: who you are, what you build, what you're looking for\n3. **Experience bullets** — STAR format with metrics, same as your resume\n4. **Skills section** — Add 50 skills, get endorsements for top 10\n5. **Activity** — Post 1-2 technical articles/week to appear in recruiter feeds\n6. **Connection strategy** — 20 targeted connection requests/day to engineers and recruiters at target companies`,
          salary: `**Salary Negotiation Framework**\n\n${contextPrefix}Data-driven negotiation approach:\n\n1. **Know your market rate** — Check levels.fyi, Glassdoor, Blind, and LinkedIn Salary for your role + YoE + location\n2. **Always negotiate** — 85% of offers have flexibility; never accept the first number\n3. **Script** — *"I'm very excited about this offer. Based on my research and experience, I was expecting something closer to [$X]. Is there flexibility there?"*\n4. **Negotiate the full package** — Base + equity (RSUs) + signing bonus + PTO + remote flexibility\n5. **Use competing offers** — Even a recruiter call generates leverage\n\n*Share the offer details and your YoE for personalised negotiation advice.*`,
          roadmap: `**Career Roadmap Planning**\n\n${contextPrefix}${targetRole ? `For **${targetRole}**, here's a structured progression:\n\n` : ""}**30-Day Sprint**\n- Audit resume and LinkedIn profile\n- Apply to 5-10 companies/week\n- Solve 3 LeetCode problems daily\n\n**60-Day Milestone**\n- Complete 2 technical phone screens\n- Build or polish 1 major portfolio project\n- Reach out to 50 relevant connections\n\n**90-Day Goal**\n- Land 2-3 final round interviews\n- Have competing offers for negotiation leverage\n- Secure and sign target offer\n\n*Want me to build a personalised weekly plan based on your target companies?*`,
        };

        const response = intentResponses[intentLabel] || intentResponses["job_search"];
        mockResponse = response + `\n\n---\n💡 **Tip:** Add a Groq or Gemini API key in **Settings → API Keys** to unlock live, personalised AI responses from the full 146-agent Career ecosystem.`;
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
