# Architecture

## Purpose

This document explains how Career-Agents is organized, how information moves through the repository, and how maintainers should think about future growth. Career-Agents presents itself as "The World's Largest Collection of Career, Placement, Internship, and Developer AI Agents"; the architecture therefore has to support both human browsing and machine-driven packaging. A student should be able to open a folder and understand which agent to use. A contributor should be able to add a new agent without guessing where metadata lives. A maintainer should be able to validate consistency before release.

The repository is intentionally simple: agent behavior lives in markdown, shared metadata lives in JSON, documentation lives in `docs/`, reusable execution plans live in `workflows/`, and automation lives in `scripts/`. The project avoids hiding core content behind a build system because the agents themselves are the product.

## Scope

This architecture guide covers repository layout, file responsibilities, metadata flow, validation expectations, integration boundaries, and maintenance practices. It does not define the writing standard for individual agents; use `docs/agent-standard.md` for that. It does not define release procedure; use `docs/release-guide.md`. It does not replace `README.md`; the README remains the public entry point.

## Repository Map

```text
career/          Career, placement, internship, job-search, and general career strategy agents.
company-interviews/
                 Target-company-specific interview coaches (FAANG+).
engineering/     Developer and software engineering architects and performance specialists.
interview/       Specialized interview drilling, mock interviewing, behavioral strategies, and group discussions.
networking/      Alumni outreach, LinkedIn messaging, recruiter screening, and referral strategies.
projects/        Academic, final-year-project, research, documentation, and viva defense agents.
resume/          Technical resume achievements writing, keyword optimization, layout design, and portfolios.
startup/         Founder strategy, validation, MVP scoping, growth loops, and competitor analysis.
docs/            Maintainer and contributor documentation.
workflows/       Repeatable operating systems that combine multiple agents for a goal.
scripts/         Validation, conversion, and install tooling.
divisions.json   Domain-level index used to group agents.
agent-registry.json
                 Central machine-readable list of agents and metadata.
tools.json       Integration targets and supported tool metadata.
```

## Standards

Every architectural decision should protect four standards:

1. **Discoverability:** A user should find the right agent or workflow without reading the entire repository.
2. **Reviewability:** A maintainer should be able to review content quality from plain files and predictable metadata.
3. **Portability:** Agents should be usable in different AI runtimes, editors, and assistants without rewriting the core content.
4. **Consistency:** Folder names, agent names, registry records, workflow references, and documentation should not drift apart.

Agent markdown files are source-of-truth for behavior. Registry files are source-of-truth for indexing. Workflows are not agents; they are execution plans that recommend agents in sequence. Docs are not marketing pages; they are operational guidance for contributors and maintainers.

## Examples

When a contributor adds a new `career/interview-feedback-analyst.md`, the architecture expects three aligned artifacts:

```text
career/interview-feedback-analyst.md
agent-registry.json entry for Interview Feedback Analyst
divisions.json career division entry
```

If that agent belongs in a workflow, the workflow should reference the file path directly:

```markdown
- `career/interview-feedback-analyst.md` for post-round feedback diagnosis.
```

A good workflow does not duplicate the full agent. It explains when to use the agent, what input to provide, what output to expect, and how the result feeds the next step.

## Best Practices

- Keep source content in markdown and metadata in JSON; do not bury agent definitions inside generated files.
- Use stable file names that match the agent's role in lowercase kebab-case.
- Reference agents by repository path in workflows and docs so users can open the exact file.
- Update registries in the same change as new or renamed agents.
- Keep workflows goal-oriented: `ats-optimization.md` is better than `resume-tips.md` because it describes an operating process.
- Treat scripts as helpers, not replacements for review. Passing validation does not mean the writing is good.
- Preserve folder boundaries. Career agents should not move into engineering because they mention technical interviews; the primary user problem determines placement.

## Common Mistakes

- **Changing an agent file without updating metadata.** This creates search and integration drift.
- **Adding a workflow that reads like a blog post.** Workflows must be repeatable systems with inputs, outputs, cadence, KPIs, and next workflow guidance.
- **Duplicating documentation across files.** Link to the canonical guide instead of copying long rules into every document.
- **Using vague names.** `career-helper.md` is not discoverable; `salary-negotiation-coach.md` is.
- **Treating generated integration output as canonical.** Generated manifests should be reproducible from repository source files.
- **Adding platform-specific assumptions to agent content.** Agent files should remain portable unless an integration guide explicitly says otherwise.

## Implementation Guidance

When adding or changing content, follow this sequence:

1. Identify the content type: agent, workflow, documentation, registry metadata, or tooling.
2. Place the file in the correct folder based on primary purpose.
3. Apply the relevant standard: agent standard, workflow structure, or documentation structure.
4. Update metadata only when the content affects discoverability or integrations.
5. Run validation scripts before opening a pull request.
6. Review the diff for protected boundaries: docs changes should not accidentally rewrite agents; workflow changes should not alter registries unless necessary.

Maintainers should review architecture changes with extra care. A small naming or registry decision can affect every downstream integration. The safest architecture is boring, explicit, and easy to inspect.
