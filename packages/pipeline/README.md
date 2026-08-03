# Career-Agents Pipeline Engine

Native job application tracking, ATS board scanning, JD matching, and document generation engine for the Career-Agents platform.

## Features

- **Application Tracker (`ApplicationTracker`)**: Markdown table and JSON based tracking with automated deduplication and stage conversion analytics.
- **ATS Portal Scanner (`ATSScanner`)**: Real-time scanner for Greenhouse, Lever, and Ashby job boards.
- **JD Requirement Matcher (`JDMatcher`)**: Canonical readiness matching against raw job descriptions.
- **Document Generator (`CVBuilder` & `CoverLetterBuilder`)**: ATS-optimized HTML/CSS, LaTeX, and tailored cover letter generation.
- **Outreach & Interview Prep (`OutreachGenerator` & `InterviewCoach`)**: High-converting LinkedIn recruiter notes and STAR interview question banks.

## CLI Usage

```bash
# View live application pipeline tracker
career-agents pipeline tracker

# Add an application
career-agents pipeline add Google "Senior Software Engineer" https://careers.google.com/jobs/123

# Update application status
career-agents pipeline status Google interviewing "Scheduled technical round 1"

# Scan ATS job board
career-agents pipeline scan stripe greenhouse

# Evaluate candidate match against a job description
career-agents pipeline match jd.txt Google "AI/ML Engineer"

# Generate tailored cover letter
career-agents pipeline cover Google "Distributed Systems Engineer"

# View pipeline conversion funnel statistics
career-agents pipeline stats
```

## License

Copyright (c) 2026 Karthik Rajesh Shet · MIT License
