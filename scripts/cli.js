#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const root = path.resolve(new URL(import.meta.url).pathname, '..', '..');
const divisionsPath = path.join(root, 'divisions.json');

function loadDivisions() {
  const raw = fs.readFileSync(divisionsPath, 'utf8');
  return JSON.parse(raw);
}

function listAgents() {
  const divisions = loadDivisions();
  const rows = [];
  for (const division of divisions.divisions) {
    for (const agent of division.agents) {
      rows.push(`${agent.id} (${division.id}) - ${agent.status}`);
    }
  }
  console.log(rows.join('\n'));
}

function findAgent(agentId) {
  const divisions = loadDivisions();
  for (const division of divisions.divisions) {
    for (const agent of division.agents) {
      if (agent.id === agentId) {
        return agent;
      }
    }
  }
  return null;
}

function installAgent(agentId, target = './installed_agents') {
  const agent = findAgent(agentId);
  if (!agent) {
    console.error(`Agent '${agentId}' not found in divisions.json.`);
    process.exit(1);
  }
  const source = path.join(root, agent.file);
  if (!fs.existsSync(source)) {
    console.error(`Agent file not found: ${agent.file}`);
    process.exit(1);
  }
  const destination = path.resolve(target);
  fs.mkdirSync(destination, { recursive: true });
  const targetFile = path.join(destination, path.basename(agent.file));
  fs.copyFileSync(source, targetFile);
  console.log(`Installed ${agent.id} to ${targetFile}`);
}

function validate() {
  const validateScript = path.join(root, 'scripts', 'validate.py');
  if (!fs.existsSync(validateScript)) {
    console.error('validate.py not found.');
    process.exit(1);
  }
  const result = spawnSync('python', [validateScript], { stdio: 'inherit' });
  process.exit(result.status);
}

function printHelp() {
  console.log(`Usage: codemyfyp-agents <command> [args]

Commands:
  list                   List available agents in divisions.json
  info <agent-id>        Show agent metadata and file location
  install <agent-id> [target-dir]  Copy the agent file into the target directory
  validate               Run repository validation checks
`);
}

async function main() {
  const [, , cmd, arg1, arg2] = process.argv;
  if (!cmd || cmd === 'help') {
    printHelp();
    return;
  }

  switch (cmd) {
    case 'list':
      listAgents();
      break;
    case 'info': {
      const agent = findAgent(arg1);
      if (!agent) {
        console.error(`Agent '${arg1}' not found.`);
        process.exit(1);
      }
      console.log(JSON.stringify(agent, null, 2));
      break;
    }
    case 'install':
      installAgent(arg1, arg2 || './installed_agents');
      break;
    case 'validate':
      validate();
      break;
    default:
      printHelp();
      process.exit(1);
  }
}

main();
