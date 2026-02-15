# Admin Login Troubleshooting Guide

## Quick Diagnosis

Run this command to check everything:

```bash
npm run test:connections
```

Then verify admin account exists:

```bash
npm run admin:verify
```

---

## Common Issues & Solutions

### Issue 1: 404 Not Found on /api/admin/login

**Error Message:**
```
Failed to load resource: the server responded with a status of 404 (Not Found)
http://localhost:3001/api/admin/login
```

**Causes:**
- Backend server is not running
- Server is running on a different port
- Firewall blocking port 3001

**Solutions:**

1. **Check if server is running:**
   ```bash
   # Terminal 1: Start the server
   npm run server
   ```

   Expected output:
   ```
   ✓ Admin API server running on http://localhost:3001
   ✓ Server ready to accept requests
   ```

2. **Check if port 3001 is in use:**
   ```bash
   netstat -ano | findstr :3001
   ```

   If something is using it, either:
   - Kill the process: `taskkill /PID <PID> /F`
   - Use a different port: `PORT=3002 npm run server`

3. **Test the server is responding:**
   ```bash
   curl http://localhost:3001/health
   ```

   Should return: `{"status":"ok"}`

---

### Issue 2: 401 Unauthorized on /api/admin/login

**Error Message:**
```
Failed to load resource: the server responded with a status of 401 (Unauthorized)
Error: Invalid email or password
```

**Causes:**
- No admin account exists in database
- Wrong email or password
- Admin account was deleted

**Solutions:**

1. **Check if admin account exists:**
   ```bash
   npm run admin:verify
   ```

   If no accounts found, create one:
   ```bash
   npm run admin:verify
   # Select "yes" to create new account
   ```

2. **Verify credentials:**
   - Email must match exactly (case-sensitive)
   - Password must match exactly
   - Check for extra spaces

3. **Create admin account if needed:**
   ```bash
   npm run admin:verify
   ```

   Follow the prompts to create a new admin account.

4. **Test login with curl:**
   ```bash
   curl -X POST http://localhost:3001/api/admin/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@example.com",
       "password": "your-password"
     }'
   ```

   Should return:
   ```json
   {
     "success": true,
     "accessToken": "...",
     "refreshToken": "...",
     "admin": {...}
   }
   ```

---

### Issue 3: 400 Bad Request on /api/admin/reset-password

**Error Message:**
```
Failed to load resource: the server responded with a status of 400 (Bad Request)
Error: Invalid or expired reset token
```

**Causes:**
- Token has expired (1 hour limit)
- Token is invalid or malformed
- Token was already used
- Token doesn't exist in database

**Solutions:**

1. **Request a new password reset:**
   ```bash
   curl -X POST http://localhost:3001/api/admin/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@example.com"}'
   ```

2. **Check server logs for the token:**
   Look for: `[RESET] Password reset email sent to admin@example.com`

3. **Use the token immediately:**
   - Tokens expire after 1 hour
   - Use the token from the email right away

4. **Verify token format:**
   - Token should be a 64-character hex string
   - Example: `a1b2c3d4e5f6...` (64 chars)

5. **Check if token exists in database:**
   ```bash
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

## Complete Login Workflow

### Step 1: Start Backend Server
```bash
# Terminal 1
npm run server
```

Wait for:
```
✓ Admin API server running on http://localhost:3001
✓ Server ready to accept requests
```

### Step 2: Verify/Create Admin Account
```bash
# Terminal 2
npm run admin:verify
```

Follow prompts to create admin account if needed.

### Step 3: Start Frontend
```bash
# Terminal 3
npm run dev
```

Wait for:
```
VITE v6.3.5  ready in 123 ms

