Param(
  [switch]$ValidateOnly
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
  Write-Host "Listing agents from divisions.json..."
  $json = Get-Content (Join-Path $Root 'divisions.json') -Raw | ConvertFrom-Json
  foreach ($division in $json.divisions) {
    foreach ($agent in $division.agents) {
      $file = Join-Path $Root $agent.file
      if (Test-Path $file) {
        Write-Host "  - validating $($agent.file)"
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

Write-Host "Install complete. Use scripts\convert.py to generate tool-specific packages."
