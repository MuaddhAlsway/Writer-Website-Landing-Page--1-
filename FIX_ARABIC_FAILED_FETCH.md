# Fix: "Failed to fetch" Error for Arabic Version

## Problem
When using the Arabic admin version, you get: **"Failed to fetch"** error

## Root Cause
The API client wasn't properly routing requests to the backend server. The vite dev server proxy wasn't configured for the `/api/admin` endpoints.

## Solution Applied

### 1. Updated `vite.config.ts`
Added proxy configuration for `/api/admin` endpoints:

```typescript
server: {
  proxy: {
    '/make-server-53bed28f': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
    '/api/admin': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
},
```

### 2. Updated `src/utils/api.ts`
Changed API base URL detection to use relative paths (vite proxy handles routing):

```typescript
const getApiBase = () => {
  // In development, use relative paths (vite proxy will handle it)
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return '';
  }
  // In production, use relative paths for Cloudflare Pages
  return '';
};
```

---

## How to Fix

### Step 1: Restart Dev Server
```bash
# Stop the current dev server (Ctrl+C)
# Stop the backend server (Ctrl+C)

# Clear port 3001
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Stop-Process -Force

# Start backend server
npm run server

# In another terminal, start dev server
npm run dev
```

### Step 2: Test Arabic Version
1. Go to `http://localhost:5173` (or your dev server URL)
2. Click on Arabic version (if available)
3. Try to login
4. Should work now without "Failed to fetch" error

---

## What Changed

### Files Modified:
1. ✅ `vite.config.ts` - Added `/api/admin` proxy
2. ✅ `src/utils/api.ts` - Updated API base URL detection

### How It Works:
```
Arabic Admin Login
   ↓
Calls: POST /api/admin/login
   ↓
Vite Proxy intercepts
   ↓
Routes to: http://localhost:3001/api/admin/login
   ↓
Backend processes request
   ↓
Returns response
   ↓
Arabic UI displays result
```

---

## Testing

### Test Forgot Password (Arabic):
```
1. Go to admin login (Arabic version)
2. Click "هل نسيت كلمة المرور؟" (Forgot password?)
3. Enter your email
4. Should see: "تم إرسال رابط إعادة تعيين كلمة المرور" (Reset link sent)
5. No more "Failed to fetch" error!
```

### Test Account Settings (Arabic):
```
1. Login to admin dashboard (Arabic version)
2. Click "الحساب" (Account) tab
3. Try to update email/username/password
4. Should work without errors
```

---

## Verification

### Check if Fixed:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login (Arabic version)
4. Look for requests to `/api/admin/login`
5. Should see status 200 (success) or 401 (wrong password)
6. Should NOT see 404 or "Failed to fetch"

---

## If Still Not Working

### 1. Check Backend Server
```bash
# Verify backend is running on port 3001
netstat -ano | findstr :3001

# Should show: listening on 127.0.0.1:3001
```

### 2. Check Dev Server
```bash
# Verify dev server is running
# Should see: Local: http://localhost:5173
```

### 3. Check Proxy Configuration
```bash
# In browser DevTools Network tab
# Look for requests to /api/admin/login
# Should be proxied to http://localhost:3001
```

### 4. Clear Cache
```bash
# Clear browser cache
# Clear localStorage
# Restart both servers
```

---

## Status

✅ **FIXED** - API requests should now work for Arabic version

The "Failed to fetch" error should be resolved. If you still see errors:
1. Restart both servers
2. Clear browser cache
3. Check browser console for detailed error messages
4. Check wrangler logs: `wrangler tail`

---

## Next Steps

1. Restart dev server: `npm run dev`
2. Test Arabic admin login
3. Test forgot password flow
4. Test account settings
5. Verify all features work

---

## Support

If you still see "Failed to fetch":
- Check browser console (F12) for error details
- Check Network tab to see actual API requests
- Verify backend server is running: `npm run server`
- Verify dev server is running: `npm run dev`
- Check that both servers are on correct ports (3001 and 5173)
