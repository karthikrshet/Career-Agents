Param(
  [string]$Tool = "",
  [string]$Division = "",
  [string]$Agent = "",
  [string]$List = "",
  [switch]$DryRun,
  [string]$Target = ""
)

$Root = Split-Path -Parent $PSScriptRoot
$DivisionsFile = Join-Path $Root "divisions.json"

if (-not (Test-Path $DivisionsFile)) {
  Write-Error "divisions.json missing"
  exit 1
}

# 1. Handle List commands
if ($List -eq "agents") {
  Write-Host "Available Agents:"
  $json = Get-Content $DivisionsFile -Raw | ConvertFrom-Json
  foreach ($div in $json.divisions) {
    foreach ($agent_obj in $div.agents) {
      Write-Host "$($agent_obj.id) [$($agent_obj.file)]"
    }
  }
  exit 0
} elseif ($List -eq "divisions") {
  Write-Host "Active Divisions:"
  $json = Get-Content $DivisionsFile -Raw | ConvertFrom-Json
  foreach ($div in $json.divisions) {
    Write-Host $div.id
  }
  exit 0
} elseif (-not [string]::IsNullOrEmpty($List)) {
  Write-Error "Unknown list target '$List'. Use 'agents' or 'divisions'."
  exit 1
}

# Set Target Directory defaults if not provided
if ([string]::IsNullOrEmpty($Target)) {
  if (-not [string]::IsNullOrEmpty($Tool)) {
    $Target = Join-Path $Root "installed_agents\$Tool"
  } else {
    $Target = Join-Path $Root "installed_agents"
  }
}

function Validate-Repo {
  if ($DryRun) {
    Write-Host "[Dry Run] Validating repository structure..."
  } else {
    Write-Host "Validating repository structure..."
  }
  $json = Get-Content $DivisionsFile -Raw | ConvertFrom-Json
  foreach ($div in $json.divisions) {
    $dir = Join-Path $Root $div.id
    if (-not (Test-Path $dir)) {
      Write-Error "Required directory $($div.id) not found"
      exit 1
    }
  }
  if ($DryRun) {
    Write-Host "[Dry Run] Validation passed."
  } else {
    Write-Host "Validation passed."
  }
}

function Install-Agents {
  if ($DryRun) {
    Write-Host "[Dry Run] Preparing agent installation under target: $Target"
  } else {
    Write-Host "Installing agent markdown files to $Target..."
    if (-not (Test-Path $Target)) {
      New-Item -ItemType Directory -Path $Target -Force | Out-Null
    }
  }
  
  $json = Get-Content $DivisionsFile -Raw | ConvertFrom-Json
  foreach ($div in $json.divisions) {
    # Filter by division if specified
    if (-not [string]::IsNullOrEmpty($Division) -and ($Division -ne $div.id)) {
      continue
    }
    
    foreach ($agent_obj in $div.agents) {
      # Filter by agent if specified
      if (-not [string]::IsNullOrEmpty($Agent) -and ($Agent -ne $agent_obj.id)) {
        continue
      }
      
      $source = Join-Path $Root $agent_obj.file
      if (Test-Path $source) {
        if ($DryRun) {
          if (-not [string]::IsNullOrEmpty($Tool)) {
            Write-Host "[Dry Run] Convert: $($agent_obj.file) to target tool: $Tool -> $Target\$(Split-Path $agent_obj.file -Leaf).$Tool.json"
          } else {
            Write-Host "[Dry Run] Copy: $($agent_obj.file) -> $Target\$($agent_obj.file)"
          }
        } else {
          $destination = Join-Path $Target $agent_obj.file
          $destinationDir = Split-Path $destination
          if (-not (Test-Path $destinationDir)) {
            New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
          }
          
          if (-not [string]::IsNullOrEmpty($Tool)) {
            # Copy source file
            Copy-Item $source -Destination $destination -Force
            
            # Convert using convert.py
            python "$Root\scripts\convert.py" convert --agent $source --target $Tool --out $Target
          } else {
            Copy-Item $source -Destination $destination -Force
            Write-Host "  - installed $($agent_obj.file)"
          }
        }
      } else {
        Write-Warning "  - missing $($agent_obj.file) (skipping)"
      }
    }
  }
}

Validate-Repo
Install-Agents

if ($DryRun) {
  Write-Host "[Dry Run] Execution complete."
} else {
  Write-Host "Install complete."
}
