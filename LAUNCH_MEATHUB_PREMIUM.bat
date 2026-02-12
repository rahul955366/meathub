@echo off
echo ======================================================
echo   MEATHUB PREMIUM: ONE-CLICK LAUNCHER
echo ======================================================
echo.

:: 1. Check if Docker is running
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] ERROR: Docker Desktop is not running.
    echo Please start Docker Desktop and wait for the "Whale" icon to turn green.
    echo.
    pause
    exit /b
)

echo [1/4] Starting Meathub Services (Docker)...
docker-compose up -d
if %errorlevel% neq 0 (
    echo [!] ERROR: Failed to start Docker containers.
    pause
    exit /b
)

echo.
echo [2/4] Waiting for Backend to be ready...
timeout /t 10 /nobreak >nul

echo.
echo [3/4] Running Database Migrations...
docker-compose exec -T backend python manage.py migrate

echo.
echo [4/4] POPULATING 10/10 MASSIVE INVENTORY...
echo (Seeding 49 products with unique imagery to all shops)
docker-compose exec -T backend python seed_data.py

echo.
echo ======================================================
echo   SUCCESS! MEATHUB IS LIVE WITH FULL INVENTORY
echo ======================================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo.
echo (Keep this window open or minimize it)
echo Press any key to view logs...
pause
docker-compose logs -f
