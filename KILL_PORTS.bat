@echo off
echo Killing processes on ports 8080 and 5173...
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080" ^| findstr "LISTENING"') do (
    echo Killing process %%a on port 8080...
    taskkill /F /PID %%a 2>nul
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo Killing process %%a on port 5173...
    taskkill /F /PID %%a 2>nul
)

echo.
echo Done! Ports should be free now.
pause

