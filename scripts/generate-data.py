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
        add_node(div, div.capitalize(), "division")
        add_edge(aid, div, "belongs_to_division")
        
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
            add_node(div, div.capitalize(), "division")
            add_edge(pid, div, "uses_division")
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
        
        divisions_markdown.append(f"### 📁 {div_name} Division (`{div_id}`)")
        divisions_markdown.append(f"*{div_desc}*\n")
        divisions_markdown.append("| Agent Name | Status | Purpose / Description |")
        divisions_markdown.append("| :--- | :---: | :--- |")
        for a in div_agents:
            file_link = f"./{a.get('file')}"
            divisions_markdown.append(f"| [`{a.get('name')}`]({file_link}) | ✅ Live | {a.get('description')} |")
        divisions_markdown.append("\n")
        
    # Build career paths listing
    paths_markdown = []
    for p in paths:
        paths_markdown.append(f"#### 🎓 [{p.get('name')}](./career-paths/{p.get('id')}.json)")
        paths_markdown.append(f"- **Focus**: {p.get('description')}")
        paths_markdown.append(f"- **Core Skills Required**: {', '.join(p.get('core_skills', []))}")
        paths_markdown.append(f"- **Associated Coaches**: {', '.join(p.get('recommended_agents', []))}")
        paths_markdown.append("")

    # Build company tracks listing
    companies_markdown = []
    for co in companies:
        companies_markdown.append(f"#### 🏢 [{co.get('name')}](./companies/{co.get('id')}.json)")
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
    readme_content = f"""# 🚀 Career-Agents
### The Open-Source Career Operating System (Career OS)
**The most complete open-source career workspace, featuring {num_agents}+ specialized AI agents and structured execution roadmaps.**

[![npm version](https://img.shields.io/npm/v/career-agents)](https://www.npmjs.com/package/career-agents)
[![npm downloads](https://img.shields.io/npm/dm/career-agents)](https://www.npmjs.com/package/career-agents)
[![GitHub stars](https://img.shields.io/github/stars/karthikrshet/Career-Agents?style=social)](https://github.com/karthikrshet/Career-Agents)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/karthikrshet)](https://github.com/sponsors/karthikrshet)

<p align="center">
  <img src="./docs/images/career_os_dashboard.png" alt="Career OS Dashboard" width="800">
</p>

---

## Install

```bash
npm install -g career-agents
```

---

## Quick Start

```bash
career-agents doctor
career-agents assess
career-agents recommend
career-agents company google
career-agents resume templates
```

---

## 🗺️ Architecture Overview

```
Career OS
├── Career Agents
├── ATS Resume Studio
├── Career CLI
├── MCP Server
├── Company Tracks
├── Career Paths
└── Knowledge Graph
```

---

## 🤔 Why Career-Agents?

### What makes it different?
Unlike standard job boards or simple prompting guides, Career-Agents treats career advancement as an operational pipeline. It compiles specialized expert logic, ATS compliance patterns, and interview roadmaps into a unified system that integrates directly with developer workflows and AI coding editors.

### Who should use it?
- **Developers & Engineers**: Pivot roles (e.g. Frontend to AI/ML Engineering) and optimize technical profiles.
- **Students & Graduates**: Access placement structures, final-year project checklists, and internship pipelines.
- **Founders & Consultants**: Scope MVPs, construct pricing models, and direct growth strategies.

---

## Support Career-Agents

Career-Agents is an open-source Career Operating System.

If the project helps your career journey, consider supporting development.

GitHub Sponsors:
https://github.com/sponsors/karthikrshet

Benefits:
- Support new agent development
- Support Career OS growth
- Support Resume Studio improvements
- Support MCP ecosystem expansion

---

## 📊 Repository Statistics

- **Total Agents:** {num_agents} (100% active, fully specified, and tested)
- **Total Divisions:** {num_divs} functional specialty areas
- **Total Career Workflows:** {num_workflows} multi-agent operation guides
- **Total Career Bundles:** {num_bundles} pre-packaged bundles
- **Total Career Paths:** {num_paths} engineering/PM/founder paths
- **Total Target Companies:** {num_companies} tier-1 track prep databases
- **Total Integrations:** 10 supported configurations
- **Total Supported Platforms:** 10 runtimes
- **Total Contributors:** 1 (Karthik Rajesh Shet)

---

## 🆚 Why Career-Agents (Career OS)

| Capability / Feature | Agency Agents | Career-Ops | Career-Agents (Career OS) |
| :--- | :---: | :---: | :---: |
| **Agent Roster Depth** | ❌ Basic | ❌ None | ✅ **{num_agents}+ Specialist Agents** |
| **Modular Divisions** | ❌ Flat | ❌ Flat | ✅ **{num_divs} Categorized Divisions** |
| **Multi-Agent Workflows** | ❌ Manual | ✅ Job Search | ✅ **{num_workflows} Cross-Disciplinary Workflows** |
| **Ecosystem Bundles** | ❌ None | ❌ None | ✅ **{num_bundles} Target Milestones Bundles** |
| **Tier-1 Company Hubs** | ❌ General | ❌ General | ✅ **{num_companies} Detailed Company Guides** |
| **CLI & Exporters** | ❌ None | ❌ Python Script | ✅ **Career CLI + 6 Export Formats** |
| **IDE Prompts Injection** | ❌ Manual | ❌ Manual | ✅ **Cursor/Aider/Claude Code Injector** |
| **LLM Discovery Index** | ❌ None | ❌ None | ✅ **llms.txt, Maps, & Knowledge Graph** |

---

## ⚙️ Career Operating System Features

Career-Agents integrates several distinct layers to help candidates optimize their careers:

### 1. Agent Launcher
Direct browser redirection launcher hooks (`launcher/launcher-registry.json`) that copy prompts to clipboard and load target AI portals.

### 2. Career CLI
Complete command utility that allows developers to run prompt packages, diagnose environments, assess profile scores, and get matched recommendations.

### 3. Resume Intelligence & ATS Resume Studio
An integrated suite providing automated tools to build, score, and optimize resumes for ATS filters and company-specific rubrics.
*   **ATS Resume Templates:** 20 production-ready templates.
*   **Resume Builder:** CLI wizard compiling JSON/Markdown/TXT formats.
*   **ATS Scoring:** 0-100 scoring based on layout, formatting, skills density, and impact metrics.
*   **Job Match Analysis:** Match % and suggested optimizations against job descriptions.
*   **FAANG Optimization:** Specific rubrics for Google, Meta, OpenAI, etc.
*   **Career Recommendations:** Matches workflows and paths.

### 4. Interview Intelligence
Advanced mock interview loops, STAR behavioral storytelling drills, and scalable distributed system design coaching.

### 5. Job Intelligence
Structured workflows and scrapers targeting remote listings, referral outreach messages, and recruiter communications.

### 6. Career Intelligence
Path progressions mapping skills to core milestones, and company tracks mapping candidate prep to tier-1 loops.

---

## 🚀 Agent Launcher

The launcher maps local agent instructions to web-based AI clients (Claude, Gemini, ChatGPT, Perplexity, DeepSeek, Qwen, OpenRouter).

### Usage:
```bash
career-agents launcher <agent-id-or-bundle-id> <platform>
```
*Example:*
```bash
career-agents launcher google-interview-coach claude
```
This will copy the agent instructions to your clipboard and launch the Claude browser window automatically.

---

## 💻 Career CLI

Use the local Node.js command engine to interact with registries:

| Command | Action | Example |
| :--- | :--- | :--- |
| `list` | Show divisions, paths, and companies counts | `career-agents list` |
| `search` | Filter agents, workflows, and paths by keyword | `career-agents search google` |
| `run` | Execute local interactive terminal agent | `career-agents run google-interview-coach` |
| `bundles` | List or inspect pre-packaged bundles | `career-agents bundles faang-bundle` |
| `bundle run` | Run interactive bundle execution menu | `career-agents bundle run internship-bundle` |
| `path` | View career path details and prep tools | `career-agents path software-engineer` |
| `company` | Inspect target company interview loop tracks | `career-agents company stripe` |
| `launcher` | Copy prompts and launch AI browser interface | `career-agents launcher mock-interviewer` |
| `export` | Package bundles/companies/paths prompts | `career-agents export path ai-engineer yaml` |
| `use` | Inject instructions directly into Cursor/Copilot | `career-agents use ats-resume-reviewer cursor` |
| `resume` | Launch the ATS Resume Studio tools suite | `career-agents resume build` |
| `recommend` | Interactive profile target recommendations | `career-agents recommend` |
| `score` | Interactive career readiness report card | `career-agents score` |
| `graph` | Display knowledge graph dimensions summary | `career-agents graph` |
| `doctor` | Execute diagnostic environmental health checks | `career-agents doctor` |
| `update` | Recompile local indices and metrics | `career-agents update` |

---

## 🌟 Featured Agents

Here are a few high-value agents recommended for daily developer routines:
- **`ats-resume-reviewer`**: Line-by-line resume structural auditor.
- **`mock-interviewer`**: Simulates live tech and behavioural interview loops.
- **`google-interview-coach`**: Technical algorithms and Googleyness specialist.
- **`founder-advisor`**: Co-founder substitute that stress-tests MVP assumptions.
- **`ai-engineer-career-coach`**: Learning roadmap guide for ML/RAG developers.

---

## 📁 Browse By Division

Our agents are grouped into {num_divs} functional specialty divisions:

{divisions_str}

---

## 🎓 Browse By Career Path

Explore our pre-mapped career growth roadmaps detailing core competencies:

{paths_str}

---

## 🏢 Browse By Company

Target and clear Tier-1 interviews with company-specific tracks:

{companies_str}

---

## 🔄 Workflows

Workflows are repeatable pipelines guiding you step-by-step through career milestones:

{workflows_str}

---

## 🔗 Knowledge Graph

Career-Agents compiles a complex, expanded **[knowledge-graph.json](./knowledge-graph.json)** mapping dependencies across:
- **Agents** $\rightarrow$ Belongs to **Divisions** $\rightarrow$ Used in **Workflows**
- **Career Paths** $\rightarrow$ Requires **Skills** $\rightarrow$ Uses **Agents**
- **Companies** $\rightarrow$ Requires **Skills** $\rightarrow$ Prepped by **Workflows**
- **Bundles** $\rightarrow$ Packs **Agents**, **Career Paths**, and **Companies**

You can inspect nodes connectivity stats locally via:
```bash
node scripts/cli.js graph
```

---

## 🔌 Multi-Tool Integrations

Integration configurations are structured under the `integrations/` directory, complete with usage READMEs:

- [**integrations/claude-code/**](./integrations/claude-code/README.md): Claude Code subagents.
- [**integrations/cursor/**](./integrations/cursor/README.md): Cursor Rules custom modes.
- [**integrations/codex/**](./integrations/codex/README.md): Codex packages.
- [**integrations/gemini-cli/**](./integrations/gemini-cli/README.md): Gemini CLI templates.
- [**integrations/aider/**](./integrations/aider/README.md): Aider instructions.
- [**integrations/copilot/**](./integrations/copilot/README.md): GitHub Copilot rules.
- [**integrations/windsurf/**](./integrations/windsurf/README.md): Windsurf rulesets.
- [**integrations/qwen/**](./integrations/qwen/README.md): Qwen agent bundles.
- [**integrations/openrouter/**](./integrations/openrouter/README.md): OpenRouter payload formats.

---

## 🤝 Community

Explore guidelines, case logs, and programs to contribute to our open ecosystem:
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Contributor Recognition Levels](./docs/community/CONTRIBUTOR_LEVELS.md)
- [Ambassador Program](./docs/community/AMBASSADOR_PROGRAM.md)
- [Hall of Fame](./docs/community/HALL_OF_FAME.md)
- [Maintainers Code Owners](./docs/community/MAINTAINERS.md)
- [Community Onboarding Guide](./docs/community/COMMUNITY_GUIDE.md)
- [Certification Program](./docs/CERTIFICATION.md)
- [Ecosystem Asset Guide](./docs/ASSETS.md)
- [Who Uses Career OS](./docs/case-studies/WHO_USES_CAREER_OS.md)
- [Ecosystem Case Studies](./docs/case-studies/CASE_STUDIES.md)
- [Ecosystem Success Stories](./docs/case-studies/SUCCESS_STORIES.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Security Policy](./SECURITY.md)

---

## 🎖️ Project Contributors

This repository is maintained and expanded by:
- **Karthik Rajesh Shet** ([@karthikrshet](https://github.com/karthikrshet)) - Founder & Core Architect

---

## 🗺️ Roadmap

Check out the full release timeline in [RELEASE_MILESTONES.md](./docs/community/RELEASE_MILESTONES.md).

- **v1.0.0**: Core structural registries and configuration compilation system. (Completed)
- **v1.5.0**: Career Paths, target Company Tracks, and Category Intelligences. (Completed)
- **v2.0.0**: Local Agent Executor runtime CLI and profile scoring checks. (Completed)
- **v2.5.0**: Community PR automated linter submission verification. (Planned)
- **v3.0.0**: Peer-to-peer mock panels matching calendars. (Planned)

---

## 📦 Installation

Use the CLI command utility directly, or leverage PowerShell or Bash setup installers to selectively copy agent prompt assets to build targets:

### Option A: Local CLI Installation
```bash
npm install
npm link
```

### Option B: PowerShell Setup (Windows)
```powershell
# List available agents
powershell -File scripts/install.ps1 -List agents

# Dry run to preview what will be installed
powershell -File scripts/install.ps1 -Agent placement-coach -DryRun
```

### Option C: Bash Setup (macOS/Linux)
```bash
chmod +x scripts/install.sh
# List active divisions
./scripts/install.sh --list divisions
```
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
