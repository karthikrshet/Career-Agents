import assert from 'assert';
import { spawn, spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { resolveDataDir, migrateLegacyData } from '../packages/core/data-dir.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const cli = path.join(root, 'scripts', 'cli.js');
const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'career agents data-'));

console.log('=== STARTING DATA DIRECTORY TESTS ===');

function readOrNull(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

function restore(file, content) {
  if (content === null) fs.rmSync(file, { force: true });
  else fs.writeFileSync(file, content, 'utf8');
}

function childEnv(overrides) {
  const env = { ...process.env, ...overrides };
  if (!overrides.CAREER_AGENTS_HOME) delete env.CAREER_AGENTS_HOME;
  return env;
}

function testResolutionRules() {
  console.log('Testing data directory resolution rules...');
  const cases = [
    { name: 'Windows', p: path.win32, pkg: 'C:\\Users\\Jane Doe\\AppData\\Roaming\\npm\\node_modules\\career-agents', home: 'C:\\Users\\Jane Doe', repo: 'C:\\src\\Career-Agents', custom: 'D:\\Career Data' },
    { name: 'Linux', p: path.posix, pkg: '/usr/lib/node_modules/career-agents', home: '/home/jane doe', repo: '/home/jane doe/src/Career-Agents', custom: '/srv/career data' },
    { name: 'macOS', p: path.posix, pkg: '/Users/jane/.npm/_npx/1a2b3c/node_modules/career-agents', home: '/Users/jane', repo: '/Users/jane/Career-Agents', custom: '/Users/jane/Career Data' }
  ];

  for (const { name, p, pkg, home, repo, custom } of cases) {
    const resolve = (env, root, homeDir = home) => resolveDataDir({ env, root, homeDir, pathApi: p });
    assert.strictEqual(resolve({}, pkg), p.join(home, '.career-agents'), `${name}: installed package uses the per-user directory`);
    assert.strictEqual(resolve({}, repo), repo, `${name}: source checkout keeps its repository-local data`);
    assert.strictEqual(resolve({ CAREER_AGENTS_HOME: custom }, pkg), custom, `${name}: CAREER_AGENTS_HOME wins for installed packages`);
    assert.strictEqual(resolve({ CAREER_AGENTS_HOME: custom }, repo), custom, `${name}: CAREER_AGENTS_HOME wins for source checkouts`);
    assert.strictEqual(resolve({ CAREER_AGENTS_HOME: '   ' }, repo), repo, `${name}: a blank CAREER_AGENTS_HOME is ignored`);
    assert.strictEqual(resolve({}, pkg, ''), pkg, `${name}: without a home directory the package directory is still used`);
  }

  assert.strictEqual(resolveDataDir({ env: { CAREER_AGENTS_HOME: 'relative-data' }, root }), path.resolve('relative-data'), 'relative CAREER_AGENTS_HOME resolves against the working directory');
  assert.strictEqual(resolveDataDir({ env: {} }), root, 'this checkout is treated as a source checkout');
  console.log('[PASS] Data directory resolution rules hold on Windows, Linux and macOS paths.');
}

function testLegacyMigration() {
  console.log('Testing one-time migration of data from the package directory...');
  const pkg = path.join(workDir, 'project', 'node_modules', 'career-agents');
  const dataDir = path.join(workDir, 'home', '.career-agents');
  fs.mkdirSync(pkg, { recursive: true });
  fs.writeFileSync(path.join(pkg, 'pipeline-tracker.md'), 'legacy tracker\n', 'utf8');
  fs.writeFileSync(path.join(pkg, '.career-profile.json'), '{"name":"legacy"}', 'utf8');

  assert.deepStrictEqual(migrateLegacyData({ root: pkg, dataDir }), ['pipeline-tracker.md', '.career-profile.json']);
  assert.strictEqual(fs.readFileSync(path.join(dataDir, 'pipeline-tracker.md'), 'utf8'), 'legacy tracker\n');
  assert.strictEqual(fs.readFileSync(path.join(dataDir, '.career-profile.json'), 'utf8'), '{"name":"legacy"}');
  assert.strictEqual(fs.readFileSync(path.join(pkg, 'pipeline-tracker.md'), 'utf8'), 'legacy tracker\n', 'legacy data is left in place');

  // Later runs must not bring legacy data back over what the user has since changed or removed.
  fs.writeFileSync(path.join(dataDir, 'pipeline-tracker.md'), 'newer tracker\n', 'utf8');
  fs.rmSync(path.join(dataDir, '.career-profile.json'));
  assert.deepStrictEqual(migrateLegacyData({ root: pkg, dataDir }), []);
  assert.strictEqual(fs.readFileSync(path.join(dataDir, 'pipeline-tracker.md'), 'utf8'), 'newer tracker\n');
  assert.strictEqual(readOrNull(path.join(dataDir, '.career-profile.json')), null);

  // Existing files in a data directory are never overwritten by the first migration either.
  const existingDir = path.join(workDir, 'existing-data');
  fs.mkdirSync(existingDir);
  fs.writeFileSync(path.join(existingDir, 'pipeline-tracker.md'), 'current tracker\n', 'utf8');
  assert.deepStrictEqual(migrateLegacyData({ root: pkg, dataDir: existingDir }), ['.career-profile.json']);
  assert.strictEqual(fs.readFileSync(path.join(existingDir, 'pipeline-tracker.md'), 'utf8'), 'current tracker\n');

  // Source checkouts already read their data from the legacy location.
  assert.deepStrictEqual(migrateLegacyData({ root: pkg, dataDir: pkg }), []);
  console.log('[PASS] Legacy data is copied once, without overwriting or deleting anything.');
}

function testCliUsesDataDir() {
  console.log('Testing that the CLI keeps tracker and profile data in CAREER_AGENTS_HOME...');
  const dataDir = path.join(workDir, 'cli data');
  const env = childEnv({ CAREER_AGENTS_HOME: dataDir });

  const add = spawnSync(process.execPath, [cli, 'pipeline', 'add', 'Stripe', 'Backend Engineer'], { encoding: 'utf8', env });
  assert.strictEqual(add.status, 0, add.stderr);
  assert.ok(fs.readFileSync(path.join(dataDir, 'pipeline-tracker.md'), 'utf8').includes('| Stripe | Backend Engineer |'), 'tracker is written to the data directory');

  const list = spawnSync(process.execPath, [cli, 'pipeline', 'tracker'], { encoding: 'utf8', env });
  assert.strictEqual(list.status, 0, list.stderr);
  assert.ok(list.stdout.includes('Stripe'), 'tracker is read back from the data directory');

  const dashboard = spawnSync(process.execPath, [cli, 'dashboard'], { encoding: 'utf8', env });
  assert.strictEqual(dashboard.status, 0, dashboard.stderr);
  assert.ok(JSON.parse(fs.readFileSync(path.join(dataDir, '.career-profile.json'), 'utf8')).goals, 'profile is written to the data directory');
  console.log('[PASS] CLI tracker and profile data follow CAREER_AGENTS_HOME.');
}

function mcpSession(env, requests) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, 'mcp'], { env, stdio: ['pipe', 'pipe', 'pipe'] });
    const responses = new Map();
    let stderr = '';
    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error(`MCP session timed out. stderr:\n${stderr}`));
    }, 30_000);
    child.stderr.on('data', chunk => { stderr += chunk; });
    readline.createInterface({ input: child.stdout }).on('line', line => {
      const message = JSON.parse(line);
      responses.set(message.id, message);
      if (responses.size === requests.length) {
        clearTimeout(timeout);
        child.kill();
        resolve(responses);
      }
    });
    child.once('error', reject);
    setTimeout(() => {
      requests.forEach((request, index) => {
        child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id: index + 1, ...request })}\n`);
      });
    }, 1000);
  });
}

const initialize = { method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'data-dir-test', version: '1.0.0' } } };
const toolText = response => JSON.parse(response.result.content[0].text);

async function testMcpUsesDataDir() {
  console.log('Testing that MCP starts with an empty data directory and stores tracker data there...');
  const dataDir = path.join(workDir, 'mcp data', 'nested');
  const responses = await mcpSession(childEnv({ CAREER_AGENTS_HOME: dataDir }), [
    initialize,
    { method: 'tools/call', params: { name: 'career_pipeline_track', arguments: { action: 'add', company: 'Linear', role: 'Product Engineer' } } },
    { method: 'tools/call', params: { name: 'career_pipeline_track', arguments: { action: 'list' } } },
    { method: 'tools/call', params: { name: 'career_pipeline_track', arguments: { action: 'add', company: 'Linear' } } }
  ]);
  assert.strictEqual(responses.get(1).result.serverInfo.name, 'career-agents-mcp');
  assert.strictEqual(toolText(responses.get(2)).success, true);
  assert.deepStrictEqual(toolText(responses.get(3)).entries.map(e => e.company), ['Linear']);
  assert.ok(fs.readFileSync(path.join(dataDir, 'pipeline-tracker.md'), 'utf8').includes('| Linear | Product Engineer |'));
  const mcpLog = fs.readFileSync(path.join(dataDir, 'exports', 'logs', 'mcp.log'), 'utf8');
  assert.ok(mcpLog.includes('Executing tool call: career_pipeline_track'), 'MCP log is written to the data directory');
  assert.ok(!mcpLog.includes('Product Engineer'), 'MCP log does not record request or response payloads');
  assert.ok(responses.get(4).error.message.includes('Missing company or role'), 'the client still receives the tool error');
  const audit = fs.readFileSync(path.join(dataDir, 'exports', 'logs', 'mcp_audit.log'), 'utf8').trim().split('\n').map(line => JSON.parse(line));
  assert.deepStrictEqual(audit.map(e => [e.method, e.success, e.error]), [
    ['tools/call/career_pipeline_track', true, ''],
    ['tools/call/career_pipeline_track', true, ''],
    ['tools/call/career_pipeline_track', false, 'Execution error']
  ], 'audit log records tool failures without the error text');
  console.log('[PASS] MCP tracker data and logs follow CAREER_AGENTS_HOME.');

  console.log('Testing that MCP still starts when its log directory cannot be created...');
  const blocker = path.join(workDir, 'not-a-directory');
  fs.writeFileSync(blocker, '', 'utf8');
  const blocked = await mcpSession(childEnv({ CAREER_AGENTS_HOME: path.join(blocker, 'data') }), [
    initialize,
    { method: 'tools/list', params: {} }
  ]);
  assert.strictEqual(blocked.get(1).result.serverInfo.name, 'career-agents-mcp');
  assert.ok(blocked.get(2).result.tools.length > 10, 'tools/list is served without a writable log file');
  console.log('[PASS] An unwritable log location does not prevent MCP startup.');
}

const rootTracker = path.join(root, 'pipeline-tracker.md');
const rootProfile = path.join(root, '.career-profile.json');
const originalTracker = readOrNull(rootTracker);
const originalProfile = readOrNull(rootProfile);

try {
  testResolutionRules();
  testLegacyMigration();
  testCliUsesDataDir();
  await testMcpUsesDataDir();
  assert.strictEqual(readOrNull(rootTracker), originalTracker, 'the checkout tracker is untouched when CAREER_AGENTS_HOME is set');
  assert.strictEqual(readOrNull(rootProfile), originalProfile, 'the checkout profile is untouched when CAREER_AGENTS_HOME is set');
  console.log('=== ALL DATA DIRECTORY TESTS PASSED ===');
} finally {
  restore(rootTracker, originalTracker);
  restore(rootProfile, originalProfile);
  fs.rmSync(workDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
}
