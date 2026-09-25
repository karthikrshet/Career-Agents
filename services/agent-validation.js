import fs from 'fs';
import path from 'path';

const REQUIRED_HEADINGS = [
  'Your Identity & Memory',
  'Your Core Mission',
  'Critical Rules You Must Follow',
  'Technical Deliverables',
  'Workflow Process'
];

export function parseFrontmatter(text) {
  const match = text.match(/^---([\s\S]*?)---/);
  if (!match) return {};
  const lines = match[1].split('\n');
  const obj = {};
  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx !== -1) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      obj[key] = val;
    }
  }
  return obj;
}

/**
 * Validate registry agents against their prompt files.
 * `resolvePath` maps a registry `filename` to an absolute path on disk.
 */
export function validateAgentRegistry(agents, resolvePath) {
  const errors = [];
  const warnings = [];
  const seenIds = new Set();

  for (const agent of agents) {
    // 1. Unique ID check
    if (seenIds.has(agent.id)) {
      errors.push(`Duplicate Agent ID registered: ${agent.id}`);
    } else {
      seenIds.add(agent.id);
    }

    // 2. File existence check
    const resolvedPath = resolvePath(agent.filename);
    if (!fs.existsSync(resolvedPath)) {
      errors.push(`Agent file does not exist: "${agent.filename}" (ID: ${agent.id})`);
      continue;
    }

    // Read file
    const content = fs.readFileSync(resolvedPath, 'utf-8');

    // 3. Identity & frontmatter check. Agent ids live in the registry and match the
    // prompt file name (e.g. career/ats-resume-reviewer.md); frontmatter carries no id.
    const frontmatter = parseFrontmatter(content);
    const fileId = path.basename(agent.filename, '.md');
    if (!frontmatter.name) {
      errors.push(`Missing or invalid frontmatter (name) in "${agent.filename}"`);
    }
    if (fileId !== agent.id) {
      errors.push(`Registry ID mismatch in "${agent.filename}": Registry says "${agent.id}", file name says "${fileId}"`);
    } else if (frontmatter.id && frontmatter.id !== agent.id) {
      errors.push(`Registry ID mismatch in "${agent.filename}": Registry says "${agent.id}", file says "${frontmatter.id}"`);
    }

    // 4. Word count check (minimum 300 words)
    const cleanBody = content.replace(/^---[\s\S]*?---/, '').trim();
    const words = cleanBody.split(/\s+/).filter(Boolean).length;
    if (words < 300) {
      warnings.push(`Agent "${agent.filename}" body word count (${words}) is below 300 words.`);
    }

    // 5. Section headings check (supports standard 9 emoji headings or core section names)
    for (const heading of REQUIRED_HEADINGS) {
      if (!content.includes(heading)) {
        errors.push(`Agent "${agent.filename}" is missing required heading section: "${heading}"`);
      }
    }
  }

  return { errors, warnings };
}
