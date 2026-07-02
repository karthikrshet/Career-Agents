# Contributor Guide

## Purpose

This guide helps contributors make high-quality changes to Career-Agents without creating review burden for maintainers. The repository is an open-source collection of career, placement, internship, startup, academic, and developer AI agents. Contributions are welcome, but the bar is intentionally high: every new file should make the repository more useful for students, freshers, software developers, contributors, and maintainers.

The best contributions are specific, practical, and easy to review. They improve an agent, add a missing workflow, clarify documentation, fix metadata drift, or strengthen tooling without changing unrelated files.

## Scope

Use this guide when contributing agents, workflows, documentation, registry updates, validation fixes, or integration support. For agent writing rules, read `docs/agent-standard.md`. For release procedure, read `docs/release-guide.md`. For platform packaging, read `docs/integrations.md`.

## Standards

Every contribution should satisfy these standards:

- **Focused:** One pull request should solve one clear problem.
- **Traceable:** File changes should match the stated purpose.
- **Consistent:** Naming, formatting, headings, and metadata should follow repository conventions.
- **Actionable:** Documentation and workflows should help users do something repeatable.
- **Reviewable:** Avoid large unrelated rewrites.
- **Respectful of scope:** Do not modify protected or unrelated directories just because you noticed improvements.

For new or rewritten content, avoid placeholder text, generic AI phrasing, shallow bullet lists, and advice that could apply to any repository.

## Contribution Types

### Agent Contribution

Use when adding or improving an AI agent in a division folder. Requirements:

- Follow `docs/agent-standard.md`.
- Use complete frontmatter.
- Include all required sections.
- Make the personality unique.
- Add practical deliverables and examples.
- Update registries if the agent is new.

### Workflow Contribution

Use when adding or improving a repeatable process in `workflows/`. A workflow should combine agents into an operating system, not summarize a topic. It should include audience, prerequisites, execution plan, weekly plan, daily checklist, KPIs, mistakes, outcomes, and next workflow.

### Documentation Contribution

Use when improving `docs/`, `README.md`, or contributor-facing guidance. Documentation should include purpose, scope, standards, examples, best practices, common mistakes, and implementation guidance where relevant.

### Tooling Contribution

Use when improving validation, conversion, install scripts, or CI support. Tooling changes must explain expected behavior, local test commands, and compatibility impact.

## Examples

Good contribution description:

```text
Improves workflows/ats-optimization.md from a short checklist into a complete three-week ATS operating system with prerequisites, daily checklist, KPIs, common mistakes, and next workflow guidance.
```

Weak contribution description:

```text
Updated docs.
```

Good file scope:

```text
docs/agent-standard.md
docs/contributor-guide.md
```

Risky file scope:

```text
docs/agent-standard.md
career/*
README.md
agent-registry.json
```

Unless the change explicitly requires all of those files, reviewers will ask for the PR to be narrowed.

## Best Practices

- Read the strongest existing files before writing new ones.
- Use repository paths in references, such as `career/resume-strategist.md`.
- Keep examples realistic: use student, fresher, developer, recruiter, and maintainer scenarios.
- When editing workflows, show cadence: what happens daily, weekly, and after results arrive.
- When editing docs, explain the "why," not only the instruction.
- Run validation before submitting.
- Keep generated files out of commits unless the repository expects them.
- Use plain markdown tables and code blocks where they improve usability.
- Prefer direct language over marketing language.

## Common Mistakes

- **Drive-by rewrites:** Rewriting unrelated files makes review harder and increases merge risk.
- **Adding new agents without registry updates:** Users and tools may not discover the agent.
- **Writing workflows as articles:** A workflow must be executable repeatedly.
- **Skipping examples:** Contributors need to see the expected shape of output.
- **Using placeholder claims:** "Add more details here" or "TBD" is not acceptable.
- **Overlapping existing agents:** If the repository already has a specialist, improve it or define a clearly different scope.
- **Ignoring Windows users:** Provide commands that work for the repository's supported environments when possible.

## Implementation Guidance

Before opening a pull request:

1. Create a focused branch.
2. Identify exactly which files need to change.
3. Read the relevant standards in `docs/`.
4. Make the smallest complete change that solves the issue.
5. Run validation:

```bash
python scripts/validate.py
```

On Windows, use the repository's PowerShell install or validation commands if available:

```powershell
scripts/install.ps1 -DryRun
```

6. Review `git diff --stat` and confirm the changed files match your intent.
7. Write a PR description with:
   - what changed
   - why it changed
   - how it was validated
   - any follow-up work intentionally left out

## Developer Onboarding Walkthrough

New to contributing to Career-Agents? Follow this step-by-step onboarding walkthrough to set up your environment and verify your first change:

### Step 1: Environment Setup
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/karthikrshet/Career-Agents.git
   cd Career-Agents
   ```
2. **Install CLI Dependencies:**
   ```bash
   npm install
   ```

### Step 2: Verify Existing Setup
Run the validation script to ensure your starting environment passes all checks:
```bash
python scripts/validate.py
```
You can also preview an installation to test the scripting runtime:
```bash
# On Linux/macOS
./scripts/install.sh --dry-run
# On Windows
powershell -File scripts/install.ps1 -DryRun
```

### Step 3: Propose a Change or Add an Agent
1. **Create a local branch:** `git checkout -b feat/my-new-agent`
2. **Write the Agent:** Place the new agent in its relevant lowercase division folder (e.g., `career/`, `resume/`, `interview/`, `networking/`, `engineering/`, `startup/`, `projects/`, or `company-interviews/`). Refer to `docs/agent-standard.md` for section headings and word count limits.
3. **Register the Agent:**
   Every new agent must be logged in `divisions.json` and `agent-registry.json`. You can automatically generate these indices by executing the synchronization script:
   ```bash
   # Running the registry generation helper
   python scripts/sync.py
   ```
4. **Re-run Validation:** Ensure `python scripts/validate.py` passes.

### Step 4: Submit a Pull Request
Commit your changes, push to your fork, and open a Pull Request using the checklist template.

Maintainers should prioritize contributions that make the repository easier to use, easier to validate, and easier to extend. A small, excellent workflow improvement is more valuable than a broad, shallow rewrite.
