# Claude Desktop Integration Guide

This guide details how to integrate the **Career-Agents MCP Server** directly into your **Claude Desktop** application to natively discover agents, run profile assessments, match resumes, and review interview paths.

---

## 🛠️ Step-by-Step Installation

1.  **Open Claude Desktop Config File:**
    Navigate to the configurations directory on your local machine:
    - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
    - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
2.  **Add Career-Agents Server Configuration:**
    Open the JSON file in an editor and add the `career-agents` stdio transport details under the `mcpServers` object:
    ```json
    {
      "mcpServers": {
        "career-agents": {
          "command": "node",
          "args": ["d:/CodeMyFYP-Agents/scripts/cli.js", "mcp"]
        }
      }
    }
    ```
    *(Note: Replace `d:/CodeMyFYP-Agents` with the absolute path of your local repository clones).*
3.  **Restart Claude Desktop:**
    Close and relaunch the Claude Desktop client. If connected, a hammer icon will appear in the input chat bar showing the registered tools list.

---

## 🚀 Usage & Examples

Ask Claude to execute specialized career coaching or resume analysis queries:

### Example 1: Target Company Interview Tracks
- **Query:** *"Find the best Career-Agents for preparing for Atlassian SDE interviews."*
- **Execution Flow:**
  1. Claude automatically invokes the `company_track` tool to retrieve the Atlassian prep track.
  2. Claude calls `recommend_agents` to match candidate skills with Atlassian-specific prompt agents.
  3. Claude returns a structured study playbook.

### Example 2: Resume Audit
- **Query:** *"Score this resume: [Paste resume text]"*
- **Execution Flow:**
  1. Claude calls `resume_score` to run layout, skills density, and metric analysis.
  2. Returns overall compliance metrics and optimization tasks.
