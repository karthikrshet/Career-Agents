import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

export function generateCompanyRoadmap(companyName) {
  const roadmap = {
    company: companyName.charAt(0).toUpperCase() + companyName.slice(1),
    plan30: [
      'Revise advanced algorithms, trees, heaps, and graph traversals.',
      'Audit existing resume section structures against ATS indices.'
    ],
    plan60: [
      'Practice designing distributed databases, cache patterns, and API interfaces.',
      'Deploy two complex mock applications using standard packages.'
    ],
    plan90: [
      'Run weekly interactive mock behavioral interview loop sessions.',
      'Connect with technical team leads at target firms.'
    ]
  };

  const outDir = path.join(root, 'exports', 'reports');
  fs.mkdirSync(outDir, { recursive: true });

  const filePath = path.join(outDir, `${companyName.toLowerCase()}-roadmap.json`);
  fs.writeFileSync(filePath, JSON.stringify(roadmap, null, 2), 'utf8');

  return { report: roadmap, filePath };
}

export function runRoadmapCLI(company) {
  const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    gray: '\x1b[90m'
  };

  if (!company) {
    console.error(`${c.red}Please specify a company name (e.g. google, stripe).${c.reset}`);
    return;
  }

  try {
    console.log(`${c.cyan}Compiling 30-60-90 Day career target checklist for ${c.bold}${company}${c.reset}...`);
    const { report, filePath } = generateCompanyRoadmap(company);

    console.log(`\n${c.bold}=== ${report.company.toUpperCase()} CAREER PREPARATION ROADMAP ===${c.reset}`);
    console.log(`  Output Map: ${c.gray}${filePath}${c.reset}\n`);

    console.log(`${c.bold}[First 30 Days] Technical Foundation:${c.reset}`);
    report.plan30.forEach(s => console.log(`  • ${s}`));

    console.log(`\n${c.bold}[Day 31-60] System Architecture:${c.reset}`);
    report.plan60.forEach(s => console.log(`  • ${s}`));

    console.log(`\n${c.bold}[Day 61-90] Interview Readiness:${c.reset}`);
    report.plan90.forEach(s => console.log(`  • ${s}`));
    console.log('');

  } catch (err) {
    console.error(`${c.red}Error executing roadmap: ${err.message}${c.reset}`);
  }
}
