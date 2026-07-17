import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// Load skill-taxonomy.json
const taxonomyPath = path.join(root, 'skill-taxonomy.json');
let taxonomy = {};
try {
  if (fs.existsSync(taxonomyPath)) {
    taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));
  }
} catch (e) {
  console.error("Failed to load skill-taxonomy.json:", e.message);
}

const COMMON_TECH_TERMS = [
  'python', 'javascript', 'typescript', 'react', 'next.js', 'node.js', 'express',
  'mongodb', 'postgresql', 'redis', 'kafka', 'docker', 'kubernetes', 'aws',
  'gcp', 'azure', 'terraform', 'jenkins', 'git', 'sql', 'nosql', 'graphql',
  'api', 'microservices', 'selenium', 'jest', 'airflow', 'spark', 'pytorch',
  'langchain', 'openai', 'figma', 'product roadmap', 'agile', 'scrum',
  'apex', 'agentforce', 'crm', 'lwc', 'visualforce'
];

function getMatchDetails(resumeSkills, resumeTextLower, targetKeyword) {
  const normTarget = targetKeyword.toLowerCase().trim();

  // 1. Direct Match: check in resumeSkills or directly in resumeText
  const hasDirectSkill = resumeSkills.some(s => s.toLowerCase() === normTarget);
  const escapedTarget = normTarget.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const wordRegex = new RegExp(`\\b${escapedTarget}\\b`, 'i');
  const hasDirectText = wordRegex.test(resumeTextLower);

  if (hasDirectSkill || hasDirectText) {
    return { matched: true, type: 'direct', confidence: 100, matchedWith: targetKeyword };
  }

  // 2. Lookup Taxonomy Groups
  for (const [groupName, members] of Object.entries(taxonomy)) {
    const normMembers = members.map(m => m.toLowerCase());

    // Check if target is in this group
    if (normMembers.includes(normTarget)) {
      // Find if candidate has any member of this group in skills or text
      for (const member of members) {
        const normMember = member.toLowerCase();
        const escapedMember = normMember.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const memberRegex = new RegExp(`\\b${escapedMember}\\b`, 'i');
        const hasMemberSkill = resumeSkills.some(s => s.toLowerCase() === normMember);
        const hasMemberText = memberRegex.test(resumeTextLower);

        if (hasMemberSkill || hasMemberText) {
          // If target is the group parent name itself -> Parent Match
          if (normTarget === groupName.toLowerCase()) {
            return { matched: true, type: 'parent', confidence: 90, matchedWith: member };
          }
          // Closely related (alias) or sibling (transferable)
          const targetCleaned = normTarget.replace(/[^a-z0-9]/g, '');
          const memberCleaned = normMember.replace(/[^a-z0-9]/g, '');
          const closelyRelated = (targetCleaned === memberCleaned) ||
                                (normTarget.includes(normMember) || normMember.includes(normTarget)) ||
                                (groupName === 'javascript' && ['javascript', 'js', 'typescript', 'ts'].includes(normTarget) && ['javascript', 'js', 'typescript', 'ts'].includes(normMember));

          if (closelyRelated) {
            return { matched: true, type: 'alias', confidence: 95, matchedWith: member };
          } else {
            return { matched: true, type: 'transferable', confidence: 75, matchedWith: member };
          }
        }
      }
    }
  }

  return { matched: false, type: 'none', confidence: 0 };
}

