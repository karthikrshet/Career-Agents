# Career OS Technical Development Guide

This guide establishes the coding standards, directory conventions, and testing guidelines for Career OS contributions.

---

## Directory Conventions

All runtime code, utilities, and engines must live in modular packages under the `packages/` directory:

- `packages/core/`: Common helpers, base configurations, and roadmaps.
- `packages/cli/`: Orchestrates terminal entry points and command routing.
- `packages/resume/`: Formats, parses, and scores resume files.
- `packages/github/`: Grades technical profiles.
- `packages/linkedin/`: Scans taglines and summary copy.
- `packages/interview/`: Interactive readline simulator loops.
- `packages/dashboard/`: Visual meters and goal configurations.
- `packages/reports/`: Markdown, JSON, and HTML output compiler.
- `packages/plugins/`: Dynamically imports developer scripts.
- `packages/telemetry/`: Track usage.
- `packages/mcp/`: Server STDIO gateways.

---

## Coding Standards

1. **ES Modules (ESM)**: Use import/export statements statically. Avoid raw CommonJS `require()`.
2. **Dynamic Imports**: Load heavy feature engines inside CLI/MCP cases to optimize launch speed.
3. **No Placeholders**: Always write production-ready code. Fallbacks must return robust simulated data instead of generic strings.
4. **Frozen Module Namespaces**: In ES modules, module namespace objects are read-only. Store registration states in local variables.

---

## Error Handling and Logging

1. **Try-Catch Wrappers**: Wrap file system, parsing, and HTTP requests in safe try-catch handlers.
2. **Graceful Fallbacks**: If external APIs fail or are rate-limited, yield cached or simulated data cards instead of crashing.
3. **Log Directories**: Write log entries under the `exports/logs/` directory (e.g. `telemetry.log`, `mcp.log`).

---

## Testing Requirements

1. **Standalone Test Scripts**: Every package must include dedicated test scripts under the `scripts/` directory.
2. **Coverage**: Validate boundaries (inputs/outputs), error recovery, and grading calibrations.
