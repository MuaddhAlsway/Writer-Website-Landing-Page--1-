# Cloudflare Pages - Variables and Secrets Setup Guide

## Overview
You need to add environment variables and secrets to your Cloudflare Pages project so the API endpoints can access Turso database and Gmail credentials.

---

## Method 1: Via Cloudflare Dashboard (Easiest)

### Step 1: Go to Cloudflare Dashboard
1. Open https://dash.cloudflare.com
2. Select your account
3. Go to **Pages** → **author-fatima-76r** (your project)

### Step 2: Add Environment Variables

1. Click on **Settings** tab
2. Scroll down to **Environment variables**
3. Click **Add variable**

#### Add these VARIABLES (not secrets):

| Name | Value | Environment |
|------|-------|-------------|
| `ENVIRONMENT` | `production` | Production |
| `BACKEND_URL` | `https://writer-website-landing-page-1.vercel.app` | Production |
| `FRONTEND_URL` | `https://main.author-fatima-76r-eis.pages.dev` | Production |

### Step 3: Add Secrets

1. In the same **Settings** tab
2. Scroll to **Production** section
3. Click **Add secret** under **Secrets**

#### Add these SECRETS:

| Name | Value |
|------|-------|
| `TURSO_CONNECTION_URL` | `libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA` |
| `TURSO_AUTH_TOKEN` | `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA` |
| `GMAIL_USER` | `AuthorFSK@gmail.com` |
| `GMAIL_APP_PASSWORD` | `peed qvhs ekmo kisv` |

### Step 4: Save and Deploy

1. Click **Save** after adding each secret
2. Go back to **Deployments**
3. Click the latest deployment
4. Click **Redeploy** to apply the new environment variables

---

## Method 2: Via Wrangler CLI

If you prefer command line:

```bash
# Set Turso Connection URL
echo "libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA" | wrangler pages secret put TURSO_CONNECTION_URL --project-name author-fatima-76r --env production

# Set Turso Auth Token
echo "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA" | wrangler pages secret put TURSO_AUTH_TOKEN --project-name author-fatima-76r --env production

# Set Gmail User
echo "AuthorFSK@gmail.com" | wrangler pages secret put GMAIL_USER --project-name author-fatima-76r --env production

# Set Gmail App Password
echo "peed qvhs ekmo kisv" | wrangler pages secret put GMAIL_APP_PASSWORD --project-name author-fatima-76r --env production

# Verify secrets were set
wrangler pages secret list --project-name author-fatima-76r --env production
```

---

## What Each Variable Does

### TURSO_CONNECTION_URL
- **Purpose**: Connects to your Turso database
- **Type**: Secret (sensitive)
- **Used by**: `functions/api/subscribers.ts`, `functions/api/stats.ts`, `functions/api/newsletters.ts`

### TURSO_AUTH_TOKEN
- **Purpose**: Authenticates with Turso database
- **Type**: Secret (sensitive)
- **Used by**: All API endpoints

### GMAIL_USER
- **Purpose**: Gmail account for sending emails
- **Type**: Secret (sensitive)
- **Value**: `AuthorFSK@gmail.com`

### GMAIL_APP_PASSWORD
- **Purpose**: Gmail app-specific password for authentication
- **Type**: Secret (sensitive)
- **Value**: `peed qvhs ekmo kisv`

### ENVIRONMENT
- **Purpose**: Identifies production environment
- **Type**: Variable (public)
- **Value**: `production`

### BACKEND_URL
- **Purpose**: Backend server URL (for reference)
- **Type**: Variable (public)
- **Value**: `https://writer-website-landing-page-1.vercel.app`

### FRONTEND_URL
- **Purpose**: Frontend URL (for email links)
- **Type**: Variable (public)
- **Value**: `https://main.author-fatima-76r-eis.pages.dev`

---

## Verification Checklist

After adding variables and secrets:

- [ ] All 4 secrets are set in Cloudflare Pages
- [ ] All 3 variables are set in Cloudflare Pages
- [ ] Latest deployment has been redeployed
- [ ] API endpoints respond without "Turso not configured" error
- [ ] Subscribers can be added and retrieved
- [ ] Newsletters can be sent

---

## Testing the Setup

After deployment, test the endpoints:

```bash
# Test subscribers endpoint
curl -X GET https://main.author-fatima-76r-eis.pages.dev/api/subscribers \
  -H "Authorization: Bearer test-token"

# Should return: {"subscribers": [...], "total": X}
# NOT: {"error": "Turso not configured"}
```

---

## Troubleshooting

### Error: "Turso not configured"
- Check that `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` are set in Cloudflare Pages
- Redeploy the project after adding secrets
- Wait 1-2 minutes for changes to propagate

### Error: "Unauthorized"
- Make sure you're sending the `Authorization` header with a token
- The token value doesn't matter for now (just needs to exist)

### Error: "Gmail credentials missing"
- Check that `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set
- Verify the values are correct (no extra spaces)

---

## Next Steps

1. Add all variables and secrets to Cloudflare Pages
2. Redeploy the project
3. Test the API endpoints
4. Verify data is being saved to Turso
5. Test newsletter sending

Your Turso database will now be properly connected to Cloudflare Pages!
