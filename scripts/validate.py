#!/usr/bin/env python3
import argparse
import json
import os
import sys
from pathlib import Path

REQUIRED_DIRS = ['career', 'company-interviews', 'engineering', 'interview', 'networking', 'projects', 'resume', 'startup', 'ai-engineering', 'cloud', 'cybersecurity', 'open-source', 'data-engineering', 'devrel', 'job-automation', 'faang', 'ai-business', 'gtm', 'freelancing']
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

    validate_divisions(divisions, actual_files)

    for file in actual_files:
        validate_agent_file(ROOT / file)

    print('Validation passed.')


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(f'ERROR: {exc}')
        sys.exit(1)
