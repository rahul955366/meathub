@echo off
echo ============================================
echo   MEATHUB MICROSERVICES - BUILD SCRIPT
echo ============================================

echo.
echo Building API Gateway...
call mvn -f api-gateway/pom.xml clean package -DskipTests

echo.
echo Building Auth Service...
call mvn -f auth-service/pom.xml clean package -DskipTests

echo.
echo Building User Service...
call mvn -f user-service/pom.xml clean package -DskipTests

echo.
echo Building Butcher Service...
call mvn -f butcher-service/pom.xml clean package -DskipTests

echo.
echo Building Order Service...
call mvn -f order-service/pom.xml clean package -DskipTests

echo.
echo Building Subscription Service...
call mvn -f subscription-service/pom.xml clean package -DskipTests

echo.
echo Building Delivery Service...
call mvn -f delivery-service/pom.xml clean package -DskipTests

echo.
echo Building Gym Service...
call mvn -f gym-service/pom.xml clean package -DskipTests

echo.
echo Building Pet Service...
call mvn -f pet-service/pom.xml clean package -DskipTests

echo.
echo Building Media Service...
call mvn -f media-service/pom.xml clean package -DskipTests

echo.
echo Building Admin Service...
call mvn -f admin-service/pom.xml clean package -DskipTests

echo.
echo Building Notification Service...
call mvn -f notification-service/pom.xml clean package -DskipTests

echo.
echo Building AI Service...
call mvn -f ai-service/pom.xml clean package -DskipTests

echo.
echo Building Blockchain Service...
call mvn -f blockchain-service/pom.xml clean package -DskipTests

echo.
echo ============================================
echo   BUILD COMPLETE!
echo   Run 'docker-compose up --build' to start.
echo ============================================
pause
