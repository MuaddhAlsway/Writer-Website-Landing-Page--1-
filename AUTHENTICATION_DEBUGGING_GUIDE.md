# Step-by-Step Debugging Guide

## 1. CHECK NETWORK TAB (Browser DevTools)

### Step 1: Open DevTools
- Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Go to **Network** tab

### Step 2: Login
- Go to admin dashboard
- Enter credentials and click "Sign In"
- Look for a request to `/api/admin/login`

### Step 3: Check Login Response
- Click on the `/api/admin/login` request
- Go to **Response** tab
- You should see:
```json
{
  "success": true,
  "accessToken": "demo-token-1234567890",
  "refreshToken": "refresh-token-1234567890",
  "expiresIn": 900,
  "admin": { "email": "admin@example.com", "name": "Admin" }
}
```

### Step 4: Check localStorage
- Open **Console** tab
- Type: `localStorage.getItem('admin_access_token')`
- Should return the token (not null)

### Step 5: Check Newsletter Request
- After login, the dashboard should load
- Look for `/api/newsletters` request
- Click on it and check **Headers** tab
- You should see:
```
Authorization: Bearer demo-token-1234567890
```

### Step 6: Check Newsletter Response
- Go to **Response** tab
- Should see:
```json
{
  "success": true,
  "newsletters": [...],
  "total": 0,
  "message": "Found 0 newsletters"
}
```

## 2. TEST WITH CURL (Command Line)

### Step 1: Login
```bash
curl -X POST https://main.author-fatima-76r-eis.pages.dev/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@authorfatima.com","password":"Admin@12345"}'
```

Expected response:
```json
{
  "success": true,
  "accessToken": "demo-token-...",
  "refreshToken": "refresh-token-..."
}
```

### Step 2: Get Newsletters (with token)
```bash
curl -X GET https://main.author-fatima-76r-eis.pages.dev/api/newsletters \
  -H "Authorization: Bearer demo-token-..." \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "success": true,
  "newsletters": [],
  "total": 0
}
```

### Step 3: Get Newsletters (without token)
```bash
curl -X GET https://main.author-fatima-76r-eis.pages.dev/api/newsletters \
  -H "Content-Type: application/json"
```

Expected response (401):
```json
{
  "error": "Unauthorized - missing token"
}
```

## 3. COMMON ERRORS & FIXES

### Error: "Unauthorized" (500)
**Problem**: Backend returning 500 instead of 401
**Fix**: Already applied in functions/api/newsletters.ts
**Check**: Redeploy to Cloudflare

### Error: "Failed to get newsletters"
**Problem**: Token not being sent
**Check**:
1. Is token in localStorage? `localStorage.getItem('admin_access_token')`
2. Is Authorization header in Network tab?
3. Is token format correct? Should be `Bearer <token>`

### Error: "Backend unavailable" (503)
**Problem**: Cloudflare can't reach backend
**Check**:
1. Is BACKEND_URL set in wrangler.toml?
2. Is backend server running?
3. Check Cloudflare Pages logs

### Error: "Invalid token"
**Problem**: Token format is wrong
**Check**:
1. Token should be a string, not an object
2. Token should not include "Bearer" prefix (that's added by frontend)
3. Token should be stored in localStorage, not sessionStorage

## 4. CLOUDFLARE DASHBOARD CHECKS

### Check Environment Variables
1. Go to Cloudflare Dashboard
2. Select your Pages project
3. Go to **Settings** → **Environment variables**
4. Check **Production** environment
5. Verify these are set:
   - `TURSO_CONNECTION_URL`
   - `TURSO_AUTH_TOKEN`
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `JWT_SECRET` (optional, for production)

### Check Logs
1. Go to **Deployments**
2. Click on latest deployment
3. Go to **Logs** tab
4. Look for errors related to:
   - Database connection
   - Token validation
   - Newsletter queries

## 5. DATABASE CHECKS

### Check if newsletters table exists
```bash
# Using Turso CLI
turso db shell authorfsk

# Then run:
.tables
SELECT * FROM newsletters;
```

### Check if table has data
```sql
SELECT COUNT(*) as total FROM newsletters;
SELECT * FROM newsletters LIMIT 5;
```

## 6. FRONTEND CHECKS

### Check if token is being sent
In `src/utils/api.ts`, the `request()` method should:
1. Get token from localStorage
2. Add `Authorization: Bearer <token>` header
3. Send request with headers

### Check if error handling works
In `src/app/components/admin/NewsletterManager.tsx`:
1. `loadNewsletters()` should catch errors
2. Should display error message if fetch fails
3. Should show loading state while fetching

## 7. STEP-BY-STEP TESTING

### Test 1: Login Flow
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Should show login form
4. Enter credentials
5. Should redirect to dashboard
6. Check localStorage has token

### Test 2: Newsletter Loading
1. After login, dashboard should load
2. Should show "Loading..." initially
3. Should show newsletters list or "No newsletters"
4. Check Network tab for `/api/newsletters` request
5. Check response status is 200

### Test 3: Error Handling
1. Clear localStorage: `localStorage.clear()`
2. Try to access `/api/newsletters` directly
3. Should get 401 error
4. Frontend should redirect to login

### Test 4: Token Refresh
1. Login
2. Wait 15 minutes (token expires)
3. Try to load newsletters
4. Should automatically refresh token
5. Should continue working

## 8. PRODUCTION DEPLOYMENT CHECKLIST

- [ ] Redeploy to Cloudflare Pages
- [ ] Check environment variables in Cloudflare Dashboard
- [ ] Test login with real credentials
- [ ] Test newsletter loading
- [ ] Check Cloudflare logs for errors
- [ ] Test with curl from command line
- [ ] Test with Postman
- [ ] Clear browser cache and test again
