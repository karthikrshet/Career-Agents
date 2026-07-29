import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// Load skill taxonomy if available
let taxonomy = {};
try {
  const taxonomyPath = path.join(root, 'skill-taxonomy.json');
  if (fs.existsSync(taxonomyPath)) {
    taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));
  }
} catch {
  taxonomy = {};
}

/**
 * Resolves authoritative requirements for a target company and role.
 * Reads directly from companies/*.json and career-paths/*.json.
 */
export function resolveRequirements(target = {}) {
  const companyId = typeof target === 'string'
    ? target.toLowerCase().trim()
    : (target.company || target.target_company || target.targetCompany || '').toLowerCase().trim();

  const roleId = typeof target === 'object'
    ? (target.role || target.target_role || target.targetRole || target.careerPath || '').toLowerCase().trim()
    : '';

  const explicitReqs = Array.isArray(target.requirements) ? target.requirements : [];

  const requirementMap = new Map();

  // 1. Load Company Requirements from companies/<id>.json
  if (companyId) {
    const coFile = path.join(root, 'companies', `${companyId}.json`);
    if (fs.existsSync(coFile)) {
      try {
        const coData = JSON.parse(fs.readFileSync(coFile, 'utf8'));
        const coSkills = coData.skills || [];
        coSkills.forEach((skillName, idx) => {
          const key = skillName.toLowerCase().trim();
          requirementMap.set(key, {
            id: `company-${companyId}-${idx}`,
            name: skillName,
            category: categorizeSkill(skillName, 'company'),
            weight: getCategoryWeight(categorizeSkill(skillName, 'company')),
            source: `company:${companyId}`
          });
        });
      } catch (err) {
        console.error(`Failed to load company registry for ${companyId}:`, err);
      }
    }
  }

  // 2. Load Career Path Requirements from career-paths/<role>.json
  if (roleId) {
    // Normalize role string to match career path filenames
    const normalizedRoleId = roleId
      .replace(/^(senior|staff|principal|lead|junior|mid)\s+/i, '')
      .replace(/\s+/g, '-')
      .replace(/\/ml/i, '')
      .replace(/engineer.*$/, 'engineer');

    const possibleFiles = [
      path.join(root, 'career-paths', `${normalizedRoleId}.json`),
      path.join(root, 'career-paths', `${normalizedRoleId}-engineer.json`),
      path.join(root, 'career-paths', 'ai-engineer.json')
    ];

    for (const pFile of possibleFiles) {
      if (fs.existsSync(pFile)) {
        try {
          const pData = JSON.parse(fs.readFileSync(pFile, 'utf8'));
          const pSkills = pData.core_skills || pData.skills || [];
          pSkills.forEach((skillName, idx) => {
            const key = skillName.toLowerCase().trim();
            if (!requirementMap.has(key)) {
              requirementMap.set(key, {
                id: `role-${pData.id || normalizedRoleId}-${idx}`,
                name: skillName,
                category: categorizeSkill(skillName, 'role'),
                weight: getCategoryWeight(categorizeSkill(skillName, 'role')),
                source: `role:${pData.id || normalizedRoleId}`
              });
            }
          });
          break; // Found and loaded primary matching career path
        } catch {}
      }
    }
  }

  // 3. Include any caller-provided explicit requirements
  explicitReqs.forEach((req, idx) => {
    const name = typeof req === 'string' ? req : req.name;
    const key = name.toLowerCase().trim();
    if (!requirementMap.has(key)) {
      requirementMap.set(key, {
        id: `explicit-${idx}`,
        name: name,
        category: req.category || categorizeSkill(name, 'explicit'),
        weight: req.weight || 1.0,
        source: 'explicit'
      });
    }
  });

  // Default fallback if neither company nor role was found or specified
  if (requirementMap.size === 0) {
    const defaultSkills = [
      'Data Structures & Algorithms',
      'System Design & Scalability',
      'Core Programming (Python, TypeScript, Go, Java, or C++)',
      'API & Cloud Architecture'
    ];
    defaultSkills.forEach((name, idx) => {
      requirementMap.set(name.toLowerCase(), {
        id: `general-${idx}`,
        name,
        category: categorizeSkill(name, 'general'),
        weight: 1.0,
        source: 'general'
      });
    });
  }

  return Array.from(requirementMap.values());
}

