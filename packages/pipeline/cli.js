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
        console.log(`\n${c.yellow}Usage: career-agents pipeline scan <company-board-token> [greenhouse|lever|ashby|workable|smartrecruiters]${c.reset}\nExample: career-agents pipeline scan stripe greenhouse\n`);
        return;
      }
      console.log(`\n${c.cyan}Scanning ${atsType.toUpperCase()} board for '${boardToken}'...${c.reset}`);
      const res = await ATSScanner.scan(boardToken, atsType);

      if (!res.success) {
        console.log(`${c.yellow}Scanner warning: ${res.error || 'Failed to fetch jobs'}${c.reset}\n`);
      } else {
        console.log(`${c.green}✓ Discovered ${res.count} active roles via ${res.provider}:${c.reset}\n`);
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

    case 'cv': {
      const [profileArg = '', format = 'html'] = args;
      let profile = {
        name: 'Karthik Rajesh Shet',
        title: 'Senior Software Engineer',
        skills: ['TypeScript', 'JavaScript', 'Node.js', 'Python', 'React', 'Docker', 'Kubernetes', 'AWS', 'System Design'],
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            dates: '2023 - Present',
            location: 'Remote',
            bullets: [
              'Architected distributed microservices processing 50M+ requests daily with 99.99% uptime.',
              'Spearheaded performance optimizations reducing p99 API latency by 45%.'
            ]
          }
        ],
        education: [
          {
            degree: 'Bachelor of Engineering in Computer Science',
            institution: 'University of Technology',
            dates: '2019 - 2023',
            location: 'India'
          }
        ]
      };

      if (profileArg && fs.existsSync(profileArg)) {
        try {
          profile = JSON.parse(fs.readFileSync(profileArg, 'utf8'));
        } catch {
          // fallback
        }
      }

      if (format.toLowerCase() === 'latex' || format.toLowerCase() === 'tex') {
        const tex = CVBuilder.generateLaTeX(profile);
        const outPath = path.join(root, 'resume.tex');
        fs.writeFileSync(outPath, tex, 'utf8');
        console.log(`\n${c.green}✓ Generated LaTeX resume:${c.reset} ${outPath}\n`);
      } else {
        const html = CVBuilder.generateHTML(profile);
        const outPath = path.join(root, 'resume.html');
        fs.writeFileSync(outPath, html, 'utf8');
        console.log(`\n${c.green}✓ Generated HTML resume:${c.reset} ${outPath}\n`);
      }
      break;
    }

    case 'cover': {
      const [companyName = 'Acme Corp', role = 'Software Engineer'] = args;
      const letter = CoverLetterBuilder.generateCoverLetter({ companyName, jobTitle: role });
      console.log(`\n${c.bold}${c.cyan}=== Tailored Cover Letter Draft ===${c.reset}\n`);
      console.log(letter);
      break;
    }

    case 'interview': {
      const [company = 'Google', role = 'Software Engineer'] = args;
      const track = InterviewCoach.getCompanyTrack(company);
      const star = InterviewCoach.generateSTARBank([], role);
      console.log(`\n${c.bold}${c.cyan}=== STAR Interview Preparation & Question Bank ===${c.reset}`);
      console.log(`Target: ${company} · ${role}\n`);
      if (track) {
        console.log(`${c.bold}Company Overview:${c.reset} ${track.name || company} (${track.tier || 'Tier 1'})`);
        if (track.interview_stages) {
          console.log(`${c.bold}Interview Stages:${c.reset} ${track.interview_stages.join(' → ')}`);
        }
      }
      console.log(`\n${c.bold}Core STAR Question Scenarios:${c.reset}`);
      star.questions.forEach((q, i) => {
        console.log(`\n  ${i + 1}. [${q.category}] ${c.bold}${q.question}${c.reset}`);
        console.log(`     ${c.gray}Framework: ${q.framework}${c.reset}`);
      });
      console.log();
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

    case 'upskill': {
      const missingSkills = args.length > 0 ? args : ['Kubernetes', 'System Design', 'Go'];
      console.log(`\n${c.bold}${c.cyan}=== 30-Day Skill Gap Remediation Plan ===${c.reset}\n`);
      console.log(`Targeting missing competencies: ${missingSkills.join(', ')}\n`);
      console.log(`  ${c.bold}Week 1:${c.reset} Core fundamentals & Architecture theory (${missingSkills[0]})`);
      console.log(`  ${c.bold}Week 2:${c.reset} Hands-on production-grade mini project integrating ${missingSkills.slice(0, 2).join(' + ')}`);
      console.log(`  ${c.bold}Week 3:${c.reset} Observability, tracing, and stress testing`);
      console.log(`  ${c.bold}Week 4:${c.reset} Mock interview design exercise & GitHub portfolio documentation\n`);
      break;
    }

    case 'deep': {
      const [company = 'Google'] = args;
      const track = InterviewCoach.getCompanyTrack(company);
      console.log(`\n${c.bold}${c.cyan}=== Deep Company Architecture & Profile Analysis ===${c.reset}\n`);
      if (track) {
        console.log(`Company       : ${c.bold}${track.name || company}${c.reset}`);
        console.log(`Hiring Bar    : ${track.tier || 'High'}`);
        console.log(`Core Skills   : ${(track.required_skills || []).join(', ') || 'Distributed Systems, DSA'}`);
        console.log(`Culture Notes : ${track.culture || 'Strong focus on scalability, autonomy, and ownership.'}`);
      } else {
        console.log(`Company: ${company} (Standard tech analysis generated)`);
      }
      console.log();
      break;
    }

    case 'dedup': {
      const { DedupEngine } = await import('./dedup.js');
      const tracker = ApplicationTracker.load(trackerPath);
      const beforeCount = tracker.entries.length;
      tracker.entries = DedupEngine.deduplicate(tracker.entries);
      const afterCount = tracker.entries.length;
      tracker.save(trackerPath);
      console.log(`\n${c.green}✓ Deduplicated application pipeline:${c.reset} ${beforeCount} → ${afterCount} entries (removed ${beforeCount - afterCount} duplicates)\n`);
      break;
    }

    case 'doctor': {
      const { PipelineDoctor } = await import('./doctor.js');
      const doc = PipelineDoctor.runDiagnostics();
      console.log(`\n${c.bold}${c.cyan}=== Career-Agents Pipeline Diagnostics ===${c.reset}\n`);
      for (const chk of doc.checks) {
        const icon = chk.passed ? `${c.green}✓ PASS${c.reset}` : `${c.yellow}⚠ WARN${c.reset}`;
        console.log(`  [${icon}] ${chk.name}`);
      }
      console.log(`\nStatus: ${doc.passed ? `${c.green}All green${c.reset}` : `${c.yellow}Attention needed${c.reset}`}\n`);
      break;
    }

    case 'digest': {
      const { ReportGenerator } = await import('./report-generator.js');
      const tracker = ApplicationTracker.load(trackerPath);
      const digest = ReportGenerator.generateWeeklyDigest(tracker.entries);
      console.log(`\n${c.bold}${c.cyan}=== Pipeline Weekly Summary Digest ===${c.reset}\n`);
      console.log(digest);
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
  ${c.green}scan${c.reset}            Scan Greenhouse/Lever/Ashby/Workable/SmartRecruiters boards
  ${c.green}match${c.reset}           Evaluate candidate readiness against raw job description
  ${c.green}deep${c.reset}            Deep research company architecture & hiring tracks

${c.bold}Document Generation & Outreach:${c.reset}
  ${c.green}cv${c.reset}              Compile ATS single-page HTML or LaTeX resume
  ${c.green}cover${c.reset}           Generate tailored cover letter draft for target role
  ${c.green}interview${c.reset}       Generate behavioral & technical STAR question banks
  ${c.green}outreach${c.reset}        Generate high-converting recruiter networking messages
  ${c.green}upskill${c.reset}         Generate 30-day skill remediation roadmap
`);
}

export default { runCareerPipelineCLI };
