# Resend - Quick Start Guide

## 30-Second Overview

**Resend** = Email API for developers  
**What it does** = Sends emails reliably  
**Setup time** = 5 minutes  
**Cost** = Free (100 emails/day) or $20/month  

---

## Why Choose Resend?

### ✅ Pros
- **Fastest setup** - No domain verification needed
- **Free tier** - 100 emails/day (perfect for testing)
- **Developer friendly** - Simple API, great docs
- **React support** - Write emails in JSX
- **Analytics** - See who opens/clicks emails
- **Reliable** - 99.9% uptime

### ❌ Cons
- **Newer** - Less established than competitors
- **Limited free tier** - 100/day (vs MailerSend's 100/month)
- **API only** - No SMTP support

---

## Quick Comparison

```
┌─────────────┬──────────┬────────────┬──────────┐
│ Feature     │ Resend   │ MailerSend │ Formspree│
├─────────────┼──────────┼────────────┼──────────┤
│ Setup Time  │ 5 min    │ 30 min     │ 2 min    │
│ Free Tier   │ 100/day  │ 100/month  │ 50/month │
│ Domain Req  │ No       │ Yes        │ No       │
│ Analytics   │ Yes      │ Yes        │ No       │
│ React Email │ Yes      │ No         │ No       │
│ Best For    │ Devs     │ Business   │ Forms    │
└─────────────┴──────────┴────────────┴──────────┘
```

---

## How to Get Started

### Step 1: Sign Up (Free)
```
Go to: https://resend.com
Click: Sign Up
Enter: Your email
Done! ✅
```

### Step 2: Get API Key
```
1. Log in to dashboard
2. Go to: API Keys
3. Copy your key (looks like: re_xxxxx...)
4. Keep it secret!
```

### Step 3: Add to Your Project
```bash
npm install resend
```

### Step 4: Create `.env` File
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

### Step 5: Send Your First Email
```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'your-email@example.com',
  subject: 'Hello World',
  html: '<h1>It works!</h1>',
});
```

---

## Real Example: Newsletter

```javascript
// Send newsletter to all subscribers
async function sendNewsletter(subscribers, subject, content) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  for (const subscriber of subscribers) {
    await resend.emails.send({
      from: 'newsletter@yourdomain.com',
      to: subscriber.email,
      subject: subject,
      html: content,
    });
  }
}
```

---

## Resend vs Others

### Resend
```
✅ Easiest to set up
✅ No domain verification
✅ Great for developers
✅ React email support
✅ Good free tier
```

### MailerSend
```
✅ More features
✅ Better for business
❌ Domain verification required
❌ Longer setup
```

### Formspree
```
✅ Simplest
✅ No setup
❌ Limited features
❌ No analytics
```

---

## Pricing Breakdown

### Resend
- **Free:** 100 emails/day
- **Starter:** $20/month (3,000 emails/month)
- **Pro:** $75/month (10,000 emails/month)

### MailerSend
- **Free:** 100 emails/month
- **Starter:** $25/month (1,000 emails/month)
- **Pro:** $100/month (10,000 emails/month)

### Formspree
- **Free:** 50 submissions/month
- **Paid:** $25/month (unlimited)

---

## Key Features Explained

### 1. Email Sending
Send emails from your app with one line of code.

### 2. Analytics
- **Open Rate** - % of people who opened email
- **Click Rate** - % of people who clicked links
- **Bounce Rate** - % of failed deliveries

### 3. Webhooks
Get real-time notifications when:
- Email is delivered
- Email is opened
- Link is clicked
- Email bounces

### 4. React Email
Write emails like React components:
```javascript
export const Email = () => (
  <Html>
    <Body>
      <h1>Hello!</h1>
      <p>Welcome to our newsletter</p>
    </Body>
  </Html>
);
```

### 5. Custom Domain
Add your domain for professional emails:
- `newsletter@yourdomain.com` instead of `onboarding@resend.dev`

---

## Common Questions

### Q: Is it free?
**A:** Yes! 100 emails/day free. Paid plans start at $20/month.

### Q: Do I need to verify my domain?
**A:** No! You can start sending immediately with `onboarding@resend.dev`. Add your domain later for production.

### Q: How reliable is it?
**A:** 99.9% uptime. Emails are delivered reliably.

### Q: Can I track opens/clicks?
**A:** Yes! Full analytics dashboard included.

### Q: How do I send to multiple people?
**A:** Loop through subscribers and send individual emails (best practice for newsletters).

### Q: Can I use it for newsletters?
**A:** Yes! Perfect for newsletters, transactional emails, and more.

### Q: Is it better than MailerSend?
**A:** Different strengths. Resend is easier to set up, MailerSend has more features.

---

## Resend Dashboard

### What You Can Do:
- ✅ Send test emails
- ✅ View delivery status
- ✅ Check analytics (opens, clicks)
- ✅ Monitor bounces
- ✅ Set up webhooks
- ✅ Add custom domain
- ✅ Manage API keys

---

## Integration with Your Newsletter

Your newsletter system can use Resend with minimal changes:

### Current Setup:
```
Newsletter System → MailerSend → Email Delivered
```

### With Resend:
```
Newsletter System → Resend → Email Delivered
```

**Same result, easier setup!**

---

## Next Steps

### Option 1: Try Resend Now
1. Go to https://resend.com
2. Sign up (free)
3. Get API key
4. I can update your system to use it

### Option 2: Stick with MailerSend
1. Verify your domain
2. Update `.env`
3. Restart server
4. Start sending

### Option 3: Use Formspree
1. Already configured
2. Works but limited features
3. Good for simple forms

---

## My Recommendation

**For your newsletter system, I recommend:**

### Best Choice: **Resend**
- ✅ Easiest setup (5 minutes)
- ✅ No domain verification needed
- ✅ Perfect for testing
- ✅ Great for production
- ✅ Already installed in your project

### Second Choice: **MailerSend**
- ✅ More features
- ✅ Good for business
- ❌ Requires domain verification

### Third Choice: **Formspree**
- ✅ Already working
- ❌ Limited features
- ❌ No analytics

---

## Want to Switch to Resend?

I can update your newsletter system to use Resend in 5 minutes:

1. ✅ Install Resend (already done)
2. ✅ Update server code
3. ✅ Test the system
4. ✅ Start sending newsletters

**Just say the word!**

---

## Resources

- **Resend Website:** https://resend.com
- **Resend Docs:** https://resend.com/docs
- **Resend Dashboard:** https://app.resend.com
- **React Email:** https://react.email

---

## Summary

| Aspect | Resend |
|--------|--------|
| **What is it?** | Email API for developers |
| **Setup time** | 5 minutes |
| **Cost** | Free (100/day) or $20/month |
| **Best for** | Newsletters, transactional emails |
| **Ease of use** | Very easy |
| **Reliability** | 99.9% uptime |
| **Analytics** | Yes |
| **Recommendation** | ⭐⭐⭐⭐⭐ |

**Resend is the easiest way to send emails from your newsletter system!**
