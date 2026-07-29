# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [10.0.0] - 2026-07-29

### Added
- **System Diagnostics Cockpit**: Implemented a comprehensive `/demo` control center for QA diagnostics and system health monitoring.
- **AI Provider Failover Chain**: Robust fallback routing in `router.ts` that gracefully degrades across 15+ LLM providers.
- **RAG Vector Search Integration**: Integrated semantic document searching inside the AI brain engine.
- **Mock Validation Assets**: Bundled `test_prep.pdf`, `test_resume.docx`, and `test_roadmap.xlsx` to support integration testing.

### Changed
- **Landing Page Redesign**: Radically redesigned `page.tsx` introducing a fully immersive 18-point flow, neural network background, real product mockups, and dynamic Framer Motion animations.
- **Mobile UX Enhancements**: Refactored `topbar.tsx` and `sidebar.tsx` drawer logic, ensuring perfect 320px viewport compatibility.
- **Core API Enhancements**: Upgraded logic inside the Job Hub, GitHub Analyzer, Interview Lab, and Resume Studio routing endpoints for massive throughput gains.
- **Unified Footer**: Consolidated the marketing footer into a clean, 5-column enterprise layout containing a newsletter form and active service status indicators.

### Security
- **SSRF Hardening**: Introduced comprehensive validation and strict local path escaper logic across file parsing APIs.
- **Rate Limiters**: Configured `middleware.ts` to strictly enforce request quotas and drop abusive IPs.

### Fixed
- **Auth Edge Cases**: Addressed missing `DATABASE_URL` routing fallbacks, rendering a safe mock state instead of a hard crash.
- **PDF/DOCX Parsing Issues**: Improved native binary stream conversions in `file-parser.js` resolving unicode chunk failures.
