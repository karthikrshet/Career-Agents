/**
 * Career-Agents Pipeline · Company Intelligence & Hiring Bar Analyzer
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

export class CompanyIntel {
  /**
   * Load detailed company profile and technical interview requirements.
   */
  static getProfile(companySlug) {
    const slug = companySlug.toLowerCase().replace(/[^a-z0-9]/g, '');
    const jsonPath = path.join(root, 'companies', `${slug}.json`);

    if (fs.existsSync(jsonPath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        return {
          found: true,
          slug,
          name: raw.name || companySlug,
          tier: raw.tier || 'Tier 1',
          requiredSkills: raw.required_skills || [],
          interviewStages: raw.interview_stages || ['Screen', 'Technical Round 1', 'System Design', 'Behavioral Loop'],
          culture: raw.culture || 'High engineering standards, autonomy, and cross-functional ownership.'
        };
      } catch {
        // fallback
      }
    }

    return {
      found: false,
      slug,
      name: companySlug,
      tier: 'Standard Tech',
      requiredSkills: ['Data Structures & Algorithms', 'System Architecture', 'Clean Code'],
      interviewStages: ['Recruiter Screen', 'Technical Screen', 'Onsite Loop (DSA + System Design + Behavioral)'],
      culture: 'Engineering excellence and collaborative delivery.'
    };
  }
}

export default CompanyIntel;
