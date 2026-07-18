@echo off
REM Nagar Setu - Quick Start Script for Windows
REM This script starts all three services in separate windows

echo.
echo ========================================
echo    NAGAR SETU - Starting Services
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed!
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo [1/3] Starting Backend Server...
start "Nagar Setu - Backend" cmd /k "cd /d %~dp0server && npm run dev"
timeout /t 2 /nobreak >nul

echo [2/3] Starting AI Service...
start "Nagar Setu - AI Service" cmd /k "cd /d %~dp0ai-service && uvicorn app.main:app --reload --port 8000"
timeout /t 2 /nobreak >nul

echo [3/3] Starting Frontend...
start "Nagar Setu - Frontend" cmd /k "cd /d %~dp0client && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo    All Services Are Starting!
echo ========================================
echo.
echo Three terminal windows have been opened:
echo.
echo   1. Backend Server    (Port 5000)
echo   2. AI Service        (Port 8000)
echo   3. Frontend          (Port 5173)
echo.
echo Wait 10-15 seconds for all services to start...
echo.
echo Then open your browser and go to:
echo.
echo   http://localhost:5173/
echo.
echo ========================================
echo.

REM Wait a few seconds then try to open browser
timeout /t 10 /nobreak
echo Opening browser...
start http://localhost:5173/

echo.
echo Your application should now be running!
echo.
echo To stop all services:
echo   - Close the three terminal windows that opened
echo   - Or press Ctrl+C in each window
echo.
pause
