# Gmail Newsletter Setup - Using Your App Password

## What's Configured

You already have Gmail set up with an app password:
- Email: `AuthorFSK@gmail.com`
- App Password: `peed qvhs ekmo kisv`

## How It Works Now

### Newsletter Sending Flow:

1. **Admin sends newsletter** from Cloudflare Pages
2. **Cloudflare function** fetches subscribers from Turso database
3. **Cloudflare function** calls your backend server
4. **Backend server** (running locally or on a server) sends emails via Nodemailer + Gmail
5. **Emails arrive** in subscriber inboxes from your Gmail account

## Setup Steps

### Step 1: Start Your Backend Server

```bash
node server.mjs
```

You should see:
```
Mock API server running on http://localhost:3002
```

### Step 2: Configure Backend URL (if not local)

If your backend is running on a different server, update the Cloudflare function:

In `functions/make-server-53bed28f/[[route]].ts`, change:
```typescript
const backendUrl = context.env.BACKEND_URL || 'http://localhost:3002';
```

Or set the environment variable:
```bash
wrangler pages secret put BACKEND_URL
```

Then paste your backend URL (e.g., `https://your-backend.com`)

### Step 3: Test Newsletter Sending

1. Make sure backend server is running
2. Go to Admin Dashboard
3. Create a newsletter
4. Click "Send Now"
5. Check your email inbox

## What Happens Behind the Scenes

### When You Send a Newsletter:

```
1. Frontend sends request to Cloudflare
   POST /make-server-53bed28f/newsletters/{id}/send

2. Cloudflare function:
   - Queries Turso for newsletter details
   - Queries Turso for all subscribers
   - For each subscriber:
     - Creates HTML email
     - Calls backend: POST /make-server-53bed28f/send-email
     - Backend sends via Gmail

3. Backend server (Nodemailer):
   - Connects to Gmail SMTP
   - Authenticates with app password
   - Sends email to subscriber
   - Returns success/failure

4. Cloudflare updates newsletter status to "sent"

5. Frontend shows success message with recipient count
```

## Email Configuration

### Gmail Settings (Already Configured)

```
Service: Gmail
Email: AuthorFSK@gmail.com
App Password: peed qvhs ekmo kisv
```

### Email Template

Emails are sent with:
- Professional HTML template
- Gradient header with newsletter title
- Proper text alignment (RTL for Arabic, LTR for English)
- Footer with copyright
- Responsive design

## Troubleshooting

### Emails not being sent?

**Check 1: Is backend server running?**
```bash
# Terminal 1: Start backend
node server.mjs

# Terminal 2: Test it
curl http://localhost:3002/make-server-53bed28f/health
```

**Check 2: Check backend logs**
Look for errors in the terminal where you ran `node server.mjs`

**Check 3: Check Gmail settings**
- Verify app password is correct
- Check Gmail account for security alerts
- Verify "Less secure app access" is enabled (if needed)

**Check 4: Check subscriber data**
- Make sure subscribers exist in database
- Verify email addresses are valid

### Backend connection error?

If you see "Failed to connect to backend":
1. Make sure backend is running: `node server.mjs`
2. Check backend URL is correct
3. Check firewall/network settings

### Gmail authentication error?

If you see "Gmail authentication failed":
1. Verify app password is correct
2. Check Gmail account security settings
3. Try generating a new app password

## Production Deployment

### Option 1: Deploy Backend to Railway/Render

```bash
# Deploy server.mjs to Railway or Render
# Get the URL (e.g., https://your-backend.railway.app)
# Set BACKEND_URL in Cloudflare:
wrangler pages secret put BACKEND_URL
# Paste: https://your-backend.railway.app
```

### Option 2: Use Cloudflare Workers

Instead of calling a backend, you could:
1. Use Resend API (simpler, no backend needed)
2. Use SendGrid API
3. Use Mailgun API

### Option 3: Keep Local Backend

If you want to keep the backend running locally:
1. Make sure it's always running
2. Use a process manager like PM2
3. Or use a service like ngrok to expose it

## Current Setup Summary

✅ **Frontend**: Cloudflare Pages (deployed)
✅ **Database**: Turso (configured)
✅ **Email Service**: Gmail + Nodemailer (configured)
✅ **Backend**: Local Node.js server (needs to be running)

## Next Steps

1. Start backend: `node server.mjs`
2. Create a newsletter in Admin Dashboard
3. Send it
4. Check your email inbox
5. Verify emails arrive

## Files Modified

- `functions/make-server-53bed28f/[[route]].ts` - Calls backend for email sending
- `server.mjs` - Actually sends emails via Nodemailer + Gmail

## Important Notes

- Backend must be running for emails to send
- App password is already configured
- Emails are sent from: `AuthorFSK@gmail.com`
- Supports both English and Arabic emails
- Proper HTML formatting with language-specific styling

## Questions?

- Check backend logs: Look at terminal where `node server.mjs` is running
- Check browser console: Look for API errors
- Check Gmail: Verify emails aren't in spam folder
- Check Turso: Verify subscribers exist in database
