@echo off
echo ============================================
echo   STARTING MEATHUB MICROSERVICES
echo ============================================
echo.
echo Starting services in recommended order...
echo Press Ctrl+C to stop all services
echo.

REM Start Auth Service (Critical - Must be first)
echo [1/14] Starting Auth Service (Port 8081)...
start "Auth Service" cmd /k "cd auth-service && java -jar target/auth-service-1.0.0.jar"
timeout /t 15 /nobreak >nul
echo    ✓ Auth Service started

REM Start User Service
echo [2/14] Starting User Service (Port 8082)...
start "User Service" cmd /k "cd user-service && java -jar target/user-service-1.0.0.jar"
timeout /t 10 /nobreak >nul
echo    ✓ User Service started

REM Start Butcher Service
echo [3/14] Starting Butcher Service (Port 8083)...
start "Butcher Service" cmd /k "cd butcher-service && java -jar target/butcher-service-1.0.0.jar"
timeout /t 10 /nobreak >nul
echo    ✓ Butcher Service started

REM Start Order Service
echo [4/14] Starting Order Service (Port 8084)...
start "Order Service" cmd /k "cd order-service && java -jar target/order-service-1.0.0.jar"
timeout /t 10 /nobreak >nul
echo    ✓ Order Service started

REM Start Subscription Service
echo [5/14] Starting Subscription Service (Port 8085)...
start "Subscription Service" cmd /k "cd subscription-service && java -jar target/subscription-service-1.0.0.jar"
timeout /t 10 /nobreak >nul
echo    ✓ Subscription Service started

REM Start Delivery Service
echo [6/14] Starting Delivery Service (Port 8086)...
start "Delivery Service" cmd /k "cd delivery-service && java -jar target/delivery-service-1.0.0.jar"
timeout /t 10 /nobreak >nul
echo    ✓ Delivery Service started

REM Start Gym Service
echo [7/14] Starting Gym Service (Port 8087)...
start "Gym Service" cmd /k "cd gym-service && java -jar target/gym-service-1.0.0.jar"
timeout /t 10 /nobreak >nul
echo    ✓ Gym Service started

REM Start Pet Service
echo [8/14] Starting Pet Service (Port 8088)...
start "Pet Service" cmd /k "cd pet-service && java -jar target/pet-service-1.0.0.jar"
timeout /t 10 /nobreak >nul
echo    ✓ Pet Service started

REM Start Media Service
echo [9/14] Starting Media Service (Port 8089)...
start "Media Service" cmd /k "cd media-service && java -jar target/media-service-1.0.0.jar"
timeout /t 10 /nobreak >nul
echo    ✓ Media Service started

REM Start Admin Service
echo [10/14] Starting Admin Service (Port 8090)...
start "Admin Service" cmd /k "cd admin-service && java -jar target/admin-service-1.0.0.jar"
timeout /t 10 /nobreak >nul
echo    ✓ Admin Service started

REM Start Notification Service
echo [11/14] Starting Notification Service (Port 8091)...
start "Notification Service" cmd /k "cd notification-service && java -jar target/notification-service-1.0.0.jar"
timeout /t 10 /nobreak >nul
echo    ✓ Notification Service started

REM Start AI Service
echo [12/14] Starting AI Service (Port 8092)...
start "AI Service" cmd /k "cd ai-service && java -jar target/ai-service-1.0.0.jar"
timeout /t 10 /nobreak >nul
echo    ✓ AI Service started

REM Start Blockchain Service
echo [13/14] Starting Blockchain Service (Port 8093)...
start "Blockchain Service" cmd /k "cd blockchain-service && java -jar target/blockchain-service-1.0.0.jar"
timeout /t 10 /nobreak >nul
echo    ✓ Blockchain Service started

REM Wait a bit before starting Gateway
echo.
echo Waiting for all services to initialize...
timeout /t 20 /nobreak >nul

REM Start API Gateway (Must be last)
echo [14/14] Starting API Gateway (Port 8000)...
start "API Gateway" cmd /k "cd api-gateway && java -jar target/api-gateway-1.0.0.jar"
echo    ✓ API Gateway started

echo.
echo ============================================
echo   ALL SERVICES STARTED!
echo ============================================
echo.
echo API Gateway available at: http://localhost:8000
echo.
echo Service Endpoints:
echo   - Auth:          http://localhost:8000/auth/**
echo   - Users:         http://localhost:8000/users/**
echo   - Butchers:      http://localhost:8000/butchers/**
echo   - Orders:        http://localhost:8000/orders/**
echo   - Cart:          http://localhost:8000/cart/**
echo   - Subscriptions: http://localhost:8000/subscriptions/**
echo   - Delivery:      http://localhost:8000/deliveries/**
echo   - Gym:           http://localhost:8000/gym/**
echo   - Pet:           http://localhost:8000/pet/**
echo   - Media:         http://localhost:8000/media/**
echo   - Admin:         http://localhost:8000/admin/**
echo   - Notifications: http://localhost:8000/notifications/**
echo   - AI:            http://localhost:8000/ai/**
echo   - Blockchain:    http://localhost:8000/blockchain/**
echo.
echo To stop services: Close the individual service windows
echo.
pause
