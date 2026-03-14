import fs from 'fs';
import path from 'path';

const ACTION_VERBS = [
  'designed', 'shipped', 'built', 'implemented', 'optimized', 'led', 'architected',
  'reduced', 'increased', 'developed', 'collaborated', 'scaled', 'managed',
  'refactored', 'integrated', 'delivered', 'automated', 'triage', 'migrated'
];

export function scoreResumeData(data) {
  if (!data) return null;

  const recommendations = [];
  let scoreFormatting = 0;
  let scoreKeywords = 0;
  let scoreExperience = 0;
  let scoreImpact = 0;

  // 1. Formatting & Section Completeness (Max 25)
  // Check if core sections exist
  const coreSections = ['header', 'summary', 'experience', 'skills', 'education'];
  coreSections.forEach(s => {
    if (data[s]) {
      scoreFormatting += 5;
    } else {
      recommendations.push(`Add a missing core section: "${s}"`);
    }
  });

  // Verify header properties
  if (data.header) {
    const contactKeys = ['phone', 'email', 'linkedin', 'github'];
    contactKeys.forEach(k => {
      if (!data.header[k]) {
        recommendations.push(`Include "${k}" in the header contact details`);
      }
    });
  }

  // 2. Keywords & Skills Density (Max 25)
  const skillsCount = data.skills ? data.skills.length : 0;
  if (skillsCount === 0) {
    recommendations.push('List your technical skills to improve ATS indexing score');
  } else if (skillsCount < 5) {
    scoreKeywords = skillsCount * 4;
    recommendations.push('Expand your skills profile; include more tools and languages relevant to your role');
  } else {
    scoreKeywords = Math.min(25, 12 + (skillsCount * 1.5));
  }

  // 3. Experience Detail & Depth (Max 25)
  if (!data.experience || data.experience.length === 0) {
    recommendations.push('Add work experience bullets detailing previous deliverables');
  } else {
    const jobsCount = data.experience.length;
    let totalBullets = 0;
    data.experience.forEach(job => {
      totalBullets += job.bullets ? job.bullets.length : 0;
    });

    const avgBullets = totalBullets / jobsCount;
    if (avgBullets < 3) {
      scoreExperience = Math.min(25, jobsCount * 6 + avgBullets * 3);
      recommendations.push('Write at least 3 detailed accomplishment bullets for each job role');
    } else {
      scoreExperience = Math.min(25, 15 + (avgBullets * 2.5));
    }
  }

  // 4. Impact Statements & Quantifiable Metrics (Max 25)
  let metricBulletsCount = 0;
  let actionVerbCount = 0;
  let totalBulletsChecked = 0;

  const checkText = (text) => {
    totalBulletsChecked++;
    // Check for metrics (digits, percentages, dollar signs)
    if (/\b\d+\b|%|\$/.test(text)) {
      metricBulletsCount++;
    }
    // Check for action verbs
    const words = text.toLowerCase().split(/\s+/);
    if (words.some(w => ACTION_VERBS.includes(w))) {
      actionVerbCount++;
    }
  };

  if (data.experience) {
    data.experience.forEach(job => {
      if (job.bullets) job.bullets.forEach(checkText);
    });
  }
  if (data.projects) {
    data.projects.forEach(proj => {
      if (proj.bullets) proj.bullets.forEach(checkText);
    });
  }

  if (totalBulletsChecked > 0) {
    const metricRatio = metricBulletsCount / totalBulletsChecked;
    const verbRatio = actionVerbCount / totalBulletsChecked;

    scoreImpact += Math.round(metricRatio * 15);
    scoreImpact += Math.round(verbRatio * 10);

    if (metricRatio < 0.4) {
      recommendations.push('Quantify your impact. Add metrics (%, $, numbers) to at least 40% of your experience bullets');
    }
    if (verbRatio < 0.6) {
      recommendations.push('Use strong, action-oriented verbs (e.g. designed, shipped, automated) at the start of your bullets');
    }
  } else {
    recommendations.push('Ensure achievements list strong action verbs and quantified metric outcomes');
  }

  const overallScore = scoreFormatting + scoreKeywords + scoreExperience + scoreImpact;

  return {
    overallScore,
    subscores: {
      formatting: scoreFormatting,
      keywords: scoreKeywords,
      experience: scoreExperience,
      impact: scoreImpact
    },
    recommendations: recommendations.length > 0 ? recommendations : ['Excellent! Your resume complies with high-performance ATS indexing rules.']
  };
}

export function runScorerCLI(filePath) {
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
    console.error(`${c.red}Please provide a target resume JSON file path to score.${c.reset}`);
    console.error(`E.g., career-agents resume score exports/resumes/jane-doe.json`);
    return;
  }

  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error(`${c.red}File not found: ${filePath}${c.reset}`);
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(resolved, 'utf8'));
    const report = scoreResumeData(data);

    if (!report) {
      console.error(`${c.red}Failed to compute scoring analytics for the file.${c.reset}`);
      return;
    }

    console.log(`\n${c.bold}=== ATS RESUME COMPLIANCE AUDIT ===${c.reset}`);
    console.log(`File: ${c.gray}${filePath}${c.reset}\n`);

    const scoreColor = report.overallScore >= 90 ? c.green : report.overallScore >= 75 ? c.yellow : c.red;
    console.log(`  ${c.bold}OVERALL ATS SCORE : ${scoreColor}${report.overallScore} / 100${c.reset}`);
    console.log(`  ----------------------------------`);
    console.log(`  • Layout & Formatting: ${report.subscores.formatting} / 25`);
    console.log(`  • Keywords Density   : ${report.subscores.keywords} / 25`);
    console.log(`  • Experience Detail  : ${report.subscores.experience} / 25`);
    console.log(`  • Metrics & Impact   : ${report.subscores.impact} / 25`);
    console.log(`  ----------------------------------\n`);

    console.log(`${c.bold}Actionable Optimization Recommendations:${c.reset}`);
    report.recommendations.forEach((rec, idx) => {
      console.log(`  ${idx + 1}. [${c.yellow}!${c.reset}] ${rec}`);
    });
    console.log('');

  } catch (err) {
    console.error(`${c.red}Error parsing or scoring file: ${err.message}${c.reset}`);
  }
}
