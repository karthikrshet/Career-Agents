# Architecture Guide

This document details the layout structure of Career OS.

```
Career OS
├── resume-engine/           # Resume Studio & Job Match Engines
│   ├── file-parser.js       # JSON/TXT/PDF parser wrapper
│   ├── studio.js            # Scorer and Weak Bullet auditors
│   ├── job-engine.js        # Vacancies matching filters
│   └── scorer.js            # General scoring algorithms
├── recommendation-engine/   # Portfolios & Profile Analyzers
│   ├── github-analyzer.js   # Repos and README evaluation
│   ├── linkedin-analyzer.js # Tagline and keywords auditing
│   └── roadmap.js           # 30-60-90 Day Plan compiler
├── interview/               # Interactive panel simulators
│   └── engine.js            # Console mock QA panels
├── projects/                # Repositories skeleton files
│   └── generator.js         # Skeleton setup rules
├── runtime/                 # Core System managers
│   ├── profile-manager.js   # Dynamic profile scores
│   ├── dashboard.js         # Terminal progress visual bar
│   ├── reporter.js          # MD/HTML shareable reports
│   ├── telemetry.js         # Anonymous usage logging
│   └── plugin-manager.js    # Commands loading manager
├── mcp/                     # Server gateways
│   └── server.js            # stdio schema gateway
├── apps/web/                # Web Dashboard
└── scripts/                 # CLI entrypoints & test utilities
```
