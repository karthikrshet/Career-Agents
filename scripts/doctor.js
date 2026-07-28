import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🩺 Running Career Agents Doctor Diagnostics...');

let passCount = 0;
let warnCount = 0;
let failCount = 0;

function report(name, status, details = '') {
  if (status === 'PASS') {
    console.log(`✅ [PASS] ${name} ${details ? `- ${details}` : ''}`);
    passCount++;
  } else if (status === 'WARN') {
    console.log(`⚠️  [WARN] ${name} ${details ? `- ${details}` : ''}`);
    warnCount++;
  } else {
    console.log(`❌ [FAIL] ${name} ${details ? `- ${details}` : ''}`);
    failCount++;
  }
}

// 1. Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
if (majorVersion >= 18) {
  report('Node.js Version', 'PASS', nodeVersion);
} else {
  report('Node.js Version', 'FAIL', `${nodeVersion} (Required: >=18)`);
}

// 2. npm version
try {
  const npmVersion = execSync('npm -v', { encoding: 'utf8' }).trim();
  report('npm Version', 'PASS', npmVersion);
} catch {
  report('npm Version', 'FAIL', 'Failed to read npm version');
}

// 3. Git Status
try {
  const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  report('Git Status', 'PASS', `On branch: ${gitBranch} ${gitStatus ? '(dirty)' : '(clean)'}`);
} catch {
  report('Git Status', 'WARN', 'Not a git repository or git CLI not found');
}

// 4. Environment configuration
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  report('Environment Configuration', 'PASS', '.env file exists');
} else {
  report('Environment Configuration', 'WARN', 'Missing .env file. Copy from .env.example');
}

// 5. Prisma
const schemaPath = path.join(__dirname, '../apps/web/prisma/schema.prisma');
if (fs.existsSync(schemaPath)) {
  report('Prisma Schema', 'PASS', 'schema.prisma exists');
} else {
  report('Prisma Schema', 'FAIL', 'schema.prisma is missing');
}

// 6. DB Connection string check
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  report('Database Secrets', 'PASS', 'DATABASE_URL is set');
} else {
  report('Database Secrets', 'WARN', 'DATABASE_URL is not configured (will run in degraded guest mode)');
}

// 7. AI Keys
const groqKey = process.env.GROQ_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;
if (groqKey || geminiKey) {
  report('AI Provider Keys', 'PASS', `Active keys: ${[groqKey && 'Groq', geminiKey && 'Gemini'].filter(Boolean).join(', ')}`);
} else {
  report('AI Provider Keys', 'WARN', 'No AI keys found in environment settings');
}

console.log(`\n📊 Diagnostics Summary: ${passCount} Passed, ${warnCount} Warnings, ${failCount} Failed.`);
if (failCount > 0) {
  console.log('🚨 System diagnostics failed. Run `npm run repair` to auto-resolve cache or config issues.');
  process.exit(1);
} else {
  console.log('🎉 System checks passed cleanly!');
}
