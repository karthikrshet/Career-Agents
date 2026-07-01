# Integrations

## Purpose

This document explains how Career-Agents content should be packaged for external AI tools, editors, CLIs, and assistant runtimes. The repository's primary assets are markdown agents and workflows; integrations should preserve that source content while adapting metadata, installation shape, and runtime instructions for specific platforms.

The goal is portability. A strong Career-Agent should work as a readable markdown file, a tool-specific instruction package, a subagent, or a prompt bundle without changing its professional identity.

## Scope

This guide covers integration principles, supported target categories, metadata expectations, conversion practices, examples, best practices, common mistakes, and implementation guidance. It does not document every platform's complete API. Platform-specific implementation should live in tooling, scripts, or dedicated integration notes when the project grows.

## Standards

All integrations should follow these standards:

- **Source-of-truth remains in the repository.** Do not manually maintain separate divergent versions of agents.
- **Preserve agent identity.** Name, description, vibe, and behavioral sections should survive conversion.
- **Keep generated output inspectable.** Users should understand what was produced and why.
- **Avoid platform lock-in.** Agent markdown should not become dependent on one runtime.
- **Respect repository metadata.** Use `agent-registry.json`, `divisions.json`, and `tools.json` where relevant.
- **Fail clearly.** If a target does not support a feature, the converter should warn rather than silently dropping important content.

## Supported Integration Targets

### Claude Code

Claude Code-style integrations should package an agent as a project instruction or subagent-style file. The conversion should preserve the role, rules, deliverables, and workflow process. Use this when users want a specialist inside a coding or writing workspace.

Example output shape:

```json
{
  "name": "Resume Strategist",
  "description": "Narrative-focused resume strategy agent",
  "source": "career/resume-strategist.md"
}
```

### Cursor

Cursor integrations may map agents into rules, workspace instructions, or metadata packages. Cursor-oriented output should be concise enough to use in an editor while still linking back to the full markdown agent.

### Codex

Codex-style integrations should preserve procedural behavior, validation rules, and tool-aware instructions. Agents that involve repository work should be packaged with clear boundaries and expected outputs.

### Gemini CLI

Gemini CLI packaging should expose agents as local command-ready prompts or manifests. It should include agent name, description, source path, and any installation notes needed for local use.

## Examples

An integration manifest should reference the source file:

```json
{
  "id": "career.ats-resume-reviewer",
  "name": "ATS Resume Reviewer",
  "division": "career",
  "source": "career/ats-resume-reviewer.md",
  "recommended_for": ["resume parsing", "ATS optimization", "keyword mapping"]
}
```

A workflow integration should reference recommended agents rather than embedding all of them:

```json
{
  "workflow": "ats-optimization",
  "source": "workflows/ats-optimization.md",
  "agents": [
    "career/ats-resume-reviewer.md",
    "career/resume-strategist.md"
  ]
}
```

## Best Practices

- Keep conversion deterministic: the same input should produce the same output.
- Include source paths for traceability.
- Preserve section order when exporting full agents.
- Use platform metadata for discovery, not as a replacement for the markdown body.
- Add tests or validation checks when adding a new target.
- Document known limitations of each integration.
- Keep platform-specific configuration out of agent files unless absolutely required.
- Use `tools.json` to describe supported platforms and integration status.

## Common Mistakes

- **Forking content per platform.** This creates drift and stale agents.
- **Dropping critical rules.** Some converters over-trim content and remove safety or quality requirements.
- **Ignoring workflows.** Workflows are important integration assets because they show how agents combine into real operating systems.
- **Overpromising support.** A target should be marked experimental if conversion is incomplete.
- **Hardcoding paths carelessly.** Use repository-relative paths consistently.
- **Generating opaque files.** Users should be able to inspect integration output.

## Implementation Guidance

When adding a new integration target:

1. Define the target's use case.
2. Identify required metadata fields.
3. Map repository metadata to target metadata.
4. Preserve source path and agent body.
5. Decide whether workflows should be exported.
6. Add converter support in `scripts/` if appropriate.
7. Update `tools.json`.
8. Document usage and limitations.
9. Validate with at least one career agent, one engineering agent, and one workflow.

Before releasing integration support, test these questions:

- Can a user trace generated output back to the source file?
- Does the agent still include its critical rules and deliverables?
- Are unsupported features documented?
- Can the output be regenerated reliably?
- Does the target package help users use Career-Agents rather than hiding the repository?

Integrations should make the collection easier to adopt, not harder to maintain.
