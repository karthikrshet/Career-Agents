# Changelog

All notable changes to the Career Operating System (Career OS) will be documented in this file.

The project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned (Towards v1.0.0)
- Desktop application release (Tauri + Webview container).
- One-click installers for Copilot, Windsurf, Aider, and OpenCode.
- Complete Community Agent Marketplace UI and rating client integration.

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
