# Career OS v1.4.0 Release Notes

This release introduces the V2 monorepo package restructuring, the production-ready Resume Studio engine, feature flags configurations, and a comprehensive documentation overhaul.

---

## Overview

Version 1.4.0 marks the transition of Career-Agents from a static prompt repository to a structured, modular Career Operating System. By encapsulating core execution logic under the `packages/` directory and implementing feature gates, the codebase achieves enterprise-grade stability, runtime performance, and clean developer workflows.

---

## Highlights

### 1. Resume Studio
Exposes the core suite of resume review engines under the `career-agents` CLI:
- `review`: Evaluates section completeness and layout formatting.
- `score`: Computes cumulative ATS compatibility scores.
- `improve`: Pinpoints weak accomplishments and outputs action-verb alternatives.
- `ats`: Scans files for structural parser blockers (multi-column tables, text boxes, graphic icons).
- `faang`: Audits target-company keyword density.

### 2. Feature Flags System
Controls subcommand execution and MCP tool registrations dynamically via `features.json`. Unfinished commands are cleanly blocked in the CLI and hidden from model context list maps.

---

## Architectural Changes

All execution systems have been moved into self-contained packages:
- `packages/core/`: Handles global runtimes and project blueprints generators.
- `packages/resume/`: Formats, parses, and scores resume configurations.
- `packages/github/`: Grades repository configurations.
- `packages/linkedin/`: Audits taglines.
- `packages/interview/`: Starts interactive readline interview loops.
- `packages/dashboard/`: Manages personal progress database states.
- `packages/reports/`: Compiles Markdown, JSON, and HTML summary views.
- `packages/plugins/`: Discovers and registers custom commands.
- `packages/telemetry/`: Track usage.
- `packages/mcp/`: Server stdio protocols.

---

## Documentation Overhaul

All technical guides have been stripped of emojis and updated for consistency:
- **Professional README**: Redesigned to document installation, CLI usage tables, and MCP integrations.
- **Reference Guides**: Added `docs/ARCHITECTURE.md`, `docs/CLI_REFERENCE.md`, `docs/MCP_GUIDE.md`, and `docs/PLUGIN_GUIDE.md`.
- **Guidelines**: Overhauled `CONTRIBUTING.md`, `AGENTS.md`, `SUPPORT.md`, `SECURITY.md`, and `CODE_OF_CONDUCT.md`.

---

## Testing and Verification

- Established standalone testing scripts: `scripts/test-cli.js`, `scripts/test-resume.js`, `scripts/test-github.js`, and `scripts/test-dashboard.js`.
- Verified compilation and registry integrity using compiler scripts (`scripts/generate-data.py` and `scripts/validate.py`).

---

## Breaking Changes and Migration

No CLI subcommands from the `v1.3.x` branch have been removed. If migrating from older CLI versions:
1. Re-install globally: `npm install -g career-agents`.
2. Clean up cache folders: Run `career-agents doctor` to inspect setup health.

---

## Future Roadmap

- **v1.5.0 (Milestone 2)**: Expose public GitHub analyzer grading engines.
- **v1.6.0 (Milestone 3)**: Expose LinkedIn tagline keyword signaling.
- **v1.7.0 (Milestone 4)**: Expose conversational mock interview loop panels.
