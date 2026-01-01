@echo off
echo ========================================
echo Deploy Productivity Tracker to GitHub
echo ========================================
echo.

echo [Step 1/6] Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo ERROR: Git not found! Please install Git first.
    pause
    exit /b 1
)

echo.
echo [Step 2/6] Adding all files...
git add .

echo.
echo [Step 3/6] Creating initial commit...
git commit -m "Initial commit: Productivity Tracker app"

echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Go to https://github.com and create a new repository
echo 2. Name it: productivity-tracker
echo 3. DO NOT initialize with README
echo 4. Copy the repository URL
echo 5. Run these commands (replace YOUR_USERNAME):
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/productivity-tracker.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo ========================================
echo.
echo Open GITHUB_DEPLOY.html for detailed instructions!
echo.
pause

