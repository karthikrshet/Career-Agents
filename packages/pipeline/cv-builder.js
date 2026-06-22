/**
 * Career-Agents Pipeline · ATS CV & Document Builder
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

export class CVBuilder {
  /**
   * Compile candidate profile data into an ATS-friendly, clean HTML resume.
   */
  static generateHTML(profile, options = {}) {
    const p = profile || {};
    const name = p.name || 'Candidate Name';
    const title = p.title || 'Software Engineer';
    const email = p.email || '';
    const phone = p.phone || '';
    const location = p.location || '';
    const linkedin = p.linkedin || '';
    const github = p.github || '';
    const summary = p.summary || '';
    const skills = Array.isArray(p.skills) ? p.skills : [];
    const experience = Array.isArray(p.experience) ? p.experience : [];
    const education = Array.isArray(p.education) ? p.education : [];
    const projects = Array.isArray(p.projects) ? p.projects : [];

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${name} - Resume</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
      line-height: 1.5;
      margin: 0;
      padding: 32px;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
    h1 { font-size: 26px; margin: 0 0 4px 0; color: #111827; font-weight: 700; }
    h2 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1.5px solid #111827; padding-bottom: 3px; margin: 20px 0 10px 0; color: #111827; }
    .subtitle { font-size: 16px; color: #4b5563; margin-bottom: 8px; font-weight: 500; }
    .contact-bar { font-size: 13px; color: #4b5563; margin-bottom: 16px; }
    .contact-bar span { margin-right: 12px; }
    .summary { font-size: 13.5px; margin-bottom: 16px; color: #374151; }
    .item { margin-bottom: 14px; }
    .item-header { display: flex; justify-content: space-between; font-weight: 600; font-size: 14px; color: #111827; }
    .item-sub { display: flex; justify-content: space-between; font-size: 13px; color: #4b5563; font-style: italic; margin-bottom: 4px; }
    ul { margin: 4px 0 8px 18px; padding: 0; font-size: 13px; color: #374151; }
    li { margin-bottom: 3px; }
    .skills-grid { font-size: 13px; color: #374151; }
  </style>
</head>
<body>
  <header>
    <h1>${name}</h1>
    <div class="subtitle">${title}</div>
    <div class="contact-bar">
      ${location ? `<span>📍 ${location}</span>` : ''}
      ${email ? `<span>✉️ ${email}</span>` : ''}
      ${phone ? `<span>📞 ${phone}</span>` : ''}
      ${linkedin ? `<span>🔗 ${linkedin}</span>` : ''}
      ${github ? `<span>💻 ${github}</span>` : ''}
    </div>
  </header>

  ${summary ? `
  <section>
    <h2>Professional Summary</h2>
    <div class="summary">${summary}</div>
  </section>` : ''}

  ${skills.length ? `
  <section>
    <h2>Core Competencies & Technical Skills</h2>
    <div class="skills-grid">${skills.join(' • ')}</div>
  </section>` : ''}

  ${experience.length ? `
  <section>
    <h2>Professional Experience</h2>
    ${experience.map(exp => `
      <div class="item">
        <div class="item-header">
          <span>${exp.title || 'Role'}</span>
          <span>${exp.dates || ''}</span>
        </div>
        <div class="item-sub">
          <span>${exp.company || 'Company'}</span>
          <span>${exp.location || ''}</span>
        </div>
        ${exp.bullets && exp.bullets.length ? `
          <ul>
            ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('')}
  </section>` : ''}

  ${projects.length ? `
  <section>
    <h2>Featured Projects</h2>
    ${projects.map(proj => `
      <div class="item">
        <div class="item-header">
          <span>${proj.name || 'Project'}</span>
          <span>${proj.technologies ? proj.technologies.join(', ') : ''}</span>
        </div>
        <ul>
          ${(proj.bullets || [proj.description || '']).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
  </section>` : ''}

  ${education.length ? `
  <section>
    <h2>Education</h2>
    ${education.map(edu => `
      <div class="item">
        <div class="item-header">
          <span>${edu.degree || 'Degree'}</span>
          <span>${edu.dates || ''}</span>
        </div>
        <div class="item-sub">
          <span>${edu.institution || 'University'}</span>
          <span>${edu.location || ''}</span>
        </div>
      </div>
    `).join('')}
  </section>` : ''}
</body>
</html>`;
  }

  /**
   * Compile candidate profile data into an Overleaf/LaTeX compatible format.
   */
  static generateLaTeX(profile) {
    const p = profile || {};
    const name = p.name || 'Candidate Name';
    const email = p.email || '';
    const phone = p.phone || '';
    const linkedin = p.linkedin || '';
    const github = p.github || '';

    return `% Career-Agents ATS LaTeX Template
% Copyright (c) 2026 Karthik Rajesh Shet · MIT License
\\documentclass[letterpaper,10pt]{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}

\\pagestyle{empty}
\\setlist{nosep}

\\begin{document}

\\begin{center}
    {\\LARGE \\textbf{${name}}} \\\\[4pt]
    ${[email, phone, linkedin, github].filter(Boolean).join(' $|$ ')}
\\end{center}

\\section*{Technical Skills}
\\textbf{Core Competencies:} ${(p.skills || []).join(', ')}

\\section*{Experience}
${(p.experience || []).map(exp => `
\\textbf{${exp.title || 'Role'}} \\hfill ${exp.dates || ''} \\\\
\\textit{${exp.company || 'Company'}} \\hfill ${exp.location || ''}
\\begin{itemize}
${(exp.bullets || []).map(b => `    \\item ${b}`).join('\n')}
\\end{itemize}
`).join('\n')}

\\section*{Education}
${(p.education || []).map(edu => `
\\textbf{${edu.institution || 'Institution'}} \\hfill ${edu.dates || ''} \\\\
${edu.degree || 'Degree'}
`).join('\n')}

\\end{document}
`;
  }
}

export default CVBuilder;
