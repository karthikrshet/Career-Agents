#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Defaults
TOOL=""
AGENT=""
OUT_DIR="."

show_help() {
  echo "Usage: convert.sh --tool <tool> [--agent <path>] [--out <dir>]"
  echo ""
  echo "Options:"
  echo "  --tool <tool>   Target platform (cursor, codex, gemini-cli, claude-code)"
  echo "  --agent <path>  Specific agent markdown file (optional, default: convert all)"
  echo "  --out <dir>     Output directory for converted packages (default: .)"
}

# Parse Arguments
while [ $# -gt 0 ]; do
  case "$1" in
    --tool)
      TOOL="$2"
      shift 2
      ;;
    --agent)
      AGENT="$2"
      shift 2
      ;;
    --out)
      OUT_DIR="$2"
      shift 2
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

if [ -z "$TOOL" ]; then
  echo "ERROR: --tool is required." >&2
  show_help
  exit 1
fi

DIVISIONS_FILE="$ROOT_DIR/divisions.json"
if [ ! -f "$DIVISIONS_FILE" ]; then
  echo "ERROR: divisions.json not found." >&2
  exit 1
fi

run_convert() {
  local agent_file="$1"
  local src="$ROOT_DIR/$agent_file"
  if [ -f "$src" ]; then
    # Run python converter
    if command -v python3 &>/dev/null; then
      python3 "$ROOT_DIR/scripts/convert.py" convert --agent "$src" --target "$TOOL" --out "$OUT_DIR"
    elif command -v python &>/dev/null; then
      python "$ROOT_DIR/scripts/convert.py" convert --agent "$src" --target "$TOOL" --out "$OUT_DIR"
    else
      echo "ERROR: Python is required to run the conversion engine." >&2
      exit 1
    fi
  else
    echo "ERROR: Agent file not found: $agent_file" >&2
    exit 1
  fi
}

# Execute
if [ -n "$AGENT" ]; then
  run_convert "$AGENT"
else
  # Convert all agents in divisions.json
  echo "Converting all agents in the registry to $TOOL format..."
  mkdir -p "$OUT_DIR"
  jq -r '.divisions[].agents[]?.file' "$DIVISIONS_FILE" | while read -r file; do
    if [ -z "$file" ]; then continue; fi
    run_convert "$file"
  done
  echo "Conversion complete."
fi
