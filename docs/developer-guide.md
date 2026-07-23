# Developer Guide

This document outlines guidelines for contributing to Career OS.

## Development Checklist

1. Validate repository state:
   ```bash
   python scripts/validate.py
   ```
2. Generate search index & compile maps:
   ```bash
   python scripts/generate-data.py
   ```

---

## Testing

Career OS uses a modular test suite. Run unit and integration checks:

```bash
node scripts/test-studio.js
```

Verify standard index traversals:

```bash
node scripts/test-unit.js
```
