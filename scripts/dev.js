import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Career Agents environment prep...');

// 1. Dependency-free env file parser
function loadEnvFile() {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    console.log('📝 Loading environment variables from .env...');
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }
}

loadEnvFile();

// Validate required environment settings
const requiredDev = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
const missingRequired = requiredDev.filter(key => !process.env[key]);
if (missingRequired.length > 0) {
  console.warn(`\n⚠️  WARNING: Missing required environment variables: ${missingRequired.join(', ')}`);
  console.warn(`Some database and authentication features will operate in degraded guest mode.\n`);
}

// 2. Repair cache (clear corrupted server pack.gz cache)
const cachePath = path.join(__dirname, '../apps/web/.next/cache');
if (fs.existsSync(cachePath)) {
  try {
    console.log('🧹 Validating build cache...');
    fs.rmSync(cachePath, { recursive: true, force: true });
    console.log('✅ Clean build cache prepared.');
  } catch (err) {
    console.warn('⚠️ Webpack cache check warning:', err.message);
  }
}

// 3. Generate Prisma client if missing
const prismaClientDir = path.join(__dirname, '../apps/web/node_modules/@prisma/client');
const schemaPath = path.join(__dirname, '../apps/web/prisma/schema.prisma');

if (!fs.existsSync(prismaClientDir) && fs.existsSync(schemaPath)) {
  console.log('📦 Prisma client not found. Generating...');
  try {
    execSync('npx prisma generate', { cwd: path.join(__dirname, '../apps/web'), stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Failed to generate Prisma client:', err.message);
  }
}

// 4. Start Next.js dev server
console.log('⚡ Launching Next.js dev server...');
try {
  execSync('next dev', { cwd: path.join(__dirname, '../apps/web'), stdio: 'inherit' });
} catch (err) {
  console.error('❌ Next.js dev server exited with error:', err.message);
  process.exit(1);
}
