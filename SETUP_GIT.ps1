# MEATHUB - Push to GitHub Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PUSHING MEATHUB TO GITHUB" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = if (Test-Path "D:\myProject_MEAT") { "D:\myProject_MEAT" } else { "C:\Users\sango\OneDrive\Desktop\myProject_MEAT" }
cd $projectRoot

Write-Host "Project Root: $projectRoot" -ForegroundColor Yellow
Write-Host ""

# Step 1: Configure Git
Write-Host "Step 1: Configuring Git..." -ForegroundColor Cyan
git config --global user.name "rahul955366"
git config --global user.email "sangojurahulbhargava@gmail.com"
Write-Host "  [OK] Git configured" -ForegroundColor Green
Write-Host ""

# Step 2: Initialize Repository
Write-Host "Step 2: Initializing Git repository..." -ForegroundColor Cyan
if (Test-Path ".git") {
    Write-Host "  [INFO] Git repository already initialized" -ForegroundColor Yellow
} else {
    git init
    Write-Host "  [OK] Git repository initialized" -ForegroundColor Green
}
Write-Host ""

# Step 3: Add all files
Write-Host "Step 3: Adding files to Git..." -ForegroundColor Cyan
git add .
Write-Host "  [OK] All files staged" -ForegroundColor Green
Write-Host ""

# Step 4: Create initial commit
Write-Host "Step 4: Creating initial commit..." -ForegroundColor Cyan
git commit -m "Initial commit: MEATHUB Multi-Portal Platform

- Added 3 frontend portals (Customer, Admin, Butcher)
- Added 8 backend microservices
- Complete documentation
- Deployment scripts
- Professional UI/UX
- AI assistant integration"

if ($LASTEXITCODE -eq 0) {
    Write-Host "  [OK] Initial commit created" -ForegroundColor Green
} else {
    Write-Host "  [WARN] Commit may have issues (this is okay if no changes)" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Instructions for GitHub
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NEXT STEPS - CREATE GITHUB REPO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Go to: https://github.com/new" -ForegroundColor Yellow
Write-Host "2. Repository name: meathub" -ForegroundColor White
Write-Host "3. Description: Multi-Portal Meat Delivery Platform" -ForegroundColor White
Write-Host "4. Choose: Public (recommended for portfolio)" -ForegroundColor White
Write-Host "5. DO NOT initialize with README (we already have one)" -ForegroundColor White
Write-Host "6. Click 'Create repository'" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AFTER CREATING GITHUB REPO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Run these commands:" -ForegroundColor Yellow
Write-Host ""
Write-Host "git remote add origin https://github.com/rahul955366/meathub.git" -ForegroundColor White
Write-Host "git branch -M main" -ForegroundColor White
Write-Host "git push -u origin main" -ForegroundColor White
Write-Host ""

Write-Host "OR use this shortcut:" -ForegroundColor Yellow
Write-Host ""
Write-Host ".\PUSH_TO_GITHUB.ps1" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  READY TO PUSH!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Press any key to close..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
