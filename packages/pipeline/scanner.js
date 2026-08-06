/**
 * Career-Agents Pipeline · ATS Portal & Board Scanner
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

import https from 'https';
import http from 'http';

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Career-Agents-Pipeline/1.0 (https://github.com/karthikrshet/Career-Agents)' } }, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return resolve({ error: `HTTP ${res.statusCode}` });
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: 'Failed to parse JSON response' });
        }
      });
    }).on('error', err => resolve({ error: err.message }));
  });
}

export class ATSScanner {
  /**
   * Scan Greenhouse API for published openings.
   */
  static async scanGreenhouse(boardToken) {
    const url = `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(boardToken)}/jobs?content=true`;
    const res = await fetchJSON(url);
    if (!res || res.error || !Array.isArray(res.jobs)) {
      return { success: false, error: res?.error || 'Invalid board', jobs: [] };
    }

    const jobs = res.jobs.map(j => ({
      id: String(j.id),
      title: j.title,
      location: j.location?.name || 'Remote',
      url: j.absolute_url,
      updatedAt: j.updated_at,
      departments: (j.departments || []).map(d => d.name)
    }));

    return { success: true, count: jobs.length, jobs };
  }

  /**
   * Scan Lever API for active postings.
   */
  static async scanLever(companyToken) {
    const url = `https://api.lever.co/v0/postings/${encodeURIComponent(companyToken)}?mode=json`;
    const res = await fetchJSON(url);
    if (!res || res.error || !Array.isArray(res)) {
      return { success: false, error: res?.error || 'Invalid board', jobs: [] };
    }

    const jobs = res.map(j => ({
      id: j.id,
      title: j.text,
      location: j.categories?.location || 'Remote',
      url: j.hostedUrl,
      updatedAt: new Date(j.createdAt).toISOString(),
      team: j.categories?.team || ''
    }));

    return { success: true, count: jobs.length, jobs };
  }

  /**
   * Scan Ashby API for open roles.
   */
  static async scanAshby(companyToken) {
    const url = `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(companyToken)}`;
    const res = await fetchJSON(url);
    if (!res || res.error || !Array.isArray(res.jobs)) {
      return { success: false, error: res?.error || 'Invalid board', jobs: [] };
    }

    const jobs = res.jobs.map(j => ({
      id: j.id,
      title: j.title,
      location: j.locationName || 'Remote',
      url: j.jobUrl,
      updatedAt: j.publishedAt || '',
      department: j.departmentName || ''
    }));

    return { success: true, count: jobs.length, jobs };
  }
}

export default ATSScanner;
