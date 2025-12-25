# MEATHUB - Master Startup Script
# Starts ALL Backend Services + ALL Frontend Portals

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MEATHUB - COMPLETE SYSTEM STARTUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "C:\Users\sango\OneDrive\Desktop\myProject_MEAT"
cd $projectRoot

Write-Host "Project Root: $projectRoot" -ForegroundColor Yellow
Write-Host ""

# Kill any existing processes on our ports
Write-Host "Killing existing processes..." -ForegroundColor Red
$ports = @(8000, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 5173, 5174, 5175)
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($process) {
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Write-Host "  Killed process on port $port" -ForegroundColor Gray
    }
}
Write-Host ""

# Function to start a service in a new window
function Start-MicroService {
    param($Name, $Path, $Color = "Green")
    Write-Host "Starting $Name..." -ForegroundColor $Color
    $cmd = "cd '$projectRoot\$Path'; mvn spring-boot:run"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd -WindowStyle Minimized
    Start-Sleep -Seconds 2
}

function Start-Frontend {
    param($Name, $Path, $Port, $Color = "Cyan")
    Write-Host "Starting $Name on port $Port..." -ForegroundColor $Color
    $cmd = "cd '$projectRoot\$Path'; npm run dev"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd -WindowStyle Minimized
    Start-Sleep -Seconds 2
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STARTING BACKEND SERVICES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Backend Services in order
Start-MicroService "API Gateway (8000)" "api-gateway" "Magenta"
Start-Sleep -Seconds 5

Start-MicroService "Auth Service (8001)" "auth-service" "Green"
Start-MicroService "User Service (8002)" "user-service" "Green"
Start-MicroService "Butcher Service (8003)" "butcher-service" "Green"
Start-MicroService "Order Service (8004)" "order-service" "Green"
Start-MicroService "Pet Service (8005)" "pet-service" "Green"
Start-MicroService "AI Service (8006)" "ai-service" "Green"
Start-MicroService "Gym Service (8007)" "gym-service" "Green"

Write-Host ""
Write-Host "Waiting 20 seconds for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STARTING FRONTEND PORTALS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Frontend Portals
Start-Frontend "Customer Portal" "meatup-frontend" 5173 "Blue"
Start-Sleep -Seconds 3

Start-Frontend "Admin Portal" "admin-portal" 5174 "Magenta"
Start-Sleep -Seconds 3

Start-Frontend "Butcher Portal" "butcher-portal" 5175 "Yellow"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ALL SERVICES STARTED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "FRONTEND PORTALS:" -ForegroundColor Cyan
Write-Host "  Customer Portal:  http://localhost:5173" -ForegroundColor Blue
Write-Host "  Admin Portal:     http://localhost:5174" -ForegroundColor Magenta
Write-Host "  Butcher Portal:   http://localhost:5175" -ForegroundColor Yellow
Write-Host ""

Write-Host "BACKEND SERVICES:" -ForegroundColor Cyan
Write-Host "  API Gateway:      http://localhost:8000" -ForegroundColor White
Write-Host "  Auth Service:     http://localhost:8001" -ForegroundColor Gray
Write-Host "  User Service:     http://localhost:8002" -ForegroundColor Gray
Write-Host "  Butcher Service:  http://localhost:8003" -ForegroundColor Gray
Write-Host "  Order Service:    http://localhost:8004" -ForegroundColor Gray
Write-Host "  Pet Service:      http://localhost:8005" -ForegroundColor Gray
Write-Host "  AI Service:       http://localhost:8006" -ForegroundColor Gray
Write-Host "  Gym Service:      http://localhost:8007" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LOGIN CREDENTIALS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "ADMIN LOGIN:" -ForegroundColor Magenta
Write-Host "   Email:    admin@meathub.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host ""

Write-Host "BUTCHER LOGIN:" -ForegroundColor Yellow
Write-Host "   Email:    butcher@meathub.com" -ForegroundColor White
Write-Host "   Password: butcher123" -ForegroundColor White
Write-Host ""

Write-Host "CUSTOMER LOGIN:" -ForegroundColor Blue
Write-Host "   Register or use existing credentials" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ENJOY YOUR MEATHUB PLATFORM!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Press any key to close this window (services will keep running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
