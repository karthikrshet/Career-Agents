# Agent Discovery Engine Specification

This document details the search, filtering, and indexing design for the **Agent Discovery Engine**.

---

## 🔍 Metadata Schema

To enable advanced search queries, every agent has been indexed with the following parameters:

- **Difficulty:** `Introductory`, `Intermediate`, `Advanced`.
- **Career Stage:** `Placement Prep`, `Internship Success`, `Developer Growth`, `Startup Strategy`, `Academic Research`.
- **Experience Level:** `Entry-Level`, `Associate`, `Mid-Senior`, `Lead`.
- **Division:** Matches one of the 14 standard divisions (e.g. `ai-engineering`, `cybersecurity`).
- **Tags:** Domain-specific keyword arrays (e.g. `LoRA`, `Terraform`, `GRC`, `SQL`).
- **Company Target:** (Where applicable) Target company specific (e.g. `Google`, `Amazon`, `Meta`).

---

## 🛠️ Search Engine Architecture

```text
[Search Term / Filters] ➔ [Parser & Weighting Engine] ➔ [Index Scanner] ➔ [Weighted Results]
```

### 1. Keyword & Tag Querying
- Match user inputs against `agent_id`, `name`, and `tags` using full-text indexing.
- Apply high-weight bias (3x score multiplier) to exact tag array matches.

### 2. Multi-Filter Logic
- Build filter combinations (e.g. `experience_level == Entry-Level && difficulty == Advanced`).
- Query results are cached locally in the client container to ensure sub-millisecond latency.

### 3. Dynamic Learning Paths
- Automatically recommend adjacent agents depending on current searches.
- Example: If a user searches for `aws-cloud-architect`, the engine suggests `terraform-specialist` and `cloud-security-advisor` as complementary learning path components.
