@echo off
echo ========================================
echo Starting Nagar Setu - Complete System
echo ========================================
echo.

echo [1/3] Starting Backend Server...
cd server
start cmd /k "npm run dev"
cd ..

timeout /t 3 /nobreak > nul

echo [2/3] Starting AI Service...
cd ai-service
start cmd /k "python -m uvicorn app.main:app --reload --port 8000"
cd ..

timeout /t 3 /nobreak > nul

echo [3/3] Starting Frontend...
cd client
start cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo ALL SERVICES STARTED!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo AI Service: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul
