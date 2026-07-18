# Nagar Setu - Testing Guide

## 🧪 How to Test the Application

This guide walks you through testing all the implemented features.

---

## Prerequisites

Make sure all services are running:
```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: AI Service
cd ai-service && uvicorn app.main:app --reload --port 8000

# Terminal 3: Frontend
cd client && npm run dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- AI Service: http://localhost:8000

---

## 1. Testing Authentication

### Test User Registration

1. **Go to** http://localhost:5173/register
2. **Fill the form:**
   - Name: Test User
   - Email: test@example.com
   - Password: Test@12345
   - Phone: 9876543210 (optional)
   - City: Mumbai (optional)
   - State: Maharashtra (optional)
3. **Check:**
   - ✅ Form validation works
   - ✅ Password requirements displayed
   - ✅ Redirects to dashboard on success
   - ✅ JWT token stored in localStorage

### Test User Login

1. **Go to** http://localhost:5173/login
2. **Use credentials:**
   - Email: test@example.com
   - Password: Test@12345
3. **Check:**
   - ✅ Redirects to appropriate dashboard
   - ✅ User info displayed in sidebar
   - ✅ Protected routes accessible

### Test Forgot Password

1. **Go to** http://localhost:5173/forgot-password
2. **Enter email:** test@example.com
3. **Check:**
   - ✅ Success message appears
   - ✅ Email sent (check console if SMTP configured)

### Test Logout

1. **Click user avatar** → Logout
2. **Check:**
   - ✅ Redirected to home page
   - ✅ Cannot access protected routes
   - ✅ Token removed from localStorage

---

## 2. Testing Landing Page

### Visual Elements

1. **Go to** http://localhost:5173
2. **Check:**
   - ✅ Hero section with gradient background
   - ✅ Smooth animations on load
   - ✅ Statistics cards display
   - ✅ Features grid with icons
   - ✅ How It Works section
   - ✅ Responsive on mobile

### Navigation

1. **Test navbar:**
   - ✅ Logo links to home
   - ✅ Live Map → redirects
   - ✅ Track Complaint → redirects
   - ✅ Theme toggle works
   - ✅ Mobile menu works

2. **Test footer:**
   - ✅ All sections visible
   - ✅ Links clickable
   - ✅ Social icons present

---

## 3. Testing Track Complaint

### Valid Tracking

1. **Go to** http://localhost:5173/track
2. **Enter complaint ID:** Use any ID from database
   - Or use: NGS2024000001 (if exists)
3. **Check:**
   - ✅ Complaint details displayed
   - ✅ Status badge shown
   - ✅ Timeline visible
   - ✅ Location information

### Invalid Tracking

1. **Enter:** INVALID123
2. **Check:**
   - ✅ Error toast appears
   - ✅ "Not found" message

---

## 4. Testing Heatmap

### Map Loading

1. **Go to** http://localhost:5173/heatmap
2. **Check:**
   - ✅ Map loads (OpenStreetMap)
   - ✅ Markers visible (if data exists)
   - ✅ Default zoom and center
   - ✅ Legend displayed

### Filters

1. **Select category:** Roads
2. **Check:**
   - ✅ Map updates
   - ✅ Only road complaints shown
3. **Select priority:** Critical
4. **Check:**
   - ✅ Only critical complaints shown
   - ✅ Stats update

### Marker Interaction

1. **Click a marker**
2. **Check:**
   - ✅ Popup opens
   - ✅ Complaint info shown
   - ✅ Badges displayed

---

## 5. Testing Citizen Dashboard

### Dashboard Access

1. **Login as citizen**
2. **Go to** http://localhost:5173/citizen/dashboard
3. **Check:**
   - ✅ Welcome message with name
   - ✅ Stats cards (4 cards)
   - ✅ Recent complaints widget
   - ✅ Quick actions

### Navigation

1. **Test sidebar:**
   - ✅ Dashboard
   - ✅ Submit Complaint
   - ✅ My Complaints
   - ✅ Notifications
   - ✅ Profile
2. **Check:**
   - ✅ Active link highlighted
   - ✅ Icons displayed

---

## 6. Testing Dark Mode

### Toggle Theme

1. **Click moon/sun icon** in navbar
2. **Check:**
   - ✅ Theme switches instantly
   - ✅ All colors adapt
   - ✅ Preference saved in localStorage
3. **Refresh page**
4. **Check:**
   - ✅ Theme persists

---

## 7. Testing Responsive Design

### Mobile View (375px)

1. **Open DevTools** (F12)
2. **Toggle device toolbar** (Ctrl+Shift+M)
3. **Select:** iPhone SE or similar
4. **Check:**
   - ✅ Mobile menu works
   - ✅ Sidebar toggles
   - ✅ Forms stack vertically
   - ✅ Cards responsive
   - ✅ Buttons full-width

### Tablet View (768px)

1. **Select:** iPad
2. **Check:**
   - ✅ Layout adapts
   - ✅ Sidebar behavior
   - ✅ Grid columns adjust

### Desktop View (1920px)

1. **View on large screen**
2. **Check:**
   - ✅ Max-width containers
   - ✅ Proper spacing
   - ✅ No overflow

---

## 8. Testing Backend API

### Using Thunder Client / Postman

#### Test Authentication

**POST** http://localhost:5000/api/auth/register
```json
{
  "name": "API Test User",
  "email": "apitest@example.com",
  "password": "Test@12345"
}
```
✅ Should return 201 with user and token

**POST** http://localhost:5000/api/auth/login
```json
{
  "email": "apitest@example.com",
  "password": "Test@12345"
}
```
✅ Should return 200 with user and token

**GET** http://localhost:5000/api/auth/me
Headers: `Authorization: Bearer <token>`
✅ Should return user info

#### Test Complaints

**GET** http://localhost:5000/api/complaints/heatmap
✅ Should return array of complaints

**GET** http://localhost:5000/health
✅ Should return 200 OK

---

## 9. Testing AI Service

### Using Browser / Postman

**GET** http://localhost:8000
✅ Should return service info

**GET** http://localhost:8000/health
✅ Should return health status

**POST** http://localhost:8000/classify
```json
{
  "title": "Pothole on Main Street",
  "description": "There is a large dangerous pothole on Main Street near the hospital. It needs urgent repair as it's causing accidents.",
  "category": "roads",
  "location": {
    "coordinates": [72.8777, 19.0760],
    "address": "Main Street, Mumbai",
    "district": "Mumbai",
    "state": "Maharashtra"
  }
}
```

**Expected Response:**
```json
{
  "category": "roads",
  "department": "Public Works Department",
  "sentiment": "negative",
  "urgency_score": 75.5,
  "priority": "high",
  "summary": "Large pothole causing accidents...",
  "keywords": ["pothole", "dangerous", "urgent", "repair"],
  "confidence": 0.92,
  "abusive_detected": false,
  "language": "en"
}
```

✅ Check all fields are present and reasonable

---

## 10. Testing Error Handling

### Network Errors

1. **Stop backend server**
2. **Try to login**
3. **Check:**
   - ✅ Error toast appears
   - ✅ User-friendly message
   - ✅ No console errors

### Validation Errors

1. **Try to register with:**
   - Email: invalid-email
   - Password: 123
2. **Check:**
   - ✅ Field-level errors show
   - ✅ Submit button disabled
   - ✅ Red border on invalid fields

### 404 Errors

1. **Go to** http://localhost:5173/nonexistent
2. **Check:**
   - ✅ 404 page displays
   - ✅ "Go Home" button works

---

## 11. Testing Performance

### Page Load Speed

1. **Open DevTools** → Network tab
2. **Reload page**
3. **Check:**
   - ✅ Initial load < 2s
   - ✅ Resources cached
   - ✅ No failed requests

### Animation Performance

1. **Open DevTools** → Performance tab
2. **Record** while navigating
3. **Check:**
   - ✅ 60 FPS maintained
   - ✅ No jank
   - ✅ Smooth transitions

---

## 12. Testing Browser Compatibility

### Chrome (Recommended)
- ✅ All features work
- ✅ Animations smooth
- ✅ No console errors

### Firefox
- ✅ All features work
- ✅ Styles render correctly

### Safari
- ✅ All features work
- ✅ Webkit animations work

### Edge
- ✅ All features work
- ✅ Compatible

---

## 13. Testing Security

### Protected Routes

1. **Logout**
2. **Try to access:** http://localhost:5173/citizen/dashboard
3. **Check:**
   - ✅ Redirected to /login
   - ✅ Cannot access without auth

### Role-Based Access

1. **Login as citizen**
2. **Try to access:** http://localhost:5173/admin/dashboard
3. **Check:**
   - ✅ Redirected to citizen dashboard
   - ✅ Cannot access admin routes

### XSS Protection

1. **Try to register with:**
   - Name: `<script>alert('xss')</script>`
2. **Check:**
   - ✅ Escaped properly
   - ✅ No script execution

---

## 14. Common Test Scenarios

### Happy Path: New User Journey

1. ✅ Visit landing page
2. ✅ Click "Register"
3. ✅ Fill form and submit
4. ✅ View dashboard
5. ✅ Navigate using sidebar
6. ✅ Toggle dark mode
7. ✅ Check profile
8. ✅ Logout

### Error Path: Invalid Credentials

1. ✅ Go to login
2. ✅ Enter wrong password
3. ✅ See error message
4. ✅ Click "Forgot Password"
5. ✅ Enter email
6. ✅ See success message

---

## 15. Load Testing (Optional)

### Using Apache Bench

```bash
# Test login endpoint
ab -n 100 -c 10 -p login.json -T application/json \
  http://localhost:5000/api/auth/login

