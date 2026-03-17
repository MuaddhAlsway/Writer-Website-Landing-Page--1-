# Cloudflare Pages Secrets Setup

The API endpoints have been moved from Vercel to Cloudflare Pages Functions. This means the Turso database credentials need to be set as secrets in Cloudflare.

## Step 1: Set Secrets via Wrangler CLI

Run these commands to set the secrets:

```bash
# Set Turso credentials
wrangler secret put TURSO_CONNECTION_URL --env production
# Paste: libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA

wrangler secret put TURSO_AUTH_TOKEN --env production
# Paste: eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA

# Set Gmail credentials
wrangler secret put GMAIL_USER --env production
# Paste: AuthorFSK@gmail.com

wrangler secret put GMAIL_APP_PASSWORD --env production
# Paste: peed qvhs ekmo kisv
```

## Step 2: Verify Secrets

```bash
wrangler secret list --env production
```

You should see:
- TURSO_CONNECTION_URL
- TURSO_AUTH_TOKEN
- GMAIL_USER
- GMAIL_APP_PASSWORD

## Step 3: Deploy

```bash
npm run deploy
```

## What Changed

- **Before**: API endpoints were on Vercel, Cloudflare Pages proxy forwarded requests to Vercel
- **Now**: API endpoints are on Cloudflare Pages Functions, they access Turso directly

This eliminates the problem where Turso credentials weren't being passed through the proxy.

## API Endpoints

All endpoints are now at:
- `https://main.author-fatima-76r-eis.pages.dev/api/subscribers`
- `https://main.author-fatima-76r-eis.pages.dev/api/stats`
- `https://main.author-fatima-76r-eis.pages.dev/api/newsletters`

No more proxying through Vercel!
