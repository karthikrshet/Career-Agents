/**
 * Career-Agents Node.js Developer SDK
 * Exposes core programmatic integration lookups for AI agents and workflows.
 */
export class CareerAgentsSDK {
  /**
   * @param {Object} [options]
   * @param {string} [options.baseUrl] - Custom API endpoint URL (default: https://career-agents.dev)
   * @param {string} [options.apiKey] - Auth credential token
   */
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'https://career-agents.dev';
    this.apiKey = options.apiKey || null;
  }

  /**
   * Safe helper wrapper to request JSON payloads
   * @private
   */
  async _request(endpoint, queryParams = null) {
    let url = `${this.baseUrl}${endpoint}`;
    if (queryParams) {
      const params = new URLSearchParams();
      for (const [key, val] of Object.entries(queryParams)) {
        if (val !== undefined && val !== null) {
          params.append(key, String(val));
        }
      }
      url += `?${params.toString()}`;
    }

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`Career-Agents SDK Request Failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * List all registered career AI agents
   * @returns {Promise<Array>}
   */
  async listAgents() {
    return this._request('/api/v1/agents');
  }

  /**
   * Get dynamic specifications and system prompts for an agent by slug
   * @param {string} slug - unique name identifier
   * @returns {Promise<Object>}
   */
  async getAgent(slug) {
    if (!slug) throw new Error('Agent slug parameter is required.');
    return this._request(`/api/v1/agents/${slug}`);
  }

  /**
   * Unified lookup across agents, divisions, and tracks
   * @param {string} query - search keyword
   * @returns {Promise<Object>}
   */
  async search(query) {
    if (!query) throw new Error('Search query parameter is required.');
    return this._request('/api/v1/search', { q: query });
  }
}
