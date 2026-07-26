# Career OS — MCP Server

Model Context Protocol integration for AI-native IDE experiences.

---

## What Is MCP?

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open standard that lets AI assistants (like Claude, Cursor, Continue) access external tools and data sources. Career OS implements an MCP server that exposes your career intelligence tools directly inside your code editor.

With the Career OS MCP server, your AI assistant can:
- Search and recommend career agents
- Analyze your GitHub profile
- Review your resume for ATS compliance
- Look up company-specific interview prep tracks
- Generate career roadmaps
- Match job postings to your skills
- Build structured interview prep plans

---

## Available MCP Tools

The Career OS MCP server (`mcp/server.js`) exposes the following tools:

| Tool | Description |
|---|---|
| `search_agents` | Search the 146-agent registry by keyword, domain, or skill |
| `recommend_agents` | Get agent recommendations for a specific career situation |
| `career_assessment` | Assess a career profile and generate a gap analysis |
| `resume_score` | Score a resume text for ATS compatibility |
| `resume_review` | Full resume review with weak bullet detection and keyword analysis |
| `job_match` | Match a candidate profile to a job description |
| `company_track` | Get company-specific interview prep track (Google, Meta, etc.) |
| `career_path` | Look up available career paths from the registry |
| `workflow_lookup` | Fetch workflow definitions (fresher-placement, internship-hunt, etc.) |
| `agent_details` | Get full details and system prompt for a specific agent |
| `knowledge_graph` | Query the career knowledge graph for relationships |
| `career_gap_analysis` | Analyze skill gaps between current profile and target role |
| `analyze_github_profile` | Analyze a GitHub user's public profile and repositories |
| `linkedin_profile_review` | Review and optimize a LinkedIn profile description |
| `linkedin_review` | Score and improve a LinkedIn headline and summary |
| `career_action_plan` | Generate a structured career action plan |
| `github_review` | Score a GitHub profile with improvement recommendations |
| `career_dashboard` | Get an overview of career scores and metrics |
| `mock_interview` | Generate interview questions for a company and role |
| `roadmap` | Build a career roadmap from current to target state |
| `search_jobs` | Search for relevant job postings |
| `analyze_job_posting` | Analyze a job posting URL for key requirements |
| `generate_resume_docx` | Generate a resume as a `.docx` file |
| `generate_interview_prep_pdf` | Generate a company-specific interview prep guide as PDF |
| `generate_career_roadmap_xlsx` | Generate a career roadmap as an Excel spreadsheet |

---

## Protocol Details

- **Protocol:** stdio (JSON-RPC 2.0 over stdin/stdout)
- **Rate Limit:** 200 requests per minute
- **Logs:** Written to `exports/logs/mcp.log` and `exports/logs/mcp_audit.log`
- **Data sources:** `agent-registry.json`, `companies.json`, `career-paths.json`, `workflow-registry.json`, `knowledge-graph.json`, `search-index.json`

---

## Installation

### Prerequisites

- Node.js ≥ 18
- Career OS repository cloned locally

```bash
git clone https://github.com/karthikrshet/Career-Agents.git
cd Career-Agents
npm install
```

### Run the MCP Server

```bash
node mcp/server.js
```

Or install globally via npm:

```bash
npm install -g career-agents
career-agents
```

---

## IDE Configuration

### Cursor

Add to `~/.cursor/mcp.json` (or `<project>/.cursor/mcp.json` for project-level):

```json
{
  "mcpServers": {
    "career-agents": {
      "command": "node",
      "args": ["/absolute/path/to/Career-Agents/mcp/server.js"],
      "env": {}
    }
  }
}
```

If installed globally:
```json
{
  "mcpServers": {
    "career-agents": {
      "command": "career-agents",
      "args": [],
      "env": {}
    }
  }
}
```

Restart Cursor. The MCP tools will appear in the AI assistant panel.

---

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or  
`%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "career-agents": {
      "command": "node",
      "args": ["/absolute/path/to/Career-Agents/mcp/server.js"]
    }
  }
}
```

Restart Claude Desktop. You can now ask Claude to use career tools directly.

**Example prompts:**
- `"Use career-agents to find the best agents for interview prep"`
- `"Analyze my GitHub profile @username using career-agents"`
- `"Generate a career roadmap from Junior SWE to Staff Engineer"`

---

### VS Code with Continue

Add to your Continue config (`~/.continue/config.json`):

```json
{
  "mcpServers": [
    {
      "name": "career-agents",
      "command": "node",
      "args": ["/absolute/path/to/Career-Agents/mcp/server.js"]
    }
  ]
}
```

---

### Aider

Run alongside Aider using the `--mcp-server` flag (if supported by your Aider version):

```bash
aider --mcp-server "node /path/to/Career-Agents/mcp/server.js"
```

---

### Bolt.new / Bolt Desktop

In Bolt settings, add a custom MCP server:
- **Command:** `node`
- **Args:** `/absolute/path/to/Career-Agents/mcp/server.js`

---

## Using MCP Tools

Once configured, you can invoke career tools naturally in your AI conversation:

```
"Search for agents related to system design interviews"
→ Calls: search_agents({ query: "system design" })

"What are the interview prep tracks for Meta?"
→ Calls: company_track({ company: "meta" })

"Analyze github.com/torvalds"
→ Calls: analyze_github_profile({ username: "torvalds" })

"Generate interview questions for a Google L5 behavioral round"
→ Calls: mock_interview({ company: "google", role: "Software Engineer", level: "L5", mode: "behavioral" })

"Build a career roadmap from junior engineer to staff engineer"
→ Calls: roadmap({ from: "junior engineer", to: "staff engineer" })
```

---

## MCP Registry Data

The MCP server reads and exposes data from these registry files:

| Registry | Description | Records |
|---|---|---|
| `agent-registry.json` | All 146 AI agents with metadata | 146 agents |
| `divisions.json` | 19 career divisions with agent groupings | 19 divisions |
| `companies.json` | Company interview prep tracks | Multiple companies |
| `career-paths.json` | Pre-defined career path progressions | Multiple paths |
| `workflow-registry.json` | Multi-step career workflows | Multiple workflows |
| `knowledge-graph.json` | Agent + skill relationship graph | Nodes + edges |
| `search-index.json` | Full-text search index | All entities |

---

## Troubleshooting

**MCP server not connecting:**
- Verify Node.js ≥ 18 is installed: `node --version`
- Check the absolute path to `mcp/server.js` is correct
- Check IDE MCP logs for errors

**Tools not appearing:**
- Restart your IDE/Claude Desktop after updating the config
- Verify JSON config syntax is valid (no trailing commas)

**Rate limit errors:**
- The server allows 200 requests/minute
- Reduce frequency or restart the server to reset the counter

**Permission errors:**
- Ensure the `exports/logs/` directory is writable
- The server creates this directory automatically if it doesn't exist
