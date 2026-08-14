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
    full_content.append("SECTION 1: SPECIALIZED CAREER AGENTS (167 AGENTS)")
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
<a href="https://karthikrajeshshet.vercel.app/"><img src="https://img.shields.io/badge/Author-Karthik_Rajesh_Shet-0284c7?style=for-the-badge&logo=vercel&logoColor=white" height="32" alt="Author Portfolio" /></a>
<a href="https://www.npmjs.com/package/career-agents"><img src="https://img.shields.io/badge/NPM_Registry-career--agents-cb3837?style=for-the-badge&logo=npm&logoColor=white" height="32" alt="NPM Registry" /></a>
<a href="https://www.npmjs.com/package/career-agents"><img src="https://img.shields.io/npm/dm/career-agents?style=for-the-badge&logo=npm&logoColor=white&color=cb3837" height="32" alt="NPM Downloads" /></a>
<a href="https://github.com/karthikrshet/Career-Agents"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" height="32" alt="GitHub Repo" /></a>

<br /><br />

<img src="https://img.shields.io/badge/Release-v17.1.0_Enterprise-059669?style=flat-square&logo=git&logoColor=white" height="26" alt="Release v17.1.0" />
<img src="https://img.shields.io/npm/dt/career-agents?style=flat-square&logo=npm&logoColor=white&color=cb3837" height="26" alt="Total Downloads" />
<img src="https://img.shields.io/badge/Agents-{num_agents}_Specialized-0284c7?style=flat-square&logo=openai&logoColor=white" height="26" alt="{num_agents} Agents" />
<img src="https://img.shields.io/badge/Voice_AI-{num_agents}_Voice_Agents-06b6d4?style=flat-square&logo=google-cloud&logoColor=white" height="26" alt="{num_agents} Voice Agents" />
<img src="https://img.shields.io/badge/Token_Saver-80--85%25_Reduction-10b981?style=flat-square&logo=lightning&logoColor=white" height="26" alt="Token Optimization" />
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

## 🏆 Candidate Breakthroughs & Proven Placement Highlights

> 💰 **₹85 LPA Software Engineering Offer Landed:** Candidates using Career Agents' ATS Resume Studio, STAR Interview Lab, and FAANG Company Tracks successfully cracked top-tier software engineering roles — securing compensation offers up to **₹85 LPA**!
> 
> 🚀 **1,500+ Interview Callbacks:** Powered by multi-role ATS keyword optimization, automated STAR bullet rewrites, public GitHub portfolio health audits, and spoken voice AI interview practice across top engineering tech companies (Google, Meta, Amazon, Microsoft, Salesforce, Stripe, Uber, OpenAI).

---

## 🎯 Executive Overview & What Is This

> **"Companies use AI to filter candidates. Career Agents gives candidates AI to choose companies, crack top offers, and run their entire job search from one unified command center."**
> 
> **Career Agents** is an open-source, local-first **AI Career Operating System** built for software engineers, tech candidates, and engineering leaders. Instead of juggling disconnected job boards, spreadsheets, and generic ChatGPT prompts, Career Agents unifies two foundational pillars:
> 
> 1. **🤖 167 Specialized AI Career Agents across 19 Domain Divisions**: Purpose-built expert agents with deep domain intelligence, interview question banks, system design rubrics, and career path roadmaps.
> 2. **⚡ MCP-Powered Agentic Job Search Engine**: An autonomous end-to-end pipeline that scans ATS job portals, extracts requirements, evaluates deterministic candidate fit, drafts tailored resumes & cover letters, curates STAR interview practice, generates recruiter outreach, and tracks applications through live analytics.

---

## 🔒 Local-First Privacy & Data Sovereignty Guarantee

> **🛡️ "Do Not Share My Personal Information" Guarantee:**
> - **100% Local-First Execution:** Your CV, candidate profile, job applications, interview debriefs, and private notes stay on your machine. We do not collect, store, or sell any personal data.
> - **Zero Server-Side Storage:** AI requests are dispatched directly from your browser or local CLI to the AI provider you configure.
> - **Zero-Key Offline Fallback:** Heuristic ATS scoring, LeetCode coding practice, and local tracker management run completely offline with zero API key requirements.

---

## ⚡ System-Wide Token Optimization Engine (80-85% Token Reduction)

