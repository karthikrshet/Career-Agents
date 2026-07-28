import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIRECTORIES_TO_CLEAN = [
  path.join(__dirname, '../apps/web/.next'),
  path.join(__dirname, '../node_modules/.cache'),
  path.join(__dirname, '../.turbo'),
  path.join(__dirname, '../dist'),
  path.join(__dirname, '../coverage'),
];

console.log('🧹 Cleaning workspace development caches...');

DIRECTORIES_TO_CLEAN.forEach((dir) => {
  if (fs.existsSync(dir)) {
    try {
      console.log(`Removing ${path.relative(path.join(__dirname, '..'), dir)}...`);
      fs.rmSync(dir, { recursive: true, force: true });
    } catch (err) {
      console.warn(`⚠️ Failed to remove ${dir}: ${err.message}`);
    }
  }
});

console.log('✨ Cleanup complete!');
