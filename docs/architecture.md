# Architecture Overview

CodeMyFYP-Agents is organized for discoverability, reviewability, and tool-driven conversion.

Repository layout

- `career/`, `engineering/`, `startup/`, `projects/`: Agent markdown files grouped by domain.
- `divisions.json`: Machine-readable division and agent registry.
- `agent-registry.json`: Central, queryable index of agents for tooling and the website.
- `tools.json`: Supported platforms and integration notes.
- `scripts/`: Tooling for validation and conversion.

Design principles

- Human-first: Agent files are readable, reviewable, and copy-paste friendly.
- Machine-friendly: JSON registries and conversion scripts enable automation.
- Incremental integration: Converters produce simple manifests first, then evolve.

Extensibility

- Add a new converter class in `scripts/convert.py` and register the target name.
- Update `tools.json` to declare supported integration details.
