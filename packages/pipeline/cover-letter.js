/**
 * Career-Agents Pipeline · Strategic 3-Paragraph Cover Letter Generator
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

export class CoverLetterBuilder {
  /**
   * Generate an ATS-aligned, strategic 3-paragraph executive cover letter tailored to a role.
   */
  static generateCoverLetter({ candidate = {}, jobTitle = 'Software Engineer', companyName = 'Target Company', highlights = [], targetFocus = '' }) {
    const candidateName = candidate.name || 'Candidate Name';
    const email = candidate.email || 'candidate@example.com';
    const phone = candidate.phone || '';
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const focusText = targetFocus ? ` specifically around ${targetFocus},` : '';
    const evidenceText = highlights.length > 0
      ? ` In my recent work, I ${highlights.join('; additionally, I ')}.`
      : ' Throughout my career, I have prioritized high-throughput system reliability, clean domain modeling, and cross-functional velocity.';

    // Paragraph 1: Opening & Role Alignment
    const p1 = `I am writing to express my strong interest in the ${jobTitle} role at ${companyName}. Having closely tracked ${companyName}'s engineering milestones, I am eager to bring my background in distributed systems and scalable infrastructure${focusText} to your engineering team.`;

    // Paragraph 2: Core Technical Evidence & Proven Impact
    const p2 = `My technical background centers on designing robust, production-grade systems that deliver measurable performance improvements and business impact.${evidenceText} My experience aligns directly with the architectural rigor and high engineering bar required for this position.`;

    // Paragraph 3: Closing & Call-to-Action
    const p3 = `What excites me most about ${companyName} is your commitment to technical innovation and operational excellence. I would welcome the opportunity to discuss how my technical expertise can accelerate your team's upcoming product roadmap. Thank you for your time and consideration.`;

    return `${candidateName}\n${email}${phone ? ` • ${phone}` : ''}\n${date}\n\nDear Hiring Team at ${companyName},\n\n${p1}\n\n${p2}\n\n${p3}\n\nSincerely,\n${candidateName}`;
  }
}

export default CoverLetterBuilder;
