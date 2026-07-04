# Windsurf IDE Integration Guide

This guide details how to integrate the **Career-Agents MCP Server** directly into your **Windsurf** code editor to natively support agent discovery, career assessments, and resume auditing.

---

## 🛠️ Step-by-Step Configuration

1.  **Open Windsurf Settings:**
    Launch the Windsurf editor, open the Command Palette (`Ctrl + Shift + P` or `Cmd + Shift + P`), search for **Windsurf Settings**, and navigate to **MCP Server Integrations**.
2.  **Add Configuration:**
    Click on **Add Server** and supply the following key-value configs:
    - **ID:** `career-agents`
    - **Type:** `command`
    - **Command:** `node d:/CodeMyFYP-Agents/scripts/cli.js mcp`
    *(Note: Replace `d:/CodeMyFYP-Agents` with the absolute path of your local repository clones).*
3.  **Verify Connection:**
    Check the connection dashboard to ensure the active tools status is displaying green.

---

## 🚀 Usage & Examples

Trigger prompt requests directly in the Windsurf chat pane:

### Example 1: View Company Track
- **Query:** *"Query the `company_track` tool for Google and list recommended agents."*
- **Execution Flow:**
  - Windsurf requests the `company_track` details for `google`.
  - Lists interview structures, recommended agents, and resources.

### Example 2: Find Workflows
- **Query:** *"Find the workflows associated with salary negotiation using MCP."*
- **Execution Flow:**
  - Windsurf runs a search or calls `workflow_lookup` for `salary-negotiation` and formats the checklist guidelines.
