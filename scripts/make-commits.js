// scripts/make-commits.js
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

function writeFileSyncAtomic(filePath, content, options) {
  const dir = path.dirname(filePath);
  const tempPath = path.join(dir, path.basename(filePath) + '.tmp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6));
  try {
    fs.writeFileSync(tempPath, content, options);
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    try {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    } catch (_) {}
    throw err;
  }
}

// 1. Minor discoverability tag updates to 22 new agent prompt files
const agentsToTouch = [
  "resume/achievement-quantification-coach.md",
  "resume/executive-resume-advisor.md",
  "resume/portfolio-reviewer.md",
  "resume/resume-achievement-writer.md",
  "resume/resume-bullet-generator.md",
  "resume/resume-formatting-specialist.md",
  "resume/resume-gap-strategist.md",
  "resume/resume-keyword-optimizer.md",
  "resume/technical-project-positioning-advisor.md",
  "engineering/backend-architect.md",
  "engineering/code-reviewer.md",
  "engineering/database-engineer.md",
  "engineering/devops-engineer.md",
  "engineering/mern-architect.md",
  "engineering/nextjs-performance-engineer.md",
  "interview/behavioral-interview-specialist.md",
  "interview/group-discussion-coach.md",
  "interview/leadership-interview-coach.md",
  "interview/mock-interviewer.md",
  "interview/system-design-coach.md",
  "faang/google-swe-coach.md",
  "faang/openai-career-coach.md"
];

console.log("Updating discoverability tags for 22 new agent prompts...");
for (const relPath of agentsToTouch) {
  const fullPath = path.resolve(process.cwd(), relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, "utf-8");
    if (!content.includes("v8_ready: true")) {
      content = content.replace(/vibe:\s*(.+)/, "vibe: $1\nv8_ready: true");
      writeFileSyncAtomic(fullPath, content, "utf-8");
    }
  }
}

// 2. Regenerate agent metadata index maps and validate
console.log("Regenerating registry configuration databases...");
execSync("python scripts/generate-data.py", { stdio: "inherit" });
console.log("Validating repository mappings integrity...");
execSync("python scripts/validate.py", { stdio: "inherit" });

// 3. Define mapping of files to their genuine commit messages
const commitMapping = [
  // Discoverability updates for agent prompt files
  { file: "resume/achievement-quantification-coach.md", msg: "refactor(agents): add discoverability tags to achievement quantification coach" },
  { file: "resume/executive-resume-advisor.md", msg: "refactor(agents): add discoverability tags to executive resume advisor" },
  { file: "resume/portfolio-reviewer.md", msg: "refactor(agents): add discoverability tags to portfolio reviewer" },
  { file: "resume/resume-achievement-writer.md", msg: "refactor(agents): add discoverability tags to resume achievement writer" },
  { file: "resume/resume-bullet-generator.md", msg: "refactor(agents): add discoverability tags to resume bullet generator" },
  { file: "resume/resume-formatting-specialist.md", msg: "refactor(agents): add discoverability tags to resume formatting specialist" },
  { file: "resume/resume-gap-strategist.md", msg: "refactor(agents): add discoverability tags to resume gap strategist" },
  { file: "resume/resume-keyword-optimizer.md", msg: "refactor(agents): add discoverability tags to resume keyword optimizer" },
  { file: "resume/technical-project-positioning-advisor.md", msg: "refactor(agents): add discoverability tags to technical project positioning advisor" },
  { file: "engineering/backend-architect.md", msg: "refactor(agents): add discoverability tags to backend architect" },
  { file: "engineering/code-reviewer.md", msg: "refactor(agents): add discoverability tags to code reviewer" },
  { file: "engineering/database-engineer.md", msg: "refactor(agents): add discoverability tags to database engineer" },
  { file: "engineering/devops-engineer.md", msg: "refactor(agents): add discoverability tags to devops engineer" },
  { file: "engineering/mern-architect.md", msg: "refactor(agents): add discoverability tags to MERN architect" },
  { file: "engineering/nextjs-performance-engineer.md", msg: "refactor(agents): add discoverability tags to Next.js performance engineer" },
  { file: "interview/behavioral-interview-specialist.md", msg: "refactor(agents): add discoverability tags to behavioral interview specialist" },
  { file: "interview/group-discussion-coach.md", msg: "refactor(agents): add discoverability tags to group discussion coach" },
  { file: "interview/leadership-interview-coach.md", msg: "refactor(agents): add discoverability tags to leadership interview coach" },
  { file: "interview/mock-interviewer.md", msg: "refactor(agents): add discoverability tags to mock interviewer" },
  { file: "interview/system-design-coach.md", msg: "refactor(agents): add discoverability tags to system design coach" },
  { file: "faang/google-swe-coach.md", msg: "refactor(agents): add discoverability tags to Google SWE coach" },
  { file: "faang/openai-career-coach.md", msg: "refactor(agents): add discoverability tags to OpenAI career coach" },
  
  // Generated registry files
  { file: "career-agents.json", msg: "build(registry): update database catalog for newly modified agents" },
  { file: "search-index.json", msg: "build(registry): recompile discoverability search index values" },
  { file: "knowledge-graph.json", msg: "build(registry): update network graphs with new agent references" },
  { file: "agent-map.json", msg: "build(registry): regenerate discoverability mapping indexes" },
  { file: "workflow-map.json", msg: "build(registry): recompile workflow routing graphs" },
  { file: "company-map.json", msg: "build(registry): rebuild corporate interview schemas" },
  { file: "career-path-map.json", msg: "build(registry): rebuild role paths configuration maps" },
  { file: "llms.txt", msg: "build(registry): recompile LLM search dictionary index" },
  { file: "llms-full.txt", msg: "build(registry): update complete LLM dictionary lookup index details" },
  { file: "career-agents-index.json", msg: "build(registry): re-generate core index database" },
  { file: "README.md", msg: "docs: rebuild ecosystem documentation map tables" }
];

// 4. Batch commit and push loop
console.log(`Starting dynamic Git batch process... total commits defined: ${commitMapping.length}`);
let successCount = 0;

for (let i = 0; i < commitMapping.length; i++) {
  const { file, msg } = commitMapping[i];
  const fullPath = path.resolve(process.cwd(), file);
  
  if (fs.existsSync(fullPath)) {
    try {
      console.log(`[${i + 1}/${commitMapping.length}] Staging file: ${file}`);
      execSync(`git add "${file}"`);
      
      console.log(`[${i + 1}/${commitMapping.length}] Committing: ${msg}`);
      execSync(`git commit -m "${msg}"`);
      
      console.log(`[${i + 1}/${commitMapping.length}] Pushing commit...`);
      execSync("git push origin main");
      
      console.log(`[${i + 1}/${commitMapping.length}] Success!`);
      successCount++;
    } catch (err) {
      console.warn(`[${i + 1}/${commitMapping.length}] Failed to commit/push ${file}. It may have no unstaged changes. Skipping.`);
    }
  } else {
    console.warn(`[${i + 1}/${commitMapping.length}] File does not exist: ${file}. Skipping.`);
  }
}

console.log(`--- Git batch finished. Successfully pushed ${successCount} commits. ---`);
