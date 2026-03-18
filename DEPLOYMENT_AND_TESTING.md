# Deployment and Testing Guide

## Quick Start (5 minutes)

### 1. Add Environment Variables to Cloudflare
1. Go to https://dash.cloudflare.com
2. **Workers & Pages** → **author-fatima-76r** → **Settings**
3. Add these 6 secrets:
   - `TURSO_CONNECTION_URL` (from Turso dashboard)
   - `TURSO_AUTH_TOKEN` (from Turso dashboard)
   - `GMAIL_USER` = `AuthorFSK@gmail.com`
   - `GMAIL_APP_PASSWORD` = `peed qvhs ekmo kisv`
   - `BACKEND_URL` = `https://writer-website-landing-page-1.vercel.app`
   - `FRONTEND_URL` = `https://main.author-fatima-76r-eis.pages.dev`

### 2. Build and Deploy
```bash
npm run build
wrangler pages deploy dist
```

### 3. Wait for Deployment
- Cloudflare Pages: 2-3 minutes
- Check status at: https://dash.cloudflare.com → Deployments

---

## Testing Checklist

### Test 1: Database Connection
```bash
# In browser console:
fetch('https://main.author-fatima-76r-eis.pages.dev/api/newsletters', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer test-token' }
})
.then(r => r.json())
.then(d => console.log('Status:', r.status, 'Data:', d))
```

**Expected Results:**
- ✅ Status 200: `{ success: true, newsletters: [...] }`
- ❌ Status 503: Database not configured (check env vars)
- ❌ Status 401: Missing token (add Authorization header)

### Test 2: Email Service
```bash
# In browser console:
fetch('https://main.author-fatima-76r-eis.pages.dev/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipients: ['your-email@example.com'],
    subject: 'Test Email',
    content: 'This is a test email from Cloudflare Pages'
  })
})
.then(r => r.json())
.then(d => console.log('Status:', r.status, 'Data:', d))
```

**Expected Results:**
- ✅ Status 200: `{ success: true, sent: 1, failed: 0 }`
- ❌ Status 503: Email service not configured (check env vars)
- ❌ Status 500: Email sending failed (check Gmail app password)

### Test 3: Admin Dashboard
1. Go to https://main.author-fatima-76r-eis.pages.dev
2. Click "Admin Login"
3. Enter credentials:
   - Email: `admin@authorfatima.com`
   - Password: `Admin@12345`
4. Check dashboard:
   - ✅ Stats cards show subscriber count
   - ✅ Newsletter list loads
   - ✅ Can send test newsletter

---

## Troubleshooting

### Problem: 503 - Database not configured

**Cause**: Environment variables not set in Cloudflare

**Solution**:
1. Go to Cloudflare Dashboard
2. **Settings** → **Environment variables**
3. Verify `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` are set
4. Click **Redeploy** on latest deployment
5. Wait 2-3 minutes

### Problem: 503 - Email service not configured

**Cause**: Gmail credentials not set in Cloudflare

**Solution**:
1. Go to Cloudflare Dashboard
2. **Settings** → **Environment variables**
3. Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set
4. Check Gmail app password is correct (16 chars with spaces)
5. Click **Redeploy** on latest deployment
6. Wait 2-3 minutes

### Problem: 500 - Database connection failed

**Cause**: Turso database is down or credentials are wrong

**Solution**:
1. Go to https://turso.tech
2. Check if database is running
3. Verify connection URL is correct
4. Try connecting in Turso shell
5. Update credentials in Cloudflare if needed

### Problem: 500 - Email sending failed

**Cause**: Gmail app password is wrong or Gmail is blocking

**Solution**:
1. Go to https://myaccount.google.com
2. Check 2-Step Verification is enabled
3. Generate new app password
4. Update `GMAIL_APP_PASSWORD` in Cloudflare
5. Check Gmail security alerts
6. Redeploy

### Problem: Admin dashboard shows "Connection Error"

**Cause**: API endpoints are not responding

**Solution**:
1. Check browser console for error messages
2. Verify all environment variables are set
3. Check Cloudflare deployment status
4. Try hard refresh: `Ctrl+Shift+R`
5. Check if Turso database is running

---

## API Response Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | Success | ✅ Everything working |
| 400 | Bad request | Check required fields |
| 401 | Unauthorized | Add Authorization header |
| 500 | Server error | Check logs, verify credentials |
| 503 | Service unavailable | Check environment variables |

---

## Monitoring

### Check Deployment Status
1. Go to https://dash.cloudflare.com
2. **Workers & Pages** → **author-fatima-76r**
3. Click **Deployments** tab
4. View latest deployment status

### Check Logs
1. Click on a deployment
2. Scroll down to see build logs
3. Look for errors or warnings

### Test Endpoints
Use the test commands above to verify each service is working.

---

## Performance Tips

1. **Cache newsletters**: Results are cached in memory
2. **Batch emails**: Send to multiple recipients in one request
3. **Monitor Turso**: Check database performance in Turso dashboard
4. **Monitor Gmail**: Check Gmail API quotas

---

## Security Notes

- ✅ All secrets are encrypted in Cloudflare
- ✅ API requires Authorization header
- ✅ Email passwords are never logged
- ✅ Database credentials are never exposed
- ⚠️ Don't commit `.env` files to git
- ⚠️ Don't share Cloudflare secrets

---

## Next Steps

1. ✅ Add environment variables
2. ✅ Deploy to Cloudflare
3. ✅ Test all endpoints
4. ✅ Test admin dashboard
5. ✅ Send test newsletter
6. ✅ Monitor for errors
7. ✅ Go live!

Your app is now ready for production!
