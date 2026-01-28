# Set Environment Variables in Cloudflare Pages

## Why This Matters

Your API needs these environment variables to work:
- `RESEND_API_KEY` - To send emails
- `FROM_EMAIL` - Email address to send from
- `EMAIL_SERVICE_PROVIDER` - Which service to use (resend)

Without these, the subscriber registration will fail with a 500 error.

---

## How to Set Environment Variables

### Step 1: Go to Cloudflare Dashboard
Visit: https://dash.cloudflare.com

### Step 2: Navigate to Pages
1. Click **Pages** in the left sidebar
2. Select **author-fatima** project

### Step 3: Go to Settings
1. Click **Settings** tab
2. Click **Environment variables** in the left menu

### Step 4: Add Variables

Click **Add variable** and add these three:

#### Variable 1: RESEND_API_KEY
- **Name:** `RESEND_API_KEY`
- **Value:** `re_BsDneXUF_MgwUamRU1qnPHNCnDwGnrZ72`
- Click **Save**

#### Variable 2: FROM_EMAIL
- **Name:** `FROM_EMAIL`
- **Value:** `noreply@news.example.com`
- Click **Save**

#### Variable 3: EMAIL_SERVICE_PROVIDER
- **Name:** `EMAIL_SERVICE_PROVIDER`
- **Value:** `resend`
- Click **Save**

### Step 5: Redeploy

After setting variables, redeploy your app:

```bash
npm run deploy:pages
```

Or go to Cloudflare Dashboard → Pages → author-fatima → Deployments → Redeploy latest

---

## Verify It Works

After setting variables and redeploying:

1. Visit: https://author-fatima-76r.pages.dev/
2. Try to subscribe with an email
3. Should work without 500 error!

---

## Current Status

| Variable | Status |
|----------|--------|
| RESEND_API_KEY | ⏳ Not set |
| FROM_EMAIL | ⏳ Not set |
| EMAIL_SERVICE_PROVIDER | ⏳ Not set |

**Action needed:** Set these variables in Cloudflare Dashboard

---

## Screenshots

### Where to find Environment Variables:
```
Cloudflare Dashboard
  → Pages
    → author-fatima
      → Settings
        → Environment variables
```

---

## After Setting Variables

Your app will be able to:
✅ Register subscribers  
✅ Send welcome emails  
✅ Send newsletters  
✅ Track email delivery  

---

**Set these variables now and your app will work! 🚀**
