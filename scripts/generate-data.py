#!/usr/bin/env python3
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

REGISTRY_PATH = ROOT / "agent-registry.json"
DIVISIONS_PATH = ROOT / "divisions.json"
WORKFLOW_REGISTRY_PATH = ROOT / "workflow-registry.json"
CAREER_OS_PATH = ROOT / "career-os.json"
README_PATH = ROOT / "README.md"

BUNDLES_DIR = ROOT / "bundles"
COMPANIES_DIR = ROOT / "companies"
PATHS_DIR = ROOT / "career-paths"
INTELLIGENCE_DIR = ROOT / "intelligence"

SEARCH_INDEX_PATH = ROOT / "search-index.json"
KNOWLEDGE_GRAPH_PATH = ROOT / "knowledge-graph.json"
LLMS_TXT_PATH = ROOT / "llms.txt"
LLMS_FULL_TXT_PATH = ROOT / "llms-full.txt"
CAREER_AGENTS_INDEX_PATH = ROOT / "career-agents-index.json"

# Discoverability Map Paths
AGENT_MAP_PATH = ROOT / "agent-map.json"
WORKFLOW_MAP_PATH = ROOT / "workflow-map.json"
COMPANY_MAP_PATH = ROOT / "company-map.json"
CAREER_PATH_MAP_PATH = ROOT / "career-path-map.json"

def load_json(path):
    if not path.exists():
        return {}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_dir_jsons(directory):
    items = []
    if directory.exists():
        for path in sorted(directory.glob("*.json")):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    items.append(json.load(f))
            except Exception as e:
                print(f"Error reading {path}: {e}")
    return items

def compile_career_os(agents, divisions, workflows, bundles, companies, paths, integrations):
    print("Compiling career-os.json core configuration...")
    
    stats = {
        "agent_count": len(agents),
        "division_count": len(divisions.get("divisions", [])),
        "workflow_count": len(workflows.get("workflows", [])),
        "company_count": len(companies),
        "career_path_count": len(paths),
        "bundle_count": len(bundles),
        "integration_count": len(integrations.get("supported_platforms", []))
    }
    
    career_os_data = {
        "$schema": "https://codemyfyp-agents.dev/schema/career-os.json",
        "repository": "Career-Agents",
        "name": "The Open-Source Career Operating System",
        "version": "1.0.0",
        "statistics": stats,
        "agents": agents,
        "divisions": divisions.get("divisions", []),
        "workflows": workflows.get("workflows", []),
        "bundles": bundles,
        "companies": companies,
        "career_paths": paths,
        "integrations": integrations.get("supported_platforms", [])
    }
    
    with open(CAREER_OS_PATH, "w", encoding="utf-8") as f:
        json.dump(career_os_data, f, indent=2)
    print("Compiled and wrote career-os.json successfully.")

def generate_search_index(agents, divisions, workflows, bundles, companies, paths):
    print("Generating search index...")
    items = []
    
    # 1. Agents
    for a in agents:
        items.append({
            "id": a.get("id"),
            "name": a.get("name"),
            "type": "agent",
            "description": a.get("description"),
            "division": a.get("division"),
            "tags": a.get("tags", []),
            "skills": a.get("skills", []),
            "companies": a.get("companies", [])
        })
        
    # 2. Divisions
    for d in divisions.get("divisions", []):
        items.append({
            "id": d.get("division"),
            "name": d.get("name"),
            "type": "division",
            "description": d.get("description"),
            "tags": [],
            "skills": [],
            "companies": []
        })
        
    # 3. Workflows
    for w in workflows.get("workflows", []):
        items.append({
            "id": w.get("id"),
            "name": w.get("name"),
            "type": "workflow",
            "description": w.get("description"),
            "division": w.get("category"),
            "tags": [],
            "skills": [],
            "companies": []
        })
        
    # 4. Bundles
    for b in bundles:
        items.append({
            "id": b.get("id"),
            "name": b.get("name"),
            "type": "bundle",
            "description": b.get("description"),
            "tags": [],
            "skills": b.get("skills", []),
            "companies": b.get("companies", [])
        })

    # 5. Career Paths
    for p in paths:
        items.append({
            "id": p.get("id"),
            "name": p.get("name"),
            "type": "career-path",
            "description": p.get("description"),
            "tags": [],
            "skills": p.get("core_skills", []),
            "companies": []
        })
        
    # 6. Companies
    for c in companies:
        items.append({
            "id": c.get("id"),
            "name": c.get("name"),
            "type": "company",
            "description": c.get("name") + " interview preparation track.",
            "tags": [],
            "skills": c.get("skills", []),
            "companies": []
        })
        
    with open(SEARCH_INDEX_PATH, "w", encoding="utf-8") as f:
        json.dump({"items": items, "version": "1.0.0", "total": len(items)}, f, indent=2)
    print(f"Generated search-index.json with {len(items)} items.")

