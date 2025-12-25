@echo off
echo Stopping API Gateway...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 3 /nobreak >nul

echo Starting API Gateway...
cd api-gateway
start "API Gateway" cmd /k "java -jar target/api-gateway-1.0.0.jar"
cd ..

echo.
echo API Gateway restarted with CORS fix!
echo Wait 30 seconds for it to start...
timeout /t 30 /nobreak >nul
echo.
echo Gateway should be ready now!
pause

