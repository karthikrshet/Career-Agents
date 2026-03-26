import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

console.log('--- CAREER-AGENTS MCP SERVER INTEGRATION TESTS ---');

const mcpProcess = spawn('node', [path.join(root, 'scripts', 'cli.js'), 'mcp']);

let responseBuffer = '';
const pendingRequests = new Map();
let nextId = 1;

mcpProcess.stdout.on('data', (data) => {
  responseBuffer += data.toString();
  checkResponses();
});

mcpProcess.stderr.on('data', (data) => {
  console.log(`[Stderr] ${data.toString().trim()}`);
});

mcpProcess.on('close', (code) => {
  console.log(`MCP Server process closed with code ${code}`);
});

function checkResponses() {
  const lines = responseBuffer.split('\n');
  responseBuffer = lines.pop(); // Keep partial line

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const response = JSON.parse(line);
      const { id } = response;
      if (id !== undefined && pendingRequests.has(id)) {
        const resolve = pendingRequests.get(id);
        pendingRequests.delete(id);
        resolve(response);
      }
    } catch (e) {
      console.error('Failed to parse line response:', line, e.message);
    }
  }
}

function sendRequest(method, params) {
  return new Promise((resolve) => {
    const id = nextId++;
    const payload = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };
    pendingRequests.set(id, resolve);
    mcpProcess.stdin.write(JSON.stringify(payload) + '\n');
  });
}

