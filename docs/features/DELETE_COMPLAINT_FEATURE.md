# Delete Complaint Feature - Added ✅

## Feature Overview
Users can now delete their own complaints, but **only if the complaint is still in PENDING status** (not yet assigned or processed by officials).

## What Was Added

### 1. Backend API Endpoint
**File**: `server/src/controllers/complaintController.js`
- ✅ New function: `deleteComplaint()`
- ✅ Validates ownership (user can only delete their own complaints)
- ✅ Validates status (only PENDING complaints can be deleted)
- ✅ Cleans up related data (chats, notifications)
- ✅ Creates audit log for tracking

**File**: `server/src/routes/complaintRoutes.js`
- ✅ New route: `DELETE /api/complaints/:id`
- ✅ Protected route (requires authentication)
- ✅ Only accessible to CITIZENS

### 2. Frontend Service
**File**: `client/src/services/complaintService.ts`
- ✅ New function: `deleteComplaint(id: string)`
- ✅ Calls backend DELETE endpoint
- ✅ Returns success/error response

### 3. Frontend UI
**File**: `client/src/pages/citizen/MyComplaints.tsx`
- ✅ Added Trash icon import
- ✅ Added delete handler function with confirmation
- ✅ Added "Delete" button next to "View Details"
- ✅ Button only shows for PENDING complaints
- ✅ Red styling to indicate destructive action
- ✅ Shows success/error toast messages

## How It Works

### User Experience
1. User goes to **My Complaints** page
2. For complaints with status = **"PENDING"**, a red **"Delete"** button appears
3. User clicks Delete button
4. Confirmation dialog: "Are you sure you want to delete this complaint? This action cannot be undone."
5. If confirmed:
   - Complaint is deleted
   - Related chats and notifications are removed
   - Success message: "Complaint deleted successfully"
   - Complaint list refreshes automatically

### Restrictions
- ✅ **Only PENDING complaints** can be deleted
- ✅ **Only the owner** can delete their complaint
- ✅ Once processed (assigned, in progress, resolved, etc.), complaints **CANNOT be deleted**
- ✅ Confirmation required before deletion

### Security
- ✅ Backend validates user authentication
- ✅ Backend validates complaint ownership
- ✅ Backend validates complaint status
- ✅ Creates audit log for accountability
- ✅ Prevents deletion of processed complaints

## API Endpoint Details

### DELETE /api/complaints/:id

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Complaint deleted successfully"
}
```

**Error Responses:**

**404 - Not Found:**
```json
{
  "success": false,
  "message": "Complaint not found"
}
```

**403 - Forbidden (Not Owner):**
```json
{
  "success": false,
  "message": "You can only delete your own complaints"
}
```

**403 - Forbidden (Already Processed):**
```json
{
  "success": false,
  "message": "Only pending complaints can be deleted. This complaint has already been processed."
}
```

## Testing

### To Test:
1. **Login as a citizen**
2. **Submit a new complaint** (it will be in PENDING status)
3. **Go to "My Complaints"** page
4. You should see a red **"Delete"** button next to the new complaint
5. **Click Delete** → Confirm → Complaint is removed
6. Try to delete a complaint that has been assigned/in progress → Should show error

### Test Cases:
- ✅ Delete own pending complaint → Success
- ✅ Try to delete someone else's complaint → 403 Forbidden
- ✅ Try to delete assigned complaint → 403 Forbidden
- ✅ Try to delete resolved complaint → 403 Forbidden
- ✅ Cancel deletion when prompted → No change
- ✅ Confirm deletion → Complaint removed and list refreshed

## Files Modified

### Backend:
1. ✅ `server/src/controllers/complaintController.js` - Added deleteComplaint function
2. ✅ `server/src/routes/complaintRoutes.js` - Added DELETE route

### Frontend:
1. ✅ `client/src/services/complaintService.ts` - Added deleteComplaint service
2. ✅ `client/src/pages/citizen/MyComplaints.tsx` - Added delete button and handler

## Status: ✅ READY TO TEST

Both backend and frontend servers have automatically reloaded with the new changes.

**Test now at**: http://localhost:5173/citizen/my-complaints
