import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateAgentRegistry } from '../services/agent-validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

console.log('=== STARTING AGENT VALIDATION TESTS ===');

function testRepositoryAgentsAreValid() {
  console.log('Testing registered agents against their prompt files...');
  const registry = JSON.parse(fs.readFileSync(path.join(root, 'agent-registry.json'), 'utf8'));
  const { errors } = validateAgentRegistry(registry.agents, (f) => path.join(root, f));

  assert.ok(registry.agents.length > 0, 'Registry should contain agents');
  assert.ok(registry.agents.some((a) => a.id === 'ats-resume-reviewer'), 'Registry should contain ats-resume-reviewer');
  assert.strictEqual(errors.length, 0, `Expected no validation errors, got ${errors.length}: ${errors.slice(0, 3).join(' | ')}`);

  console.log(`[PASS] All ${registry.agents.length} registered agents validate`);
}

function testInvalidAgentsAreStillReported() {
  console.log('Testing that malformed agents are still rejected...');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-validation-'));
  const sections = [
    '## Your Identity & Memory',
    '## Your Core Mission',
    '## Critical Rules You Must Follow',
    '## Technical Deliverables',
    '## Workflow Process'
  ].join('\n\nLorem ipsum.\n\n');
  const body = `${sections}\n\n${'word '.repeat(300)}`;
  const agentFile = (frontmatter, content = body) => `---\n${frontmatter}\n---\n\n${content}\n`;

  const files = {
    'valid-agent.md': agentFile('name: Valid Agent\ndescription: Fine.'),
    'renamed-file.md': agentFile('name: Renamed Agent'),
    'declared-id.md': agentFile('id: some-other-id\nname: Declared Id Agent'),
    'no-name.md': agentFile('description: Missing a name.'),
    'no-sections.md': agentFile('name: No Sections', 'word '.repeat(300))
  };
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), content, 'utf8');
  }

  const agents = [
    { id: 'valid-agent', filename: 'valid-agent.md' },
    { id: 'expected-id', filename: 'renamed-file.md' },
    { id: 'declared-id', filename: 'declared-id.md' },
    { id: 'no-name', filename: 'no-name.md' },
    { id: 'no-sections', filename: 'no-sections.md' },
    { id: 'missing-file', filename: 'missing-file.md' },
    { id: 'valid-agent', filename: 'valid-agent.md' }
  ];

  try {
    const { errors } = validateAgentRegistry(agents, (f) => path.join(dir, f));
    const errorsFor = (file) => errors.filter((e) => e.includes(`"${file}"`));

    assert.deepStrictEqual(errorsFor('valid-agent.md'), [], 'A well-formed agent without an id field should pass');
    assert.ok(errorsFor('renamed-file.md').some((e) => e.includes('Registry ID mismatch')), 'Registry id must match the agent file name');
    assert.ok(errorsFor('declared-id.md').some((e) => e.includes('Registry ID mismatch')), 'A conflicting frontmatter id must be reported');
    assert.ok(errorsFor('no-name.md').some((e) => e.includes('Missing or invalid frontmatter')), 'A missing name must be reported');
    assert.ok(errorsFor('no-sections.md').some((e) => e.includes('missing required heading section')), 'Missing sections must be reported');
    assert.ok(errorsFor('missing-file.md').some((e) => e.includes('does not exist')), 'A missing file must be reported');
    assert.ok(errors.includes('Duplicate Agent ID registered: valid-agent'), 'Duplicate ids must be reported');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }

  console.log('[PASS] Malformed agents are reported');
}

try {
  testRepositoryAgentsAreValid();
  testInvalidAgentsAreStillReported();
  console.log('=== ALL AGENT VALIDATION TESTS PASSED ===\n');
  process.exit(0);
} catch (e) {
  console.error('AGENT VALIDATION TEST FAILED:', e.message);
  process.exit(1);
}
