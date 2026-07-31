#!/usr/bin/env python3
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

REGISTRY_PATH = ROOT / "agent-registry.json"
DIVISIONS_PATH = ROOT / "divisions.json"
WORKFLOW_REGISTRY_PATH = ROOT / "workflow-registry.json"
CAREER_OS_PATH = ROOT / "career-agents.json"
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
    print("Compiling career-agents.json core configuration...")
    
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
        "$schema": "https://codemyfyp-agents.dev/schema/career-agents.json",
        "repository": "Career-Agents",
        "name": "The Open-Source Career Agents",
        "version": "13.0.0",
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
    print("Compiled and wrote career-agents.json successfully.")

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
        "name": "The Career Agents Index",
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
    readme_content = f"""<div align="center">

<img src="https://raw.githubusercontent.com/karthikrshet/Career-Agents/main/branding/logo.png" alt="Career Agents Logo" width="120" />

# Career Agents

### The Open-Source AI Career Agents for Software Engineers

<p align="center">
  <img src="https://raw.githubusercontent.com/karthikrshet/Career-Agents/main/branding/banner.svg" alt="Career Agents Banner" width="800" />
</p>

Career Agents is an enterprise-grade, open-source personal career optimization suite designed to automate and systemize professional growth. By unifying 146 specialized AI agents, local ATS resume grading, public GitHub profile auditing, search-visibility LinkedIn scanning, and interactive STAR behavioral mock interviews, it replaces generic prompts and static templates with a context-aware career intelligence cockpit.

</div>

---

## Badges

<p align="center">
  <a href="https://www.npmjs.com/package/career-agents"><img src="https://img.shields.io/npm/v/career-agents?color=blue&style=flat-square" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/career-agents"><img src="https://img.shields.io/npm/dm/career-agents?color=orange&style=flat-square" alt="NPM Downloads"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License: MIT"></a>
  <a href="https://github.com/karthikrshet/Career-Agents"><img src="https://img.shields.io/github/stars/karthikrshet/Career-Agents?style=flat-square" alt="GitHub Stars"></a>
  <a href="https://github.com/karthikrshet/Career-Agents/network/members"><img src="https://img.shields.io/github/forks/karthikrshet/Career-Agents?style=flat-square" alt="GitHub Forks"></a>
  <a href="https://github.com/karthikrshet/Career-Agents/releases"><img src="https://img.shields.io/github/v/release/karthikrshet/Career-Agents?color=green&style=flat-square" alt="GitHub Release"></a>
  <a href="https://github.com/karthikrshet/Career-Agents/issues"><img src="https://img.shields.io/github/issues/karthikrshet/Career-Agents?style=flat-square" alt="GitHub Issues"></a>
  <a href="https://github.com/karthikrshet/Career-Agents/pulls"><img src="https://img.shields.io/github/issues-pr/karthikrshet/Career-Agents?style=flat-square" alt="GitHub Pull Requests"></a>
  <a href="https://github.com/karthikrshet/Career-Agents/graphs/contributors"><img src="https://img.shields.io/github/contributors/karthikrshet/Career-Agents?style=flat-square" alt="GitHub Contributors"></a>
  <a href="https://github.com/karthikrshet/Career-Agents/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/karthikrshet/Career-Agents/ci.yml?branch=main&label=CI%20Build&style=flat-square" alt="Build Status"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square" alt="TypeScript"></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square" alt="Next.js"></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18-blue?style=flat-square" alt="React"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node-%3E%3D18-green?style=flat-square" alt="Node.js"></a>
  <a href="https://modelcontextprotocol.io/"><img src="https://img.shields.io/badge/MCP-Compatible-cyan?style=flat-square" alt="MCP Compatible"></a>
  <a href="https://github.com/karthikrshet/Career-Agents/actions/workflows/codeql.yml"><img src="https://img.shields.io/github/actions/workflow/status/karthikrshet/Career-Agents/codeql.yml?branch=main&label=CodeQL&style=flat-square" alt="CodeQL Status"></a>
</p>

---

## Elevator Pitch

Software engineers face a fragmented job application cycle where resumes are filtered by parsing engines, portfolios are checked on GitHub, and behavioral performance is scored via structured framework interviews. Existing consumer AI chatbots lack integration with raw files, OAuth profile contexts, and structured ATS parser scoring. Career Agents solves this fragmentation by building a local-first workspace that evaluates career assets, synchronizes target scores into a unified profile state, and exposes these workflows directly to developers inside their IDEs via the Model Context Protocol.

---

## Why Career Agents

Traditional career readiness tools fail because they evaluate portfolios and resumes in isolation. General-purpose AI chatbots fail because they require developers to manually copy-paste resume templates, terminal outputs, and system architecture descriptions into separate windows, losing continuity across sessions. 

Career Agents takes a different approach:
- **Heuristic + AI ATS Parsing:** Integrates regex section scanners and action-verb checking with LLM-powered bullet optimization.
- **Context-Aware Routing:** The Career Copilot reads the user's active resume scores, GitHub repo counts, and target titles, automatically routing queries to the most qualified agent in the 146-agent registry.
- **Zero-Key Privacy:** Stores sensitive API keys in the browser's `localStorage` rather than database systems, safeguarding user credentials.
- **IDE Native:** Runs an stdio Model Context Protocol (MCP) server so that developer tools can parse profiles, run mock interviews, and optimize code right inside code editors.

---

## Screenshots

<details>
<summary>View Dashboard Preview</summary>

*Displays global metrics, 5-dimensional career scores, recent activity feeds, and quick actions.*
![Dashboard View](https://raw.githubusercontent.com/karthikrshet/Career-Agents/main/docs/images/dashboard_preview.gif)
</details>

<details>
<summary>View Resume Studio Preview</summary>

*Scans document formatting, highlights missing keywords, and suggests bullet-point improvements.*
![Resume Studio View](https://raw.githubusercontent.com/karthikrshet/Career-Agents/main/docs/images/resume_studio_preview.gif)
</details>

<details>
<summary>View GitHub Wrapped Preview</summary>

*Analyzes public repository counts, language distribution, star scores, and documentation completeness.*
![GitHub Wrapped View](https://raw.githubusercontent.com/karthikrshet/Career-Agents/main/docs/images/github_wrapped_preview.gif)
</details>

<details>
<summary>View LinkedIn Optimizer Preview</summary>

*Grades headline positioning, about summaries, and searches keyword density.*
![LinkedIn Optimizer View](https://raw.githubusercontent.com/karthikrshet/Career-Agents/main/docs/images/linkedin_optimizer_preview.gif)
</details>

<details>
<summary>View Interview Lab Preview</summary>

*Conducts mock interviews across 10 company tracks, featuring integrated coding canvases and scorecards.*
![Mock Interview View](https://raw.githubusercontent.com/karthikrshet/Career-Agents/main/docs/images/mock_interview_preview.gif)
</details>

<details>
<summary>View Marketplace Preview</summary>

*Enable or disable plugin extensions and review required context permissions.*
![Marketplace View](https://raw.githubusercontent.com/karthikrshet/Career-Agents/main/docs/images/marketplace_preview.png)
</details>

---

## Demo

- **Live Demo Instance:** [career-os.dev](https://career-os.dev) (Use fully in guest mode with no credentials needed)
- **GitHub Repository:** [github.com/karthikrshet/Career-Agents](https://github.com/karthikrshet/Career-Agents)
- **NPM Package Registry:** [npmjs.com/package/career-agents](https://www.npmjs.com/package/career-agents)
- **Documentation index:** [docs/README.md](./docs/README.md)
- **Video Walkthrough:** [YouTube Video Walkthrough](https://youtube.com)

---

## Features

### Core Systems
- **Interactive Dashboard:** Aggregates career indicators, displays score progress rings, and tracks metrics history.
- **Kanban Job Tracker:** Drags cards across Kanban lists (Wishlist, Applied, Interview, Offer, Rejected) to calculate progress metrics.
- **Persistent Storage:** Zustand core with `persist` middleware synchronizes state with browser database systems or PostgreSQL tables.
- **OAuth Authentication:** Integrates GitHub and Google NextAuth credentials with automatic profile sync.

### Artificial Intelligence
- **146 Specialized Agents:** Executes prompt configurations derived from 19 domains of expert coaching.
- **Provider Abstraction Router:** Single client-side and server-side package router to access 14 API backends.
- **Real-Time Streaming:** Streams tokens using Server-Sent Events (SSE) for low latency.

### Resume & Portfolios
- **Resume Studio:** Parses DOCX, PDF, and text formats to evaluate section density, star formulas, and passive verbs.
- **GitHub Wrapped:** Pulls public repository count, tags, languages, and star weight scores from the REST API.
- **LinkedIn Auditor:** Checks search density index, headline structures, and profile copy.

### MCP & CLI
- **25 MCP Tools:** Connects IDE sessions to the local registry, allowing AI models to execute roadmaps and run mock interviews.
- **CLI Utility:** Runs local diagnostics, doctor checks, profile scans, and terminal mock interviews.

### Exports & Operations
- **Report Compiler:** Compiles HTML, Markdown, PDF (`pdf-lib`), Word (`docx`), and Excel (`exceljs`) files.
- **Content Security Policy:** Strict CSP configuration, HSTS protection, and rate-limiting rules.
- **Enterprise SEO:** Outfitted with robots configuration, structured JSON-LD schemes, sitemap indices, and llms.txt discoverability formats.

---

## Feature Matrix

| Feature Module | CLI Utility | Web Dashboard | MCP Server |
|----------------|-------------|---------------|------------|
| Agent Directory Search | ✅ | ✅ | ✅ |
| Resume ATS Scoring | ✅ | ✅ | ✅ |
| GitHub Profile Wrapped | ✅ | ✅ | ✅ |
| LinkedIn Headline Check | ✅ | ✅ | ✅ |
| Mock Interview Engine | ✅ | ✅ | ✅ |
| PDF/Word/Excel Export | ❌ | ✅ | ✅ |
| Kanban Job Tracking | ❌ | ✅ | ✅ |
| Chat History Storage | ❌ | ✅ | ❌ |
| Multi-agent Routing | ❌ | ✅ | ❌ |

---

## AI Agent Ecosystem

Career Agents manages **146 agents** categorized across **19 divisions**. When a user prompts the Copilot, the routing engine tokenizes the query and compares it against agent names, descriptions, tags, and required skills to construct a matching scorecard:

```
Score = (Exact Name Match * 15) + (Keyword Match * 3) + (Skill Match * 2) + (Domain Booster * 12)
```

The top 3 matching agents with score >= 5 are compiled, their Markdown prompt bodies are read from the filesystem, and their instructions are appended to the system prompt alongside the user's active profile metrics.

### Division Summary Table

{divisions_str}

*For the complete agent index, see [docs/AGENTS.md](./docs/AGENTS.md).*

---

## AI Providers

Career Agents supports **18 providers** managed by the centralized AI Gateway. The router evaluates API keys from the browser's `localStorage` settings key arrays (Primary, Secondary, Backup key rotations) first, falling back to server-side environment variables if the local config is empty:

| Provider | Status | Default Model | Free Tier | Streaming | Vision |
|----------|--------|--------------|-----------|-----------|--------|
| **Groq** | ✅ Active | `llama-3.3-70b-versatile` | ✅ Yes | ✅ Yes | ❌ |
| **Google Gemini** | ✅ Active | `gemini-2.5-pro` | ✅ Yes | ✅ Yes | ✅ Yes |
| **OpenAI** | ✅ Active | `gpt-4o` | ❌ No | ✅ Yes | ✅ Yes |
| **Anthropic Claude** | ✅ Active | `claude-3-5-sonnet-20241022`| ❌ No | ✅ Yes | ✅ Yes |
| **DeepSeek** | ✅ Active | `deepseek-chat` | ❌ Cheap | ✅ Yes | ❌ |
| **OpenRouter** | ✅ Active | `openai/gpt-4o` | ✅ Yes | ✅ Yes | ✅ Yes |
| **Together AI** | ✅ Active | `meta-llama/Llama-3-70b-chat`| ❌ No | ✅ Yes | ❌ |
| **Mistral** | ✅ Active | `mistral-large-latest` | ❌ No | ✅ Yes | ❌ |
| **Cohere** | ✅ Active | `command-r-plus` | ✅ Trial | ✅ Yes | ❌ |
| **xAI Grok** | ✅ Active | `grok-2` | ❌ No | ✅ Yes | ❌ |
| **Azure OpenAI** | ✅ Active | Custom deployment | ❌ Enterprise| ✅ Yes | ✅ Yes |
| **Ollama** | ✅ Active (Local) | User pulled (e.g. `llama3`) | ✅ Yes | ✅ Yes | ❌ |
| **LM Studio** | ✅ Active (Local) | Custom loaded GGUF | ✅ Yes | ✅ Yes | ❌ |
| **Fireworks** | ✅ Active | `llama-v3-70b-instruct` | ❌ No | ✅ Yes | ❌ |
| **Perplexity** | ✅ Active | `llama-3.1-sonar-large` | ❌ No | ✅ Yes | ❌ |
| **AI21 Labs** | ✅ Active | `jamba-1.5-large` | ❌ No | ✅ Yes | ❌ |
| **OpenAI Compatible**| ✅ Active | Custom loaded model | ✅ Yes | ✅ Yes | ✅ Yes |
| **Custom Endpoint** | ✅ Active | Custom loaded model | ✅ Yes | ✅ Yes | ✅ Yes |

---

## Architecture

### System Data Flow

```mermaid
sequenceDiagram
    participant User as User / Browser
    participant SW as Service Worker (PWA)
    participant NextJS as Next.js Web App
    participant Router as AI Provider Router
    participant DB as PostgreSQL (Prisma)
    
    User->>SW: Access Career Agents Pages
    SW->>User: Serve cached layout assets (Offline support)
    User->>NextJS: Request Resume/GitHub Audit
    NextJS->>Router: Forward file/profile buffer
    Router->>Router: Match and load agent prompts
    Router->>User: Stream SSE completion chunks
    NextJS->>DB: Sync user session & metrics history
    DB-->>NextJS: Write confirmation
```

### Model Context Protocol (MCP) Integration

```mermaid
graph LR
    IDE[Developer Editor / Client] -->|JSON-RPC via stdio| MCPServer[mcp/server.js Server]
    MCPServer -->|Read Registry| Files[(agent-registry.json)]
    MCPServer -->|Execute Tools| CoreScripts[scripts/cli.js utilities]
    CoreScripts -->|Response payload| IDE
```

---

## Project Structure

```
Career-Agents/
├── apps/
│   └── web/                   ← Web application using Next.js 14 App Router
│       ├── prisma/            ← PostgreSQL prisma schema definition and migrations
│       ├── public/            ← Static logos, visual gifs, service workers, manifest
│       └── src/
│           ├── app/           ← Web layout pages and server-side /api route endpoints
│           ├── components/    ← Common React widgets, sidebar structures, buttons, and metrics
│           ├── hooks/         ← Custom React hooks (e.g. command palette listeners)
│           ├── lib/           ← Logic, local storage serialization, and Zustand store
│           └── types/         ← Common TypeScript interfaces
│
├── packages/
│   └── ai/                    ← Modular package router interface for the 14 providers
│
├── mcp/                       ← Stdio-based Model Context Protocol server exposing tools
│
├── scripts/                   ← Platform CLI, SDK interface, validate and compile scripts
│
└── [divisions]/               ← Raw Markdown prompt files for the 146 agents
```

- **`apps/web` exists because:** It hosts the Next.js single-page application dashboard, routing logic, state management, and user views.
- **`packages/ai` exists because:** It isolates raw API connections to external AI models from front-end page layouts, ensuring portability.
- **`mcp` exists because:** It enables developers to access their career profiles, run checklists, and invoke agents without leaving their code editor.
- **`scripts` exists because:** It provides terminal utilities for data mapping, schema validation, and package publishing.

---

## Installation

### Prerequisites
- Node.js >= 18.0.0 (Node 20 LTS recommended)
- Git
- Python 3.9+ (required for agent validation scripts)

### Setup Steps
```bash
# 1. Clone the repository
git clone https://github.com/karthikrshet/Career-Agents.git
cd Career-Agents

# 2. Install web application dependencies
cd apps/web
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and enter a random NEXTAUTH_SECRET (e.g. openssl rand -base64 32)
```

### Database Modes
- **Guest Mode (Default):** Runs without configuring database parameters. Data is saved in the browser's `localStorage` database using Zustand's persistence manager.
- **Database Mode:** Set `DATABASE_URL` in `.env` to point to a PostgreSQL database, then push the Prisma schema:
  ```bash
  npx prisma db push
  ```

---

## Quick Start

Get Career Agents running locally in under 5 minutes:

```bash
# Clone and build dependencies
git clone https://github.com/karthikrshet/Career-Agents.git
cd Career-Agents/apps/web
npm install

# Setup environment variables
cp .env.example .env
# Set NEXTAUTH_SECRET

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and configure your AI key under **Settings** -> **AI Provider** -> **Groq** to enable completions.

---

## Environment Variables

| Variable | Required | Default | Description / Security Notes |
|----------|----------|---------|------------------------------|
| `NEXTAUTH_SECRET` | Yes | None | Secret key used to encrypt user sessions. Never share this. |
| `NEXTAUTH_URL` | Yes | `http://localhost:3000` | Canonical URL of your app deployment. |
| `DATABASE_URL` | No | None | Postgres connection string. If blank, app operates in Guest Mode. |
| `JWT_SECRET` | No | None | Secret key used to sign session cookies. |
| `UPLOAD_LIMIT_MB` | No | `10` | Maximum allowed file upload size for resume parsing. |
| `DEFAULT_PROVIDER` | No | `gemini` | Fallback default gateway provider. |
| `DEFAULT_MODEL` | No | `gemini-2.5-flash` | Fallback default gateway model. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | No | None | OAuth application keys generated via GitHub Developer settings. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | No | None | OAuth application keys generated via Google Cloud Console. |
| `OPENAI_API_KEY` | No | None | Server-side fallback key for OpenAI. |
| `ANTHROPIC_API_KEY` | No | None | Server-side fallback key for Anthropic Claude. |
| `GEMINI_API_KEY` | No | None | Server-side fallback key for Google Gemini. |
| `GROQ_API_KEY` | No | None | Server-side fallback key for Groq. |
| `DEEPSEEK_API_KEY` | No | None | Server-side fallback key for DeepSeek. |
| `OPENROUTER_API_KEY` | No | None | Server-side fallback key for OpenRouter. |
| `MISTRAL_API_KEY` | No | None | Server-side fallback key for Mistral. |
| `COHERE_API_KEY` | No | None | Server-side fallback key for Cohere. |
| `TOGETHER_API_KEY` | No | None | Server-side fallback key for Together AI. |
| `XAI_API_KEY` | No | None | Server-side fallback key for xAI Grok. |
| `GITHUB_TOKEN` | No | None | Read-only GitHub PAT used to increase GitHub API limit to 5000/hr. |
| `REDIS_URL` | No | None | Redis connection string used for optional API route rate limiting. |
| `LOG_LEVEL` | No | `info` | Logging verbosity level on NextJS console. |

---

## CLI Documentation

Career Agents includes a terminal utility under `scripts/cli.js`.

| Command | Arguments | Purpose | Example |
|---------|-----------|---------|---------|
| `list` | None | Lists all registered divisions and agents | `node scripts/cli.js list` |
| `doctor` | None | Performs dependencies and environment validation checks | `node scripts/cli.js doctor` |
| `score` | `<filepath>` | Scans PDF/Word resumes and outputs ATS score | `node scripts/cli.js score resume.pdf` |
| `review` | `<filepath>` | Performs weak bullet checking and spelling audits | `node scripts/cli.js review resume.pdf` |
| `github` | `<username>` | Runs portfolio wrapped check for target profile | `node scripts/cli.js github torvalds` |
| `mock` | `<company> <mode>`| Starts a terminal mock interview drill | `node scripts/cli.js mock google behavioral` |
| `roadmap`| `<target>` | Generates study roadmaps in markdown formats | `node scripts/cli.js roadmap "staff engineer"` |

---

## Web Dashboard

The web dashboard is organized into page modules:
- **Dashboard (`/`):** View overall scores, metrics graphs, activity feeds, and quick actions.
- **Resume Studio (`/resume`):** Parse resume files, check ATS formatting issues, and rewrite bullet points.
- **GitHub Analyzer (`/github`):** Audits public repositories, languages, and pinned documentation.
- **LinkedIn Optimizer (`/linkedin`):** Grades headlines and analyzes keyword density.
- **Interview Lab (`/interview`):** STAR-based mock interviews with built-in coding canvases and scorecard evaluations.
- **Job Tracker (`/tracker`):** Kanban layout to track applications, calculate progress metrics, and record recruiter logs.
- **Marketplace (`/marketplace`):** Extensions portal to toggle plugins.
- **Reports (`/reports`):** Compiles analysis findings into PDF, Word, or Excel sheets.
- **MCP integrations (`/mcp`):** Displays setup parameters for desktop and IDE clients.
- **Settings (`/settings`):** Configures active AI providers, models, parameters (temperature), and telemetry flags.
- **About (`/about`):** Browse the 146-agent registry directory and search by keywords or skills.
- **Credits (`/credits`):** Displays project metrics, open-source library links, and project contributors.

---

## Resume Studio

The Resume Studio is a local resume optimization suite featuring:
- **ATS Formatting Checker:** Heuristics search for layout issues that cause parsing errors, such as columns, tables, header icons, and graphics.
- **Action-Verb Checker:** Detects passive/weak verbs (e.g. *assisted*, *helped*), suggesting replacements (e.g. *orchestrated*, *spearheaded*).
- **STAR Validator:** Checks if resume bullet points contain a Situation, Task, Action, and Result, flagging bullets that lack metrics or outcomes.
- **Missing Keyword List:** Compares resume text against ~35 common industry keywords (e.g., CI/CD, Kubernetes, TypeScript) to highlight gaps.
- **AI Rewriter:** Uses your configured AI provider to rewrite weak bullet points.
- **Multiple Exports:** Download your optimized resume as plain text, Markdown, or a styled Word Document (`.docx`).

---

## GitHub Analyzer

The GitHub Analyzer integrates directly with the GitHub REST API (no mocks) to evaluate portfolios:
- **Language Diversity:** Computes a distribution map across your public codebase.
- **Documentation Auditor:** Grades README completeness and checks if projects include proper setup steps.
- **Repository Scorer:** Measures traction signals using stars, forks, and recent commits.
- **Recommendations:** Suggests concrete next steps, like adding descriptions, licenses, or linking live demos.
- **Heatmap:** Displays an activity graph of commits over the past year.

---

## LinkedIn Optimizer

The LinkedIn Optimizer evaluates profile copy to improve search indexing:
- **Headline Scanners:** Verifies pipe-separated headline formats (`Title | Specialization | Value Metric`) used by recruiters.
- **Keyword Density Check:** Checks if your summary contains keywords frequently searched by recruiters for your target role.
- **Summary Grade:** Evaluates paragraph formatting and checks for the presence of contact details and summaries of achievements.
- **Visibility Index:** Calculates a search-readiness index (0-100) based on headline structure and keyword density.

---

## Interview Lab

The Interview Lab conducts realistic mock interviews:
- **Curated Company Tracks:** Custom behavioral interview plans for Adobe, Amazon, Atlassian, Google, Meta, Microsoft, Netflix, Oracle, Salesforce, and Uber.
- **Custom Mode Options:** Choose between Behavioral, Technical (coding), System Design, and HR rounds.
- **Integrated Code Editor:** Built-in code canvas for typing solution structures.
- **STAR Scoring Matrices:** Evaluates responses across 10 parameters (Situation, Task, Action, Result, Ownership, Leadership, Communication, Technical Depth, Problem Solving, Confidence) on a 0-10 scale.
- **Fallback Mode:** Automatically returns 5 curated interview questions per track if no AI provider is configured.

---

## Career Copilot

The Career Copilot is a context-aware chat workspace:
- **Direct Context Injection:** Automatically appends your profile metrics, resume analysis, and GitHub score to the system prompt of every conversation.
- **Multi-Agent Routing:** Automatically routes messages to the most relevant agents based on query keywords.
- **Streaming SSE Output:** Streams tokens in real-time.
- **Attachments:** Drop PDF documents or text files directly into the chat.
- **Folders & Organization:** Create custom folders, pin conversations, search history, and export logs to Markdown.

---

## Marketplace

Extend the Career Copilot's prompt context with modular plugin extensions:
- **STAR Behavioral Coach:** Formats all behavioral responses in STAR tables.
- **LeetCode Tracker:** Tracks coding problems, recommends algorithms, and calculates Big O time/space complexity.
- **Resume PDF Parser:** Adjusts formatting parameters to optimize PDF parsing for ATS systems.
- **Salary Intelligence:** Embeds compensation benchmarks from Glassdoor/Blind.

### Lifecycle Events
```
Available (Marketplace) -> Install (Register keys) -> Enable (Inject Prompt Context) -> Disable -> Uninstall
```

---

## Model Context Protocol (MCP)

Expose Career Agents tools directly to your local LLM clients:

### Supported Editors
- **Cursor AI:** Add stdio command `node /absolute/path/to/Career-Agents/mcp/server.js` in Settings -> Features -> MCP.
- **Claude Desktop:** Add configuration block to `claude_desktop_config.json`.
- **VS Code (Continue):** Add to `.continue/config.json`.
- **Cline / Roo Code / Aider / Windsurf / Bolt:** Configure stdio parameters to use the local server path.

### Setup Config Example (Claude Desktop)
```json
{{
  "mcpServers": {{
    "career-agents": {{
      "command": "node",
      "args": ["/absolute/path/to/Career-Agents/mcp/server.js"]
    }}
  }}
}}
```

*For tool parameters and CLI flags, read [docs/MCP.md](./docs/MCP.md).*

---

## REST API Reference

Career Agents exposes 10 REST endpoints. For request/response schemas, check [docs/API.md](./docs/API.md) or `/api/docs`:

- `POST /api/copilot` — Streams response tokens using SSE.
- `POST /api/interview` — Generates questions or evaluates answers.
- `POST /api/resume/analyze` — Evaluates resume text against ATS parameters.
- `POST /api/github/analyze` — Pulls public portfolio metrics from the GitHub API.
- `POST /api/linkedin/analyze` — Optimizes LinkedIn headlines and summaries.
- `POST /api/reports/generate` — Compiles and exports reports to PDF, Word, or Excel.
- `POST /api/parse-file` — Extracts plain text from uploaded document files.
- `POST /api/parse-file/url` — Parses files from a public URL.
- `POST /api/providers/test` — Tests connection status and latency for AI providers.
- `GET /api/profile` — Retrieves the authenticated NextAuth user session.

---

## Plugin SDK

Developers can create custom plugins. A plugin is defined as a JSON manifest file containing metadata and system prompt injection rules:

```json
{{
  "id": "my-custom-plugin",
  "name": "Custom Plugin",
  "version": "1.0.0",
  "permissions": ["read_profile", "write_copilot_context"],
  "promptInjection": "Always write responses in a concise software design document format."
}}
```

### Hooks & Lifecycle
- `onInstall`: Verifies permissions and adds the plugin to the Zustand store.
- `onEnable`: Injects the `promptInjection` string into the Copilot API system context.
- `onDisable`: Removes the injection block from the prompt pipeline.

---

## Security

Career Agents is built with enterprise security standards:
- **Zero-Key Storage:** AI provider API keys are saved in browser `localStorage` and never sent to any database.
- **Session Tokens:** NextAuth JWT tokens are signed using `NEXTAUTH_SECRET` and saved in secure HttpOnly, SameSite=Lax cookies.
- **Strict Headers:** Includes Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), and clickjacking safeguards.
- **Validation:** Server endpoints validate inputs using Zod schemas before execution.

---

## Performance

The application is optimized for low latency:
- **Streaming Tokens:** Streams responses via Server-Sent Events (SSE) to show users text instantly.
- **Code Splitting & Suspense:** Lazy-loads charts (`recharts`) and modal windows to reduce initial load size.
- **Asset Caching:** Caches search indices and parsed resume buffers.
- **Dynamic Imports:** Dynamically imports heavy libraries (like `jszip` or `exceljs`) only when needed.

---

## SEO

Career Agents implements search engine optimization (SEO) standards:
- **Dynamic Sitemap:** `sitemap.xml` automatically registers all application pages at build time.
- **Structured Data:** Injects structured JSON-LD data into layouts to help search engines understand the site's content.
- **AI Discoverability:** Includes `llms.txt` and `llms-full.txt` (following the llmstxt.org specification) to allow LLM agents to index the repository easily.

---

## Accessibility

The dashboard is built to be accessible to all users:
- **Keyboard Navigation:** Full support for `Cmd+K` / `Ctrl+K` command palettes, search filters, and dialog control.
- **ARIA Standards:** Primitive layout items use Radix UI wrapper tags with complete ARIA attributes.
- **Contrast Ratios:** Background and text combinations meet WCAG AA contrast guidelines.

---

## Testing

Run static linting, type checks, and registry verification scripts before release:

```bash
# 1. Run type safety compiler check
npm run type-check

# 2. Run code style lint check
npm run lint

# 3. Validate agent markdown prompts and links
python scripts/validate.py

# 4. Compile index databases
python scripts/generate-data.py
```

---

## Deployment

Deploy Career Agents to production using one of three methods:

- **Vercel:** Connect the repository to Vercel, set root directory to `apps/web`, configure env variables, and deploy.
- **Docker:** Build a container from the root `Dockerfile` using `docker build -t career-agents .`.
- **Self-Hosted (Linux/Windows):** Run using a Node.js server with PM2 process manager and an Nginx reverse proxy.
- For complete steps, see [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

---

## Documentation

| Document File | Purpose / Details |
|---------------|-------------------|
| [docs/QUICKSTART.md](./docs/QUICKSTART.md) | Get Career Agents running locally in 5 minutes. |
| [docs/INSTALL.md](./docs/INSTALL.md) | Detailed installation steps for all setups. |
| [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) | Developer guide, agent schemas, and contributing guidelines. |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Architecture models and request flows. |
| [docs/API.md](./docs/API.md) | Full REST API reference with payload schemas. |
| [docs/AGENTS.md](./docs/AGENTS.md) | List of all 146 agents by division. |
| [docs/PROVIDERS.md](./docs/PROVIDERS.md) | Configuration steps for the 14 AI providers. |
| [docs/MCP.md](./docs/MCP.md) | Model Context Protocol IDE installation guide. |
| [docs/PLUGINS.md](./docs/PLUGINS.md) | Plugin marketplace architecture and lifecycle. |
| [docs/DATABASE.md](./docs/DATABASE.md) | Prisma schema models and migrations. |
| [docs/SECURITY.md](./docs/SECURITY.md) | Security policy and practices. |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Deploying to Vercel, Docker, and self-hosted environments. |
| [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | Common errors and step-by-step fixes. |
| [docs/FAQ.md](./docs/FAQ.md) | Answers to frequently asked questions. |
| [docs/CONFIGURATION.md](./docs/CONFIGURATION.md) | Feature flags and Next.js setup guide. |
| [docs/ENVIRONMENT_VARIABLES.md](./docs/ENVIRONMENT_VARIABLES.md) | Environment variables reference. |
| [docs/AI_ROUTER.md](./docs/AI_ROUTER.md) | AI routing architecture and error handling. |
| [docs/FILE_UPLOADS.md](./docs/FILE_UPLOADS.md) | File formats, size limits, and parsing engine. |
| [docs/EXPORTS.md](./docs/EXPORTS.md) | Exporting reports to PDF, Word, and Excel. |
| [docs/SEARCH.md](./docs/SEARCH.md) | Search index and matching algorithms. |
| [docs/THEMING.md](./docs/THEMING.md) | Custom themes and Tailwind design tokens. |
| [docs/TESTING.md](./docs/TESTING.md) | Testing and validation guide. |
| [docs/RELEASE.md](./docs/RELEASE.md) | Tagging releases and publishing to npm. |

---

## Roadmap

- **v10.0.0 (Founder Event Edition):** Immersive AI Career Operating System redesign, system diagnostics, and AI provider fallback chains.
- **v11.0.0:** React, TypeScript, and Vite-based Manifest V3 Chrome Extension.
- **v12.0.0:** Standard monorepo structures, Vercel deployments, and OpenAPI documentation layouts.
- **v13.0.0 (Current Release):** Enterprise Authentication, LinkedIn/Microsoft OAuth, and RBAC Role-Based Access controls.
- **v14.0.0 (Next):** Advanced recruiter workspaces, visual workflow builders, and autonomous Stripe roadmap agents.

---

## Contributing

We welcome community contributions:
- **Branching Strategy:** Create features on branches prefixed with `feature/` or `fix/`.
- **Validation:** Changes must pass `npm run type-check`, `npm run lint`, and `python scripts/validate.py`.
- **Commit Messages:** Follow [Conventional Commits](https://www.conventionalcommits.org/).
- For complete rules, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Community

- **Discussions:** Ask questions, share ideas, and get support in [GitHub Discussions](https://github.com/karthikrshet/Career-Agents/discussions).
- **Issues:** Report bugs or request features using [GitHub Issues](https://github.com/karthikrshet/Career-Agents/issues).
- **Sponsors:** Support ongoing development via [GitHub Sponsors](https://github.com/sponsors/karthikrshet).
- **Contributors:** Review the list of active contributors on the [/credits](https://career-os.vercel.app/credits) page.

---

## FAQ

**Q: Can I use Career Agents without an API key?**  
A: Yes. Resume ATS scans and GitHub score calculation run fully offline without any keys. Interactive chat features require a key.

**Q: Where are my API keys saved?**  
A: Keys are stored locally in your browser's `localStorage` and never sent to any database or third-party servers.

**Q: How do I resolve a 429 Too Many Requests error?**  
A: This occurs when you exceed your AI provider's rate limits. Wait 60 seconds or switch to a different provider under settings.

---

## Acknowledgements

- **Frontend:** Next.js, React, Tailwind CSS, Lucide Icons, Framer Motion, Radix UI.
- **Calculations & Parsers:** `pdf-parse`, `jszip`, `exceljs`, `docx`, `pdf-lib`.
- **AI Integrations:** OpenAI, Anthropic, Google Gemini, Groq.

---

## License

This repository is licensed under the MIT License — see [LICENSE](./LICENSE) for details.

---

<div align="center">

**[GitHub Repository](https://github.com/karthikrshet/Career-Agents) · [Live Platform](https://career-os.dev) · [NPM Registry](https://www.npmjs.com/package/career-agents) · [Documentation Hub](./docs/README.md)**

[Draft Release](https://github.com/karthikrshet/Career-Agents/releases) · [Report Bug](https://github.com/karthikrshet/Career-Agents/issues/new?template=BUG_REPORT.md) · [Request Feature](https://github.com/karthikrshet/Career-Agents/issues/new?template=FEATURE_REQUEST.md) · [Ask Question](https://github.com/karthikrshet/Career-Agents/issues/new?template=QUESTION.md)

</div>"""

    with open(README_PATH, "w", encoding="utf-8") as f:
        f.write(readme_content.strip() + "\n")
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
    print("All Career Agents databases generated successfully!")

if __name__ == "__main__":
    main()
