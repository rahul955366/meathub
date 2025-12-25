@echo off
setlocal enabledelayedexpansion
echo ============================================
echo   TESTING BACKEND API ENDPOINTS
echo ============================================
echo.
echo This script will test if each service is responding
echo Make sure all services are running first!
echo.
pause

REM Test API Gateway
echo [1/14] Testing API Gateway (Port 8080)...
curl -s -o nul -w "%%{http_code}" http://localhost:8080/actuator/health 2>nul
if %errorlevel% equ 0 (
    echo    ✓ API Gateway is responding
) else (
    echo    ✗ API Gateway is not responding
)

REM Test Auth Service
echo [2/14] Testing Auth Service (Port 8081)...
curl -s -o nul -w "%%{http_code}" http://localhost:8081/actuator/health 2>nul
if %errorlevel% equ 0 (
    echo    ✓ Auth Service is responding
) else (
    echo    ✗ Auth Service is not responding
)

REM Test User Service
echo [3/14] Testing User Service (Port 8082)...
curl -s -o nul -w "%%{http_code}" http://localhost:8082/actuator/health 2>nul
if %errorlevel% equ 0 (
    echo    ✓ User Service is responding
) else (
    echo    ✗ User Service is not responding
)

REM Test Butcher Service
echo [4/14] Testing Butcher Service (Port 8083)...
curl -s -o nul -w "%%{http_code}" http://localhost:8083/actuator/health 2>nul
if %errorlevel% equ 0 (
    echo    ✓ Butcher Service is responding
) else (
    echo    ✗ Butcher Service is not responding
)

REM Test Order Service
echo [5/14] Testing Order Service (Port 8084)...
curl -s -o nul -w "%%{http_code}" http://localhost:8084/actuator/health 2>nul
if %errorlevel% equ 0 (
    echo    ✓ Order Service is responding
) else (
    echo    ✗ Order Service is not responding
)

REM Test through API Gateway
echo.
echo Testing services through API Gateway:
echo.

REM Test Auth endpoint (should be accessible without token)
echo Testing /auth endpoint...
curl -X GET http://localhost:8080/auth/test 2>nul
echo.

echo.
echo ============================================
echo   TEST COMPLETE
echo ============================================
echo.
echo If services show as "not responding", check:
echo   1. MySQL is running
echo   2. Services started without errors
echo   3. No port conflicts
echo.
pause
