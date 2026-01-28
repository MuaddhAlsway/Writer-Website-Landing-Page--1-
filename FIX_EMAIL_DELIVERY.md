# Fix Email Delivery - Quick Guide

## Problem
Emails are not being delivered because the domain `author.com` is not verified in Unosend.

## Quick Fix Options

### Option 1: Use Resend (Easiest - Already Installed)
Resend is already in your `package.json`. Let's use it instead of Unosend.

**Step 1:** Get Resend API Key
1. Go to https://resend.com
2. Sign up (free)
3. Get your API key from dashboard

**Step 2:** Update `.env`
```env
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=noreply@yourdomain.com
```

**Step 3:** Update `server-db.mjs`
Replace the `sendEmailViaUnosend` function with:

```javascript
// Send email via Resend
async function sendEmailViaResend(to, subject, html) {
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: to,
      subject: subject,
      html: html,
    });

    if (data.error) {
      throw new Error(data.error.message);
    }

    return { success: true, id: data.data.id };
  } catch (err) {
    console.error(`Error sending to ${to}:`, err.message);
    throw err;
  }
}
```

Then replace all `sendEmailViaUnosend` calls with `sendEmailViaResend`.

---

### Option 2: Verify Domain in Unosend (Current Setup)

**Step 1:** Go to Unosend Dashboard
- Visit https://www.unosend.co
- Log in to your account

**Step 2:** Add Domain
1. Go to Settings → Domains
2. Click "Add Domain"
3. Enter `author.com`
4. Follow verification steps (usually DNS records)

**Step 3:** Wait for Verification
- Unosend will verify your domain
- Once verified, emails will send automatically

**Step 4:** Restart Server
```bash
npm run server
```

---

### Option 3: Use Gmail (Simplest for Testing)

**Step 1:** Update `.env`
```env
FROM_EMAIL=your-email@gmail.com
```

**Step 2:** Update `server-db.mjs`
Replace `sendEmailViaUnosend` with:

```javascript
import nodemailer from 'nodemailer';

// Send email via Gmail
async function sendEmailViaGmail(to, subject, html) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD, // Use App Password, not regular password
      },
    });

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: to,
      subject: subject,
      html: html,
    });

    return { success: true, id: info.messageId };
  } catch (err) {
    console.error(`Error sending to ${to}:`, err.message);
    throw err;
  }
}
```

**Step 3:** Update `.env`
```env
FROM_EMAIL=your-email@gmail.com
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your_app_password_here
```

**Step 4:** Get Gmail App Password
1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Go to App Passwords
4. Generate password for "Mail" and "Windows Computer"
5. Use that password in `.env`

---

## Recommended: Option 1 (Resend)

Resend is the easiest and most reliable:
- ✅ Free tier (100 emails/day)
- ✅ Already installed in your project
- ✅ No domain verification needed initially
- ✅ Great documentation
- ✅ Easy to scale

---

## Test After Fix

Run the test again:
```bash
node test-newsletter.mjs
```

You should see:
```
✅ Newsletter sent successfully!
   Recipients: 5
   Successful: 5  ← This should be 5, not 0
```

---

## Need Help?

1. **Resend Docs:** https://resend.com/docs
2. **Unosend Docs:** https://www.unosend.co/docs
3. **Gmail App Passwords:** https://support.google.com/accounts/answer/185833

Choose one option and let me know if you need help implementing it!
