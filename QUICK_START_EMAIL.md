# Email System - Quick Start Guide

## 5-Minute Local Setup

### 1. Start Backend Server
```bash
npm run server
```

Expected output:
```
🚀 EMAIL BACKEND SERVER STARTED
Port: 3001
URL: http://localhost:3001
```

### 2. Test Backend
```bash
npm run test:email
```

Expected output:
```
✅ All tests passed! Email system is working correctly.
```

### 3. Start Frontend
```bash
npm run dev
```

Go to http://localhost:5173

### 4. Send Test Email

1. Log in with admin credentials
2. Go to "إرسال بريد" (Send Email)
3. Select recipients
4. Write subject and message
5. Click "إرسال البريد" (Send Email)
6. Check Gmail inbox ✅

---

## Production Deployment (30 minutes)

### 1. Deploy Backend

**Railway (Recommended):**
```bash
# Push to GitHub
git push origin main

# Go to https://railway.app
# Create new project
# Connect GitHub repo
# Set environment variables:
# EMAIL_USER=AuthorFSK@gmail.com
# EMAIL_PASSWORD=peed qvhs ekmo kisv
# Deploy
```

Copy backend URL: `https://email-server-production.up.railway.app`

### 2. Update Configuration

Edit `wrangler.toml`:
```toml
[env.production.vars]
BACKEND_URL = "https://email-server-production.up.railway.app"
```

### 3. Deploy Frontend

```bash
npm run build
npm run deploy:pages
```

### 4. Test Production

1. Go to https://author-fatima-76r-339.pages.dev
2. Log in
3. Send test email
4. Check Gmail inbox ✅

---

## Common Commands

```bash
# Start backend server
npm run server

# Test email system
npm run test:email

# Start frontend dev
npm run dev

# Build frontend
npm run build

# Deploy frontend
npm run deploy:pages

# Check backend health
curl http://localhost:3001/health

# Verify Gmail connection
curl http://localhost:3001/verify-connection

# Send test email via curl
curl -X POST http://localhost:3001/make-server-53bed28f/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["test@gmail.com"],
    "subject": "Test",
    "content": "<p>Test email</p>"
  }'
```

---

## Troubleshooting

### Backend not starting
```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill process using port
kill -9 <PID>

# Try again
npm run server
```

### Gmail connection failed
```bash
# Verify credentials
curl http://localhost:3001/verify-connection

# Check .env file has correct values
cat .env | grep EMAIL

# Regenerate Gmail app password
# https://myaccount.google.com/apppasswords
```

### Emails not sending
```bash
# Check backend logs
npm run server

# Test with curl
curl -X POST http://localhost:3001/make-server-53bed28f/send-email \
  -H "Content-Type: application/json" \
  -d '{"recipients":["test@gmail.com"],"subject":"Test","content":"Test"}'

# Check Gmail inbox (including spam)
```

### Frontend not connecting to backend
```bash
# Check BACKEND_URL in wrangler.toml
cat wrangler.toml | grep BACKEND_URL

# Test backend is accessible
curl https://your-backend-url/health

# Check browser console for errors
# Press F12 → Console tab
```

---

## Environment Variables

### .env (Backend)
```env
EMAIL_USER=AuthorFSK@gmail.com
EMAIL_PASSWORD=peed qvhs ekmo kisv
EMAIL_FROM=AuthorFSK@gmail.com
PORT=3001
NODE_ENV=production
```

### wrangler.toml (Frontend)
```toml
[vars]
BACKEND_URL = "http://localhost:3001"

[env.production.vars]
BACKEND_URL = "https://your-backend-server.com"
```

---

## Testing Checklist

- [ ] Backend starts: `npm run server`
- [ ] Gmail connection works: `curl /verify-connection`
- [ ] Health check works: `curl /health`
- [ ] Test suite passes: `npm run test:email`
- [ ] Frontend starts: `npm run dev`
- [ ] Can log in to admin
- [ ] Can send email
- [ ] Email arrives in inbox
- [ ] Production backend deployed
- [ ] wrangler.toml updated
- [ ] Frontend deployed
- [ ] Production email sending works

---

## Support

**Issue:** Backend not responding
- Check: `npm run server`
- Test: `curl http://localhost:3001/health`

**Issue:** Gmail connection failed
- Check: `curl http://localhost:3001/verify-connection`
- Fix: Verify EMAIL_USER and EMAIL_PASSWORD in .env

**Issue:** Emails not sending
- Check: Backend logs
- Test: `npm run test:email`
- Verify: Email addresses are valid

**Issue:** Frontend can't reach backend
- Check: BACKEND_URL in wrangler.toml
- Test: `curl https://backend-url/health`
- Verify: Backend is running and accessible

---

## Next Steps

1. ✅ Set up local development
2. ✅ Test email sending locally
3. ✅ Deploy backend to production
4. ✅ Update wrangler.toml
5. ✅ Deploy frontend
6. ✅ Test production email sending
7. ✅ Monitor backend logs
8. ✅ Set up alerts

---

**Status:** Ready to go! 🚀
