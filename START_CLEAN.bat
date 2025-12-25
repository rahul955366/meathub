@echo off
echo ============================================
echo   MEATHUB - CLEAN START
echo ============================================
echo.

echo [1/4] Killing processes on ports 8080 and 5173...
call KILL_PORTS.bat >nul 2>&1
timeout /t 2 /nobreak >nul
echo    ✓ Ports cleared
echo.

echo [2/4] Checking MySQL...
netstat -ano | findstr ":3306" | findstr "LISTENING" >nul
if %errorlevel% equ 0 (
    echo    ✓ MySQL is running
) else (
    echo    ⚠ MySQL may not be running on port 3306
    echo    Please start MySQL first!
    pause
    exit /b 1
)
echo.

echo [3/4] Starting Backend Services...
echo    This will open 14 service windows.
echo    Please wait 2-3 minutes for all services to start...
echo.
call start_all_services.bat

echo.
echo [4/4] Waiting for services to initialize (60 seconds)...
timeout /t 60 /nobreak >nul

echo.
echo Starting Frontend...
cd "MEATHUB Application Design"

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Frontend will start on http://localhost:5173
echo.
start "MEATHUB Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ============================================
echo   ✅ STARTUP COMPLETE!
echo ============================================
echo.
echo 📍 Access:
echo    Frontend:    http://localhost:5173
echo    API Gateway: http://localhost:8080
echo.
echo ⚠️  Keep all service windows open!
echo.
echo Press any key to exit this window...
pause >nul

