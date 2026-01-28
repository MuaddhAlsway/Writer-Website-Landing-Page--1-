# Nodemailer Setup Guide - Complete Instructions

## What is Nodemailer?

Nodemailer is a Node.js module that allows you to send emails easily. It works with Gmail, Outlook, Yahoo, and any SMTP server.

---

## Setup Options

### Option 1: Gmail (Recommended - Free)
- Free
- 500 emails/day limit
- Easy setup
- Works with 2FA

### Option 2: Outlook/Hotmail
- Free
- 300 emails/day limit
- Easy setup

### Option 3: Yahoo Mail
- Free
- Limited emails/day
- Requires app password

### Option 4: Custom SMTP
- Any email provider
- Unlimited (depends on provider)
- More complex setup

---

## Step-by-Step: Gmail Setup

### Step 1: Enable 2-Factor Authentication

**Why?** Gmail requires 2FA to generate app passwords.

1. Go to: https://myaccount.google.com/security
2. Click: **2-Step Verification**
3. Follow the steps to enable 2FA
4. Verify your phone number
5. Done! ✅

### Step 2: Generate App Password

**Why?** App passwords are more secure than your regular password.

1. Go to: https://myaccount.google.com/apppasswords
2. Select: **Mail**
3. Select: **Windows Computer** (or your device)
4. Click: **Generate**
5. Copy the 16-character password (looks like: `xxxx xxxx xxxx xxxx`)
6. Keep it safe!

### Step 3: Update `.env` File

Open `.env` and update:

```env
# Nodemailer Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
FROM_EMAIL=your-email@gmail.com
EMAIL_SERVICE_PROVIDER=nodemailer
```

**Replace:**
- `your-email@gmail.com` - Your Gmail address
- `xxxx xxxx xxxx xxxx` - Your 16-character app password

### Step 4: Restart Server

```bash
# Kill old server
Get-Process node | Stop-Process -Force

# Start new server
npm run server
```

### Step 5: Test

```bash
node test-newsletter.mjs
```

**Expected Output:**
```
✅ Test 6: Send Newsletter
   Recipients: 5
   Successful: 5 ✅

✅ Test 7: Send Direct Email
   Recipients: 2
   Successful: 2 ✅
```

---

## Step-by-Step: Outlook Setup

### Step 1: Update `.env` File

```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
FROM_EMAIL=your-email@outlook.com
EMAIL_SERVICE_PROVIDER=nodemailer
```

### Step 2: Restart Server

```bash
npm run server
```

### Step 3: Test

```bash
node test-newsletter.mjs
```

---

## Step-by-Step: Yahoo Mail Setup

### Step 1: Generate App Password

1. Go to: https://login.yahoo.com/account/security
2. Click: **Generate app password**
3. Select: **Mail**
4. Select: **Other App**
5. Enter: **Nodemailer**
6. Click: **Generate**
7. Copy the password

### Step 2: Update `.env` File

```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
FROM_EMAIL=your-email@yahoo.com
EMAIL_SERVICE_PROVIDER=nodemailer
```

### Step 3: Restart Server

```bash
npm run server
```

### Step 4: Test

```bash
node test-newsletter.mjs
```

---

## Current `.env` Configuration

```env
UNOSEND_API_KEY=un_42TXVcIqOrO9vUkimbRYpKxexLshwiYX
FROM_EMAIL=noreply@author.com

# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Nodemailer Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Choose which service to use: 'resend' or 'nodemailer'
EMAIL_SERVICE_PROVIDER=nodemailer
```

---

## Supported Email Services

### Gmail
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Outlook
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### Yahoo
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

### AOL
```env
EMAIL_SERVICE=aol
EMAIL_USER=your-email@aol.com
EMAIL_PASSWORD=your-password
```

### iCloud
```env
EMAIL_SERVICE=icloud
EMAIL_USER=your-email@icloud.com
EMAIL_PASSWORD=your-app-password
```

### Custom SMTP
```env
EMAIL_SERVICE=custom
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
```

---

## Troubleshooting

### "Invalid login"
**Problem:** Wrong email or password

**Solution:**
1. Check EMAIL_USER is correct
2. For Gmail: Use app password, not regular password
3. Make sure 2FA is enabled (Gmail)
4. Restart server

