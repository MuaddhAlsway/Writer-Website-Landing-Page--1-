# Nodemailer & Resend Integration - Complete Setup Guide

## Overview

Your newsletter system now supports **both Nodemailer and Resend** for email delivery!

- **Resend** - Modern API service (recommended)
- **Nodemailer** - Traditional SMTP service (Gmail, Outlook, etc.)

Choose which one to use by setting `EMAIL_SERVICE_PROVIDER` in `.env`

---

## Quick Setup

### Option 1: Use Resend (Recommended - 5 minutes)

#### Step 1: Get Resend API Key
```
1. Go to https://resend.com
2. Sign up (free)
3. Get API key from dashboard
4. Copy key (looks like: re_xxxxx...)
```

#### Step 2: Update `.env`
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=onboarding@resend.dev
EMAIL_SERVICE_PROVIDER=resend
```

#### Step 3: Restart Server
```bash
npm run server
```

#### Step 4: Test
```bash
node test-newsletter.mjs
```

---

### Option 2: Use Nodemailer with Gmail (10 minutes)

#### Step 1: Enable Gmail App Password
```
1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication (if not already)
3. Go to App Passwords
4. Select "Mail" and "Windows Computer"
5. Generate password
6. Copy the 16-character password
```

#### Step 2: Update `.env`
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
FROM_EMAIL=your-email@gmail.com
EMAIL_SERVICE_PROVIDER=nodemailer
```

#### Step 3: Restart Server
```bash
npm run server
```

#### Step 4: Test
```bash
node test-newsletter.mjs
```

---

## Configuration Options

### Resend Configuration
```env
# Required
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Optional (defaults to onboarding@resend.dev)
FROM_EMAIL=newsletter@yourdomain.com

# Set as primary service
EMAIL_SERVICE_PROVIDER=resend
```

### Nodemailer Configuration

#### Gmail
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FROM_EMAIL=your-email@gmail.com
EMAIL_SERVICE_PROVIDER=nodemailer
```

#### Outlook
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
FROM_EMAIL=your-email@outlook.com
EMAIL_SERVICE_PROVIDER=nodemailer
```

#### Custom SMTP
```env
EMAIL_SERVICE=custom
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
FROM_EMAIL=your-email@example.com
EMAIL_SERVICE_PROVIDER=nodemailer
```

#### Yahoo
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-password
FROM_EMAIL=your-email@yahoo.com
EMAIL_SERVICE_PROVIDER=nodemailer
```

---

## How It Works

### Email Flow:
```
Newsletter System
    ↓
sendEmail() function
    ↓
Check EMAIL_SERVICE_PROVIDER
    ↓
    ├─ If 'resend' → Use Resend API
    │
    └─ If 'nodemailer' → Use Nodemailer SMTP
    ↓
Email Delivered
```

### Code:
```javascript
// Automatically chooses service based on .env
async function sendEmail(to, subject, html) {
  const emailService = process.env.EMAIL_SERVICE_PROVIDER || 'resend';
  
  if (emailService === 'nodemailer') {
    return await sendEmailViaNodemailer(to, subject, html);
  } else {
    return await sendEmailViaResend(to, subject, html);
  }
}
```

---

## Comparison: Resend vs Nodemailer

| Feature | Resend | Nodemailer |
|---------|--------|-----------|
| **Setup Time** | 5 min | 10 min |
| **Domain Verification** | No | No |
| **Free Tier** | 100/day | Unlimited* |
| **Reliability** | 99.9% | Depends on provider |
| **Analytics** | Yes | No |
| **Webhooks** | Yes | No |
| **Best For** | Newsletters | Transactional emails |
| **Recommendation** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

*Nodemailer uses your email provider's limits (Gmail: 500/day, Outlook: 300/day, etc.)

---

## Step-by-Step: Resend Setup

### 1. Sign Up
```
Go to: https://resend.com
Click: Sign Up
Enter: Your email
Verify: Check your email
```

### 2. Get API Key
```
1. Log in to https://app.resend.com
2. Click: API Keys (left menu)
3. Copy your key
4. Keep it secret!
```

### 3. Update `.env`
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=onboarding@resend.dev
EMAIL_SERVICE_PROVIDER=resend
```

### 4. Restart Server
```bash
# Kill old server
Get-Process node | Stop-Process -Force

# Start new server
npm run server
```

### 5. Test
```bash
node test-newsletter.mjs
```

### Expected Output:
```
✅ Test 6: Send Newsletter
   Recipients: 5
   Successful: 5 ✅

✅ Test 7: Send Direct Email
   Recipients: 2
   Successful: 2 ✅
```

---

## Step-by-Step: Nodemailer + Gmail Setup

