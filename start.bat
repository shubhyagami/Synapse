@echo off
echo ======================================================================
echo  [SYNAPSE COUNCIL] -- START SERVICE COMMAND ISSUED
echo  Timestamp: %DATE% %TIME%
echo ======================================================================
echo.

echo [ACTION] Launching Backend Service (Spring Boot 3.4 / Java 21)...
echo [INFO] Target Port: 8080
start "Synapse Council Backend (8080)" cmd /k "cd /d %~dp0backend && .mvn\maven\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run"
echo [STATUS] Backend Process: [ LAUNCHED / STARTING ON PORT 8080 ]

echo.
echo [ACTION] Launching Frontend Service (React 19 / Vite)...
echo [INFO] Target Port: 5173
start "Synapse Council Frontend (5173)" cmd /k "cd /d %~dp0frontend && npm run dev"
echo [STATUS] Frontend Process: [ LAUNCHED / STARTING ON PORT 5173 ]

echo.
echo ======================================================================
echo  [SUMMARY] SERVICES LAUNCHED SUCCESSFULLY
echo  - Backend API:  http://localhost:8080/api/health
echo  - Frontend UI:   http://localhost:5173
echo ======================================================================
echo.