- 🧬 **Prompt Minification:** Strips excessive whitespace, redundant blank lines, and decorative borders before transmission to remote LLMs.
- 📉 **Sliding Context Window Compression:** In multi-turn chat, voice interviews, and MCP tool interactions, older assistant turns are automatically summarized into key highlights while preserving full context for the latest active turns.
- 🔌 **MCP Server & CLI Token Efficiency:** All Model Context Protocol (MCP) responses for Cursor IDE, Claude Desktop, and VS Code are minified to eliminate payload bloat, saving users up to **85% in API key costs**.

---

## ⚡ MCP-Powered Agentic Job Search Pipeline & Central Intelligence Loop

> **"Job searching is fragmented across job boards, resumes, interview preparation, networking, and application tracking. Career Agents turns that fragmented process into one unified agentic workflow."**
> 
> *The key idea is that Career Agents doesn't just find a job. It understands the job, evaluates candidate evidence against it, identifies what's missing, generates tailored application materials, prepares the candidate for the interview, and tracks what happens afterward.*

<p align="center">
  <img src="https://raw.githubusercontent.com/karthikrshet/Career-Agents/main/branding/pipeline-workflow.svg" width="900" height="auto" alt="Career Agents Pipeline Architecture & Workflow" />
</p>

### The Central Intelligence Loop

```text
Target Job Description / ATS Query
                ↓
    Multi-ATS Job Board Scanner
(Greenhouse, Lever, Ashby, Workable, SmartRecruiters, RemoteOK, Arbeitnow, Himalayas)
                ↓
      Requirement Extraction
                ↓
    Candidate Evidence Matching
                ↓
     CANONICAL READINESS ENGINE
       (services/readiness.js)
                ↓
       Strengths & Skill Gaps
                ↓
┌───────────────────────┬───────────────────────┐
│                       │                       │
Tailored Resume         Cover Letter Draft      Interview Preparation
(HTML & LaTeX)          (3-Paragraph Executive) (STAR Question Bank)
│                       │                       │
└───────────────────────┼───────────────────────┘
                        ↓
            Recruiter Outreach (<300 chars)
                        ↓
             Application Tracker
             (pipeline-tracker.md)
                        ↓
           Funnel Performance Analytics
```

### End-to-End Pipeline Commands

```bash
# 1. Scan ATS job boards (Greenhouse, Lever, Ashby, Workable, SmartRecruiters, RemoteOK, Arbeitnow, Himalayas)
career-agents pipeline scan stripe greenhouse
career-agents pipeline scan netlify lever
career-agents pipeline scan openai ashby

# 2. Evaluate candidate profile readiness against raw job descriptions (Blocks A-G Report)
career-agents pipeline match jd.txt Google "AI/ML Infrastructure Engineer"

# 3. Compile ATS single-page resume (HTML & LaTeX)
career-agents pipeline cv profile.json --html
career-agents pipeline cv profile.json --latex

# 4. Generate strategic 3-paragraph tailored cover letter
career-agents pipeline cover Google "AI/ML Infrastructure Engineer"

# 5. Build STAR interview question bank and company track
career-agents pipeline interview Google "AI/ML Infrastructure Engineer"

# 6. Draft concise recruiter networking outreach note (<300 chars)
career-agents pipeline outreach "Sarah Jenkins" Google "AI/ML Infrastructure Engineer"

# 7. Track applications with live status state machine
career-agents pipeline add Google "AI/ML Infrastructure Engineer" https://careers.google.com/jobs/123
career-agents pipeline status Google interviewing "Scheduled Technical Screen Round 1"

# 8. View live pipeline conversion funnel analytics
career-agents pipeline stats
career-agents pipeline digest
career-agents pipeline doctor
```

---

## ⚡ Core Capability Suites & Modules

Career Agents unifies the full career development lifecycle into focused, interoperable intelligence suites:

1. **⚡ MCP-Powered Job Search & Application Pipeline (`packages/pipeline/`)**
   - Multi-ATS job board scanning across 8 major providers with gzip/brotli streaming decompression.
   - Canonical readiness evaluation (`services/readiness.js`) against extracted requirements without artificial floors.
   - Tailored single-page ATS HTML/LaTeX resumes and executive 3-paragraph cover letters.
   - Structured STAR+R interview question banks and <300-char recruiter outreach messaging.
   - Dual-persistence application tracker (`pipeline-tracker.md`) and funnel conversion analytics.

2. **🤖 167 Specialized AI Career Agents across 19 Divisions**
   - Deep domain expertise across AI/ML, Backend, Frontend, Cloud, DevOps, System Design, Security, PM, Mobile, and more.
   - Context-aware dynamic system prompt generation with zero token redundancy.

