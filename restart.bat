@echo off
echo ======================================================================
echo  [SYNAPSE COUNCIL] -- RESTART SERVICE COMMAND ISSUED
echo  Timestamp: %DATE% %TIME%
echo ======================================================================
echo.

echo [PHASE 1/2] Stopping active processes on ports 8080 and 5173...
call "%~dp0stop.bat"

echo.
echo [PHASE 2/2] Pausing 3 seconds to ensure sockets release...
ping -n 4 127.0.0.1 >nul

call "%~dp0start.bat"

echo.
echo ======================================================================
echo  [FINAL SUMMARY] SYSTEM RESTARTED SUCCESSFULLY
echo  Both Backend (8080) and Frontend (5173) have been restarted.
echo ======================================================================
echo.
