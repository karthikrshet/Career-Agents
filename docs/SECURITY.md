# Career OS — Security

Security model, practices, and responsible disclosure for Career OS v2.5.0.

---

## API Key Architecture

**Career OS never stores your AI provider API keys on a server.**

API key flow:
1. User enters their API key in **Settings → AI Provider**
2. Key is stored in **browser `localStorage`** under the `career-os-store` key
3. When making AI requests, the key is sent in the request body to the Next.js API route
4. The API route uses the key to call the AI provider and **immediately discards it** — it is never written to a database, log file, or server memory

**Server-side env vars** (`GROQ_API_KEY`, `OPENAI_API_KEY`, etc.) are used only as fallbacks when no user key is provided. These are standard environment variables and are never exposed to the client.

**Security implications:**
- If you share your browser profile, others can access your API keys
- Consider using environment variables on the server side for production deployments
- Keys stored in `localStorage` are accessible to any JavaScript on the same origin — Career OS's CSP prevents third-party scripts from running

---

## HTTP Security Headers

Configured in `apps/web/next.config.js`. Applied to all routes via `async headers()`:

### Content-Security-Policy

```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com
img-src 'self' data: blob: https://avatars.githubusercontent.com https://github.com https://raw.githubusercontent.com
connect-src 'self'
  https://api.github.com
  https://generativelanguage.googleapis.com
  https://api.anthropic.com
  https://api.openai.com
  https://api.groq.com
  https://api.together.xyz
  https://openrouter.ai
  https://api.mistral.ai
  https://api.cohere.com
  https://api.deepseek.com
  https://api.x.ai
  https://api.azure.com
  https://www.google-analytics.com
worker-src 'self' blob:
frame-ancestors 'none'
```

This CSP:
- Prevents inline script injection from untrusted sources
- Allowlists only the known AI provider endpoints in `connect-src`
- Blocks embedding Career OS in iframes (`frame-ancestors 'none'`)

### Other Headers

| Header | Value | Protection |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS, prevents downgrade attacks |
| `X-Frame-Options` | `SAMEORIGIN` | Prevents clickjacking (backup to CSP) |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS filter for older browsers |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer header leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), browsing-topics=()` | Disables access to sensitive browser APIs |

---

## Authentication Security

Career OS uses **NextAuth.js v4** for authentication.

### NEXTAUTH_SECRET

Generate a cryptographically secure secret:

```bash
# Linux/macOS
openssl rand -base64 32

# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Store this in `.env` as `NEXTAUTH_SECRET`. **Never commit this to version control.**

This secret is used to sign and verify JWT session tokens. If it is compromised, all existing sessions should be considered invalid — rotate it immediately.

### OAuth Providers

- **GitHub OAuth**: Register at [github.com/settings/developers](https://github.com/settings/developers). Set callback URL to `<your-domain>/api/auth/callback/github`
- **Google OAuth**: Register at [console.cloud.google.com](https://console.cloud.google.com). Set callback URL to `<your-domain>/api/auth/callback/google`

**Never share** `GITHUB_CLIENT_SECRET` or `GOOGLE_CLIENT_SECRET`.

### Session Strategy

NextAuth.js uses **JWT sessions** (default). Session tokens are stored in HttpOnly, Secure, SameSite=Lax cookies. They are not accessible to JavaScript.

---

## Data Privacy

### What Career OS Stores

**Browser localStorage:**
- Career analysis results (resume, GitHub, LinkedIn)
- Interview session history
- Job application tracking data
- Career Copilot chat history
- AI provider configuration (including API key)
- Plugin state

**PostgreSQL database (when configured):**
- All of the above, associated with your user account
- OAuth provider information (name, email, avatar URL)
- **Never:** AI provider API keys

### What Career OS Does NOT Do

- Does not send your resume text to any Career OS server (analysis happens client-side or via your own AI provider key)
- Does not track user behavior beyond opt-in analytics
- Does not share data with third parties
- Does not store AI provider API keys on the server

### GDPR

Career OS supports data deletion. When a user account is deleted, all associated records cascade-delete from the database (`onDelete: Cascade` on all relations). Users can delete their account from the Settings page (when authenticated).

---

## Environment Variable Security

### Required in Production

```env
# Always required — must be kept secret
NEXTAUTH_SECRET="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_SECRET="..."

# AI provider keys (server-side fallbacks)
GROQ_API_KEY="..."
# ... other provider keys
```

### Gitignore

The `.gitignore` file at the repository root includes:
```
.env
.env.local
.env.production
```

**Never commit `.env` files to version control.**

### Vercel / Production

In production (Vercel, Railway, etc.), set environment variables through the platform's secrets management — never in code or committed config files.

---

## Dependency Security

Career OS uses standard npm packages from the public registry. Before each release:

```bash
# Check for known vulnerabilities
npm audit

# Auto-fix resolvable vulnerabilities
npm audit fix
```

Dependencies are regularly reviewed in the [CHANGELOG](../CHANGELOG.md).

---

## Responsible Disclosure

If you discover a security vulnerability in Career OS, please **do not** open a public GitHub issue.

**Report privately:**
- Email: [security policy in SECURITY.md](../SECURITY.md)
- GitHub Security Advisories: [github.com/karthikrshet/Career-Agents/security/advisories](https://github.com/karthikrshet/Career-Agents/security/advisories)

We will acknowledge your report within 48 hours and aim to release a fix within 7 days for critical issues.

---

## MCP Server Security

The MCP server (`mcp/server.js`) runs as a local process. It:

- Has a **rate limit of 200 requests/minute** to prevent runaway agent loops
- Logs all requests to `exports/logs/mcp_audit.log`
- Reads only local registry files — it makes no network requests
- Never executes user-provided code

**Keep the MCP server running locally only.** Do not expose it to the public internet.
