# OpenCode Integration Guide

This guide details how to integrate the **Career-Agents MCP Server** directly into your **OpenCode** IDE configuration to support agent discovery, career assessments, and resume score diagnostics.

---

## 🛠️ Step-by-Step Configuration

1.  **Open OpenCode Configuration:**
    Navigate to the OpenCode editor's extension workspace settings or configuration panel.
2.  **Add MCP Server Configuration:**
    Configure a command transporter for the local binary execution:
    - **Name:** `career-agents`
    - **Type:** `command`
    - **Command:** `node`
    - **Arguments:** `["d:/CodeMyFYP-Agents/scripts/cli.js", "mcp"]`
    *(Note: Replace `d:/CodeMyFYP-Agents` with the absolute path of your local repository clones).*
3.  **Confirm Activation:**
    Restart the editor process and check the logs tab to verify successful handshake.

---

## 🚀 Usage & Examples

Query the OpenCode assistant window for career optimization:

-   **Query:** *"Audit my current resume using the MCP tools."*
-   **Execution Flow:**
    - OpenCode reads the file and invokes `resume_score` to output recommendations.
-   **Query:** *"What AI agents are available for data engineering?"*
-   **Execution Flow:**
    - OpenCode invokes `search_agents` with query `data-engineering` and returns a list.
