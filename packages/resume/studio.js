import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseResumeFile } from './file-parser.js';
import { scoreResumeData } from './scorer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

const ACTION_VERBS = [
  'designed', 'shipped', 'built', 'implemented', 'optimized', 'led', 'architected',
  'reduced', 'increased', 'developed', 'collaborated', 'scaled', 'managed',
  'refactored', 'integrated', 'delivered', 'automated', 'triage', 'migrated'
];

function auditFormatting(resumeData) {
  const flags = [];
  const contact = resumeData.header || {};
  
  if (!contact.email) flags.push('Missing email contact in header.');
  if (!contact.phone) flags.push('Missing phone contact in header.');
  if (!contact.linkedin) flags.push('LinkedIn URL is missing; recruiters rely heavily on active links.');
  if (!contact.github) flags.push('GitHub link is missing; essential for technical verification.');
  
  const textRepresentation = JSON.stringify(resumeData).toLowerCase();
  
  if (textRepresentation.includes('textbox') || textRepresentation.includes('text box')) {
    flags.push('Detected potential text boxes. ATS systems struggle to parse text inside floating containers.');
  }
  if (textRepresentation.includes('columns') || textRepresentation.includes('two-column')) {
    flags.push('Multi-column layout detected. Use a single-column layout to prevent sequence parse errors.');
  }
  if (textRepresentation.includes('icon') || textRepresentation.includes('profile image') || textRepresentation.includes('photo')) {
    flags.push('Graphics or icons detected. Heavy formatting blocks parser flows.');
  }

  const score = Math.max(40, 100 - (flags.length * 15));
  return { score, flags };
}

