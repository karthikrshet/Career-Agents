# Career Agents v4.0.0 — Platform Roadmap

This roadmap documents the implementation phases and future plans for the AI Career Operating System.

## Phase 1: Unified AI Brain (Completed)
- Establish `packages/brain/` containing: `brain.ts`, `planner.ts`, `router.ts`, `context.ts`, `memory.ts`, `skills.ts`, `knowledge.ts`, `history.ts`, `summary.ts`.
- Route message completions through `/api/copilot` using `processThroughBrain` coordination.

## Phase 2: Permanent Dossier Memory (Completed)
- Synchronize weekly commitments, learning progress, weak topics, and portfolio scores into persistent Zustand store.
- Re-hydrate client metrics across page reloads.

## Phase 3: Copilot 2.0 & RAG Pipeline (Completed)
- Enable visual agent timeline checklists, confidence indicators, and document attachment chips.
- Hook `/api/parse-file` into `indexDocument` to enable real-time Knowledge Base RAG citations.

## Phase 4: Job Hub & Application Automation (In Progress)
- Visual search boards filtering across LinkedIn, Indeed, Otta, and Greenhouse.
- Generate recruiter emails, referrals, and cover letters aligned with ATS scores.

## Phase 5: Voice Interview Diagnostics & IDE Playground (Planned)
- Audio transcription checkpoints analyzing STAR formats and speech speed.
- In-browser code compiler sandboxes with Big O analysis.
