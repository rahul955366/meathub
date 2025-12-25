@echo off
echo ============================================
echo   MEATHUB - COMPLETE PROJECT LAUNCHER
echo ============================================
echo.

REM Check if MySQL is running
echo [1/3] Checking MySQL...
netstat -an | findstr ":3306" >nul
if %errorlevel% neq 0 (
    echo    ⚠ WARNING: MySQL may not be running on port 3306
    echo    Please ensure MySQL is started before continuing
    echo.
    pause
) else (
    echo    ✓ MySQL is running
)

echo.
echo [2/3] Starting Backend Services...
echo    This will open 14 service windows...
echo    Please wait for all services to start...
echo.
call start_all_services.bat

echo.
echo Waiting 30 seconds for all services to initialize...
timeout /t 30 /nobreak >nul

echo.
echo [3/3] Starting Frontend...
echo    Frontend will open in your browser at http://localhost:5173
echo.
cd "MEATHUB Application Design"
start "MEATHUB Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ============================================
echo   PROJECT STARTED!
echo ============================================
echo.
echo Backend API Gateway: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Testing Checklist:
echo   1. Open http://localhost:5173 in browser
echo   2. Click Login/Register
echo   3. Register a new user
echo   4. Browse products
echo   5. Add items to cart
echo   6. Place an order
echo   7. Test AI chat
echo.
echo To stop:
echo   - Close all service windows
echo   - Close frontend window
echo.
pause

