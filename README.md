# 🚀 Career-Agents
### The Open-Source Career Operating System (Career OS)
**The most complete open-source career workspace, featuring 135+ specialized AI agents and structured execution roadmaps.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Divisions](https://img.shields.io/badge/divisions-19-orange.svg)](#browse-by-division)
[![Agents](https://img.shields.io/badge/agents-135%2F100-blue.svg)](./career-os.json)

---

## ⚡ Quick Start

A new visitor can configure, assess, run, and export prompts out-of-the-box:

```
  1. INSTALL              2. SCORE                3. RECOMMEND
+---------------+       +---------------+       +---------------+
|  npm install  | ----> |  npx ... score| ----> | npx ... recom |
+---------------+       +---------------+       +---------------+
                                                        |
                                                        v
  6. EXPORT               5. LAUNCH               4. RUN (EXECUTE)
+---------------+       +---------------+       +---------------+
| npx ... export| <---- | npx ... launch| <---- | npx ... run   |
+---------------+       +---------------+       +---------------+
```

### 1. Install
Clone the repository and install dependencies:
```bash
git clone https://github.com/karthikrshet/Career-Agents.git
cd Career-Agents
npm install
npm link
```

### 2. Score (`career-agents score`)
Audit your standing. Run the interactive terminal questionnaire to calculate your scores across 5 dimensions:
```bash
career-agents score
```

### 3. Recommend (`career-agents recommend`)
Receive personalized matching assets. Input your skills, experience, and target goals to get matched with specialized agents, paths, and company prep guides:
```bash
career-agents recommend
```

### 4. Run (`career-agents run <agent-id>`)
Execute agents directly in your terminal. Start a local live chat session (connects via `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, or `OPENAI_API_KEY`) or run in simulated sandbox mode:
```bash
career-agents run ats-resume-reviewer
```

### 5. Launch (`career-agents launcher <agent-id> <platform>`)
Deploy agents on target AI chat clients. Copy system prompts to your clipboard automatically and open Claude, Gemini, ChatGPT, or Perplexity browser portals:
```bash
career-agents launcher google-interview-coach claude
```

### 6. Export (`career-agents export <type> <id> <format>`)
Consolidate and package prompt assets for external tools:
```bash
career-agents export bundle faang-bundle json
```

---

## 📊 Repository Statistics

- **Total Agents:** 135 (100% active, fully specified, and tested)
- **Total Divisions:** 19 functional specialty areas
- **Total Career Workflows:** 10 multi-agent operation guides
- **Total Career Bundles:** 7 pre-packaged bundles
- **Total Career Paths:** 10 engineering/PM/founder paths
- **Total Target Companies:** 10 tier-1 track prep databases
- **Total Integrations:** 10 supported configurations
- **Total Supported Platforms:** 10 runtimes
- **Total Contributors:** 1 (Karthik Rajesh Shet)

---

## 🆚 Why Career-Agents (Career OS)

| Capability / Feature | Agency Agents | Career-Ops | Career-Agents (Career OS) |
| :--- | :---: | :---: | :---: |
| **Agent Roster Depth** | ❌ Basic | ❌ None | ✅ **135+ Specialist Agents** |
| **Modular Divisions** | ❌ Flat | ❌ Flat | ✅ **19 Categorized Divisions** |
| **Multi-Agent Workflows** | ❌ Manual | ✅ Job Search | ✅ **10 Cross-Disciplinary Workflows** |
| **Ecosystem Bundles** | ❌ None | ❌ None | ✅ **7 Target Milestones Bundles** |
| **Tier-1 Company Hubs** | ❌ General | ❌ General | ✅ **10 Detailed Company Guides** |
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

### 3. Resume Intelligence
Dedicated agents (`resume/`) specializing in keyword optimization, Google XYZ formulas, formatting reviews, and ATS parsing validations.

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

Our agents are grouped into 19 functional specialty divisions:

### 📁 Career Division (`career`)
*Placement strategy, resume engineering, interview coaching, and personal brand growth for students and job seekers.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`ATS Resume Reviewer`](./career/ats-resume-reviewer.md) | ✅ Live | A focused, line-by-line resume auditor who optimizes resume structure, language, and keyword signaling to survive ATS parsing and convert recruiter skim-time into interview invites. |
| [`Career Accountability Coach`](./career/career-accountability-coach.md) | ✅ Live | A structured, non-judgmental accountability partner who converts career goals into weekly commitments, tracks follow-through with honest data, diagnoses why execution is failing, and rebuilds momentum when it stalls — without letting candidates off the hook or crushing them with guilt. |
| [`Career Pivot to Tech Advisor`](./career/career-pivot-to-tech-advisor.md) | ✅ Live | A transition strategist for non-technical professionals entering the tech industry — covering entry point selection (software engineering, product, data, UX, technical sales, DevRel, and more), learning path design, portfolio development, narrative construction, and the tactical job search mechanics specific to tech industry hiring. |
| [`Career Roadmap Strategist`](./career/career-roadmap-strategist.md) | ✅ Live | A long-horizon career architect who builds milestone-based, decade-spanning career roadmaps — turning vague ambitions into sequenced, evidence-gated development plans that compound skill, reputation, and leverage over time. |
| [`Career Transition Coach`](./career/career-transition-coach.md) | ✅ Live | A decisive, pattern-aware career transition coach who helps professionals move from one field, function, or industry into another — by mapping transferable assets, designing bridge strategies, and turning "I don't have the background for this" into a concrete, evidence-backed plan that works. |
| [`Diversity & Inclusion Career Coach`](./career/diversity-inclusion-career-coach.md) | ✅ Live | A career strategist specializing in helping underrepresented professionals navigate systemic barriers, bias in hiring, and unequal advancement dynamics — providing concrete, evidence-informed strategies that turn awareness of barriers into actionable career architecture. |
| [`Executive Job Search Coach`](./career/executive-job-search-coach.md) | ✅ Live | A senior-level career strategist who helps VP, Director, and C-suite professionals navigate the fundamentally different world of executive hiring — where most roles never appear on job boards, where personal brand and reputation are the primary search vehicles, and where the quality of your board and peer network determines your access more than your resume. |
| [`Freelance Career Advisor`](./career/freelance-career-advisor.md) | ✅ Live | A pragmatic freelance business strategist who helps independent professionals build sustainable, client-diversified freelance careers — covering rate-setting, client acquisition, portfolio positioning, contract fundamentals, and the transition from feast-or-famine to predictable income. |
| [`Graduate Career Advisor`](./career/graduate-career-advisor.md) | ✅ Live | A strategic first-job advisor for recent graduates who cuts through the noise of "apply everywhere" and "network more" to build targeted, evidence-backed launch strategies that get new graduates into the right first role — not just any role — within a realistic timeline. |
| [`HR Interview Coach`](./career/hr-interview-coach.md) | ✅ Live | A behavioural and offer-readiness coach who prepares candidates for HR and cultural interviews, designs story-driven answers to behavioural prompts, and leads offer evaluation and negotiation prep with professional rigor. |
| [`Internship Application Strategist`](./career/internship-application-strategist.md) | ✅ Live | An internship application strategist who helps students package their skills, target hiring windows, and win sought-after internship roles. |
| [`Internship Success Coach`](./career/internship-success-coach.md) | ✅ Live | A hands-on internship performance coach who helps interns move from "showing up" to "standing out" — by building visibility, delivering meaningful work, converting internships into return offers, and treating every internship as a twelve-week audition with a clear performance plan. |
| [`Job Search Strategist`](./career/job-search-strategist.md) | ✅ Live | A job search strategist who builds targeted application plans, opportunity funnels, and outreach systems for faster interview traction. |
| [`LinkedIn Growth Advisor`](./career/linkedin-growth-advisor.md) | ✅ Live | A tactical growth advisor for LinkedIn who optimizes profiles for recruiter discovery, builds content strategies that surface domain credibility, and converts passive profile views into active opportunities. |
| [`Networking Coach`](./career/networking-coach.md) | ✅ Live | A strategic, relationship-first networking coach who transforms transactional connection requests into genuine professional relationships — helping candidates build the kind of network that surfaces hidden job market opportunities, generates warm referrals, and compounds in value over an entire career. |
| [`Offer Evaluation Advisor`](./career/offer-evaluation-advisor.md) | ✅ Live | An offer evaluation advisor who helps candidates compare multiple opportunities and choose the best role for their career goals. |
| [`Personal Branding Advisor`](./career/personal-branding-advisor.md) | ✅ Live | A strategic personal brand architect who builds authentic, channel-consistent professional identities that attract the right opportunities — turning scattered professional presence into a coherent, searchable, memorable signal that does career work even when the candidate isn't actively job hunting. |
| [`Placement Coach`](./career/placement-coach.md) | ✅ Live | An end-to-end placement strategist who audits your readiness, builds a prioritized action plan, and drives you from "applying blind" to "negotiating offers" with the discipline of someone who has watched a thousand placement cycles play out. |
| [`Product Manager Coach`](./career/product-manager-coach.md) | ✅ Live | A rigorous PM career coach who helps aspiring and practicing product managers break into the discipline, ace PM interviews at any company tier, build product intuition through structured practice, and advance from APM to VP of Product — with frameworks grounded in how the best PMs actually think, not in what sounds good in a textbook. |
| [`Recruiter Outreach Specialist`](./career/recruiter-outreach-specialist.md) | ✅ Live | A recruiter outreach specialist who crafts message sequences and outreach plans to get recruiters to respond and move candidates into hiring conversations. |
| [`Remote Work Advisor`](./career/remote-work-advisor.md) | ✅ Live | A strategic remote-work specialist who helps professionals find, land, and thrive in remote roles — covering remote-specific job search tactics, distributed team visibility, async communication mastery, home office optimization, and the specific career risks that remote work creates if not managed deliberately. |
| [`Resume Strategist`](./career/resume-strategist.md) | ✅ Live | A narrative-focused resume strategist who crafts role-driven career stories, aligns achievements to hiring criteria, and builds resume ecosystems (resume, LinkedIn, portfolio) that consistently convert interest into interviews. |
| [`Returnship Coach`](./career/returnship-coach.md) | ✅ Live | A re-entry specialist who helps professionals return to the workforce after a career break — reframing gaps, rebuilding confidence, refreshing skills, and designing targeted re-entry strategies that land roles that respect the candidate's full experience, not just their most recent role. |
| [`Salary Benchmark Analyst`](./career/salary-benchmark-analyst.md) | ✅ Live | A rigorous, data-literate compensation analyst who builds evidence-based salary benchmarks, deconstructs total compensation packages, and arms candidates with the market intelligence and framing to negotiate from facts rather than hope. |
| [`Salary Negotiation Coach`](./career/salary-negotiation-coach.md) | ✅ Live | A salary negotiation specialist who prepares candidates to evaluate offers, build leverage, and negotiate compensation confidently. |
| [`Technical Interview Coach`](./career/technical-interview-coach.md) | ✅ Live | A hands-on technical interview coach who prepares candidates for data structures & algorithms, system design, and role-specific coding rounds through targeted drills, rubric-based feedback, and measurable progression plans. |


### 📁 Company Interviews Division (`company-interviews`)
*Target-company-specific interview coaches for FAANG, tier-1 product companies, and tech giants.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`Adobe Interview Coach`](./company-interviews/adobe-interview-coach.md) | ✅ Live | A creativity-meets-engineering specialist who prepares candidates for Adobe's blend of technical rigor and genuine product-craft sensibility, where caring about the actual user experience of the tools you build is a real evaluation signal. |
| [`Amazon Interview Coach`](./company-interviews/amazon-interview-coach.md) | ✅ Live | A Leadership Principles specialist who knows that Amazon interviews are won or lost on STAR-structured stories mapped precisely to specific principles, not generic behavioral answers with an Amazon logo pasted on top. |
| [`Atlassian Interview Coach`](./company-interviews/atlassian-interview-coach.md) | ✅ Live | A values-driven collaboration specialist who prepares candidates for Atlassian's structured, values-mapped interview loop, where "open company, no bullshit" is an actual evaluation criterion, not just a wall poster. |
| [`Google Interview Coach`](./company-interviews/google-interview-coach.md) | ✅ Live | A structured-rigor specialist for Google's algorithm-heavy, googleyness-aware interview loop, who treats clean code communication and structured problem decomposition as non-negotiable, not optional polish. |
| [`Meta Interview Coach`](./company-interviews/meta-interview-coach.md) | ✅ Live | An execution-speed and impact-obsessed coach who prepares candidates for Meta's fast-paced technical bar and its distinct "move fast, focus on impact" behavioral evaluation. |
| [`Microsoft Interview Coach`](./company-interviews/microsoft-interview-coach.md) | ✅ Live | A growth-mindset and collaborative-problem-solving specialist who prepares candidates for Microsoft's blend of technical depth and "how do you work with others" evaluation, including the as-appropriate design/coding rounds. |
| [`Netflix Interview Coach`](./company-interviews/netflix-interview-coach.md) | ✅ Live | A radical-candor and high-judgment specialist who prepares candidates for Netflix's uniquely direct culture interviews, where "would I fight to keep this person" is the real question behind every round. |
| [`Oracle Interview Coach`](./company-interviews/oracle-interview-coach.md) | ✅ Live | A fundamentals-first specialist who prepares candidates for Oracle's traditionally rigorous CS-fundamentals and systems-depth interview style, where solid, unglamorous engineering knowledge is genuinely rewarded. |
| [`Salesforce Interview Coach`](./company-interviews/salesforce-interview-coach.md) | ✅ Live | A trust-and-customer-success specialist who prepares candidates for Salesforce's values-and-relationship-driven interview culture, where "trust is our #1 value" is treated as a real evaluation lens, not a slogan. |
| [`Uber Interview Coach`](./company-interviews/uber-interview-coach.md) | ✅ Live | A scale-and-ownership specialist who prepares candidates for Uber's operationally intense, ownership-driven interview culture, where "built for scale, obsessed with the details that break at scale" is the actual bar. |


### 📁 Engineering Division (`engineering`)
*Software architecture, database design, Next.js performance tuning, DevOps infrastructure, and senior-level code reviews.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`Backend Architect`](./engineering/backend-architect.md) | ✅ Live | An API and service-design reviewer who evaluates backend architecture for the failure modes that don't show up until real load, real edge cases, and real time have all had a chance to find them. |
| [`Code Reviewer`](./engineering/code-reviewer.md) | ✅ Live | A senior-level code reviewer who triages real risk instead of nitpicking style, distinguishing "this will break in production" from "this is a preference" and never letting the two get confused. |
| [`Database Engineer`](./engineering/database-engineer.md) | ✅ Live | A schema and query optimization specialist who reads execution plans instead of guessing, and treats indexing strategy as a precise discipline rather than a "just add an index" reflex. |
| [`DevOps Engineer`](./engineering/devops-engineer.md) | ✅ Live | A CI/CD and infrastructure reliability specialist who treats deployment pipelines as production systems in their own right, obsessed with reversibility, observability, and never being surprised by a failure. |
| [`MERN Architect`](./engineering/mern-architect.md) | ✅ Live | A full-stack architecture reviewer for MongoDB/Express/React/Node applications who evaluates real scalability and maintainability tradeoffs instead of rubber-stamping whatever framework is trendy this year. |
| [`Next.js Performance Engineer`](./engineering/nextjs-performance-engineer.md) | ✅ Live | A performance auditor obsessed with real Core Web Vitals and actual user-perceived speed, who diagnoses Next.js applications the way a profiler does — with numbers, not vibes. |


### 📁 Interview Division (`interview`)
*Specialized interview coaching, system design, mock interviewing, behavioral strategies, and group discussions.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`Behavioral Interview Specialist`](./interview/behavioral-interview-specialist.md) | ✅ Live | A behavioral interview drilling coach who helps candidates structure stories using STAR/STAR+ structures, handles high-pressure situational queries, and maps achievements to organizational leadership principles. |
| [`Group Discussion Coach`](./interview/group-discussion-coach.md) | ✅ Live | A facilitation and group communication coach who prepares candidates for group discussions, case studies, and collaborative rounds by teaching moderation, active listening, structured entry, and collaborative leadership. |
| [`Leadership Interview Coach`](./interview/leadership-interview-coach.md) | ✅ Live | A leadership coaching specialist who prepares senior candidates for executive, management, and leadership interviews — focusing on vision, organization building, decision-making, and organizational conflict. |
| [`Mock Interviewer`](./interview/mock-interviewer.md) | ✅ Live | A realistic, high-fidelity mock interviewer that conducts role-play simulations, dynamically probes candidate answers, handles follow-up queries, and provides rigorous feedback. |
| [`System Design Coach`](./interview/system-design-coach.md) | ✅ Live | A technical interview coach specializing in distributed systems, scalability, and system design interviews — covering requirements gathering, API design, data modeling, high-level architecture, and deep-dive bottlenecks. |


### 📁 Networking Division (`networking`)
*LinkedIn outreach, alumni networking, cold email strategies, recruiter communications, and referral acquisition.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`Alumni Networking Advisor`](./networking/alumni-networking-advisor.md) | ✅ Live | A campus and school affinity networking strategist who helps candidates locate, re-engage, and leverage university and corporate alumni networks for career insights and referrals. |
| [`Cold Outreach Specialist`](./networking/cold-outreach-specialist.md) | ✅ Live | A cold communication copywriter and strategist who helps candidates write highly optimized cold emails and messages to hiring managers, founders, and leaders. |
| [`LinkedIn Outreach Specialist`](./networking/linkedin-outreach-specialist.md) | ✅ Live | A digital networking expert who helps candidates write highly customized, high-conversion LinkedIn messages for informational interviews, warm introductions, and job inquiries. |
| [`Recruiter Communication Coach`](./networking/recruiter-communication-coach.md) | ✅ Live | A communication strategist who helps candidates manage recruiter channels, script outreach messages, prepare for screening calls, and negotiate communication touchpoints. |
| [`Referral Strategy Coach`](./networking/referral-strategy-coach.md) | ✅ Live | A relationship monetization strategist who helps candidates turn casual professional interactions, alumni links, and warm networks into formal job referrals and active internal advocates. |


### 📁 Projects Division (`projects`)
*Final Year Project lifecycle support from topic selection and research planning to documentation and viva defense.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`Documentation Specialist`](./projects/documentation-specialist.md) | ✅ Live | A technical documentation agent that turns project outputs into clear reports, manuals, and presentation-ready artifacts. |
| [`Final Year Project Advisor`](./projects/final-year-project-advisor.md) | ✅ Live | A FYP coach who helps students select, scope, and defend academic projects with real-world structure and evaluation clarity. |
| [`Research Assistant`](./projects/research-assistant.md) | ✅ Live | A structured research partner for literature reviews, methodology planning, and academic sourcing. |
| [`Viva Coach`](./projects/viva-coach.md) | ✅ Live | A viva preparation coach that helps students structure defense responses, anticipate examiner questions, and present confidently. |


### 📁 Resume Division (`resume`)
*Technical resume writing, achievement optimization, ATS formatting, design portfolios, and executive resumes.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`Executive Resume Advisor`](./resume/executive-resume-advisor.md) | ✅ Live | A senior-level resume strategist who helps VPs, Directors, and C-suite executives structure their resumes to emphasize executive presence, strategic scope, P&L ownership, and board visibility. |
| [`Portfolio Reviewer`](./resume/portfolio-reviewer.md) | ✅ Live | A design and technical portfolio critic who helps designers, engineers, and product managers structure, document, and present their work through compelling case studies that prove competency. |
| [`Resume Achievement Writer`](./resume/resume-achievement-writer.md) | ✅ Live | A metrics-focused resume achievement writer who helps candidates translate standard job duties into high-impact, outcome-oriented achievements using the STAR, Google X-Y-Z, and CAR frameworks. |
| [`Resume Formatting Specialist`](./resume/resume-formatting-specialist.md) | ✅ Live | A design and layout expert who ensures resumes are visually polished, perfectly aligned, typographically balanced, and structured for maximum scannability and ATS compatibility. |
| [`Resume Keyword Optimizer`](./resume/resume-keyword-optimizer.md) | ✅ Live | An ATS-oriented search optimization specialist who helps candidates align their resumes with target job descriptions using keyword mapping, context optimization, and phrase parsing strategies. |


### 📁 Startup Division (`startup`)
*Founder decision support, MVP definition, growth marketing strategy, and competitive market research.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`Founder Advisor`](./startup/founder-advisor.md) | ✅ Live | A blunt, experienced-feeling co-founder substitute who stress-tests ideas and decisions the way a real early-stage advisor would — before money, time, or credibility get spent finding out the hard way. |
| [`Growth Strategist`](./startup/growth-strategist.md) | ✅ Live | A growth specialist who designs acquisition, activation, retention, and monetization strategies for early-stage products. |
| [`Market Research Analyst`](./startup/market-research-analyst.md) | ✅ Live | A rigorous market research specialist who turns ambiguous business questions into defensible market insights, go-to-market priorities, and evidence-backed decisions — built for founders, product teams, and early-stage PMs who need market clarity fast. |
| [`Product Manager`](./startup/product-manager.md) | ✅ Live | A product strategy advisor who turns fuzzy feature requests into prioritized roadmaps, stakeholder-aligned outcomes, and execution-ready release plans. |


### 📁 AI Engineering Division (`ai-engineering`)
*Language models, prompt engineering, retrieval-augmented generation (RAG), cognitive agents, and machine learning operations (MLOps).*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`AI Agent Architect`](./ai-engineering/ai-agent-architect.md) | ✅ Live | Designs autonomous agent loops, tool bindings, planning algorithms, and multi-agent coordination layers. |
| [`AI Engineer Career Coach`](./ai-engineering/ai-engineer-career-coach.md) | ✅ Live | Coaches developers pivoting into artificial intelligence, structuring study plans, project portfolios, and technical interview prep. |
| [`AI Product Builder`](./ai-engineering/ai-product-builder.md) | ✅ Live | Helps founders and product managers scope AI features, evaluate API costs, and design user-centric AI feedback loops. |
| [`Computer Vision Engineer`](./ai-engineering/computer-vision-engineer.md) | ✅ Live | Advises on convolutional networks, object detection systems, segmentation pipelines, and edge device deployment. |
| [`Generative AI Consultant`](./ai-engineering/generative-ai-consultant.md) | ✅ Live | Guides organizations through generative AI strategy, risk mitigation, compliance, and ROI analysis. |
| [`LLM Engineer`](./ai-engineering/llm-engineer.md) | ✅ Live | Advises on model selection, context window optimization, fine-tuning pipelines, and inference efficiency. |
| [`Machine Learning Engineer`](./ai-engineering/machine-learning-engineer.md) | ✅ Live | Designs classical ML systems, feature stores, model training pipelines, and dataset validations. |
| [`MLOps Engineer`](./ai-engineering/mlops-engineer.md) | ✅ Live | Sets up continuous training pipelines, model registries, monitoring systems, and containerized deployment infrastructure. |
| [`Prompt Engineer`](./ai-engineering/prompt-engineer.md) | ✅ Live | Designs systematic prompt templates, Few-Shot examples, Chain-of-Thought flows, and system instructions. |
| [`RAG Architect`](./ai-engineering/rag-architect.md) | ✅ Live | Designs semantic search architectures, vector databases, chunking strategies, and metadata indexing pipelines. |


### 📁 Cloud & Infrastructure Division (`cloud`)
*Public cloud systems, platform engineers, kubernetes clusters, infrastructure security, and site reliability.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`AWS Cloud Architect`](./cloud/aws-cloud-architect.md) | ✅ Live | Designs highly available, secure, and well-architected systems on AWS. |
| [`Azure Cloud Engineer`](./cloud/azure-cloud-engineer.md) | ✅ Live | Configures and manages enterprise cloud deployments on Microsoft Azure. |
| [`Cloud Cost Optimizer`](./cloud/cloud-cost-optimizer.md) | ✅ Live | Audits cloud invoices, identifying wastage, reserved instance coverages, and autoscaling opportunities. |
| [`Cloud Migration Advisor`](./cloud/cloud-migration-advisor.md) | ✅ Live | Plans datacenter migrations to public clouds using Rehost, Replatform, and Refactor pathways. |
| [`Cloud Security Advisor`](./cloud/cloud-security-advisor.md) | ✅ Live | Reviews cloud security configurations, ensuring compliance with ISO 27001, SOC2, and CIS benchmarks. |
| [`GCP Cloud Engineer`](./cloud/gcp-cloud-engineer.md) | ✅ Live | Designs scale-ready infrastructure on Google Cloud Platform using native services. |
| [`Kubernetes Specialist`](./cloud/kubernetes-specialist.md) | ✅ Live | Configures production Kubernetes clusters, pod scheduling, network policies, and ingress controllers. |
| [`Platform Engineer`](./cloud/platform-engineer.md) | ✅ Live | Builds developer self-service tooling, landing zones, and continuous delivery systems. |
| [`Site Reliability Engineer`](./cloud/site-reliability-engineer.md) | ✅ Live | Defines service level objectives, error budgets, incident response playbooks, and disaster recovery strategies. |
| [`Terraform Specialist`](./cloud/terraform-specialist.md) | ✅ Live | Writes modular Terraform, structuring state files, workspace variables, and locks. |


### 📁 Cybersecurity Division (`cybersecurity`)
*Secure coding principles, network operations, penetration testing, compliance advisors, and risk auditing.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`Application Security Specialist`](./cybersecurity/application-security-specialist.md) | ✅ Live | Audits application source code for OWASP Top 10 vulnerabilities, configuring SAST/DAST pipelines. |
| [`Cloud Security Engineer`](./cybersecurity/cloud-security-engineer.md) | ✅ Live | Implements IAM least privilege policies, cloud security posture monitoring, and secrets managers. |
| [`Ethical Hacking Advisor`](./cybersecurity/ethical-hacking-advisor.md) | ✅ Live | Conducts threat simulations and red-team operations across human, network, and application boundaries. |
| [`Governance Risk Compliance Advisor`](./cybersecurity/governance-risk-compliance-advisor.md) | ✅ Live | Audits processes and designs system configurations to satisfy compliance rules (SOC2, ISO 27001, GDPR). |
| [`Identity Access Management Specialist`](./cybersecurity/identity-access-management-specialist.md) | ✅ Live | Designs directory service integrations, access management controls, and provisioning flows. |
| [`Incident Response Specialist`](./cybersecurity/incident-response-specialist.md) | ✅ Live | Triages active security breaches, structures containment strategies, and performs digital forensics. |
| [`Penetration Testing Coach`](./cybersecurity/penetration-testing-coach.md) | ✅ Live | Runs network-level vulnerability assessments and simulated penetration testing. |
| [`Security Architect`](./cybersecurity/security-architect.md) | ✅ Live | Designs global zero-trust security frameworks, IAM directories, and endpoint controls. |
| [`Security Engineer`](./cybersecurity/security-engineer.md) | ✅ Live | Designs secure infrastructure boundaries, perimeter defense networks, and encryption strategies. |
| [`Security Operations Analyst`](./cybersecurity/security-operations-analyst.md) | ✅ Live | Analyzes security telemetry logs, configure SIEM dashboards, and responds to alerts. |


### 📁 Open Source Division (`open-source`)
*Collaborative repository design, developer community building, open-source documentation, and maintainer guidance.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`Community Builder`](./open-source/community-builder.md) | ✅ Live | Designs community portals, discord guidelines, online events, and contributor recognition models. |
| [`Developer Advocate`](./open-source/developer-advocate.md) | ✅ Live | Bridges developer feedback with core product roadmaps, producing workshops and api demos. |
| [`DevRel Strategist`](./open-source/devrel-strategist.md) | ✅ Live | Aligns developer programs with business metrics, tracking developer acquisitions and community ROI. |
| [`GitHub Growth Advisor`](./open-source/github-growth-advisor.md) | ✅ Live | Advises on repository metadata, README copywriting, issue curation, and community visibility. |
| [`Maintainer Coach`](./open-source/maintainer-coach.md) | ✅ Live | Advises project leads on contributor onboarding, issue labeling, license compliance, and roadmap publishing. |
| [`Open Source Funding Advisor`](./open-source/open-source-funding-advisor.md) | ✅ Live | Guides projects on sponsor directories (GitHub Sponsors, Open Collective) and grant applications. |
| [`Open Source Mentor`](./open-source/open-source-mentor.md) | ✅ Live | Coaches new contributors on git branches, repository issues, and pull request etiquette. |
| [`OSS Contributor Coach`](./open-source/oss-contributor-coach.md) | ✅ Live | Helps developers scale contributions from single commits to regular maintainers of key libraries. |
| [`Project Maintenance Specialist`](./open-source/project-maintenance-specialist.md) | ✅ Live | Automates project builds, configuring lint rules, tests, and publishing workflows. |
| [`Technical Writing Advisor`](./open-source/technical-writing-advisor.md) | ✅ Live | Guides developers in writing clean API guides, release notes, code reviews, and README docs. |


### 📁 Data Engineering Division (`data-engineering`)
*Analytical warehouse construction, stream processors, pipeline schedulers, and database optimizations.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`Analytics Engineer`](./data-engineering/analytics-engineer.md) | ✅ Live | Structures data transformation layers using dbt (data build tool), creating documentation and testing frameworks. |
| [`Business Intelligence Specialist`](./data-engineering/business-intelligence-specialist.md) | ✅ Live | Designs semantic datasets, dashboards, and analytical metrics using PowerBI or Tableau. |
| [`Data Architect`](./data-engineering/data-architect.md) | ✅ Live | Designs corporate data strategies, data mesh architectures, and warehouse schemas. |
| [`Data Engineer`](./data-engineering/data-engineer.md) | ✅ Live | Designs robust analytical pipeline systems, feature databases, and ingestion engines. |
| [`Data Governance Advisor`](./data-engineering/data-governance-advisor.md) | ✅ Live | Defines access control policies, data cataloging rules, and column-level masking models. |
| [`Data Platform Engineer`](./data-engineering/data-platform-engineer.md) | ✅ Live | Deploys cloud-based data storage and analysis platforms using Snowflake, Databricks, or BigQuery. |
| [`Data Quality Engineer`](./data-engineering/data-quality-engineer.md) | ✅ Live | Designs automated validation routines, alerting systems, and data drift dashboards. |
| [`Database Performance Specialist`](./data-engineering/database-performance-specialist.md) | ✅ Live | Audits database resource consumption, index efficiency, and query logs to optimize latency. |
| [`ETL Specialist`](./data-engineering/etl-specialist.md) | ✅ Live | Designs high-throughput batch ETL/ELT pipelines using Airflow, Prefect, or Dagster. |
| [`Stream Processing Specialist`](./data-engineering/stream-processing-specialist.md) | ✅ Live | Designs high-velocity real-time analytical event flows using Kafka or Flink. |


### 📁 Developer Relations Division (`devrel`)
*Developer advocate strategies, technology education, community management, and developer experience.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`API Adoption Consultant`](./devrel/api-adoption-consultant.md) | ✅ Live | Reviews developer APIs, SDK structures, and documentation onboarding to reduce activation barriers. |
| [`Community Growth Specialist`](./devrel/community-growth-specialist.md) | ✅ Live | Designs programmatic referral schemes, user acquisition initiatives, and event plans. |
| [`Conference Speaker Coach`](./devrel/conference-speaker-coach.md) | ✅ Live | Guides developers in preparing technical talk submissions, slide structures, and slide delivery. |
| [`Content Strategy Advisor`](./devrel/content-strategy-advisor.md) | ✅ Live | Plans technical content calendars, writing schedules, and publication distributions. |
| [`Developer Education Specialist`](./devrel/developer-education-specialist.md) | ✅ Live | Designs tutorials, structured learning paths, sample project repos, and technical documentation. |
| [`Developer Evangelist`](./devrel/developer-evangelist.md) | ✅ Live | Presents product value at developer conferences, online meetups, and key technical forums. |
| [`Developer Experience Specialist`](./devrel/developer-experience-specialist.md) | ✅ Live | Reviews local developer environments, CLI ease-of-use, config errors, and initial setup steps. |
| [`Developer Relations Manager`](./devrel/developer-relations-manager.md) | ✅ Live | Manages developer engagement programs, ambassador networks, and metric analysis. |
| [`Technical Community Builder`](./devrel/technical-community-builder.md) | ✅ Live | Moderates developer forums, discord/slack servers, and handles user onboarding strategies. |
| [`Technical Marketing Advisor`](./devrel/technical-marketing-advisor.md) | ✅ Live | Aligns product positioning with developer interests, writing copy and analyzing competition. |


### 📁 Job Automation Division (`job-automation`)
*Automated job discovery, listing filters, pipeline trackers, email outreach cadences, and funnel optimization engines.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`Job Hunter AI`](./job-automation/job-hunter-ai.md) | ✅ Live | An automated job discovery and application tracking companion that manages target queues. |
| [`Job Application Optimizer`](./job-automation/job-application-optimizer.md) | ✅ Live | An AI context tailoring engine that customizes applications, resume bullets, and cover letters for specific job descriptions at scale. |


### 📁 FAANG & Top Tech Division (`faang`)
*Specialized coaches for top-tier tech companies (FAANG+), AI labs, and high-growth platform engineering teams.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`OpenAI Career Coach`](./faang/openai-career-coach.md) | ✅ Live | A specialized coach for OpenAI interview loops, engineering culture, and AI research/engineering positions. |
| [`Google SWE Coach`](./faang/google-swe-coach.md) | ✅ Live | A specialized technical coach for Google Software Engineering (SWE) loops, focusing on DS & Algorithms, complex complexity analysis, clean code structure, and Googleyness & Leadership (G&L). |


### 📁 AI Business Division (`ai-business`)
*Strategic builders, technical PMs, and business architects focusing on launching and scaling AI-first startups, SaaS MVPs, and proprietary data loops.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`AI Founder`](./ai-business/ai-founder.md) | ✅ Live | A strategic AI builder focused on scaling AI-first products, MVPs, and business models. |
| [`AI Consultant`](./ai-business/ai-consultant.md) | ✅ Live | An enterprise AI strategist mapping company problems to LLM/RAG solutions, scoping APIs, drafting security/privacy architectures, and showing ROI. |


### 📁 Modern GTM Division (`gtm`)
*Outreach systems design, waterfall data enrichments, CRM synchronizations, webhooks, and programmatic pipeline automation.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`GTM Engineer`](./gtm/gtm-engineer.md) | ✅ Live | An outreach systems architect who designs clay workflows, API enrichments, and automated cold inbound/outbound setup. |
| [`Clay Specialist`](./gtm/clay-specialist.md) | ✅ Live | A master of Clay workflows, waterfall search logic, AI enrichment prompting, data cleaning, and CSV normalization. |


### 📁 Freelancing Division (`freelancing`)
*Productization, pricing advisory, retainer growth, client acquisition networks, and operation designs for independent consultants.*

| Agent Name | Status | Purpose / Description |
| :--- | :---: | :--- |
| [`Freelance Founder`](./freelancing/freelance-founder.md) | ✅ Live | An independent consultant strategist driving retainer growth, pricing, and client acquisition channels. |
| [`Upwork Specialist`](./freelancing/upwork-specialist.md) | ✅ Live | A profile positioning and proposal writing advisor focused on converting Upwork feeds into closed contracts. |



---

## 🎓 Browse By Career Path

Explore our pre-mapped career growth roadmaps detailing core competencies:

#### 🎓 [AI Engineer](./career-paths/ai-engineer.json)
- **Focus**: Specialist in integrating machine learning, large language models, retrieval augmented generation, and cognitive agents into product architectures.
- **Core Skills Required**: LLMs & Prompt Engineering, RAG & Semantic Search, Python & PyTorch, Agentic Architectures, Model Orchestration
- **Associated Coaches**: ai-agent-architect, llm-engineer, rag-architect, ai-engineer-career-coach

#### 🎓 [Backend Engineer](./career-paths/backend-engineer.json)
- **Focus**: Specialized engineer focused on server-side logic, API design, database structures, security, caching, and scalability.
- **Core Skills Required**: API Design (REST/GraphQL), Database Architecture & Indexing, Distributed Systems, Server-Side Languages (Go, Python, Java, Node.js), Performance Engineering
- **Associated Coaches**: backend-architect, database-engineer, system-design-coach

#### 🎓 [Cloud Engineer](./career-paths/cloud-engineer.json)
- **Focus**: Focused on provisioning public cloud infrastructure, maintaining high availability, designing scalable networks, and managing containerized systems.
- **Core Skills Required**: AWS / GCP / Azure, Terraform & IaC, Kubernetes & Containers, Networking & VPCs, Site Reliability (SRE)
- **Associated Coaches**: aws-cloud-architect, kubernetes-specialist, terraform-specialist, site-reliability-engineer

#### 🎓 [Cybersecurity Engineer](./career-paths/cybersecurity-engineer.json)
- **Focus**: Dedicated to securing software systems, identifying vulnerabilities, configuring access controls, and responding to security incidents.
- **Core Skills Required**: Application Security & OWASP, Identity & Access Management (IAM), Threat Modeling & Pen Testing, Incident Response & Forensics, Regulatory Compliance (SOC2/GDPR)
- **Associated Coaches**: application-security-specialist, cloud-security-engineer, incident-response-specialist, governance-risk-compliance-advisor

#### 🎓 [DevOps Engineer](./career-paths/devops-engineer.json)
- **Focus**: Bridging development and operations to automate software delivery pipelines, manage configuration state, and ensure infrastructure reliability.
- **Core Skills Required**: CI/CD Pipelines, Configuration Management, Infrastructure as Code, Monitoring & Logging, Build Tools & Packaging
- **Associated Coaches**: devops-engineer, platform-engineer, site-reliability-engineer

#### 🎓 [Frontend Engineer](./career-paths/frontend-engineer.json)
- **Focus**: Specialized engineer focused on client-side applications, user interfaces, performance optimization, and modern web frameworks.
- **Core Skills Required**: JavaScript / TypeScript, React / Next.js, CSS & Styling, Web Vitals & Performance, API Integration
- **Associated Coaches**: nextjs-performance-engineer, portfolio-reviewer, ats-resume-reviewer

#### 🎓 [Full Stack Engineer](./career-paths/full-stack-engineer.json)
- **Focus**: Versatile engineer capable of building and maintaining both client-side and server-side components of modern web applications.
- **Core Skills Required**: Frontend Frameworks, Backend APIs, Database Design, Cloud Deployments, End-to-End Testing
- **Associated Coaches**: mern-architect, code-reviewer, placement-coach

#### 🎓 [Product Manager](./career-paths/product-manager.json)
- **Focus**: Connecting technology, business, and design to define product features, scope releases, prioritize roadmaps, and align cross-functional teams.
- **Core Skills Required**: Product Roadmap Planning, User Interviewing & Feedback, Prioritization Frameworks, Market & Competitor Analysis, Data-Driven Decisions
- **Associated Coaches**: product-manager, product-manager-coach, market-research-analyst

#### 🎓 [Software Engineer](./career-paths/software-engineer.json)
- **Focus**: Generalist software engineer focused on building robust applications, CS fundamentals, algorithms, and collaborative team delivery.
- **Core Skills Required**: Data Structures & Algorithms, Object Oriented Design, System Design, Version Control (Git), Testing & Debugging
- **Associated Coaches**: google-interview-coach, technical-interview-coach, code-reviewer, mock-interviewer

#### 🎓 [Startup Founder](./career-paths/startup-founder.json)
- **Focus**: Building a business from scratch, scoping MVPs, testing market fit, structuring go-to-market strategies, and managing early unit economics.
- **Core Skills Required**: MVP Scoping & Validation, Go-To-Market Execution, Unit Economics & Token Economics, Outreach Systems Design, Founder Pitching & Narrative
- **Associated Coaches**: founder-advisor, growth-strategist, ai-product-builder, market-research-analyst


---

## 🏢 Browse By Company

Target and clear Tier-1 interviews with company-specific tracks:

#### 🏢 [Amazon](./companies/amazon.json)
- **Interview Rounds**: Online Assessment: coding test + system simulation (90 min), Recruiter screen, Onsite Loop (The Loop): 3-4 coding/system design rounds, with each round dedicating 20+ minutes to behavioral questions testing the 16 Leadership Principles
- **Key Competency Focus**: 16 Leadership Principles (Customer Obsession, Ownership, Bias for Action), STAR Behavioral Storytelling, Data Structures & Algorithms, System Design & Database selections
- **Recommended Coaches**: amazon-interview-coach, behavioral-interview-specialist, system-design-coach, mock-interviewer

#### 🏢 [Atlassian](./companies/atlassian.json)
- **Interview Rounds**: Recruiter screen and interactive coding challenge, Onsite loop: 1 system design round, 1 coding round, 1 values fit round, 1 management/behavioral round
- **Key Competency Focus**: Atlassian core values (Open Company No Bullshit), Collaborative system design structures, Active listening and giving structured feedback, Frontend UI performance and layout
- **Recommended Coaches**: atlassian-interview-coach, behavioral-interview-specialist, group-discussion-coach, mock-interviewer

#### 🏢 [Databricks](./companies/databricks.json)
- **Interview Rounds**: Recruiter screen and algorithmic online assessment, Technical phone interview: distributed coding problem, Onsite loop: 2 database/systems design rounds, 2 systems coding rounds, 1 behavioral values round
- **Key Competency Focus**: Distributed computing algorithms, Database internals (caching, query planning, indexing), Concurrency and systems performance, Spark/Delta Lake execution logic
- **Recommended Coaches**: database-engineer, backend-architect, system-design-coach, mock-interviewer

#### 🏢 [Google](./companies/google.json)
- **Interview Rounds**: Recruiter screening phone call (30 min), Technical phone screen: 1 DSA coding round (45 min), Onsite loop: 3 DSA coding rounds, 1 System Design round, 1 Googliness & Leadership round (45 min each)
- **Key Competency Focus**: Data Structures & Algorithms (graphs, dynamic programming, trees), System Design & Scalability, Googliness (cultural fit, collaboration, ambiguity navigation), Space & Time Complexity Analysis
- **Recommended Coaches**: google-interview-coach, technical-interview-coach, system-design-coach, mock-interviewer

#### 🏢 [Meta](./companies/meta.json)
- **Interview Rounds**: Technical phone screen: 2 DSA coding questions (45 min), Onsite loop: 2 Coding rounds, 1 System Design round, 1 Behavioral/Culture round (45 min each)
- **Key Competency Focus**: High-speed coding accuracy (solving 2 DSA questions in 35 minutes), System Design scaling (focusing on caching, load balancing, message queues), Meta core values (Focus on Impact, Move Fast)
- **Recommended Coaches**: meta-interview-coach, technical-interview-coach, system-design-coach, mock-interviewer

#### 🏢 [Microsoft](./companies/microsoft.json)
- **Interview Rounds**: Recruiter screen + initial technical screen, Onsite loop: 4 technical rounds covering coding, system design, and growth mindset scenarios
- **Key Competency Focus**: CS Fundamentals (pointers, memory management, OOP), Growth Mindset (learning from failure, collaboration), Distributed Service Architecture
- **Recommended Coaches**: microsoft-interview-coach, technical-interview-coach, system-design-coach, mock-interviewer

#### 🏢 [Netflix](./companies/netflix.json)
- **Interview Rounds**: Recruiter screen and phone technical interview, Onsite loop: 2 technical coding/system design rounds, 2 culture/behavioral rounds evaluating feedback loops and the culture slide deck
- **Key Competency Focus**: Freedom & Responsibility slide deck principles, High-throughput CDN architectures, Autonomy and direct feedback loops (Radical Candor), Resilience engineering (Chaos Monkey)
- **Recommended Coaches**: netflix-interview-coach, behavioral-interview-specialist, system-design-coach, mock-interviewer

#### 🏢 [OpenAI](./companies/openai.json)
- **Interview Rounds**: Recruiter screen and take-home practical engineering assignment, Technical phone screen: review take-home assignment and coding test, Onsite loop: 4-5 rounds covering PyTorch coding, distributed training systems, AI safety/alignment, and executive values
- **Key Competency Focus**: PyTorch scale training models, Transformer mechanics and scaling math, AI Safety & alignment criteria, GPU memory optimizations
- **Recommended Coaches**: llm-engineer, ai-agent-architect, ai-engineer-career-coach, mock-interviewer

#### 🏢 [Stripe](./companies/stripe.json)
- **Interview Rounds**: Recruiter screen and phone interview (coding/debugging), Onsite loop: 1 practical integration coding round, 1 bug squash debugging round, 1 system architecture round, 1 leadership/behavioral round
- **Key Competency Focus**: Practical API design and integration, Squashing bugs in large codebases, Clean code refactoring and design structures, Unit testing
- **Recommended Coaches**: code-reviewer, backend-architect, technical-interview-coach, mock-interviewer

#### 🏢 [Uber](./companies/uber.json)
- **Interview Rounds**: Recruiter screen and online coding test, Technical phone interview: coding and systems baseline questions, Onsite loop: 2 coding rounds, 2 system architecture scaling rounds, 1 behavioral bar raiser round
- **Key Competency Focus**: Geohashing and spatial search coordinates index (H3, S2), Real-time stream message scheduling, High write concurrency structures, Fault-tolerance modeling
- **Recommended Coaches**: uber-interview-coach, system-design-coach, database-engineer, mock-interviewer


---

## 🔄 Workflows

Workflows are repeatable pipelines guiding you step-by-step through career milestones:

- [**ATS Optimization**](./workflows/ats-optimization.md): A repeatable resume operating system for candidates who apply through portals, campus systems, and enterprise hiring platforms. Optimizes resume structures, headings, and keyword mapping to survive ATS parsing.
  - **Recommended Agents**: ats-resume-reviewer, resume-strategist, job-search-strategist, linkedin-growth-advisor, placement-coach
- [**FAANG Preparation**](./workflows/faang-preparation.md): Targeted preparation pipeline for high-tier tech companies (FAANG+), aligning algorithms, system design, and leadership principles prep.
  - **Recommended Agents**: google-interview-coach, amazon-interview-coach, meta-interview-coach, microsoft-interview-coach, system-design-coach, mock-interviewer
- [**Fresher Placement**](./workflows/fresher-placement.md): Step-by-step guidance for college students and recent grads navigating their first job hunt and campus placement cycles.
  - **Recommended Agents**: placement-coach, graduate-career-advisor, ats-resume-reviewer, mock-interviewer, networking-coach
- [**HR Interview Week**](./workflows/hr-interview-week.md): Intense behavioral prep week covering common HR screening, culture fit, and soft-skill evaluation challenges.
  - **Recommended Agents**: hr-interview-coach, behavioral-interview-specialist, mock-interviewer, recruiter-communication-coach
- [**Internship Hunt**](./workflows/internship-hunt.md): Tactical action plan for finding, applying to, and landing summer/semester internships.
  - **Recommended Agents**: internship-application-strategist, networking-coach, ats-resume-reviewer, cold-outreach-specialist, graduate-career-advisor
- [**LinkedIn Growth**](./workflows/linkedin-growth.md): Personal branding and network expansion strategy to attract recruiters, founders, and industry peers.
  - **Recommended Agents**: linkedin-growth-advisor, personal-branding-advisor, networking-coach, recruiter-outreach-specialist
- [**Offer Comparison**](./workflows/offer-comparison.md): Analytical approach to evaluating multiple job offers across total compensation, equity, career growth, and work-life balance.
  - **Recommended Agents**: offer-evaluation-advisor, salary-benchmark-analyst, salary-negotiation-coach
- [**Remote Job Hunt**](./workflows/remote-job-hunt.md): Navigating the specialized remote job market, optimizing for global companies, and establishing remote collaboration proof.
  - **Recommended Agents**: remote-work-advisor, job-search-strategist, cold-outreach-specialist, linkedin-outreach-specialist
- [**Salary Negotiation**](./workflows/salary-negotiation.md): Tactics and script preparation for maximizing base salary, equity, and benefits during the offer stage.
  - **Recommended Agents**: salary-negotiation-coach, salary-benchmark-analyst, offer-evaluation-advisor, recruiter-communication-coach
- [**Technical Interview Week**](./workflows/technical-interview-week.md): High-intensity technical prep covering DSA drills, system design practice, and clean code principles.
  - **Recommended Agents**: technical-interview-coach, system-design-coach, mock-interviewer, code-reviewer

---

## 🔗 Knowledge Graph

Career-Agents compiles a complex, expanded **[knowledge-graph.json](./knowledge-graph.json)** mapping dependencies across:
- **Agents** $ightarrow$ Belongs to **Divisions** $ightarrow$ Used in **Workflows**
- **Career Paths** $ightarrow$ Requires **Skills** $ightarrow$ Uses **Agents**
- **Companies** $ightarrow$ Requires **Skills** $ightarrow$ Prepped by **Workflows**
- **Bundles** $ightarrow$ Packs **Agents**, **Career Paths**, and **Companies**

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
- [Contributor Recognition Levels](./CONTRIBUTOR_LEVELS.md)
- [Ambassador Program](./AMBASSADOR_PROGRAM.md)
- [Hall of Fame](./HALL_OF_FAME.md)
- [Maintainers Code Owners](./MAINTAINERS.md)
- [Community Onboarding Guide](./COMMUNITY_GUIDE.md)
- [Certification Program](./docs/CERTIFICATION.md)
- [Ecosystem Asset Guide](./docs/ASSETS.md)
- [Who Uses Career OS](./WHO_USES_CAREER_OS.md)
- [Ecosystem Case Studies](./CASE_STUDIES.md)
- [Ecosystem Success Stories](./SUCCESS_STORIES.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Security Policy](./SECURITY.md)

---

## 🎖️ Project Contributors

This repository is maintained and expanded by:
- **Karthik Rajesh Shet** ([@karthikrshet](https://github.com/karthikrshet)) - Founder & Core Architect

---

## 🗺️ Roadmap

Check out the full release timeline in [RELEASE_MILESTONES.md](./RELEASE_MILESTONES.md).

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
