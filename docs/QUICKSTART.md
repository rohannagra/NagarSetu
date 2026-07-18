# Nagar Setu - Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes!

This guide will help you quickly set up and run the Nagar Setu application locally.

---

## Prerequisites

Make sure you have these installed:
- ✅ **Node.js** (v18+) - [Download](https://nodejs.org/)
- ✅ **Python** (v3.9+) - [Download](https://www.python.org/)
- ✅ **MongoDB** (v7.0+) - [Download](https://www.mongodb.com/try/download/community) OR use MongoDB Atlas (cloud)
- ✅ **Git** - [Download](https://git-scm.com/)

---

## Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd nagar-setu

# Or if you're already in the directory
cd nagar-setu
```

---

## Step 2: Setup Backend

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit `server/.env` with your configuration:**

At minimum, update these:
```env
# Database (Use MongoDB Atlas or local MongoDB)
MONGODB_URI=mongodb://localhost:27017/nagar-setu
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nagar-setu

# JWT Secrets (Generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this

# Email (Optional for now, use any SMTP or skip)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Generate Strong JWT Secrets:**
```bash
# Run this in terminal to generate secure keys
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Start the backend:**
```bash
npm run dev
```

✅ Backend should be running on **http://localhost:5000**

---

## Step 3: Setup AI Service

Open a **new terminal window/tab**:

```bash
# Navigate to ai-service folder
cd ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start AI service
uvicorn app.main:app --reload --port 8000
```

**Note:** First run will download ML models (~500MB). This may take a few minutes.

✅ AI Service should be running on **http://localhost:8000**

---

## Step 4: Setup Frontend

Open a **new terminal window/tab**:

```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**The default `.env` should work as-is:**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_AI_SERVICE_URL=http://localhost:8000
```

**Start the frontend:**
```bash
npm run dev
```

✅ Frontend should be running on **http://localhost:5173**

---

## Step 5: Access the Application

Open your browser and go to:
👉 **http://localhost:5173**

### Test Accounts

**For Testing (if seeded):**
- **Admin:** admin@nagarsetu.gov.in / Admin@123456
- **Citizen:** Create new account via Register page

**Or create your own account:**
1. Click "Register" on the homepage
2. Fill in the form
3. Login and start using the app

---

## 🎉 You're All Set!

### What to Explore:

**As a Citizen:**
- ✨ Submit complaints with location
- 📍 Track your complaints
- 🗺️ View live heatmap
- 💬 Chat with officers (coming soon)

**As an Officer/Admin:**
- 📊 View dashboard with statistics
- 📝 Manage complaints
- 👥 User management (admin)
- 📈 Analytics and reports

---

## Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution:** Make sure MongoDB is running
```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### Issue: Port Already in Use
**Solution:** Kill the process using the port
```bash
# Find process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5000
kill -9 <PID>
```

### Issue: AI Service Models Download Fails
**Solution:** 
- Check internet connection
- Clear pip cache: `pip cache purge`
- Retry: `pip install -r requirements.txt --force-reinstall`

### Issue: Frontend Build Errors
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Docker Alternative (Easier!)

If you have Docker installed:

```bash
# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
# AI Service: http://localhost:8000
```

---

## Development Tips

### Auto-reload on changes
All services have hot-reload enabled:
- **Backend:** nodemon watches for changes
- **Frontend:** Vite HMR (Hot Module Replacement)
- **AI Service:** uvicorn --reload

### View API Documentation
- Backend API: http://localhost:5000/api
- AI Service: http://localhost:8000/docs (Swagger UI)

### Check Service Health
- Backend: http://localhost:5000/health
- AI Service: http://localhost:8000/health

---

## Project Structure

```
nagar-setu/
├── client/          # React Frontend (Port 5173)
├── server/          # Node.js Backend (Port 5000)
├── ai-service/      # Python AI Service (Port 8000)
└── docker-compose.yml
```

---

## Next Steps

1. ✅ Explore the landing page
2. ✅ Register a new account
3. ✅ Submit a test complaint
4. ✅ Track your complaint
5. ✅ View the heatmap
6. ✅ Check the dashboard

---

## Need Help?

- 📖 **Full Documentation:** See `README.md`
- 🔧 **Installation Guide:** See `INSTALLATION.md`
- 📊 **Project Summary:** See `PROJECT_SUMMARY.md`
- 🐛 **Issues:** Check logs in terminal windows

---

## Stopping the Application

Press `Ctrl + C` in each terminal window to stop the services.

---

**Happy Coding! 🎉**

Built with ❤️ for better civic governance.
