import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const careerOsPath = path.join(root, 'career-os.json');

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

export function recommendProfile(skillsStr, experience, targetCompany, targetRole) {
  if (!fs.existsSync(careerOsPath)) {
    console.error(`${c.red}career-os.json not found. Please run 'career-agents update' first.${c.reset}`);
    return;
  }

  const osData = JSON.parse(fs.readFileSync(careerOsPath, 'utf8'));
  const inputSkills = (skillsStr || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const companyQuery = (targetCompany || '').trim().toLowerCase();
  const roleQuery = (targetRole || '').trim().toLowerCase();
  const expQuery = (experience || 'mid').trim().toLowerCase();

  console.log(`\n${c.purple}=== Career OS Recommendation Report ===${c.reset}`);
  console.log(`${c.gray}Inputs -> Skills: [${inputSkills.join(', ')}], Experience: ${expQuery}, Target Co: ${companyQuery}, Target Role: ${roleQuery}${c.reset}\n`);

  // 1. Recommend Agents
  const matchedAgents = [];
  for (const agent of osData.agents) {
    let score = 0;
    
    // Skill overlap
    const agentSkills = (agent.skills || []).map(s => s.toLowerCase());
    const skillOverlap = inputSkills.filter(s => agentSkills.includes(s));
    score += skillOverlap.length * 5;

    // Experience match
    if (agent.experience_level && agent.experience_level.toLowerCase() === expQuery) {
      score += 3;
    }

    // Company match
    if (companyQuery && (agent.companies || []).map(co => co.toLowerCase()).includes(companyQuery)) {
      score += 10;
    }

    // Role match
    if (roleQuery && (agent.id.includes(roleQuery) || agent.name.toLowerCase().includes(roleQuery))) {
      score += 8;
    }

    if (score > 0 || matchedAgents.length < 3) {
      matchedAgents.push({ agent, score });
    }
  }

  matchedAgents.sort((a, b) => b.score - a.score);
  const topAgents = matchedAgents.slice(0, 3);

  // 2. Recommend Workflows
  const matchedWorkflows = [];
  for (const wf of osData.workflows) {
    let score = 0;
    const desc = wf.description.toLowerCase();
    
    if (roleQuery && desc.includes(roleQuery)) score += 5;
    if (companyQuery && desc.includes(companyQuery)) score += 8;
    
    // Check if recommended agents are in this workflow
    const wfAgents = wf.recommended_agents;
    const topAgentIds = topAgents.map(ta => ta.agent.id);
    const agentOverlap = topAgentIds.filter(id => wfAgents.includes(id));
    score += agentOverlap.length * 3;

    matchedWorkflows.push({ wf, score });
  }
  matchedWorkflows.sort((a, b) => b.score - a.score);
  const topWorkflows = matchedWorkflows.slice(0, 2);

  // 3. Recommend Bundles
  const matchedBundles = [];
  for (const b of osData.bundles) {
    let score = 0;
    const bundleSkills = (b.skills || []).map(s => s.toLowerCase());
    const skillOverlap = inputSkills.filter(s => bundleSkills.includes(s));
    score += skillOverlap.length * 3;

    if (companyQuery && (b.companies || []).map(co => co.toLowerCase()).includes(companyQuery)) {
      score += 10;
    }
    if (roleQuery && (b.career_paths || []).map(p => p.toLowerCase()).includes(roleQuery)) {
      score += 8;
    }

    matchedBundles.push({ b, score });
  }
  matchedBundles.sort((a, b) => b.score - a.score);
  const topBundles = matchedBundles.slice(0, 2);

  // 4. Recommend Companies
  const matchedCompanies = [];
  for (const co of osData.companies) {
    let score = 0;
    if (companyQuery && co.id === companyQuery) {
      score += 20;
    }
    const coSkills = (co.skills || []).map(s => s.toLowerCase());
    const skillOverlap = inputSkills.filter(s => coSkills.includes(s));
    score += skillOverlap.length * 2;

    matchedCompanies.push({ co, score });
  }
  matchedCompanies.sort((a, b) => b.score - a.score);
  const topCompanies = matchedCompanies.slice(0, 2);

  // Print results
  console.log(`${c.bold}🤖 Recommended Agents:${c.reset}`);
  topAgents.forEach(ta => {
    console.log(`  • ${c.green}${ta.agent.id}${c.reset} - ${ta.agent.name}`);
    console.log(`    ${c.gray}${ta.agent.description}${c.reset}`);
  });

  console.log(`\n${c.bold}🔄 Recommended Workflows:${c.reset}`);
  topWorkflows.forEach(tw => {
    console.log(`  • ${c.cyan}${tw.wf.id}${c.reset} - ${tw.wf.name}`);
    console.log(`    ${c.gray}${tw.wf.description}${c.reset}`);
  });

  console.log(`\n${c.bold}🎁 Recommended Career Bundles:${c.reset}`);
  topBundles.forEach(tb => {
    console.log(`  • ${c.purple}${tb.b.id}${c.reset} - ${tb.b.name}`);
    console.log(`    ${c.gray}${tb.b.description}${c.reset}`);
  });

  console.log(`\n${c.bold}🏢 Recommended Prep Companies:${c.reset}`);
  topCompanies.forEach(tc => {
    console.log(`  • ${c.bold}${tc.co.name}${c.reset} (${tc.co.id})`);
  });
  console.log('');
}
