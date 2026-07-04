#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawnSync, exec } from 'child_process';
import readline from 'readline';
import { fileURLToPath } from 'url';

import { executeAgent } from '../runtime/executor.js';
import { recommendProfile } from '../recommendation-engine/recommender.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const registryPath = path.join(root, 'agent-registry.json');
const divisionsPath = path.join(root, 'divisions.json');
const toolsPath = path.join(root, 'tools.json');
const workflowsPath = path.join(root, 'workflow-registry.json');
const searchIndexPath = path.join(root, 'search-index.json');
const knowledgeGraphPath = path.join(root, 'knowledge-graph.json');
const careerOsPath = path.join(root, 'career-os.json');

const bundlesDir = path.join(root, 'bundles');
const companiesDir = path.join(root, 'companies');
const pathsDir = path.join(root, 'career-paths');
const intelligenceDir = path.join(root, 'intelligence');

const launcherRegistryPath = path.join(root, 'launcher', 'launcher-registry.json');
const launcherConfigPath = path.join(root, 'launcher', 'launcher-config.json');

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  purple: '\x1b[35m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m'
};

function loadJSON(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error(`${c.red}Failed to load ${path.basename(filePath)}: ${e.message}${c.reset}`);
    process.exit(1);
  }
}

function printBanner() {
  console.log(`
${c.purple}${c.bold}   ______                               ___                        __      
  / ____/___ _________  ___  ________  /   | ____ ____  ____  / /______
 / /   / __ \`/ ___/ _ \\/ _ \\/ ___/ _ \\/ /| |/ __ \`/ _ \\/ __ \\/ __/ ___/
/ /___/ /_/ / /  /  __/  __/ /  /  __/ ___ / /_/ /  __/ / / / /_/__  ) 
\\____/\\__,_/_/   \\___/\\___/_/   \\___/_/  |_\\__, /\\___/_/ /_/\\__/____/  
                                          /____/                       
                     ${c.cyan}THE CAREER OPERATING SYSTEM${c.reset}
  `);
}

// ────────────────────────────────────────────────────────────────
// CLI ACTIONS
// ────────────────────────────────────────────────────────────────

function listAll() {
  const divisionsData = loadJSON(divisionsPath);
  printBanner();
  console.log(`${c.bold}=== CAREER DIVISIONS & AGENTS ===${c.reset}\n`);
  for (const div of divisionsData.divisions) {
    console.log(`${c.purple}📁 ${div.name} Division (${div.division})${c.reset} - ${div.count} Agents`);
    console.log(`   ${c.gray}${div.description}${c.reset}`);
  }
  console.log(`\nTo view bundles, use: ${c.cyan}career-agents bundles${c.reset}`);
  console.log(`To view career paths, use: ${c.cyan}career-agents path${c.reset}`);
  console.log(`To view companies, use: ${c.cyan}career-agents company${c.reset}`);
}

function searchCatalog(query) {
  if (!query) {
    console.log(`${c.red}Please provide a search term.${c.reset}`);
    return;
  }
  const normalized = query.toLowerCase();
  
  if (!fs.existsSync(searchIndexPath)) {
    console.log(`${c.yellow}Search index not found. Building indices first...${c.reset}`);
    runUpdate();
  }

  const indexData = loadJSON(searchIndexPath);
  console.log(`${c.bold}Search results matching "${query}" in Career OS index:${c.reset}\n`);

  let matches = 0;
  for (const item of indexData.items) {
    const contentToSearch = [
      item.id,
      item.name,
      item.type,
      item.description,
      ...(item.tags || []),
      ...(item.skills || []),
      ...(item.companies || [])
    ].join(' ').toLowerCase();

    if (contentToSearch.includes(normalized)) {
      let icon = '•';
      let color = c.reset;
      if (item.type === 'agent') { icon = '🤖'; color = c.green; }
      else if (item.type === 'workflow') { icon = '🔄'; color = c.cyan; }
      else if (item.type === 'division') { icon = '📁'; color = c.purple; }
      else if (item.type === 'career-path') { icon = '🎓'; color = c.yellow; }
      else if (item.type === 'company') { icon = '🏢'; color = c.bold; }

      console.log(`${icon} [${c.bold}${item.type.toUpperCase()}${c.reset}] ${color}${item.name}${c.reset} (${item.id})`);
      console.log(`   ${c.gray}${item.description}${c.reset}`);
      matches++;
    }
  }

  if (matches === 0) {
    console.log(`${c.gray}No matches found in the search index.${c.reset}`);
  } else {
    console.log(`\nFound ${matches} match(es).`);
  }
}

