@echo off
echo ============================================
echo   MEATHUB - LAUNCHER WITH MYSQL CHECK
echo ============================================
echo.

REM Check MySQL
echo Checking MySQL...
mysql -uroot -proot -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  MySQL is NOT running or not accessible!
    echo.
    echo Please start MySQL first:
    echo   1. Open Services (Win+R, type: services.msc)
    echo   2. Find "MySQL" or "MySQL80" service
    echo   3. Right-click and Start
    echo.
    echo Or if using XAMPP/WAMP:
    echo   - Start MySQL from control panel
    echo.
    echo After MySQL is running, run this script again.
    echo.
    pause
    exit /b 1
)

echo ✓ MySQL is running
echo.

REM Continue with normal startup
call START_MEATHUB.bat

