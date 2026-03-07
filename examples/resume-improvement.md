# Resume Improvement Example: ATS Achievement Optimization

This guide demonstrates how to rewrite generic resume bullets into quantitative achievements using Career OS rules.

---

## 📈 Before & After Bullet Refactoring

### 1. Developer Project Experience
- **Before (Generic)**: "Responsible for writing backend APIs and optimizing database query calls."
- **After (STAR/XYZ Optimized)**: "Redesigned PostgreSQL indexing schemas and cached query endpoints via Redis, reducing API response latency by **42%** and saving **$12,000/year** in server compute overhead."

### 2. DevOps Deployment
- **Before (Generic)**: "Helped set up CI/CD pipelines to build and deploy docker images."
- **After (STAR/XYZ Optimized)**: "Built multi-stage GitHub Actions delivery workflows, reducing code build duration from **18 min** to **6 min** while introducing automatic test validations to block broken builds."

---

## 🛠️ Step-by-Step Optimization Workflow
1. Run the ATS Resume Reviewer to identify structural formatting issues:
   ```bash
   node scripts/cli.js run ats-resume-reviewer
   ```
2. Refactor resume bullets using `resume-strategist` guidelines.
3. Export the prompt to your editor to write optimized summaries:
   ```bash
   node scripts/cli.js use resume-keyword-optimizer cursor
   ```
