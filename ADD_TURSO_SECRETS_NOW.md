# Add Turso Secrets NOW

## System is Deployed! ✅

Now add the 4 Turso secrets to Cloudflare Dashboard.

---

## GO TO CLOUDFLARE

https://dash.cloudflare.com

---

## NAVIGATE

1. Pages
2. author-fatima-76r
3. Settings
4. Scroll to Production
5. Look for Secrets

---

## ADD 4 SECRETS

### Secret 1
**Name:** `TURSO_CONNECTION_URL`
**Value:**
```
libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA
```

### Secret 2
**Name:** `TURSO_AUTH_TOKEN`
**Value:**
```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA
```

### Secret 3
**Name:** `GMAIL_USER`
**Value:**
```
AuthorFSK@gmail.com
```

### Secret 4
**Name:** `GMAIL_APP_PASSWORD`
**Value:**
```
peed qvhs ekmo kisv
```

---

## AFTER ADDING

1. Go to Deployments tab
2. Click ... on latest
3. Click Redeploy
4. Wait 2-3 minutes

---

## TEST

Go to: https://main.author-fatima-76r-eis.pages.dev/admin

Open console (F12)

Should see: `✅ Turso connected successfully`

---

## DONE! ✅

Your system will work with Turso!
