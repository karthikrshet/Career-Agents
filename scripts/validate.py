#!/usr/bin/env python3
import argparse
import json
import os
import re
import sys
from pathlib import Path

REQUIRED_DIRS = [
    'career', 'company-interviews', 'engineering', 'interview', 'networking', 
    'projects', 'resume', 'startup', 'ai-engineering', 'cloud', 'cybersecurity', 
    'open-source', 'data-engineering', 'devrel', 'job-automation', 'faang', 
    'ai-business', 'gtm', 'freelancing'
]
REQUIRED_FIELDS = {'name', 'description', 'color', 'emoji', 'vibe'}
REQUIRED_HEADINGS = [
    '## 🧠 Your Identity & Memory',
    '## 🎯 Your Core Mission',
    '## 🚨 Critical Rules You Must Follow',
    '## 📋 Technical Deliverables',
    '## 🔄 Workflow Process',
    '## 💭 Communication Style',
    '## 🔄 Learning & Memory',
    '## 🎯 Success Metrics',
    '## 🚀 Advanced Capabilities'
]

ROOT = Path(__file__).resolve().parent.parent


def load_json(path):
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except Exception as exc:
        print(f'ERROR: failed to parse {path}: {exc}')
        sys.exit(1)


def validate_dirs():
    missing = [d for d in REQUIRED_DIRS if not (ROOT / d).is_dir()]
    if missing:
        raise ValueError(f'Missing required directories: {missing}')


def discover_markdown_files():
    files = []
    for d in REQUIRED_DIRS:
        for path in sorted((ROOT / d).glob('*.md')):
            files.append(path.relative_to(ROOT).as_posix())
    return files


def parse_frontmatter(text):
    lines = text.splitlines()
    if len(lines) < 2 or lines[0].strip() != '---':
        return None
    try:
        end_index = lines[1:].index('---') + 1
    except ValueError:
        return None
    body = lines[1:end_index]
    data = {}
    for line in body:
        if ':' not in line:
            continue
        key, value = line.split(':', 1)
        data[key.strip()] = value.strip().strip('"').strip("'")
    return data


def validate_agent_file(path):
    text = path.read_text(encoding='utf-8')
    fm = parse_frontmatter(text)
    if fm is None:
        raise ValueError(f'Invalid frontmatter in {path}')
    missing = REQUIRED_FIELDS - set(fm.keys())
    if missing:
        raise ValueError(f'Missing frontmatter fields in {path}: {missing}')
    for heading in REQUIRED_HEADINGS:
        if heading not in text:
            raise ValueError(f'Missing required heading in {path}: {heading}')
    if len(text.split()) < 300:
        raise ValueError(f'Agent file too short (<300 words) in {path}')


def validate_divisions(entries, actual_files):
    missing_files = []
    reported = set()
    for division in entries['divisions']:
        for agent in division['agents']:
            reported.add(agent['file'])
            file_path = ROOT / agent['file']
            if not file_path.exists():
                missing_files.append(agent['file'])
    extra = [f for f in actual_files if f not in reported]
    if missing_files or extra:
        msgs = []
        if missing_files:
            msgs.append(f'Missing files listed in divisions.json: {missing_files}')
        if extra:
            msgs.append(f'Markdown files not listed in divisions.json: {extra}')
        raise ValueError('; '.join(msgs))


def find_markdown_links(text):
    # Matches markdown relative links
    links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', text)
    return links


