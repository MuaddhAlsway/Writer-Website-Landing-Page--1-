# Render Deployment - Complete Guide

## Current Status

✅ **Backend Server Ready**: `server-standalone.mjs` is production-ready
✅ **Worker Proxy Ready**: `src/worker-email-proxy.ts` is configured
✅ **Frontend API Ready**: `src/utils/api.ts` calls `/api/send-email`
✅ **Dependencies Ready**: All required packages in `package.json`

---

## Architecture Overview

```
Frontend (Cloudflare Pages)
  ↓ POST /api/send-email
Cloudflare Worker (proxy)
  ↓ POST /send-email
Node.js Backend (Render)
  ↓ SMTP Connection
Gmail SMTP (smtp.gmail.com:587)
  ↓
Recipient Inbox
```

---

## Step-by-Step Deployment

### Step 1: Create Render Account

1. Go to https://render.com
2. Click "Sign up"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your GitHub

---

### Step 2: Create Web Service

1. Click "New +" button
2. Select "Web Service"
3. Select your GitHub repository
4. Click "Connect"

---

### Step 3: Configure Service

Fill in the deployment form:

| Field | Value |
|-------|-------|
| **Name** | `email-server` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server-standalone.mjs` |
| **Instance Type** | `Free` |

---

### Step 4: Add Environment Variables

Scroll down to "Environment" section and add these variables:

```
GMAIL_USER = AuthorFSK@gmail.com
GMAIL_APP_PASSWORD = peed qvhs ekmo kisv
NODE_ENV = production
```

**IMPORTANT**: All three variables must be added!

---

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically start deployment
3. Wait 3-5 minutes for deployment to complete
4. You'll see a green checkmark when done

---

### Step 6: Get Backend URL

1. In Render dashboard, click your service
2. Look at the top of the page
3. You'll see a URL like: `https://email-server-production.onrender.com`
4. Copy this URL

---

### Step 7: Update wrangler.toml

Edit `wrangler.toml` and update the BACKEND_URL:

```toml
[vars]
BACKEND_URL = "https://email-server-production.onrender.com"
```

Replace with your actual Render URL from Step 6.

---

### Step 8: Deploy Frontend

Run these commands:

```bash
npm run build
npm run deploy:pages
```

This deploys the frontend to Cloudflare Pages.

---

## Verification Steps

### 1. Test Backend Health

```bash
curl https://email-server-production.onrender.com/health
```

Expected response:
```json
{"status":"ok","service":"email-server"}
```

---

### 2. Test Gmail Connection

```bash
curl https://email-server-production.onrender.com/verify-connection
```

Expected response:
```json
{"success":true,"message":"Gmail SMTP connected"}
```

If this fails:
- Check GMAIL_USER is correct
- Check GMAIL_APP_PASSWORD is correct
- Verify Gmail app password is enabled

---

### 3. Test Email Sending

```bash
curl -X POST https://email-server-production.onrender.com/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["your-email@gmail.com"],
    "subject": "Test Email",
    "message": "<p>This is a test email</p>"
  }'
```

Expected response:
```json
{"success":true,"sent":1,"failed":0,"total":1}
```

---

### 4. Test Production UI

1. Go to your Cloudflare Pages URL
2. Navigate to the admin dashboard
3. Go to "النشرات البريدية" (Newsletters) tab
4. Send a test email
5. Check your Gmail inbox

---

## Troubleshooting

### Deployment Failed

**Check logs:**
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. Look for error messages

**Common issues:**
- Missing environment variables
- Incorrect start command
- Missing dependencies

### Backend Not Responding

```bash
curl https://email-server-production.onrender.com/health
```

If it fails:
1. Check Render logs
2. Verify all environment variables are set
3. Restart the service

### Emails Not Sending

```bash
curl https://email-server-production.onrender.com/verify-connection
```

If it fails:
1. Verify GMAIL_USER: `AuthorFSK@gmail.com`
2. Verify GMAIL_APP_PASSWORD: `peed qvhs ekmo kisv`
3. Create a new app password if needed

### Worker Not Proxying

Check that `wrangler.toml` has the correct BACKEND_URL:

```bash
grep BACKEND_URL wrangler.toml
```

Should show your Render URL.

---

## File Reference

| File | Purpose |
|------|---------|
| `server-standalone.mjs` | Backend server (deploy to Render) |
| `src/worker-email-proxy.ts` | Cloudflare Worker proxy |
| `src/utils/api.ts` | Frontend API client |
| `wrangler.toml` | Cloudflare configuration |
| `.env` | Local environment variables |

---

## Environment Variables

### Backend (Render)

```
GMAIL_USER=AuthorFSK@gmail.com
GMAIL_APP_PASSWORD=peed qvhs ekmo kisv
NODE_ENV=production
```

### Frontend (wrangler.toml)

```toml
[vars]
BACKEND_URL = "https://email-server-production.onrender.com"
```

---

## Testing Checklist

- [ ] Render account created
- [ ] GitHub connected
- [ ] Web Service created
- [ ] All 3 environment variables added
- [ ] Start command: `node server-standalone.mjs`
- [ ] Deployment successful (green checkmark)
- [ ] Backend URL copied
- [ ] wrangler.toml updated with backend URL
- [ ] Frontend deployed with `npm run deploy:pages`
- [ ] Health check works: `/health`
- [ ] Gmail connection verified: `/verify-connection`
- [ ] Test email sent successfully
- [ ] Email arrived in Gmail inbox

---

## Production Checklist

- [ ] Backend running on Render
- [ ] Frontend deployed to Cloudflare Pages
- [ ] BACKEND_URL configured in wrangler.toml
- [ ] Gmail credentials verified
- [ ] All environment variables set
- [ ] Health checks passing
- [ ] Test email sent and received
- [ ] Admin dashboard working
- [ ] Newsletter sending working
- [ ] Contact form working

---

## Support

**Render Documentation**: https://render.com/docs
**Render Status**: https://status.render.com
**Render Support**: support@render.com

---

## Next Steps

1. Deploy backend to Render (follow steps above)
2. Get Render URL
3. Update wrangler.toml
4. Deploy frontend
5. Test production system
6. Monitor Render logs for any issues

---

## Quick Reference

**Render URL Format**: `https://email-server-production.onrender.com`

**Health Check**: `curl https://email-server-production.onrender.com/health`

**Gmail Check**: `curl https://email-server-production.onrender.com/verify-connection`

**Send Email**: `curl -X POST https://email-server-production.onrender.com/send-email -H "Content-Type: application/json" -d '{"recipients":["test@gmail.com"],"subject":"Test","message":"<p>Test</p>"}'`

---

## Important Notes

⚠️ **Do NOT hardcode credentials** - Use environment variables only

⚠️ **Do NOT commit .env file** - It's in .gitignore

⚠️ **Do NOT use third-party email services** - Gmail SMTP only

⚠️ **Do NOT join recipients** - Send individual emails

✅ **Use Gmail app password** - Not regular Gmail password

✅ **Use Render for reliability** - More stable than Railway

✅ **Monitor Render logs** - Check for any issues

---

## Success Indicators

✅ Backend health check returns `{"status":"ok"}`
✅ Gmail connection returns `{"success":true}`
✅ Email sending returns `{"success":true,"sent":1}`
✅ Emails arrive in Gmail inbox
✅ Admin dashboard shows real data
✅ Newsletter sending works
✅ Contact form works

---

**Status**: Ready for production deployment
**Last Updated**: March 13, 2026
**Backend**: Render (Node.js)
**Frontend**: Cloudflare Pages
**Email Service**: Gmail SMTP + Nodemailer

