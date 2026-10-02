import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeJobMatch } from '../packages/resume/job-match.js';
import { CompanyIntel } from '../packages/pipeline/company-intel.js';
import { DedupEngine } from '../packages/pipeline/dedup.js';
import { ApplicationTracker } from '../packages/pipeline/tracker.js';
import { JDMatcher } from '../packages/pipeline/jd-matcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

console.log('=== STARTING UNIT TESTS ===');

function testSemanticMatching() {
  console.log('Testing Semantic Matching...');
  
  const resume = {
    skills: ['React', 'Next.js', 'Node.js', 'TypeScript']
  };
  const jdText = 'Looking for a Software Engineer with JavaScript and SQL skills.';
  
  const result = analyzeJobMatch(resume, jdText);
  assert.ok(result, 'Result should not be null');
  
  // React/Next.js/TypeScript in resume should match JavaScript in JD via taxonomy
  assert.ok(result.matchedKeywords.includes('javascript'), 'JavaScript should be matched semantically');
  assert.ok(result.missingKeywords.includes('sql'), 'SQL should be missing');
  assert.ok(result.confidence > 0, 'Confidence should be computed');
  
  console.log('[PASS] Semantic Matching');
}

function testFuzzyMatching() {
  console.log('Testing Fuzzy Search Query Normalization...');
  
  const searchIndex = JSON.parse(fs.readFileSync(path.join(root, 'search-index.json'), 'utf8'));
  assert.ok(searchIndex.items.length > 0, 'Search index should not be empty');
  
  console.log('[PASS] Fuzzy Search Query');
}

function testGraphTraversal() {
  console.log('Testing Knowledge Graph Traversal...');
  
  const graph = JSON.parse(fs.readFileSync(path.join(root, 'knowledge-graph.json'), 'utf8'));
  assert.ok(graph.nodes && graph.edges, 'Graph should have nodes and edges');
  
  // BFS algorithm validation
  const adj = {};
  for (const n of graph.nodes) {
    adj[n.id] = [];
  }
  for (const e of graph.edges) {
    if (adj[e.source] && adj[e.target]) {
      adj[e.source].push({ id: e.target, relation: e.relation });
      adj[e.target].push({ id: e.source, relation: e.relation });
    }
  }

  // Find shortest path from salesforce to skill-api-design-(rest/graphql)
  const queue = [];
  const visited = new Set();
  let foundPath = null;

  queue.push({ id: 'salesforce', path: ['salesforce'] });
  visited.add('salesforce');

  while (queue.length > 0) {
    const { id, path: currentPath } = queue.shift();
    if (id === 'skill-api-design-(rest/graphql)') {
      foundPath = currentPath;
      break;
    }
    const neighbors = adj[id] || [];
    for (const nb of neighbors) {
      if (!visited.has(nb.id)) {
        visited.add(nb.id);
        queue.push({ id: nb.id, path: [...currentPath, nb.id] });
      }
    }
  }

  assert.ok(foundPath, 'BFS should find a path between Salesforce and GraphQL');
  console.log('BFS Path found:', foundPath.join(' -> '));
  console.log('[PASS] Knowledge Graph BFS Traversal');
}

function testActionTools() {
  console.log('Testing action-oriented tools parsing helpers...');

  // Matcher for Lever job URL
  const leverUrl = 'https://jobs.lever.co/stripe/job-id-123';
  const leverMatch = leverUrl.match(/jobs\.lever\.co\/([^/]+)\/([^/]+)/);
  assert.ok(leverMatch, 'Lever URL regex should match');
  assert.strictEqual(leverMatch[1], 'stripe');
  assert.strictEqual(leverMatch[2], 'job-id-123');

  // Matcher for Greenhouse job URL
  const ghUrl = 'https://boards.greenhouse.io/github/jobs/job-id-456';
  const ghMatch = ghUrl.match(/boards\.greenhouse\.io\/([^/]+)\/jobs\/([^/]+)/);
  assert.ok(ghMatch, 'Greenhouse URL regex should match');
  assert.strictEqual(ghMatch[1], 'github');
  assert.strictEqual(ghMatch[2], 'job-id-456');

  // GitHub languages formatting
  const repos = [
    { language: 'TypeScript' },
    { language: 'TypeScript' },
    { language: 'JavaScript' }
  ];
  const langCounts = {};
  repos.forEach(r => {
    if (r.language) {
      langCounts[r.language] = (langCounts[r.language] || 0) + 1;
    }
  });
  const topLanguages = Object.entries(langCounts).sort((a, b) => b[1] - a[1]).map(e => e[0]);
  assert.strictEqual(topLanguages[0], 'TypeScript');
  assert.strictEqual(topLanguages[1], 'JavaScript');

  console.log('[PASS] Action-Oriented parsing helpers');
}

