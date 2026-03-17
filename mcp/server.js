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

function loadJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    log(`Failed to load JSON file ${filePath}: ${err.message}`);
    return null;
  }
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

// === MCP Tools Configuration ===
const MCP_TOOLS = [
  {
    name: 'search_agents',
    description: 'Find matching agents based on a keyword search query across description, division and tags.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The search query or keyword (e.g. resume, frontend, google)' }
      },
      required: ['query']
    }
  },
  {
    name: 'recommend_agents',
    description: 'Recommend matching specialized career agents, workflows, and bundles for a candidate profile.',
    inputSchema: {
      type: 'object',
      properties: {
        skills: { type: 'string', description: 'Comma-separated skills (e.g. React, Node.js)' },
        experience: { type: 'string', enum: ['entry', 'mid', 'senior', 'executive'], description: 'Experience level' },
        role: { type: 'string', description: 'Target career path role (e.g. software-engineer, ai-engineer)' },
        company: { type: 'string', description: 'Target company (e.g. google, stripe)' }
      },
      required: ['skills', 'experience', 'role']
    }
  },
  {
    name: 'career_assessment',
    description: 'Calculate Career OS readiness scores and growth strategy recommendations.',
    inputSchema: {
      type: 'object',
      properties: {
        roadmapScore: { type: 'number', minimum: 1, maximum: 3, description: 'Milestone career roadmap presence (1: none, 2: partial, 3: complete)' },
        resumeScore: { type: 'number', minimum: 1, maximum: 3, description: 'ATS resume formatting & metrics (1: none, 2: partial, 3: complete)' },
        interviewScore: { type: 'number', minimum: 1, maximum: 3, description: 'Mock prep level & behavioral stories (1: none, 2: partial, 3: complete)' },
        networkingScore: { type: 'number', minimum: 1, maximum: 3, description: 'Outbound and referral pipelines active (1: none, 2: partial, 3: complete)' },
        portfolioScore: { type: 'number', minimum: 1, maximum: 3, description: 'Proof of work public projects & portfolios (1: none, 2: partial, 3: complete)' }
      },
      required: ['roadmapScore', 'resumeScore', 'interviewScore', 'networkingScore', 'portfolioScore']
    }
  },
  {
    name: 'resume_score',
    description: 'Score a plain text or structured resume for ATS indexing compatibility.',
    inputSchema: {
      type: 'object',
      properties: {
        resumeText: { type: 'string', description: 'Raw resume text or JSON-string data' }
      },
      required: ['resumeText']
    }
  },
  {
    name: 'job_match',
    description: 'Compare a resume against a target job description to compute match statistics.',
    inputSchema: {
      type: 'object',
      properties: {
        resume: { type: 'string', description: 'Resume content or JSON data string' },
        jobDescription: { type: 'string', description: 'Target job description details text' }
      },
      required: ['resume', 'jobDescription']
    }
  },
  {
    name: 'company_track',
    description: 'Retrieve detailed interview tracks, required competencies and recommended agents for a tier-1 company.',
    inputSchema: {
      type: 'object',
      properties: {
        company: { type: 'string', description: 'Target company identifier (e.g. google, meta, stripe)' }
      },
      required: ['company']
    }
  },
  {
    name: 'career_path',
    description: 'Retrieve skills, milestones and recommended agents for a standard career path.',
    inputSchema: {
      type: 'object',
      properties: {
        careerPath: { type: 'string', description: 'Target career path ID (e.g. software-engineer, ai-engineer)' }
      },
      required: ['careerPath']
    }
  },
  {
    name: 'workflow_lookup',
    description: 'Lookup structural steps, prerequisite details and recommended agents for a sequence workflow.',
    inputSchema: {
      type: 'object',
      properties: {
        workflow: { type: 'string', description: 'Workflow ID (e.g. ats-optimization, faang-preparation)' }
      },
      required: ['workflow']
    }
  },
  {
    name: 'agent_details',
    description: 'Expose metadata and system prompt instructions for a specialized agent.',
    inputSchema: {
      type: 'object',
      properties: {
        agentId: { type: 'string', description: 'Unique agent ID (e.g. ats-resume-reviewer)' }
      },
      required: ['agentId']
    }
  },
  {
    name: 'knowledge_graph',
    description: 'Retrieve surrounding connections (skills, companies, paths, agents) for a target entity keyword.',
    inputSchema: {
      type: 'object',
      properties: {
        entity: { type: 'string', description: 'Graph entity search keyword' }
      },
      required: ['entity']
    }
  }
];

function handleToolsList(id) {
  sendResult(id, { tools: MCP_TOOLS });
}

