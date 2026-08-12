# Security Changelog

## [v6.2.0] — 2026-07-28

### Added
- **Sanitization Helpers**: New `packages/security/escape.ts` implementing HTML, Markdown, LaTeX, CSV, XML, and JSON sanitization rules.
- **Log Injection Blockers**: New `packages/security/safe-logger.ts` for clean output logging.
- **Secure Middleware**: Content Security Policy, Permissions Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS, and Rate Limiting on `/api/*` routes.

### Changed
- **SSRF Defense**: Upgraded `packages/security/network.ts` to rewrite fetch URLs to validated target IPs and inject the Host header, preventing DNS rebinding.
- **XSS Mitigations**: Updated reports generation and export APIs to escape user fields using `escapeHTML`.
- **Dynamic Method Call Fix**: Switched class instantiation to switch-case matching inside `packages/ai/router.ts`.
- **Remote Property Injection Block**: Locked client provider parameter to whitelist strings in `copilot/route.ts`.
- **VSCode Extension Writes**: Patched path traversal checks, file size boundaries, and atomic writes in `vscode-extension/src/extension.ts`.
