# Contributing to Career OS

Thank you for your interest in contributing! Career OS is an open source AI career intelligence platform and we welcome contributions of all kinds.

## Quick Start

```bash
git clone https://github.com/karthikrshet/Career-Agents.git
cd Career-Agents
python scripts/validate.py    # verify workspace is clean
python scripts/generate-data.py  # compile indexes
```

## Pre-Development Checklist

Before making **any** changes:

1. Run `python scripts/validate.py` — must exit 0
2. Run `python scripts/generate-data.py` — must succeed
3. Read `agent-registry.json`, `divisions.json`, and `AGENTS.md`
4. Check for duplicate IDs before adding new agents

## Types of Contributions

### 🤖 Adding a New Agent

1. Create a markdown file in the appropriate division directory (minimum 300 words)
2. Add required frontmatter (see existing agents for format)
3. Add entry to `agent-registry.json` (unique ID)
4. Add agent ID to the correct division in `divisions.json`
5. Run `python scripts/generate-data.py`
6. Run `python scripts/validate.py` — must pass

**Never create duplicate IDs. Never leave orphaned agents.**

### 🐛 Bug Fixes

1. Fork the repository
2. Create a branch: `git checkout -b fix/your-bug-description`
3. Fix the bug, add tests if applicable
4. Run validation pipeline
5. Submit a PR with clear description of the fix

### ✨ New Features

1. Open an issue first to discuss the feature
2. Wait for maintainer approval before implementing
3. Follow existing code style and architecture
4. Ensure `npm run build` passes with zero errors

### 📝 Documentation

- README is auto-generated — edit `scripts/generate-data.py` template instead
- Other docs in `/` root are editable directly

## Code Style

- TypeScript strict mode
- Functional React components with hooks
- Zustand for state management
- Tailwind CSS for styling (existing classes only, no ad-hoc)
- No hardcoded API keys or secrets

## Commit Convention

```
feat: add new resume scoring metric
fix: correct agent classifier threshold
docs: update MCP configuration guide
chore: regenerate workspace indexes
```

## Pull Request Checklist

- [ ] `python scripts/validate.py` passes (exit 0)
- [ ] `python scripts/generate-data.py` succeeds
- [ ] `npm run type-check` passes (zero TS errors)
- [ ] `npm run build` succeeds (exit 0)
- [ ] No duplicate agent IDs created
- [ ] No generated files edited directly

## Getting Help

- Open a [GitHub Issue](https://github.com/karthikrshet/Career-Agents/issues)
- Start a [Discussion](https://github.com/karthikrshet/Career-Agents/discussions)

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
