// packages/interview/engine.js
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

export function loadCompanyInterviewQuestions(company = 'google', mode = 'behavioral') {
  const companyDir = path.join(root, 'company-interviews');
  const normalized = company.toLowerCase().trim();
  const filePath = path.join(companyDir, `${normalized}-interview-coach.md`);

  const questions = [];

  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      let inRelevantSection = false;
      for (const line of lines) {
        if (line.startsWith('## ') || line.startsWith('### ')) {
          const lower = line.toLowerCase();
          if (mode === 'behavioral' && (lower.includes('behavioral') || lower.includes('googleyness') || lower.includes('leadership') || lower.includes('mission') || lower.includes('rules'))) {
            inRelevantSection = true;
          } else if (mode === 'technical' && (lower.includes('technical') || lower.includes('problem') || lower.includes('code') || lower.includes('system') || lower.includes('architecture'))) {
            inRelevantSection = true;
          } else {
            inRelevantSection = false;
          }
        }

        if (inRelevantSection && (line.startsWith('- **') || line.startsWith('1. **') || line.startsWith('2. **') || line.startsWith('3. **') || line.startsWith('4. **'))) {
          const clean = line.replace(/^[-0-9.* ]+/, '').trim();
          if (clean.length > 20) {
            questions.push(clean);
          }
        }
      }
    } catch (e) {
      console.error(`Failed to load dossier for ${company}:`, e.message);
    }
  }

  if (questions.length > 0) {
    return questions.slice(0, 4);
  }

  // Live dynamic fallback questions based on role and company
  if (mode === 'technical') {
    return [
      `Explain how you would architect a high-throughput, low-latency distributed caching layer for ${company}'s core services.`,
      `How do you evaluate time and space complexity trade-offs between a balanced BST and a hash map under heavy concurrent writes?`,
      `Describe your approach to detecting and resolving database connection pool exhaustion in a production microservice.`,
    ];
  }

  return [
    `Tell me about a complex technical decision at your previous role where you faced significant ambiguity. How did you navigate trade-offs?`,
    `Describe a project where you took leadership outside your core assignment to unblock team velocity. What were the measurable outcomes?`,
    `Share an example of a technical disagreement with a teammate or stakeholder. How did you arrive at consensus while maintaining high engineering standards?`,
  ];
}

export async function runMockInterview(company = 'google', mode = 'behavioral') {
  const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    gray: '\x1b[90m'
  };

  const pool = loadCompanyInterviewQuestions(company, mode);

  console.log(`\n${c.bold}=== CAREER-OS INTERACTIVE COACHING SESSION ===${c.reset}`);
  console.log(`Company  : ${c.bold}${company.toUpperCase()}${c.reset}`);
  console.log(`Mode     : ${c.cyan}${mode.toUpperCase()}${c.reset}`);
  console.log(`Questions: ${pool.length}\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answers = [];

  const askQuestion = (idx) => {
    return new Promise((resolve) => {
      console.log(`${c.bold}Q${idx + 1}:${c.reset} ${pool[idx]}`);
      rl.question(`\n${c.gray}Your Answer >${c.reset} `, (answer) => {
        answers.push({ question: pool[idx], answer });
        console.log('');
        resolve();
      });
    });
  };

  for (let i = 0; i < pool.length; i++) {
    await askQuestion(i);
  }

  rl.close();

  console.log(`${c.bold}=== SESSION RESULTS SCORECARD ===${c.reset}`);
  const evaluations = answers.map(ans => {
    const wordCount = ans.answer.split(/\s+/).filter(Boolean).length;
    const hasMetrics = /\b\d+(?:%|\s*percent|x|\s*billion|\s*million|\s*k)?\b/gi.test(ans.answer);
    const hasStarVerbs = /\b(architected|spearheaded|engineered|optimized|reduced|delivered|led|built)\b/gi.test(ans.answer);

    let score = 40;
    if (wordCount >= 30) score += 25;
    else if (wordCount >= 15) score += 15;

    if (hasMetrics) score += 20;
    if (hasStarVerbs) score += 15;

    score = Math.min(100, score);

    const feedback = [];
    if (wordCount < 20) {
      feedback.push('Answer is brief. Expand with Situation, Task, Action, Result context.');
    } else {
      feedback.push('Good explanation depth and communication clarity.');
    }
    if (!hasMetrics) {
      feedback.push('Add quantified metrics (%, $, latency numbers) to prove impact.');
    }

    return { question: ans.question, score, feedback };
  });

  const avgScore = Math.round(evaluations.reduce((sum, ev) => sum + ev.score, 0) / (evaluations.length || 1));
  const finalColor = avgScore >= 80 ? c.green : avgScore >= 60 ? c.yellow : c.red;

  console.log(`Overall Readiness: ${finalColor}${avgScore} / 100${c.reset}`);
  evaluations.forEach((ev, i) => {
    console.log(`  • Q${i+1} : Score: ${ev.score}% | Feedback: ${ev.feedback.join(' | ')}`);
  });
  console.log('');

  try {
    const { updateLocalProfileScore } = await import('../dashboard/profile-manager.js');
    updateLocalProfileScore('interview_score', avgScore);
  } catch (e) {}
}
