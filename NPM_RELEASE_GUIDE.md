# NPM Release Guide: Career-Agents
This guide outlines the workflow and verification checks required to publish the `@career-agents` package to the NPM registry.

---

## 🛠️ Package Verification Tests (Local Run)
Before publishing, always verify that the npm tarball is cleanly packaged and all file paths exist:

1.  **Dry-run Packaging:**
    ```bash
    npm pack --dry-run
    ```
    Verify that the listed files include all 19 division folders, registries, scripts, templates, workflows, and companies JSON files.
2.  **Local Installation Test:**
    Test installing the package globally from the local folder path:
    ```bash
    npm install -g .
    ```
3.  **Local Binary Execution Check:**
    Verify that the global path resolves and the command executes:
    ```bash
    career-agents doctor
    career-agents list
    career-agents resume templates
    ```

---

## 🪵 Version Management & SemVer Rules

We follow the [Semantic Versioning (SemVer)](https://semver.org/) standards (`MAJOR.MINOR.PATCH`):
- **PATCH (x.y.z -> x.y.z+1):** Backwards-compatible bug fixes or minor content revisions in agent system prompts.
- **MINOR (x.y.z -> x.y.+1.0):** Backwards-compatible feature additions (e.g. adding new templates, new companies, new CLI subcommands, or tools).
- **MAJOR (x.y.z -> x+1.0.0):** Incompatible API breaks (e.g., changing JSON schemas of registries, removing subcommands, or renaming core file directories).

### Version Bump Workflow
To bump version and compile changes:
1.  Run the git clean status check.
2.  Increment version using npm commands:
    ```bash
    npm version patch # or minor, major
    ```
3.  Recompile database indexes:
    ```bash
    python scripts/generate-data.py
    ```

---

## 🚀 NPM Publishing Workflow

1.  **Log in to NPM Registry:**
    Ensure you are logged in to the registry with publishing rights:
    ```bash
    npm login
    ```
2.  **Execute Final Doctor Checks:**
    Ensure all files and dependencies validate successfully:
    ```bash
    npm test
    ```
3.  **Publish Package:**
    Publish the package to the public registry:
    ```bash
    npm publish --access public
    ```
