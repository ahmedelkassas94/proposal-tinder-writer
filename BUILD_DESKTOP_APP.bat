@echo off
REM Build the Proposal Writer as a desktop application (.exe)
REM This creates a portable .exe in dist-electron folder

cd /d "%~dp0"

set "NODE_DIR=%~dp0node-runtime\node-v20.11.1-win-x64"
set "PATH=%NODE_DIR%;%PATH%"

echo.
echo ========================================
echo   Building Proposal Writer Desktop App
echo ========================================
echo.

echo Step 1: Installing dependencies (including Electron)...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo Step 2: Generating Prisma client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: prisma generate failed
    pause
    exit /b 1
)

echo.
echo Step 3: Building Next.js app...
call npm run build
if errorlevel 1 (
    echo ERROR: next build failed
    pause
    exit /b 1
)

echo.
echo Step 4: Building Electron app...
call npm run electron:build
if errorlevel 1 (
    echo ERROR: electron-builder failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo   BUILD COMPLETE!
echo ========================================
echo.
echo Your desktop app is in: dist-electron\
echo Look for "Proposal Writer*.exe"
echo.
pause