function categorizeSkill(name, context) {
  const n = name.toLowerCase();
  if (n.includes('algorithm') || n.includes('dsa') || n.includes('data structure') || n.includes('complexity') || n.includes('trees') || n.includes('dynamic programming')) {
    return 'algorithmic';
  }
  if (n.includes('system design') || n.includes('scalability') || n.includes('architecture') || n.includes('distributed') || n.includes('microservices') || n.includes('saas')) {
    return 'system-design';
  }
  if (n.includes('ai') || n.includes('ml') || n.includes('rag') || n.includes('prompt') || n.includes('agent') || n.includes('pytorch') || n.includes('llm') || n.includes('model orchestration')) {
    return 'role-specialty';
  }
  if (n.includes('swift') || n.includes('ios') || n.includes('react') || n.includes('frontend') || n.includes('hardware') || n.includes('memory management') || n.includes('kernel')) {
    return 'role-specialty';
  }
  if (n.includes('googliness') || n.includes('culture') || n.includes('values') || n.includes('collaboration') || n.includes('leadership') || n.includes('customer success') || n.includes('product craft')) {
    return 'culture-leadership';
  }
  return 'core-technical';
}

function getCategoryWeight(category) {
  switch (category) {
    case 'role-specialty':
      return 1.3;
    case 'system-design':
      return 1.25;
    case 'algorithmic':
      return 1.2;
    case 'core-technical':
      return 1.0;
    case 'culture-leadership':
      return 0.9;
    default:
      return 1.0;
  }
}

/**
 * Normalizes candidate profile input into extracted skill tokens, text blocks, and structured evidence.
 */
