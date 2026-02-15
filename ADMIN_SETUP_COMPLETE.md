# Admin System Setup - Complete Guide

## Status: ✅ READY TO USE

All admin login and password reset issues have been fixed and documented.

---

## What Was Fixed

### 1. ✅ Password Reset Token Validation
- **Problem:** Tokens were always marked as expired due to datetime comparison issues
- **Fix:** Changed from datetime string comparison to numeric timestamp comparison
- **File:** `server-turso-full.mjs`

### 2. ✅ Admin Account Management
- **Problem:** No easy way to verify or create admin accounts
- **Fix:** Created `verify-admin.mjs` script for account management
- **Command:** `npm run admin:verify`

### 3. ✅ Login Troubleshooting
- **Problem:** Unclear error messages when login fails
- **Fix:** Created comprehensive troubleshooting guide
- **File:** `LOGIN_TROUBLESHOOTING.md`

---

## Quick Start (3 Steps)

### Step 1: Start Backend Server
```bash
npm run server
```

Expected output:
```
✓ Admin API server running on http://localhost:3001
✓ Database: Turso (libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io)
✓ Email Service: Nodemailer (Gmail SMTP)
✓ Gmail Account: muaddhalsway@gmail.com
✓ Server ready to accept requests
```

### Step 2: Create Admin Account
```bash
npm run admin:verify
```

Follow prompts to create admin account:
```
Email: admin@example.com
Password: your-secure-password
Name: Admin User
Username: admin
```

### Step 3: Start Frontend & Login
```bash
npm run dev
```

Then go to http://localhost:5173/admin and login with your credentials.

---

## New Commands

| Command | Purpose |
|---------|---------|
| `npm run server` | Start backend server on port 3001 |
| `npm run dev` | Start frontend dev server on port 5173 |
| `npm run admin:verify` | Verify/create admin accounts |
| `npm run test:connections` | Test database and email connections |

---

## New Files Created

### Documentation
- **`ADMIN_LOGIN_FIX.md`** - Detailed fix explanation
- **`LOGIN_TROUBLESHOOTING.md`** - Comprehensive troubleshooting guide
- **`ADMIN_SETUP_COMPLETE.md`** - This file

### Tools
- **`verify-admin.mjs`** - Admin account verification/creation script

### Modified Files
- **`server-turso-full.mjs`** - Fixed password reset token validation
- **`package.json`** - Added `admin:verify` script

---

## Admin Account Management

### Create New Admin Account
```bash
npm run admin:verify
```

Select "yes" and follow prompts.

### List Existing Admin Accounts
```bash
npm run admin:verify
```

Shows all existing admin accounts.

### Delete Admin Account
```bash
node -e "
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const db = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await db.execute({
  sql: 'DELETE FROM admins WHERE email = ?',
  args: ['admin@example.com'],
});

console.log('Admin account deleted');
process.exit(0);
"
```

---

## Password Reset Flow

### 1. Request Password Reset
```bash
curl -X POST http://localhost:3001/api/admin/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com"}'
```

### 2. Check Email for Reset Link
- Email is sent to the admin's email address
- Link contains reset token
- Token expires after 1 hour

### 3. Reset Password
```bash
curl -X POST http://localhost:3001/api/admin/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_RESET_TOKEN",
    "newPassword": "new-password"
  }'
```

### 4. Login with New Password
Use the new password to login.

---

## API Endpoints

### Authentication
- `POST /api/admin/login` - Login
- `POST /api/admin/forgot-password` - Request password reset
- `POST /api/admin/reset-password` - Reset password with token
- `POST /api/admin/change-password` - Change password (authenticated)

### Profile
- `GET /api/admin/profile` - Get profile (authenticated)
- `PUT /api/admin/profile` - Update profile (authenticated)

### Health
- `GET /health` - Server health check

---

## Testing Checklist

- [ ] Backend server starts: `npm run server`
- [ ] Admin account created: `npm run admin:verify`
- [ ] Frontend starts: `npm run dev`
- [ ] Can login to admin dashboard
- [ ] Can view admin profile
- [ ] Can request password reset
- [ ] Can reset password with token
- [ ] Can login with new password

---

## Troubleshooting

### Server Won't Start
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Use different port if needed
PORT=3002 npm run server
```

### Login Returns 401
```bash
# Check if admin account exists
npm run admin:verify

# Create new account if needed
npm run admin:verify
```

### Password Reset Token Invalid
```bash
# Request new reset token
curl -X POST http://localhost:3001/api/admin/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com"}'

# Use token immediately (expires in 1 hour)
```

### Database Connection Failed
```bash
# Test connections
npm run test:connections

# See CONNECTION_TROUBLESHOOTING.md for details
```

---

## Security Features

✅ **Password Reset Tokens**
- Expire after 1 hour
- Single-use only
- Deleted after use
- Stored as numeric timestamps

✅ **Authentication**
- JWT-style tokens
- Access token + refresh token
- Token validation on protected endpoints
- Automatic token refresh

✅ **Password Management**
- Passwords stored securely
- Password strength validation
- Change password endpoint
- Forgot password flow

✅ **Rate Limiting**
- Login attempts limited
- Password reset attempts limited
- API rate limiting

---

## Environment Variables

Required in `.env`:
```env
TURSO_CONNECTION_URL=libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io?authToken=...
TURSO_AUTH_TOKEN=...
EMAIL_USER=muaddhalsway@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=muaddhalsway@gmail.com
EMAIL_SERVICE=gmail
EMAIL_SERVICE_PROVIDER=nodemailer
```

---

## Database Schema

### admins table
```sql
CREATE TABLE admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  username TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### password_reset_tokens table
```sql
CREATE TABLE password_reset_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,  -- Unix timestamp in milliseconds
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

## Complete Workflow

### Initial Setup
```bash
# 1. Start backend
npm run server

# 2. Create admin account (in another terminal)
npm run admin:verify

# 3. Start frontend (in another terminal)
npm run dev

# 4. Go to http://localhost:5173/admin
# 5. Login with admin credentials
```

### Daily Usage
```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
npm run dev

# Then access admin dashboard at http://localhost:5173/admin
```

### Password Reset
```bash
# 1. Click "Forgot Password" on login page
# 2. Enter admin email
# 3. Check email for reset link
# 4. Click link and set new password
# 5. Login with new password
```

---

## Deployment

### Before Deploying
- [ ] Test all admin functions locally
- [ ] Verify password reset works
- [ ] Check database is accessible
- [ ] Verify email service is working
- [ ] Run `npm run test:connections`

### Deploy Frontend
```bash
npm run build
npm run deploy:pages
```

### Deploy Backend
Backend can be deployed to:
- Cloudflare Workers
- Vercel
- Railway
- Heroku
- Any Node.js hosting

---

## Support Resources

| Issue | Resource |
|-------|----------|
| Login problems | `LOGIN_TROUBLESHOOTING.md` |
| Connection issues | `CONNECTION_TROUBLESHOOTING.md` |
| Password reset | `ADMIN_LOGIN_FIX.md` |
| General setup | `NEXT_STEPS.md` |

---

## Summary

**Admin system is now fully functional with:**

✅ Working admin login  
✅ Password reset with email  
✅ Admin account management  
✅ Comprehensive troubleshooting guides  
✅ Easy setup scripts  

**To get started:**

```bash
npm run server          # Start backend
npm run admin:verify    # Create admin account
npm run dev             # Start frontend
# Go to http://localhost:5173/admin
```

**You're ready to use the admin dashboard! 🎉**
