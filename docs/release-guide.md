# Release Guide

This document explains how to add, validate, release, and contribute to Career-Agents.

## How to add a new agent
1. Create a new markdown file in the appropriate division folder: `career/`, `engineering/`, `startup/`, or `projects/`.
2. Include YAML frontmatter with the required fields: `name`, `description`, `color`, `emoji`, and `vibe`.
3. Use the agent standard headings in this order:
   - `## 🧠 Your Identity & Memory`
   - `## 🎯 Your Core Mission`
   - `## 🚨 Critical Rules You Must Follow`
   - `## 📋 Technical Deliverables`
   - `## 🔄 Workflow Process`
   - `## 💭 Communication Style`
   - `## 🔄 Learning & Memory`
   - `## 🎯 Success Metrics`
   - `## 🚀 Advanced Capabilities`
4. Make the agent substantive, specialist-focused, and action-oriented.
5. Add the new agent entry to `divisions.json` and `agent-registry.json`.
6. Update `README.md` and any relevant docs if the agent expands the public roster.

## How to validate agents
- Run `python scripts/validate.py` from the repository root.
- The validator checks:
  - required division folders exist
  - agent markdown files are present and listed in `divisions.json`
  - YAML frontmatter fields are present
  - required section headings are included
  - minimal content length is met
- Fix any validation errors before opening a pull request.

## How to run CI checks
- The repository uses GitHub Actions for CI.
- Key CI steps include:
  - linting and schema validation for JSON metadata
  - running `python scripts/validate.py`
  - verifying agent registry and division sync
- To run locally, use the same validation command and ensure your branch includes updated metadata.

## How to publish releases
1. Update `CHANGELOG.md` with a new release section and release notes.
2. Increment the version label in registry files if relevant.
3. Tag the release in Git:
   ```bash
git tag -a v0.1.0 -m "Release v0.1.0"
git push origin v0.1.0
```
4. Open a GitHub release using the changelog notes.
5. For semantic versioning:
   - increment `MAJOR` for breaking changes
   - increment `MINOR` for new agents, tooling, or features
   - increment `PATCH` for fixes, docs updates, and small improvements

## How contributors should submit pull requests
- Create a branch from `main` for the change.
- Include only related changes in the PR.
- Run `python scripts/validate.py` before submitting.
- Update `CHANGELOG.md` with a brief note under `## [Unreleased]` if the PR adds or changes functionality.
- Provide a clear PR description that explains:
  - what changed
  - why it was changed
  - what files were updated
- Link any issue or feature request when available.

## Versioning strategy
- This project follows semantic versioning and release hygiene.
- Use versions like `0.1.0`, `0.2.0`, `1.0.0`.
- Reserve `0.x.y` for initial growth and stabilization.
- Track larger milestones such as:
  - `20 agents` for Phase 1
  - `50 agents` for Phase 2
  - `100 agents` for Phase 3
- Document release notes in `CHANGELOG.md` for every version.

## Notes on repository tooling
- Install scripts: `scripts/install.sh`, `scripts/install.ps1`
- CLI scaffolding: `scripts/cli.js`
- Validation: `scripts/validate.py`
- CI/CD: GitHub Actions workflow in `.github/workflows/`
- Documentation: docs in `docs/`, plus `README.md`, `CONTRIBUTING.md`, and community files.
