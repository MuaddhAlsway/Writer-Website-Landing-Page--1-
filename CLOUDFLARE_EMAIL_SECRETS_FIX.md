# Fix: Email Service Not Configured - Cloudflare Secrets

## Problem
Your Cloudflare Pages deployment is missing email service credentials. The error "Email service not configured" occurs because `GMAIL_USER` and `GMAIL_APP_PASSWORD` are not set in Cloudflare's environment.

## Solution: Add Secrets to Cloudflare Dashboard

### Step 1: Go to Cloudflare Dashboard
1. Open https://dash.cloudflare.com
2. Select your account
3. Go to **Workers & Pages**
4. Click on your project: **author-fatima-76r**

### Step 2: Add Production Secrets
1. Click the **Settings** tab
2. Click **Environment variables** (or **Secrets** if available)
3. Click **Add variable** or **Add secret**

### Step 3: Add Each Secret
Add these secrets for **Production** environment:

| Name | Value |
|------|-------|
| `GMAIL_USER` | `AuthorFSK@gmail.com` |
| `GMAIL_APP_PASSWORD` | `peed qvhs ekmo kisv` |
| `TURSO_CONNECTION_URL` | `libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA` |
| `TURSO_AUTH_TOKEN` | `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA` |

### Step 4: Redeploy
After adding secrets:
1. Go back to your Pages project
2. Click **Deployments**
3. Find your latest deployment
4. Click the **...** menu → **Retry deployment**

Or push a new commit to trigger automatic redeploy.

## Verification
After redeployment, test the email service:
1. Go to your admin dashboard
2. Try sending a newsletter
3. Check if the error is gone

## Alternative: Use Wrangler CLI
If you prefer command line:

```bash
wrangler secret put GMAIL_USER --env production
# Paste: AuthorFSK@gmail.com

wrangler secret put GMAIL_APP_PASSWORD --env production
# Paste: peed qvhs ekmo kisv

wrangler secret put TURSO_CONNECTION_URL --env production
# Paste the full URL

wrangler secret put TURSO_AUTH_TOKEN --env production
# Paste the full token
```

Then redeploy:
```bash
wrangler deploy --env production
```

## Why This Happens
- Local `.env` files are only for development
- Cloudflare Pages needs secrets set in the dashboard
- The code checks `context.env.GMAIL_USER` which comes from Cloudflare, not `.env`
