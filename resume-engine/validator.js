/**
 * Resume JSON Validator
 */
export function validateResume(data) {
  const errors = [];

  if (!data) {
    return { valid: false, errors: ['Resume data is empty'] };
  }

  // Header Validation
  if (!data.header) {
    errors.push('Missing "header" section');
  } else {
    if (!data.header.name) errors.push('Missing "header.name"');
    if (!data.header.email) errors.push('Missing "header.email"');
    if (!data.header.phone) errors.push('Missing "header.phone"');
  }

  // Summary Validation
  if (data.summary === undefined || data.summary === null) {
    errors.push('Missing "summary" section');
  } else if (typeof data.summary !== 'string') {
    errors.push('"summary" must be a string');
  }

  // Experience Validation
  if (!data.experience) {
    errors.push('Missing "experience" section');
  } else if (!Array.isArray(data.experience)) {
    errors.push('"experience" must be an array');
  } else {
    data.experience.forEach((job, idx) => {
      if (!job.role) errors.push(`experience[${idx}] missing "role"`);
      if (!job.company) errors.push(`experience[${idx}] missing "company"`);
      if (!job.duration) errors.push(`experience[${idx}] missing "duration"`);
      if (!job.bullets || !Array.isArray(job.bullets) || job.bullets.length === 0) {
        errors.push(`experience[${idx}] "bullets" must be a non-empty array`);
      }
    });
  }

  // Projects Validation
  if (data.projects) {
    if (!Array.isArray(data.projects)) {
      errors.push('"projects" must be an array');
    } else {
      data.projects.forEach((proj, idx) => {
        if (!proj.name) errors.push(`projects[${idx}] missing "name"`);
        if (!proj.bullets || !Array.isArray(proj.bullets) || proj.bullets.length === 0) {
          errors.push(`projects[${idx}] "bullets" must be a non-empty array`);
        }
      });
    }
  }

  // Skills Validation
  if (!data.skills) {
    errors.push('Missing "skills" section');
  } else if (!Array.isArray(data.skills)) {
    errors.push('"skills" must be an array');
  } else if (data.skills.length === 0) {
    errors.push('"skills" must not be empty');
  }

  // Education Validation
  if (!data.education) {
    errors.push('Missing "education" section');
  } else if (!Array.isArray(data.education)) {
    errors.push('"education" must be an array');
  } else {
    data.education.forEach((edu, idx) => {
      if (!edu.degree) errors.push(`education[${idx}] missing "degree"`);
      if (!edu.institution) errors.push(`education[${idx}] missing "institution"`);
      if (!edu.duration) errors.push(`education[${idx}] missing "duration"`);
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
