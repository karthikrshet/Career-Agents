/**
 * Career-Agents Pipeline · Strategic Cover Letter Generator
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

export class CoverLetterBuilder {
  /**
   * Generate an ATS-aligned, strategic cover letter tailored to a role.
   */
  static generateCoverLetter({ candidate = {}, jobTitle = 'Software Engineer', companyName = 'Target Company', highlights = [] }) {
    const candidateName = candidate.name || 'Candidate Name';
    const email = candidate.email || 'candidate@example.com';
    const phone = candidate.phone || '';
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const keyAchievements = highlights.length > 0
      ? highlights.map(h => `- ${h}`).join('\n')
      : `- Spearheaded high-reliability distributed features scaling to high traffic volume.\n- Partnered with product and engineering leads to accelerate deliverable velocity.`;

    return `${candidateName}
${email}${phone ? ` • ${phone}` : ''}
${date}

Hiring Team
${companyName}

Dear Hiring Team at ${companyName},

I am writing to express my strong enthusiasm for the ${jobTitle} opportunity at ${companyName}. Having followed ${companyName}'s recent milestones and engineering standards, I am eager to contribute my technical background and problem-solving experience to your team.

Throughout my career, I have focused on building scalable, maintainable architectures and delivering measurable business outcomes. Key highlights of my experience that align directly with ${companyName}'s needs include:

${keyAchievements}

What excites me most about ${companyName} is the commitment to technical excellence and product innovation. I would welcome the opportunity to discuss how my skill set and passion can support your team's upcoming roadmap.

Thank you for your time and consideration.

Sincerely,

${candidateName}
`;
  }
}

export default CoverLetterBuilder;
