import fs from 'fs';
import path from 'path';

// Optional import of pdf-parse with safe fallback
let pdfParser = null;
try {
  pdfParser = (await import('pdf-parse')).default;
} catch (e) {
  // Ignored, will use fallback binary parser
}

/**
 * Extracts printable ASCII/UTF-8 character sequences from a PDF buffer as a robust fallback
 */
function extractTextFromPdfBinary(buffer) {
  let text = '';
  for (let i = 0; i < buffer.length; i++) {
    const char = buffer[i];
    if ((char >= 32 && char <= 126) || char === 10 || char === 13 || char === 9) {
      text += String.fromCharCode(char);
    } else if (char > 127) {
      text += String.fromCharCode(char);
    } else {
      text += ' ';
    }
  }
  text = text.replace(/\/[\w]+/g, ' ');
  text = text.replace(/\([\s\S]*?\)/g, (m) => m.slice(1, -1));
  text = text.replace(/\[[\s\S]*?\]/g, (m) => m.slice(1, -1));
  text = text.replace(/\b(stream|endstream|xref|trailer|startxref|obj|endobj)\b/gi, ' ');
  return text;
}

/**
 * Parse Markdown/TXT lines into a structured JSON resume format
 */
function parseTextResume(text) {
  const lines = text.split('\n').map(l => l.trim());
  const resume = {
    header: { name: 'Resume Candidate', email: '', phone: '', linkedin: '', github: '' },
    summary: '',
    experience: [],
    projects: [],
    skills: [],
    education: []
  };

  let currentSection = '';
  let currentJob = null;
  let currentProject = null;
  let currentEdu = null;

  // Simple parsing heuristics
  let nonEmptyLineCount = 0;
  let headerEnded = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // Check if we hit a section header
    const lineLower = line.toLowerCase();
    const isSectionHeader = line.startsWith('#') || 
                            lineLower.includes('summary') || 
                            lineLower.includes('objective') || 
                            lineLower.match(/^(work|professional)?\s*experience/) || 
                            lineLower.includes('employment history') || 
                            lineLower.includes('project') || 
                            lineLower.includes('skill') || 
                            lineLower.includes('expertise') || 
                            lineLower.includes('technologies') || 
                            lineLower.includes('education') || 
                            lineLower.includes('academic');

    if (isSectionHeader) {
      headerEnded = true;
    }

    // Contact info detection in header
    if (!headerEnded && nonEmptyLineCount < 5) {
      if (line.includes('@')) resume.header.email = line.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || line;
      else if (line.match(/\+?\d[\d\s-]{7,}/)) resume.header.phone = line.match(/\+?\d[\d\s-]{7,}/)?.[0] || line;
      else if (line.toLowerCase().includes('linkedin.com')) resume.header.linkedin = line;
      else if (line.toLowerCase().includes('github.com')) resume.header.github = line;
      else if (nonEmptyLineCount === 0 && !line.includes('@')) resume.header.name = line;
      nonEmptyLineCount++;
      continue;
    }

    // Section detection
    const cleanLineLower = lineLower.replace(/^#+\s*|^\*+\s*|^-\s*/, '').trim();
    if (cleanLineLower.includes('summary') || cleanLineLower.includes('objective') || cleanLineLower.match(/^about\s+me/)) {
      currentSection = 'summary';
      continue;
    } else if (cleanLineLower.match(/^(work|professional)?\s*experience/) || cleanLineLower.includes('employment history')) {
      currentSection = 'experience';
      continue;
    } else if (cleanLineLower.includes('project')) {
      currentSection = 'projects';
      continue;
    } else if (cleanLineLower.includes('skill') || cleanLineLower.includes('expertise') || cleanLineLower.includes('technologies')) {
      currentSection = 'skills';
      continue;
    } else if (cleanLineLower.includes('education') || cleanLineLower.includes('academic')) {
      currentSection = 'education';
      continue;
    }

    // Add content to sections
    if (currentSection === 'summary') {
      resume.summary += (resume.summary ? ' ' : '') + line;
    } else if (currentSection === 'skills') {
      const parts = line.split(/[,|;]|\s{2,}/).map(s => s.trim()).filter(Boolean);
      parts.forEach(p => {
        if (!resume.skills.includes(p) && p.length < 30) {
          resume.skills.push(p);
        }
      });
    } else if (currentSection === 'experience') {
      if (line.startsWith('-') || line.startsWith('*') || line.startsWith('•')) {
        if (currentJob) {
          currentJob.bullets.push(line.replace(/^[-*•\s]+/, '').trim());
        }
      } else {
        const durationMatch = line.match(/\(([^)]+)\)/) || line.match(/(\d{4}\s*-\s*(?:Present|\d{4}))/i);
        const duration = durationMatch ? durationMatch[1] : 'Duration N/A';
        const cleanLine = line.replace(/\([^)]+\)/g, '').trim();
        const parts = cleanLine.split(/at| - |,/).map(s => s.trim());
        
        currentJob = {
          role: parts[0] || 'Software Engineer',
          company: parts[1] || 'Company',
          duration: duration,
          bullets: []
        };
        resume.experience.push(currentJob);
      }
    } else if (currentSection === 'projects') {
      if (line.startsWith('-') || line.startsWith('*') || line.startsWith('•')) {
        if (currentProject) {
          currentProject.bullets.push(line.replace(/^[-*•\s]+/, '').trim());
        }
      } else {
        const name = line.replace(/^#+\s*/, '').trim();
        currentProject = {
          name: name,
          bullets: []
        };
        resume.projects.push(currentProject);
      }
    } else if (currentSection === 'education') {
      if (!line.startsWith('-') && !line.startsWith('*') && !line.startsWith('•')) {
        const durationMatch = line.match(/\(([^)]+)\)/) || line.match(/(\d{4}\s*-\s*\d{4})/);
        const duration = durationMatch ? durationMatch[1] : 'Duration N/A';
        const cleanLine = line.replace(/\([^)]+\)/g, '').trim();
        const parts = cleanLine.split(/from|,| - /).map(s => s.trim());
        
        currentEdu = {
          degree: parts[0] || 'Degree',
          institution: parts[1] || 'University',
          duration: duration
        };
        resume.education.push(currentEdu);
      }
    }
  }

  if (resume.skills.length === 0) {
    const COMMON_SKILLS = ['React', 'Next.js', 'Node.js', 'Express', 'Python', 'Go', 'Java', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'TypeScript', 'JavaScript'];
    COMMON_SKILLS.forEach(s => {
      const regex = new RegExp(`\\b${s.replace('.', '\\.')}\\b`, 'i');
      if (regex.test(text)) {
        resume.skills.push(s);
      }
    });
  }

  return resume;
}

/**
 * Main parser entry point
 */
export async function parseResumeFile(filePath) {
  if (!filePath) {
    throw new Error('No resume file path provided.');
  }

  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const ext = path.extname(resolved).toLowerCase();
  
  if (ext === '.json') {
    const raw = fs.readFileSync(resolved, 'utf8');
    return JSON.parse(raw);
  }

  if (ext === '.txt' || ext === '.md') {
    const raw = fs.readFileSync(resolved, 'utf8');
    return parseTextResume(raw);
  }

  if (ext === '.pdf') {
    const buffer = fs.readFileSync(resolved);
    let text = '';
    
    if (pdfParser) {
      try {
        const parsed = await pdfParser(buffer);
        text = parsed.text;
      } catch (err) {
        text = extractTextFromPdfBinary(buffer);
      }
    } else {
      text = extractTextFromPdfBinary(buffer);
    }
    
    return parseTextResume(text);
  }

  throw new Error(`Unsupported file extension: ${ext}. Support only .json, .txt, .md, and .pdf files.`);
}
