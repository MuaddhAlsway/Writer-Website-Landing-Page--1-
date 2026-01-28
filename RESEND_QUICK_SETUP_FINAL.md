# Resend Setup - Quick Start (5 minutes)

## What is Resend?

Resend is a modern email API service built for developers. It's the easiest way to send emails from your application.

---

## 5-Step Setup

### Step 1: Sign Up (2 minutes)

```
1. Go to: https://resend.com
2. Click: Sign Up
3. Enter: Your email
4. Verify: Check your email
5. Done! ✅
```

### Step 2: Get API Key (1 minute)

```
1. Log in to: https://app.resend.com
2. Click: API Keys (left menu)
3. Copy: Your API key
4. Looks like: re_xxxxxxxxxxxxxxxxxxxxx
5. Keep it safe!
```

### Step 3: Update `.env` (1 minute)

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=onboarding@resend.dev
EMAIL_SERVICE_PROVIDER=resend
```

**Replace:**
- `re_xxxxxxxxxxxxxxxxxxxxx` - Your actual API key

### Step 4: Restart Server (1 minute)

```bash
# Kill old server
Get-Process node | Stop-Process -Force

# Start new server
npm run server
```

### Step 5: Test (1 minute)

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

## Your `.env` File

### Before:
```env
EMAIL_SERVICE_PROVIDER=nodemailer
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### After:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=onboarding@resend.dev
EMAIL_SERVICE_PROVIDER=resend
```

---

## What to Replace

```
re_xxxxxxxxxxxxxxxxxxxxx  →  Your actual Resend API key
```

---

## Features

✅ 100 emails/day free  
✅ No domain verification needed  
✅ Analytics (opens, clicks)  
✅ Webhooks  
✅ React email support  
✅ 99.9% uptime  
✅ Excellent documentation  

---

## Timeline

```
Sign Up:        2 min
Get API Key:    1 min
Update .env:    1 min
Restart Server: 1 min
Test:           1 min
─────────────────────
Total:          5 min ✅
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
Resend API
    ↓
Subscriber Inboxes
```

---

## Next Steps

1. ✅ Go to https://resend.com
2. ✅ Sign up (free)
3. ✅ Get API key
4. ✅ Update `.env` file
5. ✅ Restart server
6. ✅ Test
7. ✅ Start sending newsletters!

---

## Resources

- Resend Website: https://resend.com
- Resend Docs: https://resend.com/docs
- Resend Dashboard: https://app.resend.com

---

## You're Ready! 🚀

Follow the 5 steps above and you'll be sending newsletters in 5 minutes!

See `RESEND_SETUP_DETAILED.md` for more information.
