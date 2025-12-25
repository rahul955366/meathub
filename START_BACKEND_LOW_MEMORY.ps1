# MEATHUB - Start All Backend Services with Reduced Memory

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STARTING BACKEND SERVICES" -ForegroundColor Cyan
Write-Host "  (With Reduced Memory Settings)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "C:\Users\sango\OneDrive\Desktop\myProject_MEAT"

# Set Java memory options (reduced for systems with limited RAM)
$env:MAVEN_OPTS="-Xms256m -Xmx512m"

Write-Host "Memory Settings: Xms256m Xmx512m" -ForegroundColor Yellow
Write-Host ""

function Start-ServiceWithMemory {
    param($Name, $Path, $Port, $Color = "Green")
    Write-Host "Starting $Name (Port $Port)..." -ForegroundColor $Color
    $cmd = "cd '$projectRoot\$Path'; `$env:MAVEN_OPTS='-Xms256m -Xmx512m'; mvn spring-boot:run"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd
    Start-Sleep -Seconds 3
}

# Start services with memory limits
Write-Host "Starting services in separate windows..." -ForegroundColor Cyan
Write-Host ""

Start-ServiceWithMemory "Auth Service" "auth-service" 8001 "Green"
Start-ServiceWithMemory "User Service" "user-service" 8002 "Green"
Start-ServiceWithMemory "Butcher Service" "butcher-service" 8003 "Green"
Start-ServiceWithMemory "Order Service" "order-service" 8004 "Green"
Start-ServiceWithMemory "Pet Service" "pet-service" 8005 "Green"
Start-ServiceWithMemory "AI Service" "ai-service" 8006 "Green"
Start-ServiceWithMemory "Gym Service" "gym-service" 8007 "Green"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SERVICES STARTING!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services are starting in separate windows." -ForegroundColor Yellow
Write-Host "This may take 1-2 minutes..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Check each window for status." -ForegroundColor White
Write-Host "Look for 'Started' message in each window." -ForegroundColor White
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
