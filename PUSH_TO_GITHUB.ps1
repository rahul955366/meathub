# MEATHUB - Push to GitHub (After repo is created)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PUSHING TO GITHUB" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = if (Test-Path "D:\myProject_MEAT") { "D:\myProject_MEAT" } else { "C:\Users\sango\OneDrive\Desktop\myProject_MEAT" }
cd $projectRoot

# Add remote
Write-Host "Adding GitHub remote..." -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin https://github.com/rahul955366/meathub.git
Write-Host "  [OK] Remote added" -ForegroundColor Green
Write-Host ""

# Set main branch
Write-Host "Setting main branch..." -ForegroundColor Cyan
git branch -M main
Write-Host "  [OK] Branch set to main" -ForegroundColor Green
Write-Host ""

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "(You may be prompted for GitHub credentials)" -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SUCCESS! PUSHED TO GITHUB!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your repository:" -ForegroundColor Cyan
    Write-Host "https://github.com/rahul955366/meathub" -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Visit your repository on GitHub" -ForegroundColor White
    Write-Host "  2. Add topics/tags to your repo" -ForegroundColor White
    Write-Host "  3. Star your own repo!" -ForegroundColor White
    Write-Host "  4. Share the link!" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  PUSH FAILED" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible reasons:" -ForegroundColor Yellow
    Write-Host "  1. Repository doesn't exist on GitHub yet" -ForegroundColor White
    Write-Host "     - Create it at: https://github.com/new" -ForegroundColor White
    Write-Host "  2. Authentication failed" -ForegroundColor White
    Write-Host "     - You may need to use Personal Access Token" -ForegroundColor White
    Write-Host "  3. Remote URL is incorrect" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "Press any key to close..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
