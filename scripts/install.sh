#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Defaults
TOOL=""
DIVISION=""
AGENT=""
LIST=""
DRY_RUN=false
TARGET_DIR=""

show_help() {
  echo "Usage: install.sh [options]"
  echo ""
  echo "Options:"
  echo "  --tool <tool>          Install agents formatted for tool (claude-code, cursor, codex, gemini-cli)"
  echo "  --division <division>  Only install agents from specific division"
  echo "  --agent <agent-id>     Only install a single specific agent by ID"
  echo "  --list agents          List all available agents in the registry"
  echo "  --list divisions       List all active divisions in the registry"
  echo "  --dry-run              Print the actions that would be performed without executing them"
  echo "  --target <path>        Custom directory to output installed agents"
}

# Parse Arguments
while [ $# -gt 0 ]; do
  case "$1" in
    --tool)
      TOOL="$2"
      shift 2
      ;;
    --division)
      DIVISION="$2"
      shift 2
      ;;
    --agent)
      AGENT="$2"
      shift 2
      ;;
    --list)
      LIST="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift 1
      ;;
    --target)
      TARGET_DIR="$2"
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

DIVISIONS_FILE="$ROOT_DIR/divisions.json"
if [ ! -f "$DIVISIONS_FILE" ]; then
  echo "ERROR: divisions.json not found." >&2
  exit 1
fi

# 1. Handle List Commands
if [ "$LIST" = "agents" ]; then
  echo "Available Agents:"
  jq -r '.divisions[].agents[]? | "\(.id) [\(.file)]"' "$DIVISIONS_FILE"
  exit 0
elif [ "$LIST" = "divisions" ]; then
  echo "Active Divisions:"
  jq -r '.divisions[].id' "$DIVISIONS_FILE"
  exit 0
elif [ -n "$LIST" ]; then
  echo "ERROR: Unknown list target '$LIST'. Use 'agents' or 'divisions'." >&2
  exit 1
fi

# Set Target Directory defaults if not provided
if [ -z "$TARGET_DIR" ]; then
  if [ -n "$TOOL" ]; then
    TARGET_DIR="$ROOT_DIR/installed_agents/$TOOL"
  else
    TARGET_DIR="$ROOT_DIR/installed_agents"
  fi
fi

# Run validation checks on repository structure
validate() {
  if [ "$DRY_RUN" = true ]; then
    echo "[Dry Run] Validating repository structure..."
  else
    echo "Validating repository structure..."
  fi
  
  jq -r '.divisions[].id' "$DIVISIONS_FILE" | while read -r d; do
    if [ -z "$d" ]; then continue; fi
    # Check if folder exists
    if [ ! -d "$ROOT_DIR/$d" ]; then
      echo "ERROR: Required division directory '$d' is missing from repository root." >&2
      exit 1
    fi
  done
  
  if [ "$DRY_RUN" = true ]; then
    echo "[Dry Run] Validation passed."
  else
    echo "Validation passed."
  fi
}

validate

# Retrieve agents to install based on filters
install_agents() {
  if [ "$DRY_RUN" = true ]; then
    echo "[Dry Run] Preparing agent installation under target: $TARGET_DIR"
  else
    echo "Installing agent markdown files to $TARGET_DIR..."
    mkdir -p "$TARGET_DIR"
  fi
  
  # Filter agents using jq
  jq -c '.divisions[] | {div_id: .id, agents: .agents}' "$DIVISIONS_FILE" | while read -r div_row; do
    div_id=$(echo "$div_row" | jq -r '.div_id')
    
    # Filter by division if specified
    if [ -n "$DIVISION" ] && [ "$DIVISION" != "$div_id" ]; then
      continue
    fi
    
    echo "$div_row" | jq -c '.agents[]?' | while read -r agent_row; do
      if [ -z "$agent_row" ]; then continue; fi
      
      agent_id=$(echo "$agent_row" | jq -r '.id')
      agent_file=$(echo "$agent_row" | jq -r '.file')
      
      # Filter by agent-id if specified
      if [ -n "$AGENT" ] && [ "$AGENT" != "$agent_id" ]; then
        continue
      fi
      
      src="$ROOT_DIR/$agent_file"
      if [ -f "$src" ]; then
        # Handle dry-run vs actual execution
        if [ "$DRY_RUN" = true ]; then
          if [ -n "$TOOL" ]; then
            echo "[Dry Run] Convert: $agent_file to target tool: $TOOL -> $TARGET_DIR/$(basename "$agent_file").$TOOL.json"
          else
            echo "[Dry Run] Copy: $agent_file -> $TARGET_DIR/$agent_file"
          fi
        else
          dest_sub_dir="$TARGET_DIR/$(dirname "$agent_file")"
          if [ -n "$TOOL" ]; then
            # Copy source file
            mkdir -p "$dest_sub_dir"
            cp "$src" "$dest_sub_dir/"
            
            # Convert using convert.py if python is available
            if command -v python3 &>/dev/null; then
              python3 "$ROOT_DIR/scripts/convert.py" convert --agent "$src" --target "$TOOL" --out "$TARGET_DIR"
            elif command -v python &>/dev/null; then
              python "$ROOT_DIR/scripts/convert.py" convert --agent "$src" --target "$TOOL" --out "$TARGET_DIR"
            else
              echo "Warning: Python not found, skipping tool manifest conversion for $agent_id."
            fi
          else
            mkdir -p "$dest_sub_dir"
            cp "$src" "$dest_sub_dir/"
            echo "  - installed $agent_file"
          fi
        fi
      else
        echo "  - Warning: missing source file $agent_file (skipping)"
      fi
    done
  done
}

install_agents

if [ "$DRY_RUN" = true ]; then
  echo "[Dry Run] Execution complete."
else
  echo "Install complete."
fi
