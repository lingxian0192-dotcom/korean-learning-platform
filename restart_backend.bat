@echo off
echo ===================================================
echo      LingKR Backend Server Restart Script
echo ===================================================
echo.
echo [1/2] Checking for existing process on port 3001...

for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do (
    echo Found process %%a on port 3001, killing it...
    taskkill /f /pid %%a
)

echo.
echo [2/2] Starting server...
echo.
cd /d "%~dp0"
npm.cmd run start:dev --workspace=apps/server

pause