# Contributing to Career-Agents

Welcome! We are excited that you want to contribute to the Open-Source Career Operating System. By contributing prompts, workflow playbooks, or CLI features, you are helping engineers globally automate their career scaling.

---

## 🛠️ Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/Career-Agents.git
   cd Career-Agents
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```

---

## 🤖 Adding a New Agent

All agent prompts are defined under `agents/` as Markdown documents. To add a new agent, follow these steps:

1. **Create the Prompt File**:
   Create a markdown file under `agents/` (e.g. `agents/cloud-architect-coach.md`) and define:
   *   Vibe, Difficulty, Experience Levels.
   *   Core system instructions.
   *   Example outputs.
2. **Register the Agent**:
   Add an entry inside `agent-registry.json`:
   ```json
   {
     "id": "cloud-architect-coach",
     "name": "Cloud Architect Coach",
     "description": "Guides candidates on AWS/GCP system design loops.",
     "filename": "agents/cloud-architect-coach.md",
     "division": "Engineering",
     "vibe": "Technical & Rigorous",
     "color": "#EA580C",
     "emoji": "☁️",
     "difficulty": "Expert",
     "experienceLevel": "Senior",
     "popularity": 85
   }
   ```
3. **Verify the Schema**:
   Run the CLI validation test to make sure there are no syntax anomalies, missing files, or schema violations:
   ```bash
   npm test
   ```

---

## 📜 Pull Request Guidelines

*   Ensure all tests pass before submitting your PR (`npm test` must be fully green).
*   Clearly document the target role, division, or company preparation track that the new agent addresses.
*   Do not submit generic prompt collections. All agents must define structured metrics, vibes, steps, and target outputs.
