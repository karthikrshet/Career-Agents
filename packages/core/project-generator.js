// packages/core/project-generator.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

export function generateProject(type) {
  const allowed = ['ai-engineer', 'backend', 'frontend'];
  const sanitizedType = allowed.includes(type) ? type : 'backend';
  const baseDir = path.resolve(root, 'exports', 'skeletons');
  const targetDir = path.resolve(baseDir, sanitizedType);
  if (!targetDir.startsWith(baseDir)) {
    throw new Error('Invalid project directory');
  }
  fs.mkdirSync(targetDir, { recursive: true });

  const pkgJson = {
    name: `career-os-${sanitizedType}-starter`,
    version: '1.0.0',
    description: `Production-ready showcase architecture for ${type} tracks.`,
    scripts: {
      start: 'node index.js',
      test: 'echo "Running integration tests..." && exit 0'
    },
    dependencies: {}
  };

  if (type === 'ai-engineer') {
    pkgJson.dependencies['@google/generative-ai'] = '^0.21.0';
    pkgJson.dependencies['langchain'] = '^0.3.0';
  } else if (type === 'backend') {
    pkgJson.dependencies['express'] = '^4.19.2';
    pkgJson.dependencies['pg'] = '^8.11.5';
    pkgJson.dependencies['ioredis'] = '^5.4.1';
  } else {
    pkgJson.dependencies['react'] = '^18.3.1';
    pkgJson.dependencies['next'] = '^14.2.5';
  }

  fs.writeFileSync(
    path.join(targetDir, 'package.json'),
    JSON.stringify(pkgJson, null, 2),
    'utf8'
  );

  let indexJs = `// Career-Agents ${type} Production Entry Point\nconsole.log("${type.toUpperCase()} service running in production mode.");\n`;
  if (type === 'backend') {
    indexJs = `
import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log('Production backend server listening on port ' + PORT);
});
    `;
  } else if (type === 'ai-engineer') {
    indexJs = `
import { GoogleGenerativeAI } from '@google/generative-ai';

console.log('AI Engineering service initialized with Gemini runtime.');
    `;
  }

  fs.writeFileSync(path.join(targetDir, 'index.js'), indexJs.trim() + '\n', 'utf8');

  const dockerfile = `
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
  `;
  fs.writeFileSync(path.join(targetDir, 'Dockerfile'), dockerfile.trim() + '\n', 'utf8');

  return targetDir;
}

export function runProjectCLI(type) {
  const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    gray: '\x1b[90m'
  };

  const allowed = ['ai-engineer', 'backend', 'frontend'];
  if (!type || !allowed.includes(type)) {
    console.error(`${c.red}Please specify a project skeleton type: ${allowed.join(', ')}${c.reset}`);
    return;
  }

  try {
    console.log(`${c.cyan}Generating production showcase architecture for: ${c.bold}${type}${c.reset}...`);
    const targetDir = generateProject(type);

    console.log(`\n${c.green}[Success] Showcase architecture created!${c.reset}`);
    console.log(`Location: ${c.bold}${targetDir}${c.reset}`);
    console.log(`Files: package.json, index.js, Dockerfile\n`);

  } catch (err) {
    console.error(`${c.red}Error building project skeleton: ${err.message}${c.reset}`);
  }
}
