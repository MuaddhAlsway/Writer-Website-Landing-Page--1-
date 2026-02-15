# Connection Troubleshooting Guide

## Quick Diagnostics

Run this command to test both connections:

```bash
npm run test:connections
```

This will show you exactly what's working and what's not.

---

## Turso Database Connection Issues

### Problem: "Connection refused" or "ECONNREFUSED"

**Causes:**
- Network/firewall blocking the connection
- Turso service is down
- Invalid database URL

**Solutions:**
1. Check your internet connection
2. Verify the URL format: `libsql://[database-name]-[username].aws-[region].turso.io`
3. Test connectivity: `ping authorfsk-authorfsk.aws-ap-northeast-1.turso.io`
4. Check if Turso is accessible from your network (corporate firewall?)

### Problem: "401 Unauthorized" or "Invalid token"

**Causes:**
- Expired or invalid authentication token
- Token not properly formatted
- Token doesn't have read/write permissions

**Solutions:**
1. Generate a new token from Turso dashboard:
   - Go to https://turso.tech/app
   - Select your database
   - Click "Tokens"
   - Create a new token with read/write access
2. Update `.env` with the new token:
   ```
   TURSO_AUTH_TOKEN=your_new_token_here
   ```
3. Verify token format (should start with `eyJ`)

### Problem: "404 Not Found" or "Database not found"

**Causes:**
- Database name in URL is incorrect
- Database was deleted
- Using wrong region

**Solutions:**
1. Check your database name in Turso dashboard
2. Verify the region matches (e.g., `aws-ap-northeast-1`)
3. Recreate the database if needed

### Problem: "Connection timeout"

**Causes:**
- Network latency
- Firewall blocking port 443
- DNS resolution issues

**Solutions:**
1. Check your network connection
2. Try connecting from a different network
3. Check if your firewall allows HTTPS (port 443)
4. Verify DNS: `nslookup authorfsk-authorfsk.aws-ap-northeast-1.turso.io`

---

## Gmail SMTP Connection Issues

### Problem: "Invalid login" or "Authentication failed"

**Causes:**
- Wrong email address or password
- Using regular password instead of app password
- 2FA not enabled
- Account locked

**Solutions:**
1. **Enable 2-Factor Authentication:**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification
   
2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Google will generate a 16-character password
   - Copy this password to `.env`:
     ```
     EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
     ```
   - Note: The spaces are part of the password!

3. **Verify credentials:**
   - EMAIL_USER should be your full Gmail address: `your.email@gmail.com`
   - EMAIL_PASSWORD should be the 16-char app password (with spaces)

### Problem: "Connection timeout" or "ECONNREFUSED"

**Causes:**
- Firewall blocking SMTP port 587
- Network issues
- Gmail SMTP server down

**Solutions:**
1. Check firewall settings (port 587 must be open)
2. Try from a different network
3. Check Gmail status: https://www.google.com/appsstatus
4. Verify SMTP settings:
   ```
   Host: smtp.gmail.com
   Port: 587
   Security: TLS
   ```

### Problem: "Account locked" or "Suspicious activity"

**Causes:**
- Too many failed login attempts
- Unusual access location
- Account security alert

**Solutions:**
1. Go to https://myaccount.google.com/security
2. Review recent activity
3. Unlock your account if needed
4. Generate a new app password
5. Wait 24 hours before retrying

### Problem: "Less secure apps" error

**Causes:**
- Using regular password with 2FA enabled
- Old Gmail security settings

**Solutions:**
1. Use app password instead (see above)
2. Don't use regular password with 2FA

---

## Environment Variables Checklist

Make sure your `.env` file has all required variables:

```env
# Turso Database
TURSO_CONNECTION_URL=libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io?authToken=YOUR_TOKEN
TURSO_AUTH_TOKEN=YOUR_TOKEN

# Gmail Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=your.email@gmail.com
EMAIL_SERVICE_PROVIDER=nodemailer
```

**Important:**
- Don't commit `.env` to git
- Keep tokens and passwords secret
- Use `.env.example` as a template

---

## Testing Connections

### Test Turso Only

```bash
node -e "
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const db = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

db.execute('SELECT 1').then(() => {
  console.log('✓ Turso connection OK');
  process.exit(0);
}).catch(err => {
  console.error('✗ Turso connection failed:', err.message);
  process.exit(1);
});
"
```

### Test Gmail Only

```bash
node -e "
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('✗ Gmail connection failed:', error.message);
    process.exit(1);
  } else {
    console.log('✓ Gmail connection OK');
    process.exit(0);
  }
});
"
```

---

## Starting the Server

Once connections are verified:

```bash
npm run server
```

You should see:
```
✓ Admin API server running on http://localhost:3001
✓ Database: Turso (libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io)
✓ Email Service: Nodemailer (Gmail SMTP)
✓ Gmail Account: your.email@gmail.com
✓ Server ready to accept requests
```

---

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `ECONNREFUSED` | Connection blocked | Check firewall, network |
| `ENOTFOUND` | DNS resolution failed | Check URL spelling |
| `401 Unauthorized` | Invalid credentials | Regenerate token/password |
| `404 Not Found` | Resource doesn't exist | Check database name |
| `ETIMEDOUT` | Connection timeout | Check network, firewall |
| `Invalid login` | Wrong email/password | Use app password for Gmail |
| `Too many attempts` | Rate limited | Wait before retrying |

---

## Getting Help

If you're still having issues:

1. Run `npm run test:connections` and share the output
2. Check the server logs for detailed error messages
3. Verify all environment variables are set correctly
4. Try from a different network to isolate network issues
5. Check Turso and Gmail status pages

---

## Security Notes

- Never commit `.env` to version control
- Rotate tokens and passwords regularly
- Use app passwords for Gmail (not regular passwords)
- Keep authentication tokens secret
- Monitor account activity for suspicious access
