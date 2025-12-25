# MEATHUB - Quick Deploy to Vercel (Frontend Only)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BUILDING ALL FRONTENDS FOR DEPLOYMENT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = if (Test-Path "D:\myProject_MEAT") { "D:\myProject_MEAT" } else { "C:\Users\sango\OneDrive\Desktop\myProject_MEAT" }
cd $projectRoot

Write-Host "Project Root: $projectRoot" -ForegroundColor Yellow
Write-Host ""

# Build Customer Portal
Write-Host "1. Building Customer Portal..." -ForegroundColor Cyan
cd "$projectRoot\meatup-frontend"
if (Test-Path "node_modules") {
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] Customer Portal built successfully!" -ForegroundColor Green
        Write-Host "   Output: meatup-frontend/dist" -ForegroundColor Gray
    } else {
        Write-Host "   [FAIL] Customer Portal build failed!" -ForegroundColor Red
    }
} else {
    Write-Host "   [SKIP] Dependencies not installed. Run: npm install" -ForegroundColor Yellow
}
Write-Host ""

# Build Admin Portal
Write-Host "2. Building Admin Portal..." -ForegroundColor Magenta
cd "$projectRoot\admin-portal"
if (Test-Path "node_modules") {
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] Admin Portal built successfully!" -ForegroundColor Green
        Write-Host "   Output: admin-portal/dist" -ForegroundColor Gray
    } else {
        Write-Host "   [FAIL] Admin Portal build failed!" -ForegroundColor Red
    }
} else {
    Write-Host "   [SKIP] Dependencies not installed. Run: npm install" -ForegroundColor Yellow
}
Write-Host ""

# Build Butcher Portal
Write-Host "3. Building Butcher Portal..." -ForegroundColor Yellow
cd "$projectRoot\butcher-portal"
if (Test-Path "node_modules") {
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] Butcher Portal built successfully!" -ForegroundColor Green
        Write-Host "   Output: butcher-portal/dist" -ForegroundColor Gray
    } else {
        Write-Host "   [FAIL] Butcher Portal build failed!" -ForegroundColor Red
    }
} else {
    Write-Host "   [SKIP] Dependencies not installed. Run: npm install" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BUILD COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "NEXT STEPS FOR DEPLOYMENT:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option A: Deploy to Vercel (EASIEST - FREE)" -ForegroundColor Cyan
Write-Host "  1. Go to https://vercel.com" -ForegroundColor White
Write-Host "  2. Sign up with GitHub/Email" -ForegroundColor White
Write-Host "  3. Click 'New Project'" -ForegroundColor White
Write-Host "  4. Upload these folders one by one:" -ForegroundColor White
Write-Host "     - meatup-frontend/dist (Customer Portal)" -ForegroundColor Gray
Write-Host "     - admin-portal/dist (Admin Portal)" -ForegroundColor Gray
Write-Host "     - butcher-portal/dist (Butcher Portal)" -ForegroundColor Gray
Write-Host "  5. Get your live URLs!" -ForegroundColor White
Write-Host ""

Write-Host "Option B: Deploy to Netlify (ALSO FREE)" -ForegroundColor Cyan
Write-Host "  1. Go to https://netlify.com" -ForegroundColor White
Write-Host "  2. Drag and drop dist folders" -ForegroundColor White
Write-Host "  3. Instant deployment!" -ForegroundColor White
Write-Host ""

Write-Host "Option C: Use Vercel CLI (FASTEST)" -ForegroundColor Cyan
Write-Host "  1. Install Vercel CLI: npm install -g vercel" -ForegroundColor White
Write-Host "  2. Deploy each portal:" -ForegroundColor White
Write-Host "     cd meatup-frontend && vercel" -ForegroundColor Gray
Write-Host "     cd admin-portal && vercel" -ForegroundColor Gray
Write-Host "     cd butcher-portal && vercel" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Build folders are ready for deployment!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Press any key to close..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