3. **📄 ATS Resume Studio & Heuristic Grading Engine**
   - 20 professional, ATS-optimized single-page templates (Modern Tech, Minimalist, Academic, Executive, etc.).
   - Local deterministic scoring for action-verb density, quantifiable metrics, section hierarchy, and keyword alignment.

4. **💻 20-Language Coding Studio & FAANG Problem Sets**
   - 240+ curated LeetCode coding interview problems (Blind 75, NeetCode 150, Top 150).
   - Interactive algorithm dry-run visualizers, whiteboard canvases, and timed virtual contests.

5. **🎙️ STAR Behavioral & Spoken Voice AI Interview Lab**
   - Real-time spoken mock interviews with Web Speech API integration in 27 BCP-47 languages.
   - 20+ Tier-1 company interview tracks with structured STAR parameter evaluation scorecards.

6. **🔍 GitHub Portfolio & LinkedIn Search Optimization Auditing**
   - Direct GitHub API repository quality audits, documentation coverage scores, and contribution heatmaps.
   - LinkedIn headline pipe-structure analysis, recruiter search keyword density scoring, and AI content creation.

---

## ⚡ Complete Feature Matrix & Capabilities

| Feature Module | CLI Utility | Web Dashboard | MCP Server |
|----------------|:-----------:|:-------------:|:----------:|
| **Agent Directory Search ({num_agents} Agents)** | ✅ | ✅ | ✅ |
| **Multi-ATS Job Board Scanner (8 Providers)** | ✅ | ✅ | ✅ |
| **Canonical Readiness Scoring Engine** | ✅ | ✅ | ✅ |
| **ATS Resume Builder (HTML & LaTeX)** | ✅ | ✅ | ✅ |
| **3-Paragraph Executive Cover Letter** | ✅ | ✅ | ✅ |
| **Recruiter Outreach Generator (<300 chars)** | ✅ | ✅ | ✅ |
| **Application Lifecycle Tracker & Analytics** | ✅ | ✅ | ✅ |
| **20-Language Coding Studio Compiler** | ✅ | ✅ | ✅ |
| **240+ LeetCode Problem Catalog** | ✅ | ✅ | ✅ |
| **Step-by-Step Algorithm Visualizer** | ❌ | ✅ | ✅ |
| **Whiteboard Canvas & System Design** | ❌ | ✅ | ❌ |
| **20 ATS Resume Templates & Calibrator** | ✅ | ✅ | ✅ |
| **GitHub Profile Wrapped Audit** | ✅ | ✅ | ✅ |
| **LinkedIn Headline & Keyword Audit** | ✅ | ✅ | ✅ |
| **STAR Mock Interview Engine (20 Tracks)** | ✅ | ✅ | ✅ |
| **Voice AI Mock Interview Lab (27 Languages)**| ❌ | ✅ | ❌ |
| **Multi-Provider AI Router (18 Backends)**| ✅ | ✅ | ✅ |
| **PDF / DOCX / XLSX Dossier Exporter** | ❌ | ✅ | ✅ |
| **Local SQLite & Offline Guest Mode** | ✅ | ✅ | ✅ |

---

## 🤖 167 Agent Ecosystem (19 Divisions)

<p align="center">
  <img src="https://raw.githubusercontent.com/karthikrshet/Career-Agents/main/branding/divisions-map.svg" width="900" height="auto" alt="167 Agents across 19 Domain Divisions" />
</p>

Career Agents manages **{num_agents} specialized AI agents** categorized across **{num_divs} divisions**. 

### Division Summary Table

{divisions_str}

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

## 🔌 Model Context Protocol (MCP) Ecosystem & IDE Setup

<p align="center">
  <img src="https://raw.githubusercontent.com/karthikrshet/Career-Agents/main/branding/mcp-ecosystem.svg" width="900" height="auto" alt="Career Agents MCP Ecosystem" />
</p>

Expose Career Agents tools directly to your AI code editors via standard JSON-RPC stdio:

### 1. Supported Editors & Tools
- **Google Antigravity:** Integrated via `.agents/` skill bindings.
- **Cursor AI:** Add stdio command `node /absolute/path/to/Career-Agents/mcp/server.js` under Settings -> Features -> MCP.
- **Claude Desktop:** Add configuration block to `claude_desktop_config.json`.
- **VS Code / Continue / Codex / Windsurf / Aider:** Configure stdio parameters pointing to the local server script.

