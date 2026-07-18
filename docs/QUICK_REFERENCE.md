# 🚀 Nagar Setu - Quick Reference Card

## URLs to Remember

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:5173/ | ✅ Running |
| **Backend API** | http://localhost:5000/api | ✅ Running |
| **Health Check** | http://localhost:5000/health | ✅ Running |
| **AI Service** | http://localhost:8000 | Ready |

---

## Key Commands

### Start Services
```bash
# All at once
start.bat

# Individual services
cd client && npm run dev      # Frontend
cd server && npm run dev      # Backend  
cd ai-service && uvicorn app.main:app --reload --port 8000  # AI
```

### Stop Services
```bash
# Close terminal windows or press Ctrl+C in each
```

### Reset/Troubleshoot
```bash
# Clear caches
rm -rf client/node_modules/.vite
rm -rf client/.cache

# Reinstall dependencies
cd client && npm install
cd server && npm install
```

---

## File Locations

### Data Files (JSON Storage)
```
server/data/users.json          # All users
server/data/complaints.json     # All complaints
server/data/departments.json    # Government departments
server/data/notifications.json  # Notifications
```

### Configuration Files
```
client/.env                     # Frontend config
server/.env                     # Backend config
```

### Logs & Uploads
```
server/uploads/                 # Uploaded files
server/logs/                    # Application logs (if enabled)
```

---

## User Roles

| Role | Access Level | Default Route |
|------|-------------|---------------|
| **citizen** | Submit & track complaints | /citizen/dashboard |
| **officer** | View & respond to complaints | /officer/dashboard |
| **department_admin** | Manage department | /admin/dashboard |
| **super_admin** | Full system access | /admin/dashboard |

**Note**: New registrations default to `citizen` role.

---

## API Endpoints (Quick Reference)

### Authentication
```
POST /api/auth/register     # Register new user
POST /api/auth/login        # Login
GET  /api/auth/me           # Get current user
POST /api/auth/logout       # Logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Complaints
```
POST   /api/complaints           # Create complaint
GET    /api/complaints           # List all (with filters)
GET    /api/complaints/:id       # Get single complaint
PUT    /api/complaints/:id       # Update complaint
DELETE /api/complaints/:id       # Delete complaint
POST   /api/complaints/:id/comment  # Add comment
GET    /api/complaints/track/:complaintId  # Track by ID
```

### Users (Admin)
```
GET    /api/users               # List users
GET    /api/users/:id           # Get user
PUT    /api/users/:id           # Update user
DELETE /api/users/:id           # Delete user
```

---

## Environment Variables

### Frontend (client/.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_AI_SERVICE_URL=http://localhost:8000
```

### Backend (server/.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nagar-setu
JWT_SECRET=your-secret-key
AI_SERVICE_URL=http://localhost:8000
CLIENT_URL=http://localhost:5173
```

---

## Complaint Categories

```typescript
- Infrastructure       // Roads, bridges, buildings
- Water Supply        // Water issues
- Electricity         // Power problems  
- Garbage             // Waste management
- Traffic             // Traffic issues
- Public Safety       // Safety concerns
- Health              // Healthcare
- Education           // Schools, education
- Environment         // Pollution, trees
- Other              // Miscellaneous
```

---

## Complaint Status Flow

```
Pending → Acknowledged → In Progress → Resolved → Closed
                                   ↓
                               Rejected
