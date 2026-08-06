@echo off
setlocal enabledelayedexpansion

echo ======================================================================
echo  [SYNAPSE COUNCIL] -- STOP SERVICE COMMAND ISSUED
echo  Timestamp: %DATE% %TIME%
echo ======================================================================
echo.

set STOPPED_BACKEND=0
set STOPPED_FRONTEND=0

echo [INFO] Scanning port 8080 (Backend Spring Boot)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080 ^| findstr LISTENING') do (
    echo [ACTION] Terminating process PID %%a listening on port 8080...
    taskkill /F /PID %%a >nul 2>&1
    set STOPPED_BACKEND=1
)

if !STOPPED_BACKEND!==1 (
    echo [STATUS] Backend on Port 8080: [ STOPPED SUCCESSFULLY ]
) else (
    echo [STATUS] Backend on Port 8080: [ ALREADY INACTIVE / NOT RUNNING ]
)

echo.
echo [INFO] Scanning port 5173 (Frontend Vite Dev Server)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    echo [ACTION] Terminating process PID %%a listening on port 5173...
    taskkill /F /PID %%a >nul 2>&1
    set STOPPED_FRONTEND=1
)

if !STOPPED_FRONTEND!==1 (
    echo [STATUS] Frontend on Port 5173: [ STOPPED SUCCESSFULLY ]
) else (
    echo [STATUS] Frontend on Port 5173: [ ALREADY INACTIVE / NOT RUNNING ]
)

echo.
echo ======================================================================
echo  [FINAL SUMMARY] ALL SERVICES STOPPED AND PORTS FREED (8080, 5173)
echo ======================================================================
echo.
