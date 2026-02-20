@echo off
REM Run the Proposal Writer desktop app (after building with BUILD_DESKTOP_APP.bat)
REM Or run in dev mode if not built yet

cd /d "%~dp0"

set "NODE_DIR=%~dp0node-runtime\node-v20.11.1-win-x64"
set "PATH=%NODE_DIR%;%PATH%"

REM Check if built exe exists
if exist "dist-electron\Proposal Writer*.exe" (
    echo Starting Proposal Writer...
    start "" "dist-electron\Proposal Writer*.exe"
    exit /b 0
)

REM Otherwise run in dev mode
echo No built app found. Running in development mode...
echo (To create a standalone .exe, run BUILD_DESKTOP_APP.bat first)
echo.

call npm run electron:dev
