import fs from 'fs';
import path from 'path';
import { cleanBullet, alignDate, formatHeader } from './formatter.js';

export function generateResumeMarkdown(data) {
  const headerStr = formatHeader(data.header, 'pipe');
  
  let md = `${headerStr}\n\n`;
  
  if (data.summary) {
    md += `## Professional Summary\n${data.summary.trim()}\n\n`;
  }
  
  md += `## Work Experience\n\n`;
  data.experience.forEach(job => {
    md += `### ${job.role}\n`;
    md += `**${job.company}** | ${job.location || ''} | ${alignDate(job.duration)}\n`;
    job.bullets.forEach(b => {
      md += `- ${cleanBullet(b)}\n`;
    });
    md += `\n`;
  });
  
  if (data.projects && data.projects.length > 0) {
    md += `## Personal Projects\n\n`;
    data.projects.forEach(proj => {
      md += `### ${proj.name}\n`;
      if (proj.tech_stack) {
        md += `*Technologies used: ${proj.tech_stack}*\n`;
      }
      proj.bullets.forEach(b => {
        md += `- ${cleanBullet(b)}\n`;
      });
      md += `\n`;
    });
  }
  
  md += `## Technical Skills\n${data.skills.join(', ')}\n\n`;
  
  md += `## Education\n\n`;
  data.education.forEach(edu => {
    md += `**${edu.degree}**\n`;
    md += `${edu.institution} | ${edu.location || ''} | ${alignDate(edu.duration)}`;
    if (edu.gpa) {
      md += ` (GPA: ${edu.gpa})`;
    }
    md += `\n\n`;
  });
  
  if (data.certifications && data.certifications.length > 0) {
    md += `## Certifications\n`;
    data.certifications.forEach(cert => {
      md += `- ${cert.trim()}\n`;
    });
    md += `\n`;
  }
  
  if (data.achievements && data.achievements.length > 0) {
    md += `## Achievements\n`;
    data.achievements.forEach(ach => {
      md += `- ${ach.trim()}\n`;
    });
    md += `\n`;
  }
  
  return md;
}

export function generateResumeText(data) {
  const headerStr = formatHeader(data.header, 'bullet');
  let txt = `${data.header.name.toUpperCase()}\n`;
  txt += `${data.header.phone || ''}  ${data.header.email || ''}\n`;
  txt += `${data.header.linkedin || ''}  ${data.header.github || ''}\n\n`;
  txt += `======================================================================\n\n`;
  
  if (data.summary) {
    txt += `PROFESSIONAL SUMMARY\n`;
    txt += `--------------------\n`;
    txt += `${data.summary.trim()}\n\n`;
  }
  
  txt += `WORK EXPERIENCE\n`;
  txt += `---------------\n`;
  data.experience.forEach(job => {
    txt += `${job.role.toUpperCase()}\n`;
    txt += `${job.company} - ${job.location || ''} (${alignDate(job.duration)})\n`;
    job.bullets.forEach(b => {
      txt += `* ${cleanBullet(b)}\n`;
    });
    txt += `\n`;
  });
  
  if (data.projects && data.projects.length > 0) {
    txt += `PERSONAL PROJECTS\n`;
    txt += `-----------------\n`;
    data.projects.forEach(proj => {
      txt += `${proj.name.toUpperCase()}\n`;
      if (proj.tech_stack) {
        txt += `Tech: ${proj.tech_stack}\n`;
      }
      proj.bullets.forEach(b => {
        txt += `* ${cleanBullet(b)}\n`;
      });
      txt += `\n`;
    });
  }
  
  txt += `TECHNICAL SKILLS\n`;
  txt += `----------------\n`;
  txt += `${data.skills.join(', ')}\n\n`;
  
  txt += `EDUCATION\n`;
  txt += `---------\n`;
  data.education.forEach(edu => {
    txt += `${edu.degree}\n`;
    txt += `${edu.institution} - ${edu.location || ''} (${alignDate(edu.duration)})`;
    if (edu.gpa) {
      txt += ` (GPA: ${edu.gpa})`;
    }
    txt += `\n\n`;
  });
  
  if (data.certifications && data.certifications.length > 0) {
    txt += `CERTIFICATIONS\n`;
    txt += `--------------\n`;
    data.certifications.forEach(cert => {
      txt += `- ${cert.trim()}\n`;
    });
    txt += `\n`;
  }
  
  if (data.achievements && data.achievements.length > 0) {
    txt += `ACHIEVEMENTS\n`;
    txt += `------------\n`;
    data.achievements.forEach(ach => {
      txt += `- ${ach.trim()}\n`;
    });
    txt += `\n`;
  }
  
  return txt;
}
