# MCP Example: FAANG Optimization Loop

This example demonstrates how an AI assistant audits a candidate's resume for a target FAANG company.

---

## 🔄 Protocol JSON-RPC Interaction

### 1. Client Requests Company Track details
```json
{
  "jsonrpc": "2.0",
  "id": 103,
  "method": "tools/call",
  "params": {
    "name": "company_track",
    "arguments": {
      "company": "google"
    }
  }
}
```

### 2. Server Response
```json
{
  "jsonrpc": "2.0",
  "id": 103,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\n  \"id\": \"google\",\n  \"name\": \"Google\",\n  \"interview_process\": [\n    \"1. Technical phone screen (Algorithms/Data Structures)\",\n    \"2. Onsite: 3x Coding (DS & Algorithms)\",\n    \"3. Onsite: 1x System Design\",\n    \"4. Onsite: 1x Behavioral (Googliness & Leadership)\"\n  ],\n  \"skills\": [\n    \"Data Structures & Algorithms\",\n    \"Distributed System Design\",\n    \"Googliness (Cultural alignment)\",\n    \"Complexity Analysis\"\n  ],\n  \"agents\": [\n    \"google-interview-coach\",\n    \"technical-interview-coach\",\n    \"system-design-coach\"\n  ]\n}"
      }
    ]
  }
}
```
