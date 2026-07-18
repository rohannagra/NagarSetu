@echo off
REM Nagar Setu - Stop All Services Script

color 0E
echo.
echo ========================================
echo    NAGAR SETU - Stopping Services
echo ========================================
echo.

echo Stopping Frontend (Port 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    taskkill /F /PID %%a >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo   [OK] Frontend stopped
    )
)

echo Stopping Backend (Port 5000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    taskkill /F /PID %%a >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo   [OK] Backend stopped
    )
)

echo Stopping AI Service (Port 8000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do (
    taskkill /F /PID %%a >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo   [OK] AI Service stopped
    )
)

echo.
echo ========================================
echo    All Services Stopped!
echo ========================================
echo.
pause
