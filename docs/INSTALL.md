# Career OS — Installation Guide

Complete installation reference for all environments.

---

## Prerequisites

| Requirement | Minimum | Recommended |
|---|---|---|
| Node.js | ≥ 18.0.0 | 20 LTS |
| npm | ≥ 9.0.0 | latest |
| Git | any | latest |
| PostgreSQL | optional | 15+ (for prod) |
| Python | optional | 3.9+ (for scripts) |

Verify your environment:
```bash
node --version    # must be v18+
npm --version
git --version
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/karthikrshet/Career-Agents.git
cd Career-Agents
```

The repository root contains the agent registry, MCP server, and SDK.  
The web application lives in `apps/web/`.

---

## 2. Install Web App Dependencies

```bash
cd apps/web
npm install
```

This installs all Next.js, React, Radix UI, Framer Motion, Zustand, and other dependencies listed in `apps/web/package.json`.

---

## 3. Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and configure the following variables:

### Required Variables

| Variable | Description | Example |
|---|---|---|
| `NEXTAUTH_SECRET` | Secret for signing JWT sessions. **Required.** | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Full URL of your app (no trailing slash) | `http://localhost:3000` |

### OAuth Providers (Optional — enables sign-in)

| Variable | Description | Where to Get |
|---|---|---|
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID | [github.com/settings/developers](https://github.com/settings/developers) |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret | Same as above |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | [console.cloud.google.com](https://console.cloud.google.com) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Same as above |

### AI Providers (Optional — server-side fallbacks)

Users configure their own keys in **Settings → AI Provider**. These env vars are used as server-side fallbacks when no user key is set.

| Variable | Provider | Free Tier | Where to Get |
|---|---|---|---|
| `GROQ_API_KEY` | Groq (recommended) | ✅ Yes | [console.groq.com](https://console.groq.com) |
| `OPENAI_API_KEY` | OpenAI | ❌ No | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `ANTHROPIC_API_KEY` | Anthropic Claude | ❌ No | [console.anthropic.com](https://console.anthropic.com) |
| `GEMINI_API_KEY` | Google Gemini | ✅ Yes | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |
| `OPENROUTER_API_KEY` | OpenRouter (200+ models) | ✅ Free tier | [openrouter.ai/keys](https://openrouter.ai/keys) |
| `DEEPSEEK_API_KEY` | DeepSeek | ✅ Cheap | [platform.deepseek.com](https://platform.deepseek.com) |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI | ❌ Enterprise | Azure Portal |
| `AZURE_OPENAI_ENDPOINT` | Azure endpoint URL | — | Azure Portal |
| `AZURE_OPENAI_DEPLOYMENT` | Azure deployment name | — | Azure Portal |

### GitHub API (Optional)

| Variable | Description |
|---|---|
| `GITHUB_TOKEN` | Personal access token. Increases GitHub API rate limit from 60 to 5,000 req/hr. Get at [github.com/settings/tokens](https://github.com/settings/tokens) |

### Feature Flags

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_ENABLE_MCP` | `true` | Show/hide MCP configuration page |
| `NEXT_PUBLIC_ENABLE_MARKETPLACE` | `true` | Show/hide plugin marketplace |
| `NEXT_PUBLIC_ENABLE_REPORTS` | `true` | Show/hide report generation |
| `NEXT_PUBLIC_ENABLE_TELEMETRY` | `false` | Anonymous usage analytics |

### App Config

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | `Career OS` | App name shown in UI |
| `NEXT_PUBLIC_APP_VERSION` | `2.0.0` | Version shown in settings |

---

## 4. Database Setup (Optional)

Career OS works fully in **guest mode** using browser localStorage — no database required.

To enable server-side persistence (sign-in, multi-device sync, production), set up PostgreSQL:

### Option A: Local PostgreSQL

1. Install PostgreSQL: [postgresql.org/download](https://www.postgresql.org/download/)
2. Create a database:
   ```sql
   CREATE DATABASE career_os;
   CREATE USER career_os_user WITH PASSWORD 'yourpassword';
   GRANT ALL PRIVILEGES ON DATABASE career_os TO career_os_user;
   ```
3. Set your `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL="postgresql://career_os_user:yourpassword@localhost:5432/career_os"
   ```
4. Push the Prisma schema:
   ```bash
   npx prisma db push
   ```

### Option B: Hosted PostgreSQL

Recommended services:
- [Neon](https://neon.tech) — free tier, serverless
- [Supabase](https://supabase.com) — free tier, with dashboard
- [Railway](https://railway.app) — simple pricing
- [PlanetScale](https://planetscale.com) — MySQL compatible *(requires schema changes)*

Set the `DATABASE_URL` from your provider's connection string.

---

## 5. Start the Development Server

```bash
# From apps/web/
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Available npm Scripts

From `apps/web/`:

| Script | Command | Description |
|---|---|---|
| `dev` | `next dev` | Start dev server with hot reload |
| `build` | `next build` | Build production bundle |
| `start` | `next start` | Serve production build |
| `lint` | `next lint` | Run ESLint on all files |
| `type-check` | `tsc --noEmit` | TypeScript type checking without output |

From the repository root:

| Script | Command | Description |
|---|---|---|
| `test` | `node ./scripts/cli.js validate` | Validate agent registry integrity |

---

## 6. Agent Registry Scripts (Optional)

The `scripts/` directory contains Python and Node.js scripts for managing the agent registry:

```bash
# Validate all agent markdown files and registry integrity
python scripts/validate.py

# Regenerate all generated files (career-os.json, search-index.json, maps, llms.txt, README.md)
python scripts/generate-data.py
```

These are only needed if you're contributing new agents or modifying the registry.

---

## 7. Verify Installation

After starting the dev server:

1. Open [http://localhost:3000](http://localhost:3000) — you should see the Career OS dashboard
2. Open **Settings → AI Provider** — configure your AI provider
3. Go to **Resume Studio** — upload a PDF or paste text — you should see an ATS score
4. Go to **GitHub Analyzer** — enter a GitHub username — you should see a portfolio analysis
5. Go to **Interview Lab** — start a session — questions should generate

---

## Troubleshooting Installation

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common installation issues including:
- Node version errors
- Missing peer dependencies
- Prisma connection errors
- API key configuration errors
