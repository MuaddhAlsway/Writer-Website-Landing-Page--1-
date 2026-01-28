# 🌐 Custom Domain Setup for Cloudflare Pages

## Goal
Change from: `https://author-fatima-76r.pages.dev/`  
To: `https://author-fatima.pages.dev/`

---

## Option 1: Use Cloudflare's Subdomain (Easiest)

If you want `author-fatima.pages.dev` (Cloudflare's free subdomain):

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages**
3. Select **author-fatima** project
4. Click **Settings**
5. Go to **Custom domains**
6. Click **Add custom domain**
7. Enter: `author-fatima.pages.dev`
8. Click **Add domain**

✅ Done! Your app will be at: `https://author-fatima.pages.dev/`

---

## Option 2: Use Your Own Domain

If you have your own domain (e.g., `author-fatima.com`):

### Step 1: Add Domain to Cloudflare
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Add a site**
3. Enter your domain
4. Follow Cloudflare's setup

### Step 2: Connect to Pages Project
1. Go to your **author-fatima** Pages project
2. Click **Settings**
3. Go to **Custom domains**
4. Click **Add custom domain**
5. Enter your domain
6. Follow DNS setup instructions

### Step 3: Update DNS Records
Cloudflare will provide CNAME records to add to your domain provider.

---

## Current Status

| Item | Status |
|------|--------|
| **Project Name** | ✅ author-fatima |
| **Current URL** | ✅ author-fatima-76r.pages.dev |
| **Custom Domain** | ⏳ Not set up yet |

---

## Quick Steps to Get `author-fatima.pages.dev`

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Pages** → **author-fatima**
3. Click **Settings** → **Custom domains**
4. Click **Add custom domain**
5. Type: `author-fatima.pages.dev`
6. Click **Add domain**
7. Wait for DNS propagation (usually instant)

✅ Your app will be live at: `https://author-fatima.pages.dev/`

---

## Verify It Works

After setup, visit:
```
https://author-fatima.pages.dev/
```

You should see your newsletter app!

---

## Need Help?

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [DNS Setup Guide](https://developers.cloudflare.com/pages/configuration/custom-domains/#dns-records)

---

**Your app is ready! Just add the custom domain and you're all set! 🚀**
