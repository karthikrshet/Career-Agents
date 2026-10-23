import assert from 'assert';
import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

console.log('=== STARTING MCP CONCURRENT ANALYSIS TESTS ===');

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-concurrency-'));
const tmpDir = path.join(workDir, 'tmp');
fs.mkdirSync(tmpDir);

// Runs one MCP session. All requests are written to stdin in a single chunk, so the server
// starts every handler before any of them finishes: the requests overlap deterministically.
function mcpBatch(calls) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(root, 'scripts', 'cli.js'), 'mcp'], {
      env: { ...process.env, CAREER_AGENTS_HOME: path.join(workDir, 'home'), TMPDIR: tmpDir, TMP: tmpDir, TEMP: tmpDir },
      stdio: ['pipe', 'pipe', 'pipe']
    });
    const responses = new Map();
    let stderr = '';
    const timeout = setTimeout(() => { child.kill(); reject(new Error(`MCP session timed out. stderr:\n${stderr}`)); }, 60_000);
    child.stderr.on('data', chunk => { stderr += chunk; });
    readline.createInterface({ input: child.stdout }).on('line', line => {
      const message = JSON.parse(line);
      responses.set(message.id, message);
      if (responses.size === calls.length + 1) {
        clearTimeout(timeout);
        child.kill();
        resolve(calls.map((_, i) => responses.get(i + 1)));
      }
    });
    child.once('error', reject);
    const lines = [{ jsonrpc: '2.0', id: 0, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'concurrency-test', version: '1.0.0' } } }]
      .concat(calls.map(([name, args], i) => ({ jsonrpc: '2.0', id: i + 1, method: 'tools/call', params: { name, arguments: args } })));
    child.stdin.write(lines.map(l => JSON.stringify(l)).join('\n') + '\n');
  });
}

const resultText = response => {
  assert.ok(response.result, `expected a result, got ${JSON.stringify(response.error)}`);
  return response.result.content[0].text;
};

const strongResume = [
  'Jane Doe', 'Senior Backend Engineer', '',
  'EXPERIENCE', 'Stripe — Backend Engineer (2021–2024)',
  '- Built payment APIs in Go and Kubernetes serving 10M requests/day',
  '- Reduced p99 latency by 35% through caching',
  '- Led migration of 40 services to AWS, cutting cost 22%', '',
  'PROJECTS', '- Open-source rate limiter (2k GitHub stars)', '',
  'SKILLS', 'Go, Python, Kubernetes, PostgreSQL, AWS, Distributed Systems, Docker, Terraform', '',
  'EDUCATION', 'B.S. Computer Science, MIT'
].join('\n');
const weakResume = 'Bob\nlooking for a job\n\ni am hard working';
const strongProfile = 'Senior Backend Engineer | Go, TypeScript, Python | Designed and shipped APIs at scale.\nAbout: I architected and scaled payment systems, built testing pipelines and shipped JavaScript tooling used by 200 engineers.';
const weakProfile = 'Looking for opportunities.';

const resumePackageTemp = path.join(root, 'exports', 'reports', 'mcp_temp_resume.txt');
const linkedinPackageTemp = path.join(root, 'exports', 'reports', 'mcp_temp_linkedin.txt');
const fileState = file => { try { return fs.statSync(file).mtimeMs; } catch { return null; } };

const cases = [
  ['analyze_resume', text => ({ resumeText: text, company: '' }), strongResume, weakResume],
  ['resume_score', text => ({ resumeText: text }), strongResume, weakResume],
  ['resume_review', text => ({ resumeText: text, company: '' }), strongResume, weakResume],
  ['linkedin_review', text => ({ profileText: text }), strongProfile, weakProfile]
];

try {
  const packageTempBefore = [fileState(resumePackageTemp), fileState(linkedinPackageTemp)];

  for (const [tool, args, strong, weak] of cases) {
    console.log(`Testing overlapping ${tool} calls...`);
    const [strongAlone] = await mcpBatch([[tool, args(strong)]]);
    const [weakAlone] = await mcpBatch([[tool, args(weak)]]);
    assert.notStrictEqual(resultText(strongAlone), resultText(weakAlone), `${tool} fixtures must produce different results`);

    const [strongResult, weakResult] = await mcpBatch([[tool, args(strong)], [tool, args(weak)]]);
    assert.strictEqual(resultText(strongResult), resultText(strongAlone), `${tool}: the first request must be analysed from its own input`);
    assert.strictEqual(resultText(weakResult), resultText(weakAlone), `${tool}: the second request must be analysed from its own input`);
    console.log(`[PASS] Overlapping ${tool} calls each return the result for their own input.`);
  }

  console.log('Testing that a failed analysis still removes its temporary input...');
  const [failed] = await mcpBatch([['resume_score', {}]]);
  assert.ok(failed.error, 'resume_score without resumeText should fail');
  console.log('[PASS] The failing request returned an error.');

  console.log('Testing that no temporary analysis input is left behind...');
  assert.deepStrictEqual(fs.readdirSync(tmpDir), [], 'every per-request temporary directory is removed');
  assert.deepStrictEqual([fileState(resumePackageTemp), fileState(linkedinPackageTemp)], packageTempBefore,
    'analysis input is not written to the shared mcp_temp_* files in the package');
  console.log('[PASS] No temporary analysis input remains.');

  console.log('=== ALL MCP CONCURRENT ANALYSIS TESTS PASSED ===');
} finally {
  fs.rmSync(workDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
}
