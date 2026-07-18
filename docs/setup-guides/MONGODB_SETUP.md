# 🔧 MongoDB Setup - Fix for "MongoDB Connection Error"

## Problem

Your backend crashed with this error:
```
❌ Error connecting to MongoDB: connect ECONNREFUSED
```

This means MongoDB is not installed or not running on your computer.

---

## ✅ SOLUTION - 3 Options (Choose One)

### Option 1: Use MongoDB Atlas (Cloud - FREE & EASIEST!) ⭐

**This is the RECOMMENDED option - No installation needed!**

#### Step 1: Create Free Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email (FREE forever)
3. Choose "Free Shared" cluster
4. Click "Create"

#### Step 2: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
   ```

#### Step 3: Update .env File
1. Open `server/.env`
2. Replace this line:
   ```
   MONGODB_URI=mongodb://localhost:27017/nagar-setu
   ```
   With your connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/nagar-setu?retryWrites=true&w=majority
   ```

#### Step 4: Restart Backend
```bash
# The backend will automatically restart
# Or run: stop.bat then start.bat
```

**Done! Your app will work now!** ✅

---

### Option 2: Install MongoDB Locally

#### For Windows:

1. **Download MongoDB Community Server:**
   - Go to: https://www.mongodb.com/try/download/community
   - Choose "Windows" and "MSI"
   - Download and run installer

2. **During Installation:**
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Run service as Network Service user"
   - Click "Complete" installation

3. **Verify Installation:**
   ```bash
   # Open Command Prompt and run:
   mongod --version
   ```

4. **Start MongoDB Service:**
   ```bash
   # Start service
   net start MongoDB

   # Or use Services app:
   # Press Win+R, type services.msc
   # Find "MongoDB", right-click, "Start"
   ```

5. **Restart Backend:**
   ```bash
   stop.bat
   start.bat
   ```

---

### Option 3: Use Docker (If you have Docker installed)

```bash
# Start MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Check if running
docker ps

# Restart backend
stop.bat
start.bat
```

---

## 🧪 Test MongoDB Connection

After setup, test if MongoDB is working:

### Test 1: Check if MongoDB is running
```bash
# Windows - Check service
sc query MongoDB

# Or check port
netstat -ano | findstr :27017
```

### Test 2: Test backend connection
```bash
# Start backend
cd server
npm run dev

# You should see:
✓ MongoDB connected successfully
```

---

## 🚀 Quick Start (After MongoDB Setup)

1. **Stop everything:**
   ```bash
   stop.bat
   ```

2. **Start again:**
   ```bash
   start.bat
   ```

3. **Open browser:**
   ```
   http://localhost:5175/
   ```

---

## ❓ Which Option Should I Choose?

### Choose **Option 1 (MongoDB Atlas)** if:
- ✅ You want the EASIEST setup
- ✅ You don't want to install software
- ✅ You want it to work on any computer
- ✅ You want automatic backups
- ✅ FREE forever (up to 512MB)

### Choose **Option 2 (Local MongoDB)** if:
- You want to work offline
- You need faster performance
- You want full control

### Choose **Option 3 (Docker)** if:
- You already have Docker installed
- You're familiar with containers

---

## 💡 Recommended: MongoDB Atlas (Option 1)

**Why?**
- ✅ Takes 5 minutes to setup
- ✅ No installation required
- ✅ Works immediately
- ✅ Free forever
- ✅ Accessible from anywhere
- ✅ Professional solution

**Steps:**
1. Create account (2 minutes)
2. Copy connection string (1 minute)
3. Update .env file (1 minute)
4. Restart backend (1 minute)
5. **DONE!** ✅

---

## 🆘 Still Having Issues?

### Error: "Authentication failed"
**Solution:** Make sure you replaced `<password>` in the connection string with your actual password.

### Error: "Network timeout"
**Solution:** 
1. Check your internet connection
2. Whitelist your IP in MongoDB Atlas:
   - Go to Network Access
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere"

### Error: "Database name is required"
**Solution:** Make sure your connection string ends with `/nagar-setu`:
```
mongodb+srv://user:pass@cluster.mongodb.net/nagar-setu
```

---

## 📞 Next Steps

After MongoDB is set up:

1. ✅ Backend will connect successfully
2. ✅ Frontend will load properly
3. ✅ You can register users
4. ✅ You can submit complaints
5. ✅ Everything will work!

---

## 🎯 Quick Fix Right Now

**Don't want to setup MongoDB right now?**

I can modify the backend to work in "demo mode" without MongoDB:
- ✅ Frontend will work
- ✅ You can see all pages
- ✅ Forms will work (but won't save)
- ❌ Registration/Login won't work
- ❌ Data won't persist

**Want this? Let me know!**

---

**Recommended: Spend 5 minutes on MongoDB Atlas (Option 1) and your app will be fully functional!** 🚀

