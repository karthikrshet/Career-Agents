# Career Agents — Developer Guide

Everything you need to contribute to Career Agents.

---

## Prerequisites

- **Node.js ≥ 18** ([nodejs.org](https://nodejs.org))
- **Git**
- **Python 3.9+** (for agent validation scripts)
- A code editor — VS Code is recommended

For full setup, see [INSTALL.md](./INSTALL.md).

---

## Development Setup

### 1. Fork and Clone

```bash
git clone https://github.com/<your-username>/Career-Agents.git
cd Career-Agents
```

### 2. Install Web App Dependencies

```bash
cd apps/web
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values — minimum: NEXTAUTH_SECRET + NEXTAUTH_URL
```

### 4. Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Commands

### Web App (`apps/web/`)

```bash
npm run dev         # Start Next.js dev server with hot reload
npm run build       # Build production bundle
npm run start       # Serve production build locally
npm run lint        # Run ESLint
npm run type-check  # TypeScript type checking (no output)
```

### Repository Root

```bash
# Validate all agent files and registry integrity
python scripts/validate.py

# Regenerate all generated files from source
python scripts/generate-data.py

# CLI tool (agent lookup, validation)
node scripts/cli.js --help
```

---

## Project Structure at a Glance

```
apps/web/src/
├── app/            → Pages (Next.js App Router) + API routes
├── components/     → Reusable UI components
├── hooks/          → Custom React hooks
├── lib/            → Business logic (AI, resume engine, GitHub API, store)
└── types/          → TypeScript interfaces
```

For the full structure, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Coding Standards

### TypeScript

- All new code must be TypeScript
- Avoid `any` types — define proper interfaces in `src/types/`
- Run `npm run type-check` before every PR

### Component Structure

Components live in `src/components/` organized by category:
- `components/layout/` — Sidebar, Topbar (app chrome)
- `components/seo/` — JSON-LD structured data
- `components/ui/` — Primitive components (Button, Card, Input, Badge, etc.)

Feature-specific components are co-located in their page file (`src/app/<route>/page.tsx`) when they are only used in one place.

### Styling

- Use Tailwind CSS utility classes
- Use the `cn()` utility from `src/lib/utils.ts` for conditional class names
- Dark mode is the default theme; avoid hardcoded light-mode colors
- Use `hsl()` CSS variables defined in `globals.css` for semantic colors

### State Management

- All global state goes through the Zustand store (`src/lib/store.ts`)
- Use `useStore((s) => s.field)` selectors — never import the full store
- For temporary/local state, use `useState`
- Never access `localStorage` directly — use the Zustand persist middleware

### API Routes

- API routes live in `src/app/api/<route>/route.ts`
- Always validate request body shape before processing
- Return consistent JSON error shapes: `{ success: false, error: "..." }`
- Never log API keys or secrets

---

## Adding a New Agent

Agents are Markdown files with YAML frontmatter. Follow these steps:

### 1. Determine the Division

Choose an existing division from:
`career`, `engineering`, `interview`, `resume`, `networking`, `projects`, `startup`, `company-interviews`, `ai-engineering`, `cloud`, `cybersecurity`, `open-source`, `data-engineering`, `devrel`, `gtm`, `faang`, `job-automation`, `ai-business`, `freelancing`

### 2. Create the Agent File

```bash
# Example: new agent in the 'career' division
touch career/my-new-agent.md
```

The file must follow the agent standard format with YAML frontmatter:

```yaml
---
id: my-new-agent
name: My New Agent
division: career
description: "One-sentence description of what this agent does."
status: live
tags:
  - career
  - example-tag
color: "#2A6F97"
emoji: 🎯
vibe: "concise, actionable, direct"
difficulty: Medium
experience_level: Mid
career_stage: Growth
industry: All
skills:
  - Career Strategy
  - Professional Development
companies: []
related_agents:
  - ats-resume-reviewer
popularity_score: 50
---

# My New Agent

[Agent body — must be at least 300 words]

## Role

Describe what this agent does and who it helps.

## Approach

How does this agent think and reason?

## Key Capabilities

- Capability 1
- Capability 2
- Capability 3

## When to Use This Agent

When should someone reach for this agent?

## Output Format

What kind of output does this agent produce?
```

**Requirements:**
- File must be ≥ 300 words
- All frontmatter fields are required
- `id` must be unique across all 146 agents
- `filename` in registry = `<division>/<id>.md`

### 3. Register the Agent

Add the agent to **both** `agent-registry.json` and `divisions.json`:

**In `agent-registry.json`** (add to the `agents` array):
```json
{
  "id": "my-new-agent",
  "name": "My New Agent",
  "division": "career",
  "description": "One-sentence description.",
  "status": "live",
  "filename": "career/my-new-agent.md",
  "tags": ["career"],
  "color": "#2A6F97",
  "emoji": "🎯",
  "vibe": "concise, actionable",
  "difficulty": "Medium",
  "experience_level": "Mid",
  "career_stage": "Growth",
  "industry": "All",
  "skills": ["Career Strategy"],
  "companies": [],
  "related_agents": [],
  "related_workflows": [],
  "popularity_score": 50
}
```

**In `divisions.json`** (add to the matching division's `agents` array):
```json
{
  "id": "my-new-agent",
  "file": "career/my-new-agent.md",
  "name": "My New Agent",
  "status": "live",
  "description": "One-sentence description.",
  "tags": ["career"]
}
```

### 4. Validate

```bash
python scripts/validate.py
```

Fix any reported issues. The validator checks:
- All required frontmatter fields are present
- Agent file is ≥ 300 words
- Required section headings exist
- IDs are unique
- No orphaned agents (in registry but not divisions, or vice versa)

### 5. Regenerate Generated Files

```bash
python scripts/generate-data.py
```

This updates `career-agents.json`, `search-index.json`, `knowledge-graph.json`, `llms.txt`, `llms-full.txt`, and the maps.

---

## Adding a New API Route

1. Create `src/app/api/<route>/route.ts`
2. Export named HTTP method functions (`GET`, `POST`, `PUT`, `DELETE`)
3. Use `NextRequest` / `NextResponse` from `next/server`
4. Validate input, call business logic, return consistent JSON
5. Document the route in [API.md](./API.md)

Example:
```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // validate + process
    return NextResponse.json({ success: true, data: result });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
```

---

## Running Validation

Before opening a PR, always run:

```bash
# From apps/web/
npm run type-check
npm run lint

# From repo root (if you changed agents/registry)
python scripts/validate.py
python scripts/generate-data.py
```

Both validation commands must exit with status 0.

---

## Branch Naming Convention

```
feature/<short-description>     # New features
fix/<short-description>         # Bug fixes
docs/<short-description>        # Documentation changes
agent/<agent-id>                # New agent additions
refactor/<short-description>    # Refactors
```

Examples:
```
feature/voice-interview-mode
fix/copilot-hydration-bug
docs/api-reference
agent/golang-engineer-coach
```

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Google OAuth provider
fix: resolve copilot session hydration bug
docs: add MCP configuration guide
agent: add Golang Engineer Coach to engineering division
chore: update dependencies
```

---

## Pull Request Process

1. Fork the repo and create a branch from `main`
2. Make your changes and ensure all validations pass
3. Write a clear PR description explaining **what** and **why**
4. Link any related issues
5. Maintainers review within 3–5 business days

See [../CONTRIBUTING.md](../CONTRIBUTING.md) for the full contribution policy.
