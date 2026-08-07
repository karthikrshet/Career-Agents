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

def generate_llm_indexes(agents, workflows, companies, paths, bundles):
    print("Generating LLM indexes...")
    
    # 1. llms.txt (brief catalog following llmstxt.org standard)
    txt_content = []
    txt_content.append("# Career-Agents LLM Discovery Catalog")
    txt_content.append("This file contains the map of available agents, operational workflows, company tracks, and career paths for automated tools and AI clients.")
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

    txt_content.append("## Company Tracks")
    for c in companies:
        txt_content.append(f"- {c.get('name')} (ID: {c.get('id')})")
        txt_content.append(f"  Skills: {', '.join(c.get('skills', []))}")
        txt_content.append(f"  Agents: {', '.join(c.get('agents', []))}")
        txt_content.append("")

    txt_content.append("## Career Paths")
    for p in paths:
        txt_content.append(f"- {p.get('name')} (ID: {p.get('id')})")
        txt_content.append(f"  Description: {p.get('description')}")
        txt_content.append(f"  Core Skills: {', '.join(p.get('core_skills', []))}")
        txt_content.append("")
        
    with open(LLMS_TXT_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(txt_content))
    print("Generated llms.txt")

    # 2. llms-full.txt (complete concatenated prompts & manifests, 30,000+ lines)
    full_content = []
    full_content.append("# Career-Agents Full Prompt Manifest")
    full_content.append("This document bundles the complete details, prompt rules, workflows, company tracks, and career path schemas in the Career Operating System.")
    full_content.append("")

    # Section A: Specialized Agents
    full_content.append("============================================================")
    full_content.append("SECTION 1: SPECIALIZED CAREER AGENTS (146 AGENTS)")
    full_content.append("============================================================")
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

    # Section B: Operational Workflows
    full_content.append("============================================================")
    full_content.append("SECTION 2: OPERATIONAL WORKFLOW GUIDES")
    full_content.append("============================================================")
    full_content.append("")

    for w in workflows.get("workflows", []):
        wf_path = ROOT / w.get("filename")
        full_content.append("="*60)
        full_content.append(f"WORKFLOW: {w.get('name')} ({w.get('id')})")
        full_content.append(f"Path: {w.get('filename')}")
        full_content.append(f"Category: {w.get('category')}")
        full_content.append(f"Description: {w.get('description')}")
        full_content.append("="*60)
        if wf_path.exists():
            full_content.append(wf_path.read_text(encoding="utf-8"))
        else:
            full_content.append("[Workflow File Missing]")
        full_content.append("\n\n")

    # Section C: Company Interview Tracks
    full_content.append("============================================================")
    full_content.append("SECTION 3: COMPANY INTERVIEW PREPARATION TRACKS")
    full_content.append("============================================================")
    full_content.append("")

    for c in companies:
        full_content.append("="*60)
        full_content.append(f"COMPANY TRACK: {c.get('name')} ({c.get('id')})")
        full_content.append("="*60)
        full_content.append(json.dumps(c, indent=2))
        full_content.append("\n\n")

    # Section D: Career Paths & Skill Blueprints
    full_content.append("============================================================")
    full_content.append("SECTION 4: CAREER PATHS & SKILL BLUEPRINTS")
    full_content.append("============================================================")
    full_content.append("")

    for p in paths:
        full_content.append("="*60)
        full_content.append(f"CAREER PATH: {p.get('name')} ({p.get('id')})")
        full_content.append("="*60)
        full_content.append(json.dumps(p, indent=2))
        full_content.append("\n\n")

    # Section E: Intelligence Bundles
    full_content.append("============================================================")
    full_content.append("SECTION 5: INTELLIGENCE BUNDLES")
    full_content.append("============================================================")
    full_content.append("")

    for b in bundles:
        full_content.append("="*60)
        full_content.append(f"BUNDLE: {b.get('name')} ({b.get('id')})")
        full_content.append("="*60)
        full_content.append(json.dumps(b, indent=2))
        full_content.append("\n\n")

    with open(LLMS_FULL_TXT_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(full_content))
    
    # Also sync to apps/web/public/llms-full.txt and apps/web/public/llms.txt
    public_dir = ROOT / "apps" / "web" / "public"
    if public_dir.exists():
        with open(public_dir / "llms-full.txt", "w", encoding="utf-8") as f:
            f.write("\n".join(full_content))
        with open(public_dir / "llms.txt", "w", encoding="utf-8") as f:
            f.write("\n".join(txt_content))
            
    print(f"Generated llms-full.txt ({len(full_content)} blocks / 30,000+ lines)")

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

