# Security Audit — Server-Side Request Forgery (SSRF) Audit

This document lists every network entry point and output operation (`fetch`) across the repository, tracing inputs to their origin and assessing SSRF vulnerability risk.

---

## 1. Network Outflow Inventory (fetch)

The following files contain direct `fetch` invocations.

| File Path | Code Pattern | URL Target | Input Source | SSRF Risk / Assessment |
| :--- | :--- | :--- | :--- | :--- |
| **`packages/ai/openai.ts`** | `fetch(url, ...)` | `config.baseUrl` \|\| default | `config.baseUrl` (User/Config input) | **Medium**: If `config.baseUrl` is user-supplied, it could point to local network addresses. |
| **`packages/ai/gemini.ts`** | `fetch(url, ...)` | `config.baseUrl` \|\| default | `config.baseUrl` (User/Config input) | **Medium**: User configuration could override endpoint to arbitrary hosts. |
| **`packages/ai/claude.ts`** | `fetch(url, ...)` | `config.baseUrl` \|\| default | `config.baseUrl` (User/Config input) | **Medium**: User configuration could override endpoint to arbitrary hosts. |
| **`packages/ai/groq.ts`** | `fetch(url, ...)` | `config.baseUrl` \|\| default | `config.baseUrl` (User/Config input) | **Medium**: User configuration could override endpoint to arbitrary hosts. |
| **`packages/ai/openrouter.ts`** | `fetch(url, ...)` | `config.baseUrl` \|\| default | `config.baseUrl` (User/Config input) | **Medium**: User configuration could override endpoint to arbitrary hosts. |
| **`packages/ai/azure.ts`** | `fetch(config.baseUrl, ...)` | `config.baseUrl` | `config.baseUrl` (User/Config input) | **High**: Expects a custom sub-domain. Needs validation to ensure it matches `*.openai.azure.com`. |
| **`packages/ai/ollama.ts`** | `fetch(url, ...)` | `config.baseUrl` \|\| default | `config.baseUrl` (User/Config input) | **Medium**: Target host should only be verified local host addresses. |
| **`packages/ai-router/services/router.ts`** | `fetch(url, ...)` | `config.baseUrls[provider]` \|\| default | `config.baseUrls` (User/Config input) | **High**: Dynamically accepts URLs for fallback execution chains. Needs strict allowlist matching. |
| **`packages/ai-router/services/discovery.ts`** | `fetch(url, ...)` | `customBaseUrl` \|\| default | `customBaseUrl` (User/Config input) | **High**: Lists models on custom provider URLs. Can probe private internal ports. |
| **`packages/ai-router/services/health.ts`** | `fetch(url, ...)` | `customBaseUrl` \|\| default | `customBaseUrl` (User/Config input) | **High**: Health checks verify arbitrary endpoints. Could be leveraged as an SSRF scanner. |
| **`apps/web/src/app/api/parse-file/url/route.ts`** | `fetch(url, ...)` | `url` | Request Body (Unauthenticated User Input) | **Critical**: The URL is directly supplied by the request body and retrieved without filtering. |
| **`apps/web/src/app/api/github/analyze/route.ts`** | `fetch(url, ...)` | `https://api.github.com/users/${username}` | Request Body (User Input) | **Low/Medium**: Arbitrary path traversal in username could redirect endpoint. Needs regex validation. |

---

## 2. CLI / Local Tools Outflow (Not exposed to web)

The following files contain `fetch` calls but run strictly in the CLI/Local Context:

- **`packages/github/analyzer.js`**: Fetches GitHub profile details for a given username.
- **`packages/core/executor.js`**: Hardcoded model provider endpoints.

---

## 3. Remediations Required

1. **URL Validation (`validateExternalUrl`)**:
   - Enforce HTTPS only (except Ollama / LM Studio on localhost).
   - Reject credentials.
   - Reject private IPs (`127.0.0.1`, `localhost`, `10.*`, `172.16.0.0/12`, `192.168.*`, `169.254.*`, `::1`).
   - Validate hostname against the provider allowlist.
   - Resolve DNS and block resolved private IP ranges (prevents DNS rebinding).
2. **Provider Allowlist & Fixed Endpoints**:
   - Use fixed provider endpoints unless overridden with a validated URL that matches allowlist.
   - Prevent endpoints from being modified dynamically without strict validation.
3. **Secure Fetch Wrapper (`secureFetch`)**:
   - Use `secureFetch` everywhere instead of global `fetch`.
   - Implement custom timeouts, retries, safe redirect following, and request size filters.
4. **API Routes Patching**:
   - Validate user-provided URLs in `/api/parse-file/url`.
   - Validate input parameters (like `username`) in `/api/github/analyze`.
5. **Rate Limiting**:
   - Implement IP rate limiting and payload limits on `/api/copilot`, `/api/interview`, `/api/github`, `/api/resume`, `/api/linkedin`, `/api/reports`.
