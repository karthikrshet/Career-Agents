# DIVISION INTEGRITY AUDIT — Career-Agents

**Generated:** 2026-07-09  
**Trigger:** GitHub Actions CI failure — `AttributeError: 'NoneType' object has no attribute 'capitalize'`  
**Script:** `scripts/generate-data.py` → `generate_knowledge_graph()` → line 187

---

## Root Cause

`generate_knowledge_graph()` contained the following unsafe line:

```python
# BEFORE (unsafe)
add_node(div, div.capitalize(), "division")
```

When `div` is `None` (null JSON value), Python raises:
```
AttributeError: 'NoneType' object has no attribute 'capitalize'
```

The 11 agents added to `agent-registry.json` in the v1.2.5 release were injected with `"division": null` due to a regex failure in the injection script's frontmatter parser (the color regex pattern using a malformed character class silently failed, causing the entire field extraction to return `None` values for all fields including `division`).

---

## Audit Results

### Files Audited

| File | Agents | Issues Found |
|------|--------|--------------|
| `agent-registry.json` | 146 | **11 NULL division fields** |
| `career-agents-index.json` | 135 | 0 |
| `career-os.json` | 135 | 0 |
| `divisions.json` | 146 entries | 0 |

> `career-agents-index.json` and `career-os.json` were generated from the old 135-agent set (before v1.2.5) and therefore contained no broken entries. `agent-registry.json` is the authoritative source for `generate-data.py` and was the only file affected.

### Valid Divisions (19 total)

`ai-business`, `ai-engineering`, `career`, `cloud`, `company-interviews`, `cybersecurity`, `data-engineering`, `devrel`, `engineering`, `faang`, `freelancing`, `gtm`, `interview`, `job-automation`, `networking`, `open-source`, `projects`, `resume`, `startup`

---

## Offending Agents

All 11 offending agents had `"division": null` in `agent-registry.json`.

| Agent ID | File | Correct Division | Issue Type |
|---------|------|-----------------|-----------|
| `performance-review-advisor` | `career/performance-review-advisor.md` | `career` | NULL |
| `career-risk-assessor` | `career/career-risk-assessor.md` | `career` | NULL |
| `executive-presence-coach` | `career/executive-presence-coach.md` | `career` | NULL |
| `graduate-school-vs-industry-advisor` | `career/graduate-school-vs-industry-advisor.md` | `career` | NULL |
| `international-job-search-coach` | `career/international-job-search-coach.md` | `career` | NULL |
| `promotion-readiness-coach` | `career/promotion-readiness-coach.md` | `career` | NULL |
| `relocation-strategy-advisor` | `career/relocation-strategy-advisor.md` | `career` | NULL |
| `achievement-quantification-coach` | `resume/achievement-quantification-coach.md` | `resume` | NULL |
| `resume-bullet-generator` | `resume/resume-bullet-generator.md` | `resume` | NULL |
| `resume-gap-strategist` | `resume/resume-gap-strategist.md` | `resume` | NULL |
| `technical-project-positioning-advisor` | `resume/technical-project-positioning-advisor.md` | `resume` | NULL |

---

## Fixes Applied

### Fix 1 — Data Integrity: `agent-registry.json`

Set the correct `"division"` string value for all 11 null-division agents.

```diff
- "division": null
+ "division": "career"   (for 7 career/ agents)
+ "division": "resume"   (for 4 resume/ agents)
```

**Result:** All 146 agents in `agent-registry.json` now have a valid, non-null division string that matches an entry in `divisions.json`.

---

### Fix 2 — Generator Robustness: `scripts/generate-data.py`

#### 2a — Pre-flight validator added (`validate_agents()`)

Added before `generate_knowledge_graph()` is called. Fails immediately with actionable errors:

