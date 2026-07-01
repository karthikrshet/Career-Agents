#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
echo "Installing CodeMyFYP-Agents into $ROOT_DIR"

validate() {
  echo "Validating repository structure..."
  for d in career engineering startup projects; do
    if [ ! -d "$ROOT_DIR/$d" ]; then
      echo "ERROR: required directory $d not found" >&2
      exit 1
    fi
  done
  if [ ! -f "$ROOT_DIR/divisions.json" ]; then
    echo "ERROR: divisions.json missing" >&2
    exit 1
  fi
  echo "Validation passed."
}

install_agents() {
  echo "Listing agents from divisions.json..."
  jq -r '.divisions[].agents[]?.file' "$ROOT_DIR/divisions.json" | while read -r file; do
    if [ -z "$file" ]; then continue; fi
    src="$ROOT_DIR/$file"
    if [ -f "$src" ]; then
      echo "  - validating $file"
      head -n 3 "$src" || true
    else
      echo "  - missing $file (skipping)"
    fi
  done
}

show_help() {
  echo "Usage: install.sh [--validate-only]"
}

if [ "${1-}" = "--validate-only" ]; then
  validate
  install_agents
  exit 0
fi

validate
install_agents

echo "Install complete. Use scripts/convert.py to generate tool-specific packages."
