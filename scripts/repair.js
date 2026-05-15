import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Running Career Agents Auto-Repair Sequence...');

// 1. Run workspace cache cleaner
try {
  console.log('🧼 Cleaning caches and lock files...');
  const cleanerPath = path.join(__dirname, 'clean-dev.js');
  if (fs.existsSync(cleanerPath)) {
    await import('./clean-dev.js');
  }
} catch (err) {
  console.error('❌ Cache cleanup step failed:', err.message);
}

// 2. Re-generate PrismaClient
try {
  console.log('📦 Re-generating Prisma Client client bindings...');
  execSync('npx prisma generate', { cwd: path.join(__dirname, '../apps/web'), stdio: 'inherit' });
  console.log('✅ Client successfully generated.');
} catch (err) {
  console.error('❌ Failed to re-generate Prisma Client:', err.message);
}

console.log('🎉 Repair complete! Environment is reset.');
