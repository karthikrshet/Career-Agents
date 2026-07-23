# Migration Guide: v1.3.x to v2.0.0

Version 2.0.0 upgrades Career-Agents from a prompt repository to a complete Career Operating System.

## Major Changes

1. **CLI Commands Expansion**: `career-agents` now runs active product engines directly from your terminal.
2. **Interactive Mock Interview Loops**: Direct feedback evaluation loops via `career-agents mock`.
3. **Opt-in Telemetry**: Anonymous telemetry is active and can be configured inside `.career-profile.json`.
4. **Plugin Architecture**: Developers can load extensions by dropping custom scripts into the `plugins/` directory.

## MCP Upgrades
Exposes new tool APIs:
- `resume_review`
- `github_review`
- `linkedin_review`
- `career_dashboard`
- `mock_interview`
- `roadmap`
