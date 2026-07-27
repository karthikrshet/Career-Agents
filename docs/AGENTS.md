# Career Agents — Agent Reference

All 146 Career Agents AI agents organized by division.

---

## Overview

Career Agents includes **146 specialized AI agents** organized into **19 divisions**. Each agent is a Markdown file with a YAML frontmatter schema and a detailed system prompt. Agents are loaded at runtime by the Copilot API route, which scores and selects the most relevant agents for each user query.

### How Agent Routing Works

When you send a message to Career Copilot:

1. The API route scores all 146 agents against your message using:
   - **Full name match** → +15 points
   - **Keyword matches** (each word in agent name) → +3 per keyword
   - **Tag matches** → +2 per tag
   - **Skill matches** → +2 per skill
   - **Domain intent boosters** (resume/github/interview/linkedin) → +12 points

2. **Top 3 agents** with score ≥ 5 are selected

3. Their **full system prompts** are loaded from disk and injected into the conversation

4. The AI responds with the combined expertise of all selected agents

### How to Use a Specific Agent

You can activate specific agents by mentioning their domain in your message:
- `"review my resume for ATS"` → routes to ATS Resume Reviewer + Resume agents
- `"prepare me for a Google interview"` → routes to Google Interview Coach + Technical Interview Coach
- `"help me negotiate my salary"` → routes to Salary Negotiation Coach + Offer Evaluation Advisor
- `"review my GitHub profile"` → routes to GitHub Growth Advisor + Portfolio Reviewer

---

## Division Summary

| Division | Count | Focus |
|---|---|---|
| Career | 33 | Job search, resume, personal branding, career strategy |
| AI Engineering | 10 | AI/ML engineering roles, LLMs, MLOps |
| Cloud | 10 | AWS, Azure, GCP, Kubernetes, platform engineering |
| Cybersecurity | 10 | Security engineering, pen testing, compliance |
| Open Source | 10 | OSS contribution, DevRel, community building |
| Data Engineering | 10 | Data pipelines, analytics, BI |
| DevRel | 10 | Developer relations, advocacy, technical marketing |
| Company Interviews | 10 | Company-specific interview prep (FAANG+) |
| Resume | 9 | Resume optimization, achievement writing |
| Engineering | 6 | Backend, DevOps, full-stack architecture |
| Interview | 5 | Mock interviews, STAR method, system design |
| Networking | 5 | LinkedIn outreach, cold email, referrals |
| Projects | 4 | Final year projects, documentation, research |
| Startup | 4 | Founder advice, go-to-market, product |
| GTM | 2 | Go-to-market engineering, Clay automation |
| FAANG | 2 | OpenAI and Google-specific coaching |
| Job Automation | 2 | Job hunting automation, application optimization |
| AI Business | 2 | AI-native business building, consulting |
| Freelancing | 2 | Freelance career, Upwork |
| **Total** | **146** | |

---

## Career Division (33 agents)

