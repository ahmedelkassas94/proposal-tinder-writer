# Open the offline test page in your default browser - NO SERVER NEEDED
# Right-click this file -> Run with PowerShell. If you see "Proposal Writer – offline test", your browser works.
Set-Location $PSScriptRoot
$path = (Resolve-Path ".\test-page.html").Path
Start-Process $path
Write-Host "Opened test page in browser. You should see: Proposal Writer – offline test" -ForegroundColor Cyan
