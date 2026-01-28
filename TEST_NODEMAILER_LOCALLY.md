# Test Nodemailer Locally

## Quick Start

### 1. Update .env File

Open `.env` and set your Gmail credentials:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_SERVICE_PROVIDER=nodemailer
```

**Get your app password:**
1. Go to: https://myaccount.google.com/apppasswords
2. Select Mail + Windows Computer
3. Generate and copy the 16-character password

### 2. Start Backend Server

```bash
node server-db.mjs
```

You should see:
```
Admin API server running on http://localhost:3001
Email Service: Nodemailer & Resend
Primary Service: Nodemailer
Gmail Account: your-email@gmail.com
```

### 3. Start Frontend (in another terminal)

```bash
npm run dev
```

### 4. Test Subscription

1. Visit: http://localhost:5173
2. Enter your email address
3. Click subscribe
4. **Check your Gmail inbox for welcome email**

### 5. Test Newsletter

1. Go to: http://localhost:5173/admin
2. Login:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Create a newsletter
4. Send it
5. **Check if email arrives**

---

## What to Check

✅ Welcome email arrives when subscribing  
✅ Email is in Gmail inbox (not spam)  
✅ Newsletter emails send successfully  
✅ No errors in server console  
✅ Email content looks good  

---

## If Something Goes Wrong

### Check Server Logs
Look for error messages in the terminal running `node server-db.mjs`

### Common Issues

**"Invalid login"**
- Gmail credentials are wrong
- App password is incorrect
- 2FA not enabled

**"Emails not arriving"**
- Check spam folder
- Verify email address
- Check server logs

**"SMTP Error"**
- App password issue
- Gmail account locked
- Try generating new password

---

## Once Testing Works

Tell me: **"Testing complete, ready to deploy"**

Then I'll:
1. Deploy to Cloudflare Pages
2. Set environment variables
3. Your live app will send emails via Gmail

---

## Testing Checklist

- [ ] .env file updated with Gmail credentials
- [ ] Backend server running without errors
- [ ] Frontend running
- [ ] Welcome email received
- [ ] Newsletter sent successfully
- [ ] Emails in Gmail inbox

---

**Start testing now! 🚀**
