import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseResumeFile } from '../packages/resume/file-parser.js';
import { analyzeResumeStudio } from '../packages/resume/studio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

console.log('=== STARTING RESUME STUDIO TESTS ===');

async function testResumeParsing() {
  console.log('Testing Resume parsing...');
  const tempPath = path.join(root, 'exports', 'test_resume_temp.md');
  fs.mkdirSync(path.dirname(tempPath), { recursive: true });
  fs.writeFileSync(tempPath, `
Alex Smith
alex.smith@example.com
linkedin.com/in/alexsmith

# Summary
Software Architect with 8 years experience building backend APIs.

# Experience
Role: Architect at Stripe (2020 - 2024)
- Designed payment gateway routes, reducing latency by 45%.
- Implemented robust error filters.

# Skills
Python, Go, SQL, APIs, Docker, Git

# Education
Degree: BS Computer Science from MIT (2016-2020)
  `, 'utf8');

  const resume = await parseResumeFile(tempPath);
  assert.strictEqual(resume.header.name, 'Alex Smith');
  assert.strictEqual(resume.header.email, 'alex.smith@example.com');
  assert.ok(resume.skills.includes('Python'));
  assert.strictEqual(resume.experience[0].company, 'Stripe');
  assert.strictEqual(resume.experience[0].bullets.length, 2);

  console.log('[PASS] Resume parsing matches expectations.');
}

async function testResumeAnalysis() {
  console.log('Testing Resume Studio Scorer & Bullet audits...');
  const tempPath = path.join(root, 'exports', 'test_resume_temp.md');
  const report = await analyzeResumeStudio(tempPath, 'stripe');
  
  assert.ok(report.overallScore > 0 && report.overallScore <= 100);
  assert.ok(report.categoryScores.experience > 0);
  assert.ok(report.keywordAnalysis.matched.includes('apis'));
  assert.ok(report.weakBullets.length >= 0);
  assert.ok(report.bulletRewrites.length >= 0);
  assert.ok(report.companyOptimizations.length > 0);

  console.log('[PASS] Scorer and audits successfully evaluated.');
}

async function run() {
  try {
    await testResumeParsing();
    await testResumeAnalysis();
    console.log('=== ALL RESUME STUDIO TESTS PASSED ===\n');
    process.exit(0);
  } catch (e) {
    console.error('TEST FAILED:', e);
    process.exit(1);
  }
}

run();
