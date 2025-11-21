# InfraSense - Issue Display Debugging Guide

## Problem
Issues are being created successfully but not appearing in the StudentDashboard.

## What I Fixed

### 1. ✅ Enhanced Error Handling in StudentDashboard
- Added null/undefined checks for API responses
- Fallback to empty array if data format is wrong
- Separated gamification errors from issue loading errors
- Better error messages with toast notifications

### 2. ✅ Added Comprehensive Console Logging
All critical points now log to browser console:

#### API Layer (`/utils/api.tsx`)
- `[API createIssue]` - Logs when creating issues
- `[API getIssues]` - Logs when fetching issues
- Shows auth data, endpoint called, and response data

#### Dashboard Layer (`/components/StudentDashboard.tsx`)
- `[StudentDashboard]` - Logs data loading flow
- Shows issue count, filtering results, and final state

### 3. ✅ Added Refresh Button
A manual refresh button next to "Current Issues" header to reload data on demand.

## How to Debug

### Step 1: Open Browser Console
Press F12 or right-click → Inspect → Console tab

### Step 2: Create an Issue
1. Click "Report Issue"
2. Fill out the form and submit
3. Watch for these logs in console:

```
[API createIssue] Creating issue with data: {...}
[API createIssue] Auth data: { accessToken: "...", user: {...}, profile: {...} }
[API createIssue] Issue created successfully: { issue: {...}, message: "..." }
```

**Check:**
- ✅ Auth data has `accessToken` and `user.id`
- ✅ Issue created successfully message appears
- ✅ Response contains the created issue object

### Step 3: Check Dashboard Data Loading
After creating, go back to dashboard and click "Refresh" button or reload page:

```
[StudentDashboard] Loading dashboard data...
[API getIssues] Calling endpoint: /issues
[API getIssues] Auth data: { accessToken: "...", user: {...} }
[API getIssues] Response data: { issues: [...] }
[API getIssues] Issues array: [...]
[API getIssues] Issues count: X
[StudentDashboard] Loaded issues: [...]
[StudentDashboard] Issues type: object Is array: true
[StudentDashboard] Issues array: [...]
[StudentDashboard] Valid issues: [...]
[StudentDashboard] Current issues: X Past issues: Y
```

**Check:**
- ✅ Auth data matches the user who created the issue
- ✅ Issues array is not empty
- ✅ Issues count > 0
- ✅ Current issues count > 0 (if status is 'open')

## Common Issues & Solutions

### Issue 1: No Auth Token
**Symptoms:**
```
[API getIssues] Auth data: null
API Error: Unauthorized: No access token provided
```

**Solution:**
- User is not logged in
- Auth data was cleared
- Need to login again

### Issue 2: Wrong User ID
**Symptoms:**
```
[API getIssues] Issues count: 0
[StudentDashboard] Current issues: 0
```
But backend logs show:
```
[GET /issues] Student - returning 0 issues for user: abc-123
```

**Solution:**
- Check if user ID from createIssue matches getIssues
- Compare `[API createIssue] Auth data.user.id` with `[API getIssues] Auth data.user.id`

### Issue 3: Backend Not Returning Data
**Symptoms:**
```
[API getIssues] Response data: { issues: [] }
[API getIssues] Issues count: 0
```

**Solution:**
- Check backend logs in Supabase dashboard
- Look for `[GET /issues] Student - returning X issues for user: ...`
- Verify backend `getUserIssues()` function is working
- Check if `user-issue:{userId}:{issueId}` keys exist in KV store

### Issue 4: Data Structure Mismatch
**Symptoms:**
```
[StudentDashboard] Valid issues: [...]
[StudentDashboard] Current issues: 0
```
Issues exist but filtering returns 0.

**Solution:**
- Check issue.status values in console
- Ensure status is one of: 'open', 'assigned', 'in-progress'
- Check if status field exists on issue objects

## Backend Verification

### Check KV Store Keys
The backend creates these keys when an issue is created:
- `issue:{issueId}` - The actual issue data
- `user-issue:{userId}:{issueId}` - Index for user's issues

### Backend Function Flow
1. **Create Issue**: `POST /make-server-f232df90/issues`
   - Gets user.id from auth token
   - Creates issue with userId: user.id
   - Stores in KV with both keys

2. **Get Issues**: `GET /make-server-f232df90/issues`
   - Gets user.id from auth token
   - If student: calls `getUserIssues(user.id)`
   - Returns all issues for that user

## Quick Test

Run this in browser console to see current auth:
```javascript
const auth = localStorage.getItem('infrasense_auth');
console.log('Current auth:', JSON.parse(auth));
```

Should show:
```json
{
  "accessToken": "ey...",
  "user": {
    "id": "abc-123-...",
    "email": "student@example.com"
  },
  "profile": {
    "name": "Student Name",
    "role": "student",
    ...
  }
}
```

## Next Steps

1. ✅ Check browser console logs (most important!)
2. ✅ Click the Refresh button to manually reload
3. ✅ Verify auth data has user.id
4. ✅ Check that issues are being returned from API
5. ✅ If issues array is empty, check backend logs
6. ✅ Compare user.id between create and fetch operations

## Expected Behavior

After creating an issue:
1. Issue is stored with `userId` = authenticated user's ID
2. Dashboard fetches issues for authenticated user's ID
3. Issues with status 'open', 'assigned', or 'in-progress' show in "Current Issues"
4. Issues with status 'resolved' or 'closed' show in "Past Issues"

The logs will tell you exactly where the flow breaks! 🔍
