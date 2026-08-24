Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Pushing CareerPilot AI to GitHub Repository" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

$repoUrl = "https://github.com/akashgautam5245-cmd/CareerPilot-AI.git"

Write-Host "`n[1/4] Setting git remote origin..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $repoUrl

Write-Host "`n[2/4] Staging project files..." -ForegroundColor Yellow
git add .

Write-Host "`n[3/4] Creating git commit..." -ForegroundColor Yellow
git commit -m "feat: complete CareerPilot AI - AI-Powered Career, Skill-Gap & Placement Intelligence Platform"

Write-Host "`n[4/4] Pushing to main branch on GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main --force

Write-Host "`n===================================================" -ForegroundColor Green
Write-Host "  SUCCESS! Project pushed to $repoUrl" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
