# MCP Example: Resume Review Loop

This example demonstrates how an AI coding assistant interacts with the Career-Agents MCP server to audit and score a developer's resume.

---

## 🔄 Protocol JSON-RPC Interaction

### 1. Client Requests Scorer Execution
The client sends the resume JSON content to the `resume_score` tool:
```json
{
  "jsonrpc": "2.0",
  "id": 101,
  "method": "tools/call",
  "params": {
    "name": "resume_score",
    "arguments": {
      "resumeText": "{\"header\":{\"name\":\"Jane Doe\",\"email\":\"jane@example.com\",\"phone\":\"+1-555-0100\"},\"skills\":[\"React\",\"TypeScript\",\"SQL\"],\"experience\":[{\"role\":\"SWE\",\"company\":\"Globex\",\"duration\":\"2023-Present\",\"bullets\":[\"Designed backend API microservices.\"]}]}"
    }
  }
}
```

### 2. Server Response
The server processes the metrics and returns the score report:
```json
{
  "jsonrpc": "2.0",
  "id": 101,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\n  \"overallScore\": 71,\n  \"subscores\": {\n    \"formatting\": 20,\n    \"keywords\": 12,\n    \"experience\": 24,\n    \"impact\": 15\n  },\n  \"recommendations\": [\n    \"Add a missing core section: \\\"education\\\"\",\n    \"Include \\\"github\\\" in the header contact details\",\n    \"Expand your skills profile; include more tools and languages relevant to your role\",\n    \"Quantify your impact. Add metrics (%, $, numbers) to at least 40% of your experience bullets\"\n  ]\n}"
      }
    ]
  }
}
```
