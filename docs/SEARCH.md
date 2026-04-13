# Career OS — Search & Indexing Engine

This document details how search, indexing, and keyword scoring operate in the Career OS workspace.

---

## Indexing Pipeline

Career OS builds a statically compiled index file at `/search-index.json`. This index is compiled during the release build by the data generation script:

```bash
python scripts/generate-data.py
```

The script extracts search index entries from:
1. **Agents:** All 146 agents (Markdown prompts).
2. **Workflows:** Multi-step career tracks (YAML definitions).
3. **Divisions:** Category classifications.
4. **Companies:** Verified company interview prep paths.

Each entry is compiled into a search item format:
```json
{
  "id": "ats-resume-reviewer",
  "type": "agent",
  "name": "ATS Resume Reviewer",
  "category": "career",
  "description": "Line-by-line resume auditor for ATS optimization and keyword signaling",
  "tags": ["resume", "ats", "review"],
  "skills": ["Resume Writing", "ATS Optimization"]
}
```

---

## Search Client Logic

Search functionality in the client runs locally (instant filters). It handles:

- **Fuzzy Search:** Tokenizes queries and checks for substring presence.
- **Match Priority Scoring:** Matches are weighted differently based on the matched field:
  - Name exact match: +15 points
  - Name keyword match: +3 points per token
  - Skill match: +2 points per token
  - Tag/Category match: +2 points
  - Description match: +1 point

```typescript
// Example matching routine inside apps/web/src/app/api/copilot/route.ts
function scoreAgent(agent: any, queryTokens: string[], intentBooster?: string): number {
  let score = 0;
  const nameLower = agent.name.toLowerCase();
  const descLower = agent.description.toLowerCase();
  
  for (const token of queryTokens) {
    if (nameLower === token) score += 15;
    else if (nameLower.includes(token)) score += 3;
    
    if (descLower.includes(token)) score += 1;
    
    if (agent.tags.some((t: string) => t.toLowerCase() === token)) score += 2;
    if (agent.skills.some((s: string) => s.toLowerCase() === token)) score += 2;
  }
  
  // Apply domain boosters (e.g., if query talks about "resume", boost resume agents)
  if (intentBooster && agent.tags.includes(intentBooster)) {
    score += 12;
  }
  
  return score;
}
```

---

## Performance Caching

- **Index Fetch Caching:** When a user accesses the "About" browser or Copilot page, the JSON file `search-index.json` is fetched and saved to a memory cache. This prevents network calls on subsequent keystrokes.
- **Fuzzy Filter Performance:** Since the search index size is small (~120KB, ~200 items), client-side JavaScript filters can run matching routines in < 5 milliseconds.