| Agent | Description |
|---|---|
| ATS Resume Reviewer | Line-by-line resume auditor for ATS optimization and keyword signaling |
| Career Accountability Coach | Accountability partner who converts goals into weekly commitments |
| Career Pivot to Tech Advisor | Transition strategist for non-technical professionals entering tech |
| Career Roadmap Strategist | Long-term career trajectory planning and milestone setting |
| Career Transition Coach | Guides professionals through role or industry changes |
| Diversity & Inclusion Career Coach | Career guidance for underrepresented groups in tech |
| Executive Job Search Coach | Job search strategy for senior and executive candidates |
| Freelance Career Advisor | Freelance business setup and client acquisition |
| Graduate Career Advisor | Career guidance for new graduates entering the job market |
| HR Interview Coach | Behavioral and HR-round interview preparation |
| Internship Application Strategist | Internship search, applications, and outreach strategy |
| Internship Success Coach | How to perform and get a return offer from internships |
| Job Search Strategist | Job search methodology, pipeline management, and execution |
| LinkedIn Growth Advisor | LinkedIn profile optimization and content strategy |
| Networking Coach | Professional networking strategy and relationship building |
| Offer Evaluation Advisor | Evaluating and comparing job offers (comp, culture, growth) |
| Personal Branding Advisor | Personal brand building across platforms |
| Placement Coach | Campus placement preparation and strategy |
| Product Manager Coach | PM interview prep and PM career path guidance |
| Recruiter Outreach Specialist | Cold outreach to recruiters and talent teams |
| Remote Work Advisor | Remote job search and remote work best practices |
| Resume Strategist | High-level resume positioning and narrative strategy |
| Returnship Coach | Career re-entry guidance for professionals returning after gaps |
| Salary Benchmark Analyst | Compensation research and market benchmarking |
| Salary Negotiation Coach | Negotiation tactics, counter-offers, and compensation strategy |
| Technical Interview Coach | Coding interview prep (algorithms, data structures) |
| Performance Review Advisor | How to ace performance reviews and build a promotion case |
| Career Risk Assessor | Evaluating career risks, volatility, and options |
| Executive Presence Coach | Communication and leadership presence for senior professionals |
| Graduate School vs. Industry Advisor | Decision framework: grad school vs. direct industry entry |
| International Job Search Coach | Job search in foreign countries (visa, process, culture) |
| Promotion Readiness Coach | Readiness assessment and promotion campaign planning |
| Relocation Strategy Advisor | Career and logistics planning for geographic relocation |

---

## AI Engineering Division (10 agents)

| Agent | Description |
|---|---|
| AI Agent Architect | Designing multi-agent systems and autonomous AI pipelines |
| AI Engineer Career Coach | Career path guidance for AI/ML engineers |
| AI Product Builder | Building AI-native products (architecture, positioning, GTM) |
| Computer Vision Engineer | Computer vision career path, skills, and interview prep |
| Generative AI Consultant | Generative AI implementation for organizations |
| LLM Engineer | Large language model fine-tuning, deployment, and optimization |
| Machine Learning Engineer | ML engineering career path, interviews, and skill building |
| MLOps Engineer | ML pipeline, model serving, monitoring, and CI/CD for ML |
| Prompt Engineer | Prompt design, optimization, and evaluation for LLMs |
| RAG Architect | Retrieval-augmented generation system design and implementation |

---

## Cloud Division (10 agents)

| Agent | Description |
|---|---|
| AWS Cloud Architect | AWS architecture, certifications, and interview prep |
| Azure Cloud Engineer | Azure services, architecture, and certification guidance |
| Cloud Cost Optimizer | Cloud cost reduction strategies and FinOps practices |
| Cloud Migration Advisor | On-premises to cloud migration planning and execution |
| Cloud Security Advisor | Cloud security best practices, IAM, and compliance |
| GCP Cloud Engineer | Google Cloud Platform services and career guidance |
| Kubernetes Specialist | Kubernetes architecture, operations, and certification |
| Platform Engineer | Internal developer platform design and tooling |
| Site Reliability Engineer | SRE practices, SLOs, incident management, and career path |
| Terraform Specialist | Infrastructure as code, Terraform best practices |

---

## Cybersecurity Division (10 agents)

| Agent | Description |
|---|---|
| Application Security Specialist | SAST/DAST, secure coding, OWASP, AppSec interview prep |
| Cloud Security Engineer | Cloud security architecture and cloud-native security |
| Ethical Hacking Advisor | Penetration testing methodology and ethical hacking career |
| Governance Risk Compliance Advisor | GRC frameworks (SOC 2, ISO 27001, GDPR, HIPAA) |
| Identity Access Management Specialist | IAM design, SSO, Zero Trust, and PAM |
| Incident Response Specialist | Security incident response and forensics |
| Penetration Testing Coach | Pen test techniques, tools (Burp Suite, Metasploit), reporting |
| Security Architect | Security architecture design and enterprise security strategy |
| Security Engineer | Security engineering career path and technical skill building |
| Security Operations Analyst | SOC operations, SIEM, threat hunting |

