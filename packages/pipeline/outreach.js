/**
 * Career-Agents Pipeline · Recruiter & Hiring Manager Outreach
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

export class OutreachGenerator {
  /**
   * Generate concise, high-converting LinkedIn networking messages (under 300 characters).
   */
  static generateLinkedInNote({ candidateName = 'Engineer', recipientName = 'Hiring Lead', company = 'Target Company', role = 'Software Engineer' }) {
    return `Hi ${recipientName}, I noticed your work building ${company}'s engineering team. With hands-on experience in distributed systems and cloud architecture, I recently applied for the ${role} role and would love to connect. Best, ${candidateName}`;
  }

  /**
   * Generate formal follow-up emails for active applications.
   */
  static generateFollowUpEmail({ candidateName = 'Candidate', company = 'Company', role = 'Software Engineer', appliedDate = 'last week' }) {
    return `Subject: Following up on ${role} application - ${candidateName}

Dear Hiring Team at ${company},

I hope this note finds you well.

I am writing to briefly follow up on my application for the ${role} position submitted ${appliedDate}. I remain very enthusiastic about ${company}'s engineering mission and would welcome the opportunity to discuss how my technical background can support your roadmap.

Please let me know if there are any additional materials or details I can provide.

Thank you again for your time and consideration.

Best regards,

${candidateName}
`;
  }
}

export default OutreachGenerator;
