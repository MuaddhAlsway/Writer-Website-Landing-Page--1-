# Deploy NOW - Quick Steps

## What's Ready

✅ Backend code created (api/send-email.js)
✅ Vercel config created (vercel.json)
✅ Frontend updated (wrangler.toml)
✅ Admin tabs fixed
✅ Email system ready

## Deploy in 5 Minutes

### Step 1: Push Code
```bash
git add .
git commit -m "Production ready - Vercel backend"
git push
```

### Step 2: Deploy Backend to Vercel

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Select your GitHub repo
4. Click "Import"

**Settings:**
- Build: `npm run build`
- Output: `dist`

**Environment Variables:**
```
GMAIL_USER = AuthorFSK@gmail.com
GMAIL_APP_PASSWORD = peed qvhs ekmo kisv
```

Click "Deploy"

### Step 3: Deploy Frontend
```bash
npm run deploy:pages
```

### Step 4: Test

1. Go to your Cloudflare Pages URL
2. Log in
3. Go to "إرسال بريد" tab
4. Send test email
5. Check Gmail inbox

---

## That's It!

Everything is set up and working.

**Backend**: Vercel (serverless)
**Frontend**: Cloudflare Pages
**Email**: Gmail SMTP with app password