---

## Open Source Division (10 agents)

| Agent | Description |
|---|---|
| Community Builder | Open source community growth and governance |
| Developer Advocate | Developer advocacy career path and content strategy |
| DevRel Strategist | Developer relations strategy and metrics |
| GitHub Growth Advisor | Growing GitHub following, stars, and project visibility |
| Maintainer Coach | Open source project maintenance and contributor management |
| Open Source Funding Advisor | OSS funding (GitHub Sponsors, grants, Open Collective) |
| Open Source Mentor | Guiding new contributors into open source |
| OSS Contributor Coach | How to make meaningful contributions to open source |
| Project Maintenance Specialist | Sustainable OSS project maintenance practices |
| Technical Writing Advisor | Technical documentation, README quality, tutorials |

---

## Data Engineering Division (10 agents)

| Agent | Description |
|---|---|
| Analytics Engineer | dbt, data modeling, and analytics engineering career |
| Business Intelligence Specialist | BI tools (Tableau, Looker, Power BI) and analytics career |
| Data Architect | Data platform architecture, data mesh, lakehouse |
| Data Engineer | Data pipeline design, Spark, Kafka, ETL |
| Data Governance Advisor | Data quality, catalog, lineage, and governance frameworks |
| Data Platform Engineer | Building and scaling data infrastructure |
| Data Quality Engineer | Data testing, validation, and reliability engineering |
| Database Performance Specialist | Query optimization, indexing, and database performance |
| ETL Specialist | ETL/ELT pipeline design, tools (Airflow, dbt, Fivetran) |
| Stream Processing Specialist | Real-time data processing (Kafka, Flink, Spark Streaming) |

---

## DevRel Division (10 agents)

| Agent | Description |
|---|---|
| API Adoption Consultant | Developer onboarding and API adoption strategies |
| Community Growth Specialist | Growing and engaging developer communities |
| Conference Speaker Coach | Public speaking, CFP writing, and conference strategy |
| Content Strategy Advisor | Technical content strategy and developer marketing |
| Developer Education Specialist | Developer tutorials, courses, and educational content |
| Developer Evangelist | External developer evangelism and advocacy |
| Developer Experience Specialist | DX improvement, SDK design, and documentation quality |
| Developer Relations Manager | DevRel team leadership and program management |
| Technical Community Builder | Building online and offline technical communities |
| Technical Marketing Advisor | Technical content marketing and developer outreach |

---

## Company Interviews Division (10 agents)

| Agent | Description |
|---|---|
| Adobe Interview Coach | Adobe-specific interview process, values, and prep |
| Amazon Interview Coach | Amazon Leadership Principles, bar raiser, system design |
| Atlassian Interview Coach | Atlassian values-based interview and technical prep |
| Google Interview Coach | Google coding rounds, Googleyness, system design |
| Meta Interview Coach | Meta's E5/E6 interview process, coding, behavioral |
| Microsoft Interview Coach | Microsoft's growth mindset interviews and technical rounds |
| Netflix Interview Coach | Netflix culture deck, senior SWE bar, system design |
| Oracle Interview Coach | Oracle technical rounds and corporate interview style |
| Salesforce Interview Coach | Salesforce core values, Ohana culture, technical prep |
| Uber Interview Coach | Uber systems thinking, coding, and behavioral rounds |

---

## Resume Division (9 agents)

| Agent | Description |
|---|---|
| Executive Resume Advisor | C-suite and VP-level resume strategy and positioning |
| Portfolio Reviewer | Technical portfolio and project showcase optimization |
| Resume Achievement Writer | Quantifying and rewriting resume achievements |
| Resume Formatting Specialist | ATS-compatible formatting, visual design, layout |
| Resume Keyword Optimizer | Keyword research and strategic placement for ATS |
| Achievement Quantification Coach | Adding metrics and numbers to resume bullet points |
| Resume Bullet Generator | Generating strong, action-verb-led bullet points |
| Resume Gap Strategist | Addressing career gaps honestly and strategically |
| Technical Project Positioning Advisor | How to present technical projects for maximum impact |

