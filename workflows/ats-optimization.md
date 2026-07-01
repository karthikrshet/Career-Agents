# ATS Optimization

# Overview

ATS Optimization is a repeatable resume operating system for candidates who apply through portals, campus systems, enterprise hiring platforms, and recruiter databases. The goal is not to trick automated systems. The goal is to make a truthful, role-specific resume parse cleanly, match relevant job-description language, and still persuade the human recruiter who reads it after the filter.

This workflow turns one generic resume into a controlled set of application-ready variants. It includes diagnosis, keyword mapping, formatting correction, evidence-based bullet rewrites, testing, application tracking, and iteration based on response rates. Use it when applications are disappearing into silence, when a resume has decorative formatting, or when the candidate is applying to roles with different keyword expectations.

The workflow should be run in three passes: structural pass, content pass, and performance pass. Do not start by stuffing keywords. Start by making sure the resume can be read correctly.

# Target Audience

- Students applying through campus placement portals.
- Freshers applying to high-volume entry-level roles.
- Software developers applying through enterprise ATS platforms.
- Career switchers whose experience needs clearer keyword alignment.
- Candidates receiving very low response rates despite relevant skills.
- Contributors building resume-related workflows or examples for Career-Agents.

# Prerequisites

- Current resume in editable format.
- Target role family, such as frontend developer, backend developer, data analyst, product intern, or DevOps engineer.
- At least three representative job descriptions.
- List of real skills, projects, achievements, and tools the candidate can defend.
- Application tracker with current baseline if available.
- LinkedIn profile and portfolio links if used in applications.

Do not begin this workflow if the candidate cannot name a target role. ATS work without a target becomes generic formatting cleanup.

# Recommended Career-Agents

- `career/ats-resume-reviewer.md` for parsing, structure, keyword mapping, and format checks.
- `career/resume-strategist.md` for narrative alignment and achievement rewriting.
- `career/job-search-strategist.md` for application funnel tracking and role targeting.
- `career/linkedin-growth-advisor.md` for profile consistency and recruiter search alignment.
- `career/placement-coach.md` for readiness review and pipeline diagnosis.

# Step-by-Step Execution Plan

1. **Create the baseline record.** Save the current resume as `baseline-resume` and record its current application performance: applications sent, responses, screens, interviews, and rejections. If there is no history, mark the baseline as unknown.

2. **Run a parse-safety audit.** Use `ats-resume-reviewer` to inspect headings, columns, tables, icons, images, date formats, file type, section order, and contact information. The output should be a list of parse risks and required structural fixes.

3. **Normalize the format.** Use standard headings such as Summary, Skills, Experience, Projects, Education, Certifications, and Achievements. Remove image-based text, complex tables, unreadable icons, and decorative layouts that may confuse parsers.

4. **Build a keyword map.** Extract repeated job-description terms from three target postings. Separate required skills, preferred skills, domain language, tools, methods, and soft requirements. Only keep terms the candidate can honestly support.

5. **Map keywords to evidence.** For each important keyword, identify where it appears in the resume and what evidence supports it. If the candidate has JavaScript only in a skill list but no project bullet, the signal is weak.

6. **Rewrite bullets for impact.** Use `resume-strategist` to convert responsibilities into action, method, and outcome. A strong bullet includes what was done, with which tool or method, and what changed because of it.

7. **Create role-specific variants.** Build one master resume and two or three targeted versions. Example: frontend, full-stack, and software engineering intern. Each variant should change summary, skills ordering, and selected bullets, not invent experience.

8. **Check human readability.** A resume that parses well but reads like a keyword dump will still fail. Review the first third of the first page. It should immediately show role fit, strongest evidence, and current level.

9. **Align LinkedIn and portfolio.** Ensure the resume does not claim skills or dates that conflict with LinkedIn, GitHub, portfolio, or project READMEs.

10. **Launch a controlled application batch.** Send 15-25 applications using the optimized variants. Track role, company, variant used, channel, date, and response.

11. **Review performance after the batch.** If response rate remains low, diagnose whether the issue is resume quality, role mismatch, weak evidence, lack of referrals, or market conditions.

# Weekly Action Plan

**Week 1: Audit and Repair**

- Day 1: Collect target roles, resume, and three job descriptions.
- Day 2: Run parse audit and fix formatting.
- Day 3: Build keyword map.
- Day 4: Rewrite summary and top bullets.
- Day 5: Create first optimized resume variant.
- Weekend: Review with a human readability pass.

**Week 2: Variant Creation and Launch**

- Create two additional role-specific variants.
- Align LinkedIn skills and headline with target roles.
- Prepare file naming convention.
- Submit first controlled application batch.
- Track every application in a simple spreadsheet.

**Week 3: Performance Review**

- Calculate response rate.
- Compare performance by variant and channel.
- Identify missing evidence or repeated rejection patterns.
- Revise the weakest variant.
- Prepare next application batch or move to outreach workflow.

# Daily Checklist

- Review one target job description before editing.
- Check that every added keyword is supported by evidence.
- Keep bullets concise and outcome-oriented.
- Confirm dates, titles, and links are consistent.
- Save resume versions with clear names.
- Log every application and variant used.
- Record recruiter feedback, even if brief.
- Avoid editing the resume endlessly without sending applications.

# KPIs / Success Metrics

- ATS parse pass rate across core fields.
- Application-to-response rate by resume variant.
- Interview invites per 25 applications.
- Percentage of high-value keywords mapped to evidence.
- Number of unsupported claims removed or rewritten.
- Recruiter readability score from human review.
- Reduction in applications sent with no role-specific tailoring.

# Common Mistakes

- Treating ATS optimization as keyword stuffing.
- Using complex templates with columns, icons, and image text.
- Adding skills the candidate cannot explain in an interview.
- Creating too many variants without tracking performance.
- Optimizing for one job description so narrowly that the resume becomes brittle.
- Ignoring the human recruiter after satisfying the machine.
- Hiding weak evidence behind long skill lists.
- Forgetting that referrals and targeting still matter.

# Expected Outcomes

By the end of this workflow, the candidate should have a parse-safe master resume, two or three role-specific variants, a keyword-to-evidence map, and a tracker showing which version was used for each application. The candidate should understand whether low response rates are caused by formatting, weak targeting, missing evidence, or application channel problems.

The output should be a resume system, not a single file. Future applications become faster because the candidate can choose the closest variant, tailor the top section, and track results.

# Next Recommended Workflow

Run `workflows/linkedin-growth.md` if recruiter discovery and profile alignment are weak. Run `workflows/fresher-placement.md` if this is part of a broader first-job campaign. Run `workflows/remote-job-hunt.md` if the target roles are remote and require stronger distributed-work positioning.
