# Gmail Setup for Email Sending

## Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow the steps to enable it

## Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your device)
3. Click "Generate"
4. Copy the 16-character password

## Step 3: Update .env File
Replace `your-app-password-here` with the password you generated:

```
GMAIL_USER=muaddhalsway@gmail.com
GMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

**Important:** Remove spaces from the password when pasting!

## Step 4: Restart Server
```bash
node server-db.mjs
```

## Done!
Now all emails (Arabic and English) will be sent from your Gmail account and will arrive in the inbox!

## Troubleshooting
- If emails don't send, check that 2FA is enabled
- Make sure the app password is correct (16 characters)
- Check server logs for error messages
