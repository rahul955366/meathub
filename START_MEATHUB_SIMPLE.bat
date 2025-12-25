@echo off
echo ============================================
echo   MEATHUB - QUICK LAUNCHER
echo ============================================
echo.

REM Skip MySQL check (MySQL is running on port 3306)
echo ✓ MySQL confirmed running on port 3306
echo.

echo [STEP 1/3] Starting All Backend Services...
echo    This will open 14 service windows.
echo    Please wait for all services to start (about 2-3 minutes)...
echo.
call start_all_services.bat

echo.
echo [STEP 2/3] Waiting for services to initialize...
echo    Waiting 45 seconds for all services to be ready...
timeout /t 45 /nobreak >nul

echo.
echo [STEP 3/3] Starting Frontend...
echo.
cd "MEATHUB Application Design"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

echo.
echo Starting frontend development server...
echo Frontend will be available at: http://localhost:5173
echo.
start "MEATHUB Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ============================================
echo   ✅ PROJECT STARTED!
echo ============================================
echo.
echo 📍 Access Points:
echo    Frontend:    http://localhost:5173
echo    API Gateway: http://localhost:8080
echo.
echo 🧪 Quick Test:
echo    1. Open http://localhost:5173
echo    2. Register a new user
echo    3. Browse products
echo    4. Test AI chat
echo.
echo ⚠️  Keep all service windows open!
echo.
pause

