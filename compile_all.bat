@echo off
setlocal enabledelayedexpansion
set "services=api-gateway auth-service user-service butcher-service order-service subscription-service delivery-service gym-service pet-service media-service admin-service notification-service ai-service blockchain-service"

echo Starting compilation of 14 services... > build_log.txt

for %%s in (%services%) do (
    echo -------------------------------------------------- >> build_log.txt
    echo Building %%s...
    echo Building %%s... >> build_log.txt
    call mvn -f %%s/pom.xml clean package -DskipTests >> build_log.txt 2>&1
    if !errorlevel! neq 0 (
        echo FAILURE: %%s >> build_log.txt
        echo Failed to build %%s. See build_log.txt for details.
    ) else (
        echo SUCCESS: %%s >> build_log.txt
        echo Successfully built %%s.
    )
)
echo Done. >> build_log.txt
type build_log.txt
