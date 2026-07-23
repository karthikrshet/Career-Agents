import assert from 'assert';
import { analyzeGithubProfile } from '../packages/github/analyzer.js';

console.log('=== STARTING GITHUB ANALYZER TESTS ===');

async function testGithubAnalyzer() {
  console.log('Testing GitHub analyzer scorecard...');
  const report = await analyzeGithubProfile('mock-dev');
  
  assert.strictEqual(report.username, 'mock-dev');
  assert.ok(report.score > 0 && report.score <= 100);
  assert.ok(report.strengths.length > 0);
  assert.ok(report.roadmap.length > 0);
  console.log('[PASS] GitHub Analyzer score compiled.');
}

async function run() {
  try {
    await testGithubAnalyzer();
    console.log('=== ALL GITHUB ANALYZER TESTS PASSED ===\n');
    process.exit(0);
  } catch (e) {
    console.error('TEST FAILED:', e);
    process.exit(1);
  }
}

run();
