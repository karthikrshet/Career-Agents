# Changelog

All notable changes to the Career Operating System (Career OS) will be documented in this file.

The project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned (Towards v1.0.0)
- Desktop application release (Tauri + Webview container).
- Complete Community Agent Marketplace UI and rating client integration.

## [v0.8.0] — 2026-07-03
### Added
- Created `workflow-registry.json` categorizing the 10 core career workflows.
- Created `career-paths.json` mapping skills and prep tools to 10 primary developer and tech roles.
- Created `companies.json` mapping Tier-1 companies (Google, Microsoft, Stripe, etc.) to interview coaches and workflows.
- Created `search-index.json` and `knowledge-graph.json` indexes for high-speed client-side queries.
- Created LLM discovery directories `llms.txt`, `llms-full.txt`, and `career-agents-index.json`.
- Expanded CLI (`scripts/cli.js`) to support new commands: `workflows`, `companies`, `update`, `doctor`, and export formats (`yaml`, `json`, `prompt-bundle`).
- Added complete Integration Guides in `docs/integrations/` for 10 top tools (Claude Code, Gemini CLI, Cursor, Windsurf, Aider, etc.).
- Created GitHub Actions workflows: `ci.yml`, `data-generator.yml`, and `release.yml`.
- Added governance documentation: `GOVERNANCE.md`, `COMMUNITY.md`, `SHOWCASE.md`, and `SUCCESS-STORIES.md`.

## [v0.7.0] — 2026-07-02
### Added
- Created `docs/platform-architecture.md` detailing Tauri desktop application layers.
- Created `docs/marketplace.md` specifying third-party agent submission, linter, and validation rules.
- Rebuilt GitHub templates for proposals, platform improvements, bug reports, and discussions.

## [v0.6.0] — 2026-07-02
### Added
- Standardized all 8 division folders on disk to lowercase kebab-case (`resume`, `interview`, `networking`).
- Upgraded `divisions.json` schema to include division categories and counts.
- Upgraded `agent-registry.json` schema to include search/filter metadata: tags, color, emoji, and vibe properties.
- Updated `docs/contributor-guide.md` with step-by-step developer onboarding walkthroughs.

## [v0.5.0] — 2026-07-02
### Added
- Created native integrations for Claude Code, Cursor, Codex, and Gemini CLI under the `integrations/` directory.
- Upgraded shell installer `scripts/install.sh` and PowerShell installer `scripts/install.ps1` to support `--tool`, `--division`, `--agent` filters, listing, and `--dry-run`.
- Created shell converter utility `scripts/convert.sh` wrapper.
- Added 15 new agents covering Resume, Interview, and Networking divisions.

## [v0.4.0] — 2026-07-02
### Added
- Structured workflows operating systems for Fresher Placement, ATS Optimization, FAANG Prep, and Offer Comparison.
- Initial validation script (`scripts/validate.py`) checking frontmatter properties.

## [v0.3.0] — 2026-07-02
### Added
- Roster of 20 core agents covering engineering and startup categories.
- Contribution guidelines and release procedures.
- Initial project registries.
