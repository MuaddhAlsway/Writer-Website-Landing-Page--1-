# Quick Resend Setup - 3 Steps

## Step 1: Sign Up (2 minutes)
```
Go to: https://resend.com
Click: Sign Up
Enter: Your email
Done!
```

## Step 2: Get API Key (1 minute)
```
1. Go to Dashboard
2. Click: API Keys (left sidebar)
3. Copy: Your API key (re_xxxxxxxxxxxxx)
```

## Step 3: Add to Cloudflare (1 minute)
```bash
wrangler pages secret put RESEND_API_KEY
```

When prompted, paste your API key and press Enter.

## Done! 🎉

Your newsletter system is now ready to send real emails.

## Test It

1. Go to Admin Dashboard
2. Create a newsletter
3. Click "Send Now"
4. Check your email inbox

## That's It!

No more "0 recipients" - emails will actually be sent to all subscribers.

## Free Tier

- 100 emails per day
- No credit card needed
- Perfect for testing

## Questions?

- Resend docs: https://resend.com/docs
- Check Resend dashboard for delivery status
- View email logs in browser console