function auditKeywords(resumeData) {
  const skills = (resumeData.skills || []).map(s => s.toLowerCase());
  const text = JSON.stringify(resumeData).toLowerCase();
  
  const commonKeywords = ['git', 'docker', 'aws', 'kubernetes', 'ci/cd', 'agile', 'scrum', 'testing', 'apis', 'sql', 'typescript', 'javascript', 'python', 'go', 'system design'];
  const matched = [];
  const missing = [];
  
  commonKeywords.forEach(kw => {
    if (skills.includes(kw) || text.includes(kw)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  });
  
  const score = Math.round((matched.length / commonKeywords.length) * 100);
  return { score, matched, missing };
}

function auditBullets(bullets = []) {
  const weakBullets = [];
  const suggestions = [];
  let quantifiedCount = 0;
  let actionCount = 0;
  
  bullets.forEach(bullet => {
    const text = bullet.toLowerCase().trim();
    if (!text) return;
    
    const words = text.split(/\s+/);
    const hasMetric = /\b\d+\b|%|\$/.test(text);
    const startsWithAction = ACTION_VERBS.some(v => text.startsWith(v) || words[0] === v);
    
    if (hasMetric) quantifiedCount++;
    if (startsWithAction) actionCount++;
    
    let isWeak = false;
    const bulletTriggers = [];
    
    if (words.length < 6) {
      isWeak = true;
      bulletTriggers.push('Bullet is too brief or short');
    }
    if (!startsWithAction) {
      isWeak = true;
      bulletTriggers.push('Does not start with a strong action verb');
    }
    if (!hasMetric) {
      isWeak = true;
      bulletTriggers.push('Lacks achievement quantification (metrics, %, numbers)');
    }
    
    if (isWeak) {
      weakBullets.push({ original: bullet, reasons: bulletTriggers });
      let suggestedRewrite = bullet;
      if (!startsWithAction) suggestedRewrite = `Led/Optimized: ${suggestedRewrite}`;
      if (!hasMetric) suggestedRewrite = `${suggestedRewrite}, resulting in a 15% increase in team performance`;
      
      suggestions.push({ original: bullet, rewrite: suggestedRewrite, reasons: bulletTriggers });
    }
  });

  return { quantifiedCount, actionCount, weakBullets, suggestions };
}

export async function analyzeResumeStudio(filePath, targetCompany = '') {
  const resumeData = await parseResumeFile(filePath);
  const formattingAudit = auditFormatting(resumeData);
  const keywordsAudit = auditKeywords(resumeData);
  
  let experienceBullets = [];
  if (resumeData.experience) {
    resumeData.experience.forEach(job => {
      if (job.bullets) experienceBullets.push(...job.bullets);
    });
  }
  
  let projectBullets = [];
  if (resumeData.projects) {
    resumeData.projects.forEach(proj => {
      if (proj.bullets) projectBullets.push(...proj.bullets);
    });
  }
  
  const expAudit = auditBullets(experienceBullets);
  const projAudit = auditBullets(projectBullets);
  
  const expBulletsCount = experienceBullets.length;
  let expScore = 50;
  if (expBulletsCount > 0) {
    const verbRatio = expAudit.actionCount / expBulletsCount;
    const metricRatio = expAudit.quantifiedCount / expBulletsCount;
    expScore = Math.round(40 + (verbRatio * 30) + (metricRatio * 30));
  }
  
  const projBulletsCount = projectBullets.length;
  let projScore = 50;
  if (resumeData.projects && resumeData.projects.length > 0) {
    let bulletRatio = projBulletsCount > 0 ? (projAudit.quantifiedCount / projBulletsCount) : 0;
    projScore = Math.round(50 + (resumeData.projects.length * 10) + (bulletRatio * 30));
  }
  projScore = Math.min(100, Math.max(40, projScore));

  const skillsCount = resumeData.skills ? resumeData.skills.length : 0;
  let skillsScore = Math.min(100, Math.max(45, skillsCount * 6));
  
  let eduScore = 50;
  if (resumeData.education && resumeData.education.length > 0) {
    let hasDetails = resumeData.education.every(edu => edu.degree && edu.institution);
    eduScore = hasDetails ? 100 : 75;
  }
  
  const overallScore = Math.round(
    (expScore + projScore + skillsScore + eduScore + keywordsAudit.score + formattingAudit.score) / 6
  );
  
  const recommendations = [];
  recommendations.push(...formattingAudit.flags);
  keywordsAudit.missing.slice(0, 3).forEach(kw => {
    recommendations.push(`Add technical skill keyword: "${kw}"`);
  });
  if (expAudit.weakBullets.length > 0) {
    recommendations.push(`Quantify bullet points in your Work Experience section; currently only ${Math.round((expAudit.quantifiedCount / Math.max(1, expBulletsCount)) * 100)}% of bullets contain metrics.`);
  }

  const companyOptimizations = [];
  if (targetCompany) {
    try {
      const { evaluateFaangReadiness } = await import('./faang.js');
      const compEval = evaluateFaangReadiness(resumeData, targetCompany);
      if (compEval) {
        companyOptimizations.push({
          company: compEval.companyName,
          score: compEval.readinessScore,
          missing: compEval.missingKeywords,
          tips: compEval.tips
        });
      }
    } catch (e) {}
  }

  const report = {
    overallScore,
    categoryScores: {
      experience: expScore,
      projects: projScore,
      skills: skillsScore,
      education: eduScore,
      keywords: keywordsAudit.score,
      formatting: formattingAudit.score
    },
    formattingAnalysis: { flags: formattingAudit.flags },
    keywordAnalysis: { matched: keywordsAudit.matched, missing: keywordsAudit.missing },
    weakBullets: [...expAudit.weakBullets, ...projAudit.weakBullets],
    bulletRewrites: [...expAudit.suggestions, ...projAudit.suggestions],
    recommendations: recommendations.length > 0 ? recommendations : ['Resume complies with standard guidelines.'],
    companyOptimizations
  };
  
  const outDir = path.join(root, 'exports', 'reports');
  fs.mkdirSync(outDir, { recursive: true });
  
  fs.writeFileSync(path.join(outDir, 'resume-report.json'), JSON.stringify(report, null, 2), 'utf8');
  
  let md = `# AI Resume Studio Report card\n\n`;
  md += `**Overall Score: ${overallScore}/100**\n\n`;
  md += `## Category Analysis\n`;
  md += `- **Experience**: ${expScore}/100\n`;
  md += `- **Projects**: ${projScore}/100\n`;
  md += `- **Skills**: ${skillsScore}/100\n`;
  md += `- **Education**: ${eduScore}/100\n`;
  md += `- **Keywords**: ${keywordsAudit.score}/100\n`;
  md += `- **Formatting**: ${formattingAudit.score}/100\n\n`;
  
  md += `## Core Actionable Recommendations\n`;
  report.recommendations.forEach((rec, i) => {
    md += `${i + 1}. ${rec}\n`;
  });
  
  if (report.weakBullets.length > 0) {
    md += `\n## Weak Bullet Points & Suggested Rewrites\n`;
    report.bulletRewrites.slice(0, 5).forEach((b, i) => {
      md += `### Weak Point ${i + 1}\n`;
      md += `- *Original*: "${b.original}"\n`;
      md += `- *Triggers*: ${b.reasons.join(', ')}\n`;
      md += `- *Suggested Rewrite*: "${b.rewrite}"\n\n`;
    });
  }
  
  fs.writeFileSync(path.join(outDir, 'resume-report.md'), md, 'utf8');
  
  return report;
}

export async function runStudioCLI(action, filePath, company = '') {
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
    console.error(`${c.red}Please provide a target resume file (JSON, TXT, MD, PDF) to analyze.${c.reset}`);
    return;
  }

  try {
    console.log(`${c.cyan}Analyzing resume file: ${c.bold}${filePath}${c.reset}...`);
    const report = await analyzeResumeStudio(filePath, company);
    
    const outJson = path.resolve(root, 'exports', 'reports', 'resume-report.json');
    const outMd = path.resolve(root, 'exports', 'reports', 'resume-report.md');
    
    switch (action) {
      case 'score':
        console.log(`\n${c.bold}=== RESUME OVERALL ATS SCORE ===${c.reset}`);
        const color = report.overallScore >= 80 ? c.green : report.overallScore >= 60 ? c.yellow : c.red;
        console.log(`Score: ${color}${report.overallScore} / 100${c.reset}`);
        console.log(`-----------------------------------`);
        console.log(`  • Experience  : ${report.categoryScores.experience} / 100`);
        console.log(`  • Projects    : ${report.categoryScores.projects} / 100`);
        console.log(`  • Skills      : ${report.categoryScores.skills} / 100`);
        console.log(`  • Education   : ${report.categoryScores.education} / 100`);
        console.log(`  • Keywords    : ${report.categoryScores.keywords} / 100`);
        console.log(`  • Formatting  : ${report.categoryScores.formatting} / 100`);
        break;
        
      case 'review':
        console.log(`\n${c.bold}=== AI RESUME CORE AUDIT REVIEW ===${c.reset}`);
        console.log(`Overall Score: ${report.overallScore}/100\n`);
        console.log(`${c.bold}Formatting Pitfalls:${c.reset}`);
        if (report.formattingAnalysis.flags.length === 0) {
          console.log(`  ${c.green}✓ Layout structure looks clean-parsing and ATS-compliant.${c.reset}`);
        } else {
          report.formattingAnalysis.flags.forEach(f => console.log(`  [${c.red}!${c.reset}] ${f}`));
        }
        console.log(`\n${c.bold}Keyword Signal Density:${c.reset}`);
        console.log(`  • Found: ${c.green}${report.keywordAnalysis.matched.join(', ') || 'None'}${c.reset}`);
        console.log(`  • Missing: ${c.red}${report.keywordAnalysis.missing.slice(0, 5).join(', ') || 'None'}${c.reset}`);
        break;
        
      case 'improve':
        console.log(`\n${c.bold}=== RESUME IMPROVEMENT SUGGESTIONS ===${c.reset}`);
        if (report.weakBullets.length === 0) {
          console.log(`  ${c.green}✓ All bullets show strong action metrics.${c.reset}`);
        } else {
          console.log(`Found ${report.weakBullets.length} weak bullet points. Top optimizations:`);
          report.bulletRewrites.slice(0, 3).forEach((b, idx) => {
            console.log(`\n  ${idx + 1}. Original: "${c.gray}${b.original}${c.reset}"`);
            console.log(`     Triggers: ${c.yellow}${b.reasons.join(', ')}${c.reset}`);
            console.log(`     Rewrite : "${c.green}${b.rewrite}${c.reset}"`);
          });
        }
        break;
        
      case 'ats':
        console.log(`\n${c.bold}=== ATS COMPATIBILITY FORENSIC AUDIT ===${c.reset}`);
        const parseScore = report.categoryScores.formatting;
        const parseColor = parseScore >= 80 ? c.green : parseScore >= 60 ? c.yellow : c.red;
        console.log(`ATS Parseability index: ${parseColor}${parseScore}%${c.reset}`);
        console.log(`-------------------------------------------`);
        if (report.formattingAnalysis.flags.length === 0) {
          console.log(`  ${c.green}✓ Zero blocking structures identified.${c.reset}`);
        } else {
          report.formattingAnalysis.flags.forEach(f => {
            console.log(`  [${c.red}BLOCKER${c.reset}] ${f}`);
          });
        }
        break;
    }
    
    console.log(`\n${c.green}[Success] Reports compiled!${c.reset}`);
    console.log(`  - JSON Report: ${c.bold}${outJson}${c.reset}`);
    console.log(`  - MD Report  : ${c.bold}${outMd}${c.reset}\n`);

    try {
      const { updateLocalProfileScore } = await import('../dashboard/profile-manager.js');
      updateLocalProfileScore('resume_score', report.overallScore);
    } catch (e) {}

  } catch (err) {
    console.error(`${c.red}Error executing Resume Studio: ${err.message}${c.reset}`);
  }
}
