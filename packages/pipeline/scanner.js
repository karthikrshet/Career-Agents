

/**
 * Career-Agents Pipeline · Multi-ATS Portal & Universal Job Board Scanner
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

import https from 'https';
import http from 'http';
import zlib from 'zlib';

function fetchJSON(url, customHeaders = {}, timeoutMs = 25000) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Career-Agents/1.0',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        ...customHeaders
      };

      const req = client.get(url, { headers, timeout: timeoutMs }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchJSON(res.headers.location, customHeaders, timeoutMs).then(resolve);
        }
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return resolve({ error: `HTTP ${res.statusCode}` });
        }

        let stream = res;
        const encoding = res.headers['content-encoding'];
        if (encoding === 'gzip') {
          stream = res.pipe(zlib.createGunzip());
        } else if (encoding === 'deflate') {
          stream = res.pipe(zlib.createInflate());
        } else if (encoding === 'br') {
          stream = res.pipe(zlib.createBrotliDecompress());
        }

        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve({ error: 'Failed to parse JSON response' });
          }
        });
        stream.on('error', err => resolve({ error: err.message }));
      });

      req.on('error', err => resolve({ error: err.message }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ error: 'Request timed out' });
      });
    } catch (e) {
      resolve({ error: e.message });
    }
  });
}

export class ATSScanner {
  /**
   * 1. Scan Greenhouse Board
   */
  static async scanGreenhouse(boardToken) {
    const url = `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(boardToken)}/jobs?content=true`;
    const res = await fetchJSON(url);
    if (!res || res.error || !Array.isArray(res.jobs)) {
      return { success: false, error: res?.error || 'Invalid board', provider: 'Greenhouse', jobs: [] };
    }

    const jobs = res.jobs.map(j => ({
      id: String(j.id),
      title: j.title,
      company: boardToken,
      location: j.location?.name || 'Remote',
      url: j.absolute_url,
      updatedAt: j.updated_at,
      departments: (j.departments || []).map(d => d.name)
    }));

    return { success: true, provider: 'Greenhouse', count: jobs.length, jobs };
  }

  /**
   * 2. Scan Lever Postings
   */
  static async scanLever(companyToken) {
    const url = `https://api.lever.co/v0/postings/${encodeURIComponent(companyToken)}?mode=json`;
    const res = await fetchJSON(url);
    if (!res || res.error || !Array.isArray(res)) {
      return { success: false, error: res?.error || 'Invalid board', provider: 'Lever', jobs: [] };
    }

    const jobs = res.map(j => ({
      id: j.id,
      title: j.text,
      company: companyToken,
      location: j.categories?.location || 'Remote',
      url: j.hostedUrl,
      updatedAt: j.createdAt ? new Date(j.createdAt).toISOString() : '',
      team: j.categories?.team || ''
    }));

    return { success: true, provider: 'Lever', count: jobs.length, jobs };
  }

  /**
   * 3. Scan Ashby Job Board (Supports high-payload compressed streaming)
   */
  static async scanAshby(companyToken) {
    const url = `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(companyToken)}`;
    const res = await fetchJSON(url, {}, 30000);
    if (!res || res.error || !Array.isArray(res.jobs)) {
      return { success: false, error: res?.error || 'Invalid board', provider: 'Ashby', jobs: [] };
    }

    const jobs = res.jobs.map(j => ({
      id: j.id,
      title: j.title,
      company: companyToken,
      location: j.locationName || j.location || 'Remote',
      url: j.jobUrl || `https://jobs.ashbyhq.com/${companyToken}/${j.id}`,
      updatedAt: j.publishedAt || '',
      department: j.departmentName || j.department || ''
    }));

    return { success: true, provider: 'Ashby', count: jobs.length, jobs };
  }

  /**
   * 4. Scan Workable Accounts
   */
  static async scanWorkable(companyToken) {
    const url = `https://apply.workable.com/api/v1/widget/accounts/${encodeURIComponent(companyToken)}`;
    const res = await fetchJSON(url);
    if (!res || res.error || !Array.isArray(res.jobs)) {
      return { success: false, error: res?.error || 'Invalid board', provider: 'Workable', jobs: [] };
    }

    const jobs = res.jobs.map(j => ({
      id: j.shortcode || j.id,
      title: j.title,
      company: companyToken,
      location: `${j.city || ''}, ${j.country || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Remote',
      url: j.url || `https://apply.workable.com/${companyToken}/j/${j.shortcode}/`,
      updatedAt: j.published_on || ''
    }));

    return { success: true, provider: 'Workable', count: jobs.length, jobs };
  }

  /**
   * 5. Scan SmartRecruiters Postings
   */
  static async scanSmartRecruiters(companyToken) {
    const url = `https://api.smartrecruiters.com/v1/companies/${encodeURIComponent(companyToken)}/postings`;
    const res = await fetchJSON(url);
    if (!res || res.error || !Array.isArray(res.content)) {
      return { success: false, error: res?.error || 'Invalid board', provider: 'SmartRecruiters', jobs: [] };
    }

    const jobs = res.content.map(j => ({
      id: j.id,
      title: j.name,
      company: companyToken,
      location: j.location?.city ? `${j.location.city}, ${j.location.country}` : 'Remote',
      url: `https://jobs.smartrecruiters.com/${companyToken}/${j.id}`,
      updatedAt: j.releasedDate || ''
    }));

    return { success: true, provider: 'SmartRecruiters', count: jobs.length, jobs };
  }

  /**
   * 6. Scan RemoteOK Public Feed
   */
  static async scanRemoteOK(query = '') {
    const url = `https://remoteok.com/api${query ? `?tag=${encodeURIComponent(query)}` : ''}`;
    const res = await fetchJSON(url);
    if (!Array.isArray(res)) {
      return { success: false, error: 'Failed to fetch RemoteOK feed', provider: 'RemoteOK', jobs: [] };
    }

    const jobs = res.filter(j => j && j.position).map(j => ({
      id: String(j.id || j.epoch),
      title: j.position,
      company: j.company || 'Unknown',
      location: j.location || 'Remote',
      url: j.url || `https://remoteok.com/remote-jobs/${j.id}`,
      tags: j.tags || [],
      updatedAt: j.date || ''
    }));

    return { success: true, provider: 'RemoteOK', count: jobs.length, jobs };
  }

  /**
   * 7. Scan Arbeitnow European Tech Feed
   */
  static async scanArbeitnow() {
    const url = `https://www.arbeitnow.com/api/job-board-api`;
    const res = await fetchJSON(url);
    if (!res || !Array.isArray(res.data)) {
      return { success: false, error: 'Failed to fetch Arbeitnow feed', provider: 'Arbeitnow', jobs: [] };
    }

    const jobs = res.data.map(j => ({
      id: j.slug || String(Math.random()),
      title: j.title,
      company: j.company_name,
      location: j.location || (j.remote ? 'Remote' : 'Europe'),
      url: j.url,
      tags: j.tags || [],
      updatedAt: new Date(j.created_at * 1000).toISOString()
    }));

    return { success: true, provider: 'Arbeitnow', count: jobs.length, jobs };
  }

  /**
   * 8. Scan Himalayas Remote Jobs
   */
  static async scanHimalayas() {
    const url = `https://himalayas.app/jobs/api`;
    const res = await fetchJSON(url);
    if (!res || !Array.isArray(res.jobs)) {
      return { success: false, error: 'Failed to fetch Himalayas feed', provider: 'Himalayas', jobs: [] };
    }

    const jobs = res.jobs.map(j => ({
      id: j.id || j.slug,
      title: j.title,
      company: j.companyName,
      location: j.location || 'Remote',
      url: j.applicationLink || `https://himalayas.app/jobs/${j.slug}`,
      tags: j.categories || [],
      updatedAt: j.pubDate || ''
    }));

    return { success: true, provider: 'Himalayas', count: jobs.length, jobs };
  }

  /**
   * Universal Dispatcher supporting all 8 ATS and public job portals
   */
  static async scan(boardOrQuery, provider = 'greenhouse') {
    const p = provider.toLowerCase();
    if (p === 'lever') return ATSScanner.scanLever(boardOrQuery);
    if (p === 'ashby') return ATSScanner.scanAshby(boardOrQuery);
    if (p === 'workable') return ATSScanner.scanWorkable(boardOrQuery);
    if (p === 'smartrecruiters' || p === 'smart') return ATSScanner.scanSmartRecruiters(boardOrQuery);
    if (p === 'remoteok' || p === 'remote_ok') return ATSScanner.scanRemoteOK(boardOrQuery);
    if (p === 'arbeitnow') return ATSScanner.scanArbeitnow();
    if (p === 'himalayas') return ATSScanner.scanHimalayas();
    return ATSScanner.scanGreenhouse(boardOrQuery);
  }
}

export default ATSScanner;
