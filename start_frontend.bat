@echo off
echo ====================================
echo   MEATHUB FRONTEND - STARTING
echo ====================================
echo.

cd frontend

echo [1/2] Installing dependencies...
call npm install

echo.
echo [2/2] Starting development server...
echo.
echo Frontend will be available at: http://localhost:5173
echo.
call npm run dev