function testCompanyIntel() {
  console.log('Testing CompanyIntel profile and requirements loading...');

  const google = CompanyIntel.getProfile('google');
  assert.strictEqual(google.found, true);
  assert.strictEqual(google.name, 'Google');
  assert.ok(Array.isArray(google.requiredSkills) && google.requiredSkills.length > 0, 'Google requiredSkills must be non-empty array');
  assert.ok(google.requiredSkills.some(s => s.toLowerCase().includes('data structures')), 'Google must require DSA');
  assert.ok(Array.isArray(google.interviewStages) && google.interviewStages.length > 0, 'Google interviewStages must be non-empty array');
  assert.ok(google.interviewStages.some(s => s.toLowerCase().includes('phone screen') || s.toLowerCase().includes('dsa')), 'Google interview stages must be loaded from registry');

  const amazon = CompanyIntel.getProfile('amazon');
  assert.strictEqual(amazon.found, true);
  assert.strictEqual(amazon.name, 'Amazon');
  assert.ok(amazon.requiredSkills.some(s => s.toLowerCase().includes('leadership principles')), 'Amazon must require Leadership Principles');

  const unlisted = CompanyIntel.getProfile('non-existent-corp-xyz');
  assert.strictEqual(unlisted.found, false);
  assert.strictEqual(unlisted.tier, 'Standard Tech');
  assert.ok(unlisted.requiredSkills.length > 0, 'Unlisted company must have fallback skills');

  console.log('[PASS] CompanyIntel profile and requirements');
}

function testDedupEngine() {
  console.log('Testing DedupEngine deduplication and normalizers...');

  // 1. Normalizers
  assert.strictEqual(DedupEngine.normalizeCompany('Google, Inc.'), 'google');
  assert.strictEqual(DedupEngine.normalizeCompany('Stripe LLC'), 'stripe');
  assert.strictEqual(DedupEngine.normalizeRole('Senior SWE'), 'senior software engineer');
  assert.strictEqual(DedupEngine.normalizeRole('Staff SDE'), 'staff software engineer');

  // 2. Deduplication with undefined / missing notes (must not throw TypeError)
  const entriesWithMissingNotes = [
    { company: 'Stripe', role: 'Software Engineer', status: 'applied' },
    { company: 'Stripe Inc', role: 'SWE', status: 'interviewing', notes: 'First round done' },
    { company: 'Google', role: 'Backend Engineer', status: 'screening' },
    { company: 'Google', role: 'Backend Engineer', status: 'screening', notes: 'Recruiter called' }
  ];

  const deduped = DedupEngine.deduplicate(entriesWithMissingNotes);
  assert.strictEqual(deduped.length, 2, 'Should deduplicate Stripe and Google entries');
  assert.strictEqual(deduped[0].notes, 'First round done', 'Should merge notes onto entry with originally undefined notes');
  assert.strictEqual(deduped[1].notes, 'Recruiter called', 'Should merge notes onto Google entry');

  // 3. Deduplication merging multiple non-empty notes
  const multiNotes = [
    { company: 'Netflix', role: 'Platform Engineer', notes: 'Applied online' },
    { company: 'Netflix', role: 'Platform Engineer', notes: 'Referral sent' }
  ];
  const merged = DedupEngine.deduplicate(multiNotes);
  assert.strictEqual(merged.length, 1);
  assert.strictEqual(merged[0].notes, 'Applied online; Referral sent');

  console.log('[PASS] DedupEngine deduplication and normalizers');
}