---

## Engineering Division (6 agents)

| Agent | Description |
|---|---|
| Backend Architect | Backend system design, API design, scalability |
| Code Reviewer | Code quality, best practices, and PR review guidance |
| Database Engineer | Database design, query optimization, schema design |
| DevOps Engineer | CI/CD, infrastructure automation, and DevOps career |
| MERN Architect | MongoDB, Express, React, Node.js full-stack architecture |
| Next.js Performance Engineer | Next.js optimization, Core Web Vitals, SSR/SSG patterns |

---

## Interview Division (5 agents)

| Agent | Description |
|---|---|
| Behavioral Interview Specialist | STAR framework, behavioral question mastery |
| Group Discussion Coach | Group interview and discussion tactics |
| Leadership Interview Coach | Leadership-focused interview questions and stories |
| Mock Interviewer | Realistic mock interview simulation and feedback |
| System Design Coach | System design interview frameworks and practice |

---

## Networking Division (5 agents)

| Agent | Description |
|---|---|
| Alumni Networking Advisor | Leveraging alumni networks for job opportunities |
| Cold Outreach Specialist | Cold email and DM strategy for job outreach |
| LinkedIn Outreach Specialist | LinkedIn connection and messaging strategy |
| Recruiter Communication Coach | How to communicate effectively with recruiters |
| Referral Strategy Coach | Getting referrals at target companies |

---

## Projects Division (4 agents)

| Agent | Description |
|---|---|
| Documentation Specialist | Technical documentation writing and structure |
| Final Year Project Advisor | FYP/capstone project planning, execution, and presentation |
| Research Assistant | Academic and technical research methodology |
| Viva Coach | Thesis defense and viva voce preparation |

---

## Startup Division (4 agents)

| Agent | Description |
|---|---|
| Founder Advisor | Early-stage startup founding, co-founder dynamics, fundraising |
| Growth Strategist | Startup growth strategy, acquisition channels, metrics |
| Market Research Analyst | Market sizing, competitive analysis, customer research |
| Product Manager | Product strategy, roadmapping, and PM career path |

---

## Smaller Divisions

### GTM (2 agents)
| Agent | Description |
|---|---|
| GTM Engineer | Go-to-market engineering, RevOps, and sales automation |
| Clay Specialist | Clay.com workflows for prospecting and outreach automation |

### FAANG (2 agents)
| Agent | Description |
|---|---|
| Google SWE Coach | Google-specific SWE career path and interview mastery |
| OpenAI Career Coach | OpenAI's interview process and AI research career guidance |

### Job Automation (2 agents)
| Agent | Description |
|---|---|
| Job Hunter AI | Automating job search, application tracking, and outreach |
| Job Application Optimizer | Tailoring resumes and cover letters for specific job postings |

### AI Business (2 agents)
| Agent | Description |
|---|---|
| AI Founder | Building AI-native startups from zero to traction |
| AI Consultant | AI consulting career path and client engagement strategy |

### Freelancing (2 agents)
| Agent | Description |
|---|---|
| Freelance Founder | Starting and scaling a freelance business |
| Upwork Specialist | Upwork profile optimization and winning proposals |

---

## Adding a New Agent

See [DEVELOPMENT.md](./DEVELOPMENT.md#adding-a-new-agent) for the step-by-step guide to creating and registering a new agent.

**Agent file requirements:**
- Located in the correct division folder (`career/`, `engineering/`, etc.)
- Minimum 300 words
- Complete YAML frontmatter
- Required headings: Role, Approach, Key Capabilities, When to Use, Output Format
- Unique `id` across all 146 agents
- Registered in both `agent-registry.json` and `divisions.json`
