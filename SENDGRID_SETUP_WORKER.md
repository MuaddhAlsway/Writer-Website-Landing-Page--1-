# SendGrid Setup for Cloudflare Workers

## Quick Setup (5 minutes)

### Step 1: Create Free SendGrid Account
1. Go to https://sendgrid.com/free
2. Sign up with your email
3. Verify your email

### Step 2: Get API Key
1. Log in to SendGrid dashboard
2. Go to Settings → API Keys
3. Click "Create API Key"
4. Name it "Cloudflare Worker"
5. Select "Full Access"
6. Copy the API key

### Step 3: Add to wrangler.toml
```toml
[vars]
SENDGRID_API_KEY = "SG.your_api_key_here"
EMAIL_FROM = "noreply@yourdomain.com"
```

### Step 4: Deploy
```bash
npm run build
npm run deploy:pages
```

### Step 5: Test
1. Go to https://main.author-fatima-76r-339.pages.dev
2. Log in with admin@authorfatima.com
3. Go to "إرسال بريد" (Send Email)
4. Select recipients
5. Send email
6. Check inbox - email should arrive!

## Alternative: Use Mailgun

If you prefer Mailgun:

1. Sign up at https://www.mailgun.com
2. Get API key from dashboard
3. Add to wrangler.toml:
```toml
MAILGUN_API_KEY = "key-your_key_here"
MAILGUN_DOMAIN = "mg.yourdomain.com"
```

## Why SendGrid/Mailgun?

- ✅ Works with Cloudflare Workers
- ✅ Free tier available
- ✅ Simple HTTP API
- ✅ No Node.js required
- ✅ Reliable delivery

## Status

After adding API key and deploying:
- ✅ Emails will be sent via SendGrid/Mailgun
- ✅ Works from Cloudflare Pages
- ✅ No backend server needed
