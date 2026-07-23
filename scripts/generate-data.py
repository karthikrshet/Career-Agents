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
        add_node(d.get("division"), d.get("name"), "division")
        
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

The Open Source Career Operating System

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

## What is Career-Agents?

Career-Agents is an open-source Career Operating System designed to modularize, audit, and automate professional growth tasks. It replaces unstructured prompting guides and static texts with an integrated CLI utility, stdio Model Context Protocol (MCP) server, and Next.js visual dashboard.

The system analyzes resumes for ATS compliance, reviews public GitHub portfolios for engineering quality, audits LinkedIn taglines, and runs interactive STAR behavioral interview loops. By connecting all diagnostic indicators into a single profile state database, it calculates a cumulative Career Readiness Score and outputs custom 30-60-90 day roadmap plans.

---

## Animated Product Preview

For a visual demonstration of the interactive dashboard, upload portals, and interview loops in action:
- **Core Dashboard Preview**: Refer to `./docs/images/dashboard_preview.gif` (interactive gauges and goals).
- **Resume Studio Pro**: Refer to `./docs/images/resume_studio_preview.gif` (drag-and-drop parsing and weak bullet edits).
- **GitHub Wrapped**: Refer to `./docs/images/github_wrapped_preview.gif` (stars counters and heatmaps).
- **LinkedIn Optimizer**: Refer to `./docs/images/linkedin_optimizer_preview.gif` (tagline pipe rewrites).
- **Mock Interview Lab**: Refer to `./docs/images/mock_interview_preview.gif` (readline loop and integrated coding board).

---

## Features

### 1. Resume Studio
- **Description**: Parses PDF, DOCX, and TXT files. Detects formatting blockers, passive verbs, and missing keyword density.
- **Command**: `career-agents review resume.pdf`
- **Expected Output**: List of weak bullets, suggested STAR rewrites, and layout compatibility ratings.
- **Architecture**: Mapped inside `packages/resume/` (`file-parser.js`, `scorer.js`, `studio.js`, `faang.js`).

### 2. GitHub Portfolio Analyzer
- **Description**: Grades public repositories description, language coverage, readme quality, and project traction indicators.
- **Command**: `career-agents github karthikrshet`
- **Expected Output**: Repository star/fork counts, language distribution percentages, and readme suggestions.
- **Architecture**: Mapped inside `packages/github/` (`analyzer.js`).

### 3. LinkedIn Optimizer
- **Description**: Critiques tagline headers and summary narratives to raise search visibility indexes.
- **Command**: `career-agents linkedin profile.txt`
- **Expected Output**: Alternative pipe tagline formats and key competency recommendations.
- **Architecture**: Mapped inside `packages/linkedin/` (`analyzer.js`).

### 4. Mock Interview Lab
- **Description**: Interactive STAR loop behavioral questions loop and integrated technical coding board.
- **Command**: `career-agents mock google coding`
- **Expected Output**: Step questions prompts, response logging, and grading feedback scorecard.
- **Architecture**: Mapped inside `packages/interview/` (`engine.js`).

### 5. Job Application Tracker
- **Description**: Track salary, locations, dates, and status stages (Wishlist, OA, Interview, Offer, Rejected) in a clean Kanban board.
- **Architecture**: Mapped inside `packages/dashboard/` (`profile-manager.js`, `dashboard.js`).

### 6. Company Preparation Hub
- **Description**: Milestone checklists mapping DSA topics, system design, and behavioral modules for Google and Stripe.
- **Architecture**: Mapped inside `packages/core/` (`roadmap.js`).

### 7. Career Copilot
- **Description**: Conversational AI assistant accepting prompts shortcuts ("Review resume", "Prep for Google") to generate roadmaps.
- **Architecture**: Exposes global CLI/MCP integrations with live LLM API keys.

---

## Career OS Workflow

The system implements a connected journey mapping candidate readiness:

```mermaid
graph TD
    User[Candidate Input] --> Resume[Resume Upload]
    Resume --> Studio[Resume Studio Audit]
    Studio --> GitHub[GitHub Wrapped Grade]
    GitHub --> LinkedIn[LinkedIn Tagline Check]
    LinkedIn --> Projects[Projects Scaffolding]
    Projects --> Interview[Interview Lab Loop]
    Interview --> Tracker[Job Application Tracker]
    Tracker --> Engine[Readiness Engine Score]
    Engine --> Recommendations[AI Action Plans]
    Recommendations --> Roadmap[30-60-90 Day Roadmap]
    Roadmap --> Offer[Offer Ready]
```

---

## Screenshots

- **System Dashboard**: `./docs/images/dashboard.png` (dials and funnel)
- **Resume Studio Pro**: `./docs/images/resume_studio.png` (upload and weak bullets rewrite)
- **GitHub wrapped**: `./docs/images/github_wrapped.png` (stars metrics and grids)
- **LinkedIn Optimizer**: `./docs/images/linkedin_optimizer.png` (tagline suggestions)
- **Interview Lab Console**: `./docs/images/interview_lab.png` (timer and code editor board)
- **Job Tracker**: `./docs/images/job_tracker.png` (funnel table list)
- **Prep Hub**: `./docs/images/prep_hub.png` (DSA and design checkpoints)
- **Career Copilot**: `./docs/images/copilot.png` (conversational loop chat)
- **Report Exporter**: `./docs/images/report_exporter.png` (HTML visual card exports)

---

## Installation

### 1. Global Installation (NPM)
```bash
npm install -g career-agents
```

### 2. Local Source Setup
```bash
git clone https://github.com/karthikrshet/Career-Agents.git
cd Career-Agents
npm install
python scripts/generate-data.py
python scripts/validate.py
```