def validate_agents(agents):
    """Pre-flight check: fail fast with actionable errors if any agent has a missing division."""
    errors = []
    for a in agents:
        aid = a.get("id", "<missing-id>")
        div = a.get("division")
        if div is None:
            errors.append(f'  ERROR: Agent "{aid}" has a null division assignment.')
        elif not isinstance(div, str):
            errors.append(f'  ERROR: Agent "{aid}" has a non-string division value: {repr(div)}')
        elif div.strip() == "":
            errors.append(f'  ERROR: Agent "{aid}" has an empty division assignment.')
    if errors:
        print("\n[generate-data.py] DIVISION INTEGRITY FAILURES DETECTED:")
        for e in errors:
            print(e)
        print(f"\nTotal failures: {len(errors)}")
        print("Fix the division field in agent-registry.json for the agents listed above, then re-run.\n")
        raise SystemExit(1)
    print(f"Division integrity check passed: all {len(agents)} agents have valid division assignments.")

def generate_knowledge_graph(agents, divisions, workflows, bundles, companies, paths):
    print("Generating expanded knowledge graph...")
    nodes = []
    edges = []
    
    node_ids = set()
    
    def add_node(nid, name, ntype):
        if nid not in node_ids:
            nodes.append({"id": nid, "name": name, "type": ntype})
            node_ids.add(nid)
            
    def add_edge(src, tgt, rel):
        edges.append({"source": src, "target": tgt, "relation": rel})

    # Add divisions nodes
    for d in divisions.get("divisions", []):
        div_id = d.get("division")
        div_name = d.get("name")
        if div_id and isinstance(div_id, str) and div_id.strip():
            add_node(div_id, div_name or div_id.capitalize(), "division")
        else:
            print(f"  WARNING: Division entry missing 'division' field: {repr(d)} — skipping.")
        
    # Add agents nodes and division edges
    for a in agents:
        aid = a.get("id")
        div = a.get("division")
        add_node(aid, a.get("name"), "agent")
        if div and isinstance(div, str) and div.strip():
            add_node(div, div.capitalize(), "division")
            add_edge(aid, div, "belongs_to_division")
        else:
            print(f"  WARNING: Agent '{aid}' has invalid division {repr(div)} — skipping division edge.")
        
        # Add skills and skill edges
        for skill in a.get("skills", []):
            skill_id = "skill-" + skill.lower().replace(" ", "-")
            add_node(skill_id, skill, "skill")
            add_edge(aid, skill_id, "requires_skill")
            
        # Add company edges
        for company in a.get("companies", []):
            comp_id = company.lower()
            add_node(comp_id, company, "company")
            add_edge(aid, comp_id, "relevant_to_company")
            
        # Add related agent edges
        for related in a.get("related_agents", []):
            add_edge(aid, related, "related_to_agent")

    # Add workflows nodes and recommended agent edges
    for w in workflows.get("workflows", []):
        wid = w.get("id")
        add_node(wid, w.get("name"), "workflow")
        for r_agent in w.get("recommended_agents", []):
            add_edge(wid, r_agent, "recommends_agent")

    # Add bundles nodes and edges
    for b in bundles:
        bid = b.get("id")
        add_node(bid, b.get("name"), "bundle")
        for agent in b.get("agents", []):
            add_edge(bid, agent, "includes_agent")
        for wf in b.get("workflows", []):
            add_edge(bid, wf, "includes_workflow")
        for cp in b.get("career_paths", []):
            add_edge(bid, cp, "includes_path")
        for comp in b.get("companies", []):
            comp_id = comp.lower()
            add_node(comp_id, comp, "company")
            add_edge(bid, comp_id, "includes_company")
        for skill in b.get("skills", []):
            skill_id = "skill-" + skill.lower().replace(" ", "-")
            add_node(skill_id, skill, "skill")
            add_edge(bid, skill_id, "includes_skill")

    # Add career path nodes and mapping edges
    for p in paths:
        pid = p.get("id")
        add_node(pid, p.get("name"), "career-path")
        for skill in p.get("core_skills", []):
            skill_id = "skill-" + skill.lower().replace(" ", "-")
            add_node(skill_id, skill, "skill")
            add_edge(pid, skill_id, "requires_skill")
        for div in p.get("recommended_divisions", []):
            if div and isinstance(div, str) and div.strip():
                add_node(div, div.capitalize(), "division")
                add_edge(pid, div, "uses_division")
            else:
                print(f"  WARNING: Career path '{pid}' has invalid recommended_division {repr(div)} — skipping.")
        for agent in p.get("recommended_agents", []):
            add_edge(pid, agent, "uses_agent")
        for wf in p.get("recommended_workflows", []):
            add_edge(pid, wf, "uses_workflow")

    # Add companies nodes and mappings
    for c in companies:
        cid = c.get("id")
        add_node(cid, c.get("name"), "company")
        for agent in c.get("agents", []):
            add_edge(cid, agent, "requires_agent")
        for wf in c.get("workflows", []):
            add_edge(cid, wf, "requires_workflow")
        for skill in c.get("skills", []):
            skill_id = "skill-" + skill.lower().replace(" ", "-")
            add_node(skill_id, skill, "skill")
            add_edge(cid, skill_id, "requires_skill")

    with open(KNOWLEDGE_GRAPH_PATH, "w", encoding="utf-8") as f:
        json.dump({"nodes": nodes, "edges": edges, "version": "1.1.0"}, f, indent=2)
    print(f"Generated expanded knowledge-graph.json with {len(nodes)} nodes and {len(edges)} edges.")

