import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Starting Workspace Verification Pipeline...');

const tasks = [
  { name: '1. ESLint Check', cmd: 'npm run lint', cwd: path.join(__dirname, '../apps/web') },
  { name: '2. TypeScript Type Check', cmd: 'npm run type-check', cwd: path.join(__dirname, '../apps/web') },
  { name: '3. Next.js Build', cmd: 'npm run build', cwd: path.join(__dirname, '../apps/web') },
  { name: '4. Integrity Validation', cmd: 'python scripts/validate.py', cwd: path.join(__dirname, '..') },
  { name: '5. MCP Integration Tests', cmd: 'node scripts/test-mcp.js', cwd: path.join(__dirname, '..') },
];

let failed = false;

tasks.forEach((task) => {
  if (failed) return;
  console.log(`\n🏃 Running ${task.name}...`);
  try {
    execSync(task.cmd, { cwd: task.cwd, stdio: 'inherit' });
    console.log(`✅ ${task.name} Passed.`);
  } catch (err) {
    console.error(`❌ ${task.name} Failed.`);
    failed = true;
  }
});

console.log('\n=========================================');
if (failed) {
  console.error('❌ VERIFICATION FAIL: One or more stages returned errors.');
  process.exit(1);
} else {
  console.log('✅ VERIFICATION PASS: All pipeline stages completed successfully.');
}
