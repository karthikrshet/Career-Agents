# Developer Plugin Guide

This document describes how to develop and integrate custom command plugins with the Career OS command orchestrator.

---

## Plugin Architecture

Career-Agents implements an extensible command router that dynamically scans a local `plugins/` directory. Files matching the `*.js` naming pattern are scanned, registered, and appended to the global command switch.

---

## Directory Conventions

- **Source Path**: `plugins/` (located in the workspace root).
- **Format**: ES Modules (using static export declarations).

---

## Module Lifecycle

1. **Scan Phase**: The plugin manager crawls `plugins/*.js`.
2. **Registration Phase**: The module is imported dynamically. It must export a standard structure detailing metadata and command controllers.
3. **Execution Phase**: If the command arguments match, the registered execution controller is invoked, supplying CLI arguments.

---

## Plugin Schema

Every plugin module must export an object containing:
- `name`: String identifier of the command.
- `description`: Text shown in the helper menu when listed.
- `execute`: Async execution function containing runtime logic.

### Implementation Example

Create a file named `plugins/sample-plugin.js`:

```javascript
export const name = 'hello';
export const description = 'Greet the user and check workspace context';

export async function execute(args) {
  const user = args[0] || 'Contributor';
  console.log(`Hello, ${user}!`);
  console.log('Plugin system is active and running.');
}
```

---

## Rules and Constraints

1. **Isolated Variables**: ES module namespace objects are read-only. Store states or configuration parameters in local variables.
2. **Dynamic Imports**: Load heavy dependencies (such as filesystem helpers or external package connections) inside the `execute` block to keep loading quick.
3. **No External Dependencies**: Plugins must only use packages listed in the core dependency manifest. Avoid requiring unlisted Node modules.
