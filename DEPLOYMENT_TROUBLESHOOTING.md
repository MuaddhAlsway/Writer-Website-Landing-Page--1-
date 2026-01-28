# Cloudflare Deployment - Troubleshooting Guide

## Common Issues & Solutions

---

## 🔴 Wrangler Issues

### Issue: "wrangler: command not found"

**Problem:** Wrangler CLI is not installed or not in PATH

**Solution:**
```bash
# Install globally
npm install -g wrangler

# Verify installation
wrangler --version

# If still not found, try:
npm install -g @cloudflare/wrangler
```

---

### Issue: "Not authenticated"

**Problem:** Not logged in to Cloudflare

**Solution:**
```bash
# Login to Cloudflare
wrangler login

# Verify authentication
wrangler whoami

# If login fails, try:
wrangler logout
wrangler login
```

---

## 🔴 Database Issues

### Issue: "Database not found"

**Problem:** D1 database doesn't exist

**Solution:**
```bash
# Create database
wrangler d1 create newsletter-db

# Save the database ID from output
# Update wrangler.toml with the ID

# Verify database exists
wrangler d1 info newsletter-db
```

---

### Issue: "Schema initialization failed"

**Problem:** Database tables not created

**Solution:**
```bash
# Check database exists
wrangler d1 info newsletter-db

# Initialize schema
wrangler d1 execute newsletter-db --file schema.sql

# Verify tables created
wrangler d1 execute newsletter-db --command "SELECT name FROM sqlite_master WHERE type='table';"
```

---

### Issue: "UNIQUE constraint failed"

**Problem:** Trying to insert duplicate email

**Solution:**
```bash
# This is expected behavior - subscriber already exists
# Check existing subscribers:
wrangler d1 execute newsletter-db --command "SELECT * FROM subscribers;"

# To delete a subscriber:
wrangler d1 execute newsletter-db --command "DELETE FROM subscribers WHERE email='test@example.com';"
```

---

## 🔴 Secrets & Environment Variables

### Issue: "Secret not found"

**Problem:** Environment variable not set

**Solution:**
```bash
# List all secrets
wrangler secret list

# Add missing secret
wrangler secret put RESEND_API_KEY
# Paste: re_BsDneXUF_MgwUamRU1qnPHNCnDwGnrZ72

wrangler secret put FROM_EMAIL
# Paste: noreply@news.example.com

# Verify secrets
wrangler secret list
```

---

### Issue: "Invalid API key"

**Problem:** RESEND_API_KEY is incorrect or expired

**Solution:**
```bash
# Get your API key from Resend
# Go to: https://app.resend.com/api-keys

# Update the secret
wrangler secret put RESEND_API_KEY
# Paste the correct key

# Verify by checking logs
wrangler tail
```

---

## 🔴 Build Issues

### Issue: "Build failed"

**Problem:** npm run build returns errors

**Solution:**
```bash
# Clear cache
rm -rf dist node_modules

# Reinstall dependencies
npm install

# Try building again
npm run build

# If still fails, check for TypeScript errors
npm run build -- --verbose
```

---

### Issue: "Module not found"

**Problem:** Missing dependency

**Solution:**
```bash
# Install all dependencies
npm install

# Check package.json for missing packages
npm list

# Install specific package if needed
npm install package-name

# Try building again
npm run build
```

---

## 🔴 Deployment Issues

### Issue: "Deployment failed"

**Problem:** wrangler deploy returns error

**Solution:**
```bash
# Check configuration
cat wrangler.toml

# Verify account_id and database_id are set
# Update if needed

# Check authentication
wrangler whoami

# Try deploying again
wrangler deploy

# If still fails, check logs
wrangler tail
```

---

### Issue: "Account ID not found"

**Problem:** account_id not set in wrangler.toml

**Solution:**
1. Go to https://dash.cloudflare.com
2. Click profile icon → Accounts
3. Copy your Account ID
4. Edit wrangler.toml:
   ```toml
   account_id = "your-account-id-here"
   ```
5. Try deploying again

---

