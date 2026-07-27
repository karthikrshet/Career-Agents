# Security Networking Architecture & SSRF Defenses

This document outlines the architecture, data flow, allowlist validation rules, and mitigation designs implemented to protect the platform from Server-Side Request Forgery (SSRF) and rate-limiting issues.

## 1. Threat Model & SSRF Mitigation

Server-Side Request Forgery occurs when an attacker can coerce the backend server into making HTTP requests to arbitrary, unauthorized destinations (e.g., internal loopback interfaces or private networks). 

The platform mitigates this through multiple defense-in-depth checks:
- **Protocol Restriction**: Only HTTPS is allowed (except Ollama / LM Studio local endpoints, which are restricted strictly to `localhost`).
- **IP Allowlisting / Blacklisting**: Private IP ranges (RFC 1918, RFC 4193, loopback, link-local, broadcast, and metadata endpoints) are explicitly rejected.
- **DNS Rebinding Protection**: The secure fetch layer resolves the target hostname and inspects the resolved IP addresses *prior* to executing the socket connection.
- **Manual Redirect Inspection**: Standard automated redirects are disabled. Each redirect in a chain is manually validated against the target host policies, and sensitive headers (e.g., `authorization`, API keys) are sanitized across host migrations.

---

## 2. Secure Fetch Wrapper (`secureFetch`)

Every network communication call must pass through the `secureFetch` client located in `packages/security/network.ts`:
- **Parameters**: `secureFetch(urlStr: string, options: SecureFetchOptions)`
- **Timeout Protection**: Enforces default request timeouts (30s) using `AbortSignal`.
- **Response Bounds**: Implements default maximum response size checks (10MB) to prevent buffer overflow or memory consumption vectors.
- **Retry Mechanism**: Handles transient failures (e.g., HTTP 429, 502, 503, 504) dynamically with exponential backoff.

---

## 3. Allowed Provider Registry

Outbound HTTP connections to AI model backends are restricted to the validated hosts mapped in `packages/security/providers.ts`:
- **OpenAI**: `api.openai.com`
- **Anthropic**: `api.anthropic.com`
- **Google Gemini**: `generativelanguage.googleapis.com`
- **Groq**: `api.groq.com`
- **OpenRouter**: `openrouter.ai`
- **DeepSeek**: `api.deepseek.com`
- **Together**: `api.together.xyz`
- **Mistral**: `api.mistral.ai`
- **Cohere**: `api.cohere.ai`
- **Azure OpenAI**: `*.openai.azure.com`
- **Ollama / LM Studio**: `localhost` / `127.0.0.1` / `::1` only.

---

## 4. Rate Limiting and Payload Constraints

API routes (/api/copilot, /api/interview, /api/github, etc.) implement sliding-window rate limit token buckets to prevent request flooding and resource exhaustion, alongside a strict content-length check.
