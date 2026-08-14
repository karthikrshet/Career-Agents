/**
 * Career-Agents Pipeline · Weekly Digest & Assessment Report Generator
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

import { PipelineAnalytics } from './analytics.js';

export class ReportGenerator {
  /**
   * Generate formatted Markdown weekly summary digest of application pipeline activity.
   */
  static generateWeeklyDigest(trackerEntries = []) {
    const stats = PipelineAnalytics.analyzePipeline(trackerEntries);
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    let md = `# Career Pipeline Weekly Digest · ${date}\n\n`;
    md += `## Funnel Highlights\n\n`;
    md += `- **Total Applications Tracked**: ${stats.totalApplications}\n`;
    md += `- **Active In-Flight Pipeline**: ${stats.activePipeline}\n`;
    md += `- **Interview Conversion Rate**: ${stats.interviewConversionRate}%\n`;
    if (stats.averageFitScore) {
      md += `- **Average Candidate Fit Score**: ${stats.averageFitScore}%\n`;
    }
    md += `\n## Stage Breakdown\n\n`;
    md += `| Stage | Count |\n|---|---|\n`;
    for (const [st, cnt] of Object.entries(stats.stageBreakdown)) {
      md += `| ${st.charAt(0).toUpperCase() + st.slice(1)} | ${cnt} |\n`;
    }

    md += `\n## Action Items for Next Week\n\n`;
    md += `1. Follow up on applications in 'Applied' status older than 7 days.\n`;
    md += `2. Prepare STAR question bank scenarios for upcoming technical screens.\n`;
    md += `3. Scan ATS boards for new high-match engineering roles.\n`;

    return md;
  }
}

export default ReportGenerator;
