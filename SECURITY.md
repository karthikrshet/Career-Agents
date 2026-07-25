# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.5.x   | ✅ Active support  |
| 2.4.x   | ⚠️ Security fixes only |
| < 2.4   | ❌ No longer supported |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities via public GitHub Issues.**

### How to Report

1. **Email**: Open a [private security advisory](https://github.com/karthikrshet/Career-Agents/security/advisories/new) on GitHub (preferred)
2. Include: affected version, description, reproduction steps, and potential impact

### Response Timeline

- **Acknowledgement**: Within 48 hours
- **Initial assessment**: Within 7 days
- **Fix + disclosure**: Coordinated within 90 days

## Security Best Practices for Self-Hosting

### API Keys
- Store all AI provider API keys in environment variables (`OPENAI_API_KEY`, `GEMINI_API_KEY`, etc.)
- **Never** commit API keys to git
- Use `.env.local` for local development (it's gitignored)

### Database
- In production, use PostgreSQL with a strong `DATABASE_URL`
- Rotate `NEXTAUTH_SECRET` regularly

### Headers
Career OS ships with the following security headers by default:
- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=()`

### Guest Mode Security
- Guest data is stored in `localStorage` only
- No guest data is transmitted to any server
- API keys entered in settings are only sent via HTTPS to your own API routes
