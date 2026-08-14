/**
 * Career-Agents Pipeline · Duplicate Application Resolver & Normalizer
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

export class DedupEngine {
  /**
   * Normalize company name by stripping common suffixes (Inc, LLC, Corp, Technologies, etc.).
   */
  static normalizeCompany(name) {
    if (!name || typeof name !== 'string') return '';
    return name
      .toLowerCase()
      .replace(/\b(inc|llc|corp|corporation|technologies|tech|solutions|labs|io|ai)\b\.?/gi, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }

  /**
   * Normalize role title by standardizing seniority levels and engineering disciplines.
   */
  static normalizeRole(title) {
    if (!title || typeof title !== 'string') return '';
    return title
      .toLowerCase()
      .replace(/\b(sr\.?|senior)\b/gi, 'senior')
      .replace(/\b(jr\.?|junior)\b/gi, 'junior')
      .replace(/\b(swe|software development engineer|sde)\b/gi, 'software engineer')
      .replace(/[^a-z0-9]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Find duplicate applications in a list of entries based on fuzzy company and role match.
   */
  static findDuplicates(entries = []) {
    const seen = new Map();
    const duplicates = [];

    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      const key = `${DedupEngine.normalizeCompany(e.company)}::${DedupEngine.normalizeRole(e.role)}`;
      if (seen.has(key)) {
        duplicates.push({ original: seen.get(key), duplicate: e, index: i });
      } else {
        seen.set(key, e);
      }
    }

    return duplicates;
  }

  /**
   * Deduplicate an array of application entries, merging notes and keeping the most recent status.
   */
  static deduplicate(entries = []) {
    const map = new Map();

    for (const e of entries) {
      const key = `${DedupEngine.normalizeCompany(e.company)}::${DedupEngine.normalizeRole(e.role)}`;
      if (!map.has(key)) {
        map.set(key, { ...e });
      } else {
        const existing = map.get(key);
        // Merge notes
        if (e.notes && !existing.notes.includes(e.notes)) {
          existing.notes = existing.notes ? `${existing.notes}; ${e.notes}` : e.notes;
        }
        // Update link if missing
        if (!existing.link && e.link) {
          existing.link = e.link;
        }
      }
    }

    return Array.from(map.values());
  }
}

export default DedupEngine;
