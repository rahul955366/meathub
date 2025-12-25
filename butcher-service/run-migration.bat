@echo off
echo ========================================
echo MEATHUB Butcher Service - Database Migration
echo ========================================
echo.
echo This script will add location columns to the butchers table
echo and populate existing butchers with sample location data.
echo.
echo Database: meathub_butcher
echo Host: localhost:3306
echo User: root
echo.
pause

REM Try to find MySQL in common locations
set MYSQL_PATH=
if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
) else if exist "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" (
    set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe
) else if exist "C:\xampp\mysql\bin\mysql.exe" (
    set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe
) else if exist "C:\wamp64\bin\mysql\mysql8.0.xx\bin\mysql.exe" (
    set MYSQL_PATH=C:\wamp64\bin\mysql\mysql8.0.xx\bin\mysql.exe
)

if "%MYSQL_PATH%"=="" (
    echo ERROR: MySQL not found in common locations.
    echo.
    echo Please run the SQL script manually:
    echo 1. Open MySQL Workbench or command line
    echo 2. Connect to MySQL (localhost:3306, user: root, password: 1234)
    echo 3. Run: butcher-service\add-location-columns.sql
    echo.
    pause
    exit /b 1
)

echo Found MySQL at: %MYSQL_PATH%
echo.
echo Executing migration script...
echo.

"%MYSQL_PATH%" -u root -p1234 meathub_butcher < "%~dp0add-location-columns.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Migration completed successfully!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo Migration failed! Check the error above.
    echo ========================================
)

echo.
pause

