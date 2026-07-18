# 🔑 How to Get Google Maps API Key (Step-by-Step with Screenshots Guide)

## ⏱️ Time Required: 5 Minutes

---

## Step 1: Go to Google Cloud Console

**URL:** https://console.cloud.google.com/

1. Open the link in your browser
2. Sign in with your Google account (Gmail)
3. Accept Terms of Service if prompted

---

## Step 2: Create New Project

1. Click on **project dropdown** (top bar, next to "Google Cloud")
2. Click **"NEW PROJECT"** button (top right)
3. Enter details:
   - **Project Name:** `Nagar-Setu` (or any name)
   - **Organization:** Leave as default
   - **Location:** Leave as default
4. Click **"CREATE"** button
5. Wait 10 seconds for project creation
6. Click **"SELECT PROJECT"** when prompted

---

## Step 3: Enable Billing (Required but FREE)

**⚠️ Don't worry! You won't be charged - $200 free credit per month**

1. Click on **"Navigation Menu"** (☰ top left)
2. Go to **"Billing"**
3. Click **"Link a Billing Account"** or **"Create Billing Account"**
4. Enter details:
   - Name
   - Country: India
   - Credit/Debit Card (for verification only)
5. Click **"Start my free trial"**

**Note:** Card will NOT be charged unless you manually upgrade after exceeding $200/month

---

## Step 4: Enable Required APIs

### Enable Maps JavaScript API:

1. Click **Navigation Menu (☰)** → **"APIs & Services"** → **"Library"**
2. Search for: **"Maps JavaScript API"**
3. Click on it
4. Click **"ENABLE"** button
5. Wait for activation (10 seconds)

### Enable Geocoding API:

1. Go back to **"Library"**
2. Search for: **"Geocoding API"**
3. Click on it
4. Click **"ENABLE"** button
5. Wait for activation (10 seconds)

---

## Step 5: Create API Key

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** (top bar)
3. Select **"API key"**
4. **Copy the API key** immediately! (looks like: `AIzaSyB...`)
5. Click **"RESTRICT KEY"** (recommended)

---

## Step 6: Restrict API Key (Recommended for Security)

### Application Restrictions:
1. Select **"HTTP referrers (web sites)"**
2. Click **"+ ADD AN ITEM"**
3. Add: `http://localhost:5173/*` (for development)
4. Add: `http://localhost:5174/*` (backup port)
5. Click **"+ ADD AN ITEM"**
6. Add your production domain later: `https://yourdomain.com/*`

### API Restrictions:
1. Select **"Restrict key"**
2. Check only these 2 APIs:
   - ✅ **Maps JavaScript API**
   - ✅ **Geocoding API**
3. Click **"SAVE"**

---

## Step 7: Add API Key to Your Project

### Edit `client/.env` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_AI_SERVICE_URL=http://localhost:8000

# Google Maps API Key - PASTE YOUR KEY BELOW
VITE_GOOGLE_MAPS_API_KEY=AIzaSyB_paste_your_actual_key_here

# App Configuration
VITE_APP_NAME=Nagar Setu
VITE_APP_VERSION=1.0.0
```

**⚠️ Replace `AIzaSyB_paste_your_actual_key_here` with your real key!**

---

## Step 8: Restart Development Server

```bash
# Stop the current server (Ctrl + C)

