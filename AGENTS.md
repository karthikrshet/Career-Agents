# Career-Agents AI Contributor Guide

Welcome, AI Contributor! This guide is designed for Claude Code, OpenAI Codex, Cursor, Gemini CLI, Windsurf, Aider, and other AI coding assistants. Follow these guidelines strictly to ensure your edits are successful and preserve registry integrity.

---

## Pre-Development Checklist

Before making any changes to the codebase, prompts, or configurations:

1. **Validate Current State**
   Ensure the existing repository is clean and passes all validation checks:
   ```bash
   python scripts/validate.py
   ```

2. **Generate Database & Index Maps**
   Compile all schema indexes to verify the workspace is in sync:
   ```bash
   python scripts/generate-data.py
   ```

3. **Review Registry Schemas & Mappings**
   Read and understand the following configuration/database files to locate registry structures:
   - [agent-registry.json](./agent-registry.json)
   - [divisions.json](./divisions.json)
   - [career-os.json](./career-os.json)

---

## Strict Rules for AI Agents

To avoid registry corruption, broken references, or validation failures, you must adhere to these rules:

* **Never Create Duplicate IDs**: When adding elements, verify that the new ID is unique across [agent-registry.json](./agent-registry.json).
* **Never Leave Orphaned Agents**: When registering an agent, ensure it exists in both [agent-registry.json](./agent-registry.json) (under `agents`) and [divisions.json](./divisions.json) (in its matching division's `agents` array).
* **Never Break Registry Integrity**: Do not delete registry entries that are referenced by other entities (e.g. workflows recommending specific agent IDs).
* **Never Edit Generated Files Directly**: Do not write edits directly to:
  - `career-os.json`
  - `search-index.json`
  - `knowledge-graph.json`
  - `README.md` (always edit `scripts/generate-data.py`'s template instead)
  - Maps (`agent-map.json`, `workflow-map.json`, `company-map.json`, `career-path-map.json`)
  - LLM text lists (`llms.txt`, `llms-full.txt`, `career-agents-index.json`)
* **Always Regenerate After Changes**: After modifying any agent files, workflows, divisions, companies, or career paths, you must run:
  ```bash
  python scripts/generate-data.py
  ```

---

## Required Validation Pipeline

Before committing your changes or reporting completion, you must execute:

```bash
python scripts/generate-data.py
python scripts/validate.py
```

**Both commands must run and pass with a status of 0 (success).** Ensure that:
- Markdown relative links are fully resolved (no broken links).
- Agent files are at least 300 words and have all required standard headings.
- Frontmatter schemas match the database registries.
