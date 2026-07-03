#!/usr/bin/env python3
import json
import os
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REGISTRY_PATH = ROOT / "agent-registry.json"

DIVISION_SKILLS = {
    "career": ["Career Strategy", "Professional Development", "Career Growth", "Career Milestones"],
    "company-interviews": ["Interview Preparation", "Technical Coding", "System Design", "Behavioral Interview"],
    "engineering": ["Software Engineering", "System Design", "Architecture", "Code Review"],
    "interview": ["Interviewing", "Behavioral Questions", "Mock Practice", "System Design"],
    "networking": ["Professional Networking", "LinkedIn Strategy", "Outreach", "Cold Emailing"],
    "projects": ["Project Management", "Technical Writing", "Academic Research", "Viva Defense"],
    "resume": ["Resume Writing", "ATS Optimization", "STAR/XYZ Metrics", "Portfolio Review"],
    "startup": ["Product Management", "MVP Scoping", "Market Research", "Growth Strategy"],
    "ai-engineering": ["Machine Learning", "LLMs", "RAG Architecture", "Prompt Engineering"],
    "cloud": ["Cloud Infrastructure", "Terraform", "Kubernetes", "AWS/Azure/GCP"],
    "cybersecurity": ["Application Security", "IAM", "Vulnerability Assessment", "Incident Response"],
    "open-source": ["Open Source Contribution", "Git Workflows", "Community Building", "Documentation"],
    "data-engineering": ["Data Pipelines", "ETL/ELT", "Data Warehousing", "Database Optimization"],
    "devrel": ["Developer Relations", "Technical Content", "Community Engagement", "API Adoption"],
    "job-automation": ["Job Scraping", "Notion Databases", "Pipeline Tracking", "Cold Outreach"],
    "faang": ["Distributed Systems", "Scaling", "DSA", "FAANG Interview"],
    "ai-business": ["AI Unit Economics", "SaaS MVP", "Semantic Caching", "Defensibility"],
    "gtm": ["Outreach Automation", "CRM Sync", "Clay Workspaces", "Sales Pipeline"],
    "freelancing": ["Freelancing", "Productized Services", "Client Acquisition", "Retainers"]
}

DIVISION_WORKFLOWS = {
    "career": ["fresher-placement", "internship-hunt"],
    "company-interviews": ["faang-preparation"],
    "engineering": ["technical-interview-week"],
    "interview": ["technical-interview-week", "hr-interview-week"],
    "networking": ["linkedin-growth"],
    "projects": ["fresher-placement"],
    "resume": ["ats-optimization"],
    "startup": ["linkedin-growth", "remote-job-hunt"],
    "ai-engineering": ["technical-interview-week"],
    "cloud": ["technical-interview-week"],
    "cybersecurity": ["technical-interview-week"],
    "open-source": ["linkedin-growth"],
    "data-engineering": ["technical-interview-week"],
    "devrel": ["linkedin-growth"],
    "job-automation": ["remote-job-hunt"],
    "faang": ["faang-preparation"],
    "ai-business": ["remote-job-hunt"],
    "gtm": ["remote-job-hunt"],
    "freelancing": ["remote-job-hunt"]
}

COMPANIES_MAP = {
    "google": ["Google"],
    "amazon": ["Amazon"],
    "meta": ["Meta"],
    "microsoft": ["Microsoft"],
    "openai": ["OpenAI"],
    "stripe": ["Stripe"],
    "atlassian": ["Atlassian"],
    "netflix": ["Netflix"],
    "uber": ["Uber"],
    "oracle": ["Oracle"],
    "salesforce": ["Salesforce"],
    "adobe": ["Adobe"]
}

def get_hash_int(s: str) -> int:
    return int(hashlib.md5(s.encode("utf-8")).hexdigest(), 16)

def enrich():
    if not REGISTRY_PATH.exists():
        print(f"Error: {REGISTRY_PATH} not found.")
        return

    with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    agents = data.get("agents", [])
    print(f"Loaded {len(agents)} agents for enrichment.")

    # Group agents by division to calculate related agents
    div_to_agents = {}
    for agent in agents:
        div = agent.get("division", "")
        if div not in div_to_agents:
            div_to_agents[div] = []
        div_to_agents[div].append(agent.get("id"))

    for agent in agents:
        aid = agent.get("id", "")
        div = agent.get("division", "")
        tags = [t.lower() for t in agent.get("tags", [])]
        desc = agent.get("description", "").lower()

        # 1. Difficulty
        if "interview-coach" in aid or "system-design" in aid or "architect" in aid or "specialist" in aid:
            difficulty = "Hard"
        elif "formatting" in aid or "template" in aid or "reviewer" in aid or "writer" in aid:
            difficulty = "Easy"
        else:
            difficulty = "Medium"

        # 2. Experience Level
        if any(x in tags or x in desc for x in ["executive", "director", "vp", "c-suite"]):
            exp_level = "Executive"
        elif any(x in tags or x in desc for x in ["senior", "lead", "architect", "principal"]):
            exp_level = "Senior"
        elif any(x in tags or x in desc for x in ["fresher", "graduate", "student", "intern", "entry"]):
            exp_level = "Entry"
        else:
            exp_level = "Mid"

        # 3. Career Stage
        if "career" in div or any(x in tags or x in desc for x in ["transition", "pivot"]):
            stage = "Transition"
        elif div in ["resume", "networking", "interview", "job-automation"] or "job-search" in aid:
            stage = "Job Search"
        elif any(x in tags or x in desc for x in ["leadership", "executive", "manager"]):
            stage = "Leadership"
        else:
            stage = "Growth"

        # 4. Industry
        if div in ["engineering", "ai-engineering", "cloud", "cybersecurity", "data-engineering", "devrel", "faang"]:
            industry = "Tech"
        else:
            industry = "All"

        # 5. Skills
        skills = DIVISION_SKILLS.get(div, ["Career Intelligence"])
        # Supplement from tags
        for t in agent.get("tags", []):
            if len(t) > 3 and t.capitalize() not in skills and len(skills) < 6:
                skills.append(t.capitalize())

        # 6. Companies
        companies = []
        for key, val in COMPANIES_MAP.items():
            if key in aid:
                companies = val
                break

        # 7. Related Agents
        siblings = div_to_agents.get(div, [])
        related_agents = [s for s in siblings if s != aid]
        # Pick up to 3 deterministically based on hash
        h_val = get_hash_int(aid)
        if len(related_agents) > 3:
            # Sort to keep deterministic, then slice
            related_agents.sort()
            idx = h_val % len(related_agents)
            related_agents = [related_agents[(idx + i) % len(related_agents)] for i in range(3)]

        # 8. Related Workflows
        related_workflows = DIVISION_WORKFLOWS.get(div, [])

        # 9. Popularity Score
        popularity_score = 60 + (h_val % 40) # score between 60 and 99

        # Add fields
        agent["difficulty"] = difficulty
        agent["experience_level"] = exp_level
        agent["career_stage"] = stage
        agent["industry"] = industry
        agent["skills"] = skills
        agent["companies"] = companies
        agent["related_agents"] = related_agents
        agent["related_workflows"] = related_workflows
        agent["popularity_score"] = popularity_score

    # Write back
    data["agents"] = agents
    with open(REGISTRY_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print("Successfully enriched agent-registry.json!")

if __name__ == "__main__":
    enrich()
