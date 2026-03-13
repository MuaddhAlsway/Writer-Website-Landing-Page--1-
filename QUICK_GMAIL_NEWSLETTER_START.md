# Quick Start - Gmail Newsletter Sending

## 3 Simple Steps

### Step 1: Start Backend Server
```bash
node server.mjs
```

Wait for:
```
Mock API server running on http://localhost:3002
```

### Step 2: Create Newsletter
1. Go to Admin Dashboard
2. Click "Create Newsletter"
3. Enter subject and content
4. Click "Create"

### Step 3: Send Newsletter
1. Click "Send Now" on your newsletter
2. Confirm in dialog
3. Check your email inbox

## That's It! 🎉

Emails will be sent from `AuthorFSK@gmail.com` to all subscribers.

## Troubleshooting

**No emails received?**
- Make sure backend is running: `node server.mjs`
- Check browser console for errors
- Check spam folder

**Backend won't start?**
- Check Node.js is installed: `node --version`
- Check port 3002 is available
- Check .env file has Gmail credentials

**Still not working?**
- Check backend logs in terminal
- Verify subscribers exist in database
- Check Gmail account for security alerts

## What's Happening

1. You send newsletter from Cloudflare Pages
2. Cloudflare calls your backend server
3. Backend sends emails via Gmail
4. Emails arrive in subscriber inboxes

## Keep Backend Running

For production, keep the backend running:
- Use PM2: `pm2 start server.mjs`
- Or deploy to Railway/Render
- Or use a VPS

## Done!

Your newsletter system is now sending real emails via Gmail.
