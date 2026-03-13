# Brevo + Gmail Setup for Cloudflare Workers

## Why Brevo?
- ✅ Free tier (300 emails/day)
- ✅ Works with Cloudflare Workers
- ✅ Simple HTTP API
- ✅ Sends from your Gmail account
- ✅ No backend server needed

## Setup (3 minutes)

### Step 1: Create Brevo Account
1. Go to https://www.brevo.com
2. Click "Sign up free"
3. Enter your email and password
4. Verify your email

### Step 2: Connect Gmail
1. Log in to Brevo dashboard
2. Go to Settings → Senders & Domains
3. Click "Add a sender"
4. Enter your Gmail address: AuthorFSK@gmail.com
5. Verify the email (check your Gmail inbox)

### Step 3: Get API Key
1. Go to Settings → SMTP & API
2. Click "API Keys" tab
3. Click "Create a new API key"
4. Name it "Cloudflare Worker"
5. Copy the API key

### Step 4: Add to wrangler.toml
```toml
[vars]
BREVO_API_KEY = "xkeysib-your_api_key_here"
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

Your emails will now be sent from AuthorFSK@gmail.com via Brevo API through Cloudflare Workers.

## Troubleshooting

If emails don't arrive:
1. Check Brevo dashboard for delivery status
2. Check Gmail spam folder
3. Verify API key is correct in wrangler.toml
4. Run: `npm run deploy:pages` again

## Free Tier Limits
- 300 emails per day
- Unlimited contacts
- Unlimited campaigns

Perfect for testing and small newsletters!
