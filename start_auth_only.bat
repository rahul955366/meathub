@echo off
echo ========================================
echo   Starting Auth Service ONLY
echo ========================================
echo.
cd auth-service
echo Starting Auth Service on port 8081...
java -jar target/auth-service-1.0.0.jar
pause
