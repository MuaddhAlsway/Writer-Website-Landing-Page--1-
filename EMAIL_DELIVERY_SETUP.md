# Email Delivery Setup - Complete

## Current Status

✅ **Frontend**: Cloudflare Pages (deployed)
✅ **API**: Cloudflare Functions (deployed)
✅ **Database**: Turso (real data)
✅ **Email Proxy**: Configured to call Vercel backend

## Why Emails Not Arriving

The email system is currently **simulating** sends because:
- Cloudflare Functions cannot open SMTP connections
- Need Vercel backend to handle Gmail SMTP

## Solution: Deploy Vercel Backend

### Step 1: Go to Vercel

https://vercel.com

### Step 2: Deploy Backend

1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Click "Import"

### Step 3: Configure

**Build Command**: `npm run build`
**Output Directory**: `dist`

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

```
GMAIL_USER = AuthorFSK@gmail.com
GMAIL_APP_PASSWORD = peed qvhs ekmo kisv
```

### Step 5: Deploy

Click "Deploy"

### Step 6: Get URL

After deployment, you'll see URL like:
```
https://author-fatima.vercel.app
```

### Step 7: Update wrangler.toml

Already set to:
```toml
BACKEND_URL = "https://author-fatima.vercel.app/api"
```

If different, update it.

### Step 8: Redeploy Frontend

```bash
npm run deploy:pages
```

## How It Works

```
Admin Panel (Cloudflare Pages)
  ↓ POST /api/send-email
Cloudflare Function (proxy)
  ↓ POST /api/send-email
Vercel Backend
  ↓ SMTP Connection
Gmail SMTP (smtp.gmail.com:587)
  ↓
Recipient Inbox ✅
```

## Email Flow

1. Admin writes email in "إرسال بريد" tab
2. Clicks "Send"
3. Frontend sends to `/api/send-email`
4. Cloudflare Function proxies to Vercel
5. Vercel backend connects to Gmail SMTP
6. Gmail sends email with app password
7. Email arrives in recipient inbox

## Testing

After Vercel deployment:

1. Go to admin panel
2. Go to "إرسال بريد" tab
3. Select recipient
4. Write message
5. Click "Send"
6. Check Gmail inbox

## Troubleshooting

### Email Still Not Arriving

1. Check Vercel logs:
   - Go to https://vercel.com
   - Click your project
   - Click "Logs"
   - Look for errors

2. Verify environment variables:
   - GMAIL_USER: `AuthorFSK@gmail.com`
   - GMAIL_APP_PASSWORD: `peed qvhs ekmo kisv`

3. Test Vercel endpoint:
   ```bash
   curl -X POST https://author-fatima.vercel.app/api/send-email \
     -H "Content-Type: application/json" \
     -d '{
       "recipients": ["test@gmail.com"],
       "subject": "Test",
       "message": "<p>Test</p>"
     }'
   ```

### Backend URL Wrong

Check `wrangler.toml`:
```toml
BACKEND_URL = "https://author-fatima.vercel.app/api"
```

Should match your Vercel URL.

## Current Setup

- ✅ Frontend: Cloudflare Pages
- ✅ API: Cloudflare Functions
- ✅ Database: Turso (real data)
- ✅ Email Proxy: Configured
- ⏳ Vercel Backend: Needs deployment

## Next Step

**Deploy Vercel backend** to enable real email sending.

---

**Status**: Ready for Vercel deployment
**Date**: March 13, 2026

