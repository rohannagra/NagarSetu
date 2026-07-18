# Enable Geocoding API - Quick Fix

## ❌ Error: "Location detected but could not fetch address details"

This means the **Geocoding API** is not enabled in your Google Cloud project.

---

## ✅ Solution (2 Minutes):

### Step 1: Go to Google Cloud Console
🔗 **https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com**

### Step 2: Select Your Project
- Make sure "Nagar-Setu" (or your project name) is selected at the top

### Step 3: Click "ENABLE"
- Click the blue **"ENABLE"** button
- Wait 10 seconds for activation

### Step 4: Refresh Your Browser
- Go back to your app: http://localhost:5173
- Try "Use Current Location" again
- ✅ Should work now!

---

## Alternative Method:

### Via APIs & Services:
1. Go to: **https://console.cloud.google.com/**
2. Click **"APIs & Services"** → **"Library"**
3. Search: **"Geocoding API"**
4. Click on it
5. Click **"ENABLE"**

---

## Verify It's Enabled:

### Check Browser Console:
1. Open DevTools (F12)
2. Go to Console tab
3. Click "Use Current Location"
4. Look for logs:
   ```
   Fetching address from: https://maps.googleapis.com/...
   Geocoding response: {status: "OK", results: [...]}
   ```

### If you see:
```json
{
  "status": "REQUEST_DENIED",
  "error_message": "This API project is not authorized..."
}
```

**Solution:** Enable Geocoding API (follow steps above)

---

## Required APIs for This Project:

Make sure BOTH are enabled:

1. ✅ **Maps JavaScript API** (for displaying maps)
2. ✅ **Geocoding API** (for address lookup) ⚠️ **YOU NEED THIS!**

---

## Quick Enable Command:

If you have `gcloud` CLI installed:

```bash
gcloud services enable geocoding-backend.googleapis.com
```

---

## Still Not Working?

### Check API Key Restrictions:

1. Go to: **APIs & Services** → **Credentials**
2. Click your API key
3. Under **API restrictions**:
   - Select "Restrict key"
   - Make sure both are checked:
     - ✅ Maps JavaScript API
     - ✅ Geocoding API ⚠️ **ADD THIS!**
4. Click **"SAVE"**

---

## Test After Enabling:

1. Refresh browser
2. Clear cache (Ctrl + Shift + R)
3. Try "Use Current Location" again
4. Should see: **"Location detected and address filled!"** ✅

---

**That's it! 2-minute fix!** 🚀
