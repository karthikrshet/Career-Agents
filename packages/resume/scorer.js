import fs from 'fs';
import path from 'path';

const ACTION_VERBS = [
  'designed', 'shipped', 'built', 'implemented', 'optimized', 'led', 'architected',
  'reduced', 'increased', 'developed', 'collaborated', 'scaled', 'managed',
  'refactored', 'integrated', 'delivered', 'automated', 'triage', 'migrated'
];

export function scoreResumeData(data) {
  if (!data) return null;

  const recommendations = [];
  let scoreFormatting = 0;
  let scoreKeywords = 0;
  let scoreExperience = 0;
  let scoreImpact = 0;

  // 1. Formatting & Section Completeness (Max 25)
  const coreSections = ['header', 'summary', 'experience', 'skills', 'education'];
  coreSections.forEach(s => {
    if (data[s]) {
      scoreFormatting += 5;
    } else {
      recommendations.push(`Add a missing core section: "${s}"`);
    }
  });

  if (data.header) {
    const contactKeys = ['phone', 'email', 'linkedin', 'github'];
    contactKeys.forEach(k => {
      if (!data.header[k]) {
        recommendations.push(`Include "${k}" in the header contact details`);
      }
    });
  }

  // 2. Keywords & Skills Density (Max 25)
  const skillsCount = data.skills ? data.skills.length : 0;
  if (skillsCount === 0) {
    recommendations.push('List your technical skills to improve ATS indexing score');
  } else if (skillsCount < 5) {
    scoreKeywords = skillsCount * 4;
    recommendations.push('Expand your skills profile; include more tools and languages relevant to your role');
  } else {
    scoreKeywords = Math.min(25, 12 + (skillsCount * 1.5));
  }

  // 3. Experience Detail & Depth (Max 25)
  if (!data.experience || data.experience.length === 0) {
    recommendations.push('Add work experience bullets detailing previous deliverables');
  } else {
    const jobsCount = data.experience.length;
    let totalBullets = 0;
    data.experience.forEach(job => {
      totalBullets += job.bullets ? job.bullets.length : 0;
    });

    const avgBullets = totalBullets / jobsCount;
    if (avgBullets < 3) {
      scoreExperience = Math.min(25, jobsCount * 6 + avgBullets * 3);
      recommendations.push('Write at least 3 detailed accomplishment bullets for each job role');
    } else {
      scoreExperience = Math.min(25, 15 + (avgBullets * 2.5));
    }
  }

  // 4. Impact Statements & Quantifiable Metrics (Max 25)
  let metricBulletsCount = 0;
  let actionVerbCount = 0;
  let totalBulletsChecked = 0;

  const checkText = (text) => {
    totalBulletsChecked++;
    if (/\b\d+\b|%|\$/.test(text)) {
      metricBulletsCount++;
    }
    const words = text.toLowerCase().split(/\s+/);
    if (words.some(w => ACTION_VERBS.includes(w))) {
      actionVerbCount++;
    }
  };

  if (data.experience) {
    data.experience.forEach(job => {
      if (job.bullets) job.bullets.forEach(checkText);
    });
  }
  if (data.projects) {
    data.projects.forEach(proj => {
      if (proj.bullets) proj.bullets.forEach(checkText);
    });
  }

  if (totalBulletsChecked > 0) {
    const metricRatio = metricBulletsCount / totalBulletsChecked;
    const verbRatio = actionVerbCount / totalBulletsChecked;

    scoreImpact += Math.round(metricRatio * 15);
    scoreImpact += Math.round(verbRatio * 10);

    if (metricRatio < 0.4) {
      recommendations.push('Quantify your impact. Add metrics (%, $, numbers) to at least 40% of your experience bullets');
    }
    if (verbRatio < 0.6) {
      recommendations.push('Use strong, action-oriented verbs (e.g. designed, shipped, automated) at the start of your bullets');
    }
  } else {
    recommendations.push('Ensure achievements list strong action verbs and quantified metric outcomes');
  }

  const overallScore = scoreFormatting + scoreKeywords + scoreExperience + scoreImpact;

  return {
    overallScore,
    subscores: {
      formatting: scoreFormatting,
      keywords: scoreKeywords,
      experience: scoreExperience,
      impact: scoreImpact
    },
    recommendations: recommendations.length > 0 ? recommendations : ['Excellent! Your resume complies with high-performance ATS indexing rules.']
  };
}