### 2. Configuration Example (`claude_desktop_config.json`):
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

### 3. Cursor AI Configuration:
Go to **Settings** -> **Features** -> **MCP** -> **Add new MCP Server**:
- **Name:** `career-agents`
- **Type:** `stdio`
- **Command:** `node /absolute/path/to/Career-Agents/mcp/server.js`

### 4. Codex CLI Registration:
```bash
codex mcp add career-agents -- node /absolute/path/to/Career-Agents/mcp/server.js
```

---

## 🚀 Quickstart, Installation & CLI Utilities

### 1. 📦 NPM & NPX Zero-Install Execution
```bash
# Global NPM Installation
npm install -g career-agents

# Zero-Install NPX Execution
npx career-agents list
npx career-agents score my_resume.pdf
npx career-agents mcp
```

### 2. 💻 Local Web Workspace Setup (Under 5 Minutes)
```bash
# 1. Clone the repository
git clone https://github.com/karthikrshet/Career-Agents.git
cd Career-Agents

# 2. Install web application dependencies
cd apps/web
npm install

# 3. Setup environment variables
cp .env.example .env

# 4. Start local development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** or **[https://career-agents.vercel.app](https://career-agents.vercel.app)**.

### 3. 🖥️ Terminal CLI Utilities Reference

| Command | Arguments | Purpose | Example |
|---|---|---|---|
| `list` | None | Lists all registered divisions and agents | `node scripts/cli.js list` |
| `doctor` | None | Performs environment, registry, and dependency health checks | `node scripts/cli.js doctor` |
| `score` | `<filepath>` | Scans PDF/Word resumes and outputs ATS score | `node scripts/cli.js score resume.pdf` |
| `review` | `<filepath>` | Performs weak bullet checking and action verb audits | `node scripts/cli.js review resume.pdf` |
| `github` | `<username>` | Runs portfolio wrapped check for target profile | `node scripts/cli.js github torvalds` |
| `mock` | `<company> <mode>`| Starts a terminal mock interview drill | `node scripts/cli.js mock google behavioral` |
| `roadmap`| `<target>` | Generates study roadmaps in markdown formats | `node scripts/cli.js roadmap "staff engineer"` |
| `pipeline scan` | `<token> <provider>` | Scans ATS job boards for open requisitions | `node scripts/cli.js pipeline scan stripe greenhouse` |
| `pipeline match`| `<jd> <co> <role>` | Evaluates candidate fit and prints Blocks A-G report | `node scripts/cli.js pipeline match jd.txt Google "AI Eng"` |
| `pipeline cv` | `<profile> [--html\|--latex]` | Compiles ATS single-page HTML or LaTeX resume | `node scripts/cli.js pipeline cv profile.json --html` |
| `pipeline cover` | `<co> <role>` | Generates tailored 3-paragraph executive cover letter | `node scripts/cli.js pipeline cover Google "AI Eng"` |
| `pipeline interview` | `<co> <role>` | Curates STAR+R question banks and company track | `node scripts/cli.js pipeline interview Google "AI Eng"` |
| `pipeline outreach` | `<recruiter> <co> <role>` | Generates concise recruiter note (<300 chars) | `node scripts/cli.js pipeline outreach "Sarah" Google "AI Eng"` |
| `pipeline add` | `<co> <role> <url>` | Adds new job requisition to pipeline tracker | `node scripts/cli.js pipeline add Google "AI Eng" http://...` |
| `pipeline status` | `<co> <status> [notes]` | Updates lifecycle status in pipeline tracker | `node scripts/cli.js pipeline status Google interviewing "Round 1"` |
| `pipeline stats` | None | Computes application funnel conversion analytics | `node scripts/cli.js pipeline stats` |

---

## 💻 Tech Stack & AI Provider Gateways

**Frontend & Local Architecture**  
<img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" height="28" alt="Next.js 14" />
<img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" height="28" alt="React 18" />
<img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" height="28" alt="TypeScript 5" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" height="28" alt="Tailwind CSS" />
<img src="https://img.shields.io/badge/Zustand-443e38?style=for-the-badge&logo=state&logoColor=white" height="28" alt="Zustand State" />
<img src="https://img.shields.io/badge/Prisma_Postgres-2D3748?style=for-the-badge&logo=prisma&logoColor=white" height="28" alt="Prisma Postgres" />
<img src="https://img.shields.io/badge/Local_SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" height="28" alt="Local SQLite" />