### Issue: "Database ID not found"

**Problem:** database_id not set in wrangler.toml

**Solution:**
```bash
# Get database ID
wrangler d1 info newsletter-db

# Copy the ID from output
# Edit wrangler.toml:
# [[d1_databases]]
# binding = "DB"
# database_id = "your-database-id-here"

# Try deploying again
wrangler deploy
```

---

## 🔴 API Issues

### Issue: "API returns 404"

**Problem:** Endpoint not found

**Solution:**
```bash
# Test health endpoint
curl https://your-project.pages.dev/make-server-53bed28f/health

# If 404, check:
# 1. URL is correct
# 2. Deployment completed
# 3. Workers are running

# Check logs
wrangler tail
```

---

### Issue: "API returns 500"

**Problem:** Server error

**Solution:**
```bash
# Check logs for error details
wrangler tail

# Common causes:
# 1. Database not initialized
#    → wrangler d1 execute newsletter-db --file schema.sql
# 2. Secrets not set
#    → wrangler secret list
# 3. Database binding missing
#    → Check wrangler.toml

# Try again after fixing
```

---

### Issue: "API returns 401 Unauthorized"

**Problem:** Missing or invalid authentication token

**Solution:**
```bash
# This is expected for protected endpoints
# Add Authorization header:
curl -H "Authorization: Bearer test-token" \
  https://your-project.pages.dev/make-server-53bed28f/subscribers

# For admin operations, use valid token
# Check admin dashboard for token
```

---

## 🔴 Email Issues

### Issue: "Email not sending"

**Problem:** Emails not delivered

**Solution:**
```bash
# Check Resend API key
wrangler secret list | grep RESEND_API_KEY

# Verify FROM_EMAIL
wrangler secret list | grep FROM_EMAIL

# Check Resend dashboard
# Go to: https://app.resend.com

# Check email logs
curl https://your-project.pages.dev/make-server-53bed28f/email-logs \
  -H "Authorization: Bearer test-token"

# Common issues:
# 1. Domain not verified (free tier limitation)
#    → Verify domain in Resend
# 2. Email address not verified (free tier)
#    → Add verified email in Resend
# 3. Rate limit exceeded
#    → Wait and try again (500ms delay implemented)
```

---

### Issue: "Only 1 email sent out of 5"

**Problem:** Free tier limitation - only sends to verified email

**Solution:**
```bash
# This is expected on Resend free tier
# To fix:

# Option 1: Verify your domain
# 1. Go to https://app.resend.com/domains
# 2. Add your domain
# 3. Follow DNS setup
# 4. Once verified, all emails will send

# Option 2: Verify email addresses
# 1. Go to https://app.resend.com
# 2. Add verified email addresses
# 3. Send to verified addresses only

# Option 3: Upgrade to paid plan
# 1. Go to https://resend.com/pricing
# 2. Choose paid plan
# 3. Send to any email address
```

---

### Issue: "Email rate limit exceeded"

**Problem:** Too many emails sent too quickly

**Solution:**
```bash
# Rate limiting is implemented (500ms between sends)
# This should prevent rate limit errors

# If still occurring:
# 1. Wait a few minutes
# 2. Try again
# 3. Check Resend dashboard for limits

# To increase rate limit:
# 1. Upgrade Resend plan
# 2. Contact Resend support
```

---

## 🔴 Frontend Issues

### Issue: "Admin dashboard not loading"

**Problem:** Page shows 404 or blank

**Solution:**
```bash
# Check if app is deployed
curl https://your-project.pages.dev

# Check if build was successful
npm run build

# Verify dist folder exists
ls -la dist/

# Check for build errors
npm run build -- --verbose

# Redeploy if needed
wrangler deploy
```

---

### Issue: "API calls failing from frontend"

**Problem:** CORS error or connection refused

**Solution:**
```bash
# Check API base URL in src/utils/api.ts
# Should be empty string for production

# Verify API is responding
curl https://your-project.pages.dev/make-server-53bed28f/health

# Check browser console for errors
# Open DevTools → Console tab

# Check network tab for failed requests
# Open DevTools → Network tab

# If CORS error:
# 1. Check Workers configuration
# 2. Verify headers are set correctly
# 3. Check wrangler.toml
```

