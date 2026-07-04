# MCP Example: Career Switch / Transition Loop

This example demonstrates how an AI coding assistant interacts with the Career-Agents MCP server to help a candidate pivot from a non-technical role into software engineering.

---

## 🔄 Protocol JSON-RPC Interaction

### 1. Client Requests Recommendations
The client invokes the `recommend_agents` tool passing the candidate's current non-technical skills, experience level, and target engineering role:
```json
{
  "jsonrpc": "2.0",
  "id": 201,
  "method": "tools/call",
  "params": {
    "name": "recommend_agents",
    "arguments": {
      "skills": "Project Management, Excel, SQL, Basic Python",
      "experience": "mid",
      "role": "software-engineer",
      "company": "stripe"
    }
  }
}
```

### 2. Server Response
The server processes the candidate profile against the catalog, matching target company rubrics, and returns the recommendations:
```json
{
  "jsonrpc": "2.0",
  "id": 201,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\n  \"recommended_agents\": [\n    {\n      \"id\": \"career-pivot-to-tech-advisor\",\n      \"name\": \"Career Pivot to Tech Advisor\",\n      \"description\": \"A transition strategist for non-technical professionals entering the tech industry...\"\n    },\n    {\n      \"id\": \"technical-interview-coach\",\n      \"name\": \"Technical Interview Coach\"\n    }\n  ],\n  \"recommended_workflows\": [\n    {\n      \"id\": \"ats-optimization\",\n      \"name\": \"ATS Optimization\"\n    }\n  ],\n  \"recommended_bundles\": [\n    {\n      \"id\": \"career-switch-bundle\",\n      \"name\": \"Career Switcher & Pivot Bundle\"\n    }\n  ]\n}"
      }
    ]
  }
}
```

### 3. Client Looks Up Workflow Details
To help the user follow the transition path, the client requests details for the recommended `ats-optimization` workflow:
```json
{
  "jsonrpc": "2.0",
  "id": 202,
  "method": "tools/call",
  "params": {
    "name": "workflow_lookup",
    "arguments": {
      "workflow": "ats-optimization"
    }
  }
}
```

### 4. Server Response
The server returns the specific execution steps and prerequisites for the workflow:
```json
{
  "jsonrpc": "2.0",
  "id": 202,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\n  \"steps\": [\n    \"Create the baseline record.\",\n    \"Run a parse-safety audit.\",\n    \"Normalize the format.\",\n    \"Build a keyword map.\",\n    \"Map keywords to evidence.\",\n    \"Rewrite bullets for impact.\"\n  ],\n  \"agents\": [\n    \"ats-resume-reviewer\",\n    \"resume-strategist\"\n  ],\n  \"estimated_time\": \"3 weeks\"\n}"
      }
    ]
  }
}
```