export function normalizeCandidateProfile(profile) {
  if (!profile) {
    return { skills: [], text: '', hasEvidence: false, isSummaryOnly: false };
  }

  let skills = [];
  let text = '';
  let isSummaryOnly = false;

  if (typeof profile === 'string') {
    try {
      const parsed = JSON.parse(profile);
      return normalizeCandidateProfile(parsed);
    } catch {
      text = profile;
      // Match common programming skills from raw text
      const extracted = profile.match(/\b(React|Next\.js|Node\.js|Express|Python|PyTorch|Go|Java|C\+\+|Rust|Swift|SwiftUI|SQL|AWS|Docker|Kubernetes|Git|GraphQL|Apex|TypeScript|JavaScript|System Design|Distributed Systems|Algorithms|Scalability|LLMs|RAG)\b/gi) || [];
      skills = Array.from(new Set(extracted));
    }
  } else if (typeof profile === 'object') {
    // Array of skills
    if (Array.isArray(profile.skills)) {
      skills = profile.skills.map(s => String(s).trim()).filter(Boolean);
    } else if (typeof profile.skills === 'string') {
      skills = profile.skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Resume or text representations
    if (typeof profile.resume === 'string') {
      try {
        const parsedRes = JSON.parse(profile.resume);
        if (Array.isArray(parsedRes.skills)) {
          skills = Array.from(new Set([...skills, ...parsedRes.skills.map(s => String(s).trim())]));
        }
        text += ' ' + (parsedRes.summary || parsedRes.text || JSON.stringify(parsedRes));
      } catch {
        text += ' ' + profile.resume;
      }
    } else if (typeof profile.resume === 'object' && profile.resume) {
      if (Array.isArray(profile.resume.skills)) {
        skills = Array.from(new Set([...skills, ...profile.resume.skills.map(s => String(s).trim())]));
      }
      text += ' ' + (profile.resume.summary || profile.resume.text || JSON.stringify(profile.resume));
    }

    if (profile.summary) text += ' ' + profile.summary;
    if (profile.resumeText) text += ' ' + profile.resumeText;
    if (profile.text) text += ' ' + profile.text;

    // Check if profile contains ONLY dashboard summary scores without skills or text
    const hasScoresOnly = (
      (profile.career_score !== undefined || profile.overall_career_score !== undefined || profile.resume_score !== undefined || profile.roadmapScore !== undefined) &&
      skills.length === 0 &&
      text.trim().length === 0
    );

    if (hasScoresOnly) {
      isSummaryOnly = true;
    }
  }

  const hasEvidence = skills.length > 0 || text.trim().length > 10;

  return {
    skills,
    text: text.trim(),
    hasEvidence,
    isSummaryOnly
  };
}

/**
 * Checks candidate evidence against a single target requirement using direct, alias, and semantic matching.
 */
function evaluateRequirementEvidence(candidate, requirement) {
  const targetName = requirement.name.toLowerCase().trim();
  const candidateSkills = candidate.skills.map(s => s.toLowerCase().trim());
  const candidateText = candidate.text.toLowerCase();

  // 1. Direct Skill Exact Match
  for (const s of candidateSkills) {
    if (s === targetName || targetName.includes(s) || s.includes(targetName)) {
      return { status: 'verified', evidenceScore: 1.0, matchType: 'direct-skill' };
    }
  }

  // 2. Keyword Tokens / Sub-terms Matching (e.g. "Data Structures & Algorithms (graphs, dynamic programming, trees)")
  const subTerms = targetName
    .replace(/[(),/&]/g, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 2);

  let matchedSubterms = 0;
  for (const term of subTerms) {
    if (candidateSkills.some(s => s.includes(term)) || candidateText.includes(term)) {
      matchedSubterms++;
    }
  }

  if (subTerms.length > 0 && matchedSubterms >= Math.min(2, subTerms.length)) {
    return { status: 'verified', evidenceScore: 1.0, matchType: 'keyword-cluster' };
  }

  // 3. Taxonomy & Semantic Synonyms Matching
  for (const [groupName, members] of Object.entries(taxonomy)) {
    const normMembers = members.map(m => m.toLowerCase());
    const isTargetInGroup = normMembers.some(m => targetName.includes(m)) || targetName.includes(groupName.toLowerCase());

    if (isTargetInGroup) {
      for (const m of normMembers) {
        if (candidateSkills.includes(m) || candidateText.includes(m)) {
          return { status: 'verified', evidenceScore: 0.95, matchType: 'taxonomy-synonym' };
        }
      }
    }
  }

  // 4. Text Pattern Occurrence
  if (candidateText.length > 0 && candidateText.includes(targetName)) {
    return { status: 'verified', evidenceScore: 0.9, matchType: 'text-context' };
  }

  if (matchedSubterms === 1 && subTerms.length > 1) {
    return { status: 'partial', evidenceScore: 0.5, matchType: 'partial-token' };
  }

  return { status: 'missing', evidenceScore: 0.0, matchType: 'none' };
}

/**
 * Pure, deterministic, side-effect-free Canonical Readiness Calculation Service.
 *
 * @param {Object|string} profile - Candidate profile, resume, or skills
 * @param {Object|string|Array} target - Target requirements, company, or role
 * @returns {Object} Canonical readiness result structure
 */
export function calculateReadiness(profile, target) {
  const candidate = normalizeCandidateProfile(profile);
  const requirements = Array.isArray(target) ? target : resolveRequirements(target || {});

  // Handle case where candidate provides zero evidence or only score-summary proxies
  if (!candidate.hasEvidence || candidate.isSummaryOnly) {
    const allRequirementNames = requirements.map(r => r.name);
    return {
      readinessScore: null,
      components: requirements.map(r => ({
        name: r.name,
        category: r.category,
        weight: r.weight,
        status: 'missing',
        evidenceScore: 0,
        matchType: 'no-evidence-provided'
      })),
      confidence: candidate.isSummaryOnly ? 20 : 0,
      dataCoverage: 0,
      missingEvidence: allRequirementNames,
      strengths: [],
      gaps: allRequirementNames,
      weaknesses: allRequirementNames,
      isProvisional: true,
      notes: candidate.isSummaryOnly
        ? 'Profile contains only high-level summary scores without verified skills evidence.'
        : 'No candidate skills or resume evidence provided.'
    };
  }

  const evaluatedComponents = [];
  const strengths = [];
  const gaps = [];
  const missingEvidence = [];

  let totalWeight = 0;
  let weightedEarnedScore = 0;
  let requirementsWithData = 0;

  for (const req of requirements) {
    const evaluation = evaluateRequirementEvidence(candidate, req);
    totalWeight += req.weight;
    weightedEarnedScore += req.weight * evaluation.evidenceScore;

    if (evaluation.status === 'verified') {
      strengths.push(req.name);
      requirementsWithData++;
    } else if (evaluation.status === 'partial') {
      gaps.push(req.name);
      requirementsWithData += 0.5;
    } else {
      gaps.push(req.name);
      missingEvidence.push(req.name);
    }

    evaluatedComponents.push({
      name: req.name,
      category: req.category,
      weight: req.weight,
      status: evaluation.status,
      evidenceScore: evaluation.evidenceScore,
      matchType: evaluation.matchType
    });
  }

  // Calculate Data Coverage: percentage of required evidence evaluated
  const dataCoverage = requirements.length > 0
    ? Math.round((requirementsWithData / requirements.length) * 100)
    : 0;

  // Calculate Readiness Score: pure weighted average 0-100 (no arbitrary floor)
  let rawScore = totalWeight > 0 ? (weightedEarnedScore / totalWeight) * 100 : 0;
  const readinessScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Calculate Confidence based on evidence completeness
  const confidence = Math.min(100, Math.max(10, Math.round(15 + (dataCoverage * 0.85))));

  return {
    readinessScore,
    components: evaluatedComponents,
    confidence,
    dataCoverage,
    missingEvidence,
    strengths,
    gaps,
    weaknesses: gaps, // backward compatibility
    isProvisional: dataCoverage < 40
  };
}

export default {
  resolveRequirements,
  normalizeCandidateProfile,
  calculateReadiness
};
