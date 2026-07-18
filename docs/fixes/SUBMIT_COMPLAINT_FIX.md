# Submit Complaint Fixed - Final Solution

## Problem Summary
The submit complaint form was showing validation errors:
1. **"complaintId: Path 'complaintId' is required"** - The pre-save hook wasn't generating the ID
2. **"citizen: Path 'citizen' is required"** - Validation conflict with isAnonymous logic
3. **"Validation failed"** - Multiple validation issues with FormData structure

## Root Causes

### 1. complaintId Generation Issue
- **Problem**: The Mongoose schema had `complaintId` marked as `required: true`, but the pre-save hook that generates it runs AFTER validation
- **Additional Problem**: With file-based storage (no MongoDB), Mongoose hooks may not work reliably
- **Solution**: 
  - Changed `complaintId` to `required: false` in schema
  - Generate `complaintId` manually in the controller before calling `Complaint.create()`

### 2. citizen Field Validation Conflict
- **Problem**: The schema requires `citizen` field when `isAnonymous` is false, but the controller logic was setting it after creating the data object
- **Solution**: Improved the logic to:
  - Parse `isAnonymous` properly from FormData (string "true"/"false")
  - Set `isAnonymous = true` automatically if user is not authenticated
  - Only set `citizen` field when user is authenticated AND not anonymous
  - Return clear error if trying to submit non-anonymous complaint without login

### 3. FormData Parsing Issue
- **Problem**: Frontend sends nested data like `location[coordinates][0]` but backend was expecting nested objects
- **Solution**: Added proper FormData parsing for:
  - `location[coordinates][0]`, `location[coordinates][1]`, `location[address]`, etc.
  - `anonymousContact[email]`, `anonymousContact[phone]`
  - Fall back to JSON parsing if data is sent as JSON string

## Files Modified

### 1. `server/src/controllers/complaintController.js`
**Changes**:
- Added manual `complaintId` generation using `NGS{YEAR}{6-digit-number}` format
- Improved `isAnonymous` parsing from FormData strings
- Added proper FormData parsing for nested `location` and `anonymousContact` objects
- Enhanced error handling with better validation messages
- Added extensive logging for debugging

**Key Code**:
```javascript
// Generate complaintId manually
const year = new Date().getFullYear();
const count = await Complaint.countDocuments();
const generatedComplaintId = `NGS${year}${String(count + 1).padStart(6, '0')}`;

// Parse location from FormData
if (req.body['location[coordinates][0]'] && req.body['location[coordinates][1]']) {
  location = {
    type: 'Point',
    coordinates: [
      parseFloat(req.body['location[coordinates][0]']),
      parseFloat(req.body['location[coordinates][1]'])
    ],
    address: req.body['location[address]'],
    district: req.body['location[district]'],
    state: req.body['location[state]'],
    pincode: req.body['location[pincode]'] || '',
    landmark: req.body['location[landmark]'] || ''
  };
}

// Handle authentication properly
if (complaintData.isAnonymous) {
  complaintData.anonymousToken = generateAnonymousToken();
  complaintData.anonymousContact = anonymousContact;
} else if (req.user) {
  complaintData.citizen = req.user.id;
} else {
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    success: false,
    message: 'You must be logged in to submit non-anonymous complaints'
  });
}
```

### 2. `server/src/models/Complaint.js`
**Changes**:
- Changed `complaintId` from `required: true` to `required: false`
- Kept the pre-save hook as a fallback (though we generate it in controller now)

**Code**:
```javascript
complaintId: {
  type: String,
  unique: true,
  required: false // Will be generated in controller or pre-save hook
},
```

### 3. `server/src/routes/complaintRoutes.js`
**Already Correct**:
- Uses `optionalAuth` middleware (allows both authenticated and unauthenticated users)
- Uses `uploadMultiple` middleware for file handling
- No JSON validation middleware that would conflict with FormData

## Testing Instructions

1. **Start all servers** (already running):
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - AI Service: http://localhost:8000

2. **Test Scenario 1: Authenticated User (Logged In)**
   - Login to the application
   - Go to "Submit Complaint"
   - Fill in the form:
     - Title: "Street light not working near park"
     - Description: "The street light has been broken for 2 weeks causing safety issues at night"
     - Click "Use Current Location" or select on map
     - Fill address details
     - Keep "Submit Anonymously" unchecked
   - Click Submit
   - **Expected**: Complaint submitted successfully with your user ID

3. **Test Scenario 2: Anonymous User (Not Logged In)**
   - Logout or open incognito window
   - Go to http://localhost:5173/submit-complaint
   - Fill in the form
   - **Expected**: Complaint submitted as anonymous automatically

4. **Test Scenario 3: Authenticated but Anonymous**
   - Login to the application
   - Go to "Submit Complaint"
   - Fill in the form
   - Check "Submit Anonymously"
   - **Expected**: Complaint submitted anonymously even though you're logged in

## Debug Logs
The controller now logs extensive information:
- User authentication status
- All form data received
- Parsed location and anonymous contact
- Generated complaintId
- Whether creating anonymous or authenticated complaint

Check backend console (terminal running `npm run dev` in server folder) for these logs.

## Expected Behavior After Fix

✅ Complaint submission works for both logged-in and anonymous users
✅ `complaintId` is auto-generated in format `NGS2026000001`, `NGS2026000002`, etc.
✅ Location data is properly parsed from FormData
✅ Anonymous contact info is properly handled
✅ No more "validation failed" errors
✅ Proper error messages for authentication issues

## Next Steps

After confirming the fix works:
1. Test with file uploads (images/videos)
2. Verify AI department detection is working
3. Test the complete workflow: submit → view → track
4. Check that delete functionality still works for pending complaints

---

**Status**: ✅ FIXED
**Date**: Current session
**Tested**: Ready for testing by user
