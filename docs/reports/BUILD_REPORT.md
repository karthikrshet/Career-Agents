# Build Report — Career Agents v3.0.3 Release

This report outlines the resolutions applied during the **Critical Platform Fix Sprint** to stabilize connection tests, file parsers, and client configurations.

---

## 1. Resolved Blockers & Bug Fixes

### Part 1: PDF Parser Fixes
- **Root Issue**: Server-side routes attempting to load browser-only canvas rendering dependencies (e.g. `DOMMatrix`) triggered build/collection crashes.
- **Fix**: Isolated client and server contexts under `apps/web/src/lib/pdf/`:
  - `server.ts` uses modern Node-compatible libraries (`pdf-parse`) dynamically imported within each method to bypass compilation-time module evaluations.
  - `browser.ts` maps browser-only previews.
  - `parser.ts` handles environment-aware routing.

### Part 2: Resume Studio Enhancement
- **Formats Supported**: PDF, DOCX, DOC, TXT, MD, JSON Resume, and ZIP (extracting resumes from archives).
- **Schema & Extraction**: JSON Resumes are parsed and compiled into styled markdown structure. ZIP uploads scan files for the first valid resume format and unpack the text context automatically.
- **Diagnostics Flow**: Upload → MIME Check → Extract → ATS Scorer → UI Report. Mapped friendly error catch blocks to show clean failure UI rather than raw exceptions.

### Part 3: AI Settings Persistence
- **State Synchronization**: Modified `handleSaveRotatedKeys` to update the active provider store context (`settings.aiProvider`) immediately when keys are updated.
- **Single Source of Truth**: Updated grid clicks to set the active store provider (`settings.aiProvider.provider`), maintaining exact key values across page refreshes.

### Part 4: AI Provider Router fallbacks
- **Priority Priority**: Configured keys in `packages/ai-router/services/router.ts` to fall back:
  1. User Saved Key (Zustand client config)
  2. Environment Variable (e.g., `GEMINI_API_KEY`, `OPENAI_API_KEY`)
  3. Provider Disabled / Unavailable error mapping.
- **Availability warning**: Skip routing to a provider if no auth keys are available, logging a clean `"Provider unavailable: API Key is missing or misconfigured."` error instead of crash logs.

### Part 5: Connection Diagnostics
- **Capabilities Verified**: Connected status, latency (ms), model details, success status, quota checks, rate limit states, and provider features (streaming, file upload, vision, tool calling, JSON mode).
- **Endpoint**: Updates in `apps/web/src/app/api/providers/test/route.ts` parse these fields dynamically and return 200 statuses for errors to show a clean diagnostics checklist.

### Part 6: Gemini 429 Warning
- **Heuristic Warning**: Caught 429 status codes and error contexts matching "quota" or "exhausted". Intercepted and returned:
  `"Your Gemini API quota has been exceeded. Please retry in a few minutes, view the Google Developer Documentation link (https://ai.google.dev/gemini-api/docs/quota), or switch your provider/model settings."`

### Part 7: Unified File Parser API
- **Endpoint**: `/api/parse-file` accepts all file types (PDF, Office, text, spreadsheets, ZIPs, images) and returns:
  - `filename`, `mime`, `pages` (array of text content per page), `text` (joined context), `images` (base64 data), `metadata` (parsed attributes), `size` (bytes), `language`, `tokens`, and `errors`.
- **Backwards Compatibility**: Returns both `metadata` and `data: metadata` to support legacy consumer routes.

### Part 8: Copilot Vision Uploads
- **Vision Integration**: Extracted dynamic blob/file images, loaded as base64 URLs, and passed them within the multi-part payload structure to the Copilot backend.
- **UI States**: File preview panels display download indicators, parsed statuses, and remove callbacks.

---

## 2. Validation & Compilation Checklist

| Step | Command | Status |
| :--- | :--- | :--- |
| **Linting Checks** | `npm run lint` | **PASSED** (0 warnings, 0 errors) |
| **Type Integrity** | `npm run type-check` | **PASSED** (0 type mismatch errors) |
| **Production Build** | `npm run build` | **PASSED** (all 31 static pages compile) |
| **Workspace Schema** | `python scripts/validate.py` | **PASSED** (all index entries clean) |