➜  Local:   http://localhost:5173/
```

### Step 4: Login to Admin Dashboard
1. Go to http://localhost:5173/admin
2. Enter admin email
3. Enter admin password
4. Click "Login"

### Step 5: Verify Login Success
- Should see admin dashboard
- Should see subscriber list
- Should see newsletter management

---

## Testing Password Reset

### Step 1: Request Password Reset
1. Go to http://localhost:5173/admin
2. Click "Forgot Password"
3. Enter admin email
4. Click "Send Reset Link"

### Step 2: Check Email
- Check server logs for reset token
- Look for: `[RESET] Password reset email sent to...`

### Step 3: Use Reset Link
1. Copy the reset token from logs
2. Go to http://localhost:5173/reset-password?token=YOUR_TOKEN
3. Enter new password
4. Click "Reset Password"

### Step 4: Login with New Password
1. Go to http://localhost:5173/admin
2. Enter email
3. Enter new password
4. Click "Login"

---

## Database Verification

### Check Admin Accounts
```bash
node -e "
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const db = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const result = await db.execute('SELECT id, email, username, name FROM admins');
console.log('Admin Accounts:');
result.rows.forEach(admin => {
  console.log(\`  - \${admin.email} (\${admin.username})\`);
});
process.exit(0);
"
```

### Check Password Reset Tokens
```bash
node -e "
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const db = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const result = await db.execute('SELECT email, token, expires_at FROM password_reset_tokens');
console.log('Reset Tokens:');
result.rows.forEach(token => {
  const expiresAt = new Date(parseInt(token.expires_at)).toISOString();
  console.log(\`  - \${token.email}: expires at \${expiresAt}\`);
});
console.log('Current time:', new Date().toISOString());
process.exit(0);
"
```

---

## API Endpoint Testing

### Test Health Check
```bash
curl http://localhost:3001/health
```

Expected: `{"status":"ok"}`

### Test Admin Login
```bash
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'
```

Expected: Access token and admin info

### Test Admin Profile
```bash
curl http://localhost:3001/api/admin/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Expected: Admin profile data

### Test Forgot Password
```bash
curl -X POST http://localhost:3001/api/admin/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com"}'
```

Expected: Success message

### Test Reset Password
```bash
curl -X POST http://localhost:3001/api/admin/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_RESET_TOKEN",
    "newPassword": "new-password"
  }'
```

Expected: Success message

---

## Environment Variables Checklist

Make sure `.env` has:
```env
✓ TURSO_CONNECTION_URL=libsql://...
✓ TURSO_AUTH_TOKEN=eyJ...
✓ EMAIL_USER=muaddhalsway@gmail.com
✓ EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
✓ EMAIL_FROM=muaddhalsway@gmail.com
✓ EMAIL_SERVICE=gmail
✓ EMAIL_SERVICE_PROVIDER=nodemailer
```

---

## Port Configuration

### Default Port
- Backend: 3001
- Frontend: 5173

### Change Backend Port
```bash
PORT=3002 npm run server
```

Then update frontend API base in `src/utils/api.ts`:
```typescript
const getApiBase = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3002'; // Changed port
  }
  return '';
};
```

---

## Debugging Tips

### Enable Verbose Logging
Add to server startup:
```bash
DEBUG=* npm run server
```

### Check Network Requests
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Check request/response details

### Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Check API response details

### Check Server Logs
Look for these patterns:
- `[DB]` - Database operations
- `[RESET]` - Password reset operations
- `[VERIFY]` - Email verification
- `[ERROR]` - Error messages

---

## Quick Reference

| Issue | Command | Expected |
|-------|---------|----------|
| Server not running | `npm run server` | ✓ Server ready |
| No admin account | `npm run admin:verify` | ✓ Account created |
| Test connection | `npm run test:connections` | ✓ Both pass |
| Check admins | `npm run admin:verify` | ✓ List shown |
| Test health | `curl http://localhost:3001/health` | `{"status":"ok"}` |

---

## Support Resources

- **Connection Issues:** See CONNECTION_TROUBLESHOOTING.md
- **Server Issues:** Check server console output
- **Database Issues:** Run `npm run test:connections`
- **Email Issues:** Check Gmail app password
- **Token Issues:** Check token expiration (1 hour limit)

---

## Summary

**To get login working:**

1. Start server: `npm run server`
2. Create admin: `npm run admin:verify`
3. Start frontend: `npm run dev`
4. Go to http://localhost:5173/admin
5. Login with admin credentials

**If login fails:**

1. Check server is running: `curl http://localhost:3001/health`
2. Check admin exists: `npm run admin:verify`
3. Check credentials are correct
4. Check server logs for errors
5. See troubleshooting section above