function testTrackerStatusTargeting() {
  console.log('Testing ApplicationTracker status updates with several roles at one company...');

  const tracker = new ApplicationTracker([
    { company: 'Google', role: 'Software Engineer', status: 'applied', appliedDate: '2026-09-01', fitScore: 82, link: 'https://careers.google.com/jobs/1', notes: 'Referral from alumni' },
    { company: 'Google', role: 'Data Engineer', status: 'applied', appliedDate: '2026-09-03', fitScore: null, link: '', notes: 'Applied online' },
    { company: 'Stripe', role: 'Backend Engineer', status: 'screening', appliedDate: '2026-09-05', fitScore: 75, link: '', notes: '' }
  ]);
  const [googleSwe, googleData, stripe] = tracker.entries;
  const sweBefore = { ...googleSwe };

  // 1. Targeting a role updates only that application
  const updated = tracker.updateStatus('Google', 'Interviewing', 'Onsite scheduled', 'data engineer');
  assert.strictEqual(updated, googleData, 'Should return the Data Engineer application');
  assert.strictEqual(googleData.status, 'interviewing');
  assert.strictEqual(googleData.notes, 'Applied online; Onsite scheduled');
  assert.deepStrictEqual(googleSwe, sweBefore, 'Software Engineer application must be untouched');

  // 2. Without a role, a company with several applications is ambiguous
  assert.strictEqual(tracker.updateStatus('Google', 'offer', 'Which one?'), null, 'Ambiguous company should not be updated');
  assert.strictEqual(googleSwe.status, 'applied');
  assert.strictEqual(googleData.status, 'interviewing');

  // 3. Without a role, a company with a single application still works
  assert.strictEqual(tracker.updateStatus('stripe', 'interviewing', 'Hiring manager call'), stripe);
  assert.strictEqual(stripe.status, 'interviewing');
  assert.strictEqual(stripe.notes, 'Hiring manager call');

  // 4. Unknown role is not found
  assert.strictEqual(tracker.updateStatus('Google', 'offer', '', 'Product Manager'), null);

  // 5. Markdown round-trip keeps each application's own status
  const reloaded = ApplicationTracker.parseMarkdown(tracker.toMarkdown()).entries;
  assert.deepStrictEqual(reloaded.map(e => [e.company, e.role, e.status]), [
    ['Google', 'Software Engineer', 'applied'],
    ['Google', 'Data Engineer', 'interviewing'],
    ['Stripe', 'Backend Engineer', 'interviewing']
  ]);

  console.log('[PASS] ApplicationTracker status updates target the intended application');
}