### 1. Enable 2FA on Gmail
```
1. Go to: https://myaccount.google.com/security
2. Click: 2-Step Verification
3. Follow the steps
4. Done!
```

### 2. Generate App Password
```
1. Go to: https://myaccount.google.com/apppasswords
2. Select: Mail
3. Select: Windows Computer
4. Click: Generate
5. Copy the 16-character password
```

### 3. Update `.env`
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
FROM_EMAIL=your-email@gmail.com
EMAIL_SERVICE_PROVIDER=nodemailer
```

### 4. Restart Server
```bash
npm run server
```

### 5. Test
```bash
node test-newsletter.mjs
```

---

## Troubleshooting

### Resend Issues

#### "API key not found"
```
Solution: Check RESEND_API_KEY in .env
```

#### "Invalid API key"
```
Solution: Copy API key again from Resend dashboard
```

#### "Emails not sending"
```
Solution: Check server logs for errors
```

### Nodemailer Issues

#### "Invalid login"
```
Solution: Check EMAIL_USER and EMAIL_PASSWORD
For Gmail: Use app password, not regular password
```

#### "SMTP connection failed"
```
Solution: Check EMAIL_SERVICE and EMAIL_HOST
Make sure 2FA is enabled for Gmail
```

#### "Too many emails"
```
Solution: Gmail limit is 500/day
Wait 24 hours or use different account
```

---

## Switching Between Services

### From Resend to Nodemailer:
```env
# Change this line:
EMAIL_SERVICE_PROVIDER=nodemailer

# Add Nodemailer config:
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### From Nodemailer to Resend:
```env
# Change this line:
EMAIL_SERVICE_PROVIDER=resend

# Add Resend config:
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

---

## Current Configuration

### Your `.env` File:
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
EMAIL_SERVICE_PROVIDER=resend
```

---

## Testing

### Run Full Test:
```bash
node test-newsletter.mjs
```

### Expected Results:
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

## Features

### Both Services Support:
✅ Send to multiple recipients  
✅ HTML and text emails  
✅ Custom subject lines  
✅ Email logging  
✅ Error handling  
✅ Batch sending  

### Resend Only:
✅ Analytics (opens, clicks)  
✅ Webhooks  
✅ React email support  
✅ Custom domain  

### Nodemailer Only:
✅ SMTP support  
✅ Attachments  
✅ Multiple email providers  
✅ Custom SMTP servers  

---

## Recommendations

### Use Resend If:
✅ You want analytics  
✅ You want webhooks  
✅ You want easiest setup  
✅ You want modern platform  
✅ You want React email support  

### Use Nodemailer If:
✅ You already have Gmail/Outlook  
✅ You want free unlimited emails*  
✅ You need SMTP support  
✅ You need attachments  
✅ You want to use existing email account  

*Subject to provider limits

---

## Your Newsletter System Now

```
┌─────────────────────────────────────┐
│   Newsletter Admin Dashboard        │
├─────────────────────────────────────┤
│ • Create Newsletter (Rich Editor)   │
│ • Send to All Subscribers           │
│ • Track Email Status                │
│ • View Analytics (Resend only)      │
│ • Manage Subscribers                │
└─────────────────────────────────────┘
           ↓
    ┌──────────────────┐
    │ Resend or        │
    │ Nodemailer       │
    │ (Your choice!)   │
    └──────────────────┘
           ↓
    ┌──────────────────┐
    │  Subscribers     │
    │   Inboxes        │
    └──────────────────┘
```

---

## Next Steps

### Option 1: Use Resend (Recommended)
1. Go to https://resend.com
2. Sign up (free)
3. Get API key
4. Update `.env`
5. Restart server
6. Test with `node test-newsletter.mjs`

### Option 2: Use Nodemailer + Gmail
1. Enable 2FA on Gmail
2. Generate app password
3. Update `.env`
4. Restart server
5. Test with `node test-newsletter.mjs`

### Option 3: Use Both (Switch as needed)
1. Set up both services
2. Change `EMAIL_SERVICE_PROVIDER` to switch
3. Restart server
4. Test

---

## Resources

### Resend
- Website: https://resend.com
- Docs: https://resend.com/docs
- Dashboard: https://app.resend.com

### Nodemailer
- Website: https://nodemailer.com
- Docs: https://nodemailer.com/about/
- Gmail App Passwords: https://support.google.com/accounts/answer/185833

---

## Summary

| Aspect | Status |
|--------|--------|
| **Resend Integration** | ✅ Complete |
| **Nodemailer Integration** | ✅ Complete |
| **Automatic Service Selection** | ✅ Working |
| **Newsletter System** | ✅ Ready |
| **Testing** | ✅ Ready |

**Your newsletter system is now ready to send emails with either Resend or Nodemailer!**

Choose your preferred service and start sending newsletters today! 🚀
