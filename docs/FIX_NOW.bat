@echo off
cls
color 0C

echo.
echo ════════════════════════════════════════════════════════════
echo    ⚠️  MongoDB Connection Error Detected
echo ════════════════════════════════════════════════════════════
echo.
echo Your backend cannot connect to MongoDB database!
echo.
echo ════════════════════════════════════════════════════════════
echo    SOLUTIONS:
echo ════════════════════════════════════════════════════════════
echo.
echo 1. USE FREE CLOUD DATABASE (Easiest - 5 minutes)
echo    ►  Go to: https://mongodb.com/cloud/atlas/register
echo    ►  Create free account
echo    ►  Get connection string
echo    ►  Update server/.env file
echo.
echo 2. INSTALL MONGODB LOCALLY (10 minutes)
echo    ►  Download: https://mongodb.com/try/download/community
echo    ►  Install and start service
echo.
echo 3. VIEW FRONTEND ONLY (Temporary)
echo    ►  Frontend works but no data saving
echo    ►  Open: http://localhost:5175/
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 📖 For detailed instructions, open:
echo    ►  MONGODB_SETUP.md
echo    ►  ⚠️_FIX_MONGODB_ERROR.txt
echo.
echo ════════════════════════════════════════════════════════════
echo.
pause
