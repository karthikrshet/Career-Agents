import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const LOG_FILE = path.join(root, 'exports', 'logs', 'mcp.log');

// Ensure log folder exists
fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });

function log(msg) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${msg}\n`, 'utf8');
}

export function startMcpServer() {
  log('Starting Career-Agents MCP Stdio Server...');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', async (line) => {
    try {
      if (!line.trim()) return;
      log(`Received request raw: ${line}`);
      const request = JSON.parse(line);
      const { jsonrpc, id, method, params } = request;

      if (jsonrpc !== '2.0') {
        sendError(id, -32600, 'Invalid Request (JSON-RPC version must be 2.0)');
        return;
      }

      switch (method) {
        case 'initialize':
          handleInitialize(id, params);
          break;
        case 'initialized':
          log('Initialized notification received.');
          break;
        case 'tools/list':
          handleToolsList(id);
          break;
        case 'tools/call':
          await handleToolsCall(id, params);
          break;
        case 'resources/list':
          handleResourcesList(id);
          break;
        case 'resources/read':
          handleResourcesRead(id, params);
          break;
        case 'ping':
          sendResult(id, {});
          break;
        default:
          sendError(id, -32601, `Method not found: ${method}`);
      }
    } catch (err) {
      log(`Error parsing line request: ${err.message}`);
      sendError(null, -32700, `Parse error: ${err.message}`);
    }
  });

  process.on('SIGINT', () => {
    log('Stopping MCP Server (SIGINT)...');
    process.exit(0);
  });
}

function send(payload) {
  const raw = JSON.stringify(payload);
  log(`Sending response raw: ${raw}`);
  console.log(raw);
}

function sendResult(id, result) {
  send({
    jsonrpc: '2.0',
    id,
    result
  });
}

function sendError(id, code, message, data = null) {
  const errorPayload = {
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message
    }
  };
  if (data) {
    errorPayload.error.data = data;
  }
  send(errorPayload);
}

function handleInitialize(id, params) {
  log(`Handling initialize from client: ${params?.clientInfo?.name || 'unknown'}`);
  sendResult(id, {
    protocolVersion: '2024-11-05',
    capabilities: {
      tools: {},
      resources: {}
    },
    serverInfo: {
      name: 'career-agents-mcp',
      version: '1.0.0'
    }
  });
}

// Stubs for Tools & Resources (To be expanded in future phases)
function handleToolsList(id) {
  sendResult(id, { tools: [] });
}

async function handleToolsCall(id, params) {
  sendError(id, -32601, `Tool call not implemented in core server foundation`);
}

function handleResourcesList(id) {
  sendResult(id, { resources: [] });
}

function handleResourcesRead(id, params) {
  sendError(id, -32601, `Resource read not implemented in core server foundation`);
}
