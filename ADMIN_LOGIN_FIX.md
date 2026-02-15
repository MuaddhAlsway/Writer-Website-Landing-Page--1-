# Admin Login & Password Reset Issues - Fix Guide

## Issues Identified

1. **404 on /api/admin/login** - Server not running or endpoint not accessible
2. **401 Unauthorized** - No admin account exists or credentials are wrong
3. **400 on /api/admin/reset-password** - Token validation failing due to datetime comparison

---

## Root Causes

### Issue 1: Server Not Running
The backend server on port 3001 is not running, so all API requests fail with 404.

**Solution:** Start the server with `npm run server`

### Issue 2: No Admin Account
The admin login endpoint exists, but there's no admin account in the database.

**Solution:** Create an admin account using the provided script

### Issue 3: Password Reset Token Validation
The datetime comparison in SQLite was using `datetime("now")` which doesn't work reliably with ISO strings.

**Solution:** Changed to numeric timestamp comparison (Unix milliseconds)

---

## Step-by-Step Fix

### Step 1: Ensure Server is Running

```bash
# Terminal 1: Start the backend server
npm run server
```

**Expected Output:**
```
✓ Admin API server running on http://localhost:3001
✓ Database: Turso (libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io)
✓ Email Service: Nodemailer (Gmail SMTP)
✓ Gmail Account: muaddhalsway@gmail.com
✓ Server ready to accept requests
```

### Step 2: Create Admin Account

```bash
# Terminal 2: Create admin account
node create-admin.mjs
```

**Follow the prompts:**
```
Enter admin email: admin@example.com
Enter admin password: your-secure-password
Enter admin name: Admin User
Enter admin username: admin
```

**Expected Output:**
```
✓ Admin account created successfully
Email: admin@example.com
Username: admin
```

### Step 3: Test Admin Login

```bash
# Terminal 2: Test login
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-secure-password"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "expiresIn": 900,
  "admin": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "username": "admin"
  }
}
```

### Step 4: Test Password Reset

```bash
# Request password reset
curl -X POST http://localhost:3001/api/admin/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com"}'

# Check server logs for the reset token
# Look for: [RESET] Password reset email sent to admin@example.com
```

**Then use the token from the email to reset:**
```bash
curl -X POST http://localhost:3001/api/admin/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_RESET_TOKEN_HERE",
    "newPassword": "new-secure-password"
  }'
```

---

## What Was Fixed

### Password Reset Token Validation

**Before:**
```javascript
// This didn't work reliably with ISO strings
const result = await db.execute({
  sql: 'SELECT email FROM password_reset_tokens WHERE token = ? AND expires_at > datetime("now")',
  args: [token],
});
```

**After:**
```javascript
// Now uses numeric timestamp comparison
const result = await db.execute({
  sql: 'SELECT email, expires_at FROM password_reset_tokens WHERE token = ? AND CAST(expires_at AS INTEGER) > ?',
  args: [token, Date.now().toString()],
});
```

**Why:** SQLite's `datetime("now")` returns a string in a specific format, but we were storing ISO strings. The comparison was always failing. Now we store Unix timestamps (milliseconds) and compare numerically.

---

## Troubleshooting

### Server Won't Start

```bash
# Check if port 3001 is already in use
netstat -ano | findstr :3001

# If in use, kill the process or use a different port
# PORT=3002 npm run server
```

### Admin Account Creation Fails

```bash
# Check if database is connected
npm run test:connections

# If Turso fails, see CONNECTION_TROUBLESHOOTING.md
```

### Login Still Returns 401

```bash
# Verify admin account exists
node -e "
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const db = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const result = await db.execute('SELECT * FROM admins');
console.log('Admins:', result.rows);
process.exit(0);
"
```

### Password Reset Token Still Invalid

```bash
# Check token in database
node -e "
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const db = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const result = await db.execute('SELECT * FROM password_reset_tokens');
console.log('Tokens:', result.rows);
console.log('Current time:', Date.now());
process.exit(0);
"
```

---

## Complete Workflow

### 1. Start Backend
```bash
npm run server
```

### 2. Start Frontend (in another terminal)
```bash
npm run dev
```

### 3. Create Admin Account
```bash
node create-admin.mjs
```

### 4. Login to Admin Dashboard
- Go to http://localhost:5173/admin
- Enter admin email and password
- Click Login

### 5. Test Password Reset
- Click "Forgot Password"
- Enter admin email
- Check email for reset link
- Click link and set new password

---

## API Endpoints Reference

### Admin Authentication
- `POST /api/admin/login` - Login with email/password
- `POST /api/admin/forgot-password` - Request password reset
- `POST /api/admin/reset-password` - Reset password with token
- `POST /api/admin/change-password` - Change password (authenticated)

### Admin Profile
- `GET /api/admin/profile` - Get profile (authenticated)
- `PUT /api/admin/profile` - Update profile (authenticated)

### Health Check
- `GET /health` - Server health check

---

## Environment Variables

Make sure `.env` has:
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

## Files Modified

1. **server-turso-full.mjs**
   - Fixed password reset token validation
   - Changed from datetime string comparison to numeric timestamp comparison
   - Improved error logging

---

## Testing Checklist

- [ ] Server starts without errors
- [ ] `npm run test:connections` passes
- [ ] Admin account created successfully
- [ ] Admin login returns access token
- [ ] Admin profile endpoint works
- [ ] Password reset email sends
- [ ] Password reset token validates
- [ ] New password works after reset

---

## Security Notes

✅ Tokens stored as numeric timestamps (Unix milliseconds)  
✅ Tokens expire after 1 hour  
✅ Used tokens are deleted from database  
✅ Password reset requires valid email  
✅ Passwords are validated for strength  

---

## Next Steps

1. Start the server: `npm run server`
2. Create admin account: `node create-admin.mjs`
3. Test login in the admin dashboard
4. Test password reset flow
5. Deploy when ready

---

## Support

If you encounter issues:

1. Check server logs for error messages
2. Run `npm run test:connections` to verify database/email
3. See `CONNECTION_TROUBLESHOOTING.md` for connection issues
4. Check that admin account exists in database
5. Verify token hasn't expired (1 hour limit)
