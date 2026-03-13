# Deploy to Railway - Simple Guide

## What Went Wrong?

Railway deployment can fail due to:
- Missing environment variables
- Incorrect Node.js version
- Missing dependencies
- Port configuration issues

This guide uses a simpler, more reliable approach.

---

## Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Add email server for Railway deployment"
git push
```

---

## Step 2: Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Search for your repository
5. Click "Deploy"

---

## Step 3: Add Environment Variables

**IMPORTANT: Do this BEFORE deployment**

1. In Railway dashboard, click your project
2. Click "Variables" tab
3. Click "Add Variable"
4. Add these ONE BY ONE:

```
GMAIL_USER = AuthorFSK@gmail.com
GMAIL_APP_PASSWORD = peed qvhs ekmo kisv
NODE_ENV = production
```

**Make sure all three are added!**

---

## Step 4: Configure Start Command

1. Click "Settings" tab
2. Look for "Start Command"
3. Set it to:
```
node server-standalone.mjs
```

---

## Step 5: Deploy

1. Click "Deploy" button
2. Wait for deployment (2-5 minutes)
3. Check logs for errors

---

## Step 6: Get Your URL

1. Click "Settings" tab
2. Look for "Domains"
3. You'll see a URL like:
```
https://email-server-production.up.railway.app
```

Copy this URL.

---

## Step 7: Update wrangler.toml

Edit `wrangler.toml`:

```toml
[vars]
BACKEND_URL = "https://email-server-production.up.railway.app"
```

Replace with your actual Railway URL.

---

## Step 8: Deploy Frontend

```bash
npm run build
npm run deploy:pages
```

---

## Step 9: Test

```bash
# Test backend
curl https://email-server-production.up.railway.app/health

# Test Gmail connection
curl https://email-server-production.up.railway.app/verify-connection

# Test email sending
curl -X POST https://email-server-production.up.railway.app/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["your-email@gmail.com"],
    "subject": "Test",
    "message": "<p>Test email</p>"
  }'
```

---

## Troubleshooting

### Deployment Failed

**Check logs:**
1. Go to Railway dashboard
2. Click "Logs" tab
3. Look for error messages

**Common errors:**

**Error: "Cannot find module 'express'"**
- Solution: Make sure `package.json` has all dependencies
- Run: `npm install`
- Push to GitHub

**Error: "GMAIL_USER is not defined"**
- Solution: Add environment variables in Railway dashboard
- Make sure all three variables are added

**Error: "Port is already in use"**
- Solution: Railway assigns port automatically
- Don't hardcode port in code

### Backend Not Responding

```bash
curl https://email-server-production.up.railway.app/health
```

If it fails:
1. Check Railway logs
2. Verify environment variables
3. Restart deployment

### Emails Not Sending

```bash
curl https://email-server-production.up.railway.app/verify-connection
```

If it fails:
1. Check GMAIL_USER is correct
2. Check GMAIL_APP_PASSWORD is correct
3. Create new app password if needed

---

## Verify Everything Works

### 1. Backend Health
```bash
curl https://email-server-production.up.railway.app/health
```
Should return: `{"status":"ok","service":"email-server"}`

### 2. Gmail Connection
```bash
curl https://email-server-production.up.railway.app/verify-connection
```
Should return: `{"success":true,"message":"Gmail SMTP connected"}`

### 3. Send Test Email
```bash
curl -X POST https://email-server-production.up.railway.app/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["test@gmail.com"],
    "subject": "Test",
    "message": "<p>Test</p>"
  }'
```
Should return: `{"success":true,"sent":1,"failed":0,"total":1}`

### 4. Frontend Test
1. Go to https://main.author-fatima-76r-339.pages.dev
2. Log in
3. Send test email
4. Check Gmail inbox

---

## If Still Failing

### Option 1: Use Render Instead

Render is similar to Railway:

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub
4. Set environment variables
5. Deploy

### Option 2: Use Heroku

Heroku is another option:

1. Go to https://heroku.com
2. Create new app
3. Connect GitHub
4. Set environment variables
5. Deploy

### Option 3: Use Replit

Replit is simpler:

1. Go to https://replit.com
2. Import from GitHub
3. Set environment variables
4. Click "Run"
5. Get public URL

---

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] Environment variables added (all 3)
- [ ] Start command set to: `node server-standalone.mjs`
- [ ] Deployment successful
- [ ] Backend URL copied
- [ ] wrangler.toml updated
- [ ] Frontend deployed
- [ ] Backend health check works
- [ ] Gmail connection verified
- [ ] Test email sent successfully

---

## Support

If deployment still fails:
1. Check Railway logs carefully
2. Verify all environment variables
3. Try Render or Heroku instead
4. Contact Railway support: https://discord.gg/railway
