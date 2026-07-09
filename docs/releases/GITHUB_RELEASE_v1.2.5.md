# GitHub Release — v1.2.5

**Release Date:** 2026-07-09  
**Type:** Patch  
**Tag:** `v1.2.5`

---

## Summary

v1.2.5 is a patch release that resolves all validation failures introduced when 11 agents were added to the repository without their required structural sections. The release also synchronizes all registry files to reflect the correct agent count of **146**.

---

## What Changed

### Fixed — 11 Incomplete Agent Files

The following agents were added to the repository with incomplete content. Their `## 📋 Technical Deliverables` section was empty, and the subsequent 4–5 required sections were missing entirely. All are now complete and pass full structural validation.

**career/ division (7 agents)**
- `career-risk-assessor.md` — Organizational risk scoring, financial runway modeling, contingency roadmaps
- `executive-presence-coach.md` — Presence diagnostics, communication architecture, stakeholder influence mapping
- `graduate-school-vs-industry-advisor.md` — NPV modeling, outcome probability assessment, alternative path analysis
- `international-job-search-coach.md` — Visa pathway mapping, sponsoring employer research, multi-market search design
- `performance-review-advisor.md` — Achievement mining, self-assessment writing, review conversation preparation
- `promotion-readiness-coach.md` — Competency gap analysis, promotion case construction, stakeholder alignment
- `relocation-strategy-advisor.md` — COL analysis, relocation package negotiation, move timeline planning

**resume/ division (4 agents)**
- `achievement-quantification-coach.md` — Five-probe metric excavation, proxy metric construction, evidence preservation
- `resume-bullet-generator.md` — Bullet weakness classification, XYZ/CAR rewrites, keyword integration
- `resume-gap-strategist.md` — Gap narrative framing, cover letter gap paragraphs, interview response scripts
- `technical-project-positioning-advisor.md` — Dual-register project narratives, business impact translation, portfolio coherence

### Fixed — Registry Synchronization

- **`agent-registry.json`**: Added 11 missing entries. Count: 135 → **146**
- **`career-agents-index.json`**: Updated `total_agents`: 135 → **146**
- **`README.md`**: Updated agent count badge: `135+` → **146+**

### Added — Documentation

- `docs/reports/REPOSITORY_AUDIT.md`
- `docs/reports/AGENT_VALIDATION_REPORT.md`
- `docs/reports/REGISTRY_HEALTH_REPORT.md`

---

## Validation

```bash
$ python scripts/validate.py
Checking markdown relative links across the repository...
Checking registry reference integrity...
Checking resume studio templates and command registration...
Validation passed.
```

✅ Exit code 0. All 146 agents pass full structural validation.

---

## No Breaking Changes

This is a pure patch release. No agents were removed or renamed, no APIs changed, no CLI commands changed. All 135 previously registered agents remain unchanged. The 11 agents added to the registry were already present on disk and in `divisions.json` — they were simply absent from the registry index.

---

## Upgrade

No upgrade steps required. Pull the latest changes.

```bash
git pull origin main
npm install -g career-agents@1.2.5
```
