import assert from 'assert';
import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

console.log('=== STARTING CLI ROUTING TESTS ===');

function testDisabledCommand() {
  console.log('Testing disabled command outputs...');
  const featuresPath = path.join(root, 'features.json');
  const originalFeatures = fs.readFileSync(featuresPath, 'utf8');
  const tempFeatures = JSON.parse(originalFeatures);
  tempFeatures.githubAnalyzer = false;
  fs.writeFileSync(featuresPath, JSON.stringify(tempFeatures, null, 2));

  try {
    const res = spawnSync('node', [path.join(root, 'scripts', 'cli.js'), 'github', 'karthikrshet'], { encoding: 'utf8' });
    assert.ok(res.stdout.includes('Feature Disabled'));
    assert.ok(res.stdout.includes('disabled behind a feature flag'));
    console.log('[PASS] Disabled command blocked with warnings.');
  } finally {
    fs.writeFileSync(featuresPath, originalFeatures);
  }
}

function testEnabledCommandHelp() {
  console.log('Testing CLI printHelp layout...');
  const featuresPath = path.join(root, 'features.json');
  const originalFeatures = fs.readFileSync(featuresPath, 'utf8');
  const tempFeatures = JSON.parse(originalFeatures);
  tempFeatures.resumeStudio = true;
  tempFeatures.githubAnalyzer = false;
  tempFeatures.mockInterview = false;
  fs.writeFileSync(featuresPath, JSON.stringify(tempFeatures, null, 2));

  try {
    const res = spawnSync('node', [path.join(root, 'scripts', 'cli.js'), 'help'], { encoding: 'utf8' });
    assert.ok(res.stdout.includes('-- AI Resume Studio --'));
    // Verify disabled commands are hidden
    assert.ok(!res.stdout.includes('-- Profile & Fit Analyzers --'));
    assert.ok(!res.stdout.includes('-- Prep & Interactive Coaching --'));
    console.log('[PASS] Help screens match feature flag configurations.');
  } finally {
    fs.writeFileSync(featuresPath, originalFeatures);
  }
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
