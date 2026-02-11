# 1) Start the app in a NEW window (so it keeps running and you see logs)
# 2) Wait for the server to be ready
# 3) Open your browser to http://127.0.0.1:3000/ok
# Double-click this file, or run from PowerShell.
Set-Location $PSScriptRoot
$nodeDir = (Resolve-Path "./node-runtime/node-v20.11.1-win-x64").Path
$env:PATH = "$nodeDir;" + $env:PATH
$env:NODE_ENV = "development"

Write-Host "Starting the app in a new window..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; `$env:PATH = '$nodeDir;' + `$env:PATH; npm run dev"

Write-Host "Waiting 30 seconds for the server to start (first time can be slow)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host "Opening browser to http://127.0.0.1:3000/ok" -ForegroundColor Green
Start-Process "http://127.0.0.1:3000/ok"

Write-Host "If the page is still blank, wait 1 minute and refresh. Check the OTHER window for errors." -ForegroundColor Cyan
