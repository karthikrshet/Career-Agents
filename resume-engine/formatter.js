/**
 * Formatting utilities for ATS Resumes
 */

export function cleanBullet(bullet) {
  if (!bullet) return '';
  let trimmed = bullet.trim();
  // Remove leading dash, asterisk, bullet point unicode
  trimmed = trimmed.replace(/^[\s\-*\u2022\u25E6\u2023\u2043]+/, '');
  // Capitalize first letter
  trimmed = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  // Ensure it ends with a period if it doesn't already
  if (!trimmed.endsWith('.')) {
    trimmed += '.';
  }
  return trimmed;
}

export function alignDate(duration) {
  if (!duration) return '';
  // Convert standard date ranges (e.g. 2021-2023 to 2021 - 2023)
  return duration.replace(/\s*-\s*/, ' - ').trim();
}

export function formatHeader(header, format = 'pipe') {
  if (!header) return '';
  const { name, phone, email, linkedin, github } = header;
  const parts = [];
  if (phone) parts.push(phone);
  if (email) parts.push(email);
  if (linkedin) parts.push(linkedin);
  if (github) parts.push(github);

  const delimiter = format === 'pipe' ? ' | ' : ' • ';
  return `# ${name}\n${parts.join(delimiter)}`;
}