<img src="https://raw.githubusercontent.com/karthikrshet/Career-Agents/main/branding/logo.svg" width="140" height="auto" alt="Career Agents Logo" />

# ⚡ Career Agents: The AI Career Operating System

### Enterprise-Grade Personal Career Optimization Suite & Model Context Protocol (MCP) Infrastructure for Software Engineers

<br />

<a href="https://career-agents.vercel.app"><img src="https://img.shields.io/badge/Live_Deployment-career--agents.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white" height="32" alt="Vercel Deployment" /></a>
<a href="https://www.npmjs.com/package/career-agents"><img src="https://img.shields.io/badge/NPM_Registry-career--agents-cb3837?style=for-the-badge&logo=npm&logoColor=white" height="32" alt="NPM Registry" /></a>
<a href="https://github.com/karthikrshet/Career-Agents"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" height="32" alt="GitHub Repo" /></a>

<br /><br />

<img src="https://img.shields.io/badge/Release-v16.2.0_Enterprise-059669?style=flat-square&logo=git&logoColor=white" height="26" alt="Release v16.2.0" />
<img src="https://img.shields.io/badge/Agents-146_Specialized-0284c7?style=flat-square&logo=openai&logoColor=white" height="26" alt="146 Agents" />
<img src="https://img.shields.io/badge/Divisions-19_Domains-7c3aed?style=flat-square&logo=diagram&logoColor=white" height="26" alt="19 Divisions" />
<img src="https://img.shields.io/badge/AI_Gateways-18_Providers-d97706?style=flat-square&logo=cpu&logoColor=white" height="26" alt="18 Providers" />
<img src="https://img.shields.io/badge/MCP-Stdio_Protocol-4f46e5?style=flat-square&logo=lightning&logoColor=white" height="26" alt="MCP Server" />
<img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" height="26" alt="License MIT" />

<br /><br />

<p align="center">
  <img src="https://raw.githubusercontent.com/karthikrshet/Career-Agents/main/branding/banner.svg" width="850" height="auto" alt="Career Agents Banner" />
</p>

</div>

---

## 🎯 Executive Overview & Profile

> **Career Agents** is an open-source, local-first **AI Career Operating System** built for software engineers, tech candidates, and engineering managers. 
> 
> Unifying **{num_agents} specialized AI agents across {num_divs} domain divisions**, a **20-language LeetCode Coding Studio with 240+ problems**, local heuristic **ATS Resume Grading**, public **GitHub Portfolio Auditing**, search-visibility **LinkedIn Profile Scanning**, and interactive **STAR Behavioral & System Design Mock Interviews** — it replaces generic ChatGPT prompts and static resume templates with a context-aware career intelligence cockpit.

---

## 💻 Tech Stack & Integrations

**Frontend & Architecture**  
<img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" height="28" alt="Next.js 14" />
<img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" height="28" alt="React 18" />
<img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" height="28" alt="TypeScript 5" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" height="28" alt="Tailwind CSS" />
<img src="https://img.shields.io/badge/Zustand-443e38?style=for-the-badge&logo=state&logoColor=white" height="28" alt="Zustand State" />
<img src="https://img.shields.io/badge/Prisma_Postgres-2D3748?style=for-the-badge&logo=prisma&logoColor=white" height="28" alt="Prisma Postgres" />
<img src="https://img.shields.io/badge/Local_SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" height="28" alt="Local SQLite" />