```python
def validate_agents(agents):
    errors = []
    for a in agents:
        aid = a.get("id", "<missing-id>")
        div = a.get("division")
        if div is None:
            errors.append(f'  ERROR: Agent "{aid}" has a null division assignment.')
        elif not isinstance(div, str):
            errors.append(f'  ERROR: Agent "{aid}" has a non-string division value: {repr(div)}')
        elif div.strip() == "":
            errors.append(f'  ERROR: Agent "{aid}" has an empty division assignment.')
    if errors:
        print("\n[generate-data.py] DIVISION INTEGRITY FAILURES DETECTED:")
        for e in errors:
            print(e)
        raise SystemExit(1)
    print(f"Division integrity check passed: all {len(agents)} agents have valid division assignments.")
```

Instead of crashing with `AttributeError`, the script now exits with:
```
[generate-data.py] DIVISION INTEGRITY FAILURES DETECTED:
  ERROR: Agent "career-risk-assessor" has a null division assignment.
  ...
Total failures: 11
Fix the division field in agent-registry.json for the agents listed above, then re-run.
```

#### 2b — Defensive guard at line 187 (agents loop)

```diff
- add_node(div, div.capitalize(), "division")
- add_edge(aid, div, "belongs_to_division")
+ if div and isinstance(div, str) and div.strip():
+     add_node(div, div.capitalize(), "division")
+     add_edge(aid, div, "belongs_to_division")
+ else:
+     print(f"  WARNING: Agent '{aid}' has invalid division {repr(div)} — skipping division edge.")
```

#### 2c — Defensive guard at line 241 (career paths loop)

```diff
- add_node(div, div.capitalize(), "division")
- add_edge(pid, div, "uses_division")
+ if div and isinstance(div, str) and div.strip():
+     add_node(div, div.capitalize(), "division")
+     add_edge(pid, div, "uses_division")
+ else:
+     print(f"  WARNING: Career path '{pid}' has invalid recommended_division {repr(div)} — skipping.")
```

#### 2d — README badge hardcoded count fixed (line 465)

```diff
- <strong>🚀 135+ AI Agents</strong>
+ <strong>🚀 {num_agents}+ AI Agents</strong>
```

The template now uses the dynamic `num_agents` variable (derived from the live registry count) instead of a stale hardcoded string.

---

## Files Modified

| File | Change |
|------|--------|
| `agent-registry.json` | Fixed 11 `"division": null` → correct string value |
| `scripts/generate-data.py` | Added `validate_agents()`, defensive guards at 2 crash sites, fixed hardcoded README badge |

---

## Secondary Regenerated Outputs

Because `generate-data.py` ran successfully after the fix, the following derived files were also regenerated and are now current with all 146 agents:

| File | Status |
|------|--------|
| `career-os.json` | Regenerated (now 146 agents) |
| `career-agents-index.json` | Regenerated (now 146 agents) |
| `search-index.json` | Regenerated (202 items) |
| `knowledge-graph.json` | Regenerated (426 nodes, 1758 edges) |
| `agent-map.json` | Regenerated |
| `workflow-map.json` | Regenerated |
| `company-map.json` | Regenerated |
| `career-path-map.json` | Regenerated |
| `llms.txt` | Regenerated |
| `llms-full.txt` | Regenerated |

---

## Verification

```
$ python scripts/generate-data.py
Compiling career-os.json core configuration...
Compiled and wrote career-os.json successfully.
Generating search index...
Generated search-index.json with 202 items.
Division integrity check passed: all 146 agents have valid division assignments.
Generating expanded knowledge graph...
Generated expanded knowledge-graph.json with 426 nodes and 1758 edges.
Generating discoverability maps...
Discoverability maps generated successfully.
Generating LLM indexes...
Generated llms.txt
Generated llms-full.txt
Generated career-agents-index.json
Generating merged README.md mapping Hero, Products, and complete Agent Ecosystem...
README.md compiled and written successfully.
All Career Operating System databases generated successfully!

$ python scripts/validate.py
Checking markdown relative links across the repository...
Checking registry reference integrity...
Checking resume studio templates and command registration...
Validation passed.
```

Both scripts exit 0. ✅

---

## Prevention

The `validate_agents()` pre-flight check is now permanently embedded in `generate-data.py` and runs before `generate_knowledge_graph()`. Any future injection of agents with missing division fields will produce a clear, named error instead of a cryptic `AttributeError`, catching the regression at CI time with an actionable message.