# Start again
cd client
npm run dev
```

**Or in Windows:**
```cmd
cd client
npm run dev
```

---

## Step 9: Test the Integration! 🎉

1. Open browser: http://localhost:5173
2. Click **"Submit Complaint"**
3. Scroll to **"Location"** section
4. Click **"Use Current Location"** button
5. Grant location permission
6. **Watch the magic:**
   - 🗺️ Map appears
   - 📍 Marker shows your location
   - 📝 Address auto-fills
   - ✅ Success message

---

## ✅ Success Checklist

- [ ] Created Google Cloud project
- [ ] Enabled billing (free tier)
- [ ] Enabled Maps JavaScript API
- [ ] Enabled Geocoding API
- [ ] Created API key
- [ ] Restricted API key (optional)
- [ ] Added key to `.env` file
- [ ] Restarted dev server
- [ ] Tested "Use Current Location"
- [ ] Map showing correctly
- [ ] Address auto-filling

---

## 🐛 Common Issues & Solutions

### Issue 1: "This page can't load Google Maps correctly"
**Solution:**
- Check if billing is enabled
- Verify APIs are enabled (Maps JavaScript + Geocoding)
- Check API key in `.env` is correct
- Restart dev server

### Issue 2: Map shows "For development purposes only"
**This is NORMAL!**
- Map works perfectly
- Watermark removed automatically when billing is enabled
- No action needed

### Issue 3: "API key not valid"
**Solution:**
- Wait 5 minutes after creating key (activation time)
- Check key copied correctly (no extra spaces)
- Verify key restrictions allow localhost:5173
- Try creating a new unrestricted key for testing

### Issue 4: "This API project is not authorized to use this API"
**Solution:**
- Go back to "APIs & Services" → "Library"
- Enable both required APIs again
- Wait 2-3 minutes
- Refresh browser

### Issue 5: Address not auto-filling
**Check:**
- Geocoding API is enabled
- API key restrictions include Geocoding API
- Browser console for errors (F12)
- Network tab shows 200 OK for geocoding requests

---

## 💡 Pro Tips

### Tip 1: Keep Key Secret
```bash
# Never commit this file to GitHub:
client/.env

# Already in .gitignore ✅
```

### Tip 2: Use Different Keys
```
Development: Unrestricted (for testing)
Production: Fully restricted (for security)
```

### Tip 3: Monitor Usage
- Check Google Cloud Console
- Go to "APIs & Services" → "Dashboard"
- See daily API usage
- Set up usage alerts

### Tip 4: Backup Key
- Save API key in password manager
- Or note it down somewhere safe
- Can't retrieve later (must create new)

---

## 📊 Expected Free Usage

### Your App (Small Scale):
```
100 users/day × 30 days = 3,000 map loads/month
Cost: $21/month
Free credit: $200/month
You pay: $0 ✅
```

### Your App (Medium Scale):
```
1,000 users/day × 30 days = 30,000 map loads/month
Cost: $210/month
Free credit: $200/month
You pay: $10/month 💸
```

### Your App (Large Scale):
```
10,000 users/day × 30 days = 300,000 map loads/month
Cost: $2,100/month
Consider: AWS/Azure credits or enterprise plan
```

---

## 🎓 Additional Resources

### Official Documentation:
- **Get Started:** https://developers.google.com/maps/gmp-get-started
- **Pricing:** https://mapsplatform.google.com/pricing/
- **API Docs:** https://developers.google.com/maps/documentation
- **React Library:** https://react-google-maps-api-docs.netlify.app/

### Video Tutorials:
- YouTube: "How to get Google Maps API key 2024"
- YouTube: "Google Maps JavaScript API Tutorial"

### Support:
- Stack Overflow: #google-maps-api-3
- GitHub Issues: @react-google-maps/api

---

## 🎯 Quick Command Reference

```bash
# Install dependencies (already done)
cd client
npm install @react-google-maps/api

# Start dev server
npm run dev

# Check if API key is loaded
# Open browser console and type:
# console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)

# Should show your key (if not, restart server)
```

---

## ✨ Final Check

Run this checklist before moving forward:

```
✅ Google Cloud project created
✅ Billing enabled (free tier)
✅ Maps JavaScript API enabled
✅ Geocoding API enabled
✅ API key created and copied
✅ API key added to client/.env
✅ Dev server restarted
✅ Browser shows map correctly
✅ "Use Current Location" works
✅ Address auto-fills properly
✅ Can click map to change location
```

---

**All Done! 🎉**

Your Nagar Setu app now has professional Google Maps integration with automatic address detection!

Need help? Check:
- `GOOGLE_MAPS_SETUP.md` - Detailed guide
- `QUICK_GOOGLE_MAPS_SETUP.md` - Quick reference
- `GOOGLE_MAPS_MIGRATION_SUMMARY.md` - What changed

Happy coding! 🚀
