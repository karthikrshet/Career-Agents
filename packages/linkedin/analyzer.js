import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

export async function analyzeLinkedinProfile(filePath) {
  if (!filePath) {
    throw new Error('No LinkedIn profile text file provided.');
  }

  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const text = fs.readFileSync(resolved, 'utf8');
  const textLower = text.toLowerCase();
  
  const recommendations = [];
  const keywordSignals = ['designed', 'shipped', 'built', 'architected', 'scaled', 'apis', 'typescript', 'javascript', 'python', 'go', 'testing'];
  
  let scoreKeywords = 0;
  const foundKeywords = [];
  
  keywordSignals.forEach(kw => {
    if (textLower.includes(kw)) {
      foundKeywords.push(kw);
      scoreKeywords += 8;
    }
  });
  scoreKeywords = Math.min(40, scoreKeywords);

  let scoreTagline = 20;
  if (text.includes('|') || text.includes(' | ')) {
    scoreTagline += 20;
  } else {
    recommendations.push('Separate target roles in tagline using pipes (|) to enhance keyword structure.');
  }

  let scoreSummary = 10;
  const aboutBlock = textLower.match(/about|summary|profile/i);
  if (aboutBlock && text.length > 200) {
    scoreSummary += 10;
  } else {
    recommendations.push('Expand the "About" profile summary block to include main technology stacks.');
  }

  const totalScore = Math.min(100, scoreKeywords + scoreTagline + scoreSummary);

  const taglineRewrites = [
    'Senior Frontend Engineer | Next.js Specialist | React Architecture & UI Optimizations',
    'Full Stack Architect | TypeScript Node APIs & Go Services | AWS Certified Developer',
    'AI Engineering Lead | LLM Integrations & PyTorch Pipelines | Python Systems Architect'
  ];

  return {
    score: totalScore,
    matchedKeywords: foundKeywords,
    suggestions: recommendations.length > 0 ? recommendations : ['Profile text contains strong professional signals.'],
    headlineRewrites: taglineRewrites
  };
}

export async function runLinkedinCLI(filePath) {
  const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    gray: '\x1b[90m'
  };

  try {
    console.log(`${c.cyan}Analyzing LinkedIn profile sections from: ${c.bold}${filePath}${c.reset}...`);
    const report = await analyzeLinkedinProfile(filePath);

    console.log(`\n${c.bold}=== LINKEDIN PROFILE ALIGNMENT AUDIT ===${c.reset}`);
    console.log(`Score: ${c.green}${report.score} / 100${c.reset}\n`);

    console.log(`${c.bold}Headline & Profile Suggestions:${c.reset}`);
    report.suggestions.forEach(s => console.log(`  [${c.red}!${c.reset}] ${s}`));

    console.log(`\n${c.bold}Suggested Tagline Headline Rewrites (Copy-Paste Options):${c.reset}`);
    report.headlineRewrites.forEach((rewrite, idx) => {
      console.log(`  ${idx + 1}. "${c.green}${rewrite}${c.reset}"`);
    });

    console.log(`\n${c.bold}Keyword Signal Density:${c.reset}`);
    console.log(`  • Found core keywords: ${c.green}${report.matchedKeywords.join(', ') || 'None'}${c.reset}\n`);

    try {
      const { updateLocalProfileScore } = await import('../dashboard/profile-manager.js');
      updateLocalProfileScore('linkedin_score', report.score);
    } catch (e) {}

  } catch (err) {
    console.error(`${c.red}Error executing LinkedIn Auditor: ${err.message}${c.reset}`);
  }
}