def validate_markdown_links():
    print('Checking markdown relative links across the repository...')
    md_files = sorted(list(ROOT.glob('**/*.md')))
    broken_count = 0
    for fpath in md_files:
        if '.git' in fpath.parts or 'node_modules' in fpath.parts or 'exports' in fpath.parts:
            continue
        try:
            text = fpath.read_text(encoding='utf-8')
        except Exception as e:
            print(f'Warning: Could not read {fpath.relative_to(ROOT)}: {e}')
            continue
        links = find_markdown_links(text)
        for name, link in links:
            clean_link = link.split('#')[0]
            if not clean_link:
                continue
            if clean_link.startswith(('http://', 'https://', 'mailto:')):
                continue
            # Resolve link relative to the file location
            target_path = (fpath.parent / clean_link).resolve()
            if not target_path.exists():
                print(f'ERROR: Broken link in {fpath.relative_to(ROOT)}: [{name}]({link}) resolved to non-existent path: {target_path}')
                broken_count += 1
    if broken_count > 0:
        raise ValueError(f'Found {broken_count} broken relative markdown links.')


def validate_registries(agent_ids, workflow_ids, path_ids, company_ids):
    print('Checking registry reference integrity...')
    
    # 1. Validate Workflows recommended agents
    workflow_registry = load_json(ROOT / 'workflow-registry.json')
    for w in workflow_registry.get('workflows', []):
        filename = ROOT / w['filename']
        if not filename.exists():
            raise ValueError(f"Workflow file does not exist: {w['filename']}")
        for aid in w.get('recommended_agents', []):
            if aid not in agent_ids:
                raise ValueError(f"Workflow '{w['id']}' recommends non-existent agent: '{aid}'")

    # 2. Validate Career Paths recommended agents & workflows, and their file existence
    paths_registry = load_json(ROOT / 'career-paths.json')
    for p in paths_registry.get('career_paths', []):
        path_file = ROOT / 'career-paths' / f"{p['id']}.json"
        if not path_file.exists():
            raise ValueError(f"Career path file does not exist for: '{p['id']}' (Expected {path_file.relative_to(ROOT)})")
        # Ensure path_file parses correctly and matches ID
        p_data = load_json(path_file)
        if p_data.get('id') != p['id']:
            raise ValueError(f"Career path file '{path_file.relative_to(ROOT)}' contains mismatched ID '{p_data.get('id')}' (Expected '{p['id']}')")
            
        for aid in p.get('recommended_agents', []):
            if aid not in agent_ids:
                raise ValueError(f"Career path '{p['id']}' recommends non-existent agent: '{aid}'")
        for wid in p.get('recommended_workflows', []):
            if wid not in workflow_ids:
                raise ValueError(f"Career path '{p['id']}' recommends non-existent workflow: '{wid}'")

    # 3. Validate Companies prep agents & workflows, and their file existence
    companies_registry = load_json(ROOT / 'companies.json')
    for c in companies_registry.get('companies', []):
        company_file = ROOT / 'companies' / f"{c['id']}.json"
        if not company_file.exists():
            raise ValueError(f"Company track prep file does not exist for: '{c['id']}' (Expected {company_file.relative_to(ROOT)})")
        # Ensure company_file parses correctly and matches ID
        c_data = load_json(company_file)
        if c_data.get('id') != c['id']:
            raise ValueError(f"Company track file '{company_file.relative_to(ROOT)}' contains mismatched ID '{c_data.get('id')}' (Expected '{c['id']}')")

        for aid in c.get('agents', []):
            if aid not in agent_ids:
                raise ValueError(f"Company track '{c['id']}' references non-existent agent: '{aid}'")
        for wid in c.get('workflows', []):
            if wid not in workflow_ids:
                raise ValueError(f"Company track '{c['id']}' references non-existent workflow: '{wid}'")

    # 4. Validate Bundles files integrity
    bundle_dir = ROOT / 'bundles'
    if bundle_dir.exists():
        for bpath in bundle_dir.glob('*.json'):
            b_data = load_json(bpath)
            bid = b_data.get('id')
            for aid in b_data.get('agents', []):
                if aid not in agent_ids:
                    raise ValueError(f"Bundle '{bid}' references non-existent agent: '{aid}'")
            for wid in b_data.get('workflows', []):
                if wid not in workflow_ids:
                    raise ValueError(f"Bundle '{bid}' references non-existent workflow: '{wid}'")
            for pid in b_data.get('career_paths', []):
                if pid not in path_ids:
                    raise ValueError(f"Bundle '{bid}' references non-existent career path: '{pid}'")
            for cid in b_data.get('companies', []):
                # Companies registry uses lowercase IDs
                if cid.lower() not in company_ids:
                    raise ValueError(f"Bundle '{bid}' references non-existent company: '{cid}'")


