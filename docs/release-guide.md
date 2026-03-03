# Release Guide

## Purpose

This guide defines how maintainers prepare, validate, and publish Career-Agents releases. A release should give users confidence that the repository is consistent, documented, and ready to use. Because Career-Agents is both a human-readable knowledge base and a machine-readable agent collection, release quality depends on content review, metadata consistency, workflow usefulness, and tooling checks.

## Scope

Use this guide when preparing versioned releases, publishing GitHub releases, coordinating larger content updates, or validating a significant pull request before merge. This guide does not replace `CHANGELOG.md`; the changelog records user-facing changes. It does not replace `docs/agent-standard.md`; that file defines agent content quality.

## Standards

Every release should satisfy these standards:

- Agent files meet the repository agent standard.
- Workflows are complete, actionable, and current.
- Documentation explains how to use and contribute to the repository.
- JSON metadata is valid and synchronized.
- Validation scripts pass locally and in CI.
- Changelog entries are clear and user-facing.
- Version numbers follow semantic versioning.
- Release notes describe value, not only file changes.

## Release Types

### Patch Release

Use for documentation fixes, typo corrections, validation fixes, minor workflow improvements, and small metadata corrections.

Example: `0.3.1`

### Minor Release

Use for new agents, new workflows, new integration targets, substantial documentation upgrades, or meaningful tooling improvements.

Example: `0.4.0`

### Major Release

Use for breaking structure changes, registry format changes, major folder reorganizations, or integration changes that require users to update tooling.

Example: `1.0.0`

## Examples

Good changelog entry:

```markdown
## [0.4.0] - 2026-07-02

### Added
- Added complete workflow operating systems for internship hunt, ATS optimization, FAANG preparation, and offer comparison.

### Changed
- Expanded contributor documentation with standards, examples, common mistakes, and implementation guidance.

### Fixed
- Corrected registry references for renamed career agents.
```

Weak changelog entry:

```markdown
- Updated files.
```

Good release note:

```text
This release improves the repository's usability for students and contributors by turning workflows into repeatable career operating systems and documenting the quality standard expected for future agents.
```

## Best Practices

- Review content before running release commands; automation cannot detect shallow advice.
- Keep release commits focused.
- Verify the changed-file list before tagging.
- Include examples in docs and workflows whenever the release changes user behavior.
- Confirm protected files were not changed accidentally.
- Treat registry changes as high-risk because integrations may depend on them.
- Prefer one release note per user-facing improvement.
- Do not tag a release with failing validation.

## Common Mistakes

- **Releasing metadata drift.** If an agent exists but is missing from registries, users and tools may not find it.
- **Skipping workflow review.** Workflows can become stale when agent names or recommended paths change.
- **Publishing vague release notes.** Users need to know what improved.
- **Mixing unrelated changes.** Large releases are acceptable; incoherent releases are not.
- **Forgetting docs.** New functionality without documentation increases maintainer support load.
- **Using version bumps inconsistently.** New content generally deserves a minor release; fixes usually deserve a patch.

## Implementation Guidance

Before release:

1. Review `git status --short` and confirm only intended files changed.
2. Run validation:

```bash
python scripts/validate.py
```

3. If install validation is supported for your platform, run it:

```powershell
scripts/install.ps1 -ValidateOnly
```

or:

```bash
scripts/install.sh --validate-only
```

4. Check JSON formatting for:
   - `agent-registry.json`
   - `divisions.json`
   - `tools.json`
5. Review docs and workflows touched in the release.
6. Update `CHANGELOG.md`.
7. Decide the version number.
8. Create a release commit if needed.
9. Tag the release:

```bash
git tag -a v0.4.0 -m "Release v0.4.0"
git push origin v0.4.0
```

10. Draft a GitHub release using changelog notes.

## Release Checklist

```markdown
- [ ] Agent files meet standard
- [ ] Workflows are complete and actionable
- [ ] Docs are current
- [ ] JSON metadata is synchronized
- [ ] Validation passes locally
- [ ] CI passes
- [ ] Changelog updated
- [ ] Version selected correctly
- [ ] Release notes written
- [ ] Tag pushed
```

Maintainers should delay a release if the repository is technically valid but not useful. Career-Agents depends on trust: users should feel that every release improves their ability to use, extend, or integrate the collection.
