/**
 * Career-Agents Pipeline · Analytics & Funnel Diagnostics
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

export class PipelineAnalytics {
  /**
   * Calculate conversion velocity, interview conversion rate, and stage breakdown.
   */
  static analyzePipeline(entries = []) {
    const total = entries.length;
    const stageCounts = {
      bookmarked: 0,
      applied: 0,
      screening: 0,
      interviewing: 0,
      offer: 0,
      accepted: 0,
      rejected: 0,
      withdrawn: 0
    };

    let totalFitScore = 0;
    let scoredCount = 0;

    for (const e of entries) {
      const st = (e.status || 'bookmarked').toLowerCase();
      stageCounts[st] = (stageCounts[st] || 0) + 1;

      if (typeof e.fitScore === 'number') {
        totalFitScore += e.fitScore;
        scoredCount++;
      }
    }

    const appliedTotal = total - stageCounts.bookmarked;
    const interviewCount = stageCounts.screening + stageCounts.interviewing + stageCounts.offer + stageCounts.accepted;
    const interviewRate = appliedTotal > 0 ? Math.round((interviewCount / appliedTotal) * 100) : 0;
    const avgFitScore = scoredCount > 0 ? Math.round(totalFitScore / scoredCount) : null;

    return {
      totalApplications: total,
      activePipeline: total - stageCounts.rejected - stageCounts.withdrawn,
      stageBreakdown: stageCounts,
      interviewConversionRate: interviewRate,
      averageFitScore: avgFitScore
    };
  }
}

export default PipelineAnalytics;
