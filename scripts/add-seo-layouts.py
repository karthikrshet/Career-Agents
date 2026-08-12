#!/usr/bin/env python3
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APP_DIR = ROOT / "apps" / "web" / "src" / "app"

PAGES_CONFIG = {
    "github": {
        "title": "GitHub Portfolio Analyzer & Open Source Audit — Career Agents",
        "description": "AI-powered GitHub profile & repository auditor. Evaluate commit activity, code quality, README standards, star metrics, and technical contributions for engineering roles.",
        "keywords": ["github portfolio analyzer", "github profile audit", "github score", "repository code quality", "open source portfolio", "developer github profile", "github stars forks", "readme optimizer"],
        "path": "/github",
        "category": "Developer Tools & Portfolio Engineering",
        "ai_instruction": "GitHub Analyzer scores developer portfolios, commit frequency, README quality, and repository architecture using AI.",
    },
    "linkedin": {
        "title": "LinkedIn Profile Optimizer & AI Headline Generator — Career Agents",
        "description": "Optimize your LinkedIn headline, about summary, experience bullets, and skills endorsement for maximum recruiter outreach and high-volume candidate search results.",
        "keywords": ["linkedin optimizer", "linkedin headline generator", "linkedin profile score", "recruiter search optimization", "linkedin summary AI", "career brand optimizer"],
        "path": "/linkedin",
        "category": "Career Branding & Professional Networking",
        "ai_instruction": "LinkedIn Optimizer enhances professional profiles for recruiter boolean searches and personal branding.",
    },
    "interview": {
        "title": "AI Mock Interview Practice Lab & STAR Question Coach — Career Agents",
        "description": "Practice real technical, behavioral, and system design interviews with 167 specialized AI interviewers. Get instant feedback on STAR answer structure and metric impact.",
        "keywords": ["AI mock interview", "technical interview practice", "behavioral interview prep", "system design mock interview", "STAR interview coach", "FAANG interview practice"],
        "path": "/interview",
        "category": "Interview Preparation & Skill Assessment",
        "ai_instruction": "Interview Lab provides interactive mock interviews and real-time STAR framework scoring.",
    },
    "copilot": {
        "title": "AI Career Copilot & Real-Time Strategy Assistant — Career Agents",
        "description": "Chat with an AI career copilot trained on 167 specialized agent personas for salary negotiation, job search strategy, technical resume rewrites, and promotion planning.",
        "keywords": ["career copilot", "AI career assistant", "career strategy chat", "salary negotiation coach", "tech career advisor", "career path mentor AI"],
        "path": "/copilot",
        "category": "Career Copilot & Strategy",
        "ai_instruction": "Career Copilot offers interactive career advice, salary negotiation guidance, and strategic planning.",
    },
    "tracker": {
        "title": "Job Application Tracker & Interview Pipeline Kanban — Career Agents",
        "description": "Streamline your job search with a real-time application tracker, interview stage pipeline, salary offer analytics, and automated follow-up reminders.",
        "keywords": ["job tracker", "application pipeline kanban", "interview status manager", "salary offer tracker", "job search management", "job application logger"],
        "path": "/tracker",
        "category": "Job Search Productivity & Management",
        "ai_instruction": "Job Tracker manages application statuses, interview scheduling, and offer evaluations.",
    },
    "prephub": {
        "title": "Company Interview Prep Hub & FAANG Question Bank — Career Agents",
        "description": "Company-specific interview prep guides for Google, Amazon, Meta, Microsoft, Apple, Netflix, Uber, and top tech startups. Practice actual interview questions.",
        "keywords": ["company interview prep", "FAANG interview questions", "Google interview prep", "Amazon leadership principles prep", "Meta system design questions"],
        "path": "/prephub",
        "category": "Company Tech Prep",
        "ai_instruction": "Prep Hub provides company-tailored interview tracks and question banks for top tech organizations.",
    },
    "reports": {
        "title": "Career Readiness Intelligence Reports & Diagnostics — Career Agents",
        "description": "Comprehensive career diagnostics aggregating ATS resume score, GitHub health, LinkedIn optimization, and interview readiness into an actionable PDF report.",
        "keywords": ["career report", "career score diagnostic", "resume github linkedin report", "career readiness assessment", "tech career analytics"],
        "path": "/reports",
        "category": "Career Analytics & Diagnostics",
        "ai_instruction": "Reports generates holistic candidate evaluations combining resume, GitHub, and interview metrics.",
    },
    "marketplace": {
        "title": "167 AI Career Agent Marketplace & MCP Registry — Career Agents",
        "description": "Explore 167 specialized AI career agents across Resume Engineering, Tech Interviewing, System Design, Salary Negotiation, and Executive Career Strategy.",
        "keywords": ["AI agent marketplace", "career agents registry", "specialized career AI", "MCP agent tools", "prompt engineering career agents"],
        "path": "/marketplace",
        "category": "AI Agent Ecosystem",
        "ai_instruction": "Marketplace catalogues 167 specialized career agents available for web app and MCP integration.",
    },
    "mcp": {
        "title": "Model Context Protocol (MCP) Integration & AI Client Setup — Career Agents",
        "description": "Connect 167 Career Agents directly to Cursor IDE, Claude Desktop, VS Code, and LLM clients using the open Model Context Protocol (MCP).",
        "keywords": ["MCP model context protocol", "Cursor IDE career agent", "Claude Desktop MCP tool", "VS Code career AI extension", "AI agent protocol"],
        "path": "/mcp",
        "category": "Protocol & Developer Integration",
        "ai_instruction": "MCP documentation details how to connect Career Agents to external IDEs and AI desktop apps.",
    },
    "about": {
        "title": "About Career Agents — The Open-Source AI Career OS",
        "description": "Learn about Career Agents, our mission to democratize elite career coaching using 167 specialized AI agents, and our open-source AI architecture.",
        "keywords": ["about career agents", "open source career OS", "AI career coaching mission", "Karthik R Shet", "career technology platform"],
        "path": "/about",
        "category": "Company & Mission",
        "ai_instruction": "About page details the mission, architecture, and team behind the open-source Career Agents platform.",
    },
    "credits": {
        "title": "Platform Credits, Open Source Licenses & Changelog — Career Agents",
        "description": "View open source contributions, underlying open-source technologies, multi-provider AI model router credits, and platform release notes.",
        "keywords": ["career agents credits", "open source license MIT", "tech stack credits", "AI model router", "platform changelog"],
        "path": "/credits",
        "category": "Platform & Legal Credits",
        "ai_instruction": "Credits page attributes open source libraries, model providers, and platform maintainers.",
    },
    "settings": {
        "title": "Account Settings, AI Model Gateway & Preferences — Career Agents",
        "description": "Configure multi-provider AI gateways (Groq, Gemini, OpenAI, Claude, Ollama), customize theme preferences, manage API keys, and update profile metrics.",
        "keywords": ["settings", "AI gateway configuration", "Groq API key settings", "Gemini Claude OpenAI setup", "career profile preferences"],
        "path": "/settings",
        "category": "App Settings & Configuration",
        "ai_instruction": "Settings page allows users to configure LLM API keys, provider priorities, and application defaults.",
    },
    "blog": {
        "title": "Engineering Career Insights & ATS Optimization Blog — Career Agents",
        "description": "Expert insights on passing ATS resume filters, cracking FAANG system design interviews, optimizing GitHub portfolios, and negotiating tech compensation.",
        "keywords": ["career blog", "ATS optimization tips", "system design interview guide", "tech salary negotiation blog", "engineer career growth"],
        "path": "/blog",
        "category": "Educational Content & Guides",
        "ai_instruction": "Blog publishes articles on resume engineering, technical interviews, and software career growth.",
    },
    "careers": {
        "title": "Join Career Agents — Open Roles & Contributions",
        "description": "Explore opportunities to join or contribute to Career Agents. Help us build the open-source AI career operating system.",
        "keywords": ["career agents jobs", "open source contributions", "AI developer jobs", "career OS careers", "remote engineering jobs"],
        "path": "/careers",
        "category": "Company Careers",
        "ai_instruction": "Careers page lists open source contribution guides and opportunities at Career Agents.",
    },
    "changelog": {
        "title": "Platform Release Notes & Agent Registry Changelog — Career Agents",
        "description": "Stay up to date with new AI agents, feature releases, MCP protocol improvements, and multi-provider model router updates.",
        "keywords": ["platform changelog", "career agents release notes", "AI model updates", "agent registry updates", "new career tools"],
        "path": "/changelog",
        "category": "Product Updates",
        "ai_instruction": "Changelog logs all product versions, new agent releases, and platform enhancements.",
    },
    "community": {
        "title": "Developer & Candidate Community — Career Agents",
        "description": "Connect with engineers, hiring managers, and career coaches in the Career Agents open-source community on GitHub and Discord.",
        "keywords": ["tech career community", "career agents discord", "github career discussions", "engineer networking group", "peer resume feedback"],
        "path": "/community",
        "category": "Community & Networking",
        "ai_instruction": "Community page connects candidates with open source contributors and peer interview groups.",
    },
    "contact": {
        "title": "Contact Career Agents Team & Enterprise Support",
        "description": "Get in touch with the Career Agents core maintainers for technical support, enterprise inquiries, partnership opportunities, or feedback.",
        "keywords": ["contact career agents", "technical support", "enterprise inquiry", "Karthik R Shet contact", "career OS support"],
        "path": "/contact",
        "category": "Support & Inquiries",
        "ai_instruction": "Contact page provides support channels and enterprise inquiry options.",
    },
    "cookies": {
        "title": "Cookie Policy & Privacy Preferences — Career Agents",
        "description": "Learn about Career Agents cookie usage, local storage persistence, telemetric privacy controls, and data protection practices.",
        "keywords": ["cookie policy", "privacy preferences", "local storage policy", "data protection", "telemetry settings"],
        "path": "/cookies",
        "category": "Legal & Privacy",
        "ai_instruction": "Cookies page details local storage and privacy preferences.",
    },
    "dashboard": {
        "title": "Career Studio Dashboard & Overview Workspace — Career Agents",
        "description": "Your centralized career command center — monitor career score, view active resume ATS audits, track job applications, and launch AI copilot sessions.",
        "keywords": ["career dashboard", "career intelligence workspace", "job application overview", "resume score widget", "career score dashboard"],
        "path": "/dashboard",
        "category": "Productivity Workspace",
        "ai_instruction": "Dashboard provides an aggregated view of candidate metrics, active tasks, and quick tools.",
    },
    "demo": {
        "title": "Live Interactive Platform Demo — Career Agents",
        "description": "Experience a live interactive walk-through of ATS resume scoring, GitHub portfolio auditing, LinkedIn optimization, and AI mock interviews.",
        "keywords": ["career agents demo", "live ATS score test", "AI resume test drive", "interactive platform demo", "career OS preview"],
        "path": "/demo",
        "category": "Platform Preview",
        "ai_instruction": "Demo page allows users to test platform tools interactively.",
    },
    "docs": {
        "title": "Developer Documentation & API Specifications — Career Agents",
        "description": "Comprehensive developer documentation for Career Agents, including agent registries, MCP setup, API router integration, and schema validation.",
        "keywords": ["developer documentation", "career agents API docs", "MCP setup guide", "agent registry schema", "AI router integration"],
        "path": "/docs",
        "category": "Developer Documentation",
        "ai_instruction": "Docs provides technical specifications for integrating Career Agents.",
    },
    "dpa": {
        "title": "Data Processing Addendum (DPA) — Career Agents",
        "description": "Review Career Agents Data Processing Addendum for enterprise data security, GDPR compliance, local storage options, and data privacy safeguards.",
        "keywords": ["data processing addendum", "DPA", "GDPR compliance", "enterprise data security", "privacy safeguards"],
        "path": "/dpa",
        "category": "Legal & Compliance",
        "ai_instruction": "DPA details data processing and compliance standards.",
    },
    "enterprise": {
        "title": "Enterprise Career Intelligence & Organization Solutions — Career Agents",
        "description": "Deploy Career Agents across universities, bootcamps, outplacement agencies, and engineering teams. Self-hosted and local LLM options available.",
        "keywords": ["enterprise career platform", "university career OS", "bootcamp career tools", "outplacement AI platform", "self-hosted career OS"],
        "path": "/enterprise",
        "category": "Enterprise Solutions",
        "ai_instruction": "Enterprise page details organizational deployments for universities and bootcamps.",
    },
    "features": {
        "title": "Platform Features & AI Agent Capabilities — Career Agents",
        "description": "Discover all features of Career Agents: 167 specialized AI agents, multi-role ATS resume scoring, STAR bullet rewrites, GitHub health audits, and MCP tools.",
        "keywords": ["career agents features", "AI resume features", "STAR bullet optimizer", "multi-role ATS score", "AI mock interview features"],
        "path": "/features",
        "category": "Platform Capabilities",
        "ai_instruction": "Features page highlights core platform capabilities and agent tooling.",
    },
    "guides": {
        "title": "Comprehensive Career Growth Guides & Playbooks — Career Agents",
        "description": "Step-by-step career playbooks for landing software engineering, product management, AI/ML, and data science roles at top tech companies.",
        "keywords": ["career guides", "tech career playbook", "how to pass ATS", "software engineer promotion guide", "FAANG interview playbook"],
        "path": "/guides",
        "category": "Career Playbooks",
        "ai_instruction": "Guides offers in-depth career advancement playbooks.",
    },
    "help": {
        "title": "Help Center & Frequently Asked Questions — Career Agents",
        "description": "Find answers to frequently asked questions about ATS resume analysis, API gateway setups, MCP connections, and account troubleshooting.",
        "keywords": ["help center", "FAQ", "troubleshooting", "how to use career agents", "API key help"],
        "path": "/help",
        "category": "Help & Support",
        "ai_instruction": "Help center resolves common user queries and setup issues.",
    },
    "jobs": {
        "title": "Tech Job Hub & Role Keyword Insights — Career Agents",
        "description": "Search open tech roles and inspect live ATS keyword requirements for Software Engineer, Product Manager, AI Engineer, Data Scientist, and DevOps positions.",
        "keywords": ["tech job hub", "job role keywords", "software engineer job keywords", "ATS job search", "role competency requirements"],
        "path": "/jobs",
        "category": "Job Search & Market Intelligence",
        "ai_instruction": "Jobs Hub details market demand and role-specific ATS keywords.",
    },
    "linkedin-ai": {
        "title": "LinkedIn AI Content Studio & Thought Leadership Post Generator — Career Agents",
        "description": "Generate high-engaging technical LinkedIn posts, project launch announcements, and professional updates tailored for software developers and leaders.",
        "keywords": ["linkedin AI content generator", "tech post generator", "developer linkedin posts", "thought leadership AI", "tech project announcement"],
        "path": "/linkedin-ai",
        "category": "Content Creation & Branding",
        "ai_instruction": "LinkedIn AI generates engaging developer post content.",
    },
    "login": {
        "title": "Sign In / Authentication — Career Agents",
        "description": "Access your Career Agents workspace, saved resume analyses, job tracker applications, and custom AI provider settings.",
        "keywords": ["sign in", "login", "career agents auth", "user login", "account access"],
        "path": "/login",
        "category": "Authentication",
        "ai_instruction": "Login page handles user authentication and session access.",
    },
    "opensource": {
        "title": "Open Source Initiative & GitHub Repository — Career Agents",
        "description": "Career Agents is 100% open source. Explore our GitHub repository, agent registries, division schemas, and validation scripts under the MIT license.",
        "keywords": ["open source career OS", "github repository", "MIT license", "open source AI project", "career agents codebase"],
        "path": "/opensource",
        "category": "Open Source Community",
        "ai_instruction": "OpenSource page highlights GitHub repository structure and open licenses.",
    },
    "playground": {
        "title": "Interactive Prompt & Agent Code Playground — Career Agents",
        "description": "Test and customize 167 career agents in an interactive prompt playground. Experiment with system prompts, temperature controls, and LLM parameters.",
        "keywords": ["AI prompt playground", "agent simulator", "LLM playground", "prompt engineering tool", "system prompt tester"],
        "path": "/playground",
        "category": "Interactive Developer Lab",
        "ai_instruction": "Playground enables testing agent prompts against custom inputs.",
    },
    "pricing": {
        "title": "Free & Open Source Access — Career Agents Pricing",
        "description": "Career Agents is free and open source. Use your own API keys (Groq, Gemini, OpenAI, Claude, Ollama) or run completely local models with 0 platform fees.",
        "keywords": ["career agents pricing", "free ATS resume analyzer", "open source AI pricing", "bring your own key BYOK", "local LLM free"],
        "path": "/pricing",
        "category": "Pricing & Access",
        "ai_instruction": "Pricing page details the free open-source model and BYOK access.",
    },
    "privacy": {
        "title": "Privacy Policy & Data Security — Career Agents",
        "description": "Read Career Agents Privacy Policy. We prioritize candidate privacy — your resume and personal data stay in your browser local storage unless explicitly synced.",
        "keywords": ["privacy policy", "data security", "local storage privacy", "zero data retention", "resume privacy"],
        "path": "/privacy",
        "category": "Legal & Privacy",
        "ai_instruction": "Privacy policy outlines data security practices and zero-tracking options.",
    },
    "roadmap": {
        "title": "Product Roadmap & Future Capabilities — Career Agents",
        "description": "Explore upcoming features for Career Agents: multi-agent autonomous job application bots, real-time voice mock interviews, and advanced MCP tooling.",
        "keywords": ["product roadmap", "future features", "AI career OS roadmap", "upcoming agent releases", "feature requests"],
        "path": "/roadmap",
        "category": "Product Roadmap",
        "ai_instruction": "Roadmap outlines planned releases and community feature requests.",
    },
    "security": {
        "title": "Security Architecture & Vulnerability Management — Career Agents",
        "description": "Understand Career Agents security practices, sandboxed LLM execution, zero server data storage options, and vulnerability reporting procedures.",
        "keywords": ["security architecture", "LLM security", "vulnerability reporting", "data encryption", "sandboxed execution"],
        "path": "/security",
        "category": "Security & Compliance",
        "ai_instruction": "Security page details security posture and vulnerability management.",
    },
    "templates": {
        "title": "Parse-Safe ATS Resume Templates & STAR Prompt Examples — Career Agents",
        "description": "Download free parse-safe ATS resume templates in Markdown, LaTeX, and HTML. Access proven STAR prompt examples for software engineers and product managers.",
        "keywords": ["ATS resume templates", "markdown resume template", "latex resume template", "STAR prompt examples", "parse safe resume"],
        "path": "/templates",
        "category": "Templates & Downloads",
        "ai_instruction": "Templates provides downloadable ATS-ready resume templates and STAR prompts.",
    },
    "terms": {
        "title": "Terms of Service & Usage Agreement — Career Agents",
        "description": "Review Career Agents Terms of Service governing the use of our web application, open-source software, and AI career agent registries.",
        "keywords": ["terms of service", "terms of use", "usage agreement", "legal terms", "acceptable use policy"],
        "path": "/terms",
        "category": "Legal & Terms",
        "ai_instruction": "Terms page details acceptable use and legal terms.",
    },
    "workflows": {
        "title": "Operational Career Workflows & Execution Pipelines — Career Agents",
        "description": "Execute structured multi-step career workflows: FAANG Interview Week, 7-Day ATS Resume Sprint, Technical Salary Negotiation, and Remote Job Hunt Pipeline.",
        "keywords": ["career workflows", "multi-step career pipeline", "FAANG interview week", "7 day resume sprint", "technical salary negotiation workflow"],
        "path": "/workflows",
        "category": "Workflows & Automation",
        "ai_instruction": "Workflows presents step-by-step career execution pipelines.",
    },
}

