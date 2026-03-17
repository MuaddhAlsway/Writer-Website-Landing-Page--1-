# Cloudflare Dashboard - Step-by-Step Visual Guide

## STEP 1: Open Cloudflare Dashboard

1. Go to https://dash.cloudflare.com
2. Log in with your account
3. You should see your account dashboard

---

## STEP 2: Navigate to Your Pages Project

1. In the left sidebar, click **Pages**
2. Find and click **author-fatima-76r** project
3. You're now in your project dashboard

---

## STEP 3: Go to Settings

1. At the top of the page, click the **Settings** tab
2. Scroll down to find **Environment variables** section

---

## STEP 4: Add Environment Variables (Public)

These are NOT secrets - they're visible in your code.

### Add Variable 1: ENVIRONMENT

1. Click **Add variable**
2. **Variable name**: `ENVIRONMENT`
3. **Value**: `production`
4. **Environment**: Select **Production**
5. Click **Save**

### Add Variable 2: BACKEND_URL

1. Click **Add variable**
2. **Variable name**: `BACKEND_URL`
3. **Value**: `https://writer-website-landing-page-1.vercel.app`
4. **Environment**: Select **Production**
5. Click **Save**

### Add Variable 3: FRONTEND_URL

1. Click **Add variable**
2. **Variable name**: `FRONTEND_URL`
3. **Value**: `https://main.author-fatima-76r-eis.pages.dev`
4. **Environment**: Select **Production**
5. Click **Save**

---

## STEP 5: Add Secrets (Sensitive Data)

Scroll down to the **Secrets** section under **Production**.

### Add Secret 1: TURSO_CONNECTION_URL

1. Click **Add secret**
2. **Secret name**: `TURSO_CONNECTION_URL`
3. **Value**: Copy and paste the entire URL:
```
libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA
```
4. Click **Save**

### Add Secret 2: TURSO_AUTH_TOKEN

1. Click **Add secret**
2. **Secret name**: `TURSO_AUTH_TOKEN`
3. **Value**: Copy and paste:
```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA
```
4. Click **Save**

### Add Secret 3: GMAIL_USER

1. Click **Add secret**
2. **Secret name**: `GMAIL_USER`
3. **Value**: `AuthorFSK@gmail.com`
4. Click **Save**

### Add Secret 4: GMAIL_APP_PASSWORD

1. Click **Add secret**
2. **Secret name**: `GMAIL_APP_PASSWORD`
3. **Value**: `peed qvhs ekmo kisv`
4. Click **Save**

---

## STEP 6: Verify All Variables and Secrets

After adding everything, you should see:

### Variables (Production):
- ✅ ENVIRONMENT = production
- ✅ BACKEND_URL = https://writer-website-landing-page-1.vercel.app
- ✅ FRONTEND_URL = https://main.author-fatima-76r-eis.pages.dev

### Secrets (Production):
- ✅ TURSO_CONNECTION_URL (hidden)
- ✅ TURSO_AUTH_TOKEN (hidden)
- ✅ GMAIL_USER (hidden)
- ✅ GMAIL_APP_PASSWORD (hidden)

---

## STEP 7: Redeploy Your Project

1. Go to the **Deployments** tab
2. Find your latest deployment
3. Click the **...** menu
4. Click **Redeploy**
5. Wait for the deployment to complete (usually 1-2 minutes)

---

## STEP 8: Test the API

After redeployment, test if Turso is working:

1. Open your browser console (F12)
2. Go to https://main.author-fatima-76r-eis.pages.dev/admin
3. Open the Admin Dashboard
4. Check if subscribers load without errors
5. Try adding a new subscriber

---

## Common Issues

### Issue: Still seeing "Turso not configured"
- **Solution**: Make sure you redeployed after adding secrets
- Wait 2-3 minutes for changes to propagate
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: Can't find Settings tab
- **Solution**: Make sure you're in the Pages project, not the main Cloudflare dashboard
- Click on your project name first

### Issue: Secrets not showing up
- **Solution**: Refresh the page
- Make sure you're looking at the **Production** environment
- Check that you clicked **Save** after entering each secret

---

## Summary

You've now:
1. ✅ Added 3 public variables to Cloudflare Pages
2. ✅ Added 4 secrets to Cloudflare Pages
3. ✅ Redeployed your project
4. ✅ Turso database is now connected to your Cloudflare Pages API

Your API endpoints will now work with persistent Turso database storage!
