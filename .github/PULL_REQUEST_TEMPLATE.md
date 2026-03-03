---
name: Feature or fix
about: Use this template for pull requests adding or improving agents
---

# Pull Request Checklist

- [ ] Title follows: `feat(agent): add <agent-id>` or `fix(agent): ...`
- [ ] Updated `divisions.json` and `agent-registry.json` if adding or modifying an agent
- [ ] Ran `python scripts/sync.py` to regenerate registry metadata
- [ ] Agent file follows the Agent File Standard in `docs/agent-standard.md`
- [ ] Self-reviewed against the Quality Bar (length, deliverables, structure)
- [ ] Tests or manual validation steps included where applicable (validation script passed)

## Summary
Short description of changes and who benefits from them.

## Files Changed
List of new or updated files.

## Review Notes
Anything maintainers should pay attention to during review.