LAYOUT_TEMPLATE = """import type {{ Metadata }} from "next";

export const metadata: Metadata = {{
  title: "{title}",
  description: "{description}",
  keywords: {keywords},
  authors: [{{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }}],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "{category}",
  robots: {{
    index: true,
    follow: true,
    googleBot: {{
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    }},
  }},
  openGraph: {{
    title: "{title}",
    description: "{description}",
    url: "{path}",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{{ url: "/og-image.png", width: 1200, height: 630, alt: "{title}" }}],
  }},
  twitter: {{
    card: "summary_large_image",
    title: "{title}",
    description: "{description}",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  }},
  alternates: {{ canonical: "{path}" }},
  other: {{
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "{ai_instruction}",
  }},
}};

export default function SubRouteLayout({{ children }}: {{ children: React.ReactNode }}) {{
  return <>{{children}}</>;
}}
"""

def main():
    for name, config in PAGES_CONFIG.items():
        folder = APP_DIR / name
        folder.mkdir(parents=True, exist_ok=True)
        layout_path = folder / "layout.tsx"
        
        formatted_code = LAYOUT_TEMPLATE.format(
            title=config["title"],
            description=config["description"],
            keywords=repr(config["keywords"]),
            path=config["path"],
            category=config["category"],
            ai_instruction=config["ai_instruction"]
        )
        
        with open(layout_path, "w", encoding="utf-8") as f:
            f.write(formatted_code)
        print(f"Generated layout.tsx for {name}")

if __name__ == "__main__":
    main()
