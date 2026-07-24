import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = process.cwd();

const reportFiles = [
  'BUILD_REPORT.md',
  'CODEQL_FIX_REPORT.md',
  'CODEQL_REPORT.md',
  'DEPLOYMENT_REPORT.md',
  'DOCUMENTATION_AUDIT.md',
  'FINAL_RELEASE_REPORT.md',
  'PERFORMANCE_REPORT.md',
  'QUALITY_REPORT.md',
  'SECURITY_ARCHITECTURE.md',
  'SECURITY_AUDIT.md',
  'SECURITY_CHANGELOG.md',
  'SECURITY_CHECKLIST.md',
  'SECURITY_HARDENING_REPORT.md',
  'SECURITY_TESTING.md',
  'ARCHITECTURE_V4.md'
];

fs.mkdirSync(path.join(root, 'docs', 'reports'), { recursive: true });
fs.mkdirSync(path.join(root, 'docs', 'releases'), { recursive: true });
fs.mkdirSync(path.join(root, 'docs', 'roadmap'), { recursive: true });

for (const file of reportFiles) {
  const src = path.join(root, file);
  const dest = path.join(root, 'docs', 'reports', file);
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
    try {
      execSync(`git rm --cached --ignore-unmatch "${file}"`, { stdio: 'ignore' });
      execSync(`git add "docs/reports/${file}"`, { stdio: 'ignore' });
    } catch (_) {}
    console.log(`Moved ${file} -> docs/reports/${file}`);
  }
}

if (fs.existsSync(path.join(root, 'ROADMAP_V4.md'))) {
  const src = path.join(root, 'ROADMAP_V4.md');
  const dest = path.join(root, 'docs', 'roadmap', 'ROADMAP_V4.md');
  fs.renameSync(src, dest);
  try {
    execSync('git rm --cached --ignore-unmatch "ROADMAP_V4.md"', { stdio: 'ignore' });
    execSync('git add "docs/roadmap/ROADMAP_V4.md"', { stdio: 'ignore' });
  } catch (_) {}
  console.log('Moved ROADMAP_V4.md -> docs/roadmap/ROADMAP_V4.md');
}

if (fs.existsSync(path.join(root, 'CHANGELOG_v4.0.0.md'))) {
  const src = path.join(root, 'CHANGELOG_v4.0.0.md');
  const dest = path.join(root, 'docs', 'releases', 'CHANGELOG_v4.0.0.md');
  fs.renameSync(src, dest);
  try {
    execSync('git rm --cached --ignore-unmatch "CHANGELOG_v4.0.0.md"', { stdio: 'ignore' });
    execSync('git add "docs/releases/CHANGELOG_v4.0.0.md"', { stdio: 'ignore' });
  } catch (_) {}
  console.log('Moved CHANGELOG_v4.0.0.md -> docs/releases/CHANGELOG_v4.0.0.md');
}

if (fs.existsSync(path.join(root, 'career-agents-3.0.0.tgz'))) {
  fs.unlinkSync(path.join(root, 'career-agents-3.0.0.tgz'));
  console.log('Removed career-agents-3.0.0.tgz tarball from root');
}

console.log('Root directory cleanup completed successfully!');
