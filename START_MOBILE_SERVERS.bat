@echo off
echo ========================================
echo Starting Productivity Tracker Servers
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && python main.py"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo Servers Starting...
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo Mobile:   http://10.0.0.89:3000
echo.
echo Open MOBILE_ACCESS.html for mobile instructions
echo.
pause

