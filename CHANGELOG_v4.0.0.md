# Changelog — Career Agents v4.0.0 (AI Career OS)

All notable changes to the Career Agents platform under the v4.0.0 release.

## [4.0.0] — 2026-07-28

### Added
- **Centralized AI Brain (`packages/brain/`)**: Established unified routing, prompt preparation, and memory synchronization coordinator.
- **RAG Knowledge Base (`packages/brain/knowledge.ts`)**: Built lightweight in-memory BM25 semantic search with citation generation.
- **Agent Timeline UI**: Implemented visual execution sequences, elapsed latency logs, and confidence gauge bars inside the Copilot chat.
- **ZIP & JSON Resume Parsers**: Integrated automatic zip-file search trackers and JSON Resume schema compilers into `/api/parse-file`.

### Changed
- **Copilot Route**: Routed all completion pipeline calls through the central AI Brain orchestrator instead of packages/agents/executor.
- **Settings State Persistence**: Synchronized rotated API keys and active provider settings dynamically in browser LocalStorage.
- **Defensive API Guards**: Implemented Array validation filters on report routes to prevent TypeErrors.

### Fixed
- **DOMMatrix Build Blocker**: Isolated server and browser PDF engines to prevent browser canvas evaluation crashes during static Next.js compilations.
