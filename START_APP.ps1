# Run Proposal Writer without admin - uses portable Node in this folder
# Double-click or: Right-click -> Run with PowerShell (or run from terminal)
Set-Location $PSScriptRoot
$nodeDir = (Resolve-Path "./node-runtime/node-v20.11.1-win-x64").Path
$env:PATH = "$nodeDir;" + $env:PATH
$env:NODE_ENV = "development"
Write-Host "Starting app... Open http://127.0.0.1:3000 in your browser (or the port shown below)." -ForegroundColor Cyan
& "./node-runtime/node-v20.11.1-win-x64/npm.cmd" run dev
