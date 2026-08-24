@echo off
echo ===================================================
echo   Pushing CareerPilot AI to GitHub Repository
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/4] Setting remote repository URL...
git remote remove origin 2>nul
git remote add origin https://github.com/akashgautam5245-cmd/CareerPilot-AI.git

echo [2/4] Staging files...
git add .

echo [3/4] Creating commit...
git commit -m "fix: add root package.json for Render build auto-discovery"

echo [4/4] Pushing to main branch...
git branch -M main
git push -u origin main --force

echo.
echo ===================================================
echo   SUCCESS! Project pushed to CareerPilot-AI
echo ===================================================
pause
