import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('🧪 CAREER AGENTS READINESS SCORING REGRESSION TEST SUITE');
console.log('================================================================\n');

const mcpProcess = spawn('node', [path.join(root, 'scripts', 'cli.js'), 'mcp']);

let responseBuffer = '';
const pendingRequests = new Map();
let nextId = 1;

mcpProcess.stdout.on('data', (data) => {
  responseBuffer += data.toString();
  checkResponses();
});

mcpProcess.stderr.on('data', (data) => {
  const msg = data.toString().trim();
  if (msg) console.log(`[MCP Stderr] ${msg}`);
});

mcpProcess.on('close', (code) => {
  // Process ended
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

async function callTool(name, args) {
  const res = await sendRequest('tools/call', {
    name,
    arguments: args
  });
  const text = res.result?.content?.[0]?.text;
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractReadiness(result) {
  if (result === null || result === undefined) return null;
  if (typeof result === 'number') return result;
  if (typeof result === 'object') {
    if (result.readinessScore !== undefined) {
      if (result.readinessScore === null) return null;
      return typeof result.readinessScore === 'number' ? result.readinessScore : parseFloat(result.readinessScore);
    }
    if (result.estimated_readiness !== undefined) {
      if (result.estimated_readiness === null) return null;
      return typeof result.estimated_readiness === 'number' ? result.estimated_readiness : parseFloat(result.estimated_readiness);
    }
    if (result.ready_estimate !== undefined) {
      if (result.ready_estimate === null) return null;
      if (typeof result.ready_estimate === 'number') return result.ready_estimate;
      const parsed = parseFloat(String(result.ready_estimate).replace('%', '').trim());
      return isNaN(parsed) ? null : parsed;
    }
    if (result.career_score !== undefined) {
      if (result.career_score === null) return null;
      return typeof result.career_score === 'number' ? result.career_score : parseFloat(result.career_score);
    }
    if (result.readiness !== undefined) {
      if (result.readiness === null) return null;
      return typeof result.readiness === 'number' ? result.readiness : parseFloat(result.readiness);
    }
  }
  if (typeof result === 'string') {
    const parsed = parseFloat(result.replace('%', '').trim());
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}

async function runRegressionTests() {
  const results = [];
  let passedCount = 0;
  let failedCount = 0;

  function assertTest(testId, name, condition, details = '', failureReason = '') {
    if (condition) {
      passedCount++;
      console.log(`✅ [PASS] ${testId}: ${name}`);
      if (details) console.log(`   └─ Details: ${details}`);
      results.push({ id: testId, name, status: 'PASS', details });
    } else {
      failedCount++;
      console.log(`❌ [FAIL] ${testId}: ${name}`);
      if (details) console.log(`   └─ Output: ${details}`);
      if (failureReason) console.log(`   └─ Root Cause / Expected Fix: ${failureReason}`);
      results.push({ id: testId, name, status: 'FAIL', details, failureReason });
    }
  }

  try {
    // 0. Initialize Handshake
    const initRes = await sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      clientInfo: { name: 'Regression-Test-Runner' }
    });
    if (!initRes.result?.serverInfo) {
      throw new Error('Failed to initialize MCP connection');
    }

    console.log('--- RUNNING READINESS SCORING REGRESSION SUITE ---\n');

    // =========================================================================
    // Test A — Cross-tool consistency
    // =========================================================================
    console.log('Running Test A: Cross-tool consistency...');
    const candidateProfile = {
      skills: ['Python', 'Data Structures & Algorithms', 'System Design & Scalability', 'Distributed Systems'],
      roadmapScore: 2,
      resumeScore: 2,
      interviewScore: 2,
      networkingScore: 2,
      portfolioScore: 2
    };

    const assessRes = await callTool('career_assessment', {
      careerProfile: candidateProfile,
      roadmapScore: 2,
      resumeScore: 2,
      interviewScore: 2,
      networkingScore: 2,
      portfolioScore: 2
    });

    const gapRes = await callTool('career_gap_analysis', {
      resume: JSON.stringify({ skills: candidateProfile.skills }),
      target_company: 'google'
    });

    const actionRes = await callTool('career_action_plan', {
      resume: JSON.stringify({ skills: candidateProfile.skills }),
      targetRole: 'Software Engineer',
      targetCompany: 'Google'
    });

    const scoreAssess = extractReadiness(assessRes);
    const scoreGap = extractReadiness(gapRes);
    const scoreAction = extractReadiness(actionRes);

    const crossToolConsistent = (scoreAssess !== null && scoreGap !== null && scoreAction !== null) &&
      (scoreAssess === scoreGap && scoreGap === scoreAction);

    assertTest(
      'Test A',
      'Cross-tool readiness consistency (career_assessment vs career_gap_analysis vs career_action_plan)',
      crossToolConsistent,
      `career_assessment=${scoreAssess}, career_gap_analysis=${scoreGap}, career_action_plan=${scoreAction}`,
      'Tools use 3 independent disconnected scoring mechanisms: ordinal 1-3 average, keyword coverage with 40% floor, and hard-coded 85%.'
    );

    // =========================================================================
    // Test B — Verified relevant skills cannot reduce readiness
    // =========================================================================
    console.log('\nRunning Test B: Verified relevant skills monotonicity...');
    const profileA = { skills: ['HTML', 'CSS'] };
    const profileB = {
      skills: [
        'HTML',
        'CSS',
        'Data Structures & Algorithms (graphs, dynamic programming, trees)',
        'System Design & Scalability',
        'Python',
        'PyTorch',
        'Distributed Systems'
      ]
    };

    const gapProfileA = await callTool('career_gap_analysis', {
      resume: JSON.stringify(profileA),
      target_company: 'google'
    });
    const gapProfileB = await callTool('career_gap_analysis', {
      resume: JSON.stringify(profileB),
      target_company: 'google'
    });

    const scoreA = extractReadiness(gapProfileA);
    const scoreB = extractReadiness(gapProfileB);

    assertTest(
      'Test B',
      'Adding verified relevant target skills increases/maintains readiness',
      (scoreA !== null && scoreB !== null && scoreB > scoreA),
      `Baseline (Profile A)=${scoreA}, Enhanced (Profile B)=${scoreB}`,
      'Adding verified skills must increase candidate readiness score above baseline.'
    );

    // =========================================================================
    // Test C — Removing relevant skills cannot increase readiness
    // =========================================================================
    console.log('\nRunning Test C: Removing relevant skills cannot increase readiness...');
    const strongProfile = {
      skills: ['Python', 'Distributed Systems', 'System Design', 'Algorithms', 'Scalability', 'C++', 'Java', 'Go']
    };
    const weakerProfile = {
      skills: ['Python']
    };

    const gapStrong = await callTool('career_gap_analysis', {
      resume: JSON.stringify(strongProfile),
      target_company: 'google'
    });
    const gapWeaker = await callTool('career_gap_analysis', {
      resume: JSON.stringify(weakerProfile),
      target_company: 'google'
    });

    const scoreStrong = extractReadiness(gapStrong);
    const scoreWeaker = extractReadiness(gapWeaker);

    assertTest(
      'Test C',
      'Removing relevant target skills decreases/maintains readiness',
      (scoreStrong !== null && scoreWeaker !== null && scoreWeaker < scoreStrong),
      `Strong Profile=${scoreStrong}, Weaker Profile=${scoreWeaker}`,
      'Weaker profile must not have readiness score greater than or equal to strong profile.'
    );

    // =========================================================================
    // Test D — Zero matching skills must not become 40% floor
    // =========================================================================
    console.log('\nRunning Test D: Zero matching skills must not receive artificial 40% floor...');
    const zeroMatchProfile = {
      skills: ['Woodworking', 'Gardening', 'Culinary Arts', 'Pastry Baking']
    };

    const gapZero = await callTool('career_gap_analysis', {
      resume: JSON.stringify(zeroMatchProfile),
      target_company: 'google'
    });
    const scoreZero = extractReadiness(gapZero);

    // Must not artificially floor at 40
    const noArtificialFloor = scoreZero === null || (scoreZero !== 40 && scoreZero < 40);

    assertTest(
      'Test D',
      'Zero matching skills must not receive artificial Math.max(40, ...) floor',
      noArtificialFloor,
      `scoreZero=${scoreZero}`,
      'career_gap_analysis currently applies Math.max(40, ...) floor granting 40% readiness to zero-evidence candidates.'
    );

    // =========================================================================
    // Test E — No fabricated strengths
    // =========================================================================
    console.log('\nRunning Test E: No fabricated strengths on empty/missing evidence...');
    const emptyProfile = { skills: [], summary: '' };
    const gapEmpty = await callTool('career_gap_analysis', {
      resume: JSON.stringify(emptyProfile),
      target_company: 'google'
    });

    const strengths = gapEmpty?.strengths || [];
    const hasFabricatedStrengths = strengths.includes('Software Engineering') ||
      strengths.includes('Problem Solving') ||
      strengths.includes('System Design') ||
      strengths.length > 0;

    const confidence = gapEmpty?.confidence ?? 100;
    const confidenceReflectsNoData = confidence < 50;

    assertTest(
      'Test E',
      'Missing evidence must not fabricate fallback strengths (e.g. Software Engineering / Problem Solving)',
      !hasFabricatedStrengths && confidenceReflectsNoData,
      `Strengths returned=${JSON.stringify(strengths)}, Confidence=${confidence}`,
      'career_gap_analysis pushes fallback strengths ["Software Engineering", "Problem Solving"] and returns 85% confidence when candidate provides zero evidence.'
    );

    // =========================================================================
    // Test F — career_action_plan must not return hard-coded 85%
    // =========================================================================
    console.log('\nRunning Test F: career_action_plan must not return hard-coded 85%...');
    const actionWeak = await callTool('career_action_plan', {
      resume: 'Novice with no technical background',
      targetRole: 'Staff Distributed Systems Engineer',
      targetCompany: 'Google'
    });
    const actionStrong = await callTool('career_action_plan', {
      resume: '15 years Staff Principal Engineer in Distributed Systems, C++, Python, Linux Kernel, Scalability',
      targetRole: 'Staff Distributed Systems Engineer',
      targetCompany: 'Google'
    });

    const readyWeak = actionWeak?.ready_estimate;
    const readyStrong = actionStrong?.ready_estimate;
    const actionNotHardcoded = readyWeak !== '85%' || (readyWeak !== readyStrong);

    assertTest(
      'Test F',
      'career_action_plan readiness estimate varies by profile evidence (not hard-coded 85%)',
      actionNotHardcoded,
      `Weak Candidate ready_estimate=${readyWeak}, Strong Candidate ready_estimate=${readyStrong}`,
      'career_action_plan hardcodes ready_estimate: "85%" regardless of candidate profile input.'
    );

    // =========================================================================
    // Test G — Score range & valid representation
    // =========================================================================
    console.log('\nRunning Test G: Score range validity (0 <= readiness <= 100 or null)...');
    const testCases = [
      { name: 'Empty Profile', profile: { skills: [] } },
      { name: 'Fully Matching', profile: { skills: ['Algorithms', 'Distributed Systems', 'Go', 'C++', 'Python', 'System Design', 'Scalability', 'Java'] } },
      { name: 'Partial Matching', profile: { skills: ['Python', 'System Design'] } }
    ];

    let rangeValid = true;
    const rangeDetails = [];
    for (const tc of testCases) {
      const res = await callTool('career_gap_analysis', {
        resume: JSON.stringify(tc.profile),
        target_company: 'google'
      });
      const score = extractReadiness(res);
      rangeDetails.push(`${tc.name}: ${score}`);
      if (score !== null && (typeof score !== 'number' || score < 0 || score > 100)) {
        rangeValid = false;
      }
    }

    assertTest(
      'Test G',
      'Readiness scores remain within bounded range [0, 100] or null',
      rangeValid,
      rangeDetails.join(', '),
      'Readiness scores must fall within valid bounds [0, 100].'
    );

    // =========================================================================
    // Test H — Insufficient evidence handling
    // =========================================================================
    console.log('\nRunning Test H: Insufficient evidence proxy handling...');
    const summaryOnlyProfile = {
      career_score: 65,
      resume_score: 65,
      github_score: 96,
      linkedin_score: 65,
      interview_readiness: 55,
      overall_career_score: 57
    };

    const gapSummary = await callTool('career_gap_analysis', {
      resume: JSON.stringify(summaryOnlyProfile),
      target_company: 'google'
    });

    const summaryScore = extractReadiness(gapSummary);
    const summaryConfidence = gapSummary?.confidence ?? 100;
    const summaryStrengths = gapSummary?.strengths || [];

    const handlesInsufficientEvidence = (
      (summaryScore === null || gapSummary?.isProvisional === true || summaryScore < 40) &&
      summaryConfidence < 50 &&
      !summaryStrengths.includes('Software Engineering')
    );

    assertTest(
      'Test H',
      'Score-summary proxy without skills evidence marked provisional/insufficient with low confidence',
      handlesInsufficientEvidence,
      `Score=${summaryScore}, Confidence=${summaryConfidence}, Strengths=${JSON.stringify(summaryStrengths)}`,
      'Score-summary proxies without skill evidence must not be treated as a complete skills inventory with high confidence.'
    );

    // =========================================================================
    // Test I — Authoritative company requirements registry usage
    // =========================================================================
    console.log('\nRunning Test I: Authoritative company requirements registry...');
    const googleCompanyPath = path.join(root, 'companies', 'google.json');
    const googleCompanyData = JSON.parse(fs.readFileSync(googleCompanyPath, 'utf8'));
    const authoritativeSkills = googleCompanyData.skills || [];

    // Check if mcp/server.js contains hard-coded COMPANY_STACKS bypassing companies/*.json
    const serverJsContent = fs.readFileSync(path.join(root, 'mcp', 'server.js'), 'utf8');
    const usesHardcodedStacks = serverJsContent.includes('const COMPANY_STACKS =') &&
      serverJsContent.includes('COMPANY_STACKS[coId]');

    assertTest(
      'Test I',
      'Company requirements sourced from authoritative registry (companies/google.json) without hard-coded COMPANY_STACKS override',
      !usesHardcodedStacks,
      `Authoritative Skills in companies/google.json=${JSON.stringify(authoritativeSkills)}, hardcoded COMPANY_STACKS present in server.js=${usesHardcodedStacks}`,
      'mcp/server.js defines a hard-coded COMPANY_STACKS dictionary that duplicates and diverges from companies/*.json.'
    );

    // =========================================================================
    // Test J — Target role/company weighting variation
    // =========================================================================
    console.log('\nRunning Test J: Target weighting variation across companies...');
    const iosProfile = {
      skills: ['Swift', 'SwiftUI', 'Objective-C', 'Metal', 'CoreML', 'iOS Development']
    };

    const appleGap = await callTool('career_gap_analysis', {
      resume: JSON.stringify(iosProfile),
      target_company: 'apple'
    });
    const googleGap = await callTool('career_gap_analysis', {
      resume: JSON.stringify(iosProfile),
      target_company: 'google'
    });

    const appleScore = extractReadiness(appleGap);
    const googleScore = extractReadiness(googleGap);

    assertTest(
      'Test J',
      'Candidate readiness reflects target company/role requirements (Apple iOS vs Google Distributed Systems)',
      (appleScore !== null && googleScore !== null && appleScore > googleScore),
      `Apple Readiness=${appleScore}, Google Readiness=${googleScore}`,
      'Target requirements must differentiate candidate readiness based on domain match.'
    );

    // =========================================================================
    // Test K — Pure & deterministic score evaluation
    // =========================================================================
    console.log('\nRunning Test K: Scoring determinism...');
    const testProfileK = {
      skills: ['Python', 'Algorithms', 'Distributed Systems']
    };

    const run1 = extractReadiness(await callTool('career_gap_analysis', { resume: JSON.stringify(testProfileK), target_company: 'google' }));
    const run2 = extractReadiness(await callTool('career_gap_analysis', { resume: JSON.stringify(testProfileK), target_company: 'google' }));
    const run3 = extractReadiness(await callTool('career_gap_analysis', { resume: JSON.stringify(testProfileK), target_company: 'google' }));

    const isDeterministic = (run1 === run2 && run2 === run3);

    assertTest(
      'Test K',
      'Readiness calculation is pure and deterministic across repeated executions',
      isDeterministic,
      `Run 1=${run1}, Run 2=${run2}, Run 3=${run3}`,
      'Scoring must produce identical output for identical input.'
    );

    // =========================================================================
    // Section 4 — Canonical Result Contract Shape
    // =========================================================================
    console.log('\nRunning Section 4: Canonical Result Contract Shape...');
    const candidateContractProfile = {
      skills: ['Python', 'System Design & Scalability']
    };

    const contractGap = await callTool('career_gap_analysis', {
      resume: JSON.stringify(candidateContractProfile),
      target_company: 'google'
    });

    // Verify canonical contract properties
    const hasReadinessScore = contractGap?.readinessScore !== undefined || contractGap?.estimated_readiness !== undefined;
    const hasComponentBreakdown = contractGap?.components !== undefined || (contractGap?.strengths !== undefined && contractGap?.weaknesses !== undefined);
    const hasConfidence = contractGap?.confidence !== undefined;
    const hasDataCoverage = contractGap?.dataCoverage !== undefined;
    const hasMissingEvidence = contractGap?.missingEvidence !== undefined;

    const conformsToCanonicalShape = hasReadinessScore && hasComponentBreakdown && hasConfidence && hasDataCoverage && hasMissingEvidence;

    assertTest(
      'Section 4 Contract',
      'Readiness evaluation exposes canonical schema: { readinessScore, components, confidence, dataCoverage, missingEvidence }',
      conformsToCanonicalShape,
      `readinessScore=${hasReadinessScore}, components=${hasComponentBreakdown}, confidence=${hasConfidence}, dataCoverage=${hasDataCoverage}, missingEvidence=${hasMissingEvidence}`,
      'career_gap_analysis currently lacks dataCoverage and missingEvidence fields from canonical result contract.'
    );

  } catch (err) {
    console.error('Fatal error during regression test execution:', err);
  } finally {
    mcpProcess.kill();

    console.log('\n================================================================');
    console.log('📊 READINESS REGRESSION TEST SUITE SUMMARY');
    console.log('================================================================');
    console.log(`Total Regression Tests : ${passedCount + failedCount}`);
    console.log(`Passed                 : ${passedCount}`);
    console.log(`Failed (Expected Bugs) : ${failedCount}`);
    console.log('================================================================\n');

    const reportPath = path.join(root, 'docs', 'reports', 'READINESS_REGRESSION_REPORT.md');
    const mdReport = [
      '# Career Agents Readiness Scoring Regression Test Report',
      `Generated: ${new Date().toISOString()}`,
      '',
      '## Test Results Summary',
      `- **Total Tests**: ${passedCount + failedCount}`,
      `- **Passed**: ${passedCount}`,
      `- **Failed (Known Bugs to Fix)**: ${failedCount}`,
      '',
      '## Detailed Test Results',
      ...results.map(r => `### ${r.id}: ${r.name}\n- **Status**: ${r.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}\n- **Details**: ${r.details}${r.failureReason ? `\n- **Known Bug / Root Cause**: ${r.failureReason}` : ''}\n`)
    ];

    try {
      fs.writeFileSync(reportPath, mdReport.join('\n'), 'utf8');
      console.log(`Report generated at: ${reportPath}`);
    } catch {}

    // Exit with 1 if there are failures (encoding the known bugs), or 0 if all pass
    process.exit(failedCount > 0 ? 1 : 0);
  }
}

setTimeout(runRegressionTests, 500);