---

## Quick Start

Verify setup health and review a resume:

```bash
career-agents doctor
career-agents list
career-agents recommend --skills "react"
career-agents review resume.pdf
career-agents github karthikrshet
career-agents dashboard
career-agents mock google behavioral
```

---

## CLI Reference

| Command | Description | Example | Expected Output |
| :--- | :--- | :--- | :--- |
| `career-agents doctor` | Check environment variables and path settings | `career-agents doctor` | Environment diagnostics OK |
| `career-agents list` | List registered divisions and workflows | `career-agents list` | Available Divisions: 19 |
| `career-agents dashboard` | Render visual gauges of profile indices | `career-agents dashboard` | Cumulative Readiness Index |
| `career-agents review <file>` | Audit layout and bullets metrics | `career-agents review resume.pdf` | Formatting audits & weak bullets list |
| `career-agents github <user>` | Grade repositories and README guidelines | `career-agents github karthikrshet` | Language stats & pinned repos grades |
| `career-agents mock <co> [mode]`| Start conversational behavioral loops | `career-agents mock stripe technical` | STAR question loops and scorecard |

---

## Web Dashboard

The Next.js React application compiles all modules into a single browser frame:
- **Core Dashboard**: Monitors child scores and weekly targets checkbox logs.
- **Resume Studio**: Provides textareas and drag-and-drop uploads to run ATS audits.
- **GitHub Wrapped**: Renders language percentages and contribution map grids.
- **LinkedIn Optimizer**: Provides pipe taglines and summary rewrite templates.
- **Interview Lab**: Combines conversational timers, code editor panes, and scorecards.
- **Job Tracker**: Renders funnel pipeline stats and jobs tables.
- **Company Preparation**: Checkpoints DSA topics and system design modules.
- **Career Copilot**: Natural chat log providing query shortcuts.

---

## Model Context Protocol (MCP) Support

The Stdio-based MCP server exposes resources and tools directly to LLMs. Config blocks:

### 1. Claude Desktop Setup
Add details under `%APPDATA%/Claude/claude_desktop_config.json`:
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

### 2. Cursor Setup
Navigate to Settings &rarr; Features &rarr; MCP &rarr; Add New MCP Server:
- **Name**: `career-agents`
- **Type**: `stdio`
- **Command**: `npx -y career-agents mcp`

See [MCP Guide](./docs/MCP_GUIDE.md) for Windsurf and VS Code details.

---

## Plugin Architecture

The plugin manager dynamically scans the local `plugins/` directory to load commands:
- **Lifecycle**: Scan directory `plugins/*.js` &rarr; import ES module dynamically &rarr; register execution hooks in global switch.
- **Schema**: Plugins must export `name`, `description`, and an async `execute(args)` controller.

Refer to [Plugin Guide](./docs/PLUGIN_GUIDE.md) for code implementation examples.

---

## Repository Architecture

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
```

- **packages/core/**: Runtime execution engines and 30-60-90 day roadmaps.
- **packages/resume/**: Extends parsing, bullet STAR auditing, and FAANG criteria.
- **packages/dashboard/**: Profiles manager serializing state parameters.
- **packages/reports/**: Compiles Markdown and visual HTML cards outputs.
- **Runtime Flow**: CLI dynamic imports load packages dynamically when routed, optimizing startup times.
- **State Flow**: Individual module updates write properties to `.career-profile.json` shared indices, which updates the Core Dashboard.
- **Report Generation**: Scans diagnostic objects to format HTML layouts and save them under `exports/reports/`.

---

## Documentation

Comprehensive Technical Manuals (no emojis):
- **[Architecture Guide](./docs/ARCHITECTURE.md)**: Package bounds and flows.
- **[CLI Reference Guide](./docs/CLI_REFERENCE.md)**: Syntax commands catalog.
- **[MCP Integration Guide](./docs/MCP_GUIDE.md)**: Stdio server configurations.
- **[Developer Plugin Guide](./docs/PLUGIN_GUIDE.md)**: Custom commands registration.
- **[Dashboard Guide](./docs/DASHBOARD_GUIDE.md)**: State synchronization detail.
- **[Resume Studio Guide](./docs/RESUME_GUIDE.md)**: ATS scoring rules.
- **[GitHub Analyzer Guide](./docs/GITHUB_GUIDE.md)**: Repository grading metrics.
- **[LinkedIn Optimizer Guide](./docs/LINKEDIN_GUIDE.md)**: Search visibility index.
- **[Interview Lab Guide](./docs/INTERVIEW_GUIDE.md)**: Readline simulation loop.
- **[Job Tracker Guide](./docs/JOB_TRACKER_GUIDE.md)**: Applications status tracking.
- **[FAQ Reference](./docs/FAQ.md)**: Frequently asked questions.
- **[Troubleshooting Guide](./docs/TROUBLESHOOTING.md)**: Diagnostics and path fixes.
- **[Showcase Examples](./docs/EXAMPLES.md)**: Input/output files index.

---

## Roadmap

- **v1.3.1**: Target preparation tracks configurations. (Completed)
- **v1.4.0 (Milestone 1)**: Packages restructuring, features flagging, and Resume Studio. (Completed)
- **v2.0.0 (Milestone 2-7)**: Full connected visual dashboard, Job Tracker, Company Prep tracks, and complete technical documentation guides. (Current)

---

## Community

- **Discussions**: Ask questions on GitHub Discussions.
- **Issues**: Report bugs or suggest company tracks in GitHub Issues.
- **Support**: Read the Support policy for contacts.

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
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
