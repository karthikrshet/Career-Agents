# NPM Publication Process

This guide details the packaging configurations and automated size checks required before releasing Career-Agents to the public NPM registry.

---

## 🛠️ Package Configuration Checklist

Ensure the following properties are configured inside `package.json`:

1.  **Module System Compatibility**: Set `"type": "module"` to natively support ESM imports.
2.  **Binary Mappings**: The `"bin"` section must link `career-agents` to the CLI script:
    ```json
    "bin": {
      "career-agents": "./scripts/cli.js"
    }
    ```
3.  **SDK Exports Mapping**: Make sure SDK symbols are exposed via the `"exports"` tag:
    ```json
    "exports": {
      ".": "./scripts/sdk.js"
    }
    ```
4.  **Files Array**: Verify that all division-specific templates, registries, and launchers are listed under `"files"`. Crucially, **exclude** developmental artifacts, local databases, and temporary prompts logs (e.g. `llms-full.txt`) to keep package footprints compact.

---

## 📦 Package Size Verification

Before uploading to registry nodes, compile and verify the packed size remains under **1 MB**:
```bash
npm pack --dry-run
```
The typical optimized size should hover around **715-725 kB**.
