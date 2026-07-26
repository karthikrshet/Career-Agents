# Changelog

All notable changes to Career OS are documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [3.0.0] — 2026-07

### Added
- **Intelligent Agent Orchestration Engine**: Added `packages/agents` (router, planner, executor, merger, context, cache) for multi-agent context planning, intent routing, and advice merging.
- **Career Memory**: Added `packages/memory` cache interface to persist achievements, milestones, and metrics.
- **Workflow Engine**: Added stateful `packages/core/workflow-engine.js` tracker.
- **Company Intelligence**: Added structured JSON company profiles for `anthropic` and `nvidia` inside `companies/`.
- **OpenAPI / Swagger Reference**: Added an interactive API documentation page at `/api/docs` mapping requests/responses.

### Changed
- **Bushed Version**: Version upgrade to `3.0.0` for core packages, web dashboard, and registries.
- **Copilot Integration**: Unified the Copilot API route (`/api/copilot`) to resolve prompt pipelines using the new orchestration packages.

---

## [2.5.0] — 2026-07

### Added
- **Enterprise SEO**: Full per-page metadata (title, description, keywords, openGraph, twitter, canonical) for all 14 routes via Next.js Metadata API
- **robots.txt**: Auto-generated via `robots.ts` — allowlists GPTBot, ClaudeBot, PerplexityBot, Google-Extended, OAI-SearchBot and all major search engines
- **sitemap.xml**: Auto-generated via `sitemap.ts` covering all 14 public routes with priority and changeFrequency
- **llms.txt** & **llms-full.txt**: AI discoverability files in `public/` following the llmstxt.org specification
- **JSON-LD**: Structured data component with `SoftwareApplication`, `Organization`, `WebSite`+`SearchAction`, and `FAQPage` schemas
- **PWA**: Production service worker with cache-first/network-first strategies; `manifest.webmanifest` with 4 shortcuts
- **Security Headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy via `next.config.js`
- **Error Pages**: Professional `not-found.tsx`, `error.tsx`, `loading.tsx`, `global-error.tsx`
- **Scripts**: Added `lint` and `type-check` to `package.json`
- **OSS Docs**: `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`, `ROADMAP.md`, `SUPPORTED_MODELS.md`, `CODE_OF_CONDUCT.md`
- **About page**: `/about` with searchable 146-agent registry and architecture overview
- **Credits page**: `/credits` with live GitHub API stats, contributor list, clone/fork buttons

### Fixed
- `Copy is not defined` runtime error in `copilot/page.tsx` — added to lucide-react import
- TypeScript errors: `ResumeAnalysis.strengths`, `GitHubAnalysis.overallScore`, `CopilotSession` not found
- `Github` icon import error in `credits/page.tsx` — replaced with `GitBranch`

### Changed
- Root `layout.tsx`: Replaced SW unregister script with proper PWA SW registration
- Root `layout.tsx`: Expanded metadata with full enterprise SEO fields
- `next.config.js`: Added security headers async function
- `package.json`: Added `lint` and `type-check` scripts

---

## [2.4.0] — 2026-07

### Added
- AI Interview Engine with real STAR scoring (no hardcoded values)
- Copilot chat persistence: date-grouped sessions, search, filter, sort, export
- MCP client config generators for Bolt and Aider
- JSON validation, download, and test-connection buttons in MCP page
- 146-agent classifier intent router with domain-specific boosters
- Plugin lifecycle hooks: install, enable, disable, update, uninstall
- `/about` and `/credits` pages with agent registry and OSS stats
- Sidebar navigation links to About and Credits

### Fixed
- Hydration duplicate session bug on page reload
- `ResumeAnalysis` property access errors in Copilot memory context

---

## [2.3.0] — 2026-07

### Added
- Full resume upload: PDF, DOCX, TXT, MD, RTF, ODT
- Drag & drop, paste text, paste URL import
- Auto-detected fields: name, email, skills, experience, education
- ATS score, keyword match, weak bullets, STAR analysis, AI rewrite
- Career Copilot multi-provider selector with real streaming
- Resume analysis injected into Copilot system prompt context

---

## [2.2.0] — 2026-07

### Added
- Proper AI provider configuration system (ENV → DB → user key priority)
- API key never read from localStorage on server
- Encrypted database storage for API keys

### Fixed
- Gemini API key not found error (localStorage inaccessible server-side)

---

## [2.1.0] — 2026-07

### Added
- AI Router supporting 13 providers
- `packages/ai/` monorepo structure with `provider.ts`, `router.ts`
- Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- Guest mode — full functionality without login
- Dynamic dashboard with real metric cards and progress rings
- AI-powered chat sessions with Zustand persistence

---

## [2.0.0] — 2026-06

### Added
- Complete Career OS platform rewrite
- 146 specialized AI agents organized into 19 divisions
- Resume Studio, GitHub Analyzer, LinkedIn Optimizer, Interview Lab
- Job Tracker (Kanban), Prep Hub, Career Copilot, Reports
- Plugin Marketplace, MCP Server, Settings
- Glassmorphism dark theme with Framer Motion animations