function runAgent(agentId, exportFormat) {
  const registry = loadJSON(registryPath);
  const agent = registry.agents.find(a => a.id === agentId);
  if (!agent) {
    console.error(`${c.red}Agent '${agentId}' not found.${c.reset}`);
    return;
  }

  const agentFilePath = path.join(root, agent.filename);
  if (!fs.existsSync(agentFilePath)) {
    console.error(`${c.red}Agent file not found: ${agent.filename}${c.reset}`);
    return;
  }

  if (exportFormat) {
    const format = exportFormat.toLowerCase();
    const content = fs.readFileSync(agentFilePath, 'utf8');
    let outputContent = '';
    let ext = '';
    
    switch (format) {
      case 'markdown':
      case 'md':
        outputContent = content;
        ext = 'md';
        break;
      case 'json':
        outputContent = JSON.stringify(agent, null, 2);
        ext = 'json';
        break;
      case 'yaml':
        outputContent = `id: "${agent.id}"\nname: "${agent.name}"\ndivision: "${agent.division}"\nvibe: "${agent.vibe}"\nprompt: |\n${content.split('\n').map(line => '  ' + line).join('\n')}`;
        ext = 'yaml';
        break;
      case 'txt':
        outputContent = `AGENT ID: ${agent.id}\nNAME: ${agent.name}\nVIBE: ${agent.vibe}\n\nINSTRUCTIONS:\n${content}`;
        ext = 'txt';
        break;
      case 'prompt-bundle':
      case 'bundle':
        outputContent = `System Prompt for ${agent.name}:\n\nYou are the ${agent.name}, an AI assistant operating within the Career Operating System.\nYour personality and communication style: ${agent.vibe}.\n\nInstructions and Rules:\n${content}`;
        ext = 'prompt-bundle.txt';
        break;
      case 'llm-bundle':
        outputContent = `## System Instructions for ${agent.name}\n\n${content}\n\n## Custom Context Rules\nExperience: ${agent.experience_level}\nStage: ${agent.career_stage}\nIndustry: ${agent.industry}\nSkills: ${agent.skills.join(', ')}`;
        ext = 'llm-bundle.md';
        break;
      default:
        console.error(`${c.red}Unsupported export format '${exportFormat}'. Choose from: markdown, json, yaml, txt, prompt-bundle, llm-bundle.${c.reset}`);
        return;
    }

    const outDir = path.join(root, 'exports');
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, `${agent.id}.${ext}`);
    fs.writeFileSync(outFile, outputContent, 'utf8');
    console.log(`\n${c.green}[Success] Exported '${agent.name}' to format '${format}'!${c.reset}`);
    console.log(`=> Path: ${c.bold}${outFile}${c.reset}`);
    return;
  }

  // Live Executor run
  executeAgent(agent, agentFilePath);
}

function handleBundles(bundleId) {
  if (!fs.existsSync(bundlesDir)) {
    console.error(`${c.red}Bundles directory does not exist.${c.reset}`);
    return;
  }
  
  if (!bundleId) {
    console.log(`${c.bold}=== Available Career Bundles ===${c.reset}\n`);
    const files = fs.readdirSync(bundlesDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const b = loadJSON(path.join(bundlesDir, file));
      console.log(`🎁 ${c.cyan}${b.id}${c.reset} - ${b.name}`);
      console.log(`   ${c.gray}${b.description}${c.reset}`);
    }
    console.log(`\nUse: ${c.yellow}career-agents bundles <bundle-id>${c.reset} to inspect details.`);
    console.log(`Use: ${c.yellow}career-agents bundle run <bundle-id>${c.reset} to run a bundle.`);
    return;
  }

  const bundlePath = path.join(bundlesDir, `${bundleId}.json`);
  if (!fs.existsSync(bundlePath)) {
    console.error(`${c.red}Bundle '${bundleId}' not found.${c.reset}`);
    return;
  }

  const b = loadJSON(bundlePath);
  console.log(`\n${c.purple}🎁 Bundle: ${b.name} (${b.id})${c.reset}`);
  console.log(`Description: ${c.gray}${b.description}${c.reset}`);
  console.log(`\n${c.bold}Agents involved:${c.reset} ${b.agents.join(', ')}`);
  console.log(`${c.bold}Workflows included:${c.reset} ${b.workflows.join(', ')}`);
  console.log(`${c.bold}Core Skills developed:${c.reset} ${b.skills.join(', ')}`);
  console.log(`${c.bold}Target Companies mapped:${c.reset} ${b.companies.join(', ')}`);
  console.log(`${c.bold}Target Career Paths:${c.reset} ${b.career_paths.join(', ')}`);
}

