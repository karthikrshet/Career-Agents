# Career-Agents v1.2.0 — Open Source Platform Upgrade

This release is a major milestone that transforms the repository layout, contributor templates, and onboarding guides to align with elite open-source projects.

Tag: `v1.2.0`

---

## 🛠️ Highlights

-   **📁 Documentation Reorganization**: Cleaned up the repository root directory by moving all reports, guides, roadmaps, and validation outputs into dedicated directories inside the `docs/` workspace (`reports/`, `releases/`, `growth/`, `roadmaps/`). Deleted duplicate/obsolete roadmaps and publishing guides.
-   **🤝 Community Issue/PR Templates**: Introduced clean, structured issue templates (bug report, feature requests, specialized AI coach requests, company tracks requests) and a professional PR verification checklist.
-   **⚡ Redesigned Onboarding (README)**: Refactored the core README to feature premium conversion badges, profile views, quick statistics indicators, and structured setup sections for Cursor, Claude Desktop, Windsurf, and OpenCode.
-   **🏆 Community Showcase**: Launched the centralized `docs/SHOWCASE.md` highlighting student/developer usage guides, custom dashboards, and contributions guidelines.
-   **📦 NPM Footprint Optimizations**: Verified zero-dependency packaging compatibility and audited footprint sizes under 1 MB limit (**713 kB**).
-   **🛡️ Open Source Health**: Integrated validator loops for schemas and links, achieving a perfect **100/100** open-source repository health grade.

---

## 📥 Installation

Install or upgrade globally:
```bash
npm install -g career-agents
```
Check diagnostic health status:
```bash
career-agents doctor
```
