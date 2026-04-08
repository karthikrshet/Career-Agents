import assert from 'assert';
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

console.log('=== STARTING CLI ROUTING TESTS ===');

function testDisabledCommand() {
  console.log('Testing disabled command outputs...');
  const res = spawnSync('node', [path.join(root, 'scripts', 'cli.js'), 'github', 'karthikrshet'], { encoding: 'utf8' });
  
  assert.ok(res.stdout.includes('Feature Disabled'));
  assert.ok(res.stdout.includes('disabled behind a feature flag'));
  console.log('[PASS] Disabled command blocked with warnings.');
}

function testEnabledCommandHelp() {
  console.log('Testing CLI printHelp layout...');
  const res = spawnSync('node', [path.join(root, 'scripts', 'cli.js'), 'help'], { encoding: 'utf8' });
  
  assert.ok(res.stdout.includes('-- AI Resume Studio --'));
  // Verify disabled commands are hidden
  assert.ok(!res.stdout.includes('-- Profile & Fit Analyzers --'));
  assert.ok(!res.stdout.includes('-- Prep & Interactive Coaching --'));
  console.log('[PASS] Help screens match feature flag configurations.');
}

function run() {
  try {
    testDisabledCommand();
    testEnabledCommandHelp();
    console.log('=== ALL CLI ROUTING TESTS PASSED ===\n');
    process.exit(0);
  } catch (e) {
    console.error('TEST FAILED:', e);
    process.exit(1);
  }
}

run();
