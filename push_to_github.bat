@echo off
echo ===================================================
echo   Pushing SolveFlow AI to GitHub Repository
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/5] Removing existing remote...
git remote remove origin

echo [2/5] Setting remote repository URL...
git remote add origin https://github.com/akashgautam5245-cmd/Smart-Daily-Work-Problem-Management-System.git

echo [3/5] Staging files...
git add .

echo [4/5] Creating commit...
git commit -m "feat: add render.yaml infrastructure blueprint for Render deployment"

echo [5/5] Pushing to GitHub main branch...
git branch -M main
git push -u origin main --force

echo.
echo ===================================================
echo   SUCCESS! Check your repository at:
echo   https://github.com/akashgautam5245-cmd/Smart-Daily-Work-Problem-Management-System
echo ===================================================
pause
