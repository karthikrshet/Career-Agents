# Contributor Guide

This guide helps contributors prepare an agent that will pass review quickly.

Before you start

- Check `divisions.json` to avoid duplicates.
- Open an issue for new divisions or high-level proposals.

Authoring tips

- Follow the Agent File Standard in `docs/agent-standard.md`.
- Keep the voice senior-practitioner and specific.
- Include example inputs and expected outputs where helpful.

Validation & submission

- Run `scripts/install.sh --validate-only` (macOS/Linux) or `scripts/install.ps1 -ValidateOnly` (Windows) to validate repository layout.
- Run `python3 scripts/convert.py list` to inspect available converter targets.
- Open a PR using the `PULL_REQUEST_TEMPLATE.md`.
