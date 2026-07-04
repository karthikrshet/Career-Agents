# NPM Release Checklist: Career-Agents

Follow these steps before tagging and publishing a new release:

- [ ] **Run Validator Checkups**: Verify relative links, JSON schema validations, and templates mapping:
  ```bash
  python scripts/validate.py
  ```
- [ ] **Run Core Compiler Database**: Regenerate search index, knowledge graphs, and LLM text files:
  ```bash
  python scripts/generate-data.py
  ```
- [ ] **Run Diagnostic Doctor**:
  ```bash
  career-agents doctor
  ```
- [ ] **Run MCP Server Tests**: Assert all tool handshakes and traversal boundaries pass:
  ```bash
  node scripts/test-mcp.js
  ```
- [ ] **Dry-run Pack**: Check file counts and verify packed size remains < 1 MB:
  ```bash
  npm pack --dry-run
  ```
- [ ] **Update Package Version**: Increment SemVer correctly (`npm version patch | minor | major`).
- [ ] **NPM Login & Auth Check**: Verify authentication status:
  ```bash
  npm whoami
  ```
- [ ] **Publish Package**:
  ```bash
  npm publish --access public
  ```