def validate_resume_ecosystem(agent_ids, workflow_ids, company_ids):
    print('Checking resume studio templates and command registration...')
    
    reg_path = ROOT / 'resume-templates.json'
    if not reg_path.exists():
        raise ValueError("resume-templates.json registry is missing")
    
    reg_data = load_json(reg_path)
    templates = reg_data.get('templates', [])
    if not templates:
        raise ValueError("resume-templates.json contains no templates")
        
    for t in templates:
        required = {'id', 'name', 'slug', 'role', 'experience_level', 'industry', 'ats_score_target'}
        missing = required - set(t.keys())
        if missing:
            raise ValueError(f"Template '{t.get('id')}' is missing fields: {missing}")
            
        slug_dir = ROOT / 'templates' / t['slug']
        if not slug_dir.is_dir():
            raise ValueError(f"Template slug directory does not exist: {slug_dir}")
            
        for f in ['template.json', 'template.md', 'docx-metadata.json']:
            fpath = slug_dir / f
            if not fpath.exists():
                raise ValueError(f"Template file '{f}' is missing under {slug_dir}")
                
        for aid in t.get('recommended_agents', []):
            if aid not in agent_ids:
                raise ValueError(f"Template '{t['id']}' recommends non-existent agent: '{aid}'")
        for wid in t.get('recommended_workflows', []):
            if wid not in workflow_ids:
                raise ValueError(f"Template '{t['id']}' recommends non-existent workflow: '{wid}'")
        for cid in t.get('recommended_companies', []):
            if cid.lower() not in company_ids:
                raise ValueError(f"Template '{t['id']}' recommends non-existent company: '{cid}'")

    cli_path = ROOT / 'scripts' / 'cli.js'
    if not cli_path.exists():
        raise ValueError("scripts/cli.js is missing")
    
    cli_text = cli_path.read_text(encoding='utf-8')
    if "case 'resume':" not in cli_text:
        raise ValueError("Resume command is not registered under switch-case inside scripts/cli.js")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--list', action='store_true', help='List all markdown files discovered')
    args = parser.parse_args()

    validate_dirs()
    divisions = load_json(ROOT / 'divisions.json')
    actual_files = discover_markdown_files()
    if args.list:
        for file in actual_files:
            print(file)
        return

    # Validate agent structure mappings
    validate_divisions(divisions, actual_files)

    # Validate individual agent prompt formats
    for file in actual_files:
        validate_agent_file(ROOT / file)

    # Compile list of valid registered entities
    agent_registry = load_json(ROOT / 'agent-registry.json')
    agent_ids = {a['id'] for a in agent_registry.get('agents', [])}
    
    workflow_registry = load_json(ROOT / 'workflow-registry.json')
    workflow_ids = {w['id'] for w in workflow_registry.get('workflows', [])}

    paths_registry = load_json(ROOT / 'career-paths.json')
    path_ids = {p['id'] for p in paths_registry.get('career_paths', [])}

    companies_registry = load_json(ROOT / 'companies.json')
    company_ids = {c['id'] for c in companies_registry.get('companies', [])}

    # Validate relative markdown links
    validate_markdown_links()

    # Validate registry referential integrity and file mapping existence
    validate_registries(agent_ids, workflow_ids, path_ids, company_ids)

    # Validate Resume Studio Ecosystem
    validate_resume_ecosystem(agent_ids, workflow_ids, company_ids)

    print('Validation passed.')


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(f'ERROR: {exc}')
        sys.exit(1)