export function analyzeJobMatch(resumeData, jdText) {
  if (!resumeData || !jdText) return null;

  const normalizedJd = jdText.toLowerCase();

  // Extract keywords from JD
  const jdKeywords = [];
  COMMON_TECH_TERMS.forEach(term => {
    const escapedTerm = term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedTerm}\\b`, 'i');
    if (regex.test(normalizedJd)) {
      jdKeywords.push(term);
    }
  });

  // Fallback if no tech terms detected
  if (jdKeywords.length === 0) {
    const words = normalizedJd.split(/[^a-zA-Z]+/);
    const candidateWords = [...new Set(words.filter(w => w.length > 3 && w.length < 15))];
    jdKeywords.push(...candidateWords.slice(0, 10));
  }

  const resumeSkills = (resumeData.skills || []).map(s => s.toLowerCase());
  const resumeTextLower = JSON.stringify(resumeData).toLowerCase();

  const matchedKeywords = [];
  const missingKeywords = [];
  let matchScoreSum = 0;
  let matchCount = 0;

  jdKeywords.forEach(keyword => {
    const match = getMatchDetails(resumeSkills, resumeTextLower, keyword);
    if (match.matched) {
      matchedKeywords.push(keyword);
      matchScoreSum += match.confidence;
      matchCount++;
    } else {
      missingKeywords.push(keyword);
    }
  });

  // Average confidence of matched items
  const matchPercentage = jdKeywords.length > 0
    ? Math.round((matchCount / jdKeywords.length) * 100)
    : 50;

  // Signal Detection
  const SIGNAL_KEYWORDS = {
    'Founder Experience': ['founder', 'co-founder', 'started', 'founded'],
    'AI Agents': ['agent', 'ai agents', 'agentic', 'langchain', 'autogen', 'crewai', 'agentforce'],
    'MCP': ['mcp', 'model context protocol'],
    'Full Stack Development': ['full stack', 'fullstack', 'frontend', 'backend', 'node.js', 'react'],
    'System Design': ['system design', 'architecture', 'scalability', 'distributed systems'],
    'Product Ownership': ['product owner', 'product ownership', 'product manager', 'roadmap']
  };

  const strongSignals = [];
  const weakSignals = [];

  for (const [signalName, words] of Object.entries(SIGNAL_KEYWORDS)) {
    if (words.some(w => resumeTextLower.includes(w))) {
      strongSignals.push(signalName);
    } else {
      // If signal is in JD but missing in resume, mark as weak
      const firstWord = signalName.toLowerCase().split(' ')[0];
      if (normalizedJd.includes(firstWord)) {
        weakSignals.push(signalName);
      }
    }
  }

  // Populate signals from matched / missing skills as well
  matchedKeywords.forEach(kw => {
    const capitalized = kw.charAt(0).toUpperCase() + kw.slice(1);
    if (!strongSignals.includes(capitalized) && strongSignals.length < 5) {
      strongSignals.push(capitalized);
    }
  });

  missingKeywords.forEach(kw => {
    const capitalized = kw.charAt(0).toUpperCase() + kw.slice(1);
    if (!weakSignals.includes(capitalized) && weakSignals.length < 4) {
      weakSignals.push(capitalized);
    }
  });

  // Ensure Apex, Agentforce, GraphQL are in weak signals if missing
  const forceWeak = ['apex', 'agentforce', 'graphql'];
  forceWeak.forEach(fw => {
    if (normalizedJd.includes(fw) && !resumeTextLower.includes(fw)) {
      const cap = fw.charAt(0).toUpperCase() + fw.slice(1);
      if (!weakSignals.includes(cap)) {
        weakSignals.unshift(cap);
      }
    }
  });

  // Ensure Founder Experience, AI Agents, MCP, Full Stack Development are in strong if present
  const forceStrong = ['founder', 'agent', 'mcp'];
  forceStrong.forEach(fs => {
    if (resumeTextLower.includes(fs)) {
      let cap = fs === 'mcp' ? 'MCP' : fs === 'agent' ? 'AI Agents' : 'Founder Experience';
      if (!strongSignals.includes(cap)) {
        strongSignals.unshift(cap);
      }
    }
  });

  // Calculate Overall Match Score
  // In the example, match is 72%, confidence is 83%
  const finalMatchScore = matchPercentage;
  const overallConfidence = matchCount > 0 ? Math.round(matchScoreSum / matchCount) : 50;

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
  if (normalizedJd.includes('product') || normalizedJd.includes('roadmap') || normalizedJd.includes('tpm') || normalizedJd.includes('salesforce')) {
    recommendedPaths.push('product-manager');
    recommendedWorkflows.push('salary-negotiation');
    recommendedAgents.push('product-manager', 'product-manager-coach');
  }

  if (recommendedPaths.length === 0) recommendedPaths.push('software-engineer');
  if (recommendedWorkflows.length === 0) recommendedWorkflows.push('ats-optimization', 'technical-interview-week');
  if (recommendedAgents.length === 0) recommendedAgents.push('ats-resume-reviewer', 'technical-interview-coach');

  return {
    matchPercentage: finalMatchScore,
    matchedKeywords,
    missingKeywords,
    strengths,
    weaknesses,
    strongSignals: strongSignals.slice(0, 5),
    weakSignals: weakSignals.slice(0, 5),
    confidence: overallConfidence,
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
  console.log(`  ${c.bold}Match: ${matchColor}${analysis.matchPercentage}%${c.reset}`);
  console.log(`  ----------------------------------`);
  
  console.log(`\n${c.bold}Strong Signals:${c.reset}`);
  analysis.strongSignals.forEach(s => console.log(`- ${s}`));

  console.log(`\n${c.bold}Weak Signals:${c.reset}`);
  analysis.weakSignals.forEach(w => console.log(`- ${w}`));

  console.log(`\n${c.bold}Confidence:${c.reset}`);
  console.log(`${analysis.confidence}%`);

  console.log(`\n${c.bold}Optimization Suggestions:${c.reset}`);
  analysis.suggestions.forEach(s => console.log(`  • ${s}`));

  console.log(`\n${c.bold}Recommended Career-Agents Accelerators:${c.reset}`);
  console.log(`  • Career Paths: ${c.cyan}${analysis.recommendations.paths.join(', ')}${c.reset}`);
  console.log(`  • Workflows   : ${c.cyan}${analysis.recommendations.workflows.join(', ')}${c.reset}`);
  console.log(`  • AI Agents   : ${c.cyan}${analysis.recommendations.agents.join(', ')}${c.reset}\n`);
}
