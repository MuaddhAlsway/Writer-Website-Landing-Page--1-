# Deploy Email Server to Railway

## Overview

Railway is a modern deployment platform that makes it easy to deploy Node.js applications. This guide will deploy the email server to Railway so it runs on the internet (not locally).

---

## Step 1: Create Railway Account

1. Go to https://railway.app
2. Click "Start Project"
3. Sign up with GitHub (recommended)
4. Authorize Railway to access your GitHub account

---

## Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub"
3. Search for your repository: `authorfatima` or your repo name
4. Click "Deploy"

Railway will automatically detect the Node.js project.

---

## Step 3: Configure Environment Variables

1. In Railway dashboard, go to your project
2. Click "Variables" tab
3. Add these environment variables:

```
GMAIL_USER=AuthorFSK@gmail.com
GMAIL_APP_PASSWORD=peed qvhs ekmo kisv
NODE_ENV=production
PORT=3001
```

**Important:** 
- `GMAIL_USER` and `GMAIL_APP_PASSWORD` are required
- `PORT` should be 3001 (Railway will expose it)
- `NODE_ENV` should be production

---

## Step 4: Deploy

1. Railway automatically deploys when you push to GitHub
2. Or click "Deploy" button in dashboard
3. Wait for deployment to complete (2-5 minutes)
4. You'll see a green checkmark when done

---

## Step 5: Get Your Backend URL

1. In Railway dashboard, click your project
2. Go to "Settings" tab
3. Look for "Domains" section
4. You'll see a URL like: `https://email-server-production.up.railway.app`
5. Copy this URL

---

## Step 6: Update Cloudflare Configuration

1. Edit `wrangler.toml` in your project:

```toml
[vars]
BACKEND_URL = "https://email-server-production.up.railway.app"
```

Replace with your actual Railway URL from Step 5.

2. Commit and push to GitHub:

```bash
git add wrangler.toml
git commit -m "Update backend URL to Railway"
git push
```

---

## Step 7: Deploy Frontend to Cloudflare

```bash
npm run build
npm run deploy:pages
```

---

## Step 8: Test Production Email

1. Go to https://main.author-fatima-76r-339.pages.dev
2. Log in with: admin@authorfatima.com / Admin@12345
3. Go to "إرسال بريد" (Send Email) tab
4. Select recipients
5. Send email
6. Check Gmail inbox - email should arrive!

---

## Verify Deployment

### Check Backend Health

```bash
curl https://email-server-production.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "email-server"
}
```

### Verify Gmail Connection

```bash
curl https://email-server-production.up.railway.app/verify-connection
```

Expected response:
```json
{
  "success": true,
  "message": "Gmail SMTP connected"
}
```

### Test Email Sending

```bash
curl -X POST https://email-server-production.up.railway.app/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["your-email@gmail.com"],
    "subject": "Test Email",
    "message": "<p>This is a test email from Railway</p>"
  }'
```

Expected response:
```json
{
  "success": true,
  "sent": 1,
  "failed": 0,
  "total": 1
}
```

---

## Monitor Deployment

### View Logs

1. Go to Railway dashboard
2. Click your project
3. Click "Logs" tab
4. You'll see real-time logs:

```
[2026-03-13T10:30:45.123Z] 📧 Email Server Running
[2026-03-13T10:30:45.456Z] Port: 3001
[2026-03-13T10:30:45.789Z] Gmail User: AuthorFSK@gmail.com
[2026-03-13T10:30:46.012Z] ✓ Gmail SMTP connection verified
```

### View Metrics

1. Click "Metrics" tab
2. Monitor:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count

---

## Troubleshooting

### Deployment Failed

**Check logs:**
1. Go to Railway dashboard
2. Click "Logs" tab
3. Look for error messages

**Common issues:**
- Missing environment variables
- Invalid Gmail credentials
- Port already in use

### Backend Not Responding

**Check if Railway app is running:**
```bash
curl https://email-server-production.up.railway.app/health
```

If it fails:
1. Go to Railway dashboard
2. Check "Deployments" tab
3. Restart the deployment if needed

### Emails Not Sending

**Check Gmail connection:**
```bash
curl https://email-server-production.up.railway.app/verify-connection
```

If it fails:
1. Verify `GMAIL_USER` environment variable
2. Verify `GMAIL_APP_PASSWORD` environment variable
3. Check Gmail account for security alerts
4. Create new app password if needed

### Worker Not Proxying

**Check BACKEND_URL in wrangler.toml:**
```toml
BACKEND_URL = "https://email-server-production.up.railway.app"
```

Make sure:
1. URL is correct
2. URL is accessible from browser
3. No typos in URL

---

## Update Backend Code

When you update the backend code:

1. Make changes to `server/emailServer.mjs` or `server/emailService.mjs`
2. Commit and push to GitHub:
   ```bash
   git add server/
   git commit -m "Update email server"
   git push
   ```
3. Railway automatically redeploys
4. Wait for deployment to complete
5. Test with curl commands above

---

## Scale Up (Optional)

If you need more resources:

1. Go to Railway dashboard
2. Click your project
3. Go to "Settings" tab
4. Increase "Memory" or "CPU"
5. Railway will restart with new resources

---

## Cost

Railway pricing:
- **Free tier**: $5/month credit (usually enough for small projects)
- **Pay as you go**: $0.50/GB RAM/month, $0.10/vCPU/month
- **Email server**: ~$2-5/month for typical usage

---

## Next Steps

1. ✅ Create Railway account
2. ✅ Deploy backend server
3. ✅ Get Railway URL
4. ✅ Update wrangler.toml
5. ✅ Deploy frontend
6. ✅ Test production email
7. ✅ Monitor logs

---

## Summary

Your email system is now:

```
Frontend (Cloudflare Pages)
    ↓
Cloudflare Worker (Proxy)
    ↓
Backend Server (Railway) ← Running on internet
    ↓
Nodemailer + Gmail SMTP
    ↓
Gmail Inbox
```

Emails will be sent from the internet, not locally!

---

## Support

For Railway support:
- Documentation: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

For email system issues:
- See: EMAIL_SYSTEM_ARCHITECTURE.md
- See: EMAIL_SYSTEM_QUICKSTART.md