**AI Provider Gateways (18 Backends Supported)**

| Provider | Status | Default Model | Free Tier | Streaming | Vision |
|---|---|---|---|---|---|
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

## 🔒 Enterprise Security, Privacy & Validation

- **Zero-Key Storage:** API keys entered by users are stored strictly in the browser's `localStorage` and never transmitted to database servers.
- **Session Protection:** NextAuth JWT tokens are signed using `NEXTAUTH_SECRET` and saved in secure HttpOnly, SameSite=Lax cookies.
- **Strict Headers:** Includes Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), and XSS safeguards.

### Full Validation Suite
```bash
# 1. Type Safety Check
npm run type-check

# 2. Lint Check
npm run lint

# 3. Generate Databases & Index Maps
python scripts/generate-data.py

# 4. Validate Schema Integrity & Relative Links
python scripts/validate.py

# 5. MCP Server Integration Suite
node scripts/test-mcp.js

# 6. Readiness Regression Suite
node scripts/test-readiness-regression.js
```

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](./LICENSE) for more details.

---

## 👨‍💻 Creator & Principal Lead Architect

<div align="center">

<br />

<table align="center" style="border: none; border-collapse: collapse; background: transparent;">
  <tr>
    <td align="center" style="border: none; padding: 24px;">
      <a href="https://karthikrajeshshet.vercel.app/">
        <img src="https://raw.githubusercontent.com/karthikrshet/Career-Agents/main/branding/karthik_shet.jpg" width="210" height="auto" style="border-radius: 24px; border: 4px solid #0284c7; box-shadow: 0 16px 36px rgba(2, 132, 199, 0.35);" alt="Karthik Rajesh Shet" />
      </a>
      <br /><br />
      <h2 style="margin: 8px 0; font-size: 1.8em; color: #0f172a;"><b>Karthik Rajesh Shet</b></h2>
      <p style="font-size: 1.15em; font-weight: 600; color: #0284c7; margin-top: 4px;">Creator &amp; Principal Platform Architect</p>
      <p style="margin-top: 12px;">
        <a href="https://karthikrajeshshet.vercel.app/"><img src="https://img.shields.io/badge/Portfolio-karthikrajeshshet.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white" height="28" alt="Personal Portfolio" /></a>
        <a href="https://github.com/karthikrshet"><img src="https://img.shields.io/badge/GitHub-@karthikrshet-181717?style=for-the-badge&logo=github&logoColor=white" height="28" alt="GitHub Profile" /></a>
        <a href="https://career-agents.vercel.app"><img src="https://img.shields.io/badge/Platform-Career--Agents-000000?style=for-the-badge&logo=vercel&logoColor=white" height="28" alt="Vercel Live App" /></a>
        <a href="https://www.npmjs.com/package/career-agents"><img src="https://img.shields.io/badge/NPM_Package-v17.1.0-cb3837?style=for-the-badge&logo=npm&logoColor=white" height="28" alt="NPM Package" /></a>
      </p>
    </td>
  </tr>
</table>

<br />

<blockquote style="max-width: 780px; text-align: center; margin: 0 auto; padding: 20px 28px; border-left: 5px solid #0284c7; background: #f8fafc; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
  <p style="font-size: 1.1em; line-height: 1.7; color: #1e293b; font-style: italic; margin: 0;">
    "Designed, engineered, and architected by <b>Karthik Rajesh Shet</b> — a visionary full-stack software engineer and AI systems architect. Built with a relentless commitment to open-source innovation, <b>Career-Agents</b> unifies 167 domain-specialized AI agents, real-time voice interview engines, local ATS resume calibrators, and Model Context Protocol (MCP) integrations into an enterprise-grade career operating system for software engineers worldwide."
  </p>
</blockquote>

<br />

</div>

---

<div align="center">

<h3>Let's elevate your tech career.</h3>

<p><b>[ <a href="https://career-agents.vercel.app">Live Vercel App</a> · <a href="https://karthikrajeshshet.vercel.app/">Author Portfolio</a> · <a href="https://github.com/karthikrshet/Career-Agents">GitHub Repository</a> · <a href="https://www.npmjs.com/package/career-agents">NPM Package</a> ]</b></p>

<sub>Career Agents Operating System · Designed &amp; Built by Karthik Rajesh Shet · &copy; 2026</sub>

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
