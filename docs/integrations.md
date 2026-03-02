# Integrations

Supported integration targets and guidance for packaging agents.

Claude Code
- Goal: produce a manifest that can be loaded as a Project instruction or subagent.
- Use `scripts/convert.py --target claude-code` to generate a starting manifest.

Cursor
- Goal: export rules or a metadata package that maps agent frontmatter into Cursor metadata.

Codex
- Goal: provide instruction sets and optional tool bindings for Codex-style runtimes.

Gemini CLI
- Goal: provide a CLI manifest and an installable package that surfaces the agent as a local command.

Notes
- Converters are intentionally minimal; treat generated manifests as starting points for integration work.
