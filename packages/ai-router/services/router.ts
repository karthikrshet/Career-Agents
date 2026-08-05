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
  const executionChainList: AIProviderId[] = [
    primaryProvider,
    ...providersOrder.filter((p) => p !== primaryProvider),
  ];

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
      const maxRetries = Math.min(3, config.retryCount ?? 3);
      const retryDelay = config.retryDelayMs ?? 1000;

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
            timeout: 30000,
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
            timeout: 30000,
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
            
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

                for (const line of lines) {
                  const dataStr = line.slice(6).trim();
                  if (dataStr === "[DONE]") continue;

                  try {
                    const json = JSON.parse(dataStr);
                    const delta = json.choices?.[0]?.delta?.content || json.delta?.text || "";
                    if (delta) {
                      responseText += delta;
                      onChunk(delta);
                    }
                  } catch {}
                }
              }
            } finally {
              reader.releaseLock();
            }
          } else {
            const json = await res.json();
            responseText = json.choices?.[0]?.message?.content || json.content?.[0]?.text || "";
          }
        }

        finalContent = responseText;
        finalProvider = providerId;
        finalModel = model;
        completed = true;

        executionChain.push({
          provider: providerId,
          model,
          status: "success",
          latencyMs: Date.now() - runStart,
        });
        break; // break attempt loop
      } catch (err: any) {
        lastError = err;
        safeLogger.warn(`Gateway failed executing prompt with provider ${providerId} and key index ${keyIdx} on attempt ${attempt}`, err);
        if (attempt < maxRetries - 1) {
          const backoffDelay = retryDelay * Math.pow(2, attempt);
          await sleep(backoffDelay);
        }
      }
    }

    if (completed) {
      break; // break key loop
    } else {
      executionChain.push({
        provider: providerId,
        model,
        status: "failed",
        latencyMs: Date.now() - runStart,
        error: lastError?.message || "Unknown execution error",
      });
    }
  }
}

  const durationMs = Date.now() - startTime;
  const inputLen = messages.reduce((acc, m) => acc + m.content.length, 0);
  const inputTokens = Math.round(inputLen / 4.1); // Estimate
  const outputTokens = Math.round(finalContent.length / 4.1); // Estimate
  
  // Calculate cost estimation in USD
  const registry = PROVIDER_REGISTRY[finalProvider];
  const inputCost = (inputTokens / 1000000) * (registry?.pricing?.inputPerMillion || 0.0);
  const outputCost = (outputTokens / 1000000) * (registry?.pricing?.outputPerMillion || 0.0);
  const costUSD = inputCost + outputCost;

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
    if (config.demoMode) {
      finalProvider = "openai";
      finalModel = "gpt-4o-mini-mock";
      
      const lowerQuery = query.toLowerCase();
      let mockResponse = "";
      if (lowerQuery.includes("resume") || lowerQuery.includes("ats")) {
        mockResponse = `[DEMO MODE: SIMULATED RESPONSE]\n\n**ATS Resume Optimization Analysis**\n\nI've analyzed your career profile context and resume bullets. Here is a STAR-focused recommendation to optimize your resume for applicant tracking systems:\n\n1. **Quantify Achievements**: Instead of *"Responsible for writing code"*, use: *"Engineered a scalable microservices architecture using Node.js and Go, reducing API latency by 45% and supporting 10k+ concurrent requests."*\n2. **Align with Job Keywords**: Inject missing technical keywords such as *React*, *Next.js*, *TypeScript*, and *System Design* to pass the semantic scanner.\n3. **Improve STAR Format**: Ensure each bullet clearly states the **Situation/Task**, **Action**, and measurable **Result**.`;
      } else if (lowerQuery.includes("github") || lowerQuery.includes("code")) {
        mockResponse = `[DEMO MODE: SIMULATED RESPONSE]\n\n**GitHub Profile & Code Quality Report**\n\nYour GitHub profile demonstrates a solid foundation. Here are 3 areas of improvement for FAANG-level positioning:\n\n1. **Consistent Contributions**: Maintain a steady green commit grid. It signals active learning and delivery capability.\n2. **Comprehensive documentation**: Ensure all projects contain clean READMEs, screenshots, configuration guides, and architecture diagrams.\n3. **Automated Testing & CI/CD**: Integrate GitHub Actions, testing frameworks (Vitest/Jest), and linting tools to demonstrate enterprise code readiness.`;
      } else if (lowerQuery.includes("interview") || lowerQuery.includes("mock")) {
        mockResponse = `[DEMO MODE: SIMULATED RESPONSE]\n\n**STAR Behavioral Interview Guidelines**\n\nWhen responding to behavioral questions (e.g., *"Tell me about a time you solved a complex bug"*), structure your response using the STAR framework:\n\n- **Situation**: Contextualize the bug, its business impact (e.g. site checkout down).\n- **Task**: Describe your specific responsibility in resolving it.\n- **Action**: Outline the exact steps, debug methodologies, and profiling tools you utilized.\n- **Result**: Highlight the outcome, latency reduction, and preventive measures implemented.`;
      } else {
        mockResponse = `[DEMO MODE: SIMULATED RESPONSE]\n\n**Career Operating System Copilot**\n\nHello! I am your AI Career Copilot. I'm connected to the Career Agents ecosystem, including the **Resume Studio**, **GitHub Analyzer**, **Job Hub**, and **STAR Interview Lab**.\n\nHow can I help you accelerate your tech career today? I can review your resume, suggest optimizations, generate outreach messages, or guide you through mock interviews.`;
      }
      
      if (onChunk) {
        const words = mockResponse.split(" ");
        let currentText = "";
        for (const word of words) {
          const chunk = word + " ";
          currentText += chunk;
          onChunk(chunk);
          await sleep(15);
        }
        finalContent = currentText;
      } else {
        finalContent = mockResponse;
      }
      completed = true;
    } else {
      throw new Error("AI Gateway Connection Issue: All configured providers in the fallback execution chain failed. Please verify your environment configurations or toggle Demo Mode.");
    }
  }

  return finalContent;
}
