# MCP Example: Startup Founder / MVP Strategy Loop

This example demonstrates how an AI coding assistant interacts with the Career-Agents MCP server to assist a startup founder with MVP scoping, growth strategizing, and finding specialized advisory agents.

---

## 🔄 Protocol JSON-RPC Interaction

### 1. Client Searches for Startup Agents
The client calls `search_agents` to discover agents tagged with or matching "founder" or "startup":
```json
{
  "jsonrpc": "2.0",
  "id": 301,
  "method": "tools/call",
  "params": {
    "name": "search_agents",
    "arguments": {
      "query": "founder"
    }
  }
}
```

### 2. Server Response
The server returns matches from the agent catalog:
```json
{
  "jsonrpc": "2.0",
  "id": 301,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "[\n  {\n    \"id\": \"founder-advisor\",\n    \"name\": \"Founder Advisor\",\n    \"division\": \"startup\",\n    \"description\": \"A strategic advisor who helps founders validate early-stage MVPs, map target GTM channels, scope unit economics, and prepare investor pitches...\"\n  }\n]"
      }
    ]
  }
}
```

### 3. Client Queries the Knowledge Graph
To find connected skills and paths related to "founder-advisor", the client invokes `knowledge_graph`:
```json
{
  "jsonrpc": "2.0",
  "id": 302,
  "method": "tools/call",
  "params": {
    "name": "knowledge_graph",
    "arguments": {
      "entity": "founder-advisor"
    }
  }
}
```

### 4. Server Response
The server maps node relationships and returns the grouped network elements:
```json
{
  "jsonrpc": "2.0",
  "id": 302,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\n  \"connected_agents\": [\n    \"Founder Advisor\",\n    \"Growth Strategist\"\n  ],\n  \"companies\": [],\n  \"paths\": [\n    \"Startup Founder\"\n  ],\n  \"skills\": [\n    \"MVP Scoping & Validation\",\n    \"Go-To-Market Execution\",\n    \"Unit Economics\"\n  ]\n}"
      }
    ]
  }
}
```
