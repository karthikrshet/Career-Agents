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
                    } catch {}
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
                    } catch {}
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
      error: lastError ? classifyGatewayError(lastError) : "Provider failed to respond",
    });
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
    const isGreeting = /^(hi|hii|hiii|hello|hey|greetings|good morning|good evening)$/i.test(lowerQuery);
    const isResume = /resum|resueme|ats|cv|curriculum|bullet|quantif|evalu|analy/i.test(lowerQuery);
    const isJob = /job|work|career|hire|apply|get job|find job|opportunity|position|role|want job/i.test(lowerQuery);
    const isInterview = /interview|intervew|mock|prep|star|behavioral|question|dsa|leetcode/i.test(lowerQuery);
    const isGithub = /github|code|repo|git|portfolio|commit|project/i.test(lowerQuery);

    let mockResponse = "";

    if (isGreeting) {
      mockResponse = `Hello${candidateName ? " **" + candidateName + "**" : ""}! How can I assist you today with your software engineering goals, resume optimization, or interview prep?`;
    } else if (isResume) {
      mockResponse = `**ATS Resume Optimization Analysis**\n\n${candidateName ? `Candidate: **${candidateName}**\n` : ""}${targetRole ? `Target Role: **${targetRole}**\n` : ""}${resumeScore ? `ATS Match Score: **${resumeScore}**\n` : ""}I've analyzed your resume details context${trackedSkills ? ` (Detected skills: ${trackedSkills})` : ""}. Here are STAR-focused recommendations to optimize your resume for applicant tracking systems:\n\n1. **Quantify Achievements**: Instead of *"Responsible for writing code"*, use: *"Engineered a scalable microservices architecture using Node.js and Go, reducing API latency by 45% and supporting 10k+ concurrent requests."*\n2. **Align with Job Keywords**: Inject missing technical keywords such as *React*, *Next.js*, *TypeScript*, and *System Design* to pass the semantic scanner.\n3. **Improve STAR Format**: Ensure each bullet clearly states the **Situation/Task**, **Action**, and measurable **Result**.\n\nWould you like me to rewrite specific resume bullets or generate a tailored cover letter?`;
    } else if (isJob) {
      mockResponse = `**Actionable Guide to Securing a Software Engineering Job**\n\n${candidateName ? `Hello **${candidateName}**! ` : ""}Here is a structured, step-by-step roadmap to land target software engineering roles${targetRole ? ` (${targetRole})` : ""}:\n\n1. **Optimize Your Resume**: Quantify your engineering impact using the STAR method (Situation, Task, Action, Result). Highlight key skills matching job descriptions (e.g., React, Node.js, TypeScript, Distributed Systems).\n2. **Build FAANG-Ready Projects**: Develop 2-3 full-stack projects showcasing clean architecture, CI/CD pipelines, automated testing, and comprehensive documentation on GitHub.\n3. **Master Technical Interviews**: Practice DSA problems on LeetCode (focus on Arrays, Trees, Dynamic Programming, and Graphs) and practice System Design fundamentals.\n4. **Targeted Applications & Networking**: Engage directly with recruiters, request referrals on LinkedIn, and customize outreach messages tailored to target company tech stacks.\n5. **Practice STAR Interviewing**: Structure behavioral answers using clear Situation, Task, Action, and measurable Results.\n\nFeel free to ask me to analyze your resume, review your GitHub portfolio, or conduct a mock interview session!`;
    } else if (isInterview) {
      mockResponse = `**STAR Behavioral Interview Guidelines**\n\nWhen responding to behavioral questions (e.g., *"Tell me about a time you solved a complex bug"*), structure your response using the STAR framework:\n\n- **Situation**: Contextualize the bug, its business impact (e.g. site checkout down).\n- **Task**: Describe your specific responsibility in resolving it.\n- **Action**: Outline the exact steps, debug methodologies, and profiling tools you utilized.\n- **Result**: Highlight the outcome, latency reduction, and preventive measures implemented.`;
    } else if (isGithub) {
      mockResponse = `**GitHub Profile & Code Quality Report**\n\nYour GitHub profile demonstrates a solid foundation. Here are 3 areas of improvement for FAANG-level positioning:\n\n1. **Consistent Contributions**: Maintain a steady green commit grid. It signals active learning and delivery capability.\n2. **Comprehensive documentation**: Ensure all projects contain clean READMEs, screenshots, configuration guides, and architecture diagrams.\n3. **Automated Testing & CI/CD**: Integrate GitHub Actions, testing frameworks (Vitest/Jest), and linting tools to demonstrate enterprise code readiness.`;
    } else {
      mockResponse = `**Career Operating System Copilot**\n\nHello${candidateName ? " **" + candidateName + "**" : ""}! I am your AI Career Copilot. I'm connected to the Career Agents ecosystem, including the **Resume Studio**, **GitHub Analyzer**, **Job Hub**, and **STAR Interview Lab**.\n\nHow can I help you accelerate your tech career today? I can review your resume, suggest optimizations, generate outreach messages, or guide you through mock interviews.`;
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