def generate_discoverability_maps(agents, workflows, companies, paths):
    print("Generating discoverability maps...")
    
    # 1. Agent Map
    agent_map = {}
    for a in agents:
        agent_map[a.get("id")] = {
            "name": a.get("name"),
            "filename": a.get("filename"),
            "vibe": a.get("vibe"),
            "difficulty": a.get("difficulty"),
            "experience_level": a.get("experience_level")
        }
    with open(AGENT_MAP_PATH, "w", encoding="utf-8") as f:
        json.dump(agent_map, f, indent=2)
        
    # 2. Workflow Map
    workflow_map = {}
    for w in workflows.get("workflows", []):
        workflow_map[w.get("id")] = {
            "name": w.get("name"),
            "filename": w.get("filename"),
            "category": w.get("category")
        }
    with open(WORKFLOW_MAP_PATH, "w", encoding="utf-8") as f:
        json.dump(workflow_map, f, indent=2)

    # 3. Company Map
    company_map = {}
    for c in companies:
        company_map[c.get("id")] = {
            "name": c.get("name"),
            "agents": c.get("agents", []),
            "workflows": c.get("workflows", []),
            "skills": c.get("skills", [])
        }
    with open(COMPANY_MAP_PATH, "w", encoding="utf-8") as f:
        json.dump(company_map, f, indent=2)

    # 4. Career Path Map
    path_map = {}
    for p in paths:
        path_map[p.get("id")] = {
            "name": p.get("name"),
            "skills": p.get("core_skills", []),
            "agents": p.get("recommended_agents", [])
        }
    with open(CAREER_PATH_MAP_PATH, "w", encoding="utf-8") as f:
        json.dump(path_map, f, indent=2)
        
    print("Discoverability maps generated successfully.")

