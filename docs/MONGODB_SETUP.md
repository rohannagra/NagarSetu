# 🗄️ MongoDB Atlas Setup Guide

**Time Required:** 5 minutes  
**Cost:** FREE forever (M0 tier)  
**No Installation Needed:** Cloud-based

---

## 📋 Step-by-Step Instructions

### Step 1: Create Account (1 minute)

1. Open browser and visit:
   ```
   https://www.mongodb.com/cloud/atlas/register
   ```

2. **Sign up using one of these methods:**
   - **Option A (Easiest):** Click "Sign up with Google"
   - **Option B:** Fill form manually
     - Email: your-email@example.com
     - Password: create a strong password
     - Click "Create your Atlas account"

3. **Verify email** if prompted (check inbox)

---

### Step 2: Answer Welcome Questions (30 seconds)

MongoDB will ask a few questions:

1. **What are you building?**  
   Select: `Application Development`

2. **What's your goal?**  
   Select: `Learn MongoDB`

3. **What language?**  
   Select: `JavaScript`

4. Click **"Finish"**

---

### Step 3: Create Free Cluster (2 minutes)

1. You'll see "Create a deployment" page

2. **Choose the FREE tier:**
   - Look for **"M0 FREE"** option
   - It says "Shared" and "FREE" in green
   - Click on it

3. **Configure your cluster:**
   - **Provider:** Select `AWS` (recommended)
   - **Region:** Choose closest to you:
     - 🇮🇳 India: `Mumbai (ap-south-1)`
     - 🇺🇸 USA: `N. Virginia (us-east-1)`
     - 🇪🇺 Europe: `Frankfurt (eu-central-1)`
   - **Cluster Name:** Leave as `Cluster0` or change to `nagarsetu`

4. Click **"Create Deployment"** (bottom right)

5. **WAIT 3-5 minutes** while cluster is created  
   You'll see: "Your cluster is being created..."

---

### Step 4: Create Database User (1 minute)

A popup will appear: "Security Quickstart"

1. **Create a Database User:**
   - Username: `nagarsetu`
   - Password: `nagarsetu123`
   - **Or click "Autogenerate Secure Password"** (save it somewhere!)

2. Click **"Create Database User"**

**⚠️ IMPORTANT:** Remember this username and password!

---

### Step 5: Set Network Access (1 minute)

Still in the same popup:

1. Under "Where would you like to connect from?"

2. Click **"My Local Environment"**

3. Click **"Add My Current IP Address"**

4. **ALSO add access from anywhere:**
   - Click **"Add a Different IP Address"**
   - IP Address: `0.0.0.0/0`
   - Description: `Allow all (development)`
   - Click **"Add Entry"**

5. Click **"Finish and Close"**

---

### Step 6: Get Connection String (2 minutes)

1. You'll see your cluster dashboard

2. Click the **"Connect"** button on your `Cluster0`

3. Choose **"Drivers"**

4. Select:
   - Driver: `Node.js`
   - Version: `5.5 or later`

5. **Copy the connection string** shown below:
   ```
   mongodb+srv://nagarsetu:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

6. **Modify the connection string:**
   - Replace `<password>` with `nagarsetu123` (or your password)
   - Add `/nagar-setu` before the `?`
   
   **Final string should look like:**
   ```
   mongodb+srv://nagarsetu:nagarsetu123@cluster0.xxxxx.mongodb.net/nagar-setu?retryWrites=true&w=majority
   ```

7. **Copy this final string**

---

### Step 7: Update Your Project (30 seconds)

1. Open `server/.env` file in your project

2. Find the line:
   ```
   MONGODB_URI=...
   ```

3. Replace it with your connection string:
   ```
   MONGODB_URI=mongodb+srv://nagarsetu:nagarsetu123@cluster0.xxxxx.mongodb.net/nagar-setu?retryWrites=true&w=majority
   ```

4. **Save the file** (Ctrl + S)

---

### Step 8: Restart Backend Server (30 seconds)

1. **Stop the current backend server:**
   - Go to the terminal running backend
   - Press `Ctrl + C`

2. **Start it again:**
   ```bash
   cd server
   npm run dev
   ```

3. **Check for success message:**
   ```
   ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
   🏛️  Nagar Setu - Smart Complaint Redressal System
   ```

---

## ✅ Verification

### Test the connection:

1. **Open your app:** http://localhost:5173

2. **Register a new account**

3. **Submit a complaint**

4. **No errors?** ✅ MongoDB is working!

---

## 🔍 Troubleshooting

### Error: "MongoServerError: bad auth"
**Solution:** Wrong username or password
- Check your username: `nagarsetu`
- Check your password: `nagarsetu123`
- Make sure there are no spaces
- Re-paste connection string

### Error: "connection timed out"
**Solution:** Network access not configured
- Go to MongoDB Atlas
- Click "Network Access" (left menu)
- Add IP: `0.0.0.0/0`
- Click "Confirm"
- Wait 1 minute and try again

### Error: "ENOTFOUND cluster0.xxxxx.mongodb.net"
**Solution:** Wrong connection string
- Go back to MongoDB Atlas
- Click "Connect" button
- Copy connection string again
- Make sure to add `/nagar-setu` before the `?`

---

## 📊 What You Get (FREE)

- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Shared vCPU
- ✅ No credit card required
- ✅ No time limit
- ✅ Automatic backups
- ✅ 100% free forever

**Perfect for:**
- Development
- Testing
- College projects
- Portfolio apps
- Small production apps (<1000 users)

---

## 🎯 Next Steps

After MongoDB is set up:

1. ✅ Backend will connect successfully
2. ✅ Complaints will be saved to cloud
3. ✅ All features will work
4. ✅ Ready to demo!

---

## 🌐 View Your Data

To see your stored data:

1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. You'll see:
   - `users` collection
   - `complaints` collection
   - `departments` collection
   - etc.

---

## 🔐 Security Notes

For production:
- Change username/password
- Use environment variables
- Restrict IP addresses
- Enable additional security

For development:
- Current setup is fine ✅

---

## 💡 Tips

1. **Bookmark MongoDB Atlas dashboard**  
   https://cloud.mongodb.com

2. **Connection string goes in `.env` file**  
   Never commit it to GitHub!

3. **Free tier limits:**
   - 512 MB storage (enough for 1000s of complaints)
   - If you need more, upgrade later

4. **Multiple projects?**
   - Create multiple clusters
   - Or multiple databases in same cluster

---

## ✨ You're Done!

MongoDB Atlas is now set up and ready!

**Time taken:** ~5 minutes  
**Cost:** $0  
**Difficulty:** Easy ✅  

Your app can now:
- Store complaints in cloud
- Access from anywhere
- Scale automatically
- Backup automatically

**Ready to test your app!** 🚀

