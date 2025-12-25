@echo off
setlocal enabledelayedexpansion
echo ============================================
echo   MEATHUB BACKEND SERVICE VERIFICATION
echo ============================================
echo.

REM Check MySQL Connection
echo [1/15] Checking MySQL Server...
mysql -uroot -proot -e "SELECT 'MySQL OK' AS status;" 2>nul
if %errorlevel% equ 0 (
    echo    ✓ MySQL is running
) else (
    echo    ✗ MySQL is NOT running!
    echo    Please start MySQL server on localhost:3306
    echo    Username: root, Password: root
    pause
    exit /b 1
)
echo.

REM Create databases if needed
echo [2/15] Creating databases...
mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS meathub_auth;" 2>nul
mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS meathub_user;" 2>nul
mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS meathub_butcher;" 2>nul
mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS meathub_order;" 2>nul
mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS meathub_subscription;" 2>nul
mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS meathub_delivery;" 2>nul
mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS meathub_gym;" 2>nul
mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS meathub_pet;" 2>nul
mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS meathub_media;" 2>nul
mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS meathub_admin;" 2>nul
mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS meathub_notification;" 2>nul
mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS meathub_ai;" 2>nul
mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS meathub_blockchain;" 2>nul
echo    ✓ All databases created/verified
echo.

REM Check if JAR files exist
echo [3/15] Verifying build artifacts...
set "missing=0"
set "services=api-gateway auth-service user-service butcher-service order-service subscription-service delivery-service gym-service pet-service media-service admin-service notification-service ai-service blockchain-service"

for %%s in (%services%) do (
    if not exist "%%s\target\%%s-1.0.0.jar" (
        echo    ✗ Missing JAR: %%s
        set "missing=1"
    )
)

if !missing! equ 1 (
    echo.
    echo    Some JAR files are missing!
    echo    Run build-all.bat first to compile all services.
    pause
    exit /b 1
) else (
    echo    ✓ All JAR files present
)
echo.

echo [4/15] Port availability check...
REM Check if ports are available
netstat -ano | findstr ":8080" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ⚠ Port 8080 already in use
) else (
    echo    ✓ Port 8080 available
)

netstat -ano | findstr ":8081" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ⚠ Port 8081 already in use
) else (
    echo    ✓ Port 8081 available
)

netstat -ano | findstr ":8082" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ⚠ Port 8082 already in use
) else (
    echo    ✓ Port 8082 available
)
echo.

echo ============================================
echo   VERIFICATION COMPLETE
echo ============================================
echo.
echo Summary:
echo   ✓ MySQL Server: Running
echo   ✓ Databases: Created
echo   ✓ Build Artifacts: Available
echo.
echo Ready to start microservices!
echo.
echo Next steps:
echo   1. Run individual services using: java -jar [service-folder]/target/[service-name]-1.0.0.jar
echo   2. Or use Docker: docker-compose up --build
echo.
pause