def generate_llm_indexes(agents, workflows):
    print("Generating LLM indexes...")
    
    # 1. llms.txt (brief catalog)
    txt_content = []
    txt_content.append("# Career-Agents LLM Discovery Catalog")
    txt_content.append("This file contains the map of available agents and operational workflows for automated tools.")
    txt_content.append("")
    txt_content.append("## Agents Roster")
    for a in agents:
        txt_content.append(f"- {a.get('name')} (ID: {a.get('id')} | Path: {a.get('filename')})")
        txt_content.append(f"  Description: {a.get('description')}")
        txt_content.append(f"  Stage: {a.get('career_stage')} | Level: {a.get('experience_level')} | Industry: {a.get('industry')}")
        txt_content.append(f"  Skills: {', '.join(a.get('skills', []))}")
        txt_content.append("")

    txt_content.append("## Workflows Roster")
    for w in workflows.get("workflows", []):
        txt_content.append(f"- {w.get('name')} (ID: {w.get('id')} | Path: {w.get('filename')})")
        txt_content.append(f"  Description: {w.get('description')}")
        txt_content.append(f"  Category: {w.get('category')}")
        txt_content.append(f"  Prerequisites: {', '.join(w.get('prerequisites', []))}")
        txt_content.append("")
        
    with open(LLMS_TXT_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(txt_content))
    print("Generated llms.txt")

    # 2. llms-full.txt (concatenated prompts)
    full_content = []
    full_content.append("# Career-Agents Full Prompt Manifest")
    full_content.append("This document bundles the complete details and rules of all active agents in the Career Operating System.")
    full_content.append("")
    for a in agents:
        full_content.append("="*60)
        full_content.append(f"AGENT: {a.get('name')} ({a.get('id')})")
        full_content.append(f"Path: {a.get('filename')}")
        full_content.append(f"Vibe: {a.get('vibe')}")
        full_content.append(f"Description: {a.get('description')}")
        full_content.append("="*60)
        
        agent_file_path = ROOT / a.get("filename")
        if agent_file_path.exists():
            full_content.append(agent_file_path.read_text(encoding="utf-8"))
        else:
            full_content.append("[Content Missing]")
        full_content.append("\n\n")

    with open(LLMS_FULL_TXT_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(full_content))
    print("Generated llms-full.txt")

    # 3. career-agents-index.json
    index_meta = {
        "repository": "Career-Agents",
        "name": "The Career Operating System Index",
        "total_agents": len(agents),
        "total_workflows": len(workflows.get("workflows", [])),
        "agents": [
            {
                "id": a.get("id"),
                "name": a.get("name"),
                "filename": a.get("filename"),
                "description": a.get("description"),
                "division": a.get("division"),
                "skills": a.get("skills", []),
                "experience_level": a.get("experience_level"),
                "difficulty": a.get("difficulty"),
                "career_stage": a.get("career_stage")
            } for a in agents
        ]
    }
    with open(CAREER_AGENTS_INDEX_PATH, "w", encoding="utf-8") as f:
        json.dump(index_meta, f, indent=2)
    print("Generated career-agents-index.json")