async function runTests() {
  const report = [];
  report.push('# MCP Test Report');
  report.push(`Generated: ${new Date().toISOString()}`);
  report.push('\n## Test Cases\n');

  let passedCount = 0;
  let totalCount = 0;

  function assertTest(name, condition, details = '') {
    totalCount++;
    if (condition) {
      passedCount++;
      console.log(`[PASS] ${name}`);
      report.push(`- **[PASS]** ${name} ${details ? `(${details})` : ''}`);
    } else {
      console.error(`[FAIL] ${name}`);
      report.push(`- **[FAIL]** ${name} ${details ? `(${details})` : ''}`);
    }
  }

  try {
    // 1. Initialize
    console.log('Sending initialize...');
    const initRes = await sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      clientInfo: { name: 'Test-Runner' }
    });
    assertTest('Initialize Handshake', initRes.result && initRes.result.serverInfo && initRes.result.serverInfo.name === 'career-agents-mcp');

    // 2. Tools List
    console.log('Requesting tools/list...');
    const toolsRes = await sendRequest('tools/list', {});
    const tools = toolsRes.result?.tools || [];
    assertTest('Tools Listing', tools.length === 10, `Found ${tools.length} tools`);

    // 3. Search Agents tool
    console.log('Calling search_agents...');
    const searchRes = await sendRequest('tools/call', {
      name: 'search_agents',
      arguments: { query: 'ats-resume-reviewer' }
    });
    const searchParsed = JSON.parse(searchRes.result?.content?.[0]?.text || '[]');
    assertTest('Tool: search_agents', searchParsed.length > 0 && searchParsed[0].id === 'ats-resume-reviewer');

    // 4. Recommend Agents tool
    console.log('Calling recommend_agents...');
    const recRes = await sendRequest('tools/call', {
      name: 'recommend_agents',
      arguments: {
        skills: 'React, Node.js',
        experience: 'mid',
        role: 'software-engineer'
      }
    });
    const recParsed = JSON.parse(recRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: recommend_agents', Array.isArray(recParsed.recommended_agents) && recParsed.recommended_agents.length > 0);

    // 5. Career Assessment tool
    console.log('Calling career_assessment...');
    const assessRes = await sendRequest('tools/call', {
      name: 'career_assessment',
      arguments: {
        roadmapScore: 1,
        resumeScore: 1,
        interviewScore: 1,
        networkingScore: 3,
        portfolioScore: 3
      }
    });
    const assessParsed = JSON.parse(assessRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: career_assessment', assessParsed.career_score !== undefined && assessParsed.roadmap.length > 0);

    // 6. Resume Score tool
    console.log('Calling resume_score...');
    const scoreRes = await sendRequest('tools/call', {
      name: 'resume_score',
      arguments: {
        resumeText: '{"header":{"name":"Jane Doe","email":"jane@example.com"},"skills":["React","Node.js"],"experience":[]}'
      }
    });
    const scoreParsed = JSON.parse(scoreRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: resume_score', scoreParsed.ats_score !== undefined && scoreParsed.missing_keywords.length > 0);

    // 7. Job Match tool
    console.log('Calling job_match...');
    const matchRes = await sendRequest('tools/call', {
      name: 'job_match',
      arguments: {
        resume: '{"skills":["React"]}',
        jobDescription: 'Looking for React developer with AWS knowledge.'
      }
    });
    const matchParsed = JSON.parse(matchRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: job_match', matchParsed.match_score !== undefined && matchParsed.gaps.length > 0);

    // 8. Company Track tool
    console.log('Calling company_track...');
    const companyRes = await sendRequest('tools/call', {
      name: 'company_track',
      arguments: { company: 'google' }
    });
    const companyParsed = JSON.parse(companyRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: company_track', Array.isArray(companyParsed.interview_process) && companyParsed.interview_process.length > 0);

    // 9. Career Path tool
    console.log('Calling career_path...');
    const pathRes = await sendRequest('tools/call', {
      name: 'career_path',
      arguments: { careerPath: 'software-engineer' }
    });
    const pathParsed = JSON.parse(pathRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: career_path', Array.isArray(pathParsed.skills) && pathParsed.skills.length > 0);

    // 10. Workflow Lookup tool
    console.log('Calling workflow_lookup...');
    const wfRes = await sendRequest('tools/call', {
      name: 'workflow_lookup',
      arguments: { workflow: 'ats-optimization' }
    });
    const wfParsed = JSON.parse(wfRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: workflow_lookup', Array.isArray(wfParsed.steps) && wfParsed.steps.length > 0);

    // 11. Agent Details tool
    console.log('Calling agent_details...');
    const agentRes = await sendRequest('tools/call', {
      name: 'agent_details',
      arguments: { agentId: 'ats-resume-reviewer' }
    });
    const agentParsed = JSON.parse(agentRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: agent_details', agentParsed.prompt !== undefined && agentParsed.full_metadata !== undefined);

    // 12. Knowledge Graph tool
    console.log('Calling knowledge_graph...');
    const graphRes = await sendRequest('tools/call', {
      name: 'knowledge_graph',
      arguments: { entity: 'resume' }
    });
    const graphParsed = JSON.parse(graphRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: knowledge_graph', Array.isArray(graphParsed.connected_agents) && graphParsed.connected_agents.length > 0);

    // 13. Resources List
    console.log('Requesting resources/list...');
    const resList = await sendRequest('resources/list', {});
    const resources = resList.result?.resources || [];
    assertTest('Resources Listing', resources.length === 7);

    // 14. Resources Read
    console.log('Calling resources/read...');
    const resRead = await sendRequest('resources/read', {
      uri: 'career-agents://registry/agents'
    });
    const readParsed = JSON.parse(resRead.result?.contents?.[0]?.text || '{}');
    assertTest('Resources Read', Array.isArray(readParsed.agents) && readParsed.agents.length > 0);

    // 15. Error handling: invalid tool name
    console.log('Calling invalid tool name...');
    const errRes = await sendRequest('tools/call', {
      name: 'non_existent_tool',
      arguments: {}
    });
    assertTest('Error Handling: Invalid Tool Name', errRes.error && errRes.error.code === -32601);

    // 16. Security: Safe Resource Access traversal block
    console.log('Calling resources/read with directory traversal URI...');
    const traverseRes = await sendRequest('resources/read', {
      uri: 'career-agents://registry/../../package.json'
    });
    assertTest('Security: Traversal Safeguard Block', traverseRes.error !== undefined);

  } catch (err) {
    console.error('Test Execution Error:', err);
    report.push(`\n**Execution Error:** ${err.message}`);
  } finally {
    mcpProcess.kill();
    
    report.push(`\n## Summary`);
    report.push(`- **Total tests**: ${totalCount}`);
    report.push(`- **Passed tests**: ${passedCount}`);
    report.push(`- **Failed tests**: ${totalCount - passedCount}`);
    
    fs.writeFileSync(path.join(root, 'docs', 'reports', 'MCP_TEST_REPORT.md'), report.join('\n'), 'utf8');
    console.log('\n--- TESTS COMPLETED. REPORT GENERATED AT docs/reports/MCP_TEST_REPORT.md ---');
    process.exit(totalCount === passedCount ? 0 : 1);
  }
}

// Give process 500ms to start
setTimeout(runTests, 500);
