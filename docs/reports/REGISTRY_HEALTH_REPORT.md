# REGISTRY HEALTH REPORT — Career-Agents

**Generated:** 2026-07-09  
**Release:** v1.2.5

---

## Registry Files Audited

| File | Purpose |
|------|---------|
| `agent-registry.json` | Primary agent index (search/filter metadata) |
| `divisions.json` | Division structure with agent file paths |
| `career-agents-index.json` | LLM discovery index (total_agents count) |

---

## Pre-Repair State

| Metric | Value |
|--------|-------|
| agent-registry.json count | 135 |
| divisions.json count | 146 |
| Agents in divisions.json but NOT in agent-registry.json | **11** |
| Agents in agent-registry.json but NOT in divisions.json | **0** |
| Duplicate IDs in agent-registry.json | **0** |
| Orphaned files (on disk, not in divisions.json) | **0** |
| Phantom entries (in divisions.json, not on disk) | **0** |

---

## Missing Agents (Pre-Repair)

All 11 missing agents were absent from `agent-registry.json` because they were the same 11 agents that failed structural validation. They had been added to `divisions.json` but not to the registry.

| Agent ID | Division |
|---------|---------|
| career-risk-assessor | career |
| executive-presence-coach | career |
| graduate-school-vs-industry-advisor | career |
| international-job-search-coach | career |
| performance-review-advisor | career |
| promotion-readiness-coach | career |
| relocation-strategy-advisor | career |
| achievement-quantification-coach | resume |
| resume-bullet-generator | resume |
| resume-gap-strategist | resume |
| technical-project-positioning-advisor | resume |

---

## Repairs Applied

### agent-registry.json
- Added 11 missing agent entries
- Each entry follows the canonical schema: `id`, `name`, `division`, `description`, `status`, `filename`, `tags`, `color`, `emoji`, `vibe`
- All entries set to `"status": "live"`
- Metadata parsed directly from each agent's frontmatter (color, emoji, vibe, description)
- Tags derived from the agent's `vibe` field (comma-split, max 5)

### career-agents-index.json
- Updated `total_agents`: 135 → **146**

---

## Post-Repair State

| Metric | Value |
|--------|-------|
| agent-registry.json count | **146** ✅ |
| divisions.json count | **146** ✅ |
| career-agents-index.json total_agents | **146** ✅ |
| Agents in divisions.json but NOT in agent-registry.json | **0** ✅ |
| Duplicate IDs | **0** ✅ |
| Orphaned files | **0** ✅ |
| Phantom entries | **0** ✅ |

---

## Registry Schema Compliance

All 146 entries in `agent-registry.json` conform to the following schema:

```json
{
  "id": "kebab-case-id",
  "name": "Human Readable Name",
  "division": "division-id",
  "description": "One to two sentence description.",
  "status": "live",
  "filename": "division/agent-filename.md",
  "tags": ["tag1", "tag2", "tag3"],
  "color": "#HEXCOLOR",
  "emoji": "emoji",
  "vibe": "comma, separated, vibe, descriptors"
}
```

All 146 entries have all required fields populated. ✅
