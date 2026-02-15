# Password Reset Token Debug Guide

## Issue: "Invalid or expired reset token"

The password reset token validation is failing. This guide will help you debug and fix it.

---

## Quick Diagnosis

### Step 1: Run Debug Script
```bash
node debug-reset-token.mjs
```

This will:
- Show all existing tokens in database
- Create a test token
- Test the comparison logic
- Show if tokens are valid or expired

### Step 2: Check Server Logs
When you request a password reset, look for these logs:
```
[RESET] Creating token for admin@example.com
[RESET] Token: a1b2c3d4e5f6...
[RESET] Expires at: 2026-02-08T... (1707...000)
[RESET] Token stored in database
```

When you try to reset, look for:
```
[RESET] Attempting to reset password with token: a1b2c3d4e5f6...
[RESET] Current time: 1707...000
[RESET] Query result rows: 1
[RESET] Token valid for: admin@example.com
```

---

## Common Issues & Solutions

### Issue 1: Token Not Found in Database

**Logs show:**
```
[RESET] Token not found in database
```

**Causes:**
- Token wasn't created properly
- Token was deleted
- Wrong token being used

**Solutions:**

1. **Check if tokens exist:**
   ```bash
   node debug-reset-token.mjs
   ```

2. **Request a new password reset:**
   ```bash
   curl -X POST http://localhost:3001/api/admin/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com"}'
   ```

3. **Check server logs for the token:**
   Look for: `[RESET] Token: ...`

4. **Use the exact token from logs:**
   Copy the full token (not just the first 20 chars)

---

### Issue 2: Token Expired

**Logs show:**
```
[RESET] Token found but expired
[RESET] Expires at: 2026-02-08T10:00:00.000Z (1707...000)
[RESET] Current time: 1707...000
[RESET] Difference: -3600000ms
```

**Causes:**
- Token is older than 1 hour
- System clock is wrong
- Token was created but not used immediately

**Solutions:**

1. **Request a new password reset:**
   ```bash
   curl -X POST http://localhost:3001/api/admin/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com"}'
   ```

2. **Use the token immediately:**
   - Tokens expire after 1 hour
   - Use the token right away

3. **Check system clock:**
   ```bash
   date
   ```
   Make sure your system time is correct

---

### Issue 3: Token Format Mismatch

**Logs show:**
```
[RESET] Query result rows: 0
[RESET] Token found but expired
[RESET] Difference: 0ms
```

**Causes:**
- Token format is different
- Token has extra spaces or characters
- Token is truncated

**Solutions:**

1. **Copy token exactly:**
   - Don't add spaces
   - Don't truncate
   - Copy the full 64-character hex string

2. **Check token format:**
   ```bash
   node -e "
   import { createClient } from '@libsql/client';
   import dotenv from 'dotenv';
   dotenv.config();
   
   const db = createClient({
     url: process.env.TURSO_CONNECTION_URL,
     authToken: process.env.TURSO_AUTH_TOKEN,
   });
   
   const result = await db.execute('SELECT token, LENGTH(token) as len FROM password_reset_tokens LIMIT 1');
   if (result.rows && result.rows.length > 0) {
     console.log('Token:', result.rows[0].token);
     console.log('Length:', result.rows[0].len);
   }
   process.exit(0);
   "
   ```

---

## Complete Password Reset Workflow

### Step 1: Request Password Reset
```bash
# Terminal 1: Start server
npm run server

# Terminal 2: Request reset
curl -X POST http://localhost:3001/api/admin/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com"}'
```

**Check server logs for:**
```
[RESET] Creating token for admin@example.com
[RESET] Token: a1b2c3d4e5f6...
[RESET] Expires at: 2026-02-08T...
[RESET] Token stored in database
```

### Step 2: Copy the Token
From the logs, copy the full token (64 hex characters)

### Step 3: Reset Password
```bash
curl -X POST http://localhost:3001/api/admin/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_FULL_TOKEN_HERE",
    "newPassword": "NewPassword123!@#"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## Database Inspection

### View All Tokens
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
console.log('Tokens:');
result.rows.forEach(row => {
  const expiresAt = parseInt(row.expires_at);
  const expiresDate = new Date(expiresAt).toISOString();
  const isExpired = expiresAt < Date.now();
  console.log(\`  Email: \${row.email}\`);
  console.log(\`  Token: \${row.token.substring(0, 20)}...\`);
  console.log(\`  Expires: \${expiresDate}\`);
  console.log(\`  Status: \${isExpired ? 'EXPIRED' : 'VALID'}\`);
  console.log();
});
process.exit(0);
"
```

### Delete Expired Tokens
```bash
node -e "
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const db = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const now = Date.now();
const result = await db.execute({
  sql: 'DELETE FROM password_reset_tokens WHERE CAST(expires_at AS INTEGER) < ?',
  args: [now.toString()],
});

console.log('Deleted expired tokens');
process.exit(0);
"
```

---

## Testing the Fix

### Test 1: Create and Validate Token
```bash
node debug-reset-token.mjs
```

Expected output:
```
✓ Test token inserted
✓ Token retrieved successfully
  Email: test@example.com
  Expires at: 1707...000
```

### Test 2: Full Password Reset Flow
```bash
# 1. Request reset
curl -X POST http://localhost:3001/api/admin/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com"}'

# 2. Copy token from server logs

# 3. Reset password
curl -X POST http://localhost:3001/api/admin/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_TOKEN","newPassword":"NewPass123!@#"}'

# 4. Login with new password
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"NewPass123!@#"}'
```

---

## Server Logs Reference

### Successful Token Creation
```
[RESET] Creating token for admin@example.com
[RESET] Token: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
[RESET] Expires at: 2026-02-08T11:00:00.000Z (1707399600000)
[RESET] Token stored in database
```

### Successful Token Validation
```
[RESET] Attempting to reset password with token: a1b2c3d4e5f6...
[RESET] Current time: 1707396000000
[RESET] Query result rows: 1
[RESET] Token valid for: admin@example.com
[RESET] Password reset successfully for admin@example.com
```

### Token Expired
```
[RESET] Token found but expired
[RESET] Expires at: 2026-02-08T10:00:00.000Z (1707396000000)
[RESET] Current time: 1707399600000
[RESET] Difference: -3600000ms
```

### Token Not Found
```
[RESET] Token not found in database
```

---

## Troubleshooting Checklist

- [ ] Server is running: `npm run server`
- [ ] Admin account exists: `npm run admin:verify`
- [ ] Token is created: Check server logs for `[RESET] Creating token`
- [ ] Token is valid: Check server logs for `[RESET] Token valid`
- [ ] Token not expired: Check `Difference` is positive
- [ ] Token format correct: 64 hex characters
- [ ] Token copied exactly: No spaces or truncation
- [ ] Password meets requirements: 12+ chars, uppercase, lowercase, number, special char

---

## Quick Commands

| Task | Command |
|------|---------|
| Debug tokens | `node debug-reset-token.mjs` |
| View all tokens | See "Database Inspection" section |
| Delete expired tokens | See "Database Inspection" section |
| Request reset | `curl -X POST http://localhost:3001/api/admin/forgot-password ...` |
| Reset password | `curl -X POST http://localhost:3001/api/admin/reset-password ...` |
| Check server logs | Look for `[RESET]` messages |

---

## Support

If you're still having issues:

1. Run `node debug-reset-token.mjs` to test the logic
2. Check server logs for `[RESET]` messages
3. Verify token format (64 hex characters)
4. Verify token hasn't expired (1 hour limit)
5. See `LOGIN_TROUBLESHOOTING.md` for general login issues
