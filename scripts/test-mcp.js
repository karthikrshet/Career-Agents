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
    assertTest('Tools Listing', tools.length === 19, `Found ${tools.length} tools`);

    // 3. Search Agents tool
    console.log('Calling search_agents...');
    const searchRes = await sendRequest('tools/call', {
      name: 'search_agents',
      arguments: { query: 'ats-resume-reviewer' }
    });
    const searchParsed = JSON.parse(searchRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: search_agents', searchParsed.agents && searchParsed.agents.length > 0 && searchParsed.agents[0].id === 'ats-resume-reviewer');

    // Fuzzy search equivalency test
    console.log('Calling search_agents with fuzzy react terms...');
    const f1 = await sendRequest('tools/call', { name: 'search_agents', arguments: { query: 'react' } });
    const f2 = await sendRequest('tools/call', { name: 'search_agents', arguments: { query: 'reactjs' } });
    const f3 = await sendRequest('tools/call', { name: 'search_agents', arguments: { query: 'react.js' } });
    const r1 = JSON.parse(f1.result?.content?.[0]?.text || '{}').agents || [];
    const r2 = JSON.parse(f2.result?.content?.[0]?.text || '{}').agents || [];
    const r3 = JSON.parse(f3.result?.content?.[0]?.text || '{}').agents || [];
    assertTest('Tool: search_agents fuzzy equivalency', r1.length > 0 && r1.length === r2.length && r2.length === r3.length);

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
    assertTest('Tool: recommend_agents', Array.isArray(recParsed.recommended_agents) && recParsed.recommended_agents.length > 0 && recParsed.confidence !== undefined);

    // Recommend Agents with array of skills (Phase 1 scenario)
    console.log('Calling recommend_agents with skills array...');
    const recArrayRes = await sendRequest('tools/call', {
      name: 'recommend_agents',
      arguments: {
        skills: ['React', 'Next.js', 'TypeScript', 'Node.js'],
        experience: 'mid',
        role: 'software-engineer'
      }
    });
    const recArrayParsed = JSON.parse(recArrayRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: recommend_agents array safe', Array.isArray(recArrayParsed.recommended_agents) && recArrayParsed.recommended_agents.length > 0);
    const recNames = (recArrayParsed.recommended_agents || []).map(a => a.name);
    assertTest('Expected Full Stack agents present',
      recNames.includes('MERN Architect') &&
      recNames.includes('Backend Architect') &&
      recNames.includes('Next.js Performance Engineer') &&
      recNames.includes('Database Engineer'),
      `Returned: ${recNames.join(', ')}`
    );

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

    // Knowledge Graph path query
    console.log('Calling knowledge_graph with path query...');
    const graphPathRes = await sendRequest('tools/call', {
      name: 'knowledge_graph',
      arguments: { entity: 'Show all paths from Salesforce to GraphQL' }
    });
    const graphPathParsed = JSON.parse(graphPathRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: knowledge_graph path traversal', graphPathParsed.path_found === true && graphPathParsed.explanation.includes('Salesforce'));

    // Knowledge Graph workflows query
    console.log('Calling knowledge_graph with workflows query...');
    const graphWfRes = await sendRequest('tools/call', {
      name: 'knowledge_graph',
      arguments: { entity: 'Show all workflows related to System Design' }
    });
    const graphWfParsed = JSON.parse(graphWfRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: knowledge_graph workflows query', graphWfParsed.workflows && graphWfParsed.workflows.length > 0);

    // Knowledge Graph companies query
    console.log('Calling knowledge_graph with companies query...');
    const graphCoRes = await sendRequest('tools/call', {
      name: 'knowledge_graph',
      arguments: { entity: 'Show companies requiring PostgreSQL' }
    });
    const graphCoParsed = JSON.parse(graphCoRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: knowledge_graph companies query', graphCoParsed.companies && graphCoParsed.companies.length > 0);

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

    // 17. Career Gap Analysis tool
    console.log('Calling career_gap_analysis...');
    const gapRes = await sendRequest('tools/call', {
      name: 'career_gap_analysis',
      arguments: {
        resume: JSON.stringify({ skills: ['React', 'TypeScript', 'Full Stack Development'] }),
        target_company: 'salesforce'
      }
    });
    const gapParsed = JSON.parse(gapRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: career_gap_analysis', gapParsed.strengths && gapParsed.weaknesses && gapParsed.estimated_readiness !== undefined && gapParsed.confidence !== undefined);

    // 18. generate_resume_docx
    console.log('Calling generate_resume_docx...');
    const docxRes = await sendRequest('tools/call', {
      name: 'generate_resume_docx',
      arguments: {
        resume: 'John Doe\nExperienced Full Stack Developer skilled in React and Node.',
        outputPath: 'exports/test_resume.docx'
      }
    });
    const docxParsed = JSON.parse(docxRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: generate_resume_docx', docxParsed.success === true && fs.existsSync(path.join(root, 'exports', 'test_resume.docx')));

    // 19. generate_interview_prep_pdf
    console.log('Calling generate_interview_prep_pdf...');
    const pdfRes = await sendRequest('tools/call', {
      name: 'generate_interview_prep_pdf',
      arguments: {
        candidateName: 'Jane Smith',
        targetRole: 'Staff Frontend Engineer',
        company: 'Stripe',
        qaPairs: JSON.stringify([{ question: 'What is shadow DOM?', answer: 'It provides encapsulation for custom elements.' }]),
        outputPath: 'exports/test_prep.pdf'
      }
    });
    const pdfParsed = JSON.parse(pdfRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: generate_interview_prep_pdf', pdfParsed.success === true && fs.existsSync(path.join(root, 'exports', 'test_prep.pdf')));

    // 20. generate_career_roadmap_xlsx
    console.log('Calling generate_career_roadmap_xlsx...');
    const xlsxRes = await sendRequest('tools/call', {
      name: 'generate_career_roadmap_xlsx',
      arguments: {
        candidateName: 'Bob Builder',
        targetRole: 'Principal Cloud Architect',
        phases: JSON.stringify([{ phase: 'Cloud Mastery', duration: '6 Months', tasks: ['AWS architect certifications'], status: 'completed' }]),
        outputPath: 'exports/test_roadmap.xlsx'
      }
    });
    const xlsxParsed = JSON.parse(xlsxRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: generate_career_roadmap_xlsx', xlsxParsed.success === true && fs.existsSync(path.join(root, 'exports', 'test_roadmap.xlsx')));

    // 21. search_jobs
    console.log('Calling search_jobs...');
    const sJobsRes = await sendRequest('tools/call', {
      name: 'search_jobs',
      arguments: { query: 'React', limit: 2 }
    });
    const sJobsParsed = JSON.parse(sJobsRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: search_jobs', Array.isArray(sJobsParsed.jobs) && sJobsParsed.jobs.length > 0);

    // 22. analyze_job_posting
    console.log('Calling analyze_job_posting...');
    const postRes = await sendRequest('tools/call', {
      name: 'analyze_job_posting',
      arguments: { url: 'https://jobs.lever.co/stripe/job-id-123' }
    });
    const postParsed = JSON.parse(postRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: analyze_job_posting', postParsed.title && postParsed.matched_skills && postParsed.missing_skills);

    // 23. analyze_github_profile
    console.log('Calling analyze_github_profile...');
    const gitRes = await sendRequest('tools/call', {
      name: 'analyze_github_profile',
      arguments: { username: 'octocat' }
    });
    const gitParsed = JSON.parse(gitRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: analyze_github_profile', gitParsed.username === 'octocat' && Array.isArray(gitParsed.top_languages));

    // 24. linkedin_profile_review
    console.log('Calling linkedin_profile_review...');
    const lnRes = await sendRequest('tools/call', {
      name: 'linkedin_profile_review',
      arguments: { profileText: 'Experienced architect specialized in cloud operations and container scaling.' }
    });
    const lnParsed = JSON.parse(lnRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: linkedin_profile_review', lnParsed.review_score !== undefined && Array.isArray(lnParsed.suggestions));

    // 25. career_action_plan
    console.log('Calling career_action_plan...');
    const planRes = await sendRequest('tools/call', {
      name: 'career_action_plan',
      arguments: {
        resume: 'Frontend developer React focus',
        targetRole: 'Staff Frontend Developer',
        targetCompany: 'Meta'
      }
    });
    const planParsed = JSON.parse(planRes.result?.content?.[0]?.text || '{}');
    assertTest('Tool: career_action_plan', planParsed.target_role === 'Staff Frontend Developer' && Array.isArray(planParsed.action_items));

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
