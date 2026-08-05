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
    
    # Main README Assembly
    readme_content = f"""<div align="center">

<img src="https://raw.githubusercontent.com/karthikrshet/Career-Agents/main/branding/logo.svg" alt="Career Agents Logo" width="130" />

# ⚡ Career Agents: The AI Career Operating System

### The Open-Source Personal Career Optimization Suite & MCP Infrastructure for Software Engineers

<p align="center">
  <img src="https://raw.githubusercontent.com/karthikrshet/Career-Agents/main/branding/banner.svg" alt="Career Agents Banner" width="850" />
</p>

**Career Agents** is an enterprise-grade, open-source AI platform designed to automate and systemize professional tech career growth. Unifying **146 specialized AI agents across 19 divisions**, local heuristic ATS resume scoring, public GitHub portfolio auditing, search-visibility LinkedIn scanning, a **20-language LeetCode Coding Studio with 240+ problems**, and interactive STAR behavioral mock interviews — it replaces static prompts and fragmented tools with a context-aware career intelligence cockpit.

[Live Demo](https://career-os.dev) · [NPM Package](https://www.npmjs.com/package/career-agents) · [Documentation Hub](./docs/README.md) · [Report Bug](https://github.com/karthikrshet/Career-Agents/issues/new?template=BUG_REPORT.md)

</div>

---

## 📊 Badges & Status

<p align="center">
  <a href="https://www.npmjs.com/package/career-agents"><img src="https://img.shields.io/npm/v/career-agents?color=blue&style=flat-square" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/career-agents"><img src="https://img.shields.io/npm/dm/career-agents?color=orange&style=flat-square" alt="NPM Downloads"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License: MIT"></a>
  <a href="https://github.com/karthikrshet/Career-Agents"><img src="https://img.shields.io/github/stars/karthikrshet/Career-Agents?style=flat-square" alt="GitHub Stars"></a>
  <a href="https://github.com/karthikrshet/Career-Agents/network/members"><img src="https://img.shields.io/github/forks/karthikrshet/Career-Agents?style=flat-square" alt="GitHub Forks"></a>
  <a href="https://github.com/karthikrshet/Career-Agents/releases"><img src="https://img.shields.io/github/v/release/karthikrshet/Career-Agents?color=green&style=flat-square" alt="GitHub Release"></a>
  <a href="https://github.com/karthikrshet/Career-Agents/issues"><img src="https://img.shields.io/github/issues/karthikrshet/Career-Agents?style=flat-square" alt="GitHub Issues"></a>
  <a href="https://github.com/karthikrshet/Career-Agents/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/karthikrshet/Career-Agents/ci.yml?branch=main&label=CI%20Build&style=flat-square" alt="Build Status"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square" alt="TypeScript"></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square" alt="Next.js"></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18-blue?style=flat-square" alt="React"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node-%3E%3D18-green?style=flat-square" alt="Node.js"></a>
  <a href="https://modelcontextprotocol.io/"><img src="https://img.shields.io/badge/MCP-Compatible-cyan?style=flat-square" alt="MCP Compatible"></a>
</p>

---

## 🎯 Why Software Engineers Need Career Agents

Software engineers face a fragmented job application ecosystem:
- **Resumes** are screened by ruthless ATS regex parsers before a recruiter reads them.
- **Portfolios** are judged by public GitHub activity, language diversity, and documentation completeness.
- **LinkedIn Profiles** are indexed by recruiter search algorithms that filter by headline keywords.
- **Technical & Behavioral Interviews** demand rigorous STAR method metrics and rapid coding under timed constraints.

Existing AI chatbots fail because they treat each prompt in isolation, forcing candidates to repeatedly copy-paste resumes, terminal outputs, and system architecture specs into separate chat windows.

### The Career Agents Solution:
1. **Unified Dossier State:** A local-first state engine synchronizes your ATS scores, GitHub metrics, target roles, and interview progress into a single system memory.
2. **Dynamic 146-Agent Router:** Automatically matches queries against 146 specialized domain personas (e.g. *Senior System Architect*, *STAR Behavioral Coach*, *Placement Strategist*).
3. **Multi-Provider Failover Gateway:** Connects to 18 AI backends (Groq, Gemini, OpenAI, Claude, DeepSeek, xAI Grok, Ollama, LM Studio) with zero setup required and automatic failover guarantees.
4. **IDE Native via MCP Protocol:** Exposes 25 Model Context Protocol (MCP) stdio tools so Cursor, Claude Desktop, VS Code, and Windsurf can evaluate resumes, generate roadmaps, and run mock interviews right inside your code editor.

---

## 📸 Screenshots & Visual Product Tour

<div align="center">

### 🌐 Landing Page & System Cockpit
*The unified entry point highlighting live agent telemetry, local ATS tools, and zero-key privacy.*
![Landing Page](./apps/web/public/images/hero_preview.png)

### 🚀 Interactive Product Workspace Overview
*Centralized control panel inspecting live agent status streams, local SQLite sync, and quick audit triggers.*
![Product Workspace](./apps/web/public/images/workspace_preview.png)

### 💻 AI Copilot Stream Workspace
*Context-aware chat workspace featuring multi-provider model switching, reasoning timeline traces, and downloadable file generation.*
![AI Copilot Stream](./apps/web/public/images/copilot_stream_preview.png)

### ⚡ Next-Gen Coding Studio (LeetCode Workspace)
*Practice 240+ coding interview problems with 20-language execution, algorithm visualizers, STAR coding coaches, and virtual contests.*
![Coding Studio Workspace](./apps/web/public/images/coding_studio_preview.png)

### 📚 Problem Catalog & Curated Interview Roadmaps
*Filter by Blind 75, NeetCode 150, Top 150, or company-specific question sets (Google, Meta, Amazon, Microsoft, Apple, Netflix, Stripe, OpenAI).*
![Problem Catalog](./apps/web/public/images/problem_catalog_preview.png)

### 💼 Job Hub & AI Search Engine
*Discover open opportunities with real-time ATS match percentage calculations, one-click cover letter generation, and referral request drafting.*
![Job Hub](./apps/web/public/images/job_hub_preview.png)

</div>

---

## ⚡ Complete Feature Suite

### 1. 🤖 AI Copilot Stream & 146 Agent Ecosystem
- **146 Specialized Agents:** Divided across 19 domain divisions (Engineering, System Design, Placements, Resume ATS, FAANG Interview, Executive Coaching).
- **Keyword & Skill Router:** Dynamically scores queries (`Score = Name*15 + Keyword*3 + Skill*2 + Domain*12`) to inject top matching agent personas into the LLM system prompt.
- **Reasoning Timeline Trace:** Displays real-time agent selection timelines, execution latency (ms), confidence scores, and token costs.
- **Document Directives:** Supports exporting custom responses to styled PDF, Word (DOCX), Excel (CSV), and Markdown formats.

### 2. 💻 Next-Gen Coding Studio (LeetCode Workspace)
- **20-Language Compiler:** Execute code in C, C++, Java, Python, Python3, JavaScript, TypeScript, Go, Rust, Kotlin, Swift, Dart, PHP, Ruby, Scala, C#, Elixir, Erlang, Racket, and Bash via Judge0, Piston API, and local sandboxes.
- **240+ Coding Problems:** Curated question sets categorized by Blind 75, NeetCode 150, Top 150, and FAANG company tracks.
- **Interactive Algorithm Visualizers:** Step-by-step visual animations for Two Pointers, Binary Search, Sorting, Stacks, Linked Lists, and Dynamic Programming (Kadane's).
- **Data Structure Whiteboard Canvas:** Interactive drawing board for Trees, Graphs, Linked Lists, Heaps, and Flowcharts.
- **AI STAR Coding Coach:** Get progressive hints, dry-run code explanations, Big-O complexity breakdowns, edge case checks, and STAR behavioral interview linkages.

### 3. 📄 ATS Resume Studio & 20 Built-In Templates
- **20 ATS Resume Templates:** Includes templates for Freshers, SWE Interns, Senior Engineers, Full-Stack Developers, DevOps Engineers, and FAANG ATS Masters.
- **Parser Heuristic Scanner:** Checks layout formatting for common ATS failure points (multi-column tables, text boxes, graphic icons).
- **Action-Verb & STAR Auditor:** Identifies passive verbs (e.g. *assisted*, *helped*) and flags bullets lacking metric outcomes.
- **Keyword Density Check:** Matches resume terms against industry keywords for your target role.

### 4. 🎯 STAR Mock Interview Lab
- **10 FAANG Company Tracks:** Dedicated interview tracks for Google, Meta, Amazon, Microsoft, Apple, Netflix, Stripe, Uber, Atlassian, and Databricks.
- **Interactive Code Canvas:** Code solutions live during technical and system design rounds.
- **10-Parameter Rubric Matrix:** Evaluates responses across Situation, Task, Action, Result, Ownership, Leadership, Technical Depth, Problem Solving, Communication, and Confidence.

### 5. 🐙 GitHub Profile Analyzer & Wrapped
- **Repository Star Metrics & Language Breakdown:** Pulls public repository data directly from the GitHub REST API.
- **Documentation Auditor:** Grades README completeness, setup instructions, and code license coverage.
- **Contribution Heatmap:** Visualizes commit activity over the past year.

### 6. 💼 Job Hub & Kanban Job Tracker
- **5 Kanban Application Stages:** Drag cards across Wishlist, Applied, Interview, Offer, and Rejected lists.
- **Recruiter Log Management:** Log follow-up dates, interviewer contacts, and salary expectations.

---

## 🏗️ Architecture & Data Flow

### System Data Flow Architecture

```mermaid
sequenceDiagram
    participant User as User / Browser
    participant Client as Next.js 14 App Client
    participant Router as Multi-Provider AI Router
    participant LLM as AI Provider Gateway (18 Backends)
    participant DB as Browser LocalStorage / SQLite / Postgres
    
    User->>Client: Access Copilot / Resume / Coding Studio
    Client->>Router: Send Query + Client Dossier Context
    Router->>Router: Match 146 Agent Registry & Select Personas
    Router->>LLM: Dispatch Stream Request with Failover Chain
    LLM-->>Router: Stream SSE Completion Tokens
    Router-->>User: Render Real-Time Markdown + Code Blocks
    Client->>DB: Synchronize Metrics & Session State
```

### Model Context Protocol (MCP) IDE Integration

```mermaid
graph LR
    IDE[Cursor / Claude Desktop / VS Code] -->|Stdio JSON-RPC| MCPServer[mcp/server.js MCP Server]
    MCPServer -->|Query Registry| Registry[(agent-registry.json)]
    MCPServer -->|Run Tools| Tools[scripts/cli.js / Resume / GitHub Engine]
    Tools -->|Structured Output| IDE
```

---

## 🌐 AI Gateway & Supported Providers

Career Agents features a multi-provider gateway supporting **18 AI backends** with zero-key guest fallbacks:

| Provider | Status | Default Model | Free Tier | Streaming | Vision |
|----------|--------|--------------|-----------|-----------|--------|
| **Groq** | ✅ Active | `llama-3.3-70b-versatile` | ✅ Yes | ✅ Yes | ❌ |
| **Google Gemini** | ✅ Active | `gemini-2.5-pro` | ✅ Yes | ✅ Yes | ✅ Yes |
| **OpenAI** | ✅ Active | `gpt-4o` | ❌ No | ✅ Yes | ✅ Yes |
| **Anthropic Claude** | ✅ Active | `claude-3-5-sonnet-20241022`| ❌ No | ✅ Yes | ✅ Yes |
| **DeepSeek** | ✅ Active | `deepseek-chat` | ❌ Cheap | ✅ Yes | ❌ |
| **OpenRouter** | ✅ Active | `meta-llama/llama-3.1-405b` | ✅ Yes | ✅ Yes | ✅ Yes |
| **Together AI** | ✅ Active | `meta-llama/Llama-3-70b-chat`| ❌ No | ✅ Yes | ❌ |
| **Mistral** | ✅ Active | `mistral-large-latest` | ❌ No | ✅ Yes | ❌ |
| **Cohere** | ✅ Active | `command-r-plus` | ✅ Trial | ✅ Yes | ❌ |
| **xAI Grok** | ✅ Active | `grok-2` | ❌ No | ✅ Yes | ❌ |
| **Azure OpenAI** | ✅ Active | Custom deployment | ❌ Enterprise| ✅ Yes | ✅ Yes |
| **Ollama** | ✅ Active (Local) | User pulled (`llama3.3`) | ✅ Yes | ✅ Yes | ❌ |
| **LM Studio** | ✅ Active (Local) | Custom loaded GGUF | ✅ Yes | ✅ Yes | ❌ |

---

## 🛠️ Model Context Protocol (MCP) IDE Setup

Expose Career Agents tools directly to your AI code editors:

### Supported Editors
- **Cursor AI:** Add stdio command `node /absolute/path/to/Career-Agents/mcp/server.js` in Settings -> Features -> MCP.
- **Claude Desktop:** Add configuration block to `claude_desktop_config.json`.
- **VS Code (Continue Extension):** Add to `.continue/config.json`.
- **Windsurf / Aider / Bolt:** Configure stdio parameters to use the local server path.

### Configuration Example (`claude_desktop_config.json`)
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

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js >= 18.0.0 (Node 20 LTS recommended)
- Git
- Python 3.9+ (required for data validation scripts)

### Quick Start (Under 5 Minutes)
```bash
# 1. Clone repository
git clone https://github.com/karthikrshet/Career-Agents.git
cd Career-Agents

# 2. Install web application dependencies
cd apps/web
npm install

# 3. Setup environment configuration
cp .env.example .env
# Set NEXTAUTH_SECRET (e.g. openssl rand -base64 32)

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The application runs immediately in **Guest Mode** with full zero-key environment AI fallbacks enabled out of the box!

---

## 🖥️ CLI Utilities

Run terminal commands via `scripts/cli.js`:

```bash
# List all 146 agents and 19 divisions
node scripts/cli.js list

# Run ATS resume score audit
node scripts/cli.js score resume.pdf

# Run GitHub profile wrapped audit
node scripts/cli.js github torvalds

# Start terminal STAR mock interview drill
node scripts/cli.js mock google behavioral
```

---

## 📂 Project Structure

```
Career-Agents/
├── apps/
│   └── web/                   ← Next.js 14 Web Application (App Router, Tailwind, Zustand)
│       ├── public/images/     ← High-res product screenshots & media assets
│       └── src/app/           ← App pages (/copilot, /resume, /playground, /interview, /github)
├── packages/
│   ├── ai/                    ← Multi-provider API abstraction adapters
│   ├── ai-router/             ← AI Gateway & failover routing engine
│   └── brain/                 ← Context compilation & 146 Agent Orchestrator
├── mcp/                       ← Stdio Model Context Protocol Server (25 tools)
├── resume-templates.json      ← 20 ATS Resume Templates Registry
├── agent-registry.json        ← 146 AI Agent Master Registry
└── scripts/                   ← generate-data.py, validate.py, and cli.js utilities
```

---

## 🤝 Contributing & Sponsorship

We welcome contributions from the community!

### Contribution Workflow:
1. Fork and clone the repository.
2. Create a feature branch (`git checkout -b feature/my-cool-feature`).
3. Run verification scripts before committing:
   ```bash
   npm run type-check
   python scripts/generate-data.py
   python scripts/validate.py
   ```
4. Push and open a Pull Request.

### Sponsor Ongoing Development:
If Career Agents has helped you land software engineering interviews, consider sponsoring the project on [GitHub Sponsors](https://github.com/sponsors/karthikrshet)!

---

## 📜 License

Distributed under the **MIT License**. See [LICENSE](./LICENSE) for details.

<div align="center">

**[GitHub Repository](https://github.com/karthikrshet/Career-Agents) · [Live Platform](https://career-os.dev) · [NPM Package](https://www.npmjs.com/package/career-agents) · [Documentation](./docs/README.md)**

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
