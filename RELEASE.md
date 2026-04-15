# Release Guidelines — Career Agents

This document outlines the standard release checklist, upgrading commands, and release template structure for tagging new versions.

---

## Release Template Structure

Every release tag description should include:

- **Version Number:** e.g., `v2.5.0`
- **Release Date:** e.g., `2026-07-26`
- **New Features:** Detailed bullet points of new capabilities.
- **Bug Fixes:** Solved issues or security patches.
- **Performance Improvements:** Speedups or database latency adjustments.
- **Security Enhancements:** CSP, key management improvements.
- **Breaking Changes:** Any structural migration details.
- **Upgrade Commands:** CLI commands for users to migrate.

---

## Standard Upgrade Commands

To upgrade an existing local clone of Career Agents to the latest release:

```bash
# 1. Fetch latest commits and tags
git fetch --all --tags

# 2. Checkout the release tag
git checkout tags/v2.5.0

# 3. Install new dependencies in the web app
cd apps/web
npm install

# 4. Apply database migrations (if database mode is used)
npx prisma migrate deploy

# 5. Build production bundle
npm run build
```

---

## Pre-Release Checks (CI/CD Checklist)

Before releasing, maintainers must verify:

1. **Lint Verification:** `npm run lint` yields no errors.
2. **Type Safety:** `npm run type-check` executes cleanly.
3. **Registry Integrity:** `python scripts/validate.py` passes without warnings.
4. **Static Compiler Run:** `python scripts/generate-data.py` executes successfully.
5. **No Placeholders:** Checked that no dummy texts remain in the documentation.
