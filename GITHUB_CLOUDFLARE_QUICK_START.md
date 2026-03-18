# GitHub → Cloudflare Pages → Custom Domain (Quick Start)

## 3-Step Setup (15 minutes)

### STEP 1: Connect GitHub to Cloudflare (5 min)

```
1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages" → "Pages"
3. Click "Create application" → "Connect to Git"
4. Select GitHub → Authorize
5. Choose repo: "Writer-Website-Landing-Page--1-"
6. Build command: npm run build
7. Output directory: dist
8. Click "Save and Deploy"
9. Wait 2-3 minutes ✅
```

**Result**: Your site is now at `https://author-fatima-76r-eis.pages.dev`

---

### STEP 2: Get a Custom Domain (5 min)

**Option A: Buy Domain** (Recommended)
- Go to https://www.namecheap.com
- Search for domain (e.g., `authorfatima.com`)
- Buy it ($0.88-$15/year)
- Note the domain name

**Option B: Free Domain**
- Go to https://www.freenom.com
- Get free `.tk` or `.ml` domain
- Note the domain name

---

### STEP 3: Connect Domain to Cloudflare (5 min)

```
1. Go to https://dash.cloudflare.com
2. Pages → author-fatima-76r
3. Click "Custom domains"
4. Click "Set up a custom domain"
5. Enter your domain (e.g., authorfatima.com)
6. Click "Continue"
7. Copy the 2 nameservers shown
```

**Then go to your domain registrar:**
```
1. Find "Nameservers" or "DNS" settings
2. Replace with Cloudflare nameservers:
   - ns1.cloudflare.com
   - ns2.cloudflare.com
3. Save changes
4. Wait 24-48 hours for DNS to update
5. Back in Cloudflare, click "Check nameservers"
6. Once verified ✅ - Your domain works!
```

---

## Now Every Push Auto-Deploys!

```
You make changes
    ↓
git push origin main
    ↓
GitHub notifies Cloudflare
    ↓
Cloudflare builds (npm run build)
    ↓
Cloudflare deploys to your domain
    ↓
Changes live in 2-3 minutes ✅
```

---

## Test It

### Test 1: Auto-Deploy
```bash
# Make a small change
echo "// test" >> src/main.tsx

# Push to GitHub
git add .
git commit -m "test auto-deploy"
git push origin main

# Check Cloudflare Dashboard
# Go to Pages → Deployments
# Should see new deployment starting
# Wait 2-3 minutes
# Visit your domain - changes should be live!
```

### Test 2: Check Status
```
Cloudflare Dashboard
    ↓
Workers & Pages → author-fatima-76r
    ↓
Deployments tab
    ↓
Should show ✅ Success
```

---

## Your URLs

| URL | Purpose |
|-----|---------|
| `https://author-fatima-76r-eis.pages.dev` | Cloudflare default URL (always works) |
| `https://your-domain.com` | Your custom domain (after DNS updates) |

---

## Troubleshooting

### Domain not working?
- DNS takes 24-48 hours to update
- Check at https://www.whatsmydns.net
- Should show Cloudflare nameservers

### Deployment failed?
- Go to Deployments tab
- Click failed deployment
- Scroll down to see error logs
- Common: `npm run build` failed → check code

### Changes not showing?
- Hard refresh: `Ctrl+Shift+R`
- Wait 2-3 minutes for CDN cache
- Check deployment succeeded

---

## Environment Variables

Your secrets are already set:
- ✅ TURSO_CONNECTION_URL
- ✅ TURSO_AUTH_TOKEN
- ✅ GMAIL_USER
- ✅ GMAIL_APP_PASSWORD

No changes needed!

---

## Done! 🎉

Your site now:
- ✅ Auto-deploys on every GitHub push
- ✅ Works on custom domain
- ✅ Updates in 2-3 minutes
- ✅ Has all environment variables set

**Start pushing changes and watch them go live!**
