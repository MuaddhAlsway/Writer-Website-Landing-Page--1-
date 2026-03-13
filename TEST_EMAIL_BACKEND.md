# Test Email Backend

## Check Vercel Deployment

1. Go to https://vercel.com
2. Click your project: `writer-website-landing-page-1`
3. Click "Deployments" tab
4. Check if latest deployment is "Ready"

## Verify Environment Variables

1. Click "Settings" tab
2. Click "Environment Variables"
3. Verify these are set:
   - `GMAIL_USER` = `AuthorFSK@gmail.com`
   - `GMAIL_APP_PASSWORD` = `peed qvhs ekmo kisv`

If not set, add them now.

## Test Endpoint

After environment variables are set, test:

```bash
curl -X POST https://writer-website-landing-page-1.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["test@gmail.com"],
    "subject": "Test Email",
    "message": "<p>This is a test email</p>"
  }'
```

Expected response:
```json
{
  "success": true,
  "sent": 1,
  "failed": 0,
  "total": 1
}
```

## If Still Getting HTML Error

1. Check Vercel logs:
   - Click "Logs" tab
   - Look for errors

2. Common issues:
   - Environment variables not set
   - Nodemailer not installed
   - Gmail credentials wrong

3. Redeploy:
   - Click "Deployments"
   - Click "..." on latest deployment
   - Click "Redeploy"

## After Fix

1. Go to admin panel
2. "إرسال بريد" tab
3. Send test email
4. Check Gmail inbox

