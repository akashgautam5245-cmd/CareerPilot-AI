# Adds standard Node.js installation paths to current PowerShell session PATH
$env:Path += ";C:\Program Files\nodejs;$env:AppData\npm;C:\Program Files (x86)\nodejs"

Write-Host "Checking Node.js & npm..." -ForegroundColor Cyan
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "✅ Node.js Version: $(node -v)" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found in standard paths. Please install Node.js from https://nodejs.org" -ForegroundColor Red
}

if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "✅ npm Version: $(npm -v)" -ForegroundColor Green
} else {
    Write-Host "❌ npm not found." -ForegroundColor Red
}
