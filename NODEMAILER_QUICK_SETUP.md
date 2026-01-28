# Nodemailer - Quick Setup (10 minutes)

## Choose Your Email Service

### Gmail (Recommended)
- Free
- 500 emails/day
- Easy setup
- ⭐⭐⭐⭐⭐

### Outlook
- Free
- 300 emails/day
- Easy setup
- ⭐⭐⭐⭐

### Yahoo
- Free
- Limited emails/day
- Requires app password
- ⭐⭐⭐

---

## Gmail Setup (5 steps)

### Step 1: Enable 2FA
```
Go to: https://myaccount.google.com/security
Click: 2-Step Verification
Follow: Steps to enable
Done! ✅
```

### Step 2: Get App Password
```
Go to: https://myaccount.google.com/apppasswords
Select: Mail
Select: Windows Computer
Click: Generate
Copy: 16-character password
```

### Step 3: Update `.env`
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
FROM_EMAIL=your-email@gmail.com
EMAIL_SERVICE_PROVIDER=nodemailer
```

### Step 4: Restart Server
```bash
npm run server
```

### Step 5: Test
```bash
node test-newsletter.mjs
```

---

## Expected Result

```
✅ Newsletter sent successfully!
   Recipients: 5
   Successful: 5 ✅

✅ Direct email sent successfully!
   Recipients: 2
   Successful: 2 ✅

📊 Success Rate: 100%
```

---

## What to Replace

### In `.env` file:

```env
# BEFORE:
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# AFTER:
EMAIL_USER=john@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

---

## Troubleshooting

### "Invalid login"
- Check email address
- Use app password (not regular password)
- Enable 2FA on Gmail

### "SMTP connection failed"
- Check internet connection
- Verify EMAIL_SERVICE=gmail
- Restart server

### "Too many emails"
- Gmail limit: 500/day
- Wait 24 hours
- Use different account

---

## Other Email Services

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

### iCloud
```env
EMAIL_SERVICE=icloud
EMAIL_USER=your-email@icloud.com
EMAIL_PASSWORD=your-app-password
```

---

## Your Newsletter System

```
Admin Dashboard
    ↓
Create Newsletter (Rich Editor)
    ↓
Send to Subscribers
    ↓
Nodemailer (Gmail/Outlook/Yahoo)
    ↓
Subscriber Inboxes
```

---

## Features

✅ Send to multiple subscribers  
✅ HTML and text emails  
✅ Email logging  
✅ Error handling  
✅ Batch sending  
✅ Attachments  
✅ Custom headers  

---

## Timeline

```
Enable 2FA:        5 min
Get App Password:  2 min
Update .env:       1 min
Restart Server:    1 min
Test:              1 min
─────────────────────────
Total:            10 min ✅
```

---

## Next Steps

1. ✅ Enable 2FA on Gmail
2. ✅ Generate app password
3. ✅ Update `.env` file
4. ✅ Restart server
5. ✅ Test
6. ✅ Start sending!

---

## Resources

- Gmail App Passwords: https://support.google.com/accounts/answer/185833
- Nodemailer: https://nodemailer.com

---

## You're Ready! 🚀

Follow the 5 steps above and you'll be sending newsletters in 10 minutes!

See `NODEMAILER_SETUP_GUIDE.md` for detailed instructions.
