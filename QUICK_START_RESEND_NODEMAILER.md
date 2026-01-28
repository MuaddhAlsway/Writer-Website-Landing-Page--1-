# Quick Start - Resend & Nodemailer Integration

## ✅ Integration Complete!

Your newsletter system now supports **both Resend and Nodemailer**!

---

## Current Status

```
✅ Resend integration: Complete
✅ Nodemailer integration: Complete
✅ Automatic service selection: Working
⚠️  API key needed: Not configured yet
```

---

## What You Need to Do

### Option 1: Use Resend (Recommended - 5 minutes)

#### Step 1: Get Resend API Key
```
1. Go to: https://resend.com
2. Click: Sign Up
3. Enter your email
4. Verify email
5. Go to: API Keys
6. Copy your key (looks like: re_xxxxxxxxxxxxx)
```

#### Step 2: Update `.env` File
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

**Expected Result:**
```
✅ Test 6: Send Newsletter
   Recipients: 5
   Successful: 5 ✅
```

---

### Option 2: Use Nodemailer + Gmail (10 minutes)

#### Step 1: Enable Gmail 2FA
```
1. Go to: https://myaccount.google.com/security
2. Click: 2-Step Verification
3. Follow the steps
```

#### Step 2: Generate App Password
```
1. Go to: https://myaccount.google.com/apppasswords
2. Select: Mail
3. Select: Windows Computer
4. Click: Generate
5. Copy the 16-character password
```

#### Step 3: Update `.env` File
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
FROM_EMAIL=your-email@gmail.com
EMAIL_SERVICE_PROVIDER=nodemailer
```

#### Step 4: Restart Server
```bash
npm run server
```

#### Step 5: Test
```bash
node test-newsletter.mjs
```

**Expected Result:**
```
✅ Test 6: Send Newsletter
   Recipients: 5
   Successful: 5 ✅
```

---

## Current `.env` Configuration

```env
UNOSEND_API_KEY=un_42TXVcIqOrO9vUkimbRYpKxexLshwiYX
FROM_EMAIL=noreply@author.com

# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx  ← REPLACE THIS

# Nodemailer Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com  ← REPLACE THIS
EMAIL_PASSWORD=your-app-password  ← REPLACE THIS

# Choose which service to use: 'resend' or 'nodemailer'
EMAIL_SERVICE_PROVIDER=resend  ← CHANGE TO 'nodemailer' IF USING GMAIL
```

---

## How to Update `.env`

### Using Text Editor:
1. Open `.env` file in your editor
2. Replace placeholder values with your actual values
3. Save the file
4. Restart server

### Example - Resend:
```env
# Before:
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# After:
RESEND_API_KEY=re_abc123def456ghi789jkl
```

### Example - Gmail:
```env
# Before:
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# After:
EMAIL_USER=john@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

---

## Switching Between Services

### To Use Resend:
```env
EMAIL_SERVICE_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

### To Use Nodemailer:
```env
EMAIL_SERVICE_PROVIDER=nodemailer
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## Testing

### Run Test:
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

## Troubleshooting

### "API key is invalid"
```
Solution: 
1. Check RESEND_API_KEY in .env
2. Make sure it starts with 're_'
3. Copy from Resend dashboard again
4. Restart server
```

### "Invalid login" (Gmail)
```
Solution:
1. Make sure 2FA is enabled
2. Use app password, not regular password
3. Check EMAIL_USER and EMAIL_PASSWORD
4. Restart server
```

### "Emails not sending"
```
Solution:
1. Check server logs
2. Verify API key or credentials
3. Check EMAIL_SERVICE_PROVIDER setting
4. Restart server
```

---

## Features

### Both Services Support:
✅ Send to multiple subscribers  
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
✅ Free (uses your email account)  

---

## Your Newsletter System

```
Newsletter Admin
    ↓
Create Newsletter (Rich Editor)
    ↓
Send to Subscribers
    ↓
Resend or Nodemailer (Your choice!)
    ↓
Subscriber Inboxes
```

---

## Next Steps

### 1. Choose Your Service
- **Resend** - Modern, analytics, easiest
- **Nodemailer** - Free, uses Gmail/Outlook

### 2. Get Credentials
- **Resend** - Get API key from https://resend.com
- **Nodemailer** - Get app password from Gmail

### 3. Update `.env`
- Replace placeholder values with your credentials

### 4. Restart Server
```bash
npm run server
```

### 5. Test
```bash
node test-newsletter.mjs
```

### 6. Start Sending!
- Go to Admin Dashboard
- Create newsletter
- Send to subscribers

---

## Resources

### Resend
- Website: https://resend.com
- Docs: https://resend.com/docs
- Dashboard: https://app.resend.com

### Nodemailer
- Website: https://nodemailer.com
- Gmail App Passwords: https://support.google.com/accounts/answer/185833

---

## Summary

| Step | Time | Status |
|------|------|--------|
| Integration | Done | ✅ |
| Configuration | 5-10 min | ⏳ Your turn |
| Testing | 1 min | ⏳ Your turn |
| Sending | Ready | ✅ |

**Your newsletter system is ready! Just add your credentials and start sending! 🚀**

---

## Questions?

See `NODEMAILER_RESEND_SETUP.md` for detailed setup instructions.
