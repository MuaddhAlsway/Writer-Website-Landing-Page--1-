# Email System - Quick Start Guide

## 5-Minute Setup

### Step 1: Verify Gmail Credentials

Your Gmail credentials are already configured:
```
GMAIL_USER: AuthorFSK@gmail.com
GMAIL_APP_PASSWORD: peed qvhs ekmo kisv
```

### Step 2: Start Backend Server Locally

```bash
npm run server
```

You should see:
```
============================================================
📧 Email Server Running
============================================================
Port: 3001
Environment: development
Gmail User: AuthorFSK@gmail.com
============================================================
```

### Step 3: Test Backend Connection

```bash
curl http://localhost:3001/verify-connection
```

Expected response:
```json
{
  "success": true,
  "message": "Gmail SMTP connected"
}
```

### Step 4: Start Frontend Dev Server

In another terminal:
```bash
npm run dev
```

### Step 5: Test Email Sending

1. Go to http://localhost:5173
2. Log in with: admin@authorfatima.com / Admin@12345
3. Go to "إرسال بريد" (Send Email) tab
4. Select recipients
5. Write subject and message
6. Click "إرسال البريد" (Send Email)
7. Check Gmail inbox - email should arrive!

---

## Production Deployment

### Step 1: Deploy Backend Server

**Using Railway (Recommended):**

1. Push code to GitHub
2. Go to https://railway.app
3. Create new project
4. Connect GitHub repository
5. Set environment variables:
   ```
   GMAIL_USER=AuthorFSK@gmail.com
   GMAIL_APP_PASSWORD=peed qvhs ekmo kisv
   NODE_ENV=production
   ```
6. Deploy
7. Copy public URL (e.g., `https://email-server-production.up.railway.app`)

### Step 2: Update Cloudflare Configuration

Edit `wrangler.toml`:
```toml
[vars]
BACKEND_URL = "https://email-server-production.up.railway.app"
```

### Step 3: Deploy Frontend

```bash
npm run build
npm run deploy:pages
```

### Step 4: Test Production

1. Go to https://main.author-fatima-76r-339.pages.dev
2. Log in
3. Send test email
4. Verify email arrives in Gmail inbox

---

## File Structure

```
project/
├── server/
│   ├── emailService.mjs      ← Gmail SMTP service
│   └── emailServer.mjs       ← Express backend server
├── src/
│   ├── worker-email-proxy.ts ← Cloudflare Worker proxy
│   └── utils/api.ts          ← Frontend API client
├── .env                       ← Gmail credentials
├── wrangler.toml             ← Cloudflare config
└── EMAIL_SYSTEM_ARCHITECTURE.md ← Full documentation
```

---

## Key Files Explained

### `server/emailService.mjs`
- Initializes Gmail SMTP connection
- Sends individual emails to each recipient
- Handles errors and logging

### `server/emailServer.mjs`
- Express server with email endpoints
- Validates requests
- Calls emailService to send emails

### `src/worker-email-proxy.ts`
- Cloudflare Worker that proxies requests
- Validates request format
- Forwards to backend server

### `src/utils/api.ts`
- Frontend API client
- Calls `/api/send-email` endpoint

---

## Common Tasks

### Send Email Programmatically

```javascript
const response = await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipients: ['user@gmail.com'],
    subject: 'Hello',
    message: '<p>This is a test email</p>'
  })
});

const result = await response.json();
console.log(result);
// { success: true, sent: 1, failed: 0, total: 1 }
```

### Check Backend Health

```bash
curl http://localhost:3001/health
```

### Verify Gmail Connection

```bash
curl http://localhost:3001/verify-connection
```

### View Backend Logs

```bash
# Local development
npm run server

# Production (Railway)
# Go to Railway dashboard → Logs tab
```

---

## Troubleshooting

### "Backend server not configured"
- Check `wrangler.toml` has `BACKEND_URL` set
- Verify backend server is running

### "Gmail SMTP connection failed"
- Check `.env` has correct `GMAIL_USER` and `GMAIL_APP_PASSWORD`
- Verify Gmail app password is valid
- Check Gmail security settings

### "Invalid email format"
- Ensure all emails are valid: `user@domain.com`
- Check for typos in email addresses

### "Emails not arriving"
- Check Gmail spam folder
- Verify backend logs show "✓ Sent"
- Check Gmail account for security alerts

---

## Next Steps

1. ✅ Test locally with `npm run server`
2. ✅ Deploy backend to Railway
3. ✅ Update `wrangler.toml` with backend URL
4. ✅ Deploy frontend with `npm run deploy:pages`
5. ✅ Test production email sending
6. ✅ Monitor backend logs for errors

---

## Support

For detailed information, see: `EMAIL_SYSTEM_ARCHITECTURE.md`

For issues:
1. Check backend logs
2. Verify environment variables
3. Test endpoints with curl
4. Review troubleshooting section
