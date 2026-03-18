# Cloudflare Environment Variables Setup

## Quick Reference

### Where to Add Variables
1. Go to https://dash.cloudflare.com
2. **Workers & Pages** → **author-fatima-76r**
3. **Settings** tab
4. **Environment variables** section
5. Add for **Production** environment

---

## Required Variables

### Database (Turso)
```
Name: TURSO_CONNECTION_URL
Value: libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA
```

```
Name: TURSO_AUTH_TOKEN
Value: eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA
```

### Email (Gmail)
```
Name: GMAIL_USER
Value: AuthorFSK@gmail.com
```

```
Name: GMAIL_APP_PASSWORD
Value: peed qvhs ekmo kisv
```

### URLs
```
Name: BACKEND_URL
Value: https://writer-website-landing-page-1.vercel.app
```

```
Name: FRONTEND_URL
Value: https://main.author-fatima-76r-eis.pages.dev
```

---

## How to Get Each Value

### TURSO_CONNECTION_URL & TURSO_AUTH_TOKEN
1. Go to https://turso.tech
2. Sign in
3. Click your database: **authorfsk**
4. Copy the connection URL (includes auth token)
5. Split into:
   - **TURSO_CONNECTION_URL**: Full URL with `?authToken=...`
   - **TURSO_AUTH_TOKEN**: Just the token part after `authToken=`

### GMAIL_USER & GMAIL_APP_PASSWORD
1. Go to https://myaccount.google.com
2. Click **Security**
3. Enable **2-Step Verification** (if not enabled)
4. Scroll to **App passwords**
5. Select **Mail** and **Windows Computer**
6. Copy the 16-character password
7. **GMAIL_USER**: Your Gmail address
8. **GMAIL_APP_PASSWORD**: The 16-character password

---

## Verification Checklist

- [ ] TURSO_CONNECTION_URL is set
- [ ] TURSO_AUTH_TOKEN is set
- [ ] GMAIL_USER is set
- [ ] GMAIL_APP_PASSWORD is set
- [ ] BACKEND_URL is set
- [ ] FRONTEND_URL is set
- [ ] All values show "Value encrypted" in dashboard
- [ ] Site has been redeployed after adding variables

---

## After Adding Variables

1. **Redeploy your site**:
   - Go to **Deployments** tab
   - Click **...** on latest deployment
   - Click **Retry deployment**

2. **Wait 2-3 minutes** for deployment to complete

3. **Test the endpoints**:
   - Open browser console
   - Run test commands (see COMPLETE_SETUP_GUIDE.md)

---

## Common Mistakes

❌ **Wrong**: Using regular Gmail password instead of app password
✅ **Right**: Use 16-character app password from Google Account

❌ **Wrong**: Forgetting to redeploy after adding variables
✅ **Right**: Always redeploy after environment changes

❌ **Wrong**: Copying only part of the connection URL
✅ **Right**: Copy the entire URL including `?authToken=...`

❌ **Wrong**: Not enabling 2-Step Verification on Gmail
✅ **Right**: Enable 2-Step Verification first, then create app password
