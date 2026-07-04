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

const fileCache = {};
let requestCount = 0;
const RATE_LIMIT_MAX = 200; // max 200 requests per minute
let lastReset = Date.now();

const AUDIT_LOG_FILE = path.join(root, 'exports', 'logs', 'mcp_audit.log');
fs.mkdirSync(path.dirname(AUDIT_LOG_FILE), { recursive: true });

function auditLog(method, params, success, errorMsg = '') {
  const timestamp = new Date().toISOString();
  const entry = {
    timestamp,
    method,
    client: params?.clientInfo?.name || 'unknown',
    success,
    error: errorMsg
  };
  try {
    fs.appendFileSync(AUDIT_LOG_FILE, JSON.stringify(entry) + '\n', 'utf8');
  } catch (err) {
    // Ignore log write errors
  }
}

function checkRateLimit() {
  const now = Date.now();
  if (now - lastReset > 60000) {
    requestCount = 0;
    lastReset = now;
  }
  requestCount++;
  return requestCount <= RATE_LIMIT_MAX;
}

function validateRegistryJSON(filename, parsed) {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid JSON structure (not an object/array)');
  }
  switch (filename) {
    case 'agent-registry.json':
      if (!Array.isArray(parsed.agents)) throw new Error('Missing agents array');
      break;
    case 'career-paths.json':
      if (!Array.isArray(parsed.career_paths)) throw new Error('Missing career_paths array');
      break;
    case 'companies.json':
      if (!Array.isArray(parsed.companies)) throw new Error('Missing companies array');
      break;
    case 'workflow-registry.json':
      if (!Array.isArray(parsed.workflows)) throw new Error('Missing workflows array');
      break;
    case 'resume-templates.json':
      if (!Array.isArray(parsed.templates)) throw new Error('Missing templates array');
      break;
    case 'knowledge-graph.json':
      if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) throw new Error('Missing nodes or edges array');
      break;
    case 'search-index.json':
      if (!Array.isArray(parsed.items)) throw new Error('Missing items array');
      break;
  }
}

function loadJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;

    const resolvedPath = path.resolve(filePath);
    const resolvedRoot = path.resolve(root);
    if (!resolvedPath.startsWith(resolvedRoot)) {
      log(`Security Warning: Prevented safe access bypass attempt to ${filePath}`);
      return null;
    }

    const stats = fs.statSync(resolvedPath);
    const cacheKey = resolvedPath;
    if (fileCache[cacheKey] && fileCache[cacheKey].mtime >= stats.mtimeMs) {
      return fileCache[cacheKey].data;
    }

    const raw = fs.readFileSync(resolvedPath, 'utf8');
    const parsed = JSON.parse(raw);
    validateRegistryJSON(path.basename(resolvedPath), parsed);

    fileCache[cacheKey] = {
      data: parsed,
      mtime: stats.mtimeMs
    };
    return parsed;
  } catch (err) {
    log(`Failed to load/validate JSON file ${filePath}: ${err.message}`);
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
      if (!checkRateLimit()) {
        log('Rate limit exceeded!');
        sendError(null, -32001, 'Rate limit exceeded');
        return;
      }
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

  let success = true;
  let errorMsg = '';

  try {
    switch (toolName) {
      case 'search_agents': {
        const query = (toolArgs.query || '').toLowerCase();
        const registry = loadJSON(registryPath);
        if (!registry) {
          success = false;
          errorMsg = 'Failed to load agent registry';
          sendError(id, -32603, errorMsg);
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
          success = false;
          errorMsg = 'career-os.json not found. Run update first.';
          sendError(id, -32603, errorMsg);
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
        let { roadmapScore, resumeScore, interviewScore, networkingScore, portfolioScore } = toolArgs;
        if (toolArgs.careerProfile && typeof toolArgs.careerProfile === 'object') {
          const profile = toolArgs.careerProfile;
          roadmapScore = roadmapScore ?? profile.roadmapScore ?? profile.roadmap_score;
          resumeScore = resumeScore ?? profile.resumeScore ?? profile.resume_score;
          interviewScore = interviewScore ?? profile.interviewScore ?? profile.interview_score;
          networkingScore = networkingScore ?? profile.networkingScore ?? profile.networking_score;
          portfolioScore = portfolioScore ?? profile.portfolioScore ?? profile.portfolio_score;
        }

        roadmapScore = roadmapScore ?? 2;
        resumeScore = resumeScore ?? 2;
        interviewScore = interviewScore ?? 2;
        networkingScore = networkingScore ?? 2;
        portfolioScore = portfolioScore ?? 2;

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
        const roadmap = [];
        if (career < 80) {
          recommendations.push('Define clear long-term career roadmaps using: career_path software-engineer');
          roadmap.push('career_path: software-engineer (Define milestone-based roadmap)');
        }
        if (resume < 80) {
          recommendations.push('Format and check ATS compliance by running: resume_score tool');
          roadmap.push('workflow: ats-optimization (Check ATS compliance)');
        }
        if (interview < 80) {
          recommendations.push('Schedule mock interview loop preparation via: company_track google');
          roadmap.push('company_track: google (Practice mock interview loops)');
        }
        if (networking < 80) {
          recommendations.push('Review outbound outreach strategy blueprints in: workflow_lookup remote-job-hunt');
          roadmap.push('workflow: remote-job-hunt (Build referral pipeline)');
        }

        if (roadmap.length === 0) {
          roadmap.push('Maintain current state. Continue to execute high-impact project loops.');
        }

        sendResult(id, {
          content: [{
            type: 'text',
            text: JSON.stringify({
              career_score: combinedScore,
              recommendations,
              roadmap
            }, null, 2)
          }]
        });
        break;
      }

      case 'resume_score': {
        const { resumeText } = toolArgs;
        let resumeData;
        try {
          resumeData = JSON.parse(resumeText);
        } catch (e) {
          resumeData = {
            header: { name: 'Audit Candidate', email: 'audit@example.com', phone: '+1-555-0100' },
            summary: resumeText.slice(0, 300),
            skills: resumeText.match(/\b(React|Next\.js|Node\.js|Express|Python|Go|Java|SQL|AWS|Docker|Kubernetes|Git|CI\/CD|Agile|Scrum)\b/gi) || [],
            experience: [
              {
                role: 'Developer',
                company: 'Sample Corp',
                duration: '2023 - Present',
                bullets: resumeText.split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('*')).slice(0, 5)
              }
            ],
            education: [{ degree: 'Degree', institution: 'University', duration: '2019-2023' }]
          };
        }
        const { scoreResumeData } = await import('../resume-engine/scorer.js');
        const scoreResult = scoreResumeData(resumeData);

        const missingKeywords = [];
        const resumeTextLower = resumeText.toLowerCase();
        const COMMON_KEYWORDS = ['git', 'docker', 'aws', 'kubernetes', 'ci/cd', 'agile', 'scrum', 'testing', 'apis', 'sql'];
        COMMON_KEYWORDS.forEach(kw => {
          if (!resumeTextLower.includes(kw)) {
            missingKeywords.push(kw);
          }
        });

        sendResult(id, {
          content: [{
            type: 'text',
            text: JSON.stringify({
              ats_score: scoreResult.overallScore,
              missing_keywords: missingKeywords,
              recommendations: scoreResult.recommendations
            }, null, 2)
          }]
        });
        break;
      }

      case 'job_match': {
        const { resume, jobDescription } = toolArgs;
        let resumeData;
        try {
          resumeData = JSON.parse(resume);
        } catch (e) {
          resumeData = {
            header: { name: 'Audit Candidate', email: 'audit@example.com', phone: '+1-555-0100' },
            summary: resume.slice(0, 300),
            skills: resume.match(/\b(React|Next\.js|Node\.js|Express|Python|Go|Java|SQL|AWS|Docker|Kubernetes|Git)\b/gi) || [],
            experience: [],
            education: []
          };
        }
        const { analyzeJobMatch } = await import('../resume-engine/job-match.js');
        const matchResult = analyzeJobMatch(resumeData, jobDescription);

        sendResult(id, {
          content: [{
            type: 'text',
            text: JSON.stringify({
              match_score: matchResult.matchPercentage,
              gaps: matchResult.missingKeywords,
              recommended_agents: matchResult.recommendations.agents,
              strengths: matchResult.strengths,
              weaknesses: matchResult.weaknesses,
              suggestions: matchResult.suggestions
            }, null, 2)
          }]
        });
        break;
      }

      case 'company_track': {
        const coId = (toolArgs.company || '').toLowerCase().trim();
        const coFile = path.join(root, 'companies', `${coId}.json`);
        if (!fs.existsSync(coFile)) {
          success = false;
          errorMsg = `Company track '${coId}' not found`;
          sendError(id, -32602, errorMsg);
          return;
        }
        const data = loadJSON(coFile);

        sendResult(id, {
          content: [{
            type: 'text',
            text: JSON.stringify({
              interview_process: data.interview_process,
              required_skills: data.skills,
              roadmap: `Workflow: ${data.preparation_workflow}`,
              recommended_agents: data.agents,
              resources: data.resources
            }, null, 2)
          }]
        });
        break;
      }

      case 'career_path': {
        const pId = (toolArgs.careerPath || toolArgs.career_path || '').toLowerCase().trim();
        const pFile = path.join(root, 'career-paths', `${pId}.json`);
        if (!fs.existsSync(pFile)) {
          success = false;
          errorMsg = `Career path '${pId}' not found`;
          sendError(id, -32602, errorMsg);
          return;
        }
        const data = loadJSON(pFile);

        sendResult(id, {
          content: [{
            type: 'text',
            text: JSON.stringify({
              skills: data.core_skills,
              milestones: [
                "Entry Level Core Competency Integration",
                "Mid Level System Refactoring & Collaboration",
                "Senior Level Architecture & Delivery Leadership"
              ],
              learning_plan: data.recommended_workflows.map(wf => `Execute workflow: ${wf}`),
              recommended_agents: data.recommended_agents
            }, null, 2)
          }]
        });
        break;
      }

      case 'workflow_lookup': {
        const wId = (toolArgs.workflow || toolArgs.workflow_id || '').toLowerCase().trim();
        const wReg = loadJSON(workflowsPath);
        if (!wReg) {
          success = false;
          errorMsg = 'Failed to load workflow registry';
          sendError(id, -32603, errorMsg);
          return;
        }
        const wf = wReg.workflows.find(x => x.id === wId);
        if (!wf) {
          success = false;
          errorMsg = `Workflow '${wId}' not found`;
          sendError(id, -32602, errorMsg);
          return;
        }
        const wFile = path.join(root, wf.filename);
        let content = '';
        if (fs.existsSync(wFile)) {
          content = fs.readFileSync(wFile, 'utf8');
        }

        let steps = [];
        const stepMatch = content.match(/#+ Step-by-Step Execution Plan([\s\S]*?)(?:#+|$)/i);
        if (stepMatch && stepMatch[1]) {
          steps = stepMatch[1]
            .split('\n')
            .map(line => line.trim())
            .filter(line => /^\d+\./.test(line))
            .map(line => line.replace(/^\d+\.\s*/, ''));
        }
        if (steps.length === 0) {
          steps = wf.prerequisites || [];
        }

        let estimatedTime = "2-3 weeks";
        if (content.toLowerCase().includes("week 1") && content.toLowerCase().includes("week 3")) {
          estimatedTime = "3 weeks";
        } else if (content.toLowerCase().includes("prep week") || content.toLowerCase().includes("1 week")) {
          estimatedTime = "1 week";
        }

        sendResult(id, {
          content: [{
            type: 'text',
            text: JSON.stringify({
              steps,
              agents: wf.recommended_agents,
              estimated_time: estimatedTime,
              prerequisites: wf.prerequisites
            }, null, 2)
          }]
        });
        break;
      }

      case 'agent_details': {
        const aId = (toolArgs.agentId || toolArgs.agent_id || '').trim();
        const aReg = loadJSON(registryPath);
        if (!aReg) {
          success = false;
          errorMsg = 'Failed to load agent registry';
          sendError(id, -32603, errorMsg);
          return;
        }
        const agent = aReg.agents.find(x => x.id === aId);
        if (!agent) {
          success = false;
          errorMsg = `Agent '${aId}' not found in registry`;
          sendError(id, -32602, errorMsg);
          return;
        }
        const aFile = path.join(root, agent.filename);
        let content = '';
        if (fs.existsSync(aFile)) {
          content = fs.readFileSync(aFile, 'utf8');
        }
        sendResult(id, {
          content: [{
            type: 'text',
            text: JSON.stringify({
              full_metadata: agent,
              prompt: content,
              related_agents: agent.related_agents
            }, null, 2)
          }]
        });
        break;
      }

      case 'knowledge_graph': {
        const ent = (toolArgs.entity || '').toLowerCase().trim();
        const gPath = path.join(root, 'knowledge-graph.json');
        const graph = loadJSON(gPath);
        if (!graph) {
          success = false;
          errorMsg = 'Failed to load knowledge graph';
          sendError(id, -32603, errorMsg);
          return;
        }
        const matchingNodes = graph.nodes.filter(n => 
          n.id.toLowerCase().includes(ent) || 
          n.name.toLowerCase().includes(ent)
        );
        const nodeIds = new Set(matchingNodes.map(n => n.id));
        const connectedEdges = graph.edges.filter(e => 
          nodeIds.has(e.source) || nodeIds.has(e.target)
        );
        const connectedNodeIds = new Set();
        connectedEdges.forEach(e => {
          connectedNodeIds.add(e.source);
          connectedNodeIds.add(e.target);
        });
        const connectedNodes = graph.nodes.filter(n => connectedNodeIds.has(n.id));

        const agents = connectedNodes.filter(n => n.type === 'agent' || n.type === 'division').map(n => n.name);
        const companies = connectedNodes.filter(n => n.type === 'company').map(n => n.name);
        const paths = connectedNodes.filter(n => n.type === 'career-path').map(n => n.name);
        const skills = connectedNodes.filter(n => n.type === 'skill').map(n => n.name);

        sendResult(id, {
          content: [{
            type: 'text',
            text: JSON.stringify({
              connected_agents: agents,
              companies,
              paths,
              skills
            }, null, 2)
          }]
        });
        break;
      }

      default:
        success = false;
        errorMsg = `Tool not found: ${toolName}`;
        sendError(id, -32601, errorMsg);
    }
    auditLog('tools/call/' + toolName, toolArgs, success, errorMsg);
  } catch (err) {
    success = false;
    errorMsg = err.message;
    sendError(id, -32603, `Execution error: ${err.message}`);
    auditLog('tools/call/' + toolName, toolArgs, success, errorMsg);
  }
}

const MCP_RESOURCES = [
  {
    uri: 'career-agents://registry/agents',
    name: 'Agent Registry',
    mimeType: 'application/json',
    description: 'Dynamic database catalog of all 135 specialized AI career agents.'
  },
  {
    uri: 'career-agents://registry/paths',
    name: 'Career Paths Registry',
    mimeType: 'application/json',
    description: 'Sequenced milestone roadmaps for engineering, PM, and founder positions.'
  },
  {
    uri: 'career-agents://registry/companies',
    name: 'Companies Prep Tracks Registry',
    mimeType: 'application/json',
    description: 'Interview loops and required competencies for top-tier companies.'
  },
  {
    uri: 'career-agents://registry/workflows',
    name: 'Workflows Registry',
    mimeType: 'application/json',
    description: 'Multi-agent checklists and repeatable operation workflows.'
  },
  {
    uri: 'career-agents://registry/templates',
    name: 'Resume Templates Registry',
    mimeType: 'application/json',
    description: 'Schedules and scores mappings for the 20 resume studio templates.'
  },
  {
    uri: 'career-agents://registry/graph',
    name: 'Career OS Knowledge Graph',
    mimeType: 'application/json',
    description: 'Complete relational nodes and connections coordinate map.'
  },
  {
    uri: 'career-agents://registry/search-index',
    name: 'Search Discovery Index',
    mimeType: 'application/json',
    description: 'Unified search optimization weights catalog database.'
  }
];

function handleResourcesList(id) {
  sendResult(id, { resources: MCP_RESOURCES });
}

function handleResourcesRead(id, params) {
  const { uri } = params;
  log(`Reading resource: ${uri}`);
  const resource = MCP_RESOURCES.find(r => r.uri === uri);
  if (!resource) {
    auditLog('resources/read', params, false, `Resource not found: ${uri}`);
    sendError(id, -32602, `Resource not found: ${uri}`);
    return;
  }

  let filename = '';
  switch (uri) {
    case 'career-agents://registry/agents': filename = 'agent-registry.json'; break;
    case 'career-agents://registry/paths': filename = 'career-paths.json'; break;
    case 'career-agents://registry/companies': filename = 'companies.json'; break;
    case 'career-agents://registry/workflows': filename = 'workflow-registry.json'; break;
    case 'career-agents://registry/templates': filename = 'resume-templates.json'; break;
    case 'career-agents://registry/graph': filename = 'knowledge-graph.json'; break;
    case 'career-agents://registry/search-index': filename = 'search-index.json'; break;
  }

  const fpath = path.join(root, filename);
  if (!fs.existsSync(fpath)) {
    auditLog('resources/read', params, false, `Resource file missing on disk: ${filename}`);
    sendError(id, -32603, `Resource file missing on disk: ${filename}`);
    return;
  }

  try {
    const resolvedPath = path.resolve(fpath);
    const resolvedRoot = path.resolve(root);
    if (!resolvedPath.startsWith(resolvedRoot)) {
      auditLog('resources/read', params, false, `Traversal protection triggered`);
      sendError(id, -32603, `Access denied: Traversal protection triggered.`);
      return;
    }

    const stats = fs.statSync(resolvedPath);
    let text;
    const cacheKey = resolvedPath;
    if (fileCache[cacheKey] && fileCache[cacheKey].mtime >= stats.mtimeMs) {
      text = JSON.stringify(fileCache[cacheKey].data, null, 2);
    } else {
      text = fs.readFileSync(resolvedPath, 'utf8');
      const parsed = JSON.parse(text);
      validateRegistryJSON(filename, parsed);
      fileCache[cacheKey] = {
        data: parsed,
        mtime: stats.mtimeMs
      };
    }

    sendResult(id, {
      contents: [{
        uri,
        mimeType: 'application/json',
        text
      }]
    });
    auditLog('resources/read', params, true);
  } catch (err) {
    auditLog('resources/read', params, false, err.message);
    sendError(id, -32603, `Error reading resource: ${err.message}`);
  }
}
