# MEATHUB - Backend Services Diagnostic & Fix Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BACKEND SERVICES DIAGNOSTIC" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "C:\Users\sango\OneDrive\Desktop\myProject_MEAT"

# Step 1: Check MySQL
Write-Host "1. Checking MySQL Service..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue
if ($mysqlService) {
    if ($mysqlService.Status -eq "Running") {
        Write-Host "   [OK] MySQL is running" -ForegroundColor Green
    } else {
        Write-Host "   [WARN] MySQL service exists but not running" -ForegroundColor Yellow
        Write-Host "   Attempting to start MySQL..." -ForegroundColor Cyan
        Start-Service $mysqlService.Name -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "   [WARN] MySQL service not found - services may fail" -ForegroundColor Yellow
}
Write-Host ""

# Step 2: Check Java
Write-Host "2. Checking Java..." -ForegroundColor Yellow
$javaVersion = java -version 2>&1 | Select-String "version"
if ($javaVersion) {
    Write-Host "   [OK] $javaVersion" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] Java not found!" -ForegroundColor Red
    exit
}
Write-Host ""

# Step 3: Check each service's application.properties
Write-Host "3. Checking Service Configurations..." -ForegroundColor Yellow
$services = @("auth-service", "user-service", "butcher-service", "order-service", "pet-service", "ai-service", "gym-service")

foreach ($service in $services) {
    $propsFile = "$projectRoot\$service\src\main\resources\application.properties"
    $ymlFile = "$projectRoot\$service\src\main\resources\application.yml"
    
    if (Test-Path $propsFile) {
        Write-Host "   [OK] $service has application.properties" -ForegroundColor Green
    } elseif (Test-Path $ymlFile) {
        Write-Host "   [OK] $service has application.yml" -ForegroundColor Green
    } else {
        Write-Host "   [WARN] $service missing configuration file" -ForegroundColor Yellow
    }
}
Write-Host ""

# Step 4: Check running services
Write-Host "4. Checking Running Services..." -ForegroundColor Yellow
$servicePorts = @(
    @{Name="API Gateway"; Port=8000},
    @{Name="Auth Service"; Port=8001},
    @{Name="User Service"; Port=8002},
    @{Name="Butcher Service"; Port=8003},
    @{Name="Order Service"; Port=8004},
    @{Name="Pet Service"; Port=8005},
    @{Name="AI Service"; Port=8006},
    @{Name="Gym Service"; Port=8007}
)

$runningCount = 0
$failedServices = @()

foreach ($svc in $servicePorts) {
    $conn = Get-NetTCPConnection -LocalPort $svc.Port -State Listen -ErrorAction SilentlyContinue
    if ($conn) {
        Write-Host "   [OK] $($svc.Name) (Port $($svc.Port))" -ForegroundColor Green
        $runningCount++
    } else {
        Write-Host "   [FAIL] $($svc.Name) (Port $($svc.Port))" -ForegroundColor Red
        $failedServices += $svc.Name
    }
}
Write-Host ""

# Step 5: Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DIAGNOSTIC SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services Running: $runningCount / 8" -ForegroundColor $(if($runningCount -eq 8){"Green"}else{"Yellow"})
Write-Host ""

if ($failedServices.Count -gt 0) {
    Write-Host "Failed Services:" -ForegroundColor Red
    foreach ($failed in $failedServices) {
        Write-Host "  - $failed" -ForegroundColor Red
    }
    Write-Host ""
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  POSSIBLE ISSUES & SOLUTIONS" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  1. MySQL not running - Start MySQL service" -ForegroundColor White
    Write-Host "  2. Database not created - Create databases manually" -ForegroundColor White
    Write-Host "  3. Port conflicts - Check if ports are already in use" -ForegroundColor White
    Write-Host "  4. application.properties errors - Check configuration" -ForegroundColor White
    Write-Host ""
    
    Write-Host "To manually start a service:" -ForegroundColor Yellow
    Write-Host "  cd path\to\service" -ForegroundColor White
    Write-Host "  mvn spring-boot:run" -ForegroundColor White
    Write-Host ""
    
    Write-Host "To view detailed errors:" -ForegroundColor Yellow
    Write-Host "  Check the PowerShell windows opened by START_ALL.ps1" -ForegroundColor White
    Write-Host "  Or run services manually to see console output" -ForegroundColor White
} else {
    Write-Host "[SUCCESS] All services are running!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to close..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
