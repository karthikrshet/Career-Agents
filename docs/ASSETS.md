# Repository Visibility Assets

This guide contains the design specifications, dimensions, and path structures for the visual media assets used in the **Career Operating System**.

---

## 🎨 Asset Mappings & Specifications

To add high-fidelity visual banners or live CLI recording previews, place the graphic files in the designated paths below:

| Asset Name | Target File Path | Recommended Dimensions | Description |
| :--- | :--- | :--- | :--- |
| **GitHub Social Preview** | `docs/assets/social-preview.png` | `1280 x 640 px` (2:1 aspect ratio) | Displayed on GitHub link sharing cards. |
| **Repository Header Banner** | `docs/assets/repo-banner.png` | `1280 x 200 px` | Centered top banner for the `README.md`. |
| **CLI Demo GIF** | `docs/assets/demos/cli-demo.gif` | `800 x 400 px` | Shows `career-agents recommend` execution. |
| **Launcher Demo GIF** | `docs/assets/demos/launcher.gif` | `800 x 400 px` | Shows copy-to-clipboard browser launch loops. |
| **Scoring Engine GIF** | `docs/assets/demos/score-check.gif` | `800 x 400 px` | Shows interactive scorecard calculating scores. |

---

## 🏗️ Career OS Architecture Diagram

This ASCII layout represents how candidate input flows through the Career OS logic layers to run local sandbox sessions or output IDE instructions:

```
[Candidate Input]
  │
  ├── 1. Profile Queries (Skills, Exp, Co)
  │      └── recommendation-engine/recommender.js
  │            └── Matches ID Registry tags
  │                  └── Output: Recommended Agents / Workflows / Bundles
  │
  ├── 2. Compliance Score Check (career-agents score)
  │      └── Questionnaire answers (1-3)
  │            └── Calculates subscores (Resume, Interview, Network)
  │                  └── Output: Dashboard scorecards & Growth pointers
  │
  └── 3. Local Execution & Launchers (career-agents run)
         ├── Simulated Local console runtime
         ├── Live API fetch (Gemini / Claude / ChatGPT keys)
         └── IDE rules syncs (.cursorrules, .aider.instructions.md)
```

---

## 🔗 Knowledge Graph Structure Mappings

This model maps entity nodes connectivity inside **[knowledge-graph.json](../knowledge-graph.json)**:

```
    [Bundles] ────(includes)────> [Career Paths]
        │                             │
    (packs)                       (requires)
        │                             │
        v                             v
    [Companies] ──(requires)────> [Skills] <───(requires)─── [Agents]
        │                                                       │
   (recommends)                                            (belongs to)
        │                                                       │
        v                                                       v
    [Workflows] ──(recommends)──────────────────────────> [Divisions]
```
