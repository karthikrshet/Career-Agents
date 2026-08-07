/**
 * Career-Agents Pipeline · Health Diagnostics & Doctor
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

export class PipelineDoctor {
  static runDiagnostics() {
    const results = {
      passed: true,
      checks: []
    };

    // Check 1: Registry files
    const registries = ['career-agents.json', 'agent-registry.json', 'divisions.json', 'workflow-registry.json'];
    for (const reg of registries) {
      const p = path.join(root, reg);
      const exists = fs.existsSync(p);
      results.checks.push({ name: `Registry: ${reg}`, passed: exists });
      if (!exists) results.passed = false;
    }

    // Check 2: Pipeline tracker
    const trackerPath = path.join(root, 'pipeline-tracker.md');
    results.checks.push({
      name: 'Application Tracker (pipeline-tracker.md)',
      passed: true,
      exists: fs.existsSync(trackerPath)
    });

    // Check 3: Mode prompts
    const modesDir = path.join(root, 'modes');
    const modesExist = fs.existsSync(modesDir);
    results.checks.push({ name: 'Modes Directory (modes/)', passed: modesExist });
    if (!modesExist) results.passed = false;

    // Check 4: Skills directories
    const skillPaths = [
      path.join(root, '.agents/skills/career-pipeline/SKILL.md'),
      path.join(root, '.cursor/skills/career-pipeline/SKILL.md'),
      path.join(root, '.claude/skills/career-pipeline/SKILL.md'),
      path.join(root, '.codex/skills/career-pipeline/SKILL.md')
    ];
    for (const sp of skillPaths) {
      const rel = path.relative(root, sp);
      const exists = fs.existsSync(sp);
      results.checks.push({ name: `Skill: ${rel}`, passed: exists });
      if (!exists) results.passed = false;
    }

    return results;
  }
}

export default PipelineDoctor;
