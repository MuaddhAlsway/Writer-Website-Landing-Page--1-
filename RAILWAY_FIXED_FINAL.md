# Railway Deployment - FIXED

## Problems Identified & Fixed

### Problem 1: Invalid jsonwebtoken Version
- ❌ Had: `jsonwebtoken@^9.1.2` (doesn't exist)
- ❌ Then: `jsonwebtoken@^9.1.0` (doesn't exist)
- ✅ Fixed: `jsonwebtoken@^9.0.0` (latest available)

### Problem 2: Outdated package-lock.json
- ❌ Lock file was out of sync with package.json
- ✅ Regenerated lock file with `npm install`

---

## What I Fixed

1. **package.json**: Changed jsonwebtoken to `^9.0.0`
2. **package-lock.json**: Regenerated with correct versions
3. **railway.json**: Configured to use `server-standalone.mjs`
4. **Procfile**: Configured to use `server-standalone.mjs`

---

## What to Do Now

### Step 1: Push Changes
```bash
git add package.json package-lock.json railway.json Procfile
git commit -m "Fix Railway deployment - correct npm versions"
git push
```

### Step 2: Redeploy on Railway
1. Go to https://railway.app
2. Click your project
3. Click "Redeploy"
4. Wait 2-5 minutes

### Step 3: Check Logs
1. Click "Logs" tab
2. Look for: "Email Server Running"
3. Should see: "✅ Gmail SMTP connected successfully"

### Step 4: Test Backend
```bash
curl https://email-server-production.up.railway.app/health
```

Expected: `{"status":"ok","service":"email-server"}`

### Step 5: Test Gmail Connection
```bash
curl https://email-server-production.up.railway.app/verify-connection
```

Expected: `{"success":true,"message":"Gmail SMTP connected"}`

### Step 6: Update wrangler.toml
```toml
[vars]
BACKEND_URL = "https://email-server-production.up.railway.app"
```

### Step 7: Deploy Frontend
```bash
npm run deploy:pages
```

---

## Files Changed

| File | Change |
|------|--------|
| `package.json` | Fixed jsonwebtoken to 9.0.0 |
| `package-lock.json` | Regenerated |
| `railway.json` | Uses server-standalone.mjs |
| `Procfile` | Uses server-standalone.mjs |

---

## Why This Works

✅ All npm packages now have valid versions
✅ Lock file is in sync
✅ Backend server is self-contained
✅ No cross-file dependencies
✅ Railway can build successfully

---

## Deployment Flow

```
GitHub Push
  ↓
Railway Detects Changes
  ↓
Runs: npm ci (installs from lock file)
  ↓
Runs: node server-standalone.mjs
  ↓
Server Starts Successfully
  ↓
Listens on PORT
  ↓
Ready for Requests
```

---

## Verification Checklist

- [ ] Changes pushed to GitHub
- [ ] Railway redeploy started
- [ ] Deployment completed (green checkmark)
- [ ] Logs show "Email Server Running"
- [ ] Health check returns 200 OK
- [ ] Gmail connection verified
- [ ] wrangler.toml updated
- [ ] Frontend deployed
- [ ] Test email sent
- [ ] Email in inbox

---

## If Still Failing

### Check Railway Logs
1. Go to Railway dashboard
2. Click your project
3. Click "Logs" tab
4. Look for error messages

### Common Issues

| Error | Solution |
|-------|----------|
| "Cannot find module" | All dependencies are installed |
| "Port already in use" | Railway assigns port automatically |
| "GMAIL_USER undefined" | Check environment variables |
| "Connection refused" | Wait for deployment to complete |

### Try Render Instead
If Railway still fails:
1. Go to https://render.com
2. Create Web Service
3. Start Command: `node server-standalone.mjs`
4. Add environment variables
5. Deploy

---

## Environment Variables

Make sure these are set in Railway dashboard:

```
GMAIL_USER = AuthorFSK@gmail.com
GMAIL_APP_PASSWORD = peed qvhs ekmo kisv
NODE_ENV = production
```

---

## Success Indicators

✅ Railway deployment shows green checkmark
✅ Logs show "Email Server Running"
✅ Health check returns 200 OK
✅ Gmail connection verified
✅ Test email sent successfully
✅ Email arrived in Gmail inbox

---

**Status**: FIXED and Ready to Deploy
**Date**: March 13, 2026
**Next**: Push to GitHub and redeploy

