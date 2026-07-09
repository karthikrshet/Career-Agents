# AGENT VALIDATION REPORT — Career-Agents

**Generated:** 2026-07-09  
**Release:** v1.2.5  
**Validator:** scripts/validate.py  
**Environment:** PYTHONIOENCODING=utf-8

---

## Validation Script Logic

`scripts/validate.py` checks each agent markdown file for:

1. **Required frontmatter fields:** `name`, `description`, `color`, `emoji`, `vibe`
2. **Required structural headings:**
   - `## 🧠 Your Identity & Memory`
   - `## 🎯 Your Core Mission`
   - `## 🚨 Critical Rules You Must Follow`
   - `## 📋 Technical Deliverables`
   - `## 🔄 Workflow Process`
   - `## 💭 Communication Style`
   - `## 🔄 Learning & Memory`
   - `## 🎯 Success Metrics`
   - `## 🚀 Advanced Capabilities`
3. **Relative link validity:** All internal markdown links resolve to existing files
4. **Registry reference integrity:** divisions.json references match files on disk

---

## Pre-Repair Validation Result

```
FAIL
career/career-risk-assessor.md: Missing required headings: ...
```

Exit code: 1 (non-zero)

**Root cause:** 11 agents had content truncated at `## 📋 Technical Deliverables` — the body of that section and all subsequent required sections were missing.

---

## Agents Repaired

| Agent File | Division | Sections Added |
|-----------|---------|----------------|
| career/career-risk-assessor.md | career | Technical Deliverables body + Workflow Process (replaced stub) + Communication Style + Learning & Memory + Success Metrics + Advanced Capabilities |
| career/executive-presence-coach.md | career | Technical Deliverables body + 5 sections |
| career/graduate-school-vs-industry-advisor.md | career | Technical Deliverables body + 5 sections |
| career/international-job-search-coach.md | career | Technical Deliverables body + 5 sections |
| career/performance-review-advisor.md | career | Technical Deliverables body + 5 sections |
| career/promotion-readiness-coach.md | career | Technical Deliverables body + 5 sections |
| career/relocation-strategy-advisor.md | career | Technical Deliverables body + 5 sections |
| resume/achievement-quantification-coach.md | resume | Technical Deliverables body + 5 sections |
| resume/resume-bullet-generator.md | resume | Technical Deliverables body + 5 sections |
| resume/resume-gap-strategist.md | resume | Technical Deliverables body + 5 sections |
| resume/technical-project-positioning-advisor.md | resume | Technical Deliverables body + 5 sections |

---

## Canonical Reference

All additions followed the structure established by `career/ats-resume-reviewer.md`:

- **Technical Deliverables:** Structured templates in fenced code blocks
- **Workflow Process:** 5–6 named steps with Objective, Inputs, Outputs, Validation criteria
- **Communication Style:** 5 bullet points covering speaking, teaching, critique, recommendation, and uncertainty-handling styles
- **Learning & Memory:** 4 bullet points covering tracked info, patterns, inconsistency detection, and context retention
- **Success Metrics:** 5–7 measurable, specific outcome metrics
- **Advanced Capabilities:** 6 advanced use cases with one-line capability descriptions, ending with a one-paragraph agent philosophy statement

---

## Post-Repair Validation Result

```
$ python scripts/validate.py
Checking markdown relative links across the repository...
Checking registry reference integrity...
Checking resume studio templates and command registration...
Validation passed.
```

Exit code: 0 ✅

---

## Compliance Summary

| Check | Pre-repair | Post-repair |
|-------|-----------|-------------|
| Required headings — all agents | ❌ 11 failing | ✅ 146/146 |
| Required frontmatter fields | ✅ 146/146 | ✅ 146/146 |
| Relative link validity | ✅ Pass | ✅ Pass |
| Registry reference integrity | ✅ Pass | ✅ Pass |
| Validation exit code | ❌ 1 | ✅ 0 |
