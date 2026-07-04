# Career-Agents v1.1.0 — Repository Optimization & Community Foundation

This release focuses on repository cleanup, documentation reorganization, and establishing a professional open-source contributor ecosystem.

Tag: `v1.1.0`

---

## 🛠️ Highlights & Reorganization

### 📁 Reorganized Repository Assets
To reduce repository clutter, we moved 20+ root-level markdown files into dedicated structures:
-   **`docs/reports/`**: Clean audits, release verifications, and diagnostic logs (e.g. `RELEASE_AUDIT_V2.md`, `MCP_TEST_REPORT.md`).
-   **`docs/community/`**: Mapped out recognition levels, ambassador programs, and milestone roadmaps.
-   **`docs/case-studies/`**: Mapped success stories and who-uses lists.

### 🤝 Contributor Ecosystem Templates
Created templates to standardize contributions:
-   **Issue Templates**: Added bug reports, feature requests, agent proposals, and documentation update request templates.
-   **Pull Request Template**: Configured standard checklist validation workflows and tag labeling guidelines.

### 💖 Project Sponsorship
Added the **Sponsorship Program** (`SPONSORSHIP.md`) detailing our funding roadmaps and sponsor perks (Discord access, mock panels priority, README logo placement).

### 🖥️ Website Preparation
Created a development roadmap (`WEBSITE_ROADMAP.md`) mapping the structural paths, SaaS modules, and SEO targets for the upcoming official web dashboard.

---

## 🛠️ Quick Installation

Update to v1.1.0 globally via npm:
```bash
npm install -g career-agents
```
And verify system status:
```bash
career-agents doctor
```

---

## 🔄 Migration Notes
All core registries, CLI options, and MCP tools configurations remain fully backward-compatible. If you are linking scripts or references to documentation:
-   Update any links referencing audit documents to point inside `docs/reports/`.
-   Update any references to ambassador/milestones files to point inside `docs/community/`.
-   Update success stories/use lists references to point inside `docs/case-studies/`.
