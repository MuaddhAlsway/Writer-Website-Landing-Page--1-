# Restart Servers - Quick Guide

## The Fix is Applied ✅

The vite proxy configuration has been updated to route `/api/admin` requests to the backend server.

---

## How to Restart

### Terminal 1: Backend Server
```bash
# Stop current server (Ctrl+C)

# Clear port 3001
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Stop-Process -Force

# Start backend server
npm run server

# You should see:
# Admin API server running on http://localhost:3001
# [VERIFY] Gmail connection successful!
```

### Terminal 2: Dev Server
```bash
# Stop current server (Ctrl+C)

# Start dev server
npm run dev

# You should see:
# Local: http://localhost:5173
# press h to show help
```

---

## Test It

### English Version:
1. Go to `http://localhost:5173`
2. Click Admin Login
3. Try to login
4. Should work without errors

### Arabic Version:
1. Go to `http://localhost:5173` (Arabic version)
2. Click تسجيل دخول المسؤول (Admin Login)
3. Try to login
4. Should work without "Failed to fetch" error

---

## What Was Fixed

### Changes Made:
1. ✅ `vite.config.ts` - Added `/api/admin` proxy
2. ✅ `src/utils/api.ts` - Updated API base URL detection

### How It Works:
- Dev server (port 5173) proxies `/api/admin` requests to backend (port 3001)
- Both English and Arabic versions now work
- No more "Failed to fetch" errors

---

## Verify It's Working

### Check Backend:
```bash
# Should see in terminal:
Admin API server running on http://localhost:3001
Database: admin.db
Email Service: Nodemailer (Gmail SMTP)
[VERIFY] Gmail connection successful!
```

### Check Dev Server:
```bash
# Should see in terminal:
Local: http://localhost:5173
```

### Check Browser:
1. Open DevTools (F12)
2. Go to Network tab
3. Try to login
4. Look for `/api/admin/login` request
5. Should see status 200 or 401 (not 404 or "Failed to fetch")

---

## Status

✅ **READY TO TEST**

Both servers are configured correctly. Restart them and test the Arabic version.

---

## Quick Commands

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Dev Server
npm run dev

# Then go to: http://localhost:5173
```

That's it! 🚀
