# Deploy Backend NOW - Step by Step

## What Was Fixed

Railway failed because of wrong configuration. I fixed it:
- ✅ Updated `railway.json`
- ✅ Updated `Procfile`
- ✅ Now uses `server-standalone.mjs` (self-contained)

---

## Option 1: Retry Railway (Recommended)

### Step 1: Push Changes
```bash
git add .
git commit -m "Fix Railway deployment"
git push
```

### Step 2: Redeploy
1. Go to https://railway.app
2. Click your project
3. Click "Redeploy"
4. Wait 2-5 minutes

### Step 3: Check Logs
1. Click "Logs" tab
2. Look for: "Email Server Running"
3. If error, check environment variables

### Step 4: Test
```bash
curl https://email-server-production.up.railway.app/health
```

Should return: `{"status":"ok","service":"email-server"}`

### Step 5: Update wrangler.toml
```toml
[vars]
BACKEND_URL = "https://email-server-production.up.railway.app"
```

### Step 6: Deploy Frontend
```bash
npm run deploy:pages
```

---

## Option 2: Use Render (If Railway Still Fails)

### Step 1: Create Account
Go to https://render.com and sign up with GitHub

### Step 2: Create Web Service
1. Click "New +"
2. Select "Web Service"
3. Select your GitHub repo
4. Click "Connect"

### Step 3: Configure
- **Name**: `email-server`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server-standalone.mjs`
- **Instance Type**: `Free`

### Step 4: Add Environment Variables
```
GMAIL_USER = AuthorFSK@gmail.com
GMAIL_APP_PASSWORD = peed qvhs ekmo kisv
NODE_ENV = production
```

### Step 5: Deploy
Click "Create Web Service" and wait

### Step 6: Get URL
Copy the URL from Render dashboard (e.g., `https://email-server-production.onrender.com`)

### Step 7: Update wrangler.toml
```toml
[vars]
BACKEND_URL = "https://email-server-production.onrender.com"
```

### Step 8: Deploy Frontend
```bash
npm run deploy:pages
```

---

## Testing

### Test 1: Health Check
```bash
curl https://[backend-url]/health
```
Expected: `{"status":"ok","service":"email-server"}`

### Test 2: Gmail Connection
```bash
curl https://[backend-url]/verify-connection
```
Expected: `{"success":true,"message":"Gmail SMTP connected"}`

### Test 3: Send Email
```bash
curl -X POST https://[backend-url]/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["test@gmail.com"],
    "subject": "Test",
    "message": "<p>Test</p>"
  }'
```
Expected: `{"success":true,"sent":1,"failed":0,"total":1}`

### Test 4: Production UI
1. Go to your Cloudflare Pages URL
2. Log in to admin
3. Send test email
4. Check Gmail inbox

---

## Troubleshooting

### Railway Deployment Failed
1. Check Railway logs
2. Verify environment variables are set
3. Try Render instead

### Backend Not Responding
1. Check if deployment is complete
2. Verify backend URL in wrangler.toml
3. Check Render/Railway logs

### Emails Not Sending
1. Test Gmail connection: `curl https://[url]/verify-connection`
2. Check GMAIL_USER and GMAIL_APP_PASSWORD
3. Create new app password if needed

### Worker Not Proxying
1. Verify BACKEND_URL in wrangler.toml
2. Redeploy frontend: `npm run deploy:pages`
3. Check browser console for errors

---

## Quick Checklist

- [ ] Changes pushed to GitHub
- [ ] Backend deployed (Railway or Render)
- [ ] Backend URL copied
- [ ] wrangler.toml updated
- [ ] Frontend deployed
- [ ] Health check passes
- [ ] Gmail connection verified
- [ ] Test email sent
- [ ] Email in inbox

---

## Files Reference

| File | Purpose |
|------|---------|
| `server-standalone.mjs` | Backend server |
| `railway.json` | Railway config (FIXED) |
| `Procfile` | Process config (FIXED) |
| `wrangler.toml` | Cloudflare config |
| `.env` | Local env vars |

---

## Environment Variables

### Backend (Railway/Render)
```
GMAIL_USER=AuthorFSK@gmail.com
GMAIL_APP_PASSWORD=peed qvhs ekmo kisv
NODE_ENV=production
```

### Frontend (wrangler.toml)
```toml
BACKEND_URL = "https://[backend-url]"
```

---

## Success Indicators

✅ Backend deployed successfully
✅ Health check returns 200 OK
✅ Gmail connection verified
✅ Test email sent
✅ Email arrived in inbox
✅ Admin dashboard working
✅ Newsletter sending working

---

**Status**: Ready to deploy
**Backend**: Fixed and ready
**Frontend**: Ready to deploy
**Next**: Choose Railway or Render and deploy

