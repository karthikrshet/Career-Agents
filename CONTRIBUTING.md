# Contributing to Career-Agents

Welcome! We are excited that you want to contribute to the Open-Source Career Operating System. By contributing prompts, workflows, target company tracks, or CLI features, you are helping candidates globally automate their career scaling.

---

## 📂 Repository Structure & Divisions

All AI agent prompts are written in Markdown format and grouped into one of the **19 functional divisions** based on their domain:

*   `career/` — Placement strategy, resume engineering, and networking.
*   `engineering/` — Software architecture, devops, database, and front/backend specs.
*   `interview/` — Behavior drills, system design, mock coaching, and leadership loops.
*   `company-interviews/` — Target-company-specific interview coaches.
*   ... (and 15 other specialty directories like `ai-engineering`, `cloud`, `cybersecurity`).

> [!WARNING]
> Do NOT create or place agent markdown files in a flat `agents/` directory. Place them in the appropriate domain folder (e.g. `career/` or `engineering/`).

---

## 🤖 Adding a New Agent

To add a new career coach or reviewer agent, follow this step-by-step registration flow:

### 1. Create the Prompt File
Create your markdown file in the correct division folder (e.g., `engineering/graphql-api-architect.md`). Your agent prompt MUST use the standard sections defined in `docs/agent-standard.md`, including:
*   `## 🧠 Your Identity & Memory`
*   `## 🎯 Your Core Mission`
*   `## 🚨 Critical Rules You Must Follow`
*   `## 📋 Technical Deliverables`
*   `## 🔄 Workflow Process`
*   `## 💭 Communication Style`
*   `## 🔄 Learning & Memory`
*   `## 🎯 Success Metrics`
*   `## 🚀 Advanced Capabilities`

*Ensure your agent prompt text has at least 300 words.*

### 2. Register in the Agent Registry (`agent-registry.json`)
Add an entry to `agent-registry.json` under the `agents` array:
```json
{
  "id": "graphql-api-architect",
  "name": "GraphQL API Architect",
  "division": "engineering",
  "description": "Guides candidates on schema design, query complexity, and federation patterns.",
  "status": "live",
  "filename": "engineering/graphql-api-architect.md",
  "tags": ["graphql", "api", "architecture"],
  "color": "#E10098",
  "emoji": "🕸️",
  "vibe": "precise, standards-driven, architecture-obsessed",
  "difficulty": "Expert",
  "experience_level": "Senior",
  "career_stage": "Scale",
  "industry": "Software",
  "skills": ["API Design", "Distributed Systems"],
  "companies": [],
  "related_agents": ["backend-architect"],
  "related_workflows": ["technical-interview-week"],
  "popularity_score": 50
}
```

### 3. Add to Divisions Mapping (`divisions.json`)
Find the matching division object in `divisions.json` and append your agent to the `agents` array:
```json
{
  "id": "graphql-api-architect",
  "name": "GraphQL API Architect",
  "file": "engineering/graphql-api-architect.md"
}
```

### 4. Recompile Databases & Indexing
Run the compiler script to regenerate `career-os.json`, `search-index.json`, and search maps:
```bash
python scripts/generate-data.py
```

### 5. Verify local health
Run the diagnostics check to verify that your frontmatter, schemas, and directories align perfectly:
```bash
npm test
```
*Note: `npm test` runs `node scripts/cli.js doctor` under the hood, calling `scripts/validate.py`.*

---

## 🔄 Adding or Updating Workflows

Multi-agent sequence blueprints are stored in the `workflows/` directory as markdown checklists, and registered in `workflow-registry.json`:
- **Workflow File:** Create `workflows/your-workflow-id.md`.
- **Registry:** Register it in `workflow-registry.json` detailing its id, category, filename, description, recommended agents, and prerequisites.

---

## 🪵 Branch Naming & Commit Conventions

To maintain a clean and reviewable git history, we mandate standard conventions:

### Branch Naming Conventions
Create descriptive branches based on your work:
- Feature additions: `feat/your-feature-name` (e.g., `feat/use-command`)
- Bug fixes: `fix/your-bug-name` (e.g., `fix/career-paths-mismatch`)
- Documentation: `docs/your-doc-name`
- CI/CD updates: `ci/your-action-name`

### Commit Message Conventions
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat(cli): add use command configuration`
- `fix(paths): resolve missing frontend path files`
- `docs(contributing): update folder paths`
- `chore(governance): update codeowners mapping`

---

## 📜 Pull Request (PR) Guidelines

*   **No Redundant Commits:** Squash work commits if possible.
*   **Run Local Tests:** Ensure `npm test` is fully green before submitting.
*   **No Broken Links:** Relative links must resolve to existing files.
*   **Description:** Clearly list the target role, division, or company preparation track addressed.
