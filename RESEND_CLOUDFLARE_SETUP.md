# Setting Up Resend for Email Sending on Cloudflare Pages

## Step 1: Get Resend API Key

1. Go to https://resend.com
2. Sign up (free account)
3. Go to Dashboard → API Keys
4. Copy your API key (looks like: `re_xxxxxxxxxxxxxxxxxxxxx`)

## Step 2: Add Resend API Key to Cloudflare Pages

Run this command in your terminal:

```bash
wrangler pages secret put RESEND_API_KEY
```

When prompted, paste your Resend API key:
```
re_xxxxxxxxxxxxxxxxxxxxx
```

## Step 3: Verify Setup

The newsletter sending is now configured to:
1. Fetch all subscribers from Turso database
2. Send emails via Resend API
3. Support both English and Arabic emails
4. Update newsletter status to "sent"

## Step 4: Test Newsletter Sending

1. Go to Admin Dashboard
2. Create a new newsletter
3. Click "Send Now"
4. Check your email inbox for the newsletter

## How It Works

When you send a newsletter:
1. The Cloudflare function fetches all subscribers
2. For each subscriber, it sends an email via Resend API
3. The email is formatted based on subscriber's language preference
4. Newsletter status is updated to "sent"

## Troubleshooting

### No emails received?
- Check that Resend API key is set: `wrangler pages secret list`
- Check browser console for errors
- Check Resend dashboard for delivery status

### Emails going to spam?
- Resend has good deliverability
- Check Resend dashboard for bounce/spam reports
- Consider adding a custom domain later

### Want to use Gmail instead?
- We can implement Gmail API sending
- Requires additional setup
- Resend is simpler and more reliable

## Resend Free Tier

- 100 emails per day
- Perfect for testing and small newsletters
- No credit card required
- Upgrade anytime for more volume

## Next Steps

1. Sign up at https://resend.com
2. Get your API key
3. Run: `wrangler pages secret put RESEND_API_KEY`
4. Paste your key
5. Test by sending a newsletter

That's it! Your newsletter system is now ready to send real emails.
