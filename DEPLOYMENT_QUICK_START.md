# Quick Start: Deploy to Cloudflare Pages

## 5-Minute Setup

### 1. Install Wrangler
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Create Database
```bash
wrangler d1 create newsletter-db
```

Save the database ID from the output.

### 4. Initialize Database
```bash
wrangler d1 execute newsletter-db --file schema.sql
```

### 5. Set Secrets
```bash
wrangler secret put RESEND_API_KEY
# Paste: re_BsDneXUF_MgwUamRU1qnPHNCnDwGnrZ72

wrangler secret put FROM_EMAIL
# Paste: noreply@news.example.com
```

### 6. Update wrangler.toml
Edit `wrangler.toml`:
- Replace `account_id` with your Cloudflare Account ID
- Replace `database_id` with the ID from Step 3

Find your Account ID:
1. Go to https://dash.cloudflare.com
2. Click profile → Accounts
3. Copy the Account ID

### 7. Deploy
```bash
npm run build
wrangler deploy
```

### 8. Get Your URL
Your app is now live at:
```
https://your-project.pages.dev
```

---

## Using GitHub (Recommended)

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Cloudflare deployment"
git push origin main
```

### 2. Connect to Cloudflare Pages
1. Go to https://dash.cloudflare.com → Pages
2. Click "Create a project"
3. Select "Connect to Git"
4. Choose your repository
5. Configure:
   - **Build command:** `npm run build`
   - **Build output:** `dist`

### 3. Add Environment Variables
In Pages settings → Environment variables:
- `RESEND_API_KEY` = `re_BsDneXUF_MgwUamRU1qnPHNCnDwGnrZ72`
- `FROM_EMAIL` = `noreply@news.example.com`

### 4. Deploy
Click "Save and Deploy" - your app will be live!

---

## Verify Deployment

### Test API
```bash
curl https://your-project.pages.dev/make-server-53bed28f/health
```

Should return: `{"status":"ok"}`

### Test Newsletter
1. Go to admin dashboard: `https://your-project.pages.dev/admin`
2. Login with: `admin@example.com` / `admin123`
3. Create and send a test newsletter

---

## Important: Verify Domain in Resend

To send emails to all subscribers:

1. Go to https://app.resend.com/domains
2. Add your domain
3. Follow DNS setup
4. Once verified, emails will send to everyone

---

## Troubleshooting

### Database not found
```bash
wrangler d1 info newsletter-db
```

### Secrets not working
```bash
wrangler secret list
```

### Build failed
```bash
rm -rf dist node_modules
npm install
npm run build
```

### Check logs
```bash
wrangler tail
```

---

## Your Deployment Checklist

- [ ] Wrangler installed
- [ ] Logged in to Cloudflare
- [ ] D1 database created
- [ ] Database schema initialized
- [ ] Secrets set (RESEND_API_KEY, FROM_EMAIL)
- [ ] wrangler.toml updated with account_id and database_id
- [ ] App built (`npm run build`)
- [ ] Deployed (`wrangler deploy`)
- [ ] API tested
- [ ] Domain verified in Resend
- [ ] Newsletter tested

---

## Next Steps

1. ✅ Deploy to Cloudflare
2. ✅ Verify domain in Resend
3. ✅ Test newsletter sending
4. ✅ Monitor analytics
5. ✅ Scale as needed

---

**You're ready to deploy! 🚀**
