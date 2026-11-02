import assert from 'assert';
import dns from 'dns';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const require = createRequire(import.meta.url);

console.log('=== STARTING COPILOT SPECIALIST AGENT TESTS ===');

// brain.ts and packages/ai-router are TypeScript compiled by the web app; build them with the web
// app's compiler so this test runs the real Copilot specialist-agent path.
let ts;
try {
  ts = require(path.join(root, 'apps', 'web', 'node_modules', 'typescript'));
} catch {
  throw new Error('TypeScript not found: run `npm install` in apps/web before this test');
}

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'brain-specialists-'));
function compile(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const name = entry.name;
    const file = path.join(dir, name);
    if (entry.isDirectory()) { compile(file); continue; }
    if (!/\.(ts|js)$/.test(name) || name.endsWith('.d.ts')) continue;
    const source = fs.readFileSync(file, 'utf8').replace(/import\.meta\.url/g, "require('url').pathToFileURL(__filename).href");
    const { outputText } = ts.transpileModule(source, {
      fileName: name,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, allowJs: true }
    });
    const dest = path.join(workDir, path.relative(root, file)).replace(/\.ts$/, '.js');
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, outputText);
  }
}
for (const pkg of ['brain', 'ai-router', 'security']) compile(path.join(root, 'packages', pkg));

// Offline provider: host checks resolve to a public address and every request returns a fixed answer.
const MODEL_ANSWER = 'SPECIALIST_MODEL_RESPONSE';
const address = { address: '93.184.216.34', family: 4 };
dns.promises.lookup = async (host, options) => (options && options.all ? [address] : address);
let providerRequests = 0;
globalThis.fetch = async () => {
  providerRequests++;
  return new Response(JSON.stringify({ choices: [{ message: { content: MODEL_ANSWER } }] }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  });
};
for (const key of ['OPENAI_API_KEY', 'GEMINI_API_KEY', 'GROQ_API_KEY', 'ANTHROPIC_API_KEY', 'DEEPSEEK_API_KEY', 'OPENROUTER_API_KEY']) {
  delete process.env[key];
}

async function testSpecialistAgentsCallProvider() {
  console.log('Testing that Copilot specialist agents call the configured provider...');
  process.chdir(root); // the agent registry and prompts are resolved from the repository root
  const { processThroughBrain } = require(path.join(workDir, 'packages', 'brain', 'brain.js'));
  const gatewayConfig = {
    mode: 'manual',
    provider: 'openai',
    model: 'gpt-4o-mini',
    keys: { openai: ['sk-test'] },
    retryCount: 3,
    retryDelayMs: 1,
    streaming: false
  };

  const result = await processThroughBrain('How do I prepare for system design interviews at Google?', [], {}, {}, gatewayConfig);
  const critiques = result.systemPrompt.split('=== SPECIALIST AGENT CRITIQUES ===')[1] || '';
  const analyses = critiques.split('### [Agent: ').slice(1);

  assert.ok(analyses.length > 0, 'the query is matched to at least one specialist agent');
  assert.strictEqual(providerRequests, analyses.length, 'each specialist agent makes one provider request');
  for (const analysis of analyses) {
    assert.ok(analysis.includes(`Specialized Analysis:\n${MODEL_ANSWER}`), `specialist analysis comes from the provider:\n${analysis.slice(0, 300)}`);
  }
  console.log(`[PASS] ${analyses.length} specialist agent(s) returned the provider's answer.`);
}

let failed = false;
try {
  await testSpecialistAgentsCallProvider();
  console.log('=== ALL COPILOT SPECIALIST AGENT TESTS PASSED ===');
} catch (err) {
  failed = true;
  console.error('TEST FAILED:', err);
} finally {
  fs.rmSync(workDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
}
// The security package's rate limiter keeps an interval timer running.
process.exit(failed ? 1 : 0);