def build_merged_readme(agents, divisions_data, workflows, bundles, companies, paths):
    print("Generating merged README.md mapping Hero, Products, and complete Agent Ecosystem...")
    
    num_agents = len(agents)
    num_divs = len(divisions_data.get("divisions", []))
    num_workflows = len(workflows.get("workflows", []))
    num_bundles = len(bundles)
    num_paths = len(paths)
    num_companies = len(companies)

    # Build divisions listing
    divisions_markdown = []
    for div in divisions_data.get("divisions", []):
      div_name = div.get("name")
      div_id = div.get("division")
      div_desc = div.get("description")
      div_agents = div.get("agents", [])
      
      divisions_markdown.append(f"### {div_name} Division (`{div_id}`)")
      divisions_markdown.append(f"*{div_desc}*\n")
      divisions_markdown.append("| Agent Name | Status | Purpose / Description |")
      divisions_markdown.append("| :--- | :---: | :--- |")
      for a in div_agents:
        file_link = f"./{a.get('file')}"
        divisions_markdown.append(f"| [`{a.get('name')}`]({file_link}) | Live | {a.get('description')} |")
      divisions_markdown.append("\n")
      
    # Build career paths listing
    paths_markdown = []
    for p in paths:
      paths_markdown.append(f"#### [{p.get('name')}](./career-paths/{p.get('id')}.json)")
      paths_markdown.append(f"- **Focus**: {p.get('description')}")
      paths_markdown.append(f"- **Core Skills Required**: {', '.join(p.get('core_skills', []))}")
      paths_markdown.append(f"- **Associated Coaches**: {', '.join(p.get('recommended_agents', []))}")
      paths_markdown.append("")

    # Build company tracks listing
    companies_markdown = []
    for co in companies:
      companies_markdown.append(f"#### [{co.get('name')}](./companies/{co.get('id')}.json)")
      companies_markdown.append(f"- **Interview Rounds**: {', '.join(co.get('interview_process', []))}")
      companies_markdown.append(f"- **Key Competency Focus**: {', '.join(co.get('skills', []))}")
      companies_markdown.append(f"- **Recommended Coaches**: {', '.join(co.get('agents', []))}")
      companies_markdown.append("")

    # Build workflows listing
    workflows_markdown = []
    for w in workflows.get("workflows", []):
      workflows_markdown.append(f"- [**{w.get('name')}**](./{w.get('filename')}): {w.get('description')}")
      workflows_markdown.append(f"  - **Recommended Agents**: {', '.join(w.get('recommended_agents', []))}")

    divisions_str = "\n".join(divisions_markdown)
    paths_str = "\n".join(paths_markdown)
    companies_str = "\n".join(companies_markdown)
    workflows_str = "\n".join(workflows_markdown)

    # Main README Assembly
    readme_content = f"""# Career-Agents

The Open-Source Career Operating System (Career OS)

<p align="center">
  <img src="./branding/banner.svg" alt="Career-Agents Banner" width="800">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/career-agents"><img src="https://img.shields.io/npm/v/career-agents" alt="NPM Version"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node-%3E%3D18-green.svg" alt="Node Version"></a>
  <a href="https://github.com/karthikrshet/Career-Agents/actions"><img src="https://img.shields.io/badge/Build-Passing-brightgreen.svg" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/career-agents"><img src="https://img.shields.io/npm/dm/career-agents" alt="Downloads"></a>
  <a href="https://github.com/karthikrshet/Career-Agents"><img src="https://img.shields.io/github/stars/karthikrshet/Career-Agents" alt="GitHub Stars"></a>
</p>

---

## 🚀 Overview

**Career-Agents** is an open-source **Career Operating System (Career OS)** designed to modularize, audit, and automate professional growth tasks. It replaces unstructured prompt structures and static text templates with a unified CLI utility, an stdio-based **Model Context Protocol (MCP)** server, and a premium **Next.js web dashboard**.

The system parses resumes for ATS compatibility, audits public GitHub repositories, analyzes LinkedIn profile copy, and runs mock STAR interviews. By synchronizing all metrics into a local profile state, it calculates an overall **Career Readiness Score** and generates custom actionable roadmaps.

---

## 🎨 Visual Interface & Modules

The platform is divided into core feature modules that work seamlessly together:

### 1. Resume Studio
* **ATS Reviewer**: Analyzes formatting blockers (multi-column, tables, icons) that trip up parsing systems.
* **Weak Bullet Auditor**: Identifies weak action verbs and missing metrics, suggesting instant STAR (Situation, Task, Action, Result) revisions.
* **FAANG Calibrator**: Validates signaling against target company competencies.

### 2. GitHub Analyzer
* **Portfolio Scorer**: Computes language diversity, contribution maps, and repository description completeness.
* **README Auditor**: Scores documentation visibility and project packaging benchmarks.

### 3. LinkedIn Optimizer
* **Tagline Generator**: Provides professional pipe-separated headline formats.
* **Visibility Auditor**: Computes search indexing density and flag patterns.

### 4. Mock Interview Lab
* **STAR Simulator**: Conducts mock interviews in the CLI or Web Dashboard using the STAR framework.
* **Integrated Code Board**: Code editing panel for technical and system design rounds.
* **Scorecard Evaluation**: AI evaluates response content and communication quality.

---

## 💻 Visual Product Preview

For a demonstration of features, guides, and layouts in action:
* **Interactive Dashboard**: Refer to `./docs/images/dashboard_preview.gif`.
* **Resume Studio**: Refer to `./docs/images/resume_studio_preview.gif`.
* **GitHub Audit**: Refer to `./docs/images/github_wrapped_preview.gif`.
* **LinkedIn Optimizer**: Refer to `./docs/images/linkedin_optimizer_preview.gif`.
* **Mock Interview Lab**: Refer to `./docs/images/mock_interview_preview.gif`.

---

## 🛠️ CLI Reference

### 1. General Diagnostic and Info
* **List**: `career-agents list` — Lists registered divisions, workflows, and available agent coaches.
* **Doctor**: `career-agents doctor` — Verifies Node.js path settings, environment config, and dependencies.
* **Recommend**: `career-agents recommend --skills "react,node"` — Recommends career coaches and tracks.

### 2. Resume Review
* **Review**: `career-agents review resume.pdf` — Run full ATS and formatting scanner.
* **Score**: `career-agents score resume.pdf` — Calculates ATS compatibility score (0-100%).
* **Improve**: `career-agents improve resume.pdf` — Generates suggested bullet rewrites using active verbs.

### 3. Portfolio & Profile Audits
* **GitHub**: `career-agents github <username>` — Grades repository documentation, language diversity, and stars.
* **LinkedIn**: `career-agents linkedin profile-copy.txt` — Analyzes headline positioning and summary copy.

### 4. Roadmaps & Interviews
* **Mock**: `career-agents mock stripe technical` — Starts interactive terminal mock interview drill.
* **Roadmap**: `career-agents roadmap google` — Outputs target study roadmap checkoff list.

---

## 🌐 Next.js Web Dashboard

The repository includes a modern Next.js 14 Web Dashboard located under `apps/web/`. It connects the modular engines into a premium single-page application.

### Features
* **Zustand Store**: Persistent local state management saving metrics, applications, and logs locally.
* **Local-First Persistence**: High-speed JSON-based storage wrapper mirroring Prisma client models.
* **AI Provider Selector**: Support for 9 LLM backends (Groq, OpenAI, Anthropic, Gemini, DeepSeek, etc.).
* **Command Palette**: Press `Cmd+K` / `Ctrl+K` to search pages, trigger audits, and switch views.

### Local Development Setup
1. **Navigate to the web app**:
   ```bash
   cd apps/web
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Add your API keys and database parameters
   ```
4. **Launch development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 Model Context Protocol (MCP)

Expose Career OS tools and resources directly to LLM clients (like Claude Desktop or Cursor).

### Claude Desktop Setup
Add the config block inside `%APPDATA%/Claude/claude_desktop_config.json`:
```json
{{
  "mcpServers": {{
    "career-agents": {{
      "command": "npx",
      "args": ["-y", "career-agents", "mcp"]
    }}
  }}
}}
```

### Cursor Setup
1. Navigate to **Settings &rarr; Features &rarr; MCP**.
2. Click **Add New MCP Server**.
3. Fill details:
   - **Name**: `career-agents`
   - **Type**: `stdio`
   - **Command**: `npx -y career-agents mcp`

---

## 📐 System Architecture

The project is structured modularly to separate execution runtimes, UI frameworks, and templates:

```mermaid
graph TD
    CLI[scripts/cli.js] --> Core[packages/core/]
    CLI --> Resume[packages/resume/]
    CLI --> GitHub[packages/github/]
    CLI --> LinkedIn[packages/linkedin/]
    CLI --> Interview[packages/interview/]
    CLI --> Dashboard[packages/dashboard/]
    CLI --> Reports[packages/reports/]
    CLI --> Plugins[packages/plugins/]
    CLI --> Telemetry[packages/telemetry/]
    CLI --> MCP[packages/mcp/]
    
    MCP --> Resume
    MCP --> GitHub
    MCP --> LinkedIn
    MCP --> Interview
    MCP --> Dashboard

    WebApp[apps/web/] --> API[app/api/]
    API --> AI[lib/ai.ts]
    AI --> ExternalAPIs[Groq/Gemini/OpenAI]
```

---

## 📚 Reference Guides

Comprehensive Technical Manuals (no emojis):
* **[System Architecture Guide](./docs/ARCHITECTURE.md)**: Design patterns, directory maps, and system flows.
* **[CLI Reference Manual](./docs/CLI_REFERENCE.md)**: Command catalogs, options, and parameters.
* **[MCP Integration Guide](./docs/MCP_GUIDE.md)**: Stdio configuration for Cursor, Windsurf, and VS Code.
* **[Developer Plugin Guide](./docs/PLUGIN_GUIDE.md)**: Custom plugin scans, hook registrations, and schemas.
* **[Dashboard Guide](./docs/DASHBOARD_GUIDE.md)**: State synchronization detail.
* **[Resume Studio Guide](./docs/RESUME_GUIDE.md)**: ATS scoring rules.
* **[GitHub Analyzer Guide](./docs/GITHUB_GUIDE.md)**: Repository grading metrics.
* **[LinkedIn Optimizer Guide](./docs/LINKEDIN_GUIDE.md)**: Search visibility index.
* **[Interview Lab Guide](./docs/INTERVIEW_GUIDE.md)**: Readline simulation loop.
* **[Job Tracker Guide](./docs/JOB_TRACKER_GUIDE.md)**: Applications status tracking.
* **[FAQ Reference](./docs/FAQ.md)**: Frequently asked questions.
* **[Troubleshooting Guide](./docs/TROUBLESHOOTING.md)**: Diagnostics and path fixes.

---

## 👥 Contributing

We welcome contributions! Please review the [Contributor Guide](./docs/contributor-guide.md) and the [AI Contributor Rules](./AGENTS.md) before submitting Pull Requests.

---

## 📄 License

This repository is licensed under the MIT License — see [LICENSE](./LICENSE) for details.
"""

    with open(README_PATH, "w", encoding="utf-8") as f:
        f.write(readme_content.strip() + "\n")
    print("README.md compiled and written successfully.")