**AI Provider Gateways**  
<img src="https://img.shields.io/badge/Groq_Llama_3.3-F55036?style=for-the-badge&logo=groq&logoColor=white" height="28" alt="Groq" />
<img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white" height="28" alt="Gemini" />
<img src="https://img.shields.io/badge/OpenAI_GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white" height="28" alt="OpenAI" />
<img src="https://img.shields.io/badge/Anthropic_Claude-D97706?style=for-the-badge&logo=anthropic&logoColor=white" height="28" alt="Claude" />
<img src="https://img.shields.io/badge/DeepSeek_V3-0066FF?style=for-the-badge&logo=deepseek&logoColor=white" height="28" alt="DeepSeek" />
<img src="https://img.shields.io/badge/xAI_Grok_2-000000?style=for-the-badge&logo=x&logoColor=white" height="28" alt="xAI Grok" />
<img src="https://img.shields.io/badge/Ollama_Local-000000?style=for-the-badge&logo=ollama&logoColor=white" height="28" alt="Ollama Local" />

---

## ⚡ Quickstart, Installation & IDE Setup

### 1. 🚀 How to Run Web App Locally (Under 5 Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/karthikrshet/Career-Agents.git
cd Career-Agents

# 2. Install web dependencies
cd apps/web
npm install

# 3. Setup environment configuration
cp .env.example .env
# Edit .env and enter a random NEXTAUTH_SECRET (e.g. openssl rand -base64 32)

# 4. Start local development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** or **[https://career-agents.vercel.app](https://career-agents.vercel.app)** in your browser.

- **Guest Mode (Default):** Zero credentials required! Runs locally saving dossier metrics to browser `localStorage`.
- **Database Mode (Optional):** Set `DATABASE_URL` in `.env` to PostgreSQL and run `npx prisma db push`.

---

### 2. 🔌 How to Connect MCP Protocol Server to your IDE

Expose Career Agents tools directly to **Cursor AI**, **Claude Desktop**, **VS Code**, **Windsurf**, or **Aider**:

**Command to register in IDE:**
```bash
node /absolute/path/to/Career-Agents/mcp/server.js
```

#### 📍 Claude Desktop Setup (`claude_desktop_config.json`):
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

#### 📍 Cursor AI Setup:
Go to **Settings** -> **Features** -> **MCP** -> **Add new MCP Server**:
- **Name:** `career-agents`
- **Type:** `stdio`
- **Command:** `node /absolute/path/to/Career-Agents/mcp/server.js`

#### 📍 VS Code (Continue Extension Setup):
Add to `.continue/config.json`:
```json
{{
  "experimental": {{
    "modelContextProtocol": [
      {{
        "name": "career-agents",
        "command": "node",
        "args": ["/absolute/path/to/Career-Agents/mcp/server.js"]
      }}
    ]
  }}
}}
```

---

### 3. 🧩 How to Run & Enable Local Extensions & Plugins

- **Marketplace Extensions (`/marketplace`):** Navigate to the **146 Agent Marketplace** in the web dashboard to toggle extensions like *STAR Behavioral Coach*, *LeetCode Complexity Tracker*, and *Salary Intelligence*.
- **Custom Plugin Manifests (`packages/plugins`):** Drop a JSON manifest into the plugin directory to extend Copilot system prompts:
  ```json
  {{
    "id": "my-custom-plugin",
    "name": "Custom Design Doc Plugin",
    "permissions": ["read_profile", "write_copilot_context"],
    "promptInjection": "Format all architectural outputs into clean RFC technical design documents."
  }}
  ```

---

### 4. 🖥️ How to Run Terminal CLI Utilities

Run terminal commands anywhere using `scripts/cli.js`:

```bash
# List all 146 agents and 19 divisions
node scripts/cli.js list

# Score PDF/Word resume against ATS standards
node scripts/cli.js score resume.pdf

# Run GitHub profile wrapped audit
node scripts/cli.js github torvalds

# Start interactive terminal STAR mock interview
node scripts/cli.js mock google behavioral
```

---

## 📸 Complete Product Visual Showcase

<div align="center">

### 1. 🌐 Landing Page & Hero Cockpit
*The entry point featuring system architecture stats, zero-key privacy guarantees, and instant live launch triggers.*
![Landing Page Hero](./apps/web/public/images/hero_landing.png)

<br />

### 2. 🚀 Interactive Product Workspace Overview
*Centralized system control panel inspecting active agent status streams, local SQLite database sync, and quick audit tools.*
![Product Workspace Overview](./apps/web/public/images/workspace_overview.png)

