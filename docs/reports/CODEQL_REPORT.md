# CodeQL Security Report — Career Agents v3.0.3

This report outlines the CodeQL security audit findings and fixes implemented for the v3.0.3 release.

## 1. SSRF Mitigation & Edge Runtime Compatibility
- **Audited Modules**: Outbound HTTP requests from AI model providers and parsing endpoints.
- **Fixed Issues**: Removed direct static imports of `pdf-parse` which executed browser-dependent canvas/render code (`DOMMatrix`) during build and server-side page generations.
- **Remediation**:
  - Modularized PDF parsing into server-only and browser-only shims (`src/lib/pdf/server.ts` and `src/lib/pdf/browser.ts`).
  - Utilized dynamic `import()` within the server parser to prevent Webpack compile-time evaluation.

## 2. Incomplete URL Sanitization & Log Protection
- Outbound fetch destinations are validated against strict allowed host patterns inside `packages/security/url-validator.ts`.
- Sensitive query parameters, API keys, and credential headers are stripped prior to redirect resolving checks.
