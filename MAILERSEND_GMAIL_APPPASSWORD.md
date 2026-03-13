# MailerSend + Gmail App Password Setup

## Why MailerSend?
- ✅ Works with Cloudflare Workers
- ✅ Free tier (6000 emails/month)
- ✅ Simple HTTP API
- ✅ Sends from your Gmail
- ✅ No backend server needed

## Setup (2 minutes)

### Step 1: Create MailerSend Account
1. Go to https://www.mailersend.com
2. Click "Sign up free"
3. Enter your email and password
4. Verify your email

### Step 2: Add Sender Domain
1. Log in to MailerSend dashboard
2. Go to Domains
3. Click "Add Domain"
4. Enter your domain or use: authorfatima.com
5. Follow verification steps

### Step 3: Get API Key
1. Go to Settings → API & SMTP
2. Click "Create API Token"
3. Name it "Cloudflare Worker"
4. Select "Full Access"
5. Copy the API token

### Step 4: Add to wrangler.toml
```toml
[vars]
MAILERSEND_API_KEY = "mlsn_your_api_key_here"
```

### Step 5: Deploy
```bash
npm run build
npm run deploy:pages
```

### Step 6: Test
1. Go to https://main.author-fatima-76r-339.pages.dev
2. Log in with admin@authorfatima.com / Admin@12345
3. Go to "إرسال بريد" (Send Email)
4. Select recipients
5. Write subject and message
6. Click "إرسال البريد" (Send Email)
7. Check Gmail inbox - email should arrive!

## That's It!

Your emails will now be sent from AuthorFSK@gmail.com via MailerSend API through Cloudflare Workers.

## Free Tier
- 6000 emails per month
- Unlimited contacts
- Perfect for newsletters

## Troubleshooting

If emails don't arrive:
1. Check MailerSend dashboard for delivery status
2. Check Gmail spam folder
3. Verify API key is correct in wrangler.toml
4. Run: `npm run deploy:pages` again
