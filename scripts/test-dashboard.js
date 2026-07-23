import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadProfile, updateLocalProfileScore } from '../packages/dashboard/profile-manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

console.log('=== STARTING CAREER DASHBOARD TESTS ===');

function testDashboardState() {
  console.log('Testing dashboard profile manager load/save/update...');
  
  const originalProfile = loadProfile();
  
  // Perform test updates
  updateLocalProfileScore('resume_score', 85);
  updateLocalProfileScore('github_score', 75);
  
  const updated = loadProfile();
  assert.strictEqual(updated.resume_score, 85);
  assert.strictEqual(updated.github_score, 75);
  assert.strictEqual(updated.overall_career_score, Math.round((85 + 75 + (updated.linkedin_score || 0) + (updated.interview_score || 0)) / 4));
  
  // Revert back original settings
  fs.writeFileSync(path.join(root, '.career-profile.json'), JSON.stringify(originalProfile, null, 2), 'utf8');
  console.log('[PASS] Dashboard profile manager updates correctly.');
}

function run() {
  try {
    testDashboardState();
    console.log('=== ALL CAREER DASHBOARD TESTS PASSED ===\n');
    process.exit(0);
  } catch (e) {
    console.error('TEST FAILED:', e);
    process.exit(1);
  }
}

run();
