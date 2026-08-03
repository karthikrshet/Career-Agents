/**
 * Career-Agents Pipeline Engine · Interactive CLI Dispatcher
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ApplicationTracker } from './tracker.js';
import { ATSScanner } from './scanner.js';
import { JDMatcher } from './jd-matcher.js';
import { CVBuilder } from './cv-builder.js';
import { CoverLetterBuilder } from './cover-letter.js';
import { InterviewCoach } from './interview-prep.js';
import { OutreachGenerator } from './outreach.js';
import { PipelineAnalytics } from './analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  magenta: '\x1b[35m'
};

export async function runCareerPipelineCLI(subcommand, args = []) {
  if (!subcommand || subcommand === 'help' || subcommand === '--help' || subcommand === '-h') {
    printCareerPipelineHelp();
    return;
  }

  const trackerPath = path.join(root, 'pipeline-tracker.md');

  switch (subcommand) {
    case 'tracker':
    case 'list': {
      const tracker = ApplicationTracker.load(trackerPath);
      console.log(`\n${c.bold}${c.cyan}=== Career-Agents Application Pipeline Tracker ===${c.reset}\n`);
      if (tracker.entries.length === 0) {
        console.log(`${c.gray}No applications tracked yet. Add one with: career-agents pipeline add <company> <role>${c.reset}\n`);
      } else {
        console.log(tracker.toMarkdown());
        const stats = tracker.getStats();
        console.log(`${c.bold}Pipeline Summary:${c.reset} ${stats.total} total · ${stats.active} active · ${stats.interviewRate}% interview conversion\n`);
      }
      break;
    }

    case 'add': {
      const [company, role, link] = args;
      if (!company || !role) {
        console.log(`\n${c.yellow}Usage: career-agents pipeline add <company> <role> [job-url]${c.reset}\n`);
        return;
      }
      const tracker = ApplicationTracker.load(trackerPath);
      const entry = tracker.addEntry({
        company,
        role,
        status: 'applied',
        link: link || '',
        appliedDate: new Date().toISOString().split('T')[0]
      });
      tracker.save(trackerPath);
      console.log(`\n${c.green}✓ Added application:${c.reset} ${entry.company} - ${entry.role} (${entry.status})\nSaved to pipeline-tracker.md\n`);
      break;
    }

    case 'status': {
      const [company, newStatus, ...notes] = args;
      if (!company || !newStatus) {
        console.log(`\n${c.yellow}Usage: career-agents pipeline status <company> <new-status> [notes]${c.reset}\n`);
        return;
      }
      const tracker = ApplicationTracker.load(trackerPath);
      const updated = tracker.updateStatus(company, newStatus, notes.join(' '));
      if (!updated) {
        console.log(`\n${c.yellow}No application found for company '${company}'.${c.reset}\n`);
        return;
      }
      tracker.save(trackerPath);
      console.log(`\n${c.green}✓ Updated application status:${c.reset} ${updated.company} → ${updated.status}\n`);
      break;
    }

    case 'scan': {
      const [boardToken, atsType = 'greenhouse'] = args;
      if (!boardToken) {
        console.log(`\n${c.yellow}Usage: career-agents pipeline scan <company-board-token> [greenhouse|lever|ashby]${c.reset}\nExample: career-agents pipeline scan stripe greenhouse\n`);
        return;
      }
      console.log(`\n${c.cyan}Scanning ${atsType.toUpperCase()} board for '${boardToken}'...${c.reset}`);
      let res;
      if (atsType.toLowerCase() === 'lever') {
        res = await ATSScanner.scanLever(boardToken);
      } else if (atsType.toLowerCase() === 'ashby') {
        res = await ATSScanner.scanAshby(boardToken);
      } else {
        res = await ATSScanner.scanGreenhouse(boardToken);
      }

      if (!res.success) {
        console.log(`${c.yellow}Scanner warning: ${res.error || 'Failed to fetch jobs'}${c.reset}\n`);
      } else {
        console.log(`${c.green}✓ Discovered ${res.count} active roles:${c.reset}\n`);
        res.jobs.slice(0, 10).forEach((j, i) => {
          console.log(`  ${i + 1}. ${c.bold}${j.title}${c.reset} (${j.location || 'Remote'}) - ${c.gray}${j.url}${c.reset}`);
        });
        if (res.jobs.length > 10) {
          console.log(`  ${c.gray}... and ${res.jobs.length - 10} more roles.${c.reset}`);
        }
        console.log();
      }
      break;
    }

    case 'match': {
      const [filePath, company = 'Google', role = 'Software Engineer'] = args;
      let jdText = '';
      if (filePath && fs.existsSync(filePath)) {
        jdText = fs.readFileSync(filePath, 'utf8');
      } else if (filePath) {
        jdText = filePath;
      } else {
        console.log(`\n${c.yellow}Usage: career-agents pipeline match <jd-file-or-text> [company] [role]${c.reset}\n`);
        return;
      }

      const matchRes = JDMatcher.evaluateMatch({}, jdText, company, role);
      console.log(`\n${c.bold}${c.cyan}=== Job Requirement Readiness Match ===${c.reset}`);
      console.log(`Target: ${matchRes.company} · ${matchRes.role}`);
      console.log(`Readiness: ${matchRes.readinessScore !== null ? `${matchRes.readinessScore}%` : 'Provisional'}`);
      console.log(`Detected Skills: ${matchRes.extractedSkills.join(', ')}\n`);
      break;
    }

    case 'cover': {
      const [companyName = 'Acme Corp', role = 'Software Engineer'] = args;
      const letter = CoverLetterBuilder.generateCoverLetter({ companyName, jobTitle: role });
      console.log(`\n${c.bold}${c.cyan}=== Tailored Cover Letter Draft ===${c.reset}\n`);
      console.log(letter);
      break;
    }

    case 'outreach': {
      const [recipient = 'Engineering Manager', company = 'Google', role = 'Software Engineer'] = args;
      const note = OutreachGenerator.generateLinkedInNote({ recipientName: recipient, company, role });
      console.log(`\n${c.bold}${c.cyan}=== LinkedIn Recruiter Message Draft (Under 300 chars) ===${c.reset}\n`);
      console.log(`"${note}"\n(${note.length} characters)\n`);
      break;
    }

    case 'stats': {
      const tracker = ApplicationTracker.load(trackerPath);
      const stats = PipelineAnalytics.analyzePipeline(tracker.entries);
      console.log(`\n${c.bold}${c.cyan}=== Application Pipeline Performance Analytics ===${c.reset}\n`);
      console.log(`  Total Tracked Applications : ${c.bold}${stats.totalApplications}${c.reset}`);
      console.log(`  Active In-Flight Pipeline  : ${c.bold}${stats.activePipeline}${c.reset}`);
      console.log(`  Interview Conversion Rate  : ${c.bold}${c.green}${stats.interviewConversionRate}%${c.reset}`);
      console.log(`\n  ${c.bold}Funnel Stages:${c.reset}`);
      for (const [st, cnt] of Object.entries(stats.stageBreakdown)) {
        console.log(`    ${st.padEnd(14)} : ${cnt}`);
      }
      console.log();
      break;
    }

    default:
      printCareerPipelineHelp();
      break;
  }
}

function printCareerPipelineHelp() {
  console.log(`
${c.bold}${c.cyan}====================================================${c.reset}
${c.bold} Career-Agents · Job Search & Application Pipeline${c.reset}
${c.gray} Copyright (c) 2026 Karthik Rajesh Shet · MIT License${c.reset}
${c.bold}${c.cyan}====================================================${c.reset}

${c.bold}Usage:${c.reset}
  career-agents pipeline <subcommand> [options]

${c.bold}Application Tracking & Pipeline:${c.reset}
  ${c.green}tracker${c.reset}         Display live application pipeline statuses
  ${c.green}add${c.reset}             Add new target job entry to application tracker
  ${c.green}status${c.reset}          Update application status (applied, interview, offer, etc.)
  ${c.green}stats${c.reset}           Display pipeline funnel performance statistics

${c.bold}ATS Portals & Discovery:${c.reset}
  ${c.green}scan${c.reset}            Scan Greenhouse/Lever/Ashby ATS boards for new roles
  ${c.green}match${c.reset}           Evaluate candidate readiness against raw job description

${c.bold}Document Generation & Outreach:${c.reset}
  ${c.green}cover${c.reset}           Generate tailored cover letter draft for target role
  ${c.green}outreach${c.reset}        Generate high-converting recruiter networking messages
`);
}

export default { runCareerPipelineCLI };
