# 🚀 Quick Start Guide - Nagar Setu

## ✅ Servers Running

All servers are currently running:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **AI Service:** http://localhost:8000

---

## 📍 Step-by-Step Access Guide

### Step 1: Open the Landing Page
**👉 [http://localhost:5173](http://localhost:5173) 👈**

You should see a beautiful landing page with:
- Hero section
- Features showcase
- How it works
- Statistics

---

### Step 2: Register an Account

**Click "Get Started" or "Register"**

Or directly visit: http://localhost:5173/register

**Fill in the form:**
- Name: Your Name
- Email: test@example.com (any email works)
- Phone: +91 9876543210 (any phone)
- Password: 123456 (minimum 6 characters)
- Role: Citizen

**Click "Register"**

---

### Step 3: Login

After registration, you'll be redirected to login.

Or visit: http://localhost:5173/login

**Enter your credentials:**
- Email: test@example.com
- Password: 123456

**Click "Login"**

---

### Step 4: You'll Be Redirected

After successful login, you'll be redirected based on your role:

- **Citizen:** http://localhost:5173/citizen/dashboard
- **Officer:** http://localhost:5173/officer/dashboard
- **Admin:** http://localhost:5173/admin/dashboard

---

## 🎯 Available URLs

### Public Pages (No Login Required):
- Landing: http://localhost:5173
- Login: http://localhost:5173/login
- Register: http://localhost:5173/register
- Track Complaint: http://localhost:5173/track
- Heatmap: http://localhost:5173/heatmap

### Citizen Pages (Login Required):
- Dashboard: http://localhost:5173/citizen/dashboard
- Submit Complaint: http://localhost:5173/citizen/submit
- My Complaints: http://localhost:5173/citizen/complaints
- Profile: http://localhost:5173/citizen/profile
- Notifications: http://localhost:5173/citizen/notifications

### Officer Pages (Officer Login Required):
- Dashboard: http://localhost:5173/officer/dashboard
- Complaints: http://localhost:5173/officer/complaints
- Profile: http://localhost:5173/officer/profile
- Notifications: http://localhost:5173/officer/notifications

### Admin Pages (Admin Login Required):
- Dashboard: http://localhost:5173/admin/dashboard
- Manage Users: http://localhost:5173/admin/users
- Manage Departments: http://localhost:5173/admin/departments
- Analytics: http://localhost:5173/admin/analytics
- Profile: http://localhost:5173/admin/profile
- Notifications: http://localhost:5173/admin/notifications

---

## ❓ Troubleshooting

### If You See 404 Error:

**1. Check if you're trying to access a protected route without logging in**
   - Protected routes require login
   - You'll be redirected to login page

**2. Make sure you're accessing the correct URL**
   - Don't add trailing slashes
   - Use exact URLs listed above

**3. Clear browser cache**
   - Press Ctrl + Shift + Delete
   - Clear cached images and files
   - Refresh page (Ctrl + F5)

**4. Check if you're logged in**
   - Open browser DevTools (F12)
   - Go to Application > Local Storage
   - Check if "token" exists

### If Landing Page Won't Load:

**1. Check frontend server**
   - Should show: "VITE ready in XXX ms"
   - Running on: http://localhost:5173

**2. Check browser console (F12)**
   - Look for any red errors
   - Tell me what error you see

**3. Try a different browser**
   - Chrome
   - Firefox
   - Edge

---

## 🔐 Test Accounts

After you register, here are some test scenarios:

### Citizen Account:
```
Email: citizen@test.com
Password: 123456
```

### Officer Account:
```
Email: officer@test.com
Password: 123456
```

### Admin Account:
```
Email: admin@test.com
Password: 123456
```

*(Create these by registering with the respective roles)*

---

## 💡 What To Do If 404 Persists

1. **Tell me the exact URL you're visiting**
   - Copy and paste it here

2. **Tell me if you're logged in**
   - Check top-right corner
   - Do you see your name/avatar?

3. **Check the browser console**
   - Press F12
   - Go to Console tab
   - Copy any errors

4. **Try this sequence:**
   ```
   1. Visit: http://localhost:5173
   2. Click "Register" button
   3. Fill form and submit
   4. Login with your credentials
   5. You should see dashboard
   ```

---

## 🎊 Quick Test Checklist

- [ ] Can access http://localhost:5173 (landing page)
- [ ] Can register a new account
- [ ] Can login successfully
- [ ] Can see dashboard after login
- [ ] Can submit a complaint
- [ ] Can view my complaints
- [ ] Can access profile
- [ ] Can view notifications

---

## 📱 Direct Links to Try

**Start Here (No Login):**
- **Landing Page:** http://localhost:5173/

**Then Register:**
- **Register Page:** http://localhost:5173/register

**Then Login:**
- **Login Page:** http://localhost:5173/login

**After Login (Citizen):**
- **Dashboard:** http://localhost:5173/citizen/dashboard
- **Submit:** http://localhost:5173/citizen/submit

---

## 🆘 Still Seeing 404?

Tell me:
1. **What URL shows in your address bar?**
2. **Are you logged in?** (Do you see your name in top right?)
3. **What does the 404 page say?** (Take a screenshot if possible)
4. **Did registration/login work?**

I'll help you debug it! 🔍

