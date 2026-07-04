import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { validateResume } from './validator.js';
import { generateResumeMarkdown, generateResumeText } from './generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m'
};

export async function runInteractiveBuilder(templateId = null) {
  let initialData = {
    header: { name: '', phone: '', email: '', linkedin: '', github: '' },
    summary: '',
    experience: [],
    projects: [],
    skills: [],
    education: [],
    certifications: [],
    achievements: []
  };

  if (templateId) {
    const registryPath = path.join(root, 'resume-templates.json');
    if (fs.existsSync(registryPath)) {
      const reg = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      const t = reg.templates.find(x => x.id === templateId);
      if (t) {
        const tFile = path.join(root, 'templates', t.slug, 'template.json');
        if (fs.existsSync(tFile)) {
          initialData = JSON.parse(fs.readFileSync(tFile, 'utf8'));
          console.log(`${c.green}Loaded template data for: ${t.name}${c.reset}`);
        }
      }
    }
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query) => new Promise(resolve => rl.question(query, resolve));

  console.log(`\n${c.bold}=== ATS Resume Builder Console ===${c.reset}`);
  console.log(`${c.gray}Fill out details to compile your ATS-optimized resume formats.${c.reset}\n`);

  try {
    // 1. Header
    const name = await question(`Enter full name [${initialData.header.name}]: `);
    initialData.header.name = name.trim() || initialData.header.name || "John Doe";

    const phone = await question(`Enter phone number [${initialData.header.phone}]: `);
    initialData.header.phone = phone.trim() || initialData.header.phone || "+1-555-0100";

    const email = await question(`Enter email address [${initialData.header.email}]: `);
    initialData.header.email = email.trim() || initialData.header.email || "john.doe@example.com";

    const linkedin = await question(`Enter LinkedIn URL [${initialData.header.linkedin}]: `);
    initialData.header.linkedin = linkedin.trim() || initialData.header.linkedin || "linkedin.com/in/johndoe";

    const github = await question(`Enter GitHub URL [${initialData.header.github}]: `);
    initialData.header.github = github.trim() || initialData.header.github || "github.com/johndoe";

    // 2. Summary
    console.log(`\nSummary current value: "${initialData.summary}"`);
    const summary = await question(`Enter professional summary (or press Enter to keep current): `);
    initialData.summary = summary.trim() || initialData.summary || "Results-driven Software Engineer with hands-on experience in cloud infrastructure and api design.";

    // 3. Experience Loop (if empty, populate at least one)
    if (initialData.experience.length === 0) {
      console.log(`\nAdding Work Experience:`);
      const role = await question(`Enter job role: `);
      const company = await question(`Enter company: `);
      const duration = await question(`Enter duration (e.g. 2023 - Present): `);
      const bulletsStr = await question(`Enter achievements (semicolon-separated): `);
      const bullets = bulletsStr.split(';').map(x => x.trim()).filter(Boolean);
      initialData.experience.push({
        role: role || "Software Engineer",
        company: company || "Globex Corp",
        location: "Remote",
        duration: duration || "2023 - Present",
        bullets: bullets.length > 0 ? bullets : ["Designed and shipped scalable backend systems.", "Optimized database performance by 20%."]
      });
    }

    // 4. Skills
    console.log(`\nSkills current value: [${initialData.skills.join(', ')}]`);
    const skillsStr = await question(`Enter skills (comma-separated list, or press Enter to keep current): `);
    if (skillsStr.trim()) {
      initialData.skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
    }

    // 5. Education (if empty, populate at least one)
    if (initialData.education.length === 0) {
      console.log(`\nAdding Education:`);
      const degree = await question(`Enter degree (e.g. B.S. Computer Science): `);
      const institution = await question(`Enter university: `);
      const duration = await question(`Enter duration (e.g. 2018 - 2022): `);
      initialData.education.push({
        degree: degree || "B.S. in Computer Science",
        institution: institution || "State University",
        location: "City, State",
        duration: duration || "2018 - 2022"
      });
    }

    rl.close();

    // Validate
    const check = validateResume(initialData);
    if (!check.valid) {
      console.error(`\n${c.red}Validation Errors detected:${c.reset}`);
      check.errors.forEach(e => console.error(`  - ${e}`));
      return;
    }

    // Write Output
    const outDir = path.join(root, 'exports', 'resumes');
    fs.mkdirSync(outDir, { recursive: true });

    const slugName = initialData.header.name.toLowerCase().replace(/\s+/g, '-');
    
    // Write JSON
    fs.writeFileSync(path.join(outDir, `${slugName}.json`), JSON.stringify(initialData, null, 2), 'utf8');

    // Write MD
    const md = generateResumeMarkdown(initialData);
    fs.writeFileSync(path.join(outDir, `${slugName}.md`), md, 'utf8');

    // Write TXT
    const txt = generateResumeText(initialData);
    fs.writeFileSync(path.join(outDir, `${slugName}.txt`), txt, 'utf8');

    console.log(`\n${c.green}[Success] Resume files built successfully!${c.reset}`);
    console.log(`=> JSON: ${c.bold}${path.join(outDir, `${slugName}.json`)}${c.reset}`);
    console.log(`=> MD:   ${c.bold}${path.join(outDir, `${slugName}.md`)}${c.reset}`);
    console.log(`=> TXT:  ${c.bold}${path.join(outDir, `${slugName}.txt`)}${c.reset}`);

  } catch (err) {
    console.error(`${c.red}Builder run failed: ${err.message}${c.reset}`);
    rl.close();
  }
}
