import assert from 'assert';
import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import { ApplicationTracker } from '../packages/pipeline/tracker.js';

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
    assert.ok(res.stdout.includes('-- Application Pipeline & Job Search --'));
    assert.ok(res.stdout.includes('pipeline tracker'));
    assert.ok(res.stdout.includes('resume <subcommand>'));
    // Verify disabled commands are hidden
    assert.ok(!res.stdout.includes('-- Profile & Fit Analyzers --'));
    assert.ok(!res.stdout.includes('-- Prep & Interactive Coaching --'));
    console.log('[PASS] Help screens match feature flag configurations.');
  } finally {
    fs.writeFileSync(featuresPath, originalFeatures);
  }
}

function testResumeScoreCommand() {
  console.log('Testing resume score command execution...');
  const templatePath = path.join(root, 'templates', 'fresher', 'basic-fresher', 'template.json');
  const res = spawnSync('node', [path.join(root, 'scripts', 'cli.js'), 'resume', 'score', templatePath], { encoding: 'utf8' });
  assert.strictEqual(res.status, 0, 'resume score command should exit with code 0');
  assert.ok(res.stdout.includes('ATS RESUME COMPLIANCE AUDIT'), 'output should contain audit header');
  assert.ok(res.stdout.includes('OVERALL ATS SCORE:'), 'output should contain overall score');
  assert.ok(res.stdout.includes('Formatting & Completeness'), 'output should contain formatting subscore');

  const noArgRes = spawnSync('node', [path.join(root, 'scripts', 'cli.js'), 'resume', 'score'], { encoding: 'utf8' });
  assert.strictEqual(noArgRes.status, 0);
  assert.ok(noArgRes.stderr.includes('Usage: career-agents resume score'), 'should display usage on missing file argument');
  console.log('[PASS] Resume score command executes and handles arguments cleanly.');
}

function testPipelineStatusRole() {
  console.log('Testing pipeline status with several roles at one company...');
  const trackerPath = path.join(root, 'pipeline-tracker.md');
  let originalTracker = null;
  try {
    originalTracker = fs.readFileSync(trackerPath, 'utf8');
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  const readStatuses = () => fs.readFileSync(trackerPath, 'utf8').split('\n')
    .filter(l => l.startsWith('| Google'))
    .map(l => l.split('|').slice(1, 4).map(c => c.trim()).join(' / '));

  try {
    fs.writeFileSync(trackerPath, [
      '# Job Application Pipeline Tracker',
      '',
      '| Company | Role | Status | Applied Date | Fit Score | Link | Notes |',
      '|---------|------|--------|--------------|-----------|------|-------|',
      '| Google | Software Engineer | applied | 2026-09-01 | - | - |  |',
      '| Google | Data Engineer | applied | 2026-09-03 | - | - |  |',
      ''
    ].join('\n'), 'utf8');
    const cli = path.join(root, 'scripts', 'cli.js');

    const res = spawnSync('node', [cli, 'pipeline', 'status', 'Google', 'interviewing', 'Onsite scheduled', '--role', 'Data Engineer'], { encoding: 'utf8' });
    assert.strictEqual(res.status, 0);
    assert.deepStrictEqual(readStatuses(), ['Google / Software Engineer / applied', 'Google / Data Engineer / interviewing']);
    assert.ok(fs.readFileSync(trackerPath, 'utf8').includes('| Google | Data Engineer | interviewing | 2026-09-03 | - | - | Onsite scheduled |'), 'Note should be on the Data Engineer row');

    const ambiguous = spawnSync('node', [cli, 'pipeline', 'status', 'Google', 'offer'], { encoding: 'utf8' });
    assert.ok(ambiguous.stdout.includes('--role'), 'Ambiguous update should ask for --role');
    assert.deepStrictEqual(readStatuses(), ['Google / Software Engineer / applied', 'Google / Data Engineer / interviewing'], 'Ambiguous update must not change the tracker');
  } finally {
    if (originalTracker === null) {
      fs.rmSync(trackerPath, { force: true });
    } else {
      fs.writeFileSync(trackerPath, originalTracker, 'utf8');
    }
  }
  console.log('[PASS] pipeline status updates only the requested role.');
}

function testPipelineAddKeepsExistingFields() {
  console.log('Testing that pipeline add keeps the fields of an existing application...');
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'pipeline-add-'));
  const trackerPath = path.join(home, 'pipeline-tracker.md');
  const env = { ...process.env, CAREER_AGENTS_HOME: home };
  const cli = path.join(root, 'scripts', 'cli.js');
  const add = (...args) => {
    const res = spawnSync('node', [cli, 'pipeline', 'add', ...args], { encoding: 'utf8', env });
    assert.strictEqual(res.status, 0, res.stderr);
    return res.stdout;
  };
  const seed = rows => fs.writeFileSync(trackerPath, new ApplicationTracker(rows).toMarkdown(), 'utf8');
  const entries = () => ApplicationTracker.load(trackerPath).entries;
  const offer = { company: 'Stripe', role: 'Backend Engineer', status: 'offer', appliedDate: '2026-08-01', fitScore: 88, link: 'https://stripe.com/jobs/123', notes: 'Verbal offer from hiring manager' };

  try {
    // A. Re-adding an existing application without a URL changes nothing.
    seed([offer]);
    const output = add('Stripe', 'Backend Engineer');
    assert.deepStrictEqual(entries(), [offer], 'status, date, link, notes and fit score are kept');
    assert.ok(output.includes('Stripe - Backend Engineer (offer)'), 'the output reports the stored status');

    // B. Re-adding with a new URL updates only the link.
    const interviewing = { ...offer, status: 'interviewing', notes: 'Onsite on Friday' };
    seed([interviewing]);
    add('Stripe', 'Backend Engineer', 'https://stripe.com/jobs/456');
    assert.deepStrictEqual(entries(), [{ ...interviewing, link: 'https://stripe.com/jobs/456' }], 'only the link changes');

    // C. A new application still gets the default status, date and link.
    seed([offer]);
    add('Linear', 'Product Engineer');
    const today = new Date().toISOString().split('T')[0];
    assert.deepStrictEqual(entries(), [offer, { company: 'Linear', role: 'Product Engineer', status: 'applied', appliedDate: today, fitScore: null, link: '', notes: '' }]);

    // D. A different capitalisation updates the existing row and keeps its spelling.
    seed([offer]);
    add('stripe', 'backend engineer');
    assert.deepStrictEqual(entries(), [offer], 'the stored company and role spelling is kept');
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
  console.log('[PASS] pipeline add keeps the fields of an existing application.');
}

function run() {
  try {
    testDisabledCommand();
    testEnabledCommandHelp();
    testResumeScoreCommand();
    testPipelineStatusRole();
    testPipelineAddKeepsExistingFields();
    console.log('=== ALL CLI ROUTING TESTS PASSED ===\n');
    process.exit(0);
  } catch (e) {
    console.error('TEST FAILED:', e);
    process.exit(1);
  }
}

run();
