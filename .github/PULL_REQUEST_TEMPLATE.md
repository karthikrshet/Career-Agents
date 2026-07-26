# Pull Request Template

## Description
Provide a concise description of the changes introduced by this PR. Mention any issue(s) this PR resolves.

Fixes # (issue)

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Agent addition (adding a new agent to the registry)
- [ ] Documentation update

## PR Checklist
Please review and check all items that apply to this pull request:

- [ ] My code follows the code style and guidelines of this project.
- [ ] I have performed a self-review of my own code.
- [ ] I have commented my code, particularly in hard-to-understand areas.
- [ ] My changes generate no new warnings or console errors.
- [ ] I have run the typescript compiler check (`npm run type-check`) in `apps/web/` and it passes.
- [ ] I have run linting rules (`npm run lint`) and it passes.

### If adding or editing an Agent:
- [ ] The agent Markdown file is ≥ 300 words.
- [ ] The agent Markdown contains all required headings (Role, Approach, Key Capabilities, When to Use, Output Format).
- [ ] The ID is unique and matched in both `agent-registry.json` and `divisions.json`.
- [ ] I have run `python scripts/validate.py` locally and it passes with exit code 0.
- [ ] I have run `python scripts/generate-data.py` locally and it compiles all databases successfully.

## Verification & Testing
Describe the tests that you ran to verify your changes. Provide instructions so we can reproduce.

**Validation Command:**
```bash
python scripts/validate.py
python scripts/generate-data.py
```

## AI Tools Used
Which AI coding assistants were used to generate this patch?
- [ ] Claude Code
- [ ] Cursor / Roo Code
- [ ] Windsurf / Cascade
- [ ] Gemini CLI / Aider
- [ ] None
