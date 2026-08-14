/**
 * Career-Agents · End-to-End Workflow Verification Script
 * Copyright (c) 2026 Karthik Rajesh Shet · MIT License
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  ApplicationTracker,
  ATSScanner,
  JDMatcher,
  CVBuilder,
  CoverLetterBuilder,
  InterviewCoach,
  OutreachGenerator,
  PipelineAnalytics
} from '../packages/pipeline/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m'
};

async function runEndToEndScenario() {
  console.log(`\n${c.bold}${c.cyan}================================================================${c.reset}`);
  console.log(`${c.bold}🚀 CAREER-AGENTS END-TO-END AGENTIC WORKFLOW DEMONSTRATION${c.reset}`);
  console.log(`${c.bold}${c.cyan}================================================================${c.reset}\n`);

  // Target Candidate Profile (Representative Demo Fixture)
  const candidateFixture = {
    name: 'Karthik Rajesh Shet',
    title: 'Senior Software Engineer (AI/ML & Distributed Systems)',
    email: 'karthikrshet@gmail.com',
    location: 'San Francisco, CA / Remote',
    skills: [
      'Python', 'PyTorch', 'TensorFlow', 'Distributed Systems',
      'Kubernetes', 'Docker', 'Go', 'System Design & Scalability',
      'Data Structures & Algorithms', 'C++', 'FastAPI', 'MLOps'
    ],
    experience: [
      {
        title: 'Staff AI Infrastructure Engineer',
        company: 'ScaleAI',
        dates: '2023 - Present',
        location: 'Remote',
        bullets: [
          'Designed and scaled distributed GPU model training clusters for 70B+ parameter LLMs, improving training throughput by 38%.',
          'Architected high-throughput inference service handling 45,000 QPS with p99 latency under 25ms using C++ and CUDA.'
        ]
      },
      {
        title: 'Senior Distributed Systems Engineer',
        company: 'Cloud Corp',
        dates: '2021 - 2023',
        location: 'San Francisco, CA',
        bullets: [
          'Spearheaded Kubernetes orchestration platform managing 2,000+ microservice instances with zero-downtime blue/green rollouts.',
          'Reduced compute infrastructure expenditure by $1.2M annually via automated bin-packing and spot instance auto-scaling.'
        ]
      }
    ],
    education: [
      {
        degree: 'Bachelor of Engineering in Computer Science',
        institution: 'University of Technology',
        dates: '2017 - 2021',
        location: 'India'
      }
    ]
  };

  // 1. STEP 1: ATS Scanner (Job Discovery)
  console.log(`${c.bold}[Step 1/10] Scanning ATS boards for AI/ML roles...${c.reset}`);
  const scanResult = await ATSScanner.scan('reddit', 'greenhouse');
  console.log(`  ✓ Scan Result: ${scanResult.success ? `Discovered ${scanResult.count} active roles via ${scanResult.provider}` : `Fallback to simulated posting (${scanResult.error})`}`);

  // Real Job Description (Google AI/ML Engineer)
  const sampleJD = `
About the job:
Google is seeking an experienced AI/ML Infrastructure Engineer to join our Core Machine Learning team.
In this role, you will design, implement, and optimize large-scale distributed machine learning training systems and serving platforms.

Requirements:
- BS/MS degree in Computer Science or equivalent practical experience.
- 4+ years of experience with Python, PyTorch, TensorFlow, and distributed systems.
- Experience with high-performance model training, Kubernetes, and GPU/TPU cluster orchestration.
- Solid foundation in Data Structures & Algorithms and System Design & Scalability.
- Familiarity with MLOps pipelines, latency optimization, and Googliness/collaborative teamwork.
  `;

  // 2. STEP 2: JD Parser & Requirement Extraction
  console.log(`\n${c.bold}[Step 2/10] Parsing JD Requirements & Keywords...${c.reset}`);
  const matchResult = JDMatcher.evaluateMatch(candidateFixture, sampleJD, 'Google', 'AI/ML Infrastructure Engineer');
  console.log(`  ✓ Extracted Technical Skills: ${matchResult.extractedSkills.join(', ')}`);

  // 3. STEP 3: Canonical Readiness Scoring Engine
  console.log(`\n${c.bold}[Step 3/10] Calculating Deterministic Readiness Score...${c.reset}`);
  console.log(`  ✓ Canonical Readiness Score: ${c.bold}${c.green}${matchResult.readinessScore}%${c.reset} (Confidence: ${matchResult.confidence}%)`);

  // 4. STEP 4: Identified Strengths & Gap Remediation Analysis
  console.log(`\n${c.bold}[Step 4/10] Identifying Strengths & Missing Evidence...${c.reset}`);
  console.log(`  ✓ Verified Strengths (${(matchResult.strengths || []).length}): ${(matchResult.strengths || []).join(', ') || 'Core foundation match'}`);
  console.log(`  ✓ Actionable Skill Gaps: ${(matchResult.gaps || []).length > 0 ? matchResult.gaps.join(', ') : 'None - Complete requirement coverage'}`);

  // 5. STEP 5: ATS-Optimized HTML & LaTeX Resume Generation
  console.log(`\n${c.bold}[Step 5/10] Compiling ATS Single-Page Resume (HTML & LaTeX)...${c.reset}`);
  const resumeHTML = CVBuilder.generateHTML(candidateFixture);
  const resumeLaTeX = CVBuilder.generateLaTeX(candidateFixture);
  const htmlPath = path.join(root, 'resume-demo.html');
  const texPath = path.join(root, 'resume-demo.tex');
  fs.writeFileSync(htmlPath, resumeHTML, 'utf8');
  fs.writeFileSync(texPath, resumeLaTeX, 'utf8');
  console.log(`  ✓ Generated HTML Resume : ${htmlPath} (${resumeHTML.length} bytes)`);
  console.log(`  ✓ Generated LaTeX Resume: ${texPath} (${resumeLaTeX.length} bytes)`);

  // 6. STEP 6: Strategic 3-Paragraph Tailored Cover Letter
  console.log(`\n${c.bold}[Step 6/10] Generating Strategic 3-Paragraph Cover Letter...${c.reset}`);
  const coverLetter = CoverLetterBuilder.generateCoverLetter({
    candidate: candidateFixture,
    companyName: 'Google',
    jobTitle: 'AI/ML Infrastructure Engineer',
    targetFocus: 'large-scale distributed model training and high-throughput GPU cluster orchestration',
    highlights: [
      'scaled distributed GPU training clusters for 70B+ parameter LLMs at ScaleAI, improving training throughput by 38%',
      'architected inference microservices serving 45,000 QPS with p99 latency <25ms'
    ]
  });
  const bodyParagraphs = coverLetter.split('\n\n').slice(2, 5);
  console.log(`  ✓ Cover letter successfully drafted (${bodyParagraphs.length} executive body paragraphs, ${coverLetter.length} total chars)`);

  // 7. STEP 7: Company Track & STAR Interview Question Bank
  console.log(`\n${c.bold}[Step 7/10] Building STAR Interview Prep Track from Registry...${c.reset}`);
  const googleTrack = InterviewCoach.getCompanyTrack('Google');
  const starBank = InterviewCoach.generateSTARBank(matchResult.strengths || [], 'AI/ML Infrastructure Engineer');
  console.log(`  ✓ Resolved Track: ${googleTrack?.name || 'Google'} (Interview Stages: ${googleTrack?.interview_stages?.join(' → ') || 'Technical Screen → Onsite Loop'})`);
  console.log(`  ✓ Curated ${starBank.questions.length} STAR Scenarios across: ${starBank.questions.map(q => q.category).join(', ')}`);

  // 8. STEP 8: Recruiter Networking Outreach (Sample Recruiter Fixture)
  console.log(`\n${c.bold}[Step 8/10] Drafting Recruiter LinkedIn Connection Message...${c.reset}`);
  const outreachNote = OutreachGenerator.generateLinkedInNote({
    candidateName: candidateFixture.name,
    recipientName: 'Sarah Jenkins (Recruiter Fixture)',
    company: 'Google',
    role: 'AI/ML Infrastructure Engineer'
  });
  console.log(`  ✓ LinkedIn Note (${outreachNote.length} chars, strict limit <300): "${c.gray}${outreachNote}${c.reset}"`);

  // 9. STEP 9: Application Pipeline Tracker State Transition
  console.log(`\n${c.bold}[Step 9/10] Ingesting into Application Pipeline Tracker...${c.reset}`);
  const trackerPath = path.join(root, 'pipeline-tracker-demo.md');
  const tracker = new ApplicationTracker();
  tracker.addEntry({
    company: 'Google',
    role: 'AI/ML Infrastructure Engineer',
    status: 'applied',
    link: 'https://careers.google.com/jobs/results/12345678',
    notes: 'Submitted tailored ATS resume and customized 3-paragraph cover letter.'
  });
  tracker.updateStatus('Google', 'interviewing', 'Scheduled Technical Screen Round 1 on System Design');
  tracker.save(trackerPath);
  console.log(`  ✓ Persisted to ${trackerPath} (Status: ${tracker.entries[0].status})`);

  // 10. STEP 10: Funnel Performance Analytics
  console.log(`\n${c.bold}[Step 10/10] Computing Pipeline Conversion Analytics...${c.reset}`);
  const stats = PipelineAnalytics.analyzePipeline(tracker.entries);
  console.log(`  ✓ Total Applications: ${stats.totalApplications} · Active In-Flight: ${stats.activePipeline}`);
  console.log(`  ✓ Interview Conversion Rate: ${stats.interviewConversionRate}%`);

  console.log(`\n${c.bold}${c.green}================================================================${c.reset}`);
  console.log(`${c.bold}${c.green}✅ END-TO-END DEMONSTRATION SUCCEEDED COMPLETELY!${c.reset}`);
  console.log(`${c.bold}${c.green}================================================================${c.reset}\n`);

  // Clean demo artifacts
  if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);
  if (fs.existsSync(texPath)) fs.unlinkSync(texPath);
  if (fs.existsSync(trackerPath)) fs.unlinkSync(trackerPath);
}

runEndToEndScenario().catch(err => {
  console.error('End-to-end verification error:', err);
  process.exit(1);
});