async function handleToolsCall(id, params) {
  const { name: toolName, arguments: toolArgs } = params;
  log(`Executing tool call: ${toolName}`);

  const registryPath = path.join(root, 'agent-registry.json');
  const workflowsPath = path.join(root, 'workflow-registry.json');
  const careerOsPath = path.join(root, 'career-os.json');

  switch (toolName) {
    case 'search_agents': {
      const query = (toolArgs.query || '').toLowerCase();
      const registry = loadJSON(registryPath);
      if (!registry) {
        sendError(id, -32603, 'Failed to load agent registry');
        return;
      }
      const matches = registry.agents.filter(a => 
        a.id.includes(query) || 
        a.name.toLowerCase().includes(query) || 
        a.description.toLowerCase().includes(query) ||
        (a.tags || []).some(t => t.toLowerCase().includes(query))
      );
      sendResult(id, {
        content: [{
          type: 'text',
          text: JSON.stringify(matches, null, 2)
        }]
      });
      break;
    }

    case 'recommend_agents': {
      const { skills, experience, role, company } = toolArgs;
      if (!fs.existsSync(careerOsPath)) {
        sendError(id, -32603, 'career-os.json not found. Run update first.');
        return;
      }
      const osData = loadJSON(careerOsPath);
      const inputSkills = (skills || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      const companyQuery = (company || '').trim().toLowerCase();
      const roleQuery = (role || '').trim().toLowerCase();
      const expQuery = (experience || 'mid').trim().toLowerCase();

      // Recommend Agents
      const matchedAgents = [];
      for (const agent of osData.agents) {
        let score = 0;
        const agentSkills = agent.skills.map(s => s.toLowerCase());
        const skillOverlap = inputSkills.filter(s => agentSkills.includes(s));
        score += skillOverlap.length * 5;
        if (agent.experience_level.toLowerCase() === expQuery) score += 3;
        if (companyQuery && agent.companies.map(co => co.toLowerCase()).includes(companyQuery)) score += 10;
        if (roleQuery && (agent.id.includes(roleQuery) || agent.name.toLowerCase().includes(roleQuery))) score += 8;

        if (score > 0 || matchedAgents.length < 3) {
          matchedAgents.push({ agent, score });
        }
      }
      matchedAgents.sort((a, b) => b.score - a.score);
      const topAgents = matchedAgents.slice(0, 3).map(x => x.agent);

      // Recommend Workflows
      const matchedWorkflows = [];
      for (const wf of osData.workflows) {
        let score = 0;
        const desc = wf.description.toLowerCase();
        if (roleQuery && desc.includes(roleQuery)) score += 5;
        if (companyQuery && desc.includes(companyQuery)) score += 8;

        const wfAgents = wf.recommended_agents;
        const topAgentIds = topAgents.map(ta => ta.id);
        const agentOverlap = topAgentIds.filter(id => wfAgents.includes(id));
        score += agentOverlap.length * 3;

        matchedWorkflows.push({ wf, score });
      }
      matchedWorkflows.sort((a, b) => b.score - a.score);
      const topWorkflows = matchedWorkflows.slice(0, 2).map(x => x.wf);

      // Recommend Bundles
      const matchedBundles = [];
      for (const b of osData.bundles) {
        let score = 0;
        const bundleSkills = b.skills.map(s => s.toLowerCase());
        const skillOverlap = inputSkills.filter(s => bundleSkills.includes(s));
        score += skillOverlap.length * 3;
        if (companyQuery && b.companies.map(co => co.toLowerCase()).includes(companyQuery)) score += 10;
        if (roleQuery && b.career_paths.map(p => p.toLowerCase()).includes(roleQuery)) score += 8;

        matchedBundles.push({ b, score });
      }
      matchedBundles.sort((a, b) => b.score - a.score);
      const topBundles = matchedBundles.slice(0, 2).map(x => x.b);

      sendResult(id, {
        content: [{
          type: 'text',
          text: JSON.stringify({
            recommended_agents: topAgents,
            recommended_workflows: topWorkflows,
            recommended_bundles: topBundles
          }, null, 2)
        }]
      });
      break;
    }

    case 'career_assessment': {
      const { roadmapScore, resumeScore, interviewScore, networkingScore, portfolioScore } = toolArgs;
      const getSubscore = (val) => {
        if (val === 1) return 20;
        if (val === 2) return 60;
        return 100;
      };

      const career = getSubscore(roadmapScore);
      const resume = getSubscore(resumeScore);
      const interview = getSubscore(interviewScore);
      const networking = getSubscore(networkingScore);
      const portfolio = getSubscore(portfolioScore);

      const combinedScore = Math.round((career + resume + interview + networking + portfolio) / 5);

      const recommendations = [];
      if (career < 80) recommendations.push('Define clear long-term career roadmaps using: career_path software-engineer');
      if (resume < 80) recommendations.push('Format and check ATS compliance by running: resume_score tool');
      if (interview < 80) recommendations.push('Schedule mock interview loop preparation via: company_track google');
      if (networking < 80) recommendations.push('Review outbound outreach strategy blueprints in: workflow_lookup remote-job-hunt');

      sendResult(id, {
        content: [{
          type: 'text',
          text: JSON.stringify({
            overallScore: combinedScore,
            subscores: {
              careerStrategy: career,
              resumeFormatting: resume,
              interviewPrep: interview,
              networkingOutreach: networking,
              portfolioProofOfWork: portfolio
            },
            recommendations
          }, null, 2)
        }]
      });
      break;
    }

    // Stubs for next commit blocks
    case 'resume_score':
      sendResult(id, { content: [{ type: 'text', text: 'Stub for resume_score tool' }] });
      break;
    case 'job_match':
      sendResult(id, { content: [{ type: 'text', text: 'Stub for job_match tool' }] });
      break;
    case 'company_track':
      sendResult(id, { content: [{ type: 'text', text: 'Stub for company_track tool' }] });
      break;
    case 'career_path':
      sendResult(id, { content: [{ type: 'text', text: 'Stub for career_path tool' }] });
      break;
    case 'workflow_lookup':
      sendResult(id, { content: [{ type: 'text', text: 'Stub for workflow_lookup tool' }] });
      break;
    case 'agent_details':
      sendResult(id, { content: [{ type: 'text', text: 'Stub for agent_details tool' }] });
      break;
    case 'knowledge_graph':
      sendResult(id, { content: [{ type: 'text', text: 'Stub for knowledge_graph tool' }] });
      break;

    default:
      sendError(id, -32601, `Tool not found: ${toolName}`);
  }
}

function handleResourcesList(id) {
  sendResult(id, { resources: [] });
}

function handleResourcesRead(id, params) {
  sendError(id, -32601, `Resource read not implemented in core server foundation`);
}