```

---

## Priority Levels

| Priority | Response Time | Color |
|----------|--------------|-------|
| **Low** | 7 days | Gray |
| **Medium** | 3 days | Yellow |
| **High** | 1 day | Orange |
| **Critical** | 4 hours | Red |

---

## Keyboard Shortcuts (Browser)

| Shortcut | Action |
|----------|--------|
| **F12** | Open Developer Console |
| **Ctrl+Shift+R** | Hard Refresh (clear cache) |
| **Ctrl+Shift+Delete** | Clear browsing data |
| **F5** | Refresh page |
| **Esc** | Close modals |

---

## Troubleshooting Quick Tips

### Page is blank?
1. Check browser console (F12)
2. Check if backend is running
3. Clear cache (Ctrl+Shift+R)

### Can't login?
1. Check credentials
2. Clear localStorage: `localStorage.clear()`
3. Try registering again

### Map not loading?
1. Check internet connection
2. Check Leaflet CSS in index.html
3. Check browser console for errors

### Data not saving?
1. Check `server/data/` folder exists
2. Verify JSON files are valid
3. Check write permissions

### Port already in use?
1. Close existing terminals
2. Kill process on that port
3. Change port in vite.config.ts

---

## Testing Checklist

- [ ] Open http://localhost:5173/
- [ ] Register a new account
- [ ] Login with credentials
- [ ] Submit a test complaint
  - [ ] Fill all fields
  - [ ] Select location on map
  - [ ] Upload an image
  - [ ] Submit
- [ ] View "My Complaints"
- [ ] Click on complaint to see details
- [ ] Check AI analysis shows up
- [ ] Try tracking complaint by ID
- [ ] View heatmap page
- [ ] Test logout and login again

---

## Performance Tips

### Frontend
- Clear `.vite` cache if build is slow
- Use `npm run build` for production build
- Enable production mode for better performance

### Backend
- Use MongoDB for better performance (vs file storage)
- Enable caching for frequently accessed data
- Monitor file I/O operations

### Development
- Use `npm run dev` for hot reload
- Keep browser console open to catch errors
- Monitor network tab for slow requests

---

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS origins
- [ ] Enable rate limiting
- [ ] Validate all user inputs
- [ ] Sanitize file uploads
- [ ] Use strong passwords
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Backup data regularly

---

## Data Backup (File Storage Mode)

### Manual Backup
```bash
# Create backup folder
mkdir backups

# Copy data files
cp server/data/*.json backups/backup-$(date +%Y%m%d).json
```

### Restore from Backup
```bash
# Copy backup files back
cp backups/backup-YYYYMMDD.json server/data/
```

**Recommendation**: Backup daily before testing!

---

## Useful Links

### Documentation
- Full Guide: `README_COMPLETE.md`
- Setup Guide: `HOW_TO_RUN.md`
- Troubleshooting: `TROUBLESHOOTING.md`
- MongoDB Setup: `MONGODB_SETUP.md`

### External Resources
- React Docs: https://react.dev/
- Node.js Docs: https://nodejs.org/
- Tailwind CSS: https://tailwindcss.com/
- Leaflet Maps: https://leafletjs.com/
- FastAPI Docs: https://fastapi.tiangolo.com/

---

## Support & Help

### Error Logs Location
- Frontend: Browser Console (F12)
- Backend: Terminal output
- AI Service: Terminal output

### Common Error Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (check input)
- **401**: Unauthorized (login required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Server Error (check backend logs)

---

## Git Commands (Version Control)

```bash
# Check status
git status

# Commit changes
git add .
git commit -m "Description of changes"

# Create branch
git checkout -b feature/my-feature

# Push changes
git push origin main
```

---

## Production Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Change all secret keys
- [ ] Setup MongoDB (not file storage)
- [ ] Enable HTTPS
- [ ] Configure SMTP for emails
- [ ] Setup proper logging
- [ ] Enable rate limiting
- [ ] Setup monitoring
- [ ] Configure backups
- [ ] Test all features
- [ ] Performance testing
- [ ] Security audit

---

## 🎯 Remember

**Frontend**: http://localhost:5173/  
**Backend**: http://localhost:5000/  
**Status**: ✅ All Working!

**Files Fixed**:
- ✅ Import errors in SubmitComplaint.tsx
- ✅ Import errors in MyComplaints.tsx
- ✅ MongoDB fallback to file storage
- ✅ Tailwind CSS configuration

**Your app is ready to use!** 🚀

---

*Quick Reference - v1.0*
*Last Updated: July 3, 2026*
