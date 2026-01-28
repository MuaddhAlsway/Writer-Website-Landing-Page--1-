# Nodemailer + Gmail Setup Guide

## Overview

This guide will help you set up Nodemailer to send emails through Gmail. This ensures all emails go to subscribers' Gmail inboxes reliably.

---

## Step 1: Enable 2-Factor Authentication on Gmail

1. Go to: https://myaccount.google.com/security
2. Click **2-Step Verification**
3. Follow the setup process
4. Confirm it's enabled

---

## Step 2: Create an App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select:
   - **App:** Mail
   - **Device:** Windows Computer (or your device)
3. Click **Generate**
4. Google will show a 16-character password
5. **Copy this password** - you'll need it

Example: `abcd efgh ijkl mnop`

---

## Step 3: Update Your .env File

Open `.env` and update:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_SERVICE_PROVIDER=nodemailer
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `abcd efgh ijkl mnop` with the app password from Step 2

---

## Step 4: Test Locally

1. Start the backend server:
   ```bash
   node server-db.mjs
   ```

2. You should see:
   ```
   Admin API server running on http://localhost:3001
   Email Service: Nodemailer & Resend
   Primary Service: Nodemailer
   Gmail Account: your-email@gmail.com
   ```

3. Test subscribing:
   - Visit: http://localhost:5173
   - Enter your email
   - Check if you receive the welcome email

---

## Step 5: Test Newsletter Sending

1. Go to admin dashboard: http://localhost:3001/admin
2. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Create a test newsletter
4. Send it to subscribers
5. Check if emails arrive in Gmail inbox

---

## Troubleshooting

### "Invalid login" error
- Check Gmail account is correct
- Verify app password is correct (no spaces when pasting)
- Ensure 2FA is enabled

### "Less secure app access" error
- This shouldn't happen with app passwords
- If it does, go to: https://myaccount.google.com/security
- Look for "Less secure app access" and enable it

### Emails not arriving
- Check spam folder
- Verify email address is correct
- Check server logs for errors

### "SMTP Error: 535"
- App password is incorrect
- Try generating a new one

---

## Configuration

### Current Setup
```
Email Service: Nodemailer
Provider: Gmail
Authentication: App Password
Rate Limiting: 500ms between sends
```

### Environment Variables
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_SERVICE_PROVIDER=nodemailer
```

---

## Testing Checklist

- [ ] 2FA enabled on Gmail
- [ ] App password generated
- [ ] .env file updated
- [ ] Backend server running
- [ ] Welcome email received
- [ ] Newsletter sent successfully
- [ ] Emails in Gmail inbox (not spam)

---

## Next Steps

Once local testing works:

1. Confirm everything is working
2. Tell me to deploy to Cloudflare Pages
3. I'll update the production environment variables
4. Your live app will send emails via Gmail

---

## Important Notes

- App passwords are specific to your Gmail account
- Never share your app password
- You can revoke it anytime from Google Account settings
- Each app can have its own password

---

## Support

If you encounter issues:

1. Check the server logs: `node server-db.mjs`
2. Verify Gmail credentials
3. Check spam folder for emails
4. Try generating a new app password

---

**Ready to test? Start with Step 1! 🚀**
