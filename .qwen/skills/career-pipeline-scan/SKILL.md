---
name: career-pipeline-scan
description: Scan ATS job boards for open roles (Greenhouse, Lever, Ashby, Workable, SmartRecruiters, RemoteOK, Arbeitnow, Himalayas)
license: MIT
---

# career-pipeline-scan

Scan 8 major ATS job board providers for active job postings with native streaming compression.

## Supported Providers
- `greenhouse` (e.g. Stripe, Figma, Airbnb)
- `lever` (e.g. Netlify, Spotify)
- `ashby` (e.g. OpenAI, Notion, Ramp — auto gzip/brotli decompression)
- `workable`
- `smartrecruiters`
- `remoteok`
- `arbeitnow`
- `himalayas`

## Usage

```bash
career-agents pipeline scan <companyToken> [provider]

# Examples:
career-agents pipeline scan openai ashby
career-agents pipeline scan stripe greenhouse
career-agents pipeline scan netlify lever
```

