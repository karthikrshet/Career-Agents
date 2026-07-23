import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

export function generateProject(type) {
  const targetDir = path.join(root, 'exports', 'skeletons', type);
  fs.mkdirSync(targetDir, { recursive: true });

  const pkgJson = {
    name: `showcase-${type}`,
    version: '1.0.0',
    description: `A mock developer project template for ${type} tracks.`,
    scripts: {
      start: 'node index.js',
      test: 'echo "Running tests..." && exit 0'
    },
    dependencies: {}
  };

  if (type === 'ai-engineer') {
    pkgJson.dependencies['@google/generative-ai'] = '^0.1.0';
    pkgJson.dependencies['langchain'] = '^0.0.1';
  } else if (type === 'backend') {
    pkgJson.dependencies['express'] = '^4.19.2';
    pkgJson.dependencies['pg'] = '^8.11.5';
  } else {
    pkgJson.dependencies['react'] = '^18.3.1';
    pkgJson.dependencies['next'] = '^14.2.3';
  }

  fs.writeFileSync(
    path.join(targetDir, 'package.json'),
    JSON.stringify(pkgJson, null, 2),
    'utf8'
  );

  let indexJs = `console.log("Mock ${type} main script loaded successfully.");\n`;
  if (type === 'backend') {
    indexJs = `
import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => res.json({ status: 'healthy' }));

app.listen(PORT, () => console.log('Backend listening on port ' + PORT));
    `;
  }
  fs.writeFileSync(path.join(targetDir, 'index.js'), indexJs, 'utf8');

  const dockerfile = `
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
  `;
  fs.writeFileSync(path.join(targetDir, 'Dockerfile'), dockerfile, 'utf8');

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
    console.log(`${c.cyan}Generating clean showcase project skeleton structure for: ${c.bold}${type}${c.reset}...`);
    const targetDir = generateProject(type);

    console.log(`\n${c.green}[Success] Skeleton directories created!${c.reset}`);
    console.log(`Location: ${c.bold}${targetDir}${c.reset}`);
    console.log(`Files: package.json, index.js, Dockerfile\n`);

  } catch (err) {
    console.error(`${c.red}Error building project skeleton: ${err.message}${c.reset}`);
  }
}
