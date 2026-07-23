import fs from 'fs';
import path from 'path';

const FAANG_RUBRICS = {
  google: {
    name: 'Google',
    keywords: ['algorithms', 'complexity', 'scalability', 'system design', 'data structures', 'mentorship', 'python', 'go', 'c++'],
    tips: [
      'Emphasize algorithmic optimizations and runtime complexity (Big-O analysis) in your bullets.',
      'Show evidence of leading projects or mentoring junior engineers (Googliness/leadership values).'
    ]
  },
  meta: {
    name: 'Meta',
    keywords: ['scale', 'performance', 'metrics', 'react', 'hack', 'c++', 'product engineering', 'latency'],
    tips: [
      'Focus on product engineering end-to-end impact. Highlight metrics related to active users or data volume.',
      'Detail frontend/backend scaling configurations and low-latency rendering pipeline work.'
    ]
  },
  amazon: {
    name: 'Amazon',
    keywords: ['ownership', 'leadership', 'metrics', 'customer obsession', 'aws', 'scaling', 'java', 'deliver results'],
    tips: [
      'Align project achievements with Leadership Principles (especially Bias for Action and Customer Obsession).',
      'Quantify results heavily. Use the STAR method to structure your bullet accomplishments.'
    ]
  },
  microsoft: {
    name: 'Microsoft',
    keywords: ['enterprise', 'azure', 'collaboration', 'c#', '.net', 'quality', 'security', 'cloud infrastructure'],
    tips: [
      'Demonstrate experience building secure, enterprise-grade distributed cloud systems.',
      'Highlight cross-team collaboration and alignment across product lines.'
    ]
  },
  openai: {
    name: 'OpenAI',
    keywords: ['machine learning', 'llm', 'gpt', 'pytorch', 'transformer', 'inference', 'fine-tuning', 'safety'],
    tips: [
      'Show depth in deep learning concepts, model fine-tuning, or cost-efficient inference pipeline construction.',
      'Mention evaluations, metrics, and safety checks built for model deployments.'
    ]
  },
  stripe: {
    name: 'Stripe',
    keywords: ['api design', 'payments', 'reliability', 'developer experience', 'integration', 'security', 'ruby', 'scalability'],
    tips: [
      'Highlight clean API engineering choices, documentation, and developer experience metrics.',
      'Detail system reliability engineering under high transaction volumes.'
    ]
  },
  atlassian: {
    name: 'Atlassian',
    keywords: ['collaboration', 'agile', 'scrum', 'integration', 'jira', 'java', 'javascript', 'teamwork'],
    tips: [
      'Emphasize teamwork, agile iterations, and open developer tool ecosystems.',
      'Focus heavily on values alignment (e.g. Open company, no bullshit; Build with heart and balance).'
    ]
  },
  databricks: {
    name: 'Databricks',
    keywords: ['spark', 'databricks', 'data lake', 'parquet', 'delta lake', 'scala', 'c++', 'query optimization', 'storage'],
    tips: [
      'Focus on database storage engine implementations, query compilation, or large-scale data lake orchestrations.',
      'Detail optimizations that directly reduced computational cluster spending.'
    ]
  },
  netflix: {
    name: 'Netflix',
    keywords: ['microservices', 'streaming', 'chaos engineering', 'freedom and responsibility', 'aws', 'java', 'resilience', 'latency'],
    tips: [
      'Show ownership of highly resilient microservices and auto-scaling cloud deployments.',
      'Highlight high-concurrency stream handling and active latency budget optimizations.'
    ]
  },
  uber: {
    name: 'Uber',
    keywords: ['real-time', 'routing', 'dispatch', 'cache', 'cassandra', 'go', 'java', 'distributed systems', 'high throughput'],
    tips: [
      'Focus on real-time event routing, transactional database concurrency, and distributed caching solutions.',
      'Highlight high throughput systems engineering and handling geo-spatial data clusters.'
    ]
  }
};

export function evaluateFaangReadiness(resumeData, companyKey) {
  const normKey = companyKey.toLowerCase();
  const rubric = FAANG_RUBRICS[normKey];
  if (!rubric) return null;

  const resumeText = JSON.stringify(resumeData).toLowerCase();
  const resumeSkills = (resumeData.skills || []).map(s => s.toLowerCase());

  const matchedKeywords = [];
  const missingKeywords = [];

  rubric.keywords.forEach(kw => {
    if (resumeSkills.includes(kw) || resumeText.includes(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  // Calculate readiness score
  const matchRatio = matchedKeywords.length / rubric.keywords.length;
  const readinessScore = Math.min(100, Math.round(50 + (matchRatio * 50)));

  return {
    companyName: rubric.name,
    readinessScore,
    matchedKeywords,
    missingKeywords,
    tips: rubric.tips
  };
}

export function runFaangCLI(filePath, companyKey) {
  const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    gray: '\x1b[90m'
  };

  if (!filePath || !companyKey) {
    console.error(`${c.red}Usage: career-agents resume faang <resume-json-path> <company-id>${c.reset}`);
    console.error(`Supported companies: ${Object.keys(FAANG_RUBRICS).join(', ')}`);
    return;
  }

  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error(`${c.red}Resume file not found: ${filePath}${c.reset}`);
    return;
  }

  const normCompany = companyKey.toLowerCase();
  if (!FAANG_RUBRICS[normCompany]) {
    console.error(`${c.red}Unsupported company '${companyKey}'. Available: ${Object.keys(FAANG_RUBRICS).join(', ')}${c.reset}`);
    return;
  }

  try {
    const resumeData = JSON.parse(fs.readFileSync(resolved, 'utf8'));
    const evaluation = evaluateFaangReadiness(resumeData, normCompany);

    if (!evaluation) {
      console.error(`${c.red}Failed to run FAANG optimization audit.${c.reset}`);
      return;
    }

    console.log(`\n${c.bold}=== FAANG LAUNCH READINESS AUDIT ===${c.reset}`);
    console.log("Target Company: " + c.cyan + evaluation.companyName + c.reset + "\n");

    const scoreColor = evaluation.readinessScore >= 85 ? c.green : evaluation.readinessScore >= 65 ? c.yellow : c.red;
    console.log("  " + c.bold + "READINESS INDEX: " + scoreColor + evaluation.readinessScore + " / 100" + c.reset);
    console.log(`  ----------------------------------`);
    console.log("  • Matched Indicators: " + c.green + (evaluation.matchedKeywords.join(', ') || 'None') + c.reset);
    console.log("  • Missing Indicators: " + c.red + (evaluation.missingKeywords.join(', ') || 'None') + c.reset + "\n");

    console.log(`${c.bold}Suggested Interview Optimization Tips:${c.reset}`);
    evaluation.tips.forEach(t => console.log(`  • ${t}`));
    console.log('');

  } catch (err) {
    console.error(`${c.red}Error parsing resume or running FAANG audit: ${err.message}${c.reset}`);
  }
}
