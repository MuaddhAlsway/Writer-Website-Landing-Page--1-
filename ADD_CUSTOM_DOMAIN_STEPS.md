# ✅ Add Custom Domain to author-fatima Project

## Your Current URL
```
https://author-fatima-76r.pages.dev/
```

## Your Target URL
```
https://author-fatima.pages.dev/
```

---

## Step-by-Step Instructions

### Step 1: Go to Cloudflare Dashboard
Visit: https://dash.cloudflare.com

### Step 2: Navigate to Pages
1. Click **Pages** in the left sidebar
2. Select **author-fatima** project

### Step 3: Go to Settings
1. Click **Settings** tab
2. Click **Custom domains** in the left menu

### Step 4: Add Custom Domain
1. Click **Add custom domain** button
2. In the text field, enter: `author-fatima.pages.dev`
3. Click **Add domain** button

### Step 5: Verify
1. Wait for DNS propagation (usually instant)
2. Visit: https://author-fatima.pages.dev/
3. Your app should load! ✅

---

## What Happens

- Your app will be accessible at both URLs:
  - ✅ `https://author-fatima.pages.dev/` (NEW - your custom domain)
  - ✅ `https://author-fatima-76r.pages.dev/` (OLD - still works)

---

## Troubleshooting

### Domain not working?
1. Wait 5-10 minutes for DNS propagation
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try in incognito/private window

### Still not working?
1. Go back to Cloudflare Dashboard
2. Check if domain shows as "Active"
3. Verify the domain name is exactly: `author-fatima.pages.dev`

---

## Done! 🎉

Once you complete these steps, your app will be live at:
```
https://author-fatima.pages.dev/
```

**Next: Set Environment Variables**

After the domain is set up, add your Resend API key:

1. Go to **Settings** → **Environment variables**
2. Add:
   - `RESEND_API_KEY`: `re_BsDneXUF_MgwUamRU1qnPHNCnDwGnrZ72`
   - `FROM_EMAIL`: `noreply@news.example.com`
   - `EMAIL_SERVICE_PROVIDER`: `resend`

3. Redeploy to apply variables:
   ```bash
   npm run deploy:pages
   ```

---

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Custom Domains Guide](https://developers.cloudflare.com/pages/configuration/custom-domains/)

**Your app is ready! Just add the custom domain! 🚀**
