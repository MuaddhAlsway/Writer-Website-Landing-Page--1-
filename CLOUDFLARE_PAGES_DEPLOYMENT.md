# 🚀 Cloudflare Pages Deployment Guide

## Quick Start

Your project is configured for Cloudflare Pages deployment. Follow these steps:

---

## Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

Or if you prefer using npx:
```bash
npx wrangler --version
```

---

## Step 2: Authenticate with Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate. Follow the prompts and authorize Wrangler.

---

## Step 3: Build Your Project

```bash
npm run build
```

This creates the `dist` folder with your compiled React app.

---

## Step 4: Deploy to Cloudflare Pages

### Option A: Deploy from CLI (Recommended)

```bash
npm run deploy:pages
```

Or manually:
```bash
wrangler pages deploy dist
```

### Option B: Deploy via Git (Recommended for Production)

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Navigate to **Pages**
4. Click **Create a project**
5. Select **Connect to Git**
6. Choose your repository
7. Configure build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
8. Click **Save and Deploy**

---

## Step 5: Configure Environment Variables

### Via CLI:
```bash
wrangler secret put RESEND_API_KEY
# Paste: re_BsDneXUF_MgwUamRU1qnPHNCnDwGnrZ72

wrangler secret put FROM_EMAIL
# Paste: noreply@news.example.com

wrangler secret put EMAIL_SERVICE_PROVIDER
# Paste: resend
```

### Via Cloudflare Dashboard:
1. Go to your Pages project
2. Click **Settings**
3. Go to **Environment variables**
4. Add:
   - `RESEND_API_KEY`: `re_BsDneXUF_MgwUamRU1qnPHNCnDwGnrZ72`
   - `FROM_EMAIL`: `noreply@news.example.com`
   - `EMAIL_SERVICE_PROVIDER`: `resend`

---

## Step 6: Verify Deployment

After deployment, you'll get a URL like:
```
https://newsletter-app.pages.dev
```

Visit this URL to verify your app is live!

---

## Current Configuration

Your `wrangler.toml` is configured with:

✅ **Build Command**: `npm run build`  
✅ **Output Directory**: `dist`  
✅ **Framework**: Vite + React  
✅ **Environment Variables**: Ready for Resend API  

---

## Deployment Checklist

- [ ] Wrangler CLI installed
- [ ] Authenticated with Cloudflare (`wrangler login`)
- [ ] Project builds locally (`npm run build`)
- [ ] Environment variables set
- [ ] Domain verified in Resend (optional but recommended)
- [ ] Deployed to Cloudflare Pages

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Authentication Issues
```bash
# Re-authenticate
wrangler logout
wrangler login
```

### Environment Variables Not Working
1. Verify they're set in Cloudflare Dashboard
2. Redeploy after setting variables
3. Check variable names match exactly

### API Calls Failing
Make sure your API endpoints are correctly configured in your React app to point to your Cloudflare Pages URL.

---

## After Deployment

### 1. Update API Endpoints
If your React app makes API calls, update them to use your Cloudflare Pages URL:

```typescript
// Before (local)
const API_BASE = 'http://localhost:3001';

// After (production)
const API_BASE = 'https://newsletter-app.pages.dev';
```

### 2. Verify Domain
Go to [Resend Domains](https://resend.com/domains) and verify `news.example.com` to send to all subscribers.

### 3. Test Newsletter System
1. Go to your deployed app
2. Create a test newsletter
3. Send to subscribers
4. Check email logs

---

## Custom Domain (Optional)

To use your own domain:

1. Go to Cloudflare Dashboard
2. Select your Pages project
3. Click **Custom domains**
4. Add your domain
5. Follow DNS setup instructions

---

## Monitoring & Logs

View deployment logs:
```bash
wrangler tail
```

Or in Cloudflare Dashboard:
1. Go to your Pages project
2. Click **Deployments**
3. View logs for each deployment

---

## Rollback

If something goes wrong:

1. Go to Cloudflare Dashboard
2. Navigate to your Pages project
3. Click **Deployments**
4. Find the previous working deployment
5. Click **Rollback**

---

## Next Steps

1. ✅ Deploy to Cloudflare Pages
2. ✅ Set environment variables
3. ✅ Verify domain in Resend
4. ✅ Test newsletter system
5. ✅ Monitor deployments

---

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#cloudflare-pages)
- [Resend Docs](https://resend.com/docs)

---

## Support

If you encounter issues:

1. Check Cloudflare Dashboard for error messages
2. Review build logs in Pages deployment
3. Verify environment variables are set
4. Test locally first: `npm run dev`

**Your app is ready to deploy! 🎉**
