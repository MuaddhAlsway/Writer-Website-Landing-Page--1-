# Gmail API Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Name it "Author Fatima Newsletter"
4. Click "Create"

## Step 2: Enable Gmail API

1. In the Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Gmail API"
3. Click on it and press "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - User Type: External
   - Add required info (app name, user support email, etc.)
   - Add scopes: `https://www.googleapis.com/auth/gmail.send`
4. For Application type, select "Web application"
5. Add Authorized redirect URIs:
   - `http://localhost:3001/auth/callback`
   - `https://your-domain.com/auth/callback` (for production)
6. Click "Create"
7. Download the JSON file and save as `credentials.json`

## Step 4: Set Environment Variables

Copy the credentials to your `.env` file:

```
GMAIL_CLIENT_ID=your-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REDIRECT_URI=http://localhost:3001/auth/callback
GMAIL_USER_EMAIL=muaddhalsway@gmail.com
```

## Step 5: Get Initial Access Token

Run the authentication flow:
```bash
node setup-gmail-auth.mjs
```

This will:
1. Open a browser to authorize the app
2. Save the refresh token to `.env`
3. You're ready to send emails!

## Step 6: Deploy to Cloudflare

Set Cloudflare secrets:
```bash
wrangler secret put GMAIL_CLIENT_ID
wrangler secret put GMAIL_CLIENT_SECRET
wrangler secret put GMAIL_REFRESH_TOKEN
wrangler secret put GMAIL_USER_EMAIL
```

Then deploy:
```bash
npm run deploy
```

## Troubleshooting

**"Invalid client" error**
- Verify credentials.json is correct
- Check CLIENT_ID and CLIENT_SECRET match

**"Redirect URI mismatch"**
- Ensure redirect URI in code matches Google Cloud Console exactly

**"Access denied"**
- Make sure you authorized the app in the browser
- Check that Gmail API is enabled in Cloud Console

**"Invalid grant"**
- Refresh token may have expired
- Run `node setup-gmail-auth.mjs` again to get a new one
