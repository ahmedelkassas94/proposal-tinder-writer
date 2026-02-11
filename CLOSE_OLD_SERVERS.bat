@echo off
REM Closes processes using ports 3000-3005 (old Proposal Writer servers).
REM Run this if you see "Port 3000 is in use". Then run START_APP_AND_OPEN.bat again.
echo Stopping processes on ports 3000-3005...
powershell -NoProfile -Command "3000..3005 | ForEach-Object { $p = $_; Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } }"
echo Done. You can now run START_APP_AND_OPEN.bat to use port 3000.
pause
