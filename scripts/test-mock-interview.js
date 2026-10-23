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

console.log('=== STARTING MOCK INTERVIEW SCORING TESTS ===');

const strong = 'I led the migration of our payments service to Kubernetes after repeated outages. I designed the rollout plan, built canary deploys and automated rollback, and reduced p99 latency by 35% while cutting infrastructure cost by $40k per year across 12 services.';
const medium = 'I talked with the team about the problem and we agreed on a plan that everyone could follow together.';
const weak = 'I worked hard and the team liked it.';
const empty = '';

const briefFeedback = 'Answer is brief. Expand with Situation, Task, Action, Result context.';
const depthFeedback = 'Good explanation depth and communication clarity.';
const metricsFeedback = 'Add quantified metrics (%, $, latency numbers) to prove impact.';

// Expected results follow the existing CLI rules: 40 base, +25 for 30+ words or +15 for 15-29,
// +20 for a number or metric, +15 for an action verb, capped at 100.
const expected = {
  strong: { score: 100, feedback: [depthFeedback] },
  medium: { score: 55, feedback: [briefFeedback, metricsFeedback] },
  weak: { score: 40, feedback: [briefFeedback, metricsFeedback] },
  empty: { score: 40, feedback: [briefFeedback, metricsFeedback] }
};
const answers = { strong, medium, weak, empty };

const { evaluateInterviewAnswer } = await import('../packages/interview/engine.js');

function testEvaluator() {
  console.log('Testing the shared interview answer evaluator...');
  for (const [name, answer] of Object.entries(answers)) {
    assert.deepStrictEqual(evaluateInterviewAnswer(answer), expected[name], `${name} answer is scored by the existing rules`);
    for (let i = 0; i < 5; i++) {
      assert.deepStrictEqual(evaluateInterviewAnswer(answer), expected[name], `${name} answer is scored the same every time`);
    }
  }
  console.log('[PASS] The evaluator applies the existing scoring rules deterministically.');
}

// Runs one MCP session and waits for the server to exit after answering every request.
function mcpSession(calls) {
  return new Promise((resolve, reject) => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'mock-interview-'));
    const child = spawn(process.execPath, [path.join(root, 'scripts', 'cli.js'), 'mcp'], {
      env: { ...process.env, CAREER_AGENTS_HOME: home },
      stdio: ['pipe', 'pipe', 'pipe']
    });
    const responses = new Map();
    let stderr = '';
    const timeout = setTimeout(() => { child.kill(); reject(new Error(`MCP session timed out. stderr:\n${stderr}`)); }, 30_000);
    child.stderr.on('data', chunk => { stderr += chunk; });
    readline.createInterface({ input: child.stdout }).on('line', line => {
      const message = JSON.parse(line);
      responses.set(message.id, message);
      if (responses.size === calls.length) child.stdin.end();
    });
    child.once('error', reject);
    child.once('close', () => {
      clearTimeout(timeout);
      fs.rmSync(home, { recursive: true, force: true });
      if (responses.size === calls.length) resolve(calls.map((_, i) => responses.get(i + 1)));
      else reject(new Error(`MCP server exited before answering every request. stderr:\n${stderr}`));
    });
    child.stdin.write(calls.map((args, i) => JSON.stringify({
      jsonrpc: '2.0', id: i + 1, method: 'tools/call', params: { name: 'mock_interview', arguments: args }
    })).join('\n') + '\n');
  });
}

const interview = qaPairs => ({ company: 'google', mode: 'behavioral', qaPairs });
const ask = (...texts) => interview(JSON.stringify(texts.map(answer => ({ question: 'Tell me about a time you improved a system.', answer }))));
const resultOf = response => {
  assert.ok(response.result, `mock_interview failed: ${JSON.stringify(response.error)}`);
  return JSON.parse(response.result.content[0].text);
};

async function testMcpScores() {
  console.log('Testing mock_interview scores through the MCP server...');
  const repeated = (await mcpSession(Array(5).fill(ask(strong)))).map(resultOf);
  assert.deepStrictEqual(repeated.map(r => r.score), Array(5).fill(expected.strong.score), 'the same answer gets the same score on every call');

  const [weakResult, emptyResult, mediumResult, combined, none, invalid] = (await mcpSession([
    ask(weak), ask(empty), ask(medium), ask(strong, weak, medium), interview('[]'), interview('not json')
  ])).map(resultOf);
  assert.strictEqual(weakResult.score, evaluateInterviewAnswer(weak).score);
  assert.strictEqual(emptyResult.score, evaluateInterviewAnswer(empty).score);
  assert.strictEqual(mediumResult.score, evaluateInterviewAnswer(medium).score);
  assert.strictEqual(combined.total_questions, 3);
  assert.strictEqual(combined.score, Math.round((expected.strong.score + expected.weak.score + expected.medium.score) / 3), 'the overall score is the average of the answer scores');
  assert.deepStrictEqual([none.total_questions, none.score], [0, 0], 'an interview without answers scores 0');
  assert.deepStrictEqual([invalid.total_questions, invalid.score], [0, 0], 'unparseable qaPairs score 0');
  assert.deepStrictEqual(Object.keys(combined), ['company', 'mode', 'total_questions', 'status', 'score'], 'the response fields are unchanged');
  console.log('[PASS] mock_interview scores answers with the shared evaluator.');
}

testEvaluator();
await testMcpScores();
console.log('=== ALL MOCK INTERVIEW SCORING TESTS PASSED ===');
