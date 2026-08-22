@echo off
echo ===================================================
echo   Pushing SolveFlow AI to GitHub Repository
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/5] Setting remote repository URL...
git remote remove origin 2>nul
git remote add origin https://github.com/akashgautam5245-cmd/Smart-Daily-Work-Problem-Management-System.git

echo [2/5] Staging files...
git add .

echo [3/5] Creating commit...
git commit -m "fix: update client build script to vite build for Vercel deployment"

echo [4/5] Pushing to main branch...
git branch -M main
git push -u origin main --force

echo [5/5] Pushing to newrepo1...
git remote remove newrepo1 2>nul
git remote add newrepo1 https://github.com/akashgautam5245-cmd/newrepo1.git 2>nul
git push -u newrepo1 main --force 2>nul

echo.
echo ===================================================
echo   SUCCESS!
echo ===================================================
pause
