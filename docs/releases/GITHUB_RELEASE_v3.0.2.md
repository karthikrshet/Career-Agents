# Release Notes — Career Agents v3.0.2

This is a production hardening and security release that resolves Webpack compilation failures, implements client-side environment bypasses, and ensures full build compatibilities on all operating systems and CI/CD pipelines.

## Summary of Changes

### 1. Webpack & Client-Side Compilations
- Configured Webpack fallback mappings for Node's server-only `dns` and `net` packages inside `next.config.js` to prevent compilation errors during browser builds.
- Refactored `packages/security/url-validator.ts` to implement environment checks (`typeof window !== "undefined"`), bypassing Node server validation logic when executing in client-side Next.js contexts.

### 2. CI/CD Pipeline Patches
- Standardized the database filename references to `career-agents.json` in the `.github/workflows/` runner scripts.
- Configured link validation exclusions inside `scripts/validate.py` for absolute local file links (`file://`).

---

## Migration and Upgrade Notes
Upgrade cleanly using:
```bash
git checkout tags/v3.0.2
cd apps/web
npm install
npm run build
```
No database scheme adjustments or breaking changes are included in this patch.
