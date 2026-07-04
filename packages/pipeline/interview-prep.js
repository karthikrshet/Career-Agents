/**
 * Career-Agents Pipeline · Interview Preparation & STAR Coach
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

export class InterviewCoach {
  /**
   * Load company-specific interview tracks from authoritative registry.
   */
  static getCompanyTrack(companyId) {
    const coFile = path.join(root, 'companies', `${companyId.toLowerCase().trim()}.json`);
    if (fs.existsSync(coFile)) {
      try {
        return JSON.parse(fs.readFileSync(coFile, 'utf8'));
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Generate curated behavioral and technical STAR story prompts.
   */
  static generateSTARBank(skills = [], targetRole = 'Software Engineer') {
    const standardSTARQuestions = [
      {
        category: 'Leadership & Conflict',
        question: 'Tell me about a time you had a technical disagreement with a teammate. How did you resolve it?',
        framework: 'Situation: Context of disagreement | Task: Architectural goal | Action: Data-driven discussion & compromise | Result: Clean deliverable on time.'
      },
      {
        category: 'Complex Problem Solving',
        question: 'Describe the most complex distributed bug or production outage you investigated and resolved.',
        framework: 'Situation: Incident impact | Task: Root-cause triage | Action: Observability tracing & hotfix | Result: Post-mortem & preventive alerting.'
      },
      {
        category: 'Scale & Optimization',
        question: 'Give an example of a system you optimized for latency, throughput, or cost efficiency.',
        framework: 'Situation: Baseline bottleneck | Task: Optimization target | Action: Profiling, index/cache redesign | Result: Quantifiable % speedup.'
      }
    ];

    return {
      role: targetRole,
      questions: standardSTARQuestions
    };
  }
}

export default InterviewCoach;
