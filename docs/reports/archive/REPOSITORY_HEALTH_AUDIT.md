# Repository Health Audit: Career-Agents

This audit evaluates root directory cleanliness, file redundancies, and internal validation artifacts exposed inside the Career-Agents codebase.

---

## 🔍 Audit Findings Summary

### 1. Root Directory Clutter
Multiple reports, roadmaps, and release notes exist directly in the repository root directory. To align with premier open-source repositories (like CrewAI, Appwrite, Supabase), these files must be reorganized into dedicated subfolders inside the `docs/` workspace.

### 2. duplicate & redundant Files
We identified several overlapping guides and checklist files:
-   `ROADMAP.md` and `ROADMAP_V1.md` contain duplicate, outdated timeline milestones.
-   `PUBLISH_GUIDE.md` and `NPM_RELEASE_GUIDE.md` replicate packaging rules that are already defined inside `docs/npm-publishing.md`.
-   `NPM_RELEASE_CHECKLIST.md` contains overlapping checks with our release guides.

### 3. Exposed Internal validation Reports
Internal logs and validation results from tests run inside sandbox containers are exposed in the root. These should live in `docs/reports/`:
-   `MCP_VALIDATION_REPORT.md`
-   `NPM_POST_LAUNCH_AUDIT.md`
-   `NPM_LAUNCH_REPORT.md`

### 4. Obsolete release announcements
-   `GITHUB_RELEASE.md` (old release data)
-   `RELEASE_v1.1.0_NPM.md` (redundant launch log)

---

## 🛠️ Reorganization Action Plan

We will perform the following actions:
1.  **Move to `docs/reports/`**:
    -   `NPM_LAUNCH_REPORT.md`
    -   `NPM_POST_LAUNCH_AUDIT.md`
    -   `MCP_VALIDATION_REPORT.md`
    -   `OPEN_SOURCE_GROWTH_REPORT.md`
2.  **Move to `docs/releases/`**:
    -   `RELEASE_v1.1.0_NPM.md`
    -   `NPM_RELEASE_NOTES.md`
3.  **Move to `docs/growth/`**:
    -   `GROWTH_PLAN_2026.md`
4.  **Move to `docs/roadmaps/`**:
    -   `WEBSITE_ROADMAP.md`
5.  **Delete Obsolete Assets**:
    -   `ROADMAP_V1.md`, `ROADMAP.md`, `PUBLISH_GUIDE.md`, `NPM_RELEASE_GUIDE.md`, `NPM_RELEASE_CHECKLIST.md`, `GITHUB_RELEASE.md`.
