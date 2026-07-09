/**
 * Career-Agents Pipeline · JD Parser & Matching Engine
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

import { calculateReadiness } from '../../services/readiness.js';

export class JDMatcher {
  /**
   * Extract key technical requirements, skills, and qualifications from raw JD text.
   */
  static extractRequirements(jdText) {
    if (!jdText || typeof jdText !== 'string') {
      return { skills: [], qualifications: [], raw: '' };
    }

    const techPatterns = [
      /\b(Python|JavaScript|TypeScript|React|Next\.js|Node\.js|Express|Go|Golang|Java|Kotlin|Swift|C\+\+|C#|\.NET|Rust|SQL|PostgreSQL|MySQL|MongoDB|Redis|GraphQL|REST|Docker|Kubernetes|AWS|GCP|Azure|CI\/CD|Git|Kafka|Spark|PyTorch|TensorFlow|LLMs|RAG)\b/gi
    ];

    const detected = new Set();
    for (const pat of techPatterns) {
      const matches = jdText.match(pat) || [];
      for (const m of matches) {
        detected.add(m.trim());
      }
    }

    const lines = jdText.split('\n').map(l => l.trim());
    const qualifications = [];
    let inReqSection = false;

    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.includes('requirements') || lower.includes('qualifications') || lower.includes('what you') || lower.includes('skills')) {
        inReqSection = true;
        continue;
      }
      if (inReqSection && (lower.includes('benefits') || lower.includes('about us') || lower.includes('compensation') || lower.includes('how to apply'))) {
        inReqSection = false;
      }
      if (inReqSection && (line.startsWith('-') || line.startsWith('•') || line.startsWith('*'))) {
        qualifications.push(line.replace(/^[-•*]\s*/, ''));
      }
    }

    return {
      skills: Array.from(detected),
      qualifications,
      wordCount: jdText.split(/\s+/).length
    };
  }

  /**
   * Evaluate candidate profile readiness against a target JD and company.
   */
  static evaluateMatch(candidateProfile, jdText, targetCompany = '', targetRole = '') {
    const extracted = JDMatcher.extractRequirements(jdText);
    const target = {
      company: targetCompany,
      role: targetRole,
      skills: extracted.skills
    };

    const readiness = calculateReadiness(candidateProfile, target);

    return {
      company: targetCompany || 'Target Company',
      role: targetRole || 'Target Role',
      readinessScore: readiness.readinessScore,
      confidence: readiness.confidence,
      dataCoverage: readiness.dataCoverage,
      strengths: readiness.strengths,
      gaps: readiness.gaps,
      components: readiness.components,
      extractedSkills: extracted.skills
    };
  }
}

export default JDMatcher;
