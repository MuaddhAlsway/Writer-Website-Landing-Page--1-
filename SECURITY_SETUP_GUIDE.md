# Security Setup Guide

## Quick Start

### 1. Generate Secure Secrets

Generate two random 32+ character strings for JWT secrets:

```bash
# On Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# On macOS/Linux
openssl rand -base64 32
```

Save these values - you'll need them in the next step.

### 2. Set Environment Secrets

```bash
# Set JWT_SECRET
wrangler secret put JWT_SECRET
# Paste the first generated secret

# Set JWT_REFRESH_SECRET
wrangler secret put JWT_REFRESH_SECRET
# Paste the second generated secret

# Verify secrets are set
wrangler secret list
```

### 3. Update Database

```bash
# Initialize database with new schema
wrangler d1 execute newsletter-db --file schema.sql
```

### 4. Create Admin Account

You need to create an admin account with a strong password. Use this Node.js script:

```javascript
// create-admin.mjs
import crypto from 'crypto';

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha256';
  
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
  return `pbkdf2$100000$${salt}$${hash}`;
}

async function createAdmin() {
  const email = 'your-email@example.com';
  const password = 'YourSecurePass123!'; // Must meet complexity requirements
  const name = 'Your Name';
  const username = 'your_username';
  
  const hashedPassword = await hashPassword(password);
  
  console.log('INSERT INTO admins (email, password, name, username) VALUES (?, ?, ?, ?)');
  console.log(`Values: '${email}', '${hashedPassword}', '${name}', '${username}'`);
}

createAdmin();
```

Run it:
```bash
node create-admin.mjs
```

Then execute the INSERT statement in your database:
```bash
wrangler d1 execute newsletter-db --command "INSERT INTO admins (email, password, name, username) VALUES ('your-email@example.com', 'pbkdf2$...', 'Your Name', 'your_username')"
```

### 5. Test Login

1. Start your development server:
```bash
npm run dev
```

2. Navigate to the admin login page
3. Enter your email and password
4. You should see a success message

---

## Password Requirements

Your password must contain:
- ✅ At least 12 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ✅ At least one special character (!@#$%^&*()_+-=[]{}';:"\\|,.<>/?))

**Example valid passwords:**
- `SecurePass123!`
- `MyP@ssw0rd2024`
- `Admin#Secure99`

---

## Environment Variables

### Required for Production

Add these to your `wrangler.toml`:

```toml
[env.production]
vars = { ENVIRONMENT = "production" }

[[env.production.d1_databases]]
binding = "DB"
database_name = "newsletter-db"
database_id = "your-database-id"
```

### Secrets (Set via CLI)

```bash
wrangler secret put JWT_SECRET --env production
wrangler secret put JWT_REFRESH_SECRET --env production
```

---

## Deployment Steps

### 1. Build
```bash
npm run build
```

### 2. Set Production Secrets
```bash
wrangler secret put JWT_SECRET --env production
wrangler secret put JWT_REFRESH_SECRET --env production
```

### 3. Deploy
```bash
npm run deploy
```

### 4. Verify
- Check that login works
- Verify security headers are present
- Test token refresh mechanism

---

## Verification Checklist

After setup, verify everything works:

### Security Headers
Open browser DevTools (F12) → Network tab → Click any request → Headers

Look for:
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-Frame-Options: DENY`
- ✅ `Strict-Transport-Security`
- ✅ `Content-Security-Policy`

### Login Flow
1. ✅ Try logging in with wrong password → Should fail
2. ✅ Try 5+ times → Should get rate limited
3. ✅ Wait 15 minutes or restart → Should work again
4. ✅ Login with correct credentials → Should succeed
5. ✅ Check localStorage → Should have `admin_access_token` and `admin_refresh_token`

### Token Refresh
1. ✅ Login successfully
2. ✅ Wait 15 minutes (or manually expire token)
3. ✅ Make an API request → Should automatically refresh token
4. ✅ Check localStorage → Token should be updated

### Password Change
1. ✅ Login
2. ✅ Change password to new strong password
3. ✅ Should be logged out
4. ✅ Login with new password → Should work
5. ✅ Old password → Should fail

---

## Troubleshooting

### "JWT_SECRET is not defined"
- Run: `wrangler secret put JWT_SECRET`
- Verify: `wrangler secret list`

### "Password does not meet requirements"
- Password must be 12+ characters with uppercase, lowercase, number, and special character
- Example: `SecurePass123!`

### "Too many login attempts"
- Rate limiting is working correctly
- Wait 15 minutes before trying again
- Or restart the development server

### "Token refresh failed"
- Check that `JWT_REFRESH_SECRET` is set
- Verify database has `refresh_tokens` table
- Check browser console for errors

### Database errors
- Run: `wrangler d1 execute newsletter-db --file schema.sql`
- Verify database ID in wrangler.toml

---

## Security Best Practices

1. **Never commit secrets** - Use environment variables only
2. **Rotate secrets regularly** - Change JWT secrets every 90 days
3. **Monitor failed logins** - Track rate limit hits
4. **Use strong passwords** - Follow the complexity requirements
5. **Enable HTTPS** - Always use HTTPS in production
6. **Keep dependencies updated** - Run `npm update` regularly
7. **Review logs** - Check for suspicious activity
8. **Backup database** - Regular backups of admin accounts

---

## Support

For issues or questions:
1. Check the SECURITY_IMPLEMENTATION.md file
2. Review error messages in browser console
3. Check wrangler logs: `wrangler tail`
4. Verify all environment variables are set

---

## Next Steps

After setup is complete:

1. ✅ Test all authentication flows
2. ✅ Set up monitoring/logging
3. ✅ Configure backup strategy
4. ✅ Plan for 2FA implementation
5. ✅ Document admin procedures
6. ✅ Train team on security practices
