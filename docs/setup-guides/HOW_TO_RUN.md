# 🚀 How to Run Nagar Setu - Windows Batch Scripts

## Quick Start (Easiest Way!)

### For First Time Users:

**Double-click:** `install-and-start.bat`

This will:
1. ✅ Check if Node.js and Python are installed
2. ✅ Install all dependencies (backend, frontend, AI)
3. ✅ Start all three services automatically
4. ✅ Open your browser to http://localhost:5173/

**Wait time:** 5-10 minutes (first time only)

---

### For Returning Users:

**Double-click:** `start.bat`

This will:
1. ✅ Start all three services in separate windows
2. ✅ Open your browser automatically

**Wait time:** 10-15 seconds

---

### To Stop All Services:

**Double-click:** `stop.bat`

This will:
1. ✅ Stop Frontend (Port 5173)
2. ✅ Stop Backend (Port 5000)
3. ✅ Stop AI Service (Port 8000)

---

## 📋 What Each Script Does

### 1. `install-and-start.bat` ⭐ (Recommended First Time)
**Use this if:**
- Running for the first time
- Dependencies not installed
- Want automatic setup

**What it does:**
```
[STEP 1] Check Node.js and Python
[STEP 2] Install Backend dependencies (npm install)
[STEP 3] Install Frontend dependencies (npm install)
[STEP 4] Install AI Service dependencies (pip install)
[STEP 5] Start all three services
[FINAL] Open browser to your app
```

**Time:** 5-10 minutes (downloads packages)

---

### 2. `start.bat` ⚡ (Quick Start)
**Use this if:**
- Dependencies already installed
- Just want to start the app
- Used the app before

**What it does:**
```
1. Start Backend in new window
2. Start AI Service in new window
3. Start Frontend in new window
4. Open browser automatically
```

**Time:** 10-15 seconds

---

### 3. `stop.bat` 🛑 (Stop Everything)
**Use this if:**
- Want to stop all services
- Services are stuck
- Need to free up ports

**What it does:**
```
1. Kill process on Port 5173 (Frontend)
2. Kill process on Port 5000 (Backend)
3. Kill process on Port 8000 (AI Service)
```

**Time:** Instant

---

## 🎯 Complete Workflow

### First Time Setup:
```
1. Double-click: install-and-start.bat
2. Wait 5-10 minutes for installation
3. Browser opens automatically
4. Register account and start using!
```

### Daily Usage:
```
1. Double-click: start.bat
2. Wait 10-15 seconds
3. Browser opens automatically
4. Login and use the app!
```

### Stopping:
```
1. Double-click: stop.bat
   OR
2. Close the 3 terminal windows manually
   OR
3. Press Ctrl+C in each terminal window
```

---

## 🖥️ What You'll See

### When Running `install-and-start.bat`:
```
============================================================
   NAGAR SETU - Complete Setup and Start
   AI-Powered Smart Complaint Redressal System
============================================================

[STEP 1/5] Checking prerequisites...
  [OK] Node.js found: v20.x.x
  [OK] Python found: 3.x.x

[STEP 2/5] Installing Backend dependencies...
  This may take 2-3 minutes...
  [OK] Backend dependencies installed!

[STEP 3/5] Installing Frontend dependencies...
  This may take 2-3 minutes...
  [OK] Frontend dependencies installed!

[STEP 4/5] Installing AI Service dependencies...
  This may take 1-2 minutes...
  [OK] AI Service dependencies installed!

[STEP 5/5] Starting all services...
  Starting Backend Server (Port 5000)...
  Starting AI Service (Port 8000)...
  Starting Frontend (Port 5173)...

============================================================
   SUCCESS! All Services Are Starting!
============================================================

Three terminal windows have been opened:
  [1] Backend Server    http://localhost:5000
  [2] AI Service        http://localhost:8000
  [3] Frontend          http://localhost:5173
```

### Three Windows Will Open:

**Window 1 - Backend:**
```
> nagar-setu-backend@1.0.0 dev
> nodemon src/server.js

[server] Server starting...
[mongodb] Connected to MongoDB
[server] 🚀 Server running on port 5000
```

