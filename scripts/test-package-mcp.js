// Verifies the artifact that npm publishes, not merely the checked-out source.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const npmBin = path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin');
const npmCli = process.platform === 'win32' ? path.join(npmBin, 'npm-cli.js') : null;
const npm = npmCli ? process.execPath : 'npm';
const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'career-agents-mcp-'));
const cacheDir = path.join(workDir, 'npm-cache');
const packageDir = path.join(workDir, 'package');
const requiredFiles = [
  'package/scripts/cli.js',
  'package/mcp/server.js',
  'package/packages/core/executor.js',
  'package/services/readiness.js',
  'package/agent-registry.json',
  'package/career-agents.json',
  'package/skill-taxonomy.json'
];

function run(command, args, options = {}) {
  const commandArgs = command === npm && npmCli ? [npmCli, ...args] : args;
  const result = spawnSync(command, commandArgs, { encoding: 'utf8', ...options });
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed:\n${result.error?.message || result.stderr || result.stdout}`);
  return result;
}

async function handshake() {
  const installedCli = path.join(packageDir, 'node_modules', 'career-agents', 'scripts', 'cli.js');
  const installedBin = path.join(packageDir, 'node_modules', '.bin', process.platform === 'win32' ? 'career-agents.cmd' : 'career-agents');
  assert.ok(fs.existsSync(installedCli), 'installed package is missing its CLI entry point');
  assert.ok(fs.existsSync(installedBin), 'npm did not generate the career-agents executable');
  const child = spawn(process.execPath, [installedCli, 'mcp'], {
    cwd: packageDir,
    env: { ...process.env, NODE_ENV: 'production', npm_config_cache: cacheDir },
    stdio: ['pipe', 'pipe', 'pipe']
  });
  let stderr = '';
  child.stderr.on('data', chunk => { stderr += chunk; });

  return new Promise((resolve, reject) => {
    let toolCount = 0;
    let initialized = false;
    let complete = false;
    const fail = error => {
      if (complete) return;
      complete = true;
      clearTimeout(timeout);
      child.kill();
      reject(error);
    };
    const timeout = setTimeout(() => {
      fail(new Error(`MCP handshake timed out. stderr:\n${stderr}`));
    }, 30_000);
    const output = readline.createInterface({ input: child.stdout });
    output.on('line', line => {
      let message;
      try {
        message = JSON.parse(line);
      } catch {
        fail(new Error(`MCP wrote non-JSON data to stdout: ${line}`));
        return;
      }
      if (message.id === 1) {
        if (message.result?.serverInfo?.name !== 'career-agents-mcp') {
          fail(new Error('MCP initialize returned an unexpected server identity.'));
          return;
        }
        initialized = true;
        child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} })}\n`);
      }
      if (message.id === 2) {
        const names = new Set(message.result?.tools?.map(tool => tool.name));
        if (!names.has('search_agents') || names.size < 10) {
          fail(new Error(`MCP tools/list did not expose the expected tools (count: ${names.size}).`));
          return;
        }
        toolCount = names.size;
        child.kill();
      }
    });
    child.once('error', fail);
    child.once('close', code => {
      if (complete) return;
      complete = true;
      clearTimeout(timeout);
      if (initialized && toolCount) resolve(toolCount);
      else reject(new Error(`MCP process exited with code ${code}. stderr:\n${stderr}`));
    });
    setTimeout(() => {
      if (complete) return;
      child.stdin.write(`${JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'package-test', version: '1.0.0' } }
      })}\n`);
    }, 1_000);
  });
}

try {
  console.log('[1/4] Checking publishable JavaScript sources...');
  run(npm, ['run', 'build'], { cwd: root });

  console.log('[2/4] Creating and inspecting npm tarball...');
  const packed = JSON.parse(run(npm, ['pack', '--json', '--pack-destination', workDir, '--cache', cacheDir], { cwd: root }).stdout);
  const tarball = path.join(workDir, packed[0].filename);
  const contents = run('tar', ['-tf', tarball]).stdout.split(/\r?\n/);
  for (const file of requiredFiles) assert.ok(contents.includes(file), `missing from tarball: ${file}`);

  console.log('[3/4] Installing tarball in a clean temporary project...');
  fs.mkdirSync(packageDir);
  fs.writeFileSync(path.join(packageDir, 'package.json'), JSON.stringify({ name: 'mcp-package-test', private: true }));
  run(npm, ['install', '--ignore-scripts', tarball, '--cache', cacheDir], { cwd: packageDir });

  console.log('[4/4] Running the npm-installed MCP CLI initialize and tools/list...');
  const count = await handshake();
  console.log(`PASS: packaged MCP server initialized and exposed ${count} tools.`);
} finally {
  try {
    fs.rmSync(workDir, { recursive: true, force: true, maxRetries: 20, retryDelay: 500 });
  } catch (error) {
    // Windows may briefly retain a handle for npx's child process after it exits.
    console.error(`Warning: could not remove temporary test directory ${workDir}: ${error.message}`);
  }
}
