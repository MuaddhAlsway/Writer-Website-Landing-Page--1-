# Cloudflare Pages - Gmail Setup

## The Issue

On Cloudflare Pages, the newsletter shows "0 recipients" because:
- Cloudflare can't call localhost backend
- Gmail credentials aren't set in Cloudflare

## The Fix

Add Gmail credentials to Cloudflare Pages secrets.

## Setup Steps

### Step 1: Add Gmail Credentials to Cloudflare

Run these commands:

```bash
wrangler pages secret put EMAIL_USER
```
Paste: `AuthorFSK@gmail.com`

```bash
wrangler pages secret put EMAIL_PASSWORD
```
Paste: `peed qvhs ekmo kisv`

```bash
wrangler pages secret put EMAIL_FROM
```
Paste: `AuthorFSK@gmail.com`

### Step 2: Verify Secrets Are Set

```bash
wrangler pages secret list
```

You should see:
```
EMAIL_USER
EMAIL_PASSWORD
EMAIL_FROM
```

### Step 3: Deploy

```bash
npm run build
wrangler pages deploy dist
```

Or just push to GitHub and Cloudflare will auto-deploy.

### Step 4: Test

1. Go to your Cloudflare Pages URL
2. Go to Admin Dashboard
3. Create a newsletter
4. Send it
5. Check your email inbox

## How It Works

```
Admin sends newsletter on Cloudflare Pages
    ↓
Cloudflare function fetches subscribers from Turso
    ↓
Cloudflare function sends emails via Gmail API
    ↓
Emails arrive in subscriber inboxes
```

## Troubleshooting

### Still showing 0 recipients?

**Check 1: Secrets set?**
```bash
wrangler pages secret list
```

Should show EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM

**Check 2: Deployed?**
- Make sure you deployed after adding secrets
- Secrets only work after deployment

**Check 3: Subscribers in database?**
- Check dashboard stats
- Should show subscriber count > 0

### No emails received?

**Check 1: Check Cloudflare logs**
- Cloudflare Pages → Functions → Logs
- Look for "Email sent to" messages
- Look for errors

**Check 2: Check Gmail account**
- Go to Gmail
- Check "Sent" folder
- Verify emails were sent

**Check 3: Check spam folder**
- Emails might be in spam
- Mark as "Not Spam"

## That's It!

Your newsletter system is now sending real emails via Gmail on Cloudflare Pages.

No backend server needed!
No Resend needed!
No Railway needed!

Just Gmail API with app password.
