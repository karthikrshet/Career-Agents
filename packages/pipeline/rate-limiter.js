/**
 * Career-Agents Pipeline · Network Pacing & Rate Limiter
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

export class RateLimiter {
  constructor(requestsPerMinute = 60, minIntervalMs = 500) {
    this.requestsPerMinute = requestsPerMinute;
    this.minIntervalMs = minIntervalMs;
    this.lastRequestTime = 0;
    this.queue = [];
    this.processing = false;
  }

  async acquire() {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < this.minIntervalMs) {
      const waitTime = this.minIntervalMs - elapsed;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    this.lastRequestTime = Date.now();
  }

  async execute(fn) {
    await this.acquire();
    return await fn();
  }
}

export default RateLimiter;
