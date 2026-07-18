# Nagar Setu - Troubleshooting Guide

## Common Issues and Solutions

### 1. Blank White Page in Browser

**Status**: ✅ **FIXED!**

**Cause**: Import errors in React components (incorrect default vs named imports)

**Fixed Files**:
- `client/src/pages/citizen/SubmitComplaint.tsx`
- `client/src/pages/citizen/MyComplaints.tsx`

**Solution Applied**: Changed default imports to named imports for `useGeolocation` and `useDebounce` hooks.

---

### 2. Backend Crashes with MongoDB Error

**Status**: ✅ **FIXED!**

**Error Message**: 
```
MongooseServerSelectionError: connect ECONNREFUSED ::1:27017
```

**Cause**: MongoDB not installed or not running

**Solution**: 
- Backend now automatically falls back to **file-based storage**
- Data stored in `server/data/*.json` files
- See `MONGODB_SETUP.md` for MongoDB Atlas setup (optional)

---

### 3. Tailwind CSS Error: "border-border class does not exist"

**Status**: ✅ **FIXED!**

**Cause**: Invalid CSS class in `client/src/index.css`

**Solution**: Removed invalid `border-border` class from CSS file

---

### 4. Port Already in Use

**Error**: `Port 5173 is already in use`

**Solution**:
1. Find and kill the process:
   ```bash
   # Windows PowerShell
   Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
   ```

2. Or change the port in `client/vite.config.ts`:
   ```typescript
   export default defineConfig({
     server: {
       port: 3000  // Change to any free port
     }
   })
   ```

---

### 5. "npm: command not found" Error

**Cause**: Node.js not installed or not in PATH

**Solution**:
1. Download and install Node.js from: https://nodejs.org/
2. Choose the LTS version (recommended)
3. Restart your terminal after installation
4. Verify: `node --version` and `npm --version`

---

### 6. "python: command not found" Error

**Cause**: Python not installed or not in PATH

**Solution**:
1. Download Python from: https://www.python.org/
2. During installation, **check "Add Python to PATH"**
3. Restart your terminal
4. Verify: `python --version`

---

### 7. Dependencies Installation Fails

**Error**: `npm install` fails with errors

**Solutions**:

**Option 1 - Clear cache and retry**:
```bash
# Backend
cd server
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Frontend
cd client
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Option 2 - Use specific Node version**:
```bash
# Install Node.js v18.x or v20.x LTS
# Avoid Node.js v21+ (might have compatibility issues)
```

---

### 8. Frontend Compiles but Page is Blank

**Checklist**:
1. ✅ Check browser console (F12) for JavaScript errors
2. ✅ Verify backend is running: http://localhost:5000/health
3. ✅ Check network tab for failed API requests
4. ✅ Clear browser cache (Ctrl+Shift+Delete)
5. ✅ Try incognito/private mode
6. ✅ Check `.env` files exist in both `server/` and `client/`

**Current Status**: This issue has been fixed by correcting import statements.

---

### 9. API Requests Return 401 Unauthorized

**Cause**: Token expired or not present

**Solution**:
1. Logout and login again
2. Clear localStorage: 
   - Open browser console (F12)
   - Run: `localStorage.clear()`
   - Refresh page
3. Register a new account

---

### 10. Socket.IO Connection Fails

**Error in console**: `WebSocket connection failed`

**Solutions**:
1. Verify backend is running
2. Check `VITE_SOCKET_URL` in `client/.env`:
   ```
   VITE_SOCKET_URL=http://localhost:5000
   ```
3. Restart frontend server after changing `.env`

---

### 11. File Upload Fails

**Possible Causes**:
- File too large (max 10MB)
- Invalid file type
- Upload directory doesn't exist

**Solutions**:
1. Check file size: Max 10MB per file
2. Allowed types: `.jpg, .jpeg, .png, .pdf, .mp4`
3. Ensure `server/uploads/` directory exists:
   ```bash
   mkdir server/uploads
   ```

---

### 12. Map Not Loading (Leaflet)

**Symptoms**: Blank map area or broken tiles

**Solutions**:
1. Check internet connection (map tiles load from CDN)
2. Verify Leaflet CSS is imported in `client/index.html`:
   ```html
   <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
   ```
3. Check browser console for tile loading errors

---

### 13. AI Service Not Working

**Error**: AI classification/sentiment analysis not working

**Checklist**:
1. ✅ AI service is running: http://localhost:8000/docs
2. ✅ Backend can reach AI service (check `AI_SERVICE_URL` in `server/.env`)
3. ✅ Python dependencies installed: `cd ai-service && pip install -r requirements.txt`

**Note**: AI service uses **rule-based** algorithms, not ML models. No training required!

---

### 14. Data Not Persisting (File Storage Mode)

**Symptoms**: Data disappears after restart

**Causes**:
- JSON files being corrupted
- Write permission issues

**Solutions**:
1. Check `server/data/` folder exists
2. Verify JSON files are valid:
   ```bash
   cd server/data
   python -m json.tool users.json
   ```
3. Check write permissions on `server/data/` folder
4. Backup data files regularly

---

### 15. Styling Issues / Tailwind Not Working

**Symptoms**: Components look unstyled

**Solutions**:
1. Verify `tailwind.config.js` exists in `client/`
2. Check `postcss.config.js` exists
3. Restart Vite dev server:
   ```bash
   cd client
   npm run dev
   ```
4. Clear Vite cache:
   ```bash
   rm -rf client/node_modules/.vite
   ```

---

## Getting Help

### Debug Mode

**Enable Detailed Logging**:

1. **Backend** - Edit `server/.env`:
   ```
   NODE_ENV=development
   DEBUG=true
   ```

2. **Frontend** - Open browser console (F12):
   ```javascript
   localStorage.setItem('debug', 'true');
   ```

### Collect Debug Information

Before asking for help, collect:
1. ✅ Node.js version: `node --version`
2. ✅ npm version: `npm --version`
3. ✅ Python version: `python --version`
4. ✅ Operating System: Windows/Mac/Linux
5. ✅ Browser console errors (F12)
6. ✅ Backend terminal output
7. ✅ Frontend terminal output

---

## Quick Reset

**Start Fresh** (if nothing else works):

```bash
# 1. Stop all running services
# Close all terminal windows or press Ctrl+C

# 2. Clean everything
cd client
rm -rf node_modules .vite
cd ../server
rm -rf node_modules
cd ../ai-service
rm -rf __pycache__

# 3. Reinstall
cd ../client
npm install
cd ../server
npm install
cd ../ai-service
pip install -r requirements.txt

# 4. Start services
cd ..
# Run start.bat (Windows) or use individual npm run dev commands
```

---

## Success Indicators

Your app is working correctly when:
- ✅ Frontend loads at http://localhost:5173/
- ✅ Backend health check returns success: http://localhost:5000/health
- ✅ You can register and login
- ✅ No errors in browser console (F12)
- ✅ No errors in backend terminal
- ✅ Map loads on Submit Complaint page
- ✅ File uploads work

---

## Current Status

### ✅ All Issues Fixed!
- Import errors: **FIXED**
- MongoDB connection: **FIXED** (file storage fallback)
- Tailwind CSS errors: **FIXED**
- Blank page: **FIXED**

### 🎯 Application Status
- **Frontend**: Running on http://localhost:5173/
- **Backend**: Running on http://localhost:5000/
- **Storage**: File-based (JSON files in `server/data/`)

**Your application is ready to use!** 🚀

---

*Last Updated: July 3, 2026*
