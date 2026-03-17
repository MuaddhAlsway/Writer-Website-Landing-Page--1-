# Cloudflare Pages - Copy & Paste Values

Use this file to copy the exact values needed for Cloudflare Pages setup.

---

## VARIABLES (Public)

### Variable 1: ENVIRONMENT
**Name:** `ENVIRONMENT`
**Value:** 
```
production
```

### Variable 2: BACKEND_URL
**Name:** `BACKEND_URL`
**Value:**
```
https://writer-website-landing-page-1.vercel.app
```

### Variable 3: FRONTEND_URL
**Name:** `FRONTEND_URL`
**Value:**
```
https://main.author-fatima-76r-eis.pages.dev
```

---

## SECRETS (Private/Sensitive)

### Secret 1: TURSO_CONNECTION_URL
**Name:** `TURSO_CONNECTION_URL`
**Value:**
```
libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA
```

### Secret 2: TURSO_AUTH_TOKEN
**Name:** `TURSO_AUTH_TOKEN`
**Value:**
```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA
```

### Secret 3: GMAIL_USER
**Name:** `GMAIL_USER`
**Value:**
```
AuthorFSK@gmail.com
```

### Secret 4: GMAIL_APP_PASSWORD
**Name:** `GMAIL_APP_PASSWORD`
**Value:**
```
peed qvhs ekmo kisv
```

---

## Setup Checklist

- [ ] Added ENVIRONMENT variable
- [ ] Added BACKEND_URL variable
- [ ] Added FRONTEND_URL variable
- [ ] Added TURSO_CONNECTION_URL secret
- [ ] Added TURSO_AUTH_TOKEN secret
- [ ] Added GMAIL_USER secret
- [ ] Added GMAIL_APP_PASSWORD secret
- [ ] Redeployed project
- [ ] Waited 1-2 minutes for changes to propagate
- [ ] Tested API endpoints

---

## Where to Add These

1. Go to https://dash.cloudflare.com
2. Click **Pages** → **author-fatima-76r**
3. Click **Settings** tab
4. Scroll to **Environment variables** section
5. Add the 3 VARIABLES
6. Scroll to **Secrets** section (under Production)
7. Add the 4 SECRETS
8. Click **Save** after each entry
9. Go to **Deployments** tab
10. Redeploy the latest deployment

---

## Verification

After setup, your API should work:

```
GET https://main.author-fatima-76r-eis.pages.dev/api/subscribers
Response: {"subscribers": [...], "total": X}

NOT: {"error": "Turso not configured"}
```

---

## Important Notes

- **VARIABLES** are public (visible in code)
- **SECRETS** are private (hidden, encrypted)
- All 7 items must be added for the system to work
- Must redeploy after adding variables/secrets
- Changes take 1-2 minutes to propagate
- Clear browser cache if still seeing old errors

---

## Support

If you have issues:
1. Check that all 7 items are added
2. Verify you redeployed
3. Wait 2-3 minutes
4. Clear browser cache (Ctrl+Shift+Delete)
5. Check browser console for errors (F12)
