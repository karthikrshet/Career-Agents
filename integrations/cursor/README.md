# Cursor IDE Integration Guide

This guide details how to integrate the **Career-Agents MCP Server** directly into your **Cursor** editor to natively discover agents, run career assessments, score resumes, and lookup workflows inside your coding environment.

---

## 🛠️ Step-by-Step Configuration

1.  **Open Cursor Settings:**
    Click on the gear icon in the top right corner of the Cursor editor, or press `Ctrl + ,` (or `Cmd + ,` on macOS) and navigate to **Cursor Settings**.
2.  **Add MCP Server:**
    - Go to **Features** -> **MCP**.
    - Click **+ Add New MCP Server**.
    - Fill out the configuration fields:
      *   **Name:** `career-agents`
      *   **Type:** `command`
      *   **Command:** `node d:/CodeMyFYP-Agents/scripts/cli.js mcp`
    *(Note: Replace `d:/CodeMyFYP-Agents` with the absolute path of your local repository clones).*
    - Click **Save**.
3.  **Confirm Status:**
    Verify that the green status indicator appears next to the `career-agents` MCP server, indicating successful connection.

---

## 🚀 Usage & Examples

Ask Cursor's Chat panel (`Ctrl + L` / `Cmd + L`) or Composer (`Ctrl + I` / `Cmd + I`) to perform tasks using the MCP tools:

### Example 1: Run Career Assessment
- **Query:** *"Run a career assessment using MCP. My roadmap is incomplete (score 1), my resume is generic (score 1), my interview prep is weak (score 1), but my networking is strong (score 3) and my portfolio is solid (score 3)."*
- **Execution Flow:**
  - Cursor calls `career_assessment` with the respective scores.
  - Returns combined score metrics and actionable growth links.

### Example 2: Score Local Resume
- **Query:** *"Audit the resume text in my open file using the `resume_score` tool and output suggested metrics."*
- **Execution Flow:**
  - Cursor reads the active file, passes the text to `resume_score`, and summarizes formatting and keyword improvements.
