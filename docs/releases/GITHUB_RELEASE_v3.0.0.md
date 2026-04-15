# Career Agents v3.0.0 — Production Release (Intelligent AI Gateway & Router)

We are thrilled to announce the official release of **Career Agents v3.0.0**, a major platform upgrade designed to transition Career Agents into a production-grade, enterprise-ready open-source AI career operating system. 

This release introduces a unified, central **AI Provider Gateway** and **Intelligent Router** that optimizes latency, manages costs, handles API key rotation arrays, dynamically discovers models, and auto-recovers from system failures with seamless fallback sequences.

---

## 🚀 Key Features

### 1. Enterprise AI Gateway (`packages/ai-router`)
* **18 Supported Providers**: Native integration with OpenAI, Anthropic Claude, Google Gemini, Groq, OpenRouter, DeepSeek, Together AI, Mistral, Cohere, Azure OpenAI, Ollama, LM Studio, xAI Grok, Fireworks, Perplexity, AI21, and Custom API endpoints.
* **Intelligent Router**: Routes queries based on intent heuristics (e.g. coding requests to Claude, scoring to OpenAI, document loading to Gemini). Custom modes include: `auto`, `coding`, `reasoning`, `vision`, `fast`, `cheap`, `long-context`, `balanced`, and `creative`.
* **7-Step Health Diagnostics**: Pipeline validating API Key Presence, Auth Handshake, Model List Fetching, SSE Streams, Completion Diagnostics, Latency Scores, and Status Compiling.
* **Failover Chain Loops**: Automated retry logic across provider lists when encountering status codes (401, 403, 404, 429, 500, or network offline).
* **Usage Analytics & Logs Dashboard**: In-app graphs compiling cost estimation (USD), input/output token counts, average response latencies, and detailed routing timelines.
* **Security & Key Rotation**: Client-side API key configuration arrays supporting Primary, Secondary, and Backup rotations.

### 2. Intelligent Agent Orchestration (`packages/agents`)
* **Multi-Agent Coordination**: Resolves complex career queries by planning and executing multiple specialized registry agents in sequence.
* **Stateful Workflow Engine**: Live progress monitoring for interview prep, resume calibration, and application tracking.

### 3. Developer Portal & API Specs
* Interactive API documentation page at `/api/docs` mapping requests/responses for `copilot`, `resume`, `github`, `linkedin`, and `interview` engines.

---

## 🔒 Security & Deployment Readiness

* **Vercel Native Settings**: Custom `vercel.json` configuring Strict-Transport-Security, XSS protection, permissions policies, clean URLs, and service worker caches.
* **PWA Service Worker**: Optimized custom worker caching Next.js bundles, font stylesheets, and image assets for offline availability.
* **JSON-LD Schema**: Complies with schema.org specifications for `SoftwareApplication`, `Organization`, `WebSite`, `FAQPage`, and `BreadcrumbList`.

---

## 📦 Migration Guide (v2.5.0 → v3.0.0)

For users upgrading self-hosted instances:

1. **Update Dependencies**:
   ```bash
   npm install
   cd apps/web && npm install
   ```
2. **Setup Keys Rotation**: Add backup keys in **Settings → Security & Keys** to activate automated fallbacks.
3. **Environment Setup**: Copy `.env.example` to `.env` and fill in custom key overrides.

```bash
# Verify the build compiles:
npm run build
```
