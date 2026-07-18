# ⚡ Quick Google Maps Setup (5 Minutes)

## Step 1: Get API Key 🔑

### Option A: Free Development Key (Recommended)
1. Go to: **https://console.cloud.google.com/**
2. Create new project: "Nagar-Setu-Dev"
3. Enable 2 APIs:
   - ✅ Maps JavaScript API
   - ✅ Geocoding API
4. Create Credentials → API Key
5. Copy the key (looks like: `AIzaSyB...`)

### Option B: Use Test Key (Temporary)
```env
# This is Google's test key - limited functionality
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBtest...
```

## Step 2: Add to .env 📝

Edit `client/.env`:
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyB_paste_your_key_here
```

## Step 3: Restart Server 🔄

```bash
cd client
npm run dev
```

## Step 4: Test! 🎉

1. Open: http://localhost:5173
2. Go to: Submit Complaint
3. Click: **"Use Current Location"**
4. Grant permission
5. **Watch the magic:**
   - 🗺️ Map appears
   - 📍 Marker shows your location
   - 📝 All address fields auto-fill!

---

## ✅ What You Get

### Before (OpenStreetMap):
- ❌ Basic map
- ❌ Manual address entry
- ❌ Limited accuracy in India

### After (Google Maps):
- ✅ Professional map interface
- ✅ **Automatic address detection**
- ✅ Accurate Indian addresses
- ✅ Pincode-level precision
- ✅ Click map to update location
- ✅ Mobile-friendly

---

## 🆓 Is It Really Free?

**YES!** Google gives **$200 free credits/month**

For your app:
- 100 users/day = ~3,000 map loads/month
- Cost: ~$21/month
- **Your free credit: $200/month**
- **You pay: $0** ✨

Even with 1,000 users/day, still FREE!

---

## 🚨 Common Issues

### Map shows "For development purposes only"?
→ Normal! Works perfectly, just enable billing to remove watermark

### Map not loading?
→ Check:
1. API key in `.env` file
2. Restarted dev server
3. APIs enabled in console

### "This page can't load Google Maps correctly"?
→ Enable billing (required but won't charge in free tier)

---

## 🎯 Quick Test Commands

```bash
# Check if API key is loaded
cd client
npm run dev
# Then check browser console for GOOGLE_MAPS_API_KEY

# If map not showing, try:
1. Delete .env
2. Re-add API key
3. Restart: npm run dev
```

---

## 🎓 Full Documentation

See **GOOGLE_MAPS_SETUP.md** for:
- Detailed setup instructions
- Security best practices
- API restrictions
- Troubleshooting guide
- Production deployment tips

---

## ⏱️ Total Time: 5 Minutes

1. Get API key: 3 minutes
2. Add to .env: 1 minute
3. Restart server: 10 seconds
4. Test: 1 minute

**DONE!** 🎊
