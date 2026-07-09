# GitHub Release — v1.2.6

**Release Date:** 2026-07-09  
**Type:** Patch  
**Tag:** `v1.2.6`

---

## Summary

v1.2.6 is a patch release focusing on repository stability, documentation improvements, NPM/MCP packaging optimizations, and cleaning up unreferenced draft assets. **No new agents or divisions have been added.**

---

## What Changed

### 1. Stability & Bug Fixes
- **Harden Data Generator:** Patched `scripts/generate-data.py` to prevent backslash evaluations from corrupting LaTeX arrow escapes (`$\rightarrow$`) in the generated `README.md` output (rendered as `$ightarrow$`). All arrow listings now use Unicode arrows (`→`).
- **Pre-flight Division Validator:** Embedded a fast-failing `validate_agents()` step in `scripts/generate-data.py` to detect null, empty, or non-string division assignments with descriptive, actionable error logs before executing graph serialization.
- **MCP Count Update:** Synced `mcp/server.js` agent count descriptions from 135 to **146** to match the live registry index.

### 2. NPM & CLI Enhancements
- **Dynamic README Count:** Modified the README template inside `generate-data.py` to dynamically compile the agent count badge (`{num_agents}+`) instead of using a static, hardcoded string.
- **NPM Package Size Optimization:** Deleted the orphaned, unreferenced `developer-growth` draft directory to prevent packaging dead assets to global NPM installs.

### 3. Repository Cleanup & Organization
- **Report Archives:** Cleaned up report directories clutter by moving redundant and stale audits (e.g. `PRODUCTION_READINESS_REPORT_V2.md`, `RELEASE_AUDIT_V2.md`, `NPM_POST_LAUNCH_AUDIT.md`, `MCP_TEST_REPORT.md`, `REPOSITORY_HEALTH_AUDIT.md`) into a dedicated `docs/reports/archive/` folder.
- **Created `SUPPORT.md`:** Added a standard support and troubleshooting reference document to guide users to appropriate discussions and issue queues.

### 4. Comprehensive Production Audits
Added 7 structured health and validation audit reports:
- `docs/reports/POST_RELEASE_HEALTH_AUDIT.md`
- `docs/reports/NPM_PRODUCTION_AUDIT.md`
- `docs/reports/MCP_PRODUCTION_AUDIT.md`
- `docs/reports/README_IMPROVEMENTS.md`
- `docs/reports/GITHUB_HEALTH_REPORT.md`
- `docs/reports/GROWTH_CONVERSION_REPORT.md`
- `docs/reports/QUALITY_AUDIT.md`

---

## Verification

```bash
$ python scripts/validate.py
Checking markdown relative links across the repository...
Checking registry reference integrity...
Checking resume studio templates and command registration...
Validation passed.
```

✅ All 146 agents pass full structural validation and relative markdown link checks.
