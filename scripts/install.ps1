Param(
  [switch]$ValidateOnly,
  [string]$Target = "$Root\installed_agents"
)

$Root = Split-Path -Parent $PSScriptRoot
Write-Host "Installing CodeMyFYP-Agents into $Root"

function Validate-Repo {
  Write-Host "Validating repository structure..."
  foreach ($d in @('career','engineering','startup','projects')) {
    if (-not (Test-Path (Join-Path $Root $d))) {
      Write-Error "Required directory $d not found"
      exit 1
    }
  }
  if (-not (Test-Path (Join-Path $Root 'divisions.json'))) {
    Write-Error "divisions.json missing"
    exit 1
  }
  Write-Host "Validation passed."
}

function Install-Agents {
  Write-Host "Installing agent markdown files to $Target..."
  if (-not (Test-Path $Target)) {
    New-Item -ItemType Directory -Path $Target | Out-Null
  }
  $json = Get-Content (Join-Path $Root 'divisions.json') -Raw | ConvertFrom-Json
  foreach ($division in $json.divisions) {
    foreach ($agent in $division.agents) {
      $source = Join-Path $Root $agent.file
      if (Test-Path $source) {
        $destination = Join-Path $Target $agent.file
        $destinationDir = Split-Path $destination
        if (-not (Test-Path $destinationDir)) {
          New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
        }
        Copy-Item $source -Destination $destination -Force
        Write-Host "  - installed $($agent.file)"
      } else {
        Write-Warning "  - missing $($agent.file)"
      }
    }
  }
}

if ($ValidateOnly) {
  Validate-Repo
  Install-Agents
  exit 0
}

Validate-Repo
Install-Agents

Write-Host "Install complete. Installed available agents to $Target. Use scripts\convert.py to generate tool-specific packages."