# Test heatmap endpoint
ab -n 100 -c 10 \
  http://localhost:5000/api/complaints/heatmap
```

**Expected:**
- ✅ No failed requests
- ✅ Average response < 200ms
- ✅ Rate limiting works (if enabled)

---

## 16. Database Testing

### Check MongoDB

```bash
# Connect to MongoDB
mongosh

# Use database
use nagar-setu

# Check collections
show collections

# Count users
db.users.countDocuments()

# Find test user
db.users.findOne({ email: "test@example.com" })

# Check indexes
db.complaints.getIndexes()
```

✅ All collections should exist
✅ Indexes should be created

---

## Test Checklist

### Before Demo/Submission:

- [ ] All services start without errors
- [ ] Registration works
- [ ] Login works
- [ ] Dashboard loads
- [ ] Dark mode works
- [ ] Responsive on mobile
- [ ] Heatmap displays
- [ ] Track complaint works
- [ ] API endpoints respond
- [ ] AI service classifies
- [ ] No console errors
- [ ] Professional appearance
- [ ] Smooth animations
- [ ] Fast loading

---

## Known Issues (Expected)

These are placeholders and are expected:
- ❌ Submit Complaint form (placeholder)
- ❌ Complaint detail page (placeholder)
- ❌ Officer/Admin dashboards (placeholder)
- ❌ Chat functionality (not implemented)
- ❌ Real-time notifications (not implemented)

Everything else should work perfectly! ✅

---

## Debugging Tips

### If Backend Fails:
```bash
# Check MongoDB connection
mongosh

# Check logs
cd server && npm run dev
# Look for connection errors
```

### If AI Service Fails:
```bash
# Check Python version
python --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### If Frontend Fails:
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check .env file
cat .env
```

---

## Success Criteria ✅

Your application is working correctly if:

1. ✅ All services start
2. ✅ No critical console errors
3. ✅ Registration → Login → Dashboard flow works
4. ✅ Pages load < 2 seconds
5. ✅ Dark mode toggles smoothly
6. ✅ Responsive on all devices
7. ✅ API returns valid responses
8. ✅ AI classifies complaints
9. ✅ Map shows markers
10. ✅ Professional look and feel

---

**If all tests pass, you're ready for deployment or presentation! 🎉**

---

*Happy Testing!*
