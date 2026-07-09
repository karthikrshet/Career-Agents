# Changelog

All notable changes to the Career Operating System (Career OS) will be documented in this file.

The project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.2.5] — 2026-07-09
### Fixed
- Completed 11 incomplete agent files that were missing required structural sections (`## 🔄 Workflow Process`, `## 💭 Communication Style`, `## 🔄 Learning & Memory`, `## 🎯 Success Metrics`, `## 🚀 Advanced Capabilities`): `career-risk-assessor.md`, `executive-presence-coach.md`, `graduate-school-vs-industry-advisor.md`, `international-job-search-coach.md`, `performance-review-advisor.md`, `promotion-readiness-coach.md`, `relocation-strategy-advisor.md`, `achievement-quantification-coach.md`, `resume-bullet-generator.md`, `resume-gap-strategist.md`, `technical-project-positioning-advisor.md`.
- Added 11 missing agent entries to `agent-registry.json` (count: 135 → 146).
- Updated `career-agents-index.json` `total_agents` count from 135 to 146.
- Updated `README.md` agent count badge from `135+` to `146+`.
- `scripts/validate.py` now exits 0 (`Validation passed.`) with no failures.

### Added
- `docs/reports/REPOSITORY_AUDIT.md` — full audit of all 146 agents, registry state, and repairs applied.
- `docs/reports/AGENT_VALIDATION_REPORT.md` — pre/post validation comparison for all 11 fixed agents.
- `docs/reports/REGISTRY_HEALTH_REPORT.md` — registry file synchronization report.
- `docs/releases/GITHUB_RELEASE_v1.2.5.md` — GitHub release notes.

## [v1.2.0] — 2026-07-05
### Added
- Created `REPOSITORY_HEALTH_AUDIT.md`, `NPM_HEALTH_REPORT.md`, `OPEN_SOURCE_HEALTH_SCORE.md` reports under `docs/reports/`.
- Created `.github/ISSUE_TEMPLATE/` folder with bug report, feature request, agent request, and company track request schemas.
- Created `docs/releases/GITHUB_RELEASE_v1.2.0.md` release highlights document.
- Created `docs/SHOWCASE.md` community projects directory page.

### Changed
- Reorganized root directory clutter. Relocated 8 reports/releases/roadmaps files into subfolders inside `docs/` and deleted 6 duplicate/obsolete guides.
- Refactored `README.md` layout, adding badge indicators, Profile Views tracker, Quick Statistics metrics, and editor setup guides.

## [v1.1.1] — 2026-07-05
### Added
- Created `NPM_LAUNCH_REPORT.md` detailing the npm registry details, available CLI commands, and links.
- Created `RELEASE_v1.1.0_NPM.md` release notes highlighting the official launch.
- Created `GROWTH_PLAN_2026.md` documenting targets and execution roadmaps for 2026.
- Created `NPM_POST_LAUNCH_AUDIT.md` verifying the release state and package footprint.

### Changed
- Redesigned `README.md` to include NPM launch badges directly under the title, simplified `Install` instructions, and basic `Quick Start` commands.
- Configured a dedicated `Support Career-Agents` section in the README highlighting GitHub Sponsors info and benefits.
- Updated `package.json` with optimized metadata (description, keywords, repository, homepage, and bugs fields).

## [v1.1.0] — 2026-07-05
### Added
- Created Issue templates (`agent_proposal.md`, `documentation_improvement.md`) and Pull Request template (`PULL_REQUEST_TEMPLATE.md`) with explicit label guidelines.
- Created `SPONSORSHIP.md` program, funding roadmap, and sponsorship tiers.
- Created `WEBSITE_ROADMAP.md` mapping page structures, layouts, and target SEO keywords for the future web app.
- Created `docs/npm-publishing.md` guide and `NPM_RELEASE_CHECKLIST.md` checklist in root.
- Created `docs/reports/` and `docs/community/` and `docs/case-studies/` folders to clean up repository clutter.

### Changed
- Relocated 12 release reports, audits, and checks from root to `docs/reports/`.
- Relocated 8 community guides, ambassador programs, and milestones documents from root to `docs/community/`.
- Relocated 3 case studies and usage guides from root to `docs/case-studies/`.
- Redesigned `README.md` layout featuring premium badges, full architecture tree diagram, "Why Career-Agents?" value propositions, and direct sponsorship links.
- Updated `scripts/test-mcp.js` to output reports to `docs/reports/` directly.

## [v1.0.0] — 2026-07-04
### Added
- Initial stable release of Career-Agents CLI and MCP server transport.
- Configured 135+ AI Career Agents prompt assets.
- Implemented directory traversal safeties, rate limiting, and caching controls in MCP.

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
