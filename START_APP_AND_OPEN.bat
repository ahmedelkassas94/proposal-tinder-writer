@echo off
REM Double-click this file to start the app and open the browser.
REM A black window will open for the server - leave it open.
cd /d "%~dp0"

set "NODE_DIR=%~dp0node-runtime\node-v20.11.1-win-x64"
set "PATH=%NODE_DIR%;%PATH%"

echo Starting the app in a new window...
start "Proposal Writer - Server" cmd /k "cd /d "%~dp0" && set "PATH=%NODE_DIR%;%PATH%" && npm run dev"

echo Waiting 30 seconds for the server to start...
timeout /t 30 /nobreak >nul

echo.
echo Look at the SERVER window - it shows which port is used (e.g. 3000 or 3005).
echo Opening browser - if 3000 was in use, try the port shown in the server window.
start http://127.0.0.1:3000/ok
start http://127.0.0.1:3005/ok

echo.
echo If one page shows "OK - Server is responding.", use THAT port for the app (e.g. http://localhost:3005).
echo Next time: close other CMD windows running the app so only one server runs on port 3000.
pause
