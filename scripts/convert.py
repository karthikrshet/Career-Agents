#!/usr/bin/env python3
"""
convert.py

Lightweight, extensible conversion engine to emit tool-specific agent packages.

Usage:
  python scripts/convert.py --list
  python scripts/convert.py convert --agent career/placement-coach.md --target claude-code

Design: BaseConverter defines interface; specific converters register themselves.
"""
import argparse
import json
import os
from abc import ABC, abstractmethod
from typing import Dict, Type

CONVERTERS: Dict[str, Type['BaseConverter']] = {}


class BaseConverter(ABC):
    name: str = 'base'

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        CONVERTERS[cls.name] = cls

    def __init__(self, agent_path: str):
        self.agent_path = agent_path

    @abstractmethod
    def convert(self) -> Dict:
        """Convert agent markdown into a tool-specific manifest."""

    def read_agent(self) -> str:
        with open(self.agent_path, 'r', encoding='utf-8') as f:
            return f.read()


class ClaudeCodeConverter(BaseConverter):
    name = 'claude-code'

    def convert(self) -> Dict:
        text = self.read_agent()
        # Minimal manifest — converters should be extended later
        return {
            'type': 'claude-code-manifest',
            'source': os.path.basename(self.agent_path),
            'content': text
        }


class CursorConverter(BaseConverter):
    name = 'cursor'

    def convert(self) -> Dict:
        text = self.read_agent()
        return {
            'type': 'cursor-rules',
            'source': os.path.basename(self.agent_path),
            'content': text
        }


class CodexConverter(BaseConverter):
    name = 'codex'

    def convert(self) -> Dict:
        text = self.read_agent()
        return {
            'type': 'codex-agent',
            'source': os.path.basename(self.agent_path),
            'content': text
        }


class GeminiCliConverter(BaseConverter):
    name = 'gemini-cli'

    def convert(self) -> Dict:
        text = self.read_agent()
        return {
            'type': 'gemini-cli-manifest',
            'source': os.path.basename(self.agent_path),
            'content': text
        }


def list_targets():
    return sorted(CONVERTERS.keys())


def main():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest='cmd')

    sub.add_parser('list', help='List available converters')

    conv = sub.add_parser('convert', help='Convert an agent')
    conv.add_argument('--agent', required=True, help='Path to agent markdown')
    conv.add_argument('--target', required=True, help='Converter target')
    conv.add_argument('--out', default='.', help='Output directory')

    args = parser.parse_args()

    if args.cmd == 'list':
        for t in list_targets():
            print(t)
        return

    if args.cmd == 'convert':
        target = args.target
        if target not in CONVERTERS:
            print('Unknown target:', target)
            print('Available:', ', '.join(list_targets()))
            return
        conv_cls = CONVERTERS[target]
        conv = conv_cls(args.agent)
        manifest = conv.convert()
        out_path = os.path.join(args.out, f"{os.path.basename(args.agent)}.{target}.json")
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2)
        print('Wrote', out_path)


if __name__ == '__main__':
    main()