<br />

### 3. 💻 AI Copilot Stream Workspace
*Context-aware chat workspace with multi-provider model switching, real-time SSE streaming, reasoning timeline traces, and downloadable PDF/Word file generation.*
![AI Copilot Stream Workspace](./apps/web/public/images/copilot_stream_chat.png)

<br />

### 4. ⚡ Next-Gen Coding Studio (LeetCode Workspace)
*Practice 240+ coding interview problems with 20-language execution, algorithm visualizers, STAR coding coaches, and virtual contests.*
![Coding Studio Main](./apps/web/public/images/coding_studio_main.png)

<br />

### 5. 📚 LeetCode Problem Catalog & FAANG Question Sets
*Curated coding problem sets filtered by Blind 75, NeetCode 150, Top 150, or company sets (Google, Meta, Amazon, Microsoft, Apple, Netflix, Stripe, OpenAI).*
![LeetCode Problem Catalog](./apps/web/public/images/problem_catalog_faang.png)

<br />

### 6. 🎨 Data Structure Whiteboard Canvas
*Interactive visual whiteboard canvas for sketching binary trees, graphs, linked lists, system architecture flowcharts, and algorithm dry runs.*
![Whiteboard Canvas](./apps/web/public/images/whiteboard_canvas.png)

<br />

