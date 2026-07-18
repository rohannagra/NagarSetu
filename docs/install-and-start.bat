@echo off
REM Nagar Setu - Complete Installation and Startup Script
REM This script installs dependencies and starts all services

color 0A
echo.
echo ============================================================
echo    NAGAR SETU - Complete Setup and Start
echo    AI-Powered Smart Complaint Redressal System
echo ============================================================
echo.

REM Check prerequisites
echo [STEP 1/5] Checking prerequisites...
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo   [OK] Node.js found: 
node --version

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERROR] Python is not installed!
    echo Please install Python from https://www.python.org/
    echo.
    pause
    exit /b 1
)
echo   [OK] Python found:
python --version

echo.
echo ============================================================
echo.

REM Install Backend Dependencies
echo [STEP 2/5] Installing Backend dependencies...
echo   This may take 2-3 minutes...
echo.
cd /d "%~dp0server"
if not exist "node_modules" (
    npm install
    if %ERRORLEVEL% NEQ 0 (
        color 0C
        echo [ERROR] Backend installation failed!
        pause
        exit /b 1
    )
    echo   [OK] Backend dependencies installed!
) else (
    echo   [OK] Backend dependencies already installed!
)

echo.
echo ============================================================
echo.

REM Install Frontend Dependencies
echo [STEP 3/5] Installing Frontend dependencies...
echo   This may take 2-3 minutes...
echo.
cd /d "%~dp0client"
if not exist "node_modules" (
    npm install
    if %ERRORLEVEL% NEQ 0 (
        color 0C
        echo [ERROR] Frontend installation failed!
        pause
        exit /b 1
    )
    echo   [OK] Frontend dependencies installed!
) else (
    echo   [OK] Frontend dependencies already installed!
)

echo.
echo ============================================================
echo.

REM Install AI Service Dependencies
echo [STEP 4/5] Installing AI Service dependencies...
echo   This may take 1-2 minutes...
echo.
cd /d "%~dp0ai-service"
if not exist "venv" (
    echo   Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet
if %ERRORLEVEL% NEQ 0 (
    echo   [WARNING] Some AI dependencies may have issues, but continuing...
) else (
    echo   [OK] AI Service dependencies installed!
)
deactivate

echo.
echo ============================================================
echo.

REM Start all services
echo [STEP 5/5] Starting all services...
echo.
cd /d "%~dp0"

echo   Starting Backend Server (Port 5000)...
start "Nagar Setu - Backend Server" cmd /k "cd /d %~dp0server && npm run dev"
timeout /t 3 /nobreak >nul

echo   Starting AI Service (Port 8000)...
start "Nagar Setu - AI Service" cmd /k "cd /d %~dp0ai-service && call venv\Scripts\activate.bat && uvicorn app.main:app --reload --port 8000"
timeout /t 3 /nobreak >nul

echo   Starting Frontend (Port 5173)...
start "Nagar Setu - Frontend" cmd /k "cd /d %~dp0client && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ============================================================
echo    SUCCESS! All Services Are Starting!
echo ============================================================
echo.
echo Three terminal windows have been opened:
echo.
echo   [1] Backend Server    http://localhost:5000
echo   [2] AI Service        http://localhost:8000
echo   [3] Frontend          http://localhost:5173
echo.
echo ============================================================
echo.
echo Please wait 10-15 seconds for services to fully start...
echo.

REM Progress indicator
for /L %%i in (1,1,15) do (
    echo   Loading... %%i/15 seconds
    timeout /t 1 /nobreak >nul
)

echo.
echo ============================================================
echo    Opening Your Application in Browser...
echo ============================================================
echo.

start http://localhost:5173/

color 0A
echo.
echo   YOUR APPLICATION IS NOW RUNNING!
echo.
echo   Browser should open automatically to:
echo   http://localhost:5173/
echo.
echo   If browser doesn't open, manually visit the URL above.
echo.
echo ============================================================
echo.
echo   What you can do now:
echo.
echo   1. Register a new account
echo   2. Submit a complaint (NEW 3-step form!)
echo   3. View complaint details with AI analysis
echo   4. Search and filter your complaints
echo   5. Check Officer and Admin dashboards
echo.
echo ============================================================
echo.
echo   To STOP all services:
echo   - Close the 3 terminal windows that opened
echo   - Or press Ctrl+C in each window
echo.
echo ============================================================
echo.
echo Press any key to close this window...
pause >nul
