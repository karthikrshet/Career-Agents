import { loadProfile } from './profile-manager.js';

export function displayDashboard() {
  const profile = loadProfile();
  
  const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    gray: '\x1b[90m'
  };

  console.log(`\n${c.bold}=== CAREER-OS CONSOLE DASHBOARD ===${c.reset}`);
  console.log(`Profile: ${c.gray}${profile.name}${c.reset}`);
  
  const overallColor = profile.overall_career_score >= 80 ? c.green : profile.overall_career_score >= 60 ? c.yellow : c.red;
  console.log(`Overall Readiness Index: ${overallColor}${profile.overall_career_score}%${c.reset}\n`);

  console.log(`${c.bold}System Component Audits:${c.reset}`);
  const showScore = (name, val) => {
    const barLen = Math.round(val / 10);
    const progress = '█'.repeat(barLen) + '░'.repeat(10 - barLen);
    const scoreColor = val >= 80 ? c.green : val >= 60 ? c.yellow : c.red;
    console.log(`  • ${name.padEnd(16)}: [${scoreColor}${progress}${c.reset}] ${scoreColor}${val}%${c.reset}`);
  };

  showScore('Resume Score', profile.resume_score || 0);
  showScore('GitHub Grade', profile.github_score || 0);
  showScore('LinkedIn Score', profile.linkedin_score || 0);
  showScore('Interview Ready', profile.interview_score || 0);

  console.log(`\n${c.bold}Weekly Goals Checklist:${c.reset}`);
  if (!profile.goals || profile.goals.length === 0) {
    console.log(`  ${c.gray}No pending goals registered.${c.reset}`);
  } else {
    profile.goals.forEach(goal => {
      const checkbox = goal.done ? `${c.green}[x]${c.reset}` : `[ ]`;
      console.log(`  ${checkbox} ${goal.task}`);
    });
  }
  console.log('');
}
