# Career Agents — Plugin Marketplace

Extend Career Agents with official and community plugins.

---

## Overview

Plugins extend the Career Copilot by injecting specialized instructions into the AI system prompt. When a plugin is enabled, every Copilot response is shaped by that plugin's behavior — without requiring any additional user input.

**Plugin Lifecycle:**
```
Available → Installed → Enabled
                  ↓         ↓
              Uninstalled  Disabled
```

---

## Plugin Architecture

Plugins are managed entirely in the Zustand store:

```typescript
installedPlugins: Record<string, boolean>  // { "star-coach": true }
enabledPlugins: Record<string, boolean>    // { "star-coach": true }
```

When the Copilot API route processes a request, it reads `enabledPlugins` from the request context and injects the corresponding system prompt additions:

```typescript
// From /api/copilot/route.ts
if (enabledPlugins["star-coach"]) {
  pluginPrompt += `[Plugin Active: STAR Behavioral Coach]
  Instruction: Always structure behavioral responses in STAR format.`;
}

if (enabledPlugins["leetcode-tracker"]) {
  pluginPrompt += `[Plugin Active: LeetCode Tracker Connector]
  Instruction: Focus on algorithmic correctness and Big O notation.`;
}

if (enabledPlugins["salary-intel"]) {
  pluginPrompt += `[Plugin Active: Salary Intelligence]
  Instruction: Focus on compensation negotiation and salary benchmarks.`;
}

if (enabledPlugins["resume-pdf"]) {
  pluginPrompt += `[Plugin Active: Resume PDF Parser]
  Instruction: Tailor suggestions for PDF layout compliance.`;
}
```

---

## Plugin Permissions Model

Each plugin declares the permissions it requires:

| Permission | Description |
|---|---|
| `read_profile` | Access user name, target role, target company |
| `read_resume` | Access resume analysis data (ATS score, bullets, keywords) |
| `write_copilot_context` | Inject instructions into Copilot system prompt |

Permissions are declared in the plugin metadata and shown in the install dialog. Career Agents does not enforce permissions programmatically — they are informational for user transparency.

---

## Installing a Plugin

1. Go to **Marketplace** in the Career Agents sidebar
2. Browse or search for a plugin
3. Click **Install**
4. The plugin downloads (simulated, ~1.5 seconds) and is auto-enabled
5. Return to **Career Copilot** — the plugin is now active

## Disabling / Uninstalling a Plugin

- **Disable**: Click the toggle in the Marketplace or plugin detail panel — the plugin stays installed but its context is not injected
- **Uninstall**: Click Uninstall in the plugin detail panel — removes from installed and enabled state

---

## Available Plugins

### STAR Behavioral Coach

| Field | Value |
|---|---|
| **ID** | `star-coach` |
| **Version** | `1.0.4` |
| **Category** | Interview |
| **Author** | Career Agents Team |
| **License** | MIT |
| **Downloads** | 12,400+ |
| **Rating** | 4.8 / 5 |
| **Permissions** | `read_profile`, `read_resume`, `write_copilot_context` |

**What it does:** Modifies Career Copilot to always structure behavioral responses using the STAR framework (Situation, Task, Action, Result). Every response to a behavioral question will explicitly map your experience to each STAR component with highlighted metrics and outcomes.

**Best for:** Behavioral interview preparation, Amazon Leadership Principles, Google Googleyness rounds, and any company using structured behavioral interviews.

**Effect on Copilot:** When asking about behavioral situations, the Copilot response will be structured as:
```
Situation: [context]
Task: [what needed to be done]
Action: [what you specifically did]
Result: [measurable outcome with metrics]
```

---

### LeetCode Tracker Connector

| Field | Value |
|---|---|
| **ID** | `leetcode-tracker` |
| **Version** | `0.8.2` |
| **Category** | Interview |
| **Author** | Community Contributors |
| **License** | MIT |
| **Downloads** | 4,800+ |
| **Rating** | 4.6 / 5 |
| **Permissions** | `read_profile`, `write_copilot_context` |

**What it does:** Shifts Career Copilot's coding discussions toward algorithmic correctness, Big O time/space complexity analysis, and LeetCode problem recommendations.

**Best for:** Technical interview preparation, coding round prep, algorithm study planning.

**Effect on Copilot:** Coding-related questions will always include:
- Time complexity analysis
- Space complexity analysis
- Related LeetCode problem suggestions
- Edge case identification

---

### Resume PDF Parser

| Field | Value |
|---|---|
| **ID** | `resume-pdf` |
| **Version** | `1.2.0` |
| **Category** | Resume |
| **Author** | Career Agents Team |
| **License** | MIT |
| **Downloads** | 4,120+ |
| **Rating** | 4.7 / 5 |
| **Permissions** | `read_resume` |

**What it does:** Enhances Copilot responses about resumes to focus on PDF layout compliance, ATS parsing rules specific to PDF formatting, and visual hierarchy issues that affect machine readability.

**Best for:** Users who submit resumes as PDFs and want to ensure they pass both ATS and human screening.

**Effect on Copilot:** Resume advice will emphasize:
- PDF-specific ATS pitfalls (tables, columns, headers)
- Font and formatting recommendations for PDF readers
- Section order optimal for PDF ATS parsing

---

### Salary Intelligence

| Field | Value |
|---|---|
| **ID** | `salary-intel` |
| **Version** | `1.0.3` |
| **Category** | Jobs |
| **Author** | Community |
| **License** | Apache 2.0 |
| **Downloads** | 3,300+ |
| **Rating** | 4.5 / 5 |
| **Permissions** | `read_profile` |

**What it does:** Focuses Career Copilot compensation discussions on negotiation tactics, salary benchmark references (Levels.fyi, Glassdoor, Blind), and levels alignment.

**Best for:** Offer negotiation, compensation benchmarking, and understanding total compensation at different companies.

**Effect on Copilot:** Compensation discussions will include:
- Negotiation tactics and counter-offer strategies
- References to industry compensation benchmarks
- Levels alignment (L4 vs L5 vs L6 comparisons)
- Total compensation breakdown (base, equity, bonus)

---

## Plugin Architecture for Developers

The plugin system is intentionally lightweight. Plugins currently extend Copilot behavior through system prompt injection. Future plugin API capabilities are on the roadmap.

### Current Plugin Capability
- Inject instructions into the Copilot system prompt
- Read user profile and analysis data (via `write_copilot_context` permission)

### Plugin Metadata Structure

```typescript
interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  downloads: number;
  enabled: boolean;
  installed: boolean;
  category: "Interview" | "Resume" | "Jobs";
  tags: string[];
  permissions?: string[];
  website?: string;
  documentation?: string;
  license?: string;
  changelog?: string[];
  rating?: number;
  reviewsCount?: number;
  dependencies?: string[];
}
```

### Sample Plugin File

See `plugins/sample-plugin.js` in the repository root for the reference plugin structure.

---

## Roadmap

Future plugin capabilities planned for v3.x:
- Plugin SDK for external developers
- Plugin verification and code signing
- Webhooks from external services (LeetCode stats, GitHub activity)
- Custom agent injection via plugins
- Plugin-specific UI panels in the sidebar
