/**
 * Career-Agents Pipeline · Recruiter & Hiring Manager Outreach
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

export class OutreachGenerator {
  /**
   * Generate concise, high-converting LinkedIn networking messages (strictly under 300 characters).
   */
  static generateLinkedInNote({ candidateName = 'Engineer', recipientName = '', company = 'Target Company', role = 'Software Engineer' } = {}) {
    const greeting = recipientName && recipientName.trim() ? `Hi ${recipientName.trim()},` : `Hi,`;
    let note = `${greeting} I noticed your work building ${company}'s engineering team. With hands-on experience in distributed systems and cloud architecture, I recently applied for the ${role} role and would love to connect. Best, ${candidateName}`;

    if (note.length > 299) {
      // Compress intelligently
      note = `${greeting} I noticed your work at ${company}. Having applied for the ${role} position with a strong background in scalable systems, I'd love to connect. Best, ${candidateName}`;
    }

    if (note.length > 299) {
      note = note.slice(0, 285) + `... Best, ${candidateName}`;
    }

    return note;
  }

  /**
   * Generate formal follow-up emails for active applications.
   */
  static generateFollowUpEmail({ candidateName = 'Candidate', company = 'Company', role = 'Software Engineer', appliedDate = 'recently' } = {}) {
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
