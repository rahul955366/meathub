@echo off
echo ============================================
echo   MEATHUB - COMPLETE PROJECT LAUNCHER
echo ============================================
echo.

REM Step 1: Verify Backend
echo [STEP 1/4] Verifying Backend Setup...
echo.
call verify_backend.bat
if %errorlevel% neq 0 (
    echo.
    echo ⚠ Backend verification failed!
    echo Please fix the issues above before continuing.
    pause
    exit /b 1
)

echo.
echo [STEP 2/4] Starting All Backend Services...
echo    This will open 14 service windows.
echo    Please wait for all services to start (about 2-3 minutes)...
echo.
call start_all_services.bat

echo.
echo [STEP 3/4] Waiting for services to initialize...
echo    Waiting 45 seconds for all services to be ready...
timeout /t 45 /nobreak >nul

echo.
echo [STEP 4/4] Starting Frontend...
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
echo   ✅ PROJECT STARTED SUCCESSFULLY!
echo ============================================
echo.
echo 📍 Access Points:
echo    Frontend:    http://localhost:5173
echo    API Gateway: http://localhost:8080
echo.
echo 🧪 Testing Instructions:
echo.
echo 1. AUTHENTICATION TEST:
echo    - Open http://localhost:5173
echo    - Click "Login" or "Register"
echo    - Register a new user (email: test@test.com, password: test123)
echo    - Login with the same credentials
echo.
echo 2. PRODUCT BROWSING TEST:
echo    - After login, browse products on home page
echo    - Click on any product to see details
echo    - Products should load from backend API
echo.
echo 3. CART & ORDER TEST:
echo    - Add products to cart
echo    - Go to cart page
echo    - Place an order
echo    - Check order status on home page
echo.
echo 4. AI CHAT TEST:
echo    - Click the AI assistant button (bottom right)
echo    - Send a message like "Track my order"
echo    - Should get real AI response
echo.
echo 5. SUBSCRIPTION TEST:
echo    - Go to product detail page
echo    - Click "Subscribe"
echo    - Create a subscription
echo.
echo ⚠️  IMPORTANT NOTES:
echo    - All 14 service windows must stay open
echo    - Frontend window must stay open
echo    - If services fail to start, check the service windows for errors
echo    - Ensure MySQL is running on port 3306
echo.
echo 🛑 To Stop:
echo    - Close all service windows
echo    - Close frontend window
echo    - Or press Ctrl+C in each window
echo.
pause