---

## 🔴 Performance Issues

### Issue: "App is slow"

**Problem:** Slow response times

**Solution:**
```bash
# Check Cloudflare analytics
# Go to: https://dash.cloudflare.com → Pages

# Check database performance
wrangler d1 info newsletter-db

# Optimize queries:
# 1. Add indexes to frequently queried columns
# 2. Limit result sets
# 3. Use pagination

# Check Workers performance
# Go to: https://dash.cloudflare.com → Workers

# Monitor with logs
wrangler tail
```

---

## 🔴 Monitoring & Debugging

### View Logs
```bash
# Real-time logs
wrangler tail

# Tail with filters
wrangler tail --format json

# Save logs to file
wrangler tail > logs.txt
```

---

### Check Database
```bash
# Database info
wrangler d1 info newsletter-db

# Query database
wrangler d1 execute newsletter-db --command "SELECT * FROM subscribers;"

# Check table structure
wrangler d1 execute newsletter-db --command ".schema subscribers"
```

---

### Check Secrets
```bash
# List all secrets
wrangler secret list

# Verify specific secret exists
wrangler secret list | grep RESEND_API_KEY
```

---

## ✅ Verification Checklist

After deployment, verify:

```bash
# 1. Health check
curl https://your-project.pages.dev/make-server-53bed28f/health
# Expected: {"status":"ok"}

# 2. Database connection
wrangler d1 info newsletter-db
# Expected: Database info displayed

# 3. Secrets set
wrangler secret list
# Expected: RESEND_API_KEY and FROM_EMAIL listed

# 4. Admin dashboard loads
# Expected: Login page displays

# 5. Can create subscriber
curl -X POST https://your-project.pages.dev/make-server-53bed28f/subscribers \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","language":"en"}'
# Expected: {"success":true,...}

# 6. Can send email
# Expected: Email received (if domain verified)
```

---

## 🆘 Still Having Issues?

### Get Help

1. **Check Logs**
   ```bash
   wrangler tail
   ```

2. **Check Configuration**
   ```bash
   cat wrangler.toml
   wrangler secret list
   ```

3. **Check Database**
   ```bash
   wrangler d1 info newsletter-db
   ```

4. **Check Resend**
   - Go to https://app.resend.com
   - Check email logs
   - Verify domain

5. **Contact Support**
   - Cloudflare: https://support.cloudflare.com
   - Resend: https://resend.com/support
   - Wrangler: https://github.com/cloudflare/wrangler2/issues

---

## 📝 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `wrangler: command not found` | Not installed | `npm install -g wrangler` |
| `Not authenticated` | Not logged in | `wrangler login` |
| `Database not found` | D1 not created | `wrangler d1 create newsletter-db` |
| `UNIQUE constraint failed` | Duplicate email | Expected behavior |
| `Secret not found` | Env var not set | `wrangler secret put KEY` |
| `Build failed` | Compilation error | `npm install && npm run build` |
| `Deployment failed` | Config error | Check `wrangler.toml` |
| `API returns 404` | Endpoint not found | Check URL and deployment |
| `API returns 500` | Server error | Check logs with `wrangler tail` |
| `Email not sending` | Domain not verified | Verify in Resend dashboard |

---

## 🎯 Quick Fixes

```bash
# Fix everything
rm -rf dist node_modules
npm install
npm run build
wrangler deploy

# Reset database
wrangler d1 execute newsletter-db --file schema.sql

# Check everything
wrangler whoami
wrangler d1 info newsletter-db
wrangler secret list
wrangler tail
```

---

**Need more help? Check the other guides:**
- `CLOUDFLARE_DEPLOYMENT.md` - Detailed guide
- `DEPLOYMENT_QUICK_START.md` - Quick reference
- `DEPLOYMENT_VISUAL_GUIDE.md` - Visual walkthrough