**Window 2 - AI Service:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Started reloader process
INFO:     Started server process
INFO:     Application startup complete.
```

**Window 3 - Frontend:**
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## 🌐 Your Application Links

Once all services start, these links will work:

### 🎨 **MAIN APPLICATION** (Your Beautiful App):
**http://localhost:5173/**

### API Services (For Testing):
- Backend API: http://localhost:5000/api
- Backend Health: http://localhost:5000/health
- AI Service Docs: http://localhost:8000/docs
- AI Service Health: http://localhost:8000/health

---

## 🐛 Troubleshooting

### Script Says "Node.js not found":
**Solution:**
1. Install Node.js from https://nodejs.org/
2. Download "LTS" version
3. Run installer
4. Restart computer
5. Try script again

### Script Says "Python not found":
**Solution:**
1. Install Python from https://www.python.org/
2. Download version 3.9 or higher
3. ✅ **IMPORTANT:** Check "Add Python to PATH" during installation
4. Restart computer
5. Try script again

### Installation Fails or Errors:
**Solution:**
```batch
REM Delete node_modules and try again
cd server
rmdir /s /q node_modules
npm install

cd ..\client
rmdir /s /q node_modules
npm install
```

### Port Already in Use:
**Solution:**
```batch
REM Run stop.bat first
stop.bat

REM Then start again
start.bat
```

### Browser Doesn't Open Automatically:
**Solution:**
Manually open your browser and go to: http://localhost:5173/

### Services Won't Start:
**Solution:**
1. Close all terminal windows
2. Run `stop.bat`
3. Wait 10 seconds
4. Run `start.bat` again

### MongoDB Connection Error:
**Solution:**
1. Install MongoDB Community Server
2. Or use Docker:
   ```batch
   docker-compose up mongodb -d
   ```
3. Or update `.env` to use MongoDB Atlas (cloud)

---

## 📱 Access From Mobile

To test on your phone (same WiFi network):

1. Find your computer's IP address:
   ```batch
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. On your phone's browser:
   ```
   http://YOUR_IP:5173/
   ```
   Example: http://192.168.1.100:5173/

---

## ⚙️ Advanced Options

### Run Services Manually (Without Scripts):

**Terminal 1 - Backend:**
```batch
cd server
npm run dev
```

**Terminal 2 - AI Service:**
```batch
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Terminal 3 - Frontend:**
```batch
cd client
npm run dev
```

### Use Docker (All-in-One):
```batch
docker-compose up --build
```

Then open: http://localhost:5173/

---

## 📊 What to Expect

### First Run (with install-and-start.bat):
- ⏱️ **Time:** 5-10 minutes
- 📦 **Downloads:** ~500-800 MB
- 💾 **Disk Space:** ~1.5 GB after installation

### Subsequent Runs (with start.bat):
- ⏱️ **Time:** 10-15 seconds
- 🚀 **Fast:** No downloading needed
- ✅ **Ready:** Browser opens automatically

---

## 🎉 Success Indicators

**You know it's working when:**
1. ✅ Three terminal windows opened
2. ✅ No error messages in red
3. ✅ Browser opens to landing page
4. ✅ You see the beautiful Nagar Setu UI
5. ✅ You can click "Get Started" or "Track Complaint"

---

## 💡 Pro Tips

1. **First Time?** Use `install-and-start.bat`
2. **Daily Use?** Use `start.bat` (much faster!)
3. **Done Working?** Use `stop.bat` or close the 3 windows
4. **Having Issues?** Use `stop.bat` then `start.bat`
5. **Need Clean Start?** Delete `node_modules` folders and run `install-and-start.bat`

---

## 🎯 Quick Commands

| What You Want | Run This |
|---------------|----------|
| First time setup | `install-and-start.bat` |
| Quick start (already installed) | `start.bat` |
| Stop everything | `stop.bat` |
| Clean install | Delete `node_modules`, run `install-and-start.bat` |

---

## 📞 Still Having Issues?

Check these files for more help:
- `START_HERE.md` - General getting started guide
- `TESTING_CHECKLIST.md` - What to test and verify
- `DEMO_SCRIPT.md` - How to demo the application
- `QUICKSTART.md` - Alternative setup methods

---

**Ready? Double-click `install-and-start.bat` and let's go! 🚀**

