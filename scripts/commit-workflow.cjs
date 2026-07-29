const { execSync } = require('child_process');

function run(command) {
    try {
        console.log(`Executing: ${command}`);
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Failed to execute: ${command}`);
    }
}

// Ensure working tree doesn't have anything already staged to avoid mixups
run('git reset');

const commits = [
    {
        message: 'security(core): harden SSRF protection and rate limiters',
        files: [
            'packages/security/escape.ts',
            'packages/security/network.ts',
            'packages/security/rate-limiter.ts',
            'packages/security/safe-logger.ts',
            'packages/security/url-validator.ts',
            'apps/web/src/middleware.ts'
        ]
    },
    {
        message: 'fix(auth): handle missing DATABASE_URL and edge cases',
        files: [
            'apps/web/src/lib/auth.ts',
            'apps/web/src/lib/env.ts',
            'apps/web/src/app/login/page.tsx'
        ]
    },
    {
        message: 'feat(resume): improve PDF/DOCX parser reliability',
        files: [
            'packages/resume/file-parser.js',
            'apps/web/src/lib/pdf/server.ts',
            'apps/web/src/app/api/parse-file/route.ts'
        ]
    },
    {
        message: 'feat(analytics): update telemetry and report generation infrastructure',
        files: [
            'apps/web/src/lib/analytics.ts',
            'apps/web/src/app/api/analytics/route.ts',
            'apps/web/src/app/api/reports/export/route.ts',
            'apps/web/src/app/api/reports/generate/route.ts'
        ]
    },
    {
        message: 'feat(ai): integrate RAG vector search',
        files: [
            'packages/brain/search.ts'
        ]
    },
    {
        message: 'feat(jobs): stabilize remote job fetching and Kanban API',
        files: [
            'apps/web/src/app/api/jobs/route.ts'
        ]
    },
    {
        message: 'feat(github): enhance codebase analysis API',
        files: [
            'apps/web/src/app/api/github/analyze/route.ts'
        ]
    },
    {
        message: 'feat(interview): stabilize mock interview lab streaming',
        files: [
            'apps/web/src/app/api/interview/route.ts'
        ]
    },
    {
        message: 'feat(resume): finalize resume evaluation and export endpoints',
        files: [
            'apps/web/src/app/api/resume/evaluate/route.ts',
            'apps/web/src/app/api/resume/export/route.ts'
        ]
    },
    {
        message: 'feat(demo): implement system diagnostics cockpit',
        files: [
            'apps/web/src/app/demo/'
        ]
    },
    {
        message: 'feat(copilot): implement AI provider failover chain and demo fallbacks',
        files: [
            'packages/ai-router/services/router.ts',
            'apps/web/src/app/api/copilot/route.ts'
        ]
    },
    {
        message: 'feat(ui): inject dynamic demo state into consumer routes',
        files: [
            'apps/web/src/app/copilot/page.tsx',
            'apps/web/src/app/jobs/page.tsx',
            'apps/web/src/app/linkedin-ai/page.tsx',
            'apps/web/src/app/playground/page.tsx'
        ]
    },
    {
        message: 'perf(ui): enhance mobile navigation and sidebar UX',
        files: [
            'apps/web/src/components/layout/sidebar.tsx',
            'apps/web/src/components/layout/topbar.tsx'
        ]
    },
    {
        message: 'style(hero): redesign landing hero and unify marketing footer',
        files: [
            'apps/web/src/app/page.tsx',
            'apps/web/src/components/layout/layout-wrapper.tsx',
            'apps/web/src/components/layout/marketing-footer.tsx'
        ]
    },
    {
        message: 'feat(mcp): integrate developer tools and audit logs',
        files: [
            'mcp/server.js',
            'exports/logs/mcp.log',
            'exports/logs/mcp_audit.log',
            'docs/reports/MCP_TEST_REPORT.md'
        ]
    },
    {
        message: 'test(exports): add mock validation assets',
        files: [
            'exports/test_prep.pdf',
            'exports/test_resume.docx',
            'exports/test_roadmap.xlsx'
        ]
    },
    {
        message: 'chore(config): update environment templates and build tools',
        files: [
            'apps/web/.env.example',
            'apps/web/tsconfig.tsbuildinfo',
            'scripts/make-commits.js'
        ]
    }
];

for (const commit of commits) {
    let filesToAdd = commit.files.join(' ');
    // Handle Windows path issues safely by using git add for each individually if needed, 
    // but a string space separated is usually fine in execSync unless filenames have spaces.
    run(`git add ${filesToAdd}`);
    run(`git commit -m "${commit.message}"`);
}

// Add anything that was missed and just dump it in a final chore commit
run(`git add .`);
try {
    const status = execSync('git status --porcelain').toString();
    if (status.trim().length > 0) {
        run(`git commit -m "chore: cleanup remaining untracked files"`);
    }
} catch (e) {}

console.log("Commits generated successfully.");
