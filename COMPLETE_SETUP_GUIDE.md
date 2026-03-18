# Complete Setup Guide - Cloudflare Pages + Turso + Gmail

## Overview
This guide fixes all configuration issues for your Cloudflare Pages app with Turso database and Gmail email service.

---

## STEP 1: Configure Turso Database

### 1.1 Get Your Turso Credentials
1. Go to https://turso.tech
2. Sign in to your account
3. Click on your database: **authorfsk**
4. Copy these values:
   - **Connection URL**: `libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io?authToken=...`
   - **Auth Token**: The token at the end of the URL

### 1.2 Add to Cloudflare Dashboard
1. Go to https://dash.cloudflare.com
2. **Workers & Pages** → **author-fatima-76r**
3. Click **Settings** tab
4. Click **Environment variables** (or **Secrets**)
5. Add these secrets for **Production**:

| Name | Value |
|------|-------|
| `TURSO_CONNECTION_URL` | Paste your full connection URL |
| `TURSO_AUTH_TOKEN` | Paste your auth token |

---

## STEP 2: Configure Gmail Email Service

### 2.1 Create Gmail App Password
1. Go to https://myaccount.google.com
2. Click **Security** (left sidebar)
3. Enable **2-Step Verification** if not already enabled
4. Scroll down to **App passwords**
5. Select **Mail** and **Windows Computer**
6. Copy the 16-character password (with spaces)

### 2.2 Add to Cloudflare Dashboard
In the same **Environment variables** section, add:

| Name | Value |
|------|-------|
| `GMAIL_USER` | `AuthorFSK@gmail.com` |
| `GMAIL_APP_PASSWORD` | Paste the 16-character password |

---

## STEP 3: Verify Database Tables

### 3.1 Check Turso Database Structure
Your database needs these tables:

```sql
-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  language TEXT DEFAULT 'en',
  subscribedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  sentAt TEXT,
  recipientCount INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 Create Tables (if missing)
1. Go to Turso dashboard
2. Click your database
3. Go to **Shell** tab
4. Paste the SQL above and run it

---

## STEP 4: Deploy to Cloudflare

### 4.1 Build Your Project
```bash
npm run build
```

### 4.2 Deploy to Cloudflare Pages
```bash
wrangler pages deploy dist
```

Or use the Cloudflare dashboard:
1. Go to **Workers & Pages** → **author-fatima-76r**
2. Click **Deployments**
3. Find your latest deployment
4. Click **...** → **Retry deployment**

---

## STEP 5: Test Everything

### 5.1 Test Database Connection
Open browser console and run:
```javascript
fetch('https://main.author-fatima-76r-eis.pages.dev/api/newsletters', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer test-token' }
})
.then(r => r.json())
.then(console.log)
```

Expected response:
- ✅ Status 200: `{ success: true, newsletters: [...] }`
- ❌ Status 503: Database not configured
- ❌ Status 401: Missing token

### 5.2 Test Email Service
```javascript
fetch('https://main.author-fatima-76r-eis.pages.dev/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipients: ['test@example.com'],
    subject: 'Test Email',
    content: 'This is a test email'
  })
})
.then(r => r.json())
.then(console.log)
```

Expected response:
- ✅ Status 200: `{ success: true, sent: 1, failed: 0 }`
- ❌ Status 503: Email service not configured
- ❌ Status 500: Email sending failed

---

## STEP 6: Troubleshooting

### Issue: 503 - Database not configured
**Solution:**
1. Check Cloudflare Dashboard → Settings → Environment variables
2. Verify `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` are set
3. Redeploy your site
4. Wait 2-3 minutes for changes to take effect

### Issue: 503 - Email service not configured
**Solution:**
1. Check Cloudflare Dashboard → Settings → Environment variables
2. Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set
3. Make sure Gmail app password is correct (16 characters with spaces)
4. Redeploy your site

### Issue: 500 - Database connection failed
**Solution:**
1. Check Turso dashboard - is your database running?
2. Verify connection URL is correct (no typos)
3. Check auth token is valid
4. Try creating a test connection in Turso shell

### Issue: 500 - Email sending failed
**Solution:**
1. Check Gmail app password is correct
2. Verify Gmail account has 2-Step Verification enabled
3. Check if Gmail is blocking the connection (check Gmail security alerts)
4. Try sending a test email from Gmail directly

---

## STEP 7: Frontend Integration

### 7.1 Admin Dashboard
The admin dashboard automatically:
- Fetches newsletters from `/api/newsletters`
- Sends newsletters via `/api/send-email`
- Shows success/error messages
- Displays subscriber count

### 7.2 Error Handling
All API errors are handled with proper status codes:
- **401**: Unauthorized (missing/invalid token)
- **400**: Bad request (missing required fields)
- **500**: Server error (database/email service failed)
- **503**: Service unavailable (not configured)

---

## API Endpoints

### GET /api/newsletters
Get all newsletters
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://main.author-fatima-76r-eis.pages.dev/api/newsletters
```

### POST /api/newsletters
Send a newsletter
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test","content":"Hello"}' \
  https://main.author-fatima-76r-eis.pages.dev/api/newsletters
```

### POST /api/send-email
Send email to specific recipients
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "recipients":["user@example.com"],
    "subject":"Test",
    "content":"Hello"
  }' \
  https://main.author-fatima-76r-eis.pages.dev/api/send-email
```

---

## Summary

✅ **Turso Database**: Connected with proper credentials
✅ **Gmail Email**: Configured with app password
✅ **Cloudflare Pages**: Deployed with environment variables
✅ **API Endpoints**: Working with proper error handling
✅ **Frontend**: Integrated with error messages

Your app is now fully configured and ready to use!
