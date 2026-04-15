# Career Agents — Troubleshooting

Solutions for common issues in Career Agents v2.5.0.

---

## Installation Issues

### `node: command not found` or wrong Node version

**Problem:** Career Agents requires Node.js ≥ 18.

```bash
node --version  # must show v18.x.x or higher
```

**Fix:**
- Download Node 20 LTS from [nodejs.org](https://nodejs.org)
- Or use nvm: `nvm install 20 && nvm use 20`
- Or use fnm: `fnm install 20 && fnm use 20`

---

### `npm install` fails with peer dependency errors

**Problem:** Dependency conflicts, especially with older npm versions.

**Fix:**
```bash
npm install --legacy-peer-deps
```

Or update npm:
```bash
npm install -g npm@latest
```

---

### `Cannot find module 'next'` or similar module errors

**Problem:** Dependencies not installed, or running from wrong directory.

**Fix:**
```bash
# Ensure you're in the web app directory
cd Career-Agents/apps/web
npm install
```

---

### `EACCES permission denied` on npm install (Linux/macOS)

**Problem:** npm global install permission error.

**Fix:** Never use `sudo npm`. Instead, fix npm permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

---

## Environment & Configuration Issues

### `Error: NEXTAUTH_SECRET is not set`

**Problem:** Missing required environment variable.

**Fix:**
```bash
# Copy .env.example to .env
cp .env.example .env

# Generate and add NEXTAUTH_SECRET
openssl rand -base64 32
# Add the output to NEXTAUTH_SECRET= in .env
```

---

### App loads but shows no data / resets on refresh

**Problem:** Not a bug — this is expected behavior in guest mode. Data is stored in `localStorage`.

**Cause:** localStorage was cleared, or you opened the app in a private/incognito window.

**Fix:**
- Use the same browser session for consistent data
- Set up a database for persistent cross-device storage (see [DATABASE.md](./DATABASE.md))
- Do not use incognito mode if you want data to persist

---

### Features show `Configure AI provider` banner everywhere

**Problem:** No AI provider API key is configured.

**Fix:**
1. Open **Settings → AI Provider**
2. Select **Groq** (free)
3. Get a free key at [console.groq.com](https://console.groq.com)
4. Paste the key and click **Save**

Alternatively, set `GROQ_API_KEY` in your `.env` file for a server-side fallback.

---

## AI Provider Errors

### `AI provider error (401): Unauthorized`

**Cause:** API key is invalid, expired, or incorrect.

**Fix:**
- Verify the API key in the provider's dashboard
- Regenerate the key if needed
- Re-enter the key in Settings → AI Provider
- Check for extra spaces or characters when pasting

---

### `AI provider error (429): Too Many Requests`

**Cause:** You've hit your AI provider's rate limit.

**Fixes:**
- Wait 60 seconds and retry
- Switch to a different provider temporarily (Settings → AI Provider)
- Upgrade your plan with the provider
- Groq and Gemini have generous free tiers — switch to them

---

### `AI provider error (503): Service Unavailable`

**Cause:** The AI provider's API is down.

**Fixes:**
- Check the provider's status page:
  - Groq: [status.groq.com](https://status.groq.com)
  - OpenAI: [status.openai.com](https://status.openai.com)
  - Anthropic: [status.anthropic.com](https://status.anthropic.com)
  - Gemini: [status.cloud.google.com](https://status.cloud.google.com)
- Switch to a different provider

---

### `Gemini API key not found` (when key is set in Settings)

**Cause:** The Gemini key was stored in `localStorage` but the server-side API route couldn't access it (localStorage is client-side only).

**Fix:** Set the key as a server-side environment variable:
```env
GEMINI_API_KEY="AIza..."
```

Or use the API route — the client-side `lib/ai.ts` reads the key from the Zustand store and includes it in the request body.

---

### Streaming stops mid-response

**Causes:**
- Network interruption
- Provider timeout (especially with long prompts)
- Browser tab went to background on mobile

**Fixes:**
- Retry the message
- Reduce `maxTokens` in Settings → AI Provider → Advanced
- Switch to a faster provider (Groq)
- Check network connectivity

---

### Ollama not connecting

**Problem:** Ollama API returns connection refused.

**Fix:**
1. Ensure Ollama is running: `ollama serve`
2. Verify the model is pulled: `ollama list`
3. Test: `curl http://localhost:11434/api/version`
4. Check firewall isn't blocking port 11434
5. The endpoint in Career Agents should be `http://localhost:11434/v1/chat/completions`

---

## Resume Analysis Issues

### Resume upload fails / no text extracted

**Problem:** File type not supported or file is corrupted.

**Supported formats:** `.pdf`, `.docx`, `.txt`, `.md`, `.rtf`

**Fixes:**
- Try a different format (`.txt` always works)
- For PDFs: ensure the PDF contains actual text (not a scanned image)
- For DOCX: ensure the file is not password-protected
- Try the "Paste Text" option instead of file upload

---

### ATS score seems too high or too low

**Explanation:** The ATS scoring engine (`src/lib/resume-engine.ts`) is a heuristic model that:
- Checks for the presence of key sections (Experience, Education, Skills, Projects, Summary)
- Detects a set of ~35 common tech keywords
- Penalizes passive verbs and missing metrics

It is designed to give directional guidance — not to replicate any specific ATS system.

**If the score seems off:**
- The score is most accurate for software engineering resumes
- Add the missing keywords shown in the analysis to improve your score
- Rewrite passive bullets with action verbs and metrics

---

## GitHub Analyzer Issues

### `GitHub user not found`

**Cause:** Username doesn't exist or is private.

**Fix:** Verify the GitHub username at `github.com/<username>`.

---

### GitHub rate limit hit (60 req/hr)

**Problem:** Unauthenticated GitHub API calls are limited to 60/hr.

**Fix:** Set a GitHub personal access token:
```env
GITHUB_TOKEN="ghp_..."
```
This increases the limit to 5,000 req/hr. Generate at [github.com/settings/tokens](https://github.com/settings/tokens) — a token with no scopes (read-only public) is sufficient.

---

### Contribution heatmap shows random data

**Explanation:** This is expected. The GitHub REST API does not expose contribution data. Accurate contribution graphs require the GraphQL API with a user token. The heatmap is simulated with random data as a placeholder.

---

## Database / Prisma Issues

### `PrismaClientInitializationError: Can't reach database server`

**Cause:** `DATABASE_URL` is wrong or PostgreSQL isn't running.

**Fixes:**
- Verify PostgreSQL is running: `pg_isready`
- Check the connection string format: `postgresql://user:password@host:port/database`
- Check firewall rules if using a remote database
- Verify the database exists: `psql -U postgres -l`

---

### `Prisma migration failed`

**Fix:**
```bash
cd apps/web

# For development (resets schema without migrations)
npx prisma db push

# Check the schema syntax
npx prisma validate

# View current database state
npx prisma studio
```

---

## Build Issues

### `next build` fails with TypeScript errors

**Fix:**
```bash
cd apps/web
npm run type-check  # see all type errors
npm run lint        # see all lint errors
```

Fix the reported errors, then rebuild.

---

### `Module not found: Can't resolve 'packages/ai/router'`

**Problem:** The `packages/` directory is at the repository root but the Next.js app is in `apps/web/`. Module resolution requires the correct path alias or tsconfig paths.

**Fix:** Check `apps/web/tsconfig.json` for path aliases. The `packages/` directory should be accessible via the configured paths.

---

## Interview Lab Issues

### Questions are sample/fallback questions (not AI-generated)

**Cause:** No API key configured, or the AI provider returned an error.

**Explanation:** The interview route gracefully falls back to 5 curated sample questions when AI is unavailable. The fallback questions are high quality (real FAANG-style questions).

**Fix:** Configure an AI provider in Settings to get personalized questions.

---

### Scorecard shows `Unable to evaluate` error

**Cause:** AI provider unavailable during evaluation.

**Fixes:**
- Check AI provider settings
- Retry after a moment
- Switch provider

---

## MCP Server Issues

See [MCP.md](./MCP.md#troubleshooting) for MCP-specific troubleshooting.

---

## Getting More Help

1. Search existing [GitHub Issues](https://github.com/karthikrshet/Career-Agents/issues)
2. Open a new issue with:
   - Your OS and Node.js version
   - The exact error message
   - Steps to reproduce
3. Join community discussions on [GitHub Discussions](https://github.com/karthikrshet/Career-Agents/discussions)
