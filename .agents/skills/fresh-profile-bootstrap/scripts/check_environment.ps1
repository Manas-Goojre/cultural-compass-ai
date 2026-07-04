# Quick environment health check for PromptWars bootstrap.
# Runs automatically when the workspace folder is opened (see .vscode/tasks.json), and can also be
# run manually. Writes a plain-text snapshot to last_check.txt next to this script so the agent can
# read the result on its very first turn without re-running anything.

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$outFile = Join-Path $scriptDir "last_check.txt"

function Test-Cmd($name) { return [bool](Get-Command $name -ErrorAction SilentlyContinue) }

$lines = @()
$lines += "Generated: $(Get-Date -Format o)"

$lines += "`n[git]"
$gitName = git config --global user.name 2>$null
$gitEmail = git config --global user.email 2>$null
$lines += "installed=$(Test-Cmd git)"
$lines += "user.name=$(if ($gitName) { $gitName } else { 'NOT SET' })"
$lines += "user.email=$(if ($gitEmail) { $gitEmail } else { 'NOT SET' })"

$lines += "`n[github_cli]"
$lines += "installed=$(Test-Cmd gh)"
if (Test-Cmd gh) {
    $ghStatus = gh auth status 2>&1 | Out-String
    $lines += "authenticated=$($ghStatus -match 'Logged in')"
    $ghStatusOneLine = ($ghStatus.Trim() -split "`r?`n") -join ' | '
    $lines += "raw_status=$ghStatusOneLine"
} else {
    $lines += "authenticated=false"
}

$lines += "`n[gcloud]"
$lines += "installed=$(Test-Cmd gcloud)"
if (Test-Cmd gcloud) {
    $activeAccount = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
    $activeProject = gcloud config get-value project 2>$null
    $lines += "active_account=$(if ($activeAccount) { $activeAccount } else { 'NOT SET' })"
    $lines += "active_project=$(if ($activeProject) { $activeProject } else { 'NOT SET' })"
} else {
    $lines += "active_account=NOT SET"
    $lines += "active_project=NOT SET"
}

$lines += "`n[env_vars]"
$lines += "GOOGLE_CLOUD_PROJECT=$(if ($env:GOOGLE_CLOUD_PROJECT) { $env:GOOGLE_CLOUD_PROJECT } else { 'NOT SET' })"
$lines += "GOOGLE_CLOUD_REGION=$(if ($env:GOOGLE_CLOUD_REGION) { $env:GOOGLE_CLOUD_REGION } else { 'NOT SET' })"

$lines += "`n[runtimes]"
$lines += "node_installed=$(Test-Cmd node)"
if (Test-Cmd node) { $lines += "node_version=$(node --version)" }
$lines += "python_installed=$(Test-Cmd python)"
if (Test-Cmd python) { $lines += "python_version=$(python --version 2>&1)" }
$lines += "winget_installed=$(Test-Cmd winget)"

$lines | Out-File -FilePath $outFile -Encoding utf8
$lines | Write-Host
Write-Host "`n(snapshot written to $outFile)"
