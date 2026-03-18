# Connect GitHub to Cloudflare Pages - Auto Deploy Setup

## Step 1: Connect GitHub to Cloudflare (5 minutes)

### 1.1 Go to Cloudflare Dashboard
1. Open https://dash.cloudflare.com
2. Click **Workers & Pages** (left sidebar)
3. Click **Pages** tab
4. Click **Create application**

### 1.2 Connect Your GitHub Repository
1. Click **Connect to Git**
2. Click **GitHub**
3. Authorize Cloudflare to access your GitHub account
4. Select your repository: **Writer-Website-Landing-Page--1-**
5. Click **Begin setup**

### 1.3 Configure Build Settings
1. **Production branch**: `main` (or your default branch)
2. **Build command**: `npm run build`
3. **Build output directory**: `dist`
4. Click **Save and Deploy**

**Wait 2-3 minutes for first deployment**

---

## Step 2: Add Custom Domain (10 minutes)

### 2.1 You Need a Domain
You have two options:

**Option A: Buy a Domain**
- Go to https://www.namecheap.com or https://domains.google.com
- Search for your domain (e.g., `authorfatima.com`)
- Buy it
- Note the domain name

**Option B: Use Free Domain**
- Go to https://www.freenom.com
- Get a free `.tk`, `.ml`, or `.ga` domain
- Note the domain name

### 2.2 Add Domain to Cloudflare
1. Go to https://dash.cloudflare.com
2. **Workers & Pages** → **Pages** → **author-fatima-76r**
3. Click **Custom domains** tab
4. Click **Set up a custom domain**
5. Enter your domain (e.g., `authorfatima.com`)
6. Click **Continue**

### 2.3 Update Domain Nameservers
Cloudflare will show you 2 nameservers:
```
ns1.cloudflare.com
ns2.cloudflare.com
```

Go to your domain registrar (Namecheap, Google Domains, etc.):
1. Find **Nameservers** or **DNS** settings
2. Replace existing nameservers with Cloudflare's
3. Save changes
4. Wait 24-48 hours for DNS to propagate

### 2.4 Verify Domain
Back in Cloudflare:
1. Click **Check nameservers**
2. Wait for verification (usually 5-30 minutes)
3. Once verified, your domain is connected!

---

## Step 3: Auto-Deploy on Every Push

### 3.1 How It Works
```
You push to GitHub
    ↓
GitHub notifies Cloudflare
    ↓
Cloudflare runs: npm run build
    ↓
Cloudflare deploys dist/ folder
    ↓
Your domain updates automatically
```

### 3.2 Test Auto-Deploy
1. Make a small change to your code
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Test auto-deploy"
git push origin main
```

3. Go to https://dash.cloudflare.com
4. **Workers & Pages** → **author-fatima-76r** → **Deployments**
5. You should see a new deployment starting
6. Wait 2-3 minutes for it to complete
7. Visit your domain to see the changes

---

## Step 4: Environment Variables (Important!)

### 4.1 Add Production Secrets
Your environment variables are already set, but verify:

1. Go to https://dash.cloudflare.com
2. **Workers & Pages** → **author-fatima-76r** → **Settings**
3. Verify these are set:
   - `TURSO_CONNECTION_URL`
   - `TURSO_AUTH_TOKEN`
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `BACKEND_URL`
   - `FRONTEND_URL`

If any are missing, add them now.

---

## Step 5: Verify Everything Works

### 5.1 Check Deployment Status
1. Go to https://dash.cloudflare.com
2. **Workers & Pages** → **author-fatima-76r**
3. Click **Deployments** tab
4. Latest deployment should show ✅ **Success**

### 5.2 Test Your Domain
1. Visit your custom domain (e.g., `https://authorfatima.com`)
2. Should see your website
3. Admin dashboard should work
4. Newsletter should send

### 5.3 Test Auto-Deploy
1. Make a change to your code
2. Push to GitHub
3. Check Deployments tab
4. New deployment should appear within 1 minute
5. Changes should be live within 3 minutes

---

## Troubleshooting

### Problem: Domain not working
**Solution:**
1. Check nameservers are updated (can take 24-48 hours)
2. Go to https://www.whatsmydns.net
3. Enter your domain
4. Should show Cloudflare nameservers
5. If not, wait longer or contact domain registrar

### Problem: Deployment failed
**Solution:**
1. Go to **Deployments** tab
2. Click on failed deployment
3. Scroll down to see error logs
4. Common errors:
   - `npm run build` failed → check code for errors
   - Missing dependencies → run `npm install`
   - Wrong build output → check `dist/` folder exists

### Problem: Changes not showing up
**Solution:**
1. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check deployment completed successfully
3. Wait 2-3 minutes for CDN cache to clear
4. Check you pushed to correct branch (`main`)

### Problem: Environment variables not working
**Solution:**
1. Verify variables are set in Cloudflare Dashboard
2. Redeploy after adding variables
3. Check variable names are exactly correct (case-sensitive)
4. Test with curl command to see error details

---

## GitHub Workflow

### Every Time You Make Changes:

```bash
# 1. Make your changes in code
# 2. Commit changes
git add .
git commit -m "Your change description"

# 3. Push to GitHub
git push origin main

# 4. Cloudflare automatically deploys
# 5. Check status in Cloudflare Dashboard
# 6. Visit your domain to see changes (2-3 minutes)
```

---

## Your Setup Now

```
GitHub Repository
    ↓ (auto-connected)
Cloudflare Pages
    ├─ Auto-builds on every push
    ├─ Deploys to: https://author-fatima-76r-eis.pages.dev
    └─ Also available at: https://your-custom-domain.com
```

---

## Next Steps

1. ✅ Connect GitHub to Cloudflare Pages
2. ✅ Buy or get a custom domain
3. ✅ Add domain to Cloudflare
4. ✅ Update nameservers at domain registrar
5. ✅ Wait for DNS propagation (24-48 hours)
6. ✅ Test auto-deploy with a small change
7. ✅ Start making changes and pushing to GitHub

**Your site will automatically update every time you push!**

---

## Quick Reference

| What | Where |
|------|-------|
| Connect GitHub | https://dash.cloudflare.com → Pages → Create app |
| Add Domain | Pages → Custom domains |
| View Deployments | Pages → Deployments |
| Environment Variables | Pages → Settings |
| Build Settings | Pages → Settings → Build configuration |

---

## Support

If something doesn't work:
1. Check Cloudflare Deployments tab for error logs
2. Verify GitHub is connected (check Cloudflare Pages settings)
3. Verify domain nameservers are updated
4. Check environment variables are set
5. Try manual redeploy from Deployments tab
