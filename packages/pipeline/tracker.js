/**
 * Career-Agents Pipeline · Native Application Tracker
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

import fs from 'fs';
import path from 'path';

export const APPLICATION_STATUSES = [
  'bookmarked',
  'applied',
  'screening',
  'interviewing',
  'offer',
  'accepted',
  'rejected',
  'withdrawn'
];

export class ApplicationTracker {
  constructor(entries = []) {
    this.entries = entries;
  }

  static load(filePath) {
    if (!fs.existsSync(filePath)) {
      return new ApplicationTracker([]);
    }
    const content = fs.readFileSync(filePath, 'utf8');
    if (filePath.endsWith('.json')) {
      try {
        return new ApplicationTracker(JSON.parse(content));
      } catch {
        return new ApplicationTracker([]);
      }
    }
    return ApplicationTracker.parseMarkdown(content);
  }

  static parseMarkdown(md) {
    const lines = md.split('\n');
    const entries = [];
    let inTable = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith('|') && line.includes('Company') && line.includes('Role')) {
        inTable = true;
        continue;
      }
      if (inTable && line.startsWith('|--') || (line.startsWith('|') && line.includes('---'))) {
        continue;
      }
      if (inTable && line.startsWith('|')) {
        const cells = line.split('|').slice(1, -1).map(c => c.trim());
        if (cells.length >= 4) {
          entries.push({
            company: cells[0] || '',
            role: cells[1] || '',
            status: (cells[2] || 'applied').toLowerCase(),
            appliedDate: cells[3] || '',
            fitScore: cells[4] ? parseInt(cells[4], 10) || null : null,
            link: cells[5] || '',
            notes: cells[6] || ''
          });
        }
      } else if (inTable && !line.startsWith('|') && line.length > 0) {
        inTable = false;
      }
    }

    return new ApplicationTracker(entries);
  }

  toMarkdown() {
    let out = '# Job Application Pipeline Tracker\n\n';
    out += '| Company | Role | Status | Applied Date | Fit Score | Link | Notes |\n';
    out += '|---------|------|--------|--------------|-----------|------|-------|\n';

    for (const e of this.entries) {
      const company = (e.company || '').replace(/\|/g, '-');
      const role = (e.role || '').replace(/\|/g, '-');
      const status = (e.status || 'applied').toLowerCase();
      const date = e.appliedDate || new Date().toISOString().split('T')[0];
      const fit = e.fitScore !== null && e.fitScore !== undefined ? `${e.fitScore}%` : '-';
      const link = e.link || '-';
      const notes = (e.notes || '').replace(/\|/g, '-');
      out += `| ${company} | ${role} | ${status} | ${date} | ${fit} | ${link} | ${notes} |\n`;
    }

    return out;
  }

  addEntry(entry) {
    const existing = this.entries.find(e => 
      e.company.toLowerCase().trim() === entry.company.toLowerCase().trim() &&
      e.role.toLowerCase().trim() === entry.role.toLowerCase().trim()
    );

    if (existing) {
      Object.assign(existing, entry);
      return existing;
    }

    const clean = {
      company: entry.company,
      role: entry.role,
      status: (entry.status || 'applied').toLowerCase(),
      appliedDate: entry.appliedDate || new Date().toISOString().split('T')[0],
      fitScore: entry.fitScore || null,
      link: entry.link || '',
      notes: entry.notes || ''
    };
    this.entries.push(clean);
    return clean;
  }

  updateStatus(company, status, notes = '') {
    const target = this.entries.find(e => e.company.toLowerCase().trim() === company.toLowerCase().trim());
    if (target) {
      target.status = status.toLowerCase();
      if (notes) {
        target.notes = target.notes ? `${target.notes}; ${notes}` : notes;
      }
      return target;
    }
    return null;
  }

  getStats() {
    const total = this.entries.length;
    const active = this.entries.filter(e => !['rejected', 'withdrawn', 'accepted'].includes(e.status)).length;
    const interviewing = this.entries.filter(e => ['screening', 'interviewing', 'offer'].includes(e.status)).length;
    const offers = this.entries.filter(e => e.status === 'offer' || e.status === 'accepted').length;

    return {
      total,
      active,
      interviewing,
      offers,
      interviewRate: total > 0 ? Math.round((interviewing / total) * 100) : 0
    };
  }

  save(filePath) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    if (filePath.endsWith('.json')) {
      fs.writeFileSync(filePath, JSON.stringify(this.entries, null, 2), 'utf8');
    } else {
      fs.writeFileSync(filePath, this.toMarkdown(), 'utf8');
    }
  }
}

export default ApplicationTracker;
