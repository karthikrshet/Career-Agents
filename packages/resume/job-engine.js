import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseResumeFile } from './file-parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

const JOBS_DATABASE = [
  {
    id: 'stripe-backend',
    role: 'Backend Engineer',
    company: 'Stripe',
    skills: ['typescript', 'node.js', 'apis', 'ruby', 'pci compliance', 'postgresql', 'testing'],
    salary: '$135K - $185K',
    agents: ['backend-architect', 'database-engineer', 'api-coaching-agent']
  },
  {
    id: 'google-ai-engineer',
    role: 'AI Engineer',
    company: 'Google',
    skills: ['python', 'algorithms', 'distributed systems', 'pytorch', 'llm', 'system design', 'c++'],
    salary: '$165K - $225K',
    agents: ['ai-engineering-specialist', 'deep-learning-coaching-agent', 'algorithms-mentor']
  }
];

export async function matchJobsForResume(resumePath) {
  const resume = await parseResumeFile(resumePath);
  const skills = (resume.skills || []).map(s => s.toLowerCase());
  const textRepresentation = JSON.stringify(resume).toLowerCase();
  
  const matches = [];

  JOBS_DATABASE.forEach(job => {
    const matchedSkills = [];
    const missingSkills = [];
    
    job.skills.forEach(skill => {
      if (skills.includes(skill) || textRepresentation.includes(skill)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const matchRatio = matchedSkills.length / job.skills.length;
    const readinessScore = Math.round(matchRatio * 100);

    matches.push({
      role: job.role,
      company: job.company,
      readinessScore,
      salaryRange: job.salary,
      matchedSkills,
      missingSkills,
      recommendedAgents: job.agents
    });
  });

  matches.sort((a, b) => b.readinessScore - a.readinessScore);

  return {
    bestMatch: matches[0] || null,
    allJobs: matches
  };
}

export async function runJobMatchCLI(filePath) {
  const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    gray: '\x1b[90m'
  };

  if (!filePath) {
    console.error(`${c.red}Please provide a target resume file to perform Job Matching.${c.reset}`);
    return;
  }

  try {
    console.log(`${c.cyan}Analyzing resume skills alignment against active job profiles...${c.reset}`);
    const results = await matchJobsForResume(filePath);
    
    console.log(`\n${c.bold}=== CAREER-OS JOB FIT MATCH REPORT ===${c.reset}`);
    console.log(`File: ${c.gray}${filePath}${c.reset}\n`);

    if (results.allJobs.length === 0) {
      console.log(`${c.gray}No matching jobs found in standard database catalog.${c.reset}`);
      return;
    }

    console.log(`${c.bold}Top Matching Positions:${c.reset}`);
    results.allJobs.slice(0, 3).forEach((match, idx) => {
      const color = match.readinessScore >= 80 ? c.green : match.readinessScore >= 60 ? c.yellow : c.red;
      console.log(`\n  ${idx + 1}. [${color}${match.readinessScore}% Match${c.reset}] ${c.bold}${match.role}${c.reset} at ${c.cyan}${match.company}${c.reset}`);
      console.log(`     • Salary Range       : ${c.green}${match.salaryRange}${c.reset}`);
      console.log(`     • Matched Core Stack : ${match.matchedSkills.join(', ') || 'None'}`);
      console.log(`     • Technical Skill Gap: ${c.red}${match.missingSkills.join(', ') || 'None'}${c.reset}`);
      console.log(`     • Recommended Coaches: ${c.yellow}${match.recommendedAgents.join(', ')}${c.reset}`);
    });
    console.log('');

  } catch (err) {
    console.error(`${c.red}Error executing Job Match: ${err.message}${c.reset}`);
  }
}