### 7. 🔍 Step-by-Step Algorithm Visualizer
*Step-by-step interactive animations for Two Pointers, Binary Search, Sorting, Stacks, Linked Lists, and Dynamic Programming (Kadane's).*
![Algorithm Visualizer](./apps/web/public/images/algorithm_visualizer.png)

<br />

### 8. 🏆 Live Virtual Contests & Leaderboard
*Participate in timed virtual coding contests with live countdown clocks, scoreboards, problem filters, and upsolve mode.*
![Virtual Contests](./apps/web/public/images/virtual_contests.png)

<br />

### 9. 📄 ATS Resume Studio & 20 Built-In Templates
*Check resume section density, scan action verbs, validate STAR metrics, detect weak bullets, and export to 20 styled ATS templates.*
![ATS Resume Studio](./apps/web/public/images/resume_ats_studio.png)

<br />

### 10. 🎯 STAR Behavioral & Technical Mock Interview Lab
*Conduct mock interviews across 10 company tracks featuring integrated code canvases, STAR parameter scorecards, and AI interviewer evaluation.*
![STAR Mock Interview Lab](./apps/web/public/images/star_interview_lab.png)

<br />

### 11. 🏢 Target Company Tracks (FAANG & Tier-1 Tech)
*Targeted interview prep modules tailored for Google, Meta, Amazon, Microsoft, Netflix, Apple, Uber, Stripe, Atlassian, and Databricks.*
![Company Tracks](./apps/web/public/images/company_tracks.png)

<br />

### 12. 🐙 GitHub Profile Analyzer & Portfolio Wrapped
*Integrates directly with the GitHub REST API to compute language distributions, repo star weights, documentation completeness scores, and commit heatmaps.*
![GitHub Profile Analyzer](./apps/web/public/images/github_analyzer.png)

<br />

### 13. 👔 LinkedIn Profile Search Optimizer & AI Content Engine
*Evaluate headline pipe architecture, summary keyword density, recruiter visibility scores, and generate AI-crafted post copy.*
![LinkedIn Optimizer](./apps/web/public/images/linkedin_optimizer.png)
![LinkedIn AI Content](./apps/web/public/images/linkedin_content_ai.png)

<br />

### 14. 💼 Job Hub Opportunities Search Engine
*Search 30+ tech opportunities with automated ATS match scoring, one-click cover letter generation, and referral request drafting.*
![Job Hub Opportunities Search](./apps/web/public/images/job_hub_engine.png)

<br />

### 15. 📊 Kanban Application Job Tracker
*Drag-and-drop Kanban board managing applications across Wishlist, Applied, Interview, Offer, and Rejected stages with recruiter interaction logs.*
![Kanban Application Job Tracker](./apps/web/public/images/kanban_tracker.png)

<br />

### 16. 🗺️ Prep Hub & Custom Study Roadmaps
*Generates personalized step-by-step career roadmaps for Software Engineer, Senior Backend Developer, System Architect, and AI/ML Specialist.*
![Prep Hub Study Roadmaps](./apps/web/public/images/prep_hub_roadmaps.png)

<br />

### 17. ⚡ Workflow Automation Pipelines
*Run multi-agent automated pipelines connecting resume audits, GitHub scans, and mock interview questions into a single execution stream.*
![Workflow Pipelines](./apps/web/public/images/workflow_pipelines.png)

<br />

### 18. 🧩 146 Agent Marketplace Extensions
*Browse, search, and enable domain-specific agent extensions across 19 career divisions.*
![Agent Marketplace Extensions](./apps/web/public/images/marketplace_agents.png)

<br />

### 19. 🔌 Model Context Protocol (MCP) Stdio Server
*Exposes 25 career tools directly to local IDE environments including Cursor, Claude Desktop, VS Code, and Windsurf.*
![MCP Protocol Server Setup](./apps/web/public/images/mcp_protocol_server.png)

<br />

### 20. ⚙️ Settings & Multi-Provider AI Gateway
*Configure 18 AI providers, set default models, adjust temperature parameters, manage local API keys, and test response latency.*
![Settings AI Gateway](./apps/web/public/images/settings_ai_gateway.png)

<br />

### 21. 📑 Reports & Comprehensive Dossier Diagnostics
*Export complete career analysis dossiers into professional PDF documents, Word `.docx` files, Excel `.xlsx` spreadsheets, or Markdown.*
![Reports Diagnostics](./apps/web/public/images/reports_diagnostics.png)
![Dossier Export Reports](./apps/web/public/images/dossier_export_reports.png)

<br />

### 22. 📈 Dashboard Analytics & System Telemetry Logs
*Track progress metrics over time, inspect live agent execution telemetry logs, and verify local SQLite database state.*
![Dashboard Analytics](./apps/web/public/images/dashboard_analytics.png)
![System Telemetry Logs](./apps/web/public/images/system_telemetry_logs.png)

<br />

### 23. 💳 Credits & Open Source Tech Stack Ecosystem
*Review open-source libraries, platform contributors, and core maintainers.*
![Credits & Ecosystem](./apps/web/public/images/credits_ecosystem.png)

</div>

---

## ⚡ Complete Feature Matrix & Capabilities

| Feature Module | CLI Utility | Web Dashboard | MCP Server |
|----------------|:-----------:|:-------------:|:----------:|
| **Agent Directory Search ({num_agents} Agents)** | ✅ | ✅ | ✅ |
| **20-Language Coding Studio Compiler** | ✅ | ✅ | ✅ |
| **240+ LeetCode Problem Catalog** | ✅ | ✅ | ✅ |
| **Step-by-Step Algorithm Visualizer** | ❌ | ✅ | ✅ |
| **Whiteboard Canvas & System Design** | ❌ | ✅ | ❌ |
| **20 ATS Resume Templates & Calibrator** | ✅ | ✅ | ✅ |
| **GitHub Profile Wrapped Audit** | ✅ | ✅ | ✅ |
| **LinkedIn Headline & Keyword Audit** | ✅ | ✅ | ✅ |
| **STAR Mock Interview Engine (10 Tracks)** | ✅ | ✅ | ✅ |
| **Job Opportunities Hub & ATS Match** | ❌ | ✅ | ✅ |
| **Kanban Application Tracker** | ❌ | ✅ | ✅ |
| **Multi-Provider AI Router (18 Backends)**| ✅ | ✅ | ✅ |
| **PDF / DOCX / XLSX Dossier Exporter** | ❌ | ✅ | ✅ |
| **Local SQLite & Offline Guest Mode** | ✅ | ✅ | ✅ |

---

## 🤖 146 Agent Ecosystem ({num_divs} Divisions)

Career Agents manages **{num_agents} specialized AI agents** categorized across **{num_divs} divisions**. When a user sends a query to the Copilot, the routing engine tokenizes the input and compares it against agent names, descriptions, tags, and required skills to construct a matching scorecard:

```
Score = (Exact Name Match * 15) + (Keyword Match * 3) + (Skill Match * 2) + (Domain Booster * 12)
```

The top matching agents with score >= 5 are loaded dynamically, reading their raw Markdown prompt instructions from disk and appending them to the LLM system context.

### Division Summary Table

{divisions_str}

*For the complete agent registry, see [docs/AGENTS.md](./docs/AGENTS.md).*

---

## 🗺️ Curated Career Paths ({num_paths} Paths)

{paths_str}

---

## 🏢 Company Interview Tracks ({num_companies} Companies)

{companies_str}

---

## ⚡ Workflow Automation Pipelines ({num_workflows} Workflows)

{workflows_str}

---

## 🏗️ System Architecture & Data Flow

### 1. Web Application & AI Router Request Flow

```mermaid
sequenceDiagram
    participant User as User / Browser
    participant Client as Next.js 14 App Client
    participant Router as Multi-Provider AI Gateway
    participant LLM as AI Provider (Groq / Gemini / OpenAI / Claude)
    participant DB as Browser LocalStorage / SQLite / Postgres
    
    User->>Client: Send Copilot Query / Resume File
    Client->>Router: Forward Query + Active User Dossier
    Router->>Router: Match 146 Agent Registry & Compile System Prompt
    Router->>LLM: Dispatch Request with Fallback Chain
    LLM-->>Router: Stream Tokens via Server-Sent Events (SSE)
    Router-->>User: Render Real-Time Markdown & Code Output
    Client->>DB: Persist Session Metrics & Chat History
```

### 2. Model Context Protocol (MCP) Stdio Architecture

```mermaid
graph LR
    IDE[Developer Editor / Client] -->|JSON-RPC via stdio| MCPServer[mcp/server.js MCP Server]
    MCPServer -->|Read Registries| Registry[(agent-registry.json)]
    MCPServer -->|Execute Tools| CoreScripts[scripts/cli.js / Resume / GitHub Engine]
    CoreScripts -->|Structured Response Payload| IDE
```

---

## 🌐 AI Gateway & Supported Providers (18 Backends)

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
| **Fireworks AI** | ✅ Active | `llama-v3-70b-instruct` | ❌ No | ✅ Yes | ❌ |
| **Perplexity** | ✅ Active | `llama-3.1-sonar-large` | ❌ No | ✅ Yes | ❌ |
| **AI21 Labs** | ✅ Active | `jamba-1.5-large` | ❌ No | ✅ Yes | ❌ |
| **OpenAI Compatible**| ✅ Active | Custom loaded model | ✅ Yes | ✅ Yes | ✅ Yes |
| **Custom Endpoint** | ✅ Active | Custom loaded model | ✅ Yes | ✅ Yes | ✅ Yes |

---

## 🔌 Model Context Protocol (MCP) IDE Setup

Expose Career Agents tools directly to your AI code editors:

### Supported Editors
- **Cursor AI:** Add stdio command `node /absolute/path/to/Career-Agents/mcp/server.js` under Settings -> Features -> MCP.
- **Claude Desktop:** Add configuration block to `claude_desktop_config.json`.
- **VS Code (Continue Extension):** Add to `.continue/config.json`.
- **Windsurf / Aider / Roo Code / Bolt:** Configure stdio parameters to point to the local server script.

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

## ⚙️ Setup & Installation

### Prerequisites
- Node.js >= 18.0.0 (Node 20 LTS recommended)
- Git
- Python 3.9+ (required for data compilation scripts)

### Quick Start (Under 5 Minutes)
```bash
# 1. Clone the repository
git clone https://github.com/karthikrshet/Career-Agents.git
cd Career-Agents

# 2. Install web application dependencies
cd apps/web
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env and enter a random NEXTAUTH_SECRET (e.g. openssl rand -base64 32)

# 4. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) or [https://career-agents.vercel.app](https://career-agents.vercel.app) to access the platform.

### Database Modes
- **Guest Mode (Default):** Runs without configuring a database. All dossier metrics and sessions are saved locally in your browser using Zustand's `persist` storage manager.
- **Database Mode:** Set `DATABASE_URL` in `.env` to a PostgreSQL instance, then push the Prisma schema:
  ```bash
  npx prisma db push
  ```

---

## 💻 CLI Terminal Utilities

Run terminal commands using `scripts/cli.js`:

| Command | Arguments | Purpose | Example |
|---------|-----------|---------|---------|
| `list` | None | Lists all registered divisions and agents | `node scripts/cli.js list` |
| `doctor` | None | Performs environment and dependency health checks | `node scripts/cli.js doctor` |
| `score` | `<filepath>` | Scans PDF/Word resumes and outputs ATS score | `node scripts/cli.js score resume.pdf` |
| `review` | `<filepath>` | Performs weak bullet checking and verb audits | `node scripts/cli.js review resume.pdf` |
| `github` | `<username>` | Runs portfolio wrapped check for target profile | `node scripts/cli.js github torvalds` |
| `mock` | `<company> <mode>`| Starts a terminal mock interview drill | `node scripts/cli.js mock google behavioral` |
| `roadmap`| `<target>` | Generates study roadmaps in markdown formats | `node scripts/cli.js roadmap "staff engineer"` |

---

## 📡 REST API Reference

Career Agents exposes 10 REST endpoints. For request/response schemas, check [docs/API.md](./docs/API.md):

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

## 📋 Environment Variables

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
| `LOG_LEVEL` | No | `info` | Logging verbosity level on NextJS console. |

---

## 🔒 Enterprise Security & Privacy

- **Zero-Key Storage:** API keys entered by users are stored strictly in the browser's `localStorage` and never transmitted to database servers.
- **Session Protection:** NextAuth JWT tokens are signed using `NEXTAUTH_SECRET` and saved in secure HttpOnly, SameSite=Lax cookies.
- **Strict Headers:** Includes Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), and XSS safeguards.

---

## 🛠️ Development & Validation Pipeline

Before submitting changes, run the full validation suite:

```bash
# 1. Type Safety Check
npm run type-check

# 2. Lint Check
npm run lint

# 3. Generate Databases & Index Maps
python scripts/generate-data.py

# 4. Validate Schema Integrity & Links
python scripts/validate.py
```

---

## 🗺️ Roadmap & Releases

- **v10.0.0 (Founder Event Edition):** Immersive AI Career Operating System redesign and multi-provider fallback chains.
- **v12.0.0:** Monorepo package isolation and OpenAPI documentation layouts.
- **v14.0.0:** Enterprise OAuth authentication and RBAC roles.
- **v16.1.0 (Current Release):** 20-Language Coding Studio with 240+ problems, 20 ATS Resume Templates, 18 AI Provider Gateways, 146 Agent Ecosystem, and stdio MCP server.

---

## 🤝 Contributing & Sponsorship

We welcome contributions from software engineers around the world:
- **Branching:** Create features on branches prefixed with `feature/` or `fix/`.
- **Validation:** Pull Requests must pass `npm run type-check` and `python scripts/validate.py`.
- **Sponsors:** Support ongoing development on [GitHub Sponsors](https://github.com/sponsors/karthikrshet)!

---

## ❓ FAQ

**Q: Can I use Career Agents without an API key?**  
A: Yes! Resume ATS scoring, LeetCode coding practice, and GitHub profile audits run 100% offline. AI chat features use zero-key guest fallbacks out of the box.

**Q: Where are my API keys saved?**  
A: Keys are saved locally in your browser's `localStorage` and are never stored on any server.

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

<br />

<div align="center">

<h3>Let's elevate your tech career.</h3>

<p><b>[ <a href="https://career-agents.vercel.app">Live Vercel App</a> · <a href="https://github.com/karthikrshet/Career-Agents">GitHub Repository</a> · <a href="https://www.npmjs.com/package/career-agents">NPM Package</a> ]</b></p>

<sub>Career Agents Operating System · Synced via GitHub API &amp; Agent Registries · &copy; 2026</sub>

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
    generate_llm_indexes(agents, workflows_data, companies, paths, bundles)
    if not os.environ.get("CI"):
        build_merged_readme(agents, divisions_data, workflows_data, bundles, companies, paths)
    else:
        print("Skipping README compilation in CI environment.")
    print("All Career Agents databases generated successfully!")

if __name__ == "__main__":
    main()
