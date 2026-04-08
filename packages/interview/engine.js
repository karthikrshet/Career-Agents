import readline from 'readline';

const MOCK_QUESTIONS = {
  google: {
    behavioral: [
      'Tell me about a time you solved a complex technical conflict with a coworker. What was your process?',
      'Give an example of a project where you took leadership outside your core task boundaries.'
    ],
    technical: [
      'Explain the runtime and memory complexity of building a heap vs a balanced BST.',
      'How does the V8 engine manage garbage collection, and how do you avoid latency spikes?'
    ]
  },
  stripe: {
    behavioral: [
      'Describe a time you built an API that had significant usability challenges. How did you iterate?'
    ],
    technical: [
      'How do you design idempotent API endpoints to prevent double-billing on retries?'
    ]
  }
};

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

  const selectedCo = company.toLowerCase();
  const selectedMode = mode.toLowerCase();

  const pool = MOCK_QUESTIONS[selectedCo]?.[selectedMode] || MOCK_QUESTIONS.google.behavioral;

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
    const wordCount = ans.answer.split(/\s+/).length;
    let score = Math.min(100, Math.max(30, 40 + (wordCount * 1.2)));
    const feedback = [];
    if (wordCount < 15) {
      feedback.push('Answer is too short. Use the STAR framework.');
    } else {
      feedback.push('Good vocabulary and explanation length.');
    }
    return { question: ans.question, score, feedback };
  });

  const avgScore = Math.round(evaluations.reduce((sum, ev) => sum + ev.score, 0) / evaluations.length);
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
