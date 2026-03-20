# MCP Example: Job Search Match Loop

This example demonstrates how an AI coding assistant interacts with the Career-Agents MCP server to match a candidate's profile against a target job description.

---

## 🔄 Protocol JSON-RPC Interaction

### 1. Client Requests Match
The client provides the resume JSON string and the job description:
```json
{
  "jsonrpc": "2.0",
  "id": 102,
  "method": "tools/call",
  "params": {
    "name": "job_match",
    "arguments": {
      "resume": "{\"skills\":[\"React\",\"TypeScript\",\"Node.js\"]}",
      "jobDescription": "We are seeking a React developer with Node.js and AWS deployment experience."
    }
  }
}
```

### 2. Server Response
The server evaluates the overlap and returns recommended career accelerators:
```json
{
  "jsonrpc": "2.0",
  "id": 102,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\n  \"matchPercentage\": 67,\n  \"matchedKeywords\": [\"react\", \"node.js\"],\n  \"missingKeywords\": [\"aws\"],\n  \"strengths\": [\"react\", \"node.js\"],\n  \"weaknesses\": [\"aws\"],\n  \"suggestions\": [\n    \"Integrate missing keywords into your skills profile: aws.\",\n    \"Provide project evidence demonstrating usage of aws in your work experience bullets.\"\n  ],\n  \"recommendations\": {\n    \"paths\": [\"frontend-engineer\"],\n    \"workflows\": [\"ats-optimization\"],\n    \"agents\": [\"nextjs-performance-engineer\", \"portfolio-reviewer\"]\n  }\n}"
      }
    ]
  }
}
```