### "SMTP connection failed"
**Problem:** Can't connect to email server

**Solution:**
1. Check EMAIL_SERVICE is correct
2. Check internet connection
3. Try different email service
4. Restart server

### "Too many emails"
**Problem:** Hit daily limit

**Solution:**
- Gmail: 500 emails/day limit
- Outlook: 300 emails/day limit
- Wait 24 hours or use different account

### "Emails not sending"
**Problem:** Emails not being delivered

**Solution:**
1. Check server logs
2. Verify credentials
3. Check EMAIL_SERVICE_PROVIDER=nodemailer
4. Restart server

---

## Email Limits

| Service | Daily Limit | Notes |
|---------|------------|-------|
| Gmail | 500 | Free account |
| Outlook | 300 | Free account |
| Yahoo | 100 | Free account |
| Custom | Varies | Depends on provider |

---

## Security Tips

1. **Never share your app password**
2. **Use app passwords, not regular passwords**
3. **Keep `.env` file private**
4. **Don't commit `.env` to git**
5. **Regenerate password if compromised**

---

## Testing Your Setup

### Quick Test:
```bash
node test-newsletter.mjs
```

### What to Expect:
```
✅ Test 1: Health Check - PASS
✅ Test 2: Add Subscribers - PASS
✅ Test 3: Get Subscribers - PASS
✅ Test 4: Create Newsletter - PASS
✅ Test 5: Get Newsletters - PASS
✅ Test 6: Send Newsletter - PASS
   Recipients: 5
   Successful: 5 ✅
✅ Test 7: Send Direct Email - PASS
   Recipients: 2
   Successful: 2 ✅
✅ Test 8: Get Stats - PASS

📊 Success Rate: 100%
```

---

## Using Your Newsletter System

### 1. Create Newsletter
- Go to Admin Dashboard
- Click "Create Newsletter"
- Write content with rich editor
- Click "Create Newsletter"

### 2. Send Newsletter
- Click "Send" button
- Confirm in modal
- Emails sent via Nodemailer
- Each subscriber gets own email

### 3. Track Results
- View email logs
- Check subscriber stats
- Monitor newsletter status

---

## Features

### Nodemailer Supports:
✅ Send to multiple recipients  
✅ HTML and text emails  
✅ Attachments  
✅ Custom headers  
✅ Email logging  
✅ Error handling  
✅ Batch sending  

### Your Newsletter System:
✅ Rich text editor  
✅ Featured images  
✅ Language targeting  
✅ Newsletter templates  
✅ Subscriber management  
✅ Email tracking  

---

## Switching Email Services

### To Switch to Gmail:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_SERVICE_PROVIDER=nodemailer
```

### To Switch to Outlook:
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-outlook@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_SERVICE_PROVIDER=nodemailer
```

### To Switch to Resend:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_SERVICE_PROVIDER=resend
```

Just change `.env` and restart server!

---

## Resources

### Gmail
- App Passwords: https://support.google.com/accounts/answer/185833
- Security: https://myaccount.google.com/security

### Outlook
- Security: https://account.microsoft.com/security

### Yahoo
- App Passwords: https://login.yahoo.com/account/security

### Nodemailer
- Website: https://nodemailer.com
- Docs: https://nodemailer.com/about/

---

## Summary

| Step | Time | Status |
|------|------|--------|
| Enable 2FA (Gmail) | 5 min | ⏳ Your turn |
| Generate App Password | 2 min | ⏳ Your turn |
| Update `.env` | 1 min | ⏳ Your turn |
| Restart Server | 1 min | ⏳ Your turn |
| Test | 1 min | ⏳ Your turn |
| **Total** | **10 min** | ⏳ Your turn |

---

## Next Steps

1. **Enable 2FA on Gmail** (if using Gmail)
2. **Generate App Password**
3. **Update `.env` file**
4. **Restart server** (`npm run server`)
5. **Test** (`node test-newsletter.mjs`)
6. **Start sending newsletters!**

---

## You're Ready! 🚀

Your newsletter system is ready to send emails with Nodemailer!

Just follow the steps above and you'll be sending newsletters in 10 minutes!

**Questions?** Check the troubleshooting section or see the detailed setup guide.
