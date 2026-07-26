# Career OS — Quick Start

Get Career OS running locally in under 5 minutes.

---

## What You Need

- **Node.js ≥ 18** — [nodejs.org](https://nodejs.org)
- **Git** — [git-scm.com](https://git-scm.com)
- **A free Groq API key** — [console.groq.com](https://console.groq.com) *(optional — guest mode works without it)*

> **Guest Mode**: Career OS works fully without any API key or database. You can analyze resumes, track jobs, and explore the interface immediately. AI features activate once you add a key in Settings.

---

## Step 1 — Clone and Install

```bash
git clone https://github.com/karthikrshet/Career-Agents.git
cd Career-Agents/apps/web
npm install
```

---

## Step 2 — Create Your Environment File

```bash
cp .env.example .env
```

Open `.env` and fill in the minimum required values:

```env
# Required for auth
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Optional but recommended — gets you free AI features immediately
GROQ_API_KEY="gsk_..."
```

To generate your `NEXTAUTH_SECRET`:
```bash
# On Linux/macOS
openssl rand -base64 32

# On Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

---

## Step 3 — Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Step 4 — Get Your Free Groq API Key

1. Go to [console.groq.com](https://console.groq.com) and sign up (free)
2. Create an API key
3. In Career OS, open **Settings → AI Provider**
4. Select **Groq**, paste your key, choose `llama3-70b-8192`
5. Click **Save** — all AI features are now active

**That's it.** Every feature is now available:
- Upload your resume → get ATS score + AI rewrite
- Enter your GitHub username → get portfolio analysis
- Start a mock interview → get STAR scores
- Chat with Career Copilot using your career data as context

---

## What's Available Without a Database

Career OS uses **localStorage** for persistence by default — no PostgreSQL required for local development. All your data is saved in your browser.

To enable server-side persistence (multi-device sync, production use), see [INSTALL.md](./INSTALL.md#database-setup).

---

## What's Next

| Goal | Guide |
|---|---|
| Configure a different AI provider | [PROVIDERS.md](./PROVIDERS.md) |
| Set up PostgreSQL | [DATABASE.md](./DATABASE.md) |
| Configure MCP for your IDE | [MCP.md](./MCP.md) |
| Deploy to production | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| Contribute to the project | [../CONTRIBUTING.md](../CONTRIBUTING.md) |
