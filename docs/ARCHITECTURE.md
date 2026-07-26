# Career OS — Architecture

System architecture reference for Career OS v2.5.0.

---

## System Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Career OS Platform                            │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      Next.js Web App (apps/web)                  │  │
│  │                                                                  │  │
│  │  Pages: Dashboard · Resume · GitHub · LinkedIn · Interview       │  │
│  │         Copilot · Tracker · PrepHub · Reports · Marketplace      │  │
│  │         MCP · Settings · About · Credits                         │  │
│  │                                                                  │  │
│  │  Components: Sidebar · Topbar · Cards · Charts · Modals          │  │
│  │  State: Zustand (persist → localStorage)                         │  │
│  │  Styling: Tailwind CSS · Radix UI · Framer Motion                │  │
│  └─────────────────────────┬────────────────────────────────────────┘  │
│                            │ HTTP                                       │
│  ┌─────────────────────────▼────────────────────────────────────────┐  │
│  │                    Next.js API Routes (/api)                     │  │
│  │                                                                  │  │
│  │  /copilot → multi-agent router + SSE streaming                   │  │
│  │  /interview → question generation + STAR evaluation              │  │
│  │  /resume/analyze → ATS scoring engine                            │  │
│  │  /github/analyze → GitHub REST API client                        │  │
│  │  /linkedin/analyze → LinkedIn profile optimizer                  │  │
│  │  /reports/generate → PDF/HTML/MD/JSON export                     │  │
│  │  /parse-file → PDF/DOCX/TXT/MD/RTF parsing                       │  │
│  │  /providers/test → AI provider connectivity test                 │  │
│  └──────┬─────────────┬────────────────────────────────────────────┘  │
│         │              │                                                │
│  ┌──────▼──────┐  ┌────▼──────────────────────────────────────────┐   │
│  │  PostgreSQL  │  │       AI Provider Router (packages/ai)        │   │
│  │  (Prisma)    │  │                                               │   │
│  │              │  │  Groq · OpenAI · Claude · Gemini · OpenRouter │   │
│  │  7 models    │  │  DeepSeek · Together · Mistral · Cohere       │   │
│  │  Optional    │  │  xAI · Azure · Ollama · LM Studio             │   │
│  └─────────────┘  └───────────────────────────────────────────────┘   │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                 MCP Server (mcp/server.js)                       │  │
│  │  Stdio protocol · 20+ career tools for IDE integration           │  │
│  │  Cursor · Claude Desktop · Continue · VS Code · Aider · Bolt    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │               Agent Registry (agent-registry.json)               │  │
│  │  146 agents · 19 divisions · Markdown prompt files              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
Career-Agents/                    ← Repository root
│
├── apps/
│   └── web/                      ← Next.js 14 web application
│       ├── src/
│       │   ├── app/              ← Next.js App Router pages + API routes
│       │   │   ├── api/          ← Server-side API route handlers
│       │   │   ├── copilot/      ← Career Copilot chat page
│       │   │   ├── dashboard/    ← Main dashboard (root page.tsx)
│       │   │   ├── interview/    ← Interview Lab
│       │   │   ├── linkedin/     ← LinkedIn Optimizer
│       │   │   ├── marketplace/  ← Plugin Marketplace
│       │   │   ├── mcp/          ← MCP configuration page
│       │   │   ├── reports/      ← Career report generator
│       │   │   ├── resume/       ← Resume Studio
│       │   │   ├── settings/     ← App settings (AI provider, theme)
│       │   │   ├── tracker/      ← Job Application Tracker
│       │   │   ├── about/        ← About page + agent browser
│       │   │   ├── credits/      ← OSS credits + GitHub stats
│       │   │   └── prephub/      ← Company interview prep hub
│       │   ├── components/
│       │   │   ├── layout/       ← Sidebar, Topbar
│       │   │   ├── seo/          ← JSON-LD structured data
│       │   │   └── ui/           ← Shared UI primitives (Button, Card, etc.)
│       │   ├── hooks/            ← Custom React hooks (use-command.ts)
│       │   ├── lib/
│       │   │   ├── ai/           ← AI provider manager + error classifier
│       │   │   ├── ai.ts         ← Core AI provider abstraction (14 providers)
│       │   │   ├── github-api.ts ← GitHub REST API client
│       │   │   ├── resume-engine.ts ← Client-side ATS scoring engine
│       │   │   ├── store.ts      ← Zustand global state store
│       │   │   ├── persistence.ts ← localStorage serialization helpers
│       │   │   └── utils.ts      ← Shared utilities + calculateCareerScore
│       │   └── types/            ← TypeScript type definitions
│       ├── prisma/
│       │   └── schema.prisma     ← Database schema (7 models)
│       ├── public/               ← Static assets, icons, PWA files
│       ├── .env.example          ← Environment variable reference
│       ├── next.config.js        ← Next.js config + security headers
│       └── tailwind.config.js    ← Tailwind CSS design tokens
│
├── packages/
│   └── ai/                       ← AI provider package (used by API routes)
│       ├── provider.ts           ← Abstract base class for all providers
│       ├── router.ts             ← Provider registry + generate() function
│       ├── openai.ts             ← OpenAI provider
│       ├── claude.ts             ← Anthropic Claude provider
│       ├── gemini.ts             ← Google Gemini provider
│       ├── groq.ts               ← Groq provider
│       ├── openrouter.ts         ← OpenRouter provider
│       ├── ollama.ts             ← Ollama local provider
│       └── azure.ts              ← Azure OpenAI provider
│
├── mcp/
│   └── server.js                 ← MCP server (stdio, 2329 lines, 20+ tools)
│
├── scripts/
│   ├── cli.js                    ← CLI tool (career-agents command)
│   ├── sdk.js                    ← Node.js SDK (CareerAgentsSDK class)
│   ├── generate-data.py          ← Generates career-os.json, search-index, maps, README
│   ├── validate.py               ← Validates agent markdown files + registry
│   ├── install.sh / install.ps1  ← Platform install scripts
│   └── test-*.js                 ← Test scripts for various subsystems
│
├── career/ engineering/ resume/ ← Agent markdown files by division (146 total)
├── interview/ networking/ startup/
├── ai-engineering/ cloud/ cybersecurity/
├── open-source/ data-engineering/ devrel/
├── company-interviews/ projects/
├── gtm/ faang/ job-automation/ ai-business/ freelancing/
│
├── agent-registry.json           ← Master agent registry (do not edit manually)
├── divisions.json                ← Division structure and agent references
├── career-os.json                ← Generated: full platform manifest
├── search-index.json             ← Generated: search index
├── knowledge-graph.json          ← Generated: relationship graph
├── workflow-registry.json        ← Career workflow definitions
├── career-paths.json             ← Career path definitions
├── companies.json                ← Company interview data
├── llms.txt                      ← AI discoverability (llmstxt.org spec)
├── llms-full.txt                 ← Full content for LLM ingestion
└── docs/                         ← This documentation
```

---

## Frontend Architecture

### Next.js App Router

Career OS uses Next.js 14 with the **App Router** pattern. Each page lives in `src/app/<route>/page.tsx` and can define its own `metadata` export for SEO.

- All 14 routes have individual metadata (title, description, openGraph)
- `layout.tsx` wraps every page with the Sidebar, Toaster, and PWA service worker
- `robots.ts` and `sitemap.ts` auto-generate SEO files at build time

### State Management — Zustand

All global state is managed by a single Zustand store (`src/lib/store.ts`) with `persist` middleware:

```typescript
// Store slices:
profile          // UserProfile (name, targetRole, targetCompany)
metrics          // CareerMetrics (careerScore, resumeScore, githubScore, etc.)
resumeAnalysis   // Latest resume analysis result
GitHubAnalysis   // Latest GitHub profile analysis
linkedinAnalysis // Latest LinkedIn optimization result
interviewSessions // Array of all interview sessions
jobApplications   // Array of job applications (Kanban tracker)
copilotSessions   // AI chat history (folders, pins, archives)
activityFeed      // Recent events (last 50)
settings          // AI provider config, theme, notifications
installedPlugins  // Plugin installation state
enabledPlugins    // Plugin enabled/disabled state
```

The store persists to `localStorage` under the key `career-os-store`. When a database is configured, API routes can sync data to PostgreSQL.

### Career Score Algorithm

The overall career score is computed from 5 dimensions:
```typescript
careerScore = weighted_average(
  resumeScore    × 0.30,
  githubScore    × 0.25,
  linkedinScore  × 0.20,
  interviewScore × 0.15,
  applicationScore × 0.10
)
```

---

## AI Layer Architecture

### Provider Abstraction

The AI layer has two implementations:

**1. Client-side direct calls (`src/lib/ai.ts`)**  
Used by Copilot chat for streaming. Calls AI provider APIs directly from the browser using the user's configured API key.

**2. Server-side router (`packages/ai/router.ts`)**  
Used by Interview, Resume, Reports, and LinkedIn API routes. Implements the `AIProviderBase` abstract class with `generate()` and `stream()` methods.

### Provider Registry

```typescript
// packages/ai/router.ts
const PROVIDER_REGISTRY = {
  openai: OpenAIProvider,
  claude: ClaudeProvider,
  anthropic: ClaudeProvider,   // alias
  gemini: GeminiProvider,
  groq: GroqProvider,
  openrouter: OpenRouterProvider,
  ollama: OllamaProvider,
  azure: AzureProvider,
  deepseek: OpenAIProvider,    // OpenAI-compatible
  together: OpenAIProvider,    // OpenAI-compatible
  mistral: OpenAIProvider,     // OpenAI-compatible
  cohere: OpenAIProvider,      // OpenAI-compatible
  xai: OpenAIProvider,         // OpenAI-compatible
  lmstudio: OpenAIProvider,    // OpenAI-compatible
};
```

### Streaming Architecture

Copilot streaming works via SSE (Server-Sent Events):
1. Client calls `POST /api/copilot` with messages + provider config
2. API route injects career context + selected agent prompts
3. API route opens a `ReadableStream` and forwards SSE chunks from the AI provider
4. Client reads the SSE stream and renders tokens progressively

---

## Agent System Architecture

### Agent Loading

At server startup, the Copilot API route reads `agent-registry.json` from the filesystem to load the registry of 146 agents. When a user sends a message, the agent router:

1. **Scores all 146 agents** against the user's query using:
   - Full name match (+15 points)
   - Individual keyword matches (+3 per keyword)
   - Tag matches (+2 per tag)
   - Skill matches (+2 per skill)
   - Domain intent boosters (resume/github/interview/linkedin: +12 points)

2. **Selects top 3 agents** with score ≥ 5

3. **Loads their markdown prompt files** from the filesystem

4. **Injects all agent prompts** into the system message alongside the user's career context

### Multi-Agent Context Injection

The final system prompt for each Copilot response contains:
- Career Copilot master persona
- User profile + career metrics
- Resume analysis data (ATS score, weak bullets, missing keywords)
- GitHub analysis data (repos, stars, README grade)
- LinkedIn analysis data (headline, visibility score)
- Job application summary (last 5)
- Active plugin instructions
- Selected agent role prompts (up to 3)

---

## Plugin System Architecture

Plugins extend the Copilot's behavior by injecting instructions into the system prompt. The plugin system is a lightweight state machine:

```
DISCOVERED → INSTALLED → ENABLED → (DISABLED) → UNINSTALLED
```

Plugin state is managed by Zustand (`installedPlugins` + `enabledPlugins` maps). When a plugin is enabled, the Copilot API route reads `enabledPlugins` from the request context and appends plugin-specific instructions to the system prompt.

See [PLUGINS.md](./PLUGINS.md) for the full plugin reference.

---

## MCP Server Architecture

The MCP server (`mcp/server.js`) implements the [Model Context Protocol](https://modelcontextprotocol.io/) over stdio. It exposes 20+ tools including:

- Resume analysis and ATS scoring
- GitHub profile analysis
- Interview question generation
- Career agent lookup
- Job search and tracking utilities
- Report generation (PDF, DOCX, XLSX)

The server reads the agent registry, company data, career paths, and workflow registry at startup. Tools are invoked by MCP clients (Cursor, Claude Desktop, Continue, etc.) via JSON-RPC over stdin/stdout.

See [MCP.md](./MCP.md) for configuration and tool reference.

---

## Database Architecture

Career OS uses **Prisma ORM** with **PostgreSQL** as the production database. In development and guest mode, data persists to browser localStorage only.

### Data Flow

```
User Action → Zustand Store (instant UI) → API Route → Prisma → PostgreSQL
                     ↑                                              |
                     └──────────────────── localStorage ←───────────┘
                                          (fallback / guest)
```

### Key Design Decisions

- **localStorage-first**: All reads and writes go through Zustand. The database is a sync target, not the primary store.
- **Guest mode**: Full functionality without any login or database.
- **API key security**: AI provider API keys are stored in localStorage only. They are never sent to any Career OS server and never persisted in the database.
- **Cascade deletes**: All user data cascades on user deletion (GDPR compliance).

See [DATABASE.md](./DATABASE.md) for the full schema reference.

---

## Security Architecture

Career OS implements defense-in-depth:

- **Content Security Policy (CSP)**: Restricts script, style, image, and connection sources
- **HSTS**: `max-age=63072000; includeSubDomains; preload`
- **X-Frame-Options**: `SAMEORIGIN` — prevents clickjacking
- **X-Content-Type-Options**: `nosniff`
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: Disables camera, microphone, geolocation

See [SECURITY.md](./SECURITY.md) for the full security reference.
