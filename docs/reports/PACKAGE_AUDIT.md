# Package Audit Report (v1.4.0)

This document presents the packaging metrics, integrity hashes, and file manifest verification for the Career OS npm package release v1.4.0.

---

## Package Metadata

- **Package Name**: career-agents
- **Version**: 1.4.0
- **Filename**: career-agents-1.4.0.tgz
- **Compressed Size**: 836.2 kB
- **Unpacked Size**: 3.9 MB
- **SHA-1 Shasum**: 957940eec2f88643f5349c895718b4efcc832fba
- **Total Files**: 311

---

## Monorepo Layout Inclusion Verification

All modular monorepo directories and configuration components are validated for npm publication.

### 1. Core Logic (packages/)
Included packages:
- `packages/core/`: Common runtime engines, target roadmaps, project scaffolds.
- `packages/resume/`: PDF parsers, ATS scorers, weak bullet optimizers, FAANG check scripts.
- `packages/dashboard/`: CLI dashboards and metrics manager.
- `packages/github/`: GitHub portfolios scanner.
- `packages/linkedin/`: LinkedIn headline and copy critiques.
- `packages/interview/`: Interactive mock panels.
- `packages/reports/`: Reports compilers.
- `packages/plugins/`: External command loader.
- `packages/telemetry/`: Usage logging.
- `packages/mcp/`: Model Context Protocol stdio transport interfaces.

### 2. Plugins (plugins/)
- Includes `plugins/sample-plugin.js` to showcase command extensions lifecycle.

### 3. Controls (features.json)
- Includes `features.json` to configure command visibility gates.

### 4. Agent Prompt Ecosystem
- All 146 specialized prompt files mapped across 19 division subdirectories.
- Pre-configured target templates (`resume-templates.json`, `companies.json`, `career-paths.json`).
- Dynamic search maps (`search-index.json`, `knowledge-graph.json`, `career-os.json`).

---

## Runtime Verification

The packaged artifact was verified locally:
1. Checked executable mapping of global binary `career-agents` to `scripts/cli.js`.
2. Verified Model Context Protocol command execution: `node scripts/cli.js mcp` launches stdio channel correctly.
3. Verified validation command `npm test` runs correctly.
