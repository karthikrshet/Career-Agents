# Model Context Protocol (MCP) Guide

Career OS exposes specialized tool APIs and registries over the Model Context Protocol stdio transport.

## Setup Instructions

### 1. Claude Desktop Setup
Add the following configuration block under `%APPDATA%/Claude/claude_desktop_config.json` (Windows) or `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):
```json
{
  "mcpServers": {
    "career-agents": {
      "command": "npx",
      "args": ["-y", "career-agents", "mcp"]
    }
  }
}
```

### 2. Cursor Setup
Go to **Settings** → **Features** → **MCP** → **Add New MCP Server**:
- **Name**: `career-agents`
- **Type**: `stdio`
- **Command**: `npx -y career-agents mcp`

---

## Tool API Reference

### `resume_review`
- **Description**: Performs a completeness audit and target company readiness analysis.
- **Parameters**: `resumeText: string` (required), `company: string` (optional).

### `github_review`
- **Description**: Evaluates open-source portfolio repositories, README quality, and star counts.
- **Parameters**: `username: string` (required).

### `linkedin_review`
- **Description**: Analyzes tagline keyword optimization and summary story outlines on LinkedIn.
- **Parameters**: `profileText: string` (required).

### `career_dashboard`
- **Description**: Retrieves overall Career-OS scores, weekly checklists, and learning progress.

### `mock_interview`
- **Description**: Conducts interview loop evaluation scoring against company question templates.
- **Parameters**: `company: string` (required), `mode: string` (required), `qaPairs: string` (required).

### `roadmap`
- **Description**: Generates customized 30-60-90 Day career progression roadmaps.
- **Parameters**: `company: string` (required).
