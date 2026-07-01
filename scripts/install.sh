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

TARGET_DIR="$ROOT_DIR/installed_agents"

install_agents() {
  echo "Installing agent markdown files to $TARGET_DIR..."
  mkdir -p "$TARGET_DIR"
  jq -r '.divisions[].agents[]?.file' "$ROOT_DIR/divisions.json" | while read -r file; do
    if [ -z "$file" ]; then continue; fi
    src="$ROOT_DIR/$file"
    if [ -f "$src" ]; then
      dest="$TARGET_DIR/$(dirname "$file")"
      mkdir -p "$dest"
      cp "$src" "$dest/"
      echo "  - installed $file"
    else
      echo "  - missing $file (skipping)"
    fi
  done
}

show_help() {
  echo "Usage: install.sh [--validate-only] [--target <path>]"
}

if [ "${1-}" = "--validate-only" ]; then
  validate
  install_agents
  exit 0
fi

while [ $# -gt 0 ]; do
  case "$1" in
    --target)
      TARGET_DIR="$(cd "$2" && pwd)"
      shift 2
      ;;
    --validate-only)
      validate
      install_agents
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

validate
install_agents

echo "Install complete. Installed available agents to $TARGET_DIR. Use scripts/convert.py to generate tool-specific packages."