function testJDMatcherRequirementExtraction() {
  console.log('Testing JDMatcher requirement extraction (C++, C#, .NET, and word boundary edge cases)...');

  // 1. C++, C#, .NET extraction from job description
  const jdWithPunctuationSkills = `
    Job Title: Senior Systems Engineer
    Responsibilities:
    - Architect low-latency distributed engines using modern C++ (C++20).
    - Maintain enterprise services written in C# and .NET frameworks.
    - Build event-driven pipelines with Python and Docker.
  `;

  const extracted = JDMatcher.extractRequirements(jdWithPunctuationSkills);
  assert.ok(Array.isArray(extracted.skills), 'skills must be an array');
  assert.ok(extracted.skills.includes('C++'), 'JDMatcher must extract C++');
  assert.ok(extracted.skills.includes('C#'), 'JDMatcher must extract C#');
  assert.ok(extracted.skills.includes('.NET'), 'JDMatcher must extract .NET');
  assert.ok(extracted.skills.includes('Python'), 'JDMatcher must extract Python');
  assert.ok(extracted.skills.includes('Docker'), 'JDMatcher must extract Docker');

  // 2. Negative edge cases: do not false-match inside other words or compound identifiers
  const negativeJD = 'Building planet-scale tools for Google using ongoing trust networks in java_script and dot.net.bad';
  const negativeExtracted = JDMatcher.extractRequirements(negativeJD);
  assert.strictEqual(negativeExtracted.skills.includes('.NET'), false, 'Should not match dot.net.bad as .NET');
  assert.strictEqual(negativeExtracted.skills.includes('Go'), false, 'Should not match inside Google or ongoing as Go');
  assert.strictEqual(negativeExtracted.skills.includes('Rust'), false, 'Should not match inside trust as Rust');
  assert.strictEqual(negativeExtracted.skills.includes('Java'), false, 'Should not match inside java_script as Java');

  // 3. Repeated case-insensitive skills should be deduplicated
  const repeatedJD = 'Must know C++, c++, and modern C++. Also Python and python.';
  const repeatedExtracted = JDMatcher.extractRequirements(repeatedJD);
  assert.strictEqual(repeatedExtracted.skills.filter(s => s.toLowerCase() === 'c++').length, 1, 'C++ must be deduplicated');
  assert.strictEqual(repeatedExtracted.skills.filter(s => s.toLowerCase() === 'python').length, 1, 'Python must be deduplicated');

  // 4. Safe handling of invalid / empty inputs
  assert.deepStrictEqual(JDMatcher.extractRequirements(null), { skills: [], qualifications: [], raw: '' });
  assert.deepStrictEqual(JDMatcher.extractRequirements(''), { skills: [], qualifications: [], raw: '' });

  console.log('[PASS] JDMatcher requirement extraction');
function testTrackerMarkdownRoundTrip() {
  console.log('Testing ApplicationTracker save and reload keeps every application...');

  const applications = [
    { company: 'Stripe', role: 'Backend Engineer', status: 'applied', appliedDate: '2026-09-01', fitScore: 82, link: 'https://stripe.com/jobs/1', notes: 'Referral' },
    { company: 'Acme --- Labs', role: 'Senior Engineer', status: 'screening', appliedDate: '2026-09-02', fitScore: null, link: 'https://jobs.example.com/senior-engineer---remote', notes: 'Remote --- US only' },
    { company: 'Globex', role: 'SRE', status: 'applied', appliedDate: '2026-09-03', fitScore: null, link: '', notes: '' },
    { company: 'Initech', role: 'Data Engineer', status: 'interviewing', appliedDate: '2026-09-04', fitScore: 60, link: '', notes: 'Company culture call; Role is hybrid' }
  ];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tracker-round-trip-'));
  const file = path.join(dir, 'pipeline-tracker.md');
  try {
    new ApplicationTracker(applications.map(a => ({ ...a }))).save(file);
    assert.deepStrictEqual(ApplicationTracker.load(file).entries, applications, 'save then load returns the same applications');

    // Saving what was loaded must not change anything either.
    ApplicationTracker.load(file).save(file);
    assert.deepStrictEqual(ApplicationTracker.load(file).entries, applications, 'a second save and load is stable');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }

  // Tracker files written by earlier versions use '-' for an empty link and may align the separator row.
  const legacy = ApplicationTracker.parseMarkdown([
    '# Job Application Pipeline Tracker',
    '',
    '| Company | Role | Status | Applied Date | Fit Score | Link | Notes |',
    '|:--------|:-----|:------:|--------------|----------:|------|-------|',
    '| Globex | SRE | applied | 2026-09-03 | - | - |  |',
    '| Stripe | Backend Engineer | offer | 2026-09-01 | 82% | https://stripe.com/jobs/1 | Referral |',
    ''
  ].join('\n')).entries;
  assert.deepStrictEqual(legacy, [
    { company: 'Globex', role: 'SRE', status: 'applied', appliedDate: '2026-09-03', fitScore: null, link: '', notes: '' },
    { company: 'Stripe', role: 'Backend Engineer', status: 'offer', appliedDate: '2026-09-01', fitScore: 82, link: 'https://stripe.com/jobs/1', notes: 'Referral' }
  ], 'existing tracker files still load, with "-" read as an empty link');

  console.log('[PASS] ApplicationTracker save and reload keeps every application');
}

try {
  testSemanticMatching();
  testFuzzyMatching();
  testGraphTraversal();
  testActionTools();
  testCompanyIntel();
  testDedupEngine();
  testTrackerStatusTargeting();
  testJDMatcherRequirementExtraction();
  testTrackerMarkdownRoundTrip();
  console.log('=== ALL UNIT TESTS PASSED ===\n');
  process.exit(0);
} catch (e) {
  console.error('UNIT TEST FAILED:', e);
  process.exit(1);
}
