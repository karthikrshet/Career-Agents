# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 2.5.x | ✅ Current — fully supported |
| 2.x.x | ⚠️ Security fixes only |
| < 2.0 | ❌ Unsupported |

---

## Reporting a Vulnerability

**Please do NOT open a public GitHub issue for security vulnerabilities.**

### How to Report

1. **GitHub Security Advisories** (preferred):  
   Go to [github.com/karthikrshet/Career-Agents/security/advisories/new](https://github.com/karthikrshet/Career-Agents/security/advisories/new)  
   Submit a private security advisory.

2. **Email:**  
   Contact the maintainer via GitHub profile: [github.com/karthikrshet](https://github.com/karthikrshet)

### What to Include

- A clear description of the vulnerability
- Steps to reproduce
- Affected version(s)
- Potential impact assessment
- Optional: suggested fix

### Response Timeline

| Action | Timeline |
|---|---|
| Acknowledge receipt | Within 48 hours |
| Confirm the vulnerability | Within 5 business days |
| Release a fix (critical) | Within 7 days |
| Release a fix (high) | Within 14 days |
| Release a fix (medium/low) | Next scheduled release |

We will credit you in the security advisory unless you request anonymity.

---

## Security Architecture

For the detailed security model, see [docs/SECURITY.md](./docs/SECURITY.md).

### Key Points

- **API keys are never stored server-side.** They live in browser `localStorage` only.
- **No user data is sent to Career OS servers.** All analysis uses your own AI provider key.
- **HTTP security headers** are set on all routes: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.
- **No telemetry by default.** Opt-in only (`NEXT_PUBLIC_ENABLE_TELEMETRY=true`).

---

## Known Security Considerations

1. **localStorage API key storage** — API keys in localStorage are accessible to any JavaScript on the same origin. Career OS's CSP prevents third-party scripts from running, mitigating XSS-based key theft.

2. **Guest mode data** — All guest mode data (resumes, chat history, job applications) is stored in browser localStorage. Clearing browser data will delete it. This is by design for privacy.

3. **MCP server** — The MCP server uses stdio and is designed for local use only. Do not expose it to a public network.

---

## Dependency Vulnerabilities

Run `npm audit` in `apps/web/` to check for known vulnerabilities in dependencies. Critical vulnerabilities are addressed immediately in patch releases.
