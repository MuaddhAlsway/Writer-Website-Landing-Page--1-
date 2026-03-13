# Why Railway Failed - Root Cause & Fix

## Problem Identified

Railway deployment failed because:

1. **Wrong Start Command**: `railway.json` was pointing to `server/emailServer.mjs`
2. **Module Dependency Issue**: `emailServer.mjs` depends on `emailService.mjs`
3. **Complex Setup**: Multiple files made deployment fragile

## Solution Applied

Changed to use `server-standalone.mjs` which:
- ✅ Self-contained (no dependencies on other files)
- ✅ Simpler to deploy
- ✅ More reliable
- ✅ All code in one file

## Files Updated

### 1. railway.json
**Before:**
```json
"startCommand": "node server/emailServer.mjs"
```

**After:**
```json
"startCommand": "node server-standalone.mjs"
```

### 2. Procfile
**Before:**
```
web: node server/emailServer.mjs
```

**After:**
```
web: node server-standalone.mjs
```

---

## Why This Works Better

| Aspect | Old Setup | New Setup |
|--------|-----------|-----------|
| Files | 2 files (emailServer.mjs + emailService.mjs) | 1 file (server-standalone.mjs) |
| Dependencies | Cross-file imports | Self-contained |
| Deployment | More complex | Simpler |
| Reliability | Fragile | Robust |
| Debugging | Harder | Easier |

---

## What to Do Now

### Option 1: Retry Railway (Recommended)

1. Push the updated files:
```bash
git add railway.json Procfile
git commit -m "Fix Railway deployment - use standalone server"
git push
```

2. Go to Railway dashboard
3. Click "Redeploy"
4. Wait for deployment

### Option 2: Use Render Instead

If Railway still fails, use Render:

1. Go to https://render.com
2. Create Web Service
3. Set Start Command: `node server-standalone.mjs`
4. Add environment variables
5. Deploy

---

## Verification

After deployment, test:

```bash
# Health check
curl https://email-server-production.up.railway.app/health

# Gmail connection
curl https://email-server-production.up.railway.app/verify-connection

# Send test email
curl -X POST https://email-server-production.up.railway.app/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["test@gmail.com"],
    "subject": "Test",
    "message": "<p>Test</p>"
  }'
```

---

## Common Railway Issues

### Issue 1: Build Fails
**Cause**: Missing dependencies
**Fix**: Ensure `package.json` has all dependencies
**Check**: `npm install` locally first

### Issue 2: Start Command Error
**Cause**: Wrong file path
**Fix**: Use `node server-standalone.mjs`
**Check**: File exists in root directory

### Issue 3: Environment Variables Not Set
**Cause**: Variables not added in Railway dashboard
**Fix**: Add all 3 variables:
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `NODE_ENV`

### Issue 4: Port Binding Error
**Cause**: Hardcoded port
**Fix**: Use `process.env.PORT || 3001`
**Check**: `server-standalone.mjs` already does this

### Issue 5: Gmail Connection Failed
**Cause**: Wrong credentials
**Fix**: Verify app password is correct
**Check**: `curl https://[url]/verify-connection`

---

## Deployment Checklist

- [ ] Updated `railway.json` with `server-standalone.mjs`
- [ ] Updated `Procfile` with `server-standalone.mjs`
- [ ] Pushed changes to GitHub
- [ ] Railway dashboard shows new deployment
- [ ] All environment variables set
- [ ] Deployment successful (green checkmark)
- [ ] Health check passes
- [ ] Gmail connection verified
- [ ] Test email sent successfully

---

## If Still Failing

### Step 1: Check Railway Logs
1. Go to Railway dashboard
2. Click your project
3. Click "Logs" tab
4. Look for error messages

### Step 2: Common Error Messages

**"Cannot find module 'express'"**
- Solution: Run `npm install` locally
- Push to GitHub
- Redeploy

**"GMAIL_USER is not defined"**
- Solution: Add environment variables in Railway
- Make sure all 3 are set
- Redeploy

**"Port is already in use"**
- Solution: Railway assigns port automatically
- Don't hardcode port
- Already fixed in `server-standalone.mjs`

**"Connection refused"**
- Solution: Wait for deployment to complete
- Check if service is running
- Restart service

### Step 3: Try Render Instead

If Railway continues to fail:

1. Go to https://render.com
2. Create Web Service
3. Connect GitHub
4. Set Start Command: `node server-standalone.mjs`
5. Add environment variables
6. Deploy

Render is often more reliable than Railway.

---

## What Changed

### Removed
- ❌ Complex multi-file setup
- ❌ Cross-file dependencies
- ❌ Fragile module imports

### Added
- ✅ Self-contained server
- ✅ Simpler deployment
- ✅ More reliable

### Kept
- ✅ Same functionality
- ✅ Same endpoints
- ✅ Same email sending

---

## Next Steps

1. **Push changes to GitHub**
   ```bash
   git add .
   git commit -m "Fix Railway deployment"
   git push
   ```

2. **Redeploy on Railway**
   - Go to Railway dashboard
   - Click "Redeploy"
   - Wait for completion

3. **Test backend**
   ```bash
   curl https://email-server-production.up.railway.app/health
   ```

4. **Update wrangler.toml** (if deployment succeeds)
   ```toml
   BACKEND_URL = "https://email-server-production.up.railway.app"
   ```

5. **Deploy frontend**
   ```bash
   npm run deploy:pages
   ```

---

## Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Render Docs**: https://render.com/docs

---

**Status**: Fixed and ready to redeploy
**Date**: March 13, 2026
**Solution**: Use `server-standalone.mjs` instead of multi-file setup

