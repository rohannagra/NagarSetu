# 🎯 How to Access Different Dashboards

## 🔐 Login Credentials

### Officer Account (for Officer Dashboard)
```
Email: officer@test.com
Password: password123
```

### Citizen Account (for Citizen Dashboard)
```
Email: citizen@test.com
Password: password123
```

### Admin Account (for Admin Dashboard)
```
Email: admin@test.com
Password: password123
```

---

## 📍 How to Access Officer Dashboard

### Method 1: Direct Login
1. Open http://localhost:5173
2. Click "Login" button
3. Enter officer credentials:
   - Email: `officer@test.com`
   - Password: `password123`
4. Click "Sign In"
5. You'll be automatically redirected to: **http://localhost:5173/officer/dashboard**

### Method 2: Direct URL
1. If already logged in as officer, go to: **http://localhost:5173/officer/dashboard**

---

## 📱 Officer Dashboard Features

Once logged in as officer, you can:

### Main Dashboard
- View total assigned complaints
- See pending complaints count
- Track in-progress complaints
- View resolved complaints
- See recently assigned complaints

### Navigation Menu (Left Sidebar)
- **Dashboard** - Overview and stats
- **Complaints** - Manage all assigned complaints
- **Notifications** - View updates
- **Profile** - Update your profile

### Complaints Management
- Click "Complaints" in sidebar
- Or go to: http://localhost:5173/officer/complaints
- Here you can:
  - Accept assigned complaints
  - Reject complaints (with reason)
  - Update status (in progress, resolved, etc.)
  - Add comments and updates
  - View complaint details

---

## 🚨 LOGOUT FIX Applied

The logout issue has been fixed! Changes made:

### What Was Fixed:
1. **Logout now clears localStorage immediately** - No waiting for backend
2. **Redirects to login page** - After logout
3. **Page reloads automatically** - To clear all state
4. **Works even if backend fails** - Local logout always succeeds

### How to Logout:
1. Click on your profile picture/name (top right)
2. Hover over the profile menu
3. Click "Logout" button
4. You'll be redirected to login page

### Alternative Logout Method:
- Just close the browser tab and reopen
- localStorage is automatically cleared on logout

---

## 🔄 Switching Between Dashboards

### To Switch Roles:
1. Logout from current account (click profile → Logout)
2. Login with different credentials
3. You'll be redirected to the appropriate dashboard

### Dashboard URLs by Role:

| Role | Dashboard URL |
|------|--------------|
| Citizen | http://localhost:5173/citizen/dashboard |
| Officer | http://localhost:5173/officer/dashboard |
| Admin | http://localhost:5173/admin/dashboard |

---

## 🎯 Quick Test Guide

### Test Officer Dashboard:
1. Go to: http://localhost:5173/login
2. Login as: `officer@test.com` / `password123`
3. See officer dashboard with stats
4. Click "Complaints" in sidebar
5. View assigned complaints
6. Click on a complaint to manage it
7. Try accepting/rejecting
8. Add status update

### Test Logout:
1. While logged in, click your name (top right)
2. Hover to see dropdown menu
3. Click "Logout" (red button)
4. Verify you're redirected to login page
5. Try logging in again

---

## 🔍 Troubleshooting

### Can't See Officer Dashboard?
- Make sure you're logged in with officer account
- Check URL: Should be `/officer/dashboard`
- If logged in as citizen/admin, logout and login as officer

### Logout Not Working?
- **FIXED!** The latest update ensures logout always works
- If still stuck, clear browser data manually:
  1. Press F12 (open DevTools)
  2. Go to "Application" tab
  3. Click "Local Storage"
  4. Delete "token" entry
  5. Refresh page

### Sidebar Not Showing?
- Click the hamburger menu icon (☰) in top left
- On mobile, sidebar is hidden by default
- On desktop (width > 1024px), sidebar is always visible

### Wrong Dashboard Showing?
- Each role has different dashboard
- Citizen: `/citizen/dashboard`
- Officer: `/officer/dashboard`
- Admin: `/admin/dashboard`
- App automatically redirects based on your role after login

---

## 📊 Dashboard Navigation Map

```
After Login
│
├─ Citizen (citizen@test.com)
│  └─ /citizen/dashboard
│     ├─ Submit Complaint (/citizen/submit)
│     ├─ My Complaints (/citizen/complaints)
│     ├─ Notifications (/citizen/notifications)
│     └─ Profile (/citizen/profile)
│
├─ Officer (officer@test.com)
│  └─ /officer/dashboard ← YOU WANT THIS!
│     ├─ Complaints (/officer/complaints)
│     ├─ Notifications (/officer/notifications)
│     └─ Profile (/officer/profile)
│
└─ Admin (admin@test.com)
   └─ /admin/dashboard
      ├─ Manage Users (/admin/users)
      ├─ Manage Departments (/admin/departments)
      ├─ Analytics (/admin/analytics)
      ├─ Notifications (/admin/notifications)
      └─ Profile (/admin/profile)
```

---

## ✅ What's Working Now

- ✅ Logout fixed - Always works
- ✅ Officer dashboard accessible
- ✅ All role-based navigation working
- ✅ Sidebar shows correct menu items
- ✅ Profile dropdown works
- ✅ Notifications accessible
- ✅ Theme toggle working

---

## 🎉 Quick Links

| Action | Link |
|--------|------|
| **Login Page** | http://localhost:5173/login |
| **Officer Dashboard** | http://localhost:5173/officer/dashboard |
| **Officer Complaints** | http://localhost:5173/officer/complaints |
| **Citizen Dashboard** | http://localhost:5173/citizen/dashboard |
| **Admin Dashboard** | http://localhost:5173/admin/dashboard |

---

**Need Help?** Check `TEST_NOW.md` for testing guide or `docs/WHAT_IS_READY.md` for full status!