function runBundleExecution(bundleId) {
  const bundlePath = path.join(bundlesDir, `${bundleId}.json`);
  if (!fs.existsSync(bundlePath)) {
    console.error(`${c.red}Bundle '${bundleId}' not found.${c.reset}`);
    return;
  }

  const b = loadJSON(bundlePath);
  console.log(`\n${c.purple}=== Executing Career Bundle Dashboard: ${b.name} ===${c.reset}`);
  console.log(`Milestone Focus: ${c.gray}${b.description}${c.reset}\n`);

  console.log(`${c.bold}Included Agents to Run:${c.reset}`);
  b.agents.forEach((aid, idx) => {
    console.log(`  [${idx + 1}] Run: ${c.green}${aid}${c.reset}`);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(`\nSelect an agent index to execute (or 'exit'): `, (ans) => {
    rl.close();
    const idx = parseInt(ans.trim(), 10) - 1;
    if (idx >= 0 && idx < b.agents.length) {
      const selectedAgentId = b.agents[idx];
      runAgent(selectedAgentId);
    } else {
      console.log(`${c.gray}Exited bundle execution dashboard.${c.reset}`);
    }
  });
}

function handlePaths(pathId) {
  if (!fs.existsSync(pathsDir)) {
    console.error(`${c.red}Career paths directory does not exist.${c.reset}`);
    return;
  }

  if (!pathId) {
    console.log(`${c.bold}=== Mapped Career Paths ===${c.reset}\n`);
    const files = fs.readdirSync(pathsDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const p = loadJSON(path.join(pathsDir, file));
      console.log(`🎓 ${c.green}${p.id}${c.reset} - ${p.name}`);
      console.log(`   ${c.gray}${p.description}${c.reset}`);
    }
    console.log(`\nUse: ${c.yellow}career-agents path <path-id>${c.reset} to inspect details.`);
    return;
  }

  const pathFile = path.join(pathsDir, `${pathId}.json`);
  if (!fs.existsSync(pathFile)) {
    console.error(`${c.red}Career path '${pathId}' not found.${c.reset}`);
    return;
  }

  const p = loadJSON(pathFile);
  console.log(`\n${c.purple}🎓 Career Path Dashboard: ${p.name} (${p.id})${c.reset}`);
  console.log(`Description: ${c.gray}${p.description}${c.reset}`);
  console.log(`\n${c.bold}Required core competencies:${c.reset} ${p.core_skills.join(', ')}`);
  console.log(`${c.bold}Recommended Divisions:${c.reset} ${p.recommended_divisions.join(', ')}`);
  console.log(`${c.bold}Associated Agents:${c.reset} ${p.recommended_agents.join(', ')}`);
  console.log(`${c.bold}Recommended Workflows:${c.reset} ${p.recommended_workflows.join(', ')}`);
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question(`\nWould you like to run the target agent mock interview? (y/n): `, (ans) => {
    rl.close();
    if (ans.trim().toLowerCase() === 'y' && p.recommended_agents.length > 0) {
      const targetAgent = p.recommended_agents[p.recommended_agents.length - 1];
      runAgent(targetAgent);
    }
  });
}

function handleCompanies(companyId) {
  if (!fs.existsSync(companiesDir)) {
    console.error(`${c.red}Companies directory does not exist.${c.reset}`);
    return;
  }

  if (!companyId) {
    console.log(`${c.bold}=== Mapped Tier-1 Companies ===${c.reset}\n`);
    const files = fs.readdirSync(companiesDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const comp = loadJSON(path.join(companiesDir, file));
      console.log(`🏢 ${c.bold}${comp.name}${c.reset} (${comp.id})`);
    }
    console.log(`\nUse: ${c.yellow}career-agents company <company-id>${c.reset} to inspect prep track details.`);
    return;
  }

  const companyFile = path.join(companiesDir, `${companyId}.json`);
  if (!fs.existsSync(companyFile)) {
    console.error(`${c.red}Company track '${companyId}' not found.${c.reset}`);
    return;
  }

  const comp = loadJSON(companyFile);
  console.log(`\n${c.purple}🏢 Company Prep: ${comp.name} Track (${comp.id})${c.reset}`);
  console.log(`\n${c.bold}Interview Process:${c.reset}`);
  comp.interview_process.forEach((step, idx) => console.log(`  ${idx + 1}. ${step}`));
  console.log(`\n${c.bold}Key Competencies / Skills:${c.reset} ${comp.skills.join(', ')}`);
  console.log(`${c.bold}Preparation Workflow:${c.reset} ${comp.preparation_workflow}`);
  console.log(`${c.bold}Associated Prep Agents:${c.reset} ${comp.agents.join(', ')}`);
  console.log(`\n${c.bold}Study Resources:${c.reset}`);
  comp.resources.forEach(r => console.log(`  • ${r}`));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question(`\nWould you like to execute the ${comp.name} coaching agent? (y/n): `, (ans) => {
    rl.close();
    if (ans.trim().toLowerCase() === 'y' && comp.agents.length > 0) {
      runAgent(comp.agents[0]);
    }
  });
}

function handleLauncher(agentId, platform) {
  const registry = loadJSON(registryPath);
  const agent = registry.agents.find(a => a.id === agentId);
  
  if (!agent) {
    // Check if the argument is a bundle ID
    const bundlePath = path.join(bundlesDir, `${agentId}.json`);
    if (fs.existsSync(bundlePath)) {
      launchBundlePrompt(agentId, platform);
      return;
    }
    console.error(`${c.red}Agent or Bundle '${agentId}' not found.${c.reset}`);
    return;
  }

  let selectedPlatform = platform;
  if (!selectedPlatform && fs.existsSync(launcherConfigPath)) {
    const config = loadJSON(launcherConfigPath);
    selectedPlatform = config.default_platform;
  }
  selectedPlatform = (selectedPlatform || 'claude').toLowerCase();

  const launcherReg = loadJSON(launcherRegistryPath);
  const platDetails = launcherReg.platforms[selectedPlatform];
  if (!platDetails) {
    console.error(`${c.red}Unsupported launcher platform '${selectedPlatform}'.${c.reset}`);
    return;
  }

  const agentFilePath = path.join(root, agent.filename);
  if (fs.existsSync(agentFilePath)) {
    const promptContent = fs.readFileSync(agentFilePath, 'utf8');
    const clipCmd = process.platform === 'win32' ? 'clip' : 'pbcopy';
    spawnSync(clipCmd, { input: promptContent, encoding: 'utf8' });
    console.log(`${c.green}Copying system prompt of '${agent.name}' to clipboard...${c.reset}`);
  }

  console.log(`${c.green}Launching ${platDetails.name} portal => ${platDetails.url}${c.reset}`);
  const startCmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  exec(`${startCmd} ${platDetails.url}`);
}

function launchBundlePrompt(bundleId, platform) {
  const bundlePath = path.join(bundlesDir, `${bundleId}.json`);
  const b = loadJSON(bundlePath);
  const registry = loadJSON(registryPath);

  console.log(`\n${c.purple}Compiling prompts for Bundle: ${b.name}...${c.reset}`);
  
  let consolidatedPrompt = `## CONSOLIDATED PROMPT PACK FOR BUNDLE: ${b.name}\n\n`;
  consolidatedPrompt += `Target Path Roles: ${b.career_paths.join(', ')}\n`;
  consolidatedPrompt += `Target Skills: ${b.skills.join(', ')}\n\n`;
  
  for (const aid of b.agents) {
    const agent = registry.agents.find(a => a.id === aid);
    if (agent) {
      const agentFilePath = path.join(root, agent.filename);
      if (fs.existsSync(agentFilePath)) {
        consolidatedPrompt += `### Agent Rule: ${agent.name} (Vibe: ${agent.vibe})\n`;
        consolidatedPrompt += fs.readFileSync(agentFilePath, 'utf8');
        consolidatedPrompt += `\n\n${'='.repeat(40)}\n\n`;
      }
    }
  }

  const clipCmd = process.platform === 'win32' ? 'clip' : 'pbcopy';
  spawnSync(clipCmd, { input: consolidatedPrompt, encoding: 'utf8' });
  console.log(`${c.green}Copied bundled prompt package of ${b.agents.length} agents to clipboard!${c.reset}`);

  let selectedPlatform = platform || 'claude';
  const launcherReg = loadJSON(launcherRegistryPath);
  const platDetails = launcherReg.platforms[selectedPlatform.toLowerCase()] || launcherReg.platforms.claude;
  
  console.log(`${c.green}Opening target platform portal => ${platDetails.url}${c.reset}`);
  const startCmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  exec(`${startCmd} ${platDetails.url}`);
}

function handleRecommendation() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(`\n${c.bold}=== Career OS Interactive Profile Recommendations ===${c.reset}`);
  rl.question('List 3 of your primary skills (comma-separated): ', (skills) => {
    rl.question('Select experience level (entry, mid, senior, executive): ', (exp) => {
      rl.question('Input target company (e.g. google, stripe) [optional]: ', (co) => {
        rl.question('Input target career role (e.g. software-engineer, ai-engineer): ', (role) => {
          rl.close();
          recommendProfile(skills, exp, co, role);
        });
      });
    });
  });
}

function handleInteractiveScoring() {
  printBanner();
  console.log(`${c.bold}=== Career Operating System Interactive Scoring Questionnaire ===${c.reset}`);
  console.log(`${c.gray}Answer the following questions to calculate your Career OS metrics (Score: 1-3).${c.reset}\n`);

  const questions = [
    {
      q: "1. CAREER ROADMAP: Do you have a milestone-based, sequenced career roadmap for the next 3-5 years?",
      opts: ["1 - No clear roadmap", "2 - Partially mapped milestones", "3 - Fully mapped milestone-based roadmap"],
      weight: 20
    },
    {
      q: "2. RESUME STRUCTURE: Is your resume single-column, parse-checked, and formatted with outcome-first metrics (STAR/XYZ)?",
      opts: ["1 - Generic formatting with no impact metrics", "2 - Good formatting but lacking clear quantitative metrics", "3 - High-impact, outcome-first metric structures"],
      weight: 20
    },
    {
      q: "3. INTERVIEW PREP: Have you drafted 5+ STAR behavioral stories and mapped core system design patterns?",
      opts: ["1 - No mock practice or STAR stories drafted", "2 - Practiced basic coding but behavioral/design is weak", "3 - Fully drafted STAR narratives and design systems patterns"],
      weight: 20
    },
    {
      q: "4. NETWORKING OUTBOUND: Do you send referral outreach messages to hiring managers or connect with alumni weekly?",
      opts: ["1 - No outreach or networking setup", "2 - Occasional LinkedIn connections but no referrals tracking", "3 - Weekly referral pipelines and manager tracking"],
      weight: 20
    },
    {
      q: "5. PROOF-OF-WORK PORTFOLIO: Do you maintain public GitHub projects/write-ups with clean, descriptive README files?",
      opts: ["1 - No active repositories or project write-ups", "2 - Have repositories but READMEs are generic or empty", "3 - Production-grade repos with clean architecture READMEs"],
      weight: 20
    }
  ];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answers = [];
  const askQuestion = (idx) => {
    if (idx >= questions.length) {
      rl.close();
      calculateScores(answers, questions);
      return;
    }
    
    const curr = questions[idx];
    console.log(`${c.bold}${curr.q}${c.reset}`);
    curr.opts.forEach(opt => console.log(`  ${opt}`));
    
    rl.question(`Select option (1, 2, or 3): `, (ans) => {
      const parsed = parseInt(ans.trim(), 10);
      if (parsed === 1 || parsed === 2 || parsed === 3) {
        answers.push(parsed);
        console.log('');
        askQuestion(idx + 1);
      } else {
        console.log(`${c.red}Invalid option. Please input 1, 2, or 3.${c.reset}\n`);
        askQuestion(idx);
      }
    });
  };

  askQuestion(0);
}

function calculateScores(answers, questions) {
  const getSubscore = (val) => {
    if (val === 1) return 20;
    if (val === 2) return 60;
    return 100;
  };

  const careerScore = getSubscore(answers[0]);
  const resumeScore = getSubscore(answers[1]);
  const interviewScore = getSubscore(answers[2]);
  const networkingScore = getSubscore(answers[3]);
  const portfolioScore = getSubscore(answers[4]);

  const combinedOSScore = Math.round((careerScore + resumeScore + interviewScore + networkingScore + portfolioScore) / 5);

  console.log(`\n==========================================`);
  console.log(`   CAREER OS COMPLIANCE REPORT CARD`);
  console.log(`==========================================`);
  console.log(`  • Career Strategy Score : ${getColorForScore(careerScore)}${careerScore}%${c.reset}`);
  console.log(`  • Resume Formatting     : ${getColorForScore(resumeScore)}${resumeScore}%${c.reset}`);
  console.log(`  • Interview Prep Level  : ${getColorForScore(interviewScore)}${interviewScore}%${c.reset}`);
  console.log(`  • Networking Outreach   : ${getColorForScore(networkingScore)}${networkingScore}%${c.reset}`);
  console.log(`  • Portfolio Proof-of-Work: ${getColorForScore(portfolioScore)}${portfolioScore}%${c.reset}`);
  console.log(`------------------------------------------`);
  console.log(`  ${c.bold}COMBINED CAREER OS SCORE  : ${getColorForScore(combinedOSScore)}${combinedOSScore}%${c.reset}`);
  console.log(`==========================================\n`);

  console.log(`${c.bold}Growth Strategy Recommendations:${c.reset}`);
  if (careerScore < 80) {
    console.log(`- Define clear long-term career roadmaps using: ${c.cyan}career-agents path software-engineer${c.reset}`);
  }
  if (resumeScore < 80) {
    console.log(`- Format and check ATS compliance by running: ${c.cyan}career-agents run ats-resume-reviewer${c.reset}`);
  }
  if (interviewScore < 80) {
    console.log(`- Schedule mock interview loop preparation via: ${c.cyan}career-agents company google${c.reset}`);
  }
  if (networkingScore < 80) {
    console.log(`- Review outreach strategy blueprints in: ${c.cyan}career-agents workflows${c.reset} -> Remote Job Hunt`);
  }
  console.log('');
}

function getColorForScore(score) {
  if (score >= 80) return c.green + c.bold;
  if (score >= 60) return c.yellow + c.bold;
  return c.red + c.bold;
}

function handlePackExport(type, id, format) {
  if (!type || !id || !format) {
    console.error(`${c.red}Usage: career-agents export <bundle|company|path> <id> <format>${c.reset}`);
    console.error(`E.g., career-agents export bundle faang-bundle json`);
    return;
  }

  const outputFormat = format.toLowerCase();
  let listAgentIds = [];
  let name = '';

  if (type === 'bundle') {
    const bundlePath = path.join(bundlesDir, `${id}.json`);
    if (!fs.existsSync(bundlePath)) {
      console.error(`${c.red}Bundle '${id}' not found.${c.reset}`);
      return;
    }
    const b = loadJSON(bundlePath);
    listAgentIds = b.agents;
    name = b.name;
  } else if (type === 'company') {
    const companyFile = path.join(companiesDir, `${id}.json`);
    if (!fs.existsSync(companyFile)) {
      console.error(`${c.red}Company track '${id}' not found.${c.reset}`);
      return;
    }
    const comp = loadJSON(companyFile);
    listAgentIds = comp.agents;
    name = comp.name + ' Prep Track';
  } else if (type === 'path') {
    const pathFile = path.join(pathsDir, `${id}.json`);
    if (!fs.existsSync(pathFile)) {
      console.error(`${c.red}Career path '${id}' not found.${c.reset}`);
      return;
    }
    const p = loadJSON(pathFile);
    listAgentIds = p.recommended_agents;
    name = p.name + ' Career Path';
  } else {
    console.error(`${c.red}Invalid export entity type '${type}'. Choose from: bundle, company, path.${c.reset}`);
    return;
  }

  const registry = loadJSON(registryPath);
  let compiledText = `## COMPILATION PACK: ${name.toUpperCase()}\n\n`;

  for (const aid of listAgentIds) {
    const agent = registry.agents.find(a => a.id === aid);
    if (agent) {
      const file = path.join(root, agent.filename);
      if (fs.existsSync(file)) {
        compiledText += `### AGENT SYSTEM PROMPT: ${agent.name} (${agent.id})\n`;
        compiledText += fs.readFileSync(file, 'utf8');
        compiledText += `\n\n${'='.repeat(40)}\n\n`;
      }
    }
  }

  let finalOutput = '';
  let ext = '';

  switch (outputFormat) {
    case 'markdown':
    case 'md':
      finalOutput = compiledText;
      ext = 'md';
      break;
    case 'json':
      finalOutput = JSON.stringify({
        pack_name: name,
        entity_type: type,
        entity_id: id,
        agents_count: listAgentIds.length,
        prompt_content: compiledText
      }, null, 2);
      ext = 'json';
      break;
    case 'yaml':
      finalOutput = `pack_name: "${name}"\nentity_type: "${type}"\nentity_id: "${id}"\nprompts: |\n${compiledText.split('\n').map(line => '  ' + line).join('\n')}`;
      ext = 'yaml';
      break;
    case 'txt':
      finalOutput = `PACK: ${name}\nTYPE: ${type}\nID: ${id}\n\n${compiledText}`;
      ext = 'txt';
      break;
    default:
      console.error(`${c.red}Unsupported export format '${format}'. Use markdown, json, yaml, or txt.${c.reset}`);
      return;
  }

  const outDir = path.join(root, 'exports', 'packs');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${type}_${id}.${ext}`);
  fs.writeFileSync(outFile, finalOutput, 'utf8');

  console.log(`\n${c.green}[Success] Consolidated pack exported successfully!${c.reset}`);
  console.log(`=> Path: ${c.bold}${outFile}${c.reset}`);
}

function handleGraph() {
  if (!fs.existsSync(knowledgeGraphPath)) {
    console.log(`${c.yellow}Knowledge graph not found. Building indexes...${c.reset}`);
    runUpdate();
  }

  const graph = loadJSON(knowledgeGraphPath);
  console.log(`${c.bold}=== Career OS Knowledge Graph Network ===${c.reset}\n`);
  console.log(`Total Graph Nodes: ${c.green}${graph.nodes.length}${c.reset}`);
  console.log(`Total Graph Connections (Edges): ${c.cyan}${graph.edges.length}${c.reset}\n`);

  // Count Node types
  const types = {};
  for (const n of graph.nodes) {
    types[n.type] = (types[n.type] || 0) + 1;
  }

  console.log(`${c.bold}Node Counts by Type:${c.reset}`);
  for (const [t, count] of Object.entries(types)) {
    console.log(`  • ${t.toUpperCase()}: ${count}`);
  }
}

function handleRoadmap() {
  console.log(`${c.bold}=== Career OS Release Roadmap ===${c.reset}\n`);
  const phases = [
    { v: 'v1.0', name: 'Career OS Core', desc: 'Centralized registry structures, schemas, and directories.', status: 'Completed' },
    { v: 'v1.5', name: 'Intelligence Layer', desc: 'Category-specific intelligence documents and path guides.', status: 'Completed' },
    { v: 'v2.0', name: 'Agent Launcher & Runtime', desc: 'Interactive local execution consoles and profile scoring.', status: 'Completed' },
    { v: 'v2.5', name: 'Career Marketplace', desc: 'Community submissions workflows and rating tools.', status: 'Planned' },
    { v: 'v3.0', name: 'Career Network', desc: 'Decentralized mock panels, mentoring and peer connections.', status: 'Planned' }
  ];

  for (const p of phases) {
    const color = p.status === 'Completed' ? c.green : c.gray;
    console.log(`[${color}${p.status}${c.reset}] ${c.bold}${p.v} - ${p.name}${c.reset}`);
    console.log(`   ${c.gray}${p.desc}${c.reset}\n`);
  }
}

function runDoctor() {
  console.log(`${c.bold}=== Career OS Diagnostic Check (Doctor) ===${c.reset}\n`);
  let errors = 0;

  const filesToCheck = [
    { name: 'career-os.json', file: path.join(root, 'career-os.json') },
    { name: 'agent-registry.json', file: registryPath },
    { name: 'workflow-registry.json', file: workflowsPath },
    { name: 'launcher/launcher-registry.json', file: launcherRegistryPath },
    { name: 'launcher/launcher-config.json', file: launcherConfigPath }
  ];

  console.log(`${c.bold}[1/3] Verifying Core Configuration Registries...${c.reset}`);
  for (const r of filesToCheck) {
    if (fs.existsSync(r.file)) {
      try {
        JSON.parse(fs.readFileSync(r.file, 'utf8'));
        console.log(`  [${c.green}✓ OK${c.reset}] ${r.name} parsed.`);
      } catch (e) {
        console.log(`  [${c.red}x FAIL${c.reset}] ${r.name} parsing error.`);
        errors++;
      }
    } else {
      console.log(`  [${c.red}x MISSING${c.reset}] ${r.name} is missing.`);
      errors++;
    }
  }

  console.log(`\n${c.bold}[2/3] Verifying Directories integrity...${c.reset}`);
  const dirs = [bundlesDir, companiesDir, pathsDir, intelligenceDir];
  for (const d of dirs) {
    if (fs.existsSync(d)) {
      console.log(`  [${c.green}✓ OK${c.reset}] ${path.basename(d)}/ exists.`);
    } else {
      console.log(`  [${c.red}x MISSING${c.reset}] ${path.basename(d)}/ is missing.`);
      errors++;
    }
  }

  console.log(`\n${c.bold}[3/3] Checking environment runtime variables...${c.reset}`);
  const validateScript = path.join(root, 'scripts', 'validate.py');
  if (fs.existsSync(validateScript)) {
    const result = spawnSync('python', [validateScript]);
    if (result.status === 0) {
      console.log(`  [${c.green}✓ PASS${c.reset}] validate.py checks pass.`);
    } else {
      console.log(`  [${c.red}x FAIL${c.reset}] validate.py checks failing.`);
      errors++;
    }
  }

  console.log('\n==========================================');
  if (errors === 0) {
    console.log(`${c.green}Everything is green! Your Career Operating System is healthy.${c.reset}`);
  } else {
    console.log(`${c.red}Doctor found ${errors} diagnostics warnings. Please resolve.${c.reset}`);
    process.exit(1);
  }
}

function runUpdate() {
  console.log(`${c.purple}Running registry compiler...${c.reset}`);
  const genScript = path.join(root, 'scripts', 'generate-data.py');
  if (fs.existsSync(genScript)) {
    const res = spawnSync('python', [genScript], { stdio: 'inherit' });
    if (res.status === 0) {
      console.log(`${c.green}System indices and master configuration successfully updated.${c.reset}`);
    } else {
      console.error(`${c.red}Upstream update failed.${c.reset}`);
    }
  }
}

function listWorkflows() {
  const data = loadJSON(workflowsPath);
  console.log(`${c.bold}=== Structured Workflows ===${c.reset}\n`);
  for (const w of data.workflows) {
    console.log(`• ${c.cyan}${w.id}${c.reset} - ${w.name}`);
    console.log(`  Category: ${w.category}`);
  }
}

function runMCPServer() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  const registry = loadJSON(registryPath);
  const divisionsData = loadJSON(divisionsPath);

  rl.on('line', (line) => {
    try {
      const request = JSON.parse(line);
      const { method, id, params } = request;

      if (method === 'initialize') {
        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {}
            },
            serverInfo: {
              name: 'career-agents-mcp',
              version: '0.1.0'
            }
          }
        };
        console.log(JSON.stringify(response));
      } else if (method === 'initialized') {
        // Notification, no response
      } else if (method === 'tools/list') {
        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            tools: [
              {
                name: 'list_agents',
                description: 'List all available career divisions and AI agent counts',
                inputSchema: { type: 'object', properties: {} }
              },
              {
                name: 'get_agent',
                description: 'Retrieve the system prompt instructions for a specific agent',
                inputSchema: {
                  type: 'object',
                  properties: {
                    agentId: { type: 'string', description: 'The unique ID of the agent (e.g. ats-resume-reviewer)' }
                  },
                  required: ['agentId']
                }
              },
              {
                name: 'search_catalog',
                description: 'Search the catalog for matching agents, divisions, paths, or companies',
                inputSchema: {
                  type: 'object',
                  properties: {
                    query: { type: 'string', description: 'Search query' }
                  },
                  required: ['query']
                }
              }
            ]
          }
        };
        console.log(JSON.stringify(response));
      } else if (method === 'tools/call') {
        const { name: toolName, arguments: toolArgs } = params;
        let textResult = '';

        if (toolName === 'list_agents') {
          let listStr = 'Available Divisions:\n';
          for (const div of divisionsData.divisions) {
            listStr += `- Division: ${div.name} (${div.division}) - ${div.count} Agents\n`;
            for (const a of div.agents) {
              listStr += `  • ${a.id}: ${a.name}\n`;
            }
          }
          textResult = listStr;
        } else if (toolName === 'get_agent') {
          const agentId = toolArgs.agentId;
          const agent = registry.agents.find(a => a.id === agentId);
          if (!agent) {
            textResult = `Error: Agent '${agentId}' not found.`;
          } else {
            const file = path.join(root, agent.filename);
            if (fs.existsSync(file)) {
              textResult = `Agent: ${agent.name}\nVibe: ${agent.vibe}\n\nSystem Prompt:\n${fs.readFileSync(file, 'utf8')}`;
            } else {
              textResult = `Error: Agent file not found.`;
            }
          }
        } else if (toolName === 'search_catalog') {
          const query = toolArgs.query.toLowerCase();
          let results = [];
          for (const a of registry.agents) {
            if (a.id.includes(query) || a.name.toLowerCase().includes(query) || a.description.toLowerCase().includes(query)) {
              results.push(`Agent: ${a.name} (ID: ${a.id}) - ${a.description}`);
            }
          }
          textResult = results.length > 0 ? results.join('\n') : 'No matching agents found.';
        } else {
          textResult = `Error: Unknown tool '${toolName}'.`;
        }

        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: textResult
              }
            ]
          }
        };
        console.log(JSON.stringify(response));
      } else {
        const response = {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32601,
            message: 'Method not found'
          }
        };
        console.log(JSON.stringify(response));
      }
    } catch (e) {
      // Ignore parsing errors
    }
  });
}

function handleUse(agentId, tool, dryRun) {
  if (!agentId || !tool) {
    console.error(`${c.red}Usage: career-agents use <agent-id> <tool> [--dry-run]${c.reset}`);
    console.error(`E.g., career-agents use ats-resume-reviewer cursor`);
    return;
  }

  const supportedTools = ['claude-code', 'cursor', 'copilot', 'gemini-cli', 'aider', 'windsurf', 'codex', 'opencode', 'qwen'];
  const normalizedTool = tool.toLowerCase();

  if (!supportedTools.includes(normalizedTool)) {
    console.error(`${c.red}Unsupported tool '${tool}'. Choose from: ${supportedTools.join(', ')}${c.reset}`);
    return;
  }

  const registry = loadJSON(registryPath);
  const agent = registry.agents.find(a => a.id === agentId);
  if (!agent) {
    console.error(`${c.red}Agent '${agentId}' not found in registry.${c.reset}`);
    return;
  }

  const agentFilePath = path.join(root, agent.filename);
  if (!fs.existsSync(agentFilePath)) {
    console.error(`${c.red}Agent file not found: ${agent.filename}${c.reset}`);
    return;
  }

  const systemPrompt = fs.readFileSync(agentFilePath, 'utf8');

  // Map tool-specific JSON layout keys
  let toolType = `${normalizedTool}-instructions`;
  if (normalizedTool === 'claude-code') toolType = 'claude-code-manifest';
  else if (normalizedTool === 'cursor') toolType = 'cursor-rules';
  else if (normalizedTool === 'codex') toolType = 'codex-agent';
  else if (normalizedTool === 'gemini-cli') toolType = 'gemini-cli-manifest';
  else if (normalizedTool === 'windsurf') toolType = 'windsurf-rules';

  const manifest = {
    type: toolType,
    source: path.basename(agent.filename),
    content: systemPrompt
  };

  const outputJSON = JSON.stringify(manifest, null, 2);

  if (dryRun) {
    console.log(`\n${c.yellow}=== DRY RUN: Prompt Bundle Manifest for ${normalizedTool} ===${c.reset}`);
    console.log(outputJSON);
    console.log(`==========================================\n`);
  } else {
    const outDir = path.join(root, 'exports', 'use');
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, `${agent.id}.${normalizedTool}.json`);
    fs.writeFileSync(outFile, outputJSON, 'utf8');
    console.log(`\n${c.green}[Success] Prompt bundle successfully exported to configuration!${c.reset}`);
    console.log(`=> Output path: ${c.bold}${outFile}${c.reset}`);
  }
}

function printHelp() {
  printBanner();
  console.log(`Usage: career-agents <command> [args]

Commands:
  list                           List all division counts and summaries
  search <query>                 Filter agents, workflows, companies, and paths
  run <agent-id> [--export <f>]  Run local execution loop or export to format
  workflows                      List structured career workflows
  bundles                        List available career bundles
  bundle run <bundle-id>         Launch interactive bundle executor dashboard
  path [path-id]                 View career path roadmap dashboard
  company [company-id]           Inspect target company preparation tracks
  launcher <agent/bundle> [plat] Copy prompts and launch AI browser interface
  export <type> <id> <format>    Consolidate and export bundle/company/path prompt packs
  use <agent-id> <tool>          Export prompt configuration bundle for target IDE/tool
  recommend                      Interactive profile target recommendations
  score / assess                 Interactive questionnaire compliance score
  graph                          Display knowledge graph network dimensions
  roadmap                        Check project version release roadmap
  diagnose / doctor              Execute health diagnostic verification checks
  update                         Regenerate all statistics and indexing databases
  mcp                            Start the Model Context Protocol (MCP) stdio server
`);
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
    printHelp();
    return;
  }

  switch (cmd) {
    case 'mcp':
      runMCPServer();
      break;
    case 'list':
      listAll();
      break;
    case 'search':
      searchCatalog(args[1]);
      break;
    case 'run':
      const agentId = args[1];
      const exportIdx = args.indexOf('--export');
      const exportFormat = exportIdx !== -1 ? args[exportIdx + 1] : null;
      runAgent(agentId, exportFormat);
      break;
    case 'workflows':
      listWorkflows();
      break;
    case 'bundles':
      handleBundles(args[1]);
      break;
    case 'bundle':
      if (args[1] === 'run') {
        runBundleExecution(args[2]);
      } else {
        handleBundles(args[1]);
      }
      break;
    case 'path':
      handlePaths(args[1]);
      break;
    case 'company':
      handleCompanies(args[1]);
      break;
    case 'launcher':
      handleLauncher(args[1], args[2]);
      break;
    case 'export':
      handlePackExport(args[1], args[2], args[3]);
      break;
    case 'use':
      const useAgentId = args[1];
      const useTool = args[2];
      const dryRun = args.indexOf('--dry-run') !== -1 || args.indexOf('-d') !== -1;
      handleUse(useAgentId, useTool, dryRun);
      break;
    case 'recommend':
      handleRecommendation();
      break;
    case 'score':
    case 'assess':
      handleInteractiveScoring();
      break;
    case 'graph':
      handleGraph();
      break;
    case 'roadmap':
      handleRoadmap();
      break;
    case 'doctor':
    case 'diagnose':
    case 'validate':
      runDoctor();
      break;
    case 'update':
      runUpdate();
      break;
    default:
      printHelp();
      process.exit(1);
  }
}

main();