def main():
    agents_data = load_json(REGISTRY_PATH)
    divisions_data = load_json(DIVISIONS_PATH)
    workflows_data = load_json(WORKFLOW_REGISTRY_PATH)
    tools_data = load_json(toolsPath if os.path.exists(toolsPath := ROOT / "tools.json") else Path("."))
    
    # Load subregistries dynamically
    bundles = load_dir_jsons(BUNDLES_DIR)
    companies = load_dir_jsons(COMPANIES_DIR)
    paths = load_dir_jsons(PATHS_DIR)
    
    agents = agents_data.get("agents", [])
    
    compile_career_os(agents, divisions_data, workflows_data, bundles, companies, paths, tools_data)
    generate_search_index(agents, divisions_data, workflows_data, bundles, companies, paths)
    validate_agents(agents)
    generate_knowledge_graph(agents, divisions_data, workflows_data, bundles, companies, paths)
    generate_discoverability_maps(agents, workflows_data, companies, paths)
    generate_llm_indexes(agents, workflows_data)
    if not os.environ.get("CI"):
        build_merged_readme(agents, divisions_data, workflows_data, bundles, companies, paths)
    else:
        print("Skipping README compilation in CI environment.")
    print("All Career Operating System databases generated successfully!")

if __name__ == "__main__":
    main()
