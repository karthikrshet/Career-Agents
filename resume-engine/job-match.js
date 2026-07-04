import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const COMMON_TECH_TERMS = [
  'python', 'javascript', 'typescript', 'react', 'next.js', 'node.js', 'express',
  'mongodb', 'postgresql', 'redis', 'kafka', 'docker', 'kubernetes', 'aws',
  'gcp', 'azure', 'terraform', 'jenkins', 'git', 'sql', 'nosql', 'graphql',
  'api', 'microservices', 'selenium', 'jest', 'airflow', 'spark', 'pytorch',
  'langchain', 'openai', 'figma', 'product roadmap', 'agile', 'scrum'
];

export function analyzeJobMatch(resumeData, jdText) {
  if (!resumeData || !jdText) return null;

  const normalizedJd = jdText.toLowerCase();
  
  // Extract keywords from JD
  const jdKeywords = [];
  COMMON_TECH_TERMS.forEach(term => {
    // Exact word boundary matching for keywords
    const regex = new RegExp(`\\b${term.replace('.', '\\.')}\\b`, 'i');
    if (regex.test(normalizedJd)) {
      jdKeywords.push(term);
    }
  });

  // Fallback if no tech terms detected (use a general comparison)
  if (jdKeywords.length === 0) {
    // Extract 3-5 letter words as general comparison terms
    const words = normalizedJd.split(/[^a-zA-Z]+/);
    const candidateWords = [...new Set(words.filter(w => w.length > 3 && w.length < 15))];
    jdKeywords.push(...candidateWords.slice(0, 10));
  }

  // Check overlap with Resume skills & experience
  const resumeSkills = (resumeData.skills || []).map(s => s.toLowerCase());
  const resumeText = JSON.stringify(resumeData).toLowerCase();

  const matchedKeywords = [];
  const missingKeywords = [];

  jdKeywords.forEach(keyword => {
    // Check if keyword is explicitly in skills, or mentioned in resume text
    if (resumeSkills.includes(keyword) || resumeText.includes(keyword)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const matchPercentage = jdKeywords.length > 0 
    ? Math.round((matchedKeywords.length / jdKeywords.length) * 100)
    : 50;

  // Compile strengths & weaknesses
  const strengths = matchedKeywords.slice(0, 5);
  const weaknesses = missingKeywords.slice(0, 5);
  const suggestions = [];

  if (missingKeywords.length > 0) {
    suggestions.push(`Integrate missing keywords into your skills profile: ${missingKeywords.slice(0, 3).join(', ')}.`);
    suggestions.push(`Provide project evidence demonstrating usage of ${missingKeywords[0]} in your work experience bullets.`);
  } else {
    suggestions.push('Excellent keyword alignment! Focus on quantitative metric descriptions for these skills next.');
  }

  // Map recommendations based on JD content
  const recommendedPaths = [];
  const recommendedWorkflows = [];
  const recommendedAgents = [];

  // General heuristic mapping
  if (normalizedJd.includes('react') || normalizedJd.includes('frontend') || normalizedJd.includes('ui')) {
    recommendedPaths.push('frontend-engineer');
    recommendedWorkflows.push('ats-optimization');
    recommendedAgents.push('nextjs-performance-engineer', 'portfolio-reviewer');
  }
  if (normalizedJd.includes('backend') || normalizedJd.includes('database') || normalizedJd.includes('api')) {
    recommendedPaths.push('backend-engineer');
    recommendedWorkflows.push('technical-interview-week');
    recommendedAgents.push('backend-architect', 'database-engineer');
  }
  if (normalizedJd.includes('ai') || normalizedJd.includes('llm') || normalizedJd.includes('learning')) {
    recommendedPaths.push('ai-engineer');
    recommendedWorkflows.push('technical-interview-week');
    recommendedAgents.push('llm-engineer', 'rag-architect');
  }
  if (normalizedJd.includes('product') || normalizedJd.includes('roadmap') || normalizedJd.includes('tpm')) {
    recommendedPaths.push('product-manager');
    recommendedWorkflows.push('salary-negotiation');
    recommendedAgents.push('product-manager', 'product-manager-coach');
  }

  // Fallbacks if empty
  if (recommendedPaths.length === 0) recommendedPaths.push('software-engineer');
  if (recommendedWorkflows.length === 0) recommendedWorkflows.push('ats-optimization', 'technical-interview-week');
  if (recommendedAgents.length === 0) recommendedAgents.push('ats-resume-reviewer', 'technical-interview-coach');

  return {
    matchPercentage,
    matchedKeywords,
    missingKeywords,
    strengths,
    weaknesses,
    suggestions,
    recommendations: {
      paths: recommendedPaths,
      workflows: recommendedWorkflows,
      agents: recommendedAgents
    }
  };
}

export function runJobMatchCLI(resumePath, jdPathOrText) {
  const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    gray: '\x1b[90m'
  };

  if (!resumePath || !jdPathOrText) {
    console.error(`${c.red}Usage: career-agents resume match <resume-json-file> <jd-file-or-text>${c.reset}`);
    return;
  }

  // Load Resume
  const resolvedResume = path.resolve(resumePath);
  if (!fs.existsSync(resolvedResume)) {
    console.error(`${c.red}Resume file not found: ${resumePath}${c.reset}`);
    return;
  }

  let resumeData;
  try {
    resumeData = JSON.parse(fs.readFileSync(resolvedResume, 'utf8'));
  } catch (e) {
    console.error(`${c.red}Failed to parse resume JSON: ${e.message}${c.reset}`);
    return;
  }

  // Load Job Description
  let jdText = jdPathOrText;
  const resolvedJd = path.resolve(jdPathOrText);
  if (fs.existsSync(resolvedJd)) {
    jdText = fs.readFileSync(resolvedJd, 'utf8');
  }

  const analysis = analyzeJobMatch(resumeData, jdText);
  if (!analysis) {
    console.error(`${c.red}Failed to complete job match analysis.${c.reset}`);
    return;
  }

  console.log(`\n${c.bold}=== JOB DESCRIPTION MATCH ANALYTICS ===${c.reset}\n`);
  
  const matchColor = analysis.matchPercentage >= 85 ? c.green : analysis.matchPercentage >= 65 ? c.yellow : c.red;
  console.log(`  ${c.bold}OVERALL MATCH RATIO: ${matchColor}${analysis.matchPercentage}%${c.reset}`);
  console.log(`  ----------------------------------`);
  console.log(`  • Key Strengths : ${c.green}${analysis.strengths.join(', ') || 'None'}${c.reset}`);
  console.log(`  • Key Gaps      : ${c.red}${analysis.weaknesses.join(', ') || 'None'}${c.reset}\n`);

  console.log(`${c.bold}Optimization Suggestions:${c.reset}`);
  analysis.suggestions.forEach(s => console.log(`  • ${s}`));

  console.log(`\n${c.bold}Recommended Career-Agents Accelerators:${c.reset}`);
  console.log(`  • Career Paths: ${c.cyan}${analysis.recommendations.paths.join(', ')}${c.reset}`);
  console.log(`  • Workflows   : ${c.cyan}${analysis.recommendations.workflows.join(', ')}${c.reset}`);
  console.log(`  • AI Agents   : ${c.cyan}${analysis.recommendations.agents.join(', ')}${c.reset}\n`);
}
