# Career OS — Release Process

This document details the step-by-step process for tagging, compiling, and publishing new versions of Career OS to GitHub and the npm registry.

---

## Release Checklist

Before tagging and publishing a new release, verify the following steps in order:

### 1. Local Code Validation
- Run type checking: `cd apps/web && npm run type-check`
- Run linting checks: `cd apps/web && npm run lint`
- Validate local build: `cd apps/web && npm run build`

### 2. Registry Validation
- Run the python validator: `python scripts/validate.py` (Must exit with status 0)
- Regenerate data indexes: `python scripts/generate-data.py` (Compiles maps, search index, and metadata files)

### 3. Version Bump
- Update version in root `package.json`.
- Update version in `apps/web/package.json`.
- Check that the version string is synchronized under Settings or `SUPPORTED_MODELS.md`.

---

## Release Versioning Rules

We use [Semantic Versioning (SemVer)](https://semver.org/):

- **Major (X.0.0):** Breaking changes to registry schemas, Next.js architecture refactors, or deprecated database schemas.
- **Minor (0.Y.0):** New app pages, added AI providers, or division updates.
- **Patch (0.0.Z):** Bug fixes, updated agent prompts, stylesheet fixes, or dependency security patches.

---

## GitHub Tagging Workflow

To tag a release and push it to the main repository:

```bash
# 1. Stage and commit all updates
git add -A
git commit -m "chore(release): bump version to v2.5.0"

# 2. Tag the commit with annotated notes
git tag -a v2.5.0 -m "v2.5.0 - Enterprise Documentation Suite"

# 3. Push commit and tag to GitHub
git push origin main
git push origin v2.5.0
```

---

## Publishing to npm

Career OS publishes helper packages to the npm registry (like CLI utilities and the SDK client). Follow these steps to publish packages:

### Step 1: Login to npm
Ensure your terminal session is authenticated with your npm credentials:
```bash
npm login
```
Follow the interactive prompts to authenticate via the browser.

### Step 2: Publish SDK & CLI Package
Navigate to the root workspace and run:
```bash
# Perform a dry run to verify file bundles
npm publish --dry-run

# Publish the package
npm publish --access public
```

---

## CI Release Automation

The release pipeline (`.github/workflows/release.yml`) automatically compiles and generates assets whenever a new tag matches the pattern `v*`:

1. Triggers when a new version tag is pushed.
2. Validates build parameters and runs code lints.
3. Generates a zipped release bundle including:
   - Root agent prompts directory.
   - Statically compiled `search-index.json`.
   - Statically compiled `knowledge-graph.json`.
4. Creates a GitHub release draft with the compressed release assets attached.
