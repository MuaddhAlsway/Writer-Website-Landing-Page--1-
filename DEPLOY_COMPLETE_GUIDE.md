# Complete Deployment Guide

## Overview

Your newsletter system has two parts:
1. **Frontend:** Cloudflare Pages (already deployed ✅)
2. **Backend:** Node.js server (needs deployment)

This guide shows how to deploy the backend.

## Deployment Options

### Option 1: Railway (Recommended)
- **Easiest setup**
- **Free tier with $5 credit**
- **Best for beginners**
- See: `DEPLOY_BACKEND_RAILWAY.md`

### Option 2: Render
- **Simple setup**
- **Free tier available**
- **Good alternative**
- See: `DEPLOY_BACKEND_RENDER.md`

### Option 3: Heroku
- **Popular option**
- **Paid only ($7/month)**
- **Reliable**

### Option 4: Keep Local
- **No deployment needed**
- **Use PM2 to keep running**
- **For development only**

## Quick Comparison

| Service | Setup | Cost | Free Tier | Best For |
|---------|-------|------|-----------|----------|
| Railway | Easy | $0-2/mo | $5 credit | Beginners |
| Render | Easy | $7/mo | Limited | Production |
| Heroku | Medium | $7/mo | None | Production |
| Local | None | $0 | Yes | Development |

## Recommended: Railway

### Why Railway?
✅ Easiest setup
✅ Free tier with $5 credit
✅ Automatic deployment from GitHub
✅ Perfect for small projects
✅ No credit card needed initially

### Steps:

1. **Go to Railway**
   ```
   https://railway.app
   ```

2. **Sign up with GitHub**
   - Click "Start Project"
   - Select "Deploy from GitHub"
   - Authorize Railway

3. **Select Repository**
   - Choose your GitHub repository
   - Railway will auto-detect `server.mjs`

4. **Add Environment Variables**
   - Go to "Variables"
   - Add:
     ```
     EMAIL_USER=AuthorFSK@gmail.com
     EMAIL_PASSWORD=peed qvhs ekmo kisv
     EMAIL_FROM=AuthorFSK@gmail.com
     EMAIL_SERVICE=gmail
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for completion
   - Get your URL

6. **Update Cloudflare**
   ```bash
   wrangler pages secret put BACKEND_URL
   ```
   - Paste your Railway URL

7. **Test**
   - Create newsletter
   - Send it
   - Check email

## What Gets Deployed

Railway will deploy:
- `server.mjs` - Your backend server
- `package.json` - Dependencies
- `.env` variables - Configuration

## After Deployment

### Your Backend URL
```
https://your-app.railway.app
```

### Update Cloudflare
```bash
wrangler pages secret put BACKEND_URL
```

Paste your Railway URL when prompted.

### Test Newsletter Sending
1. Go to Admin Dashboard
2. Create a newsletter
3. Send it
4. Check your email inbox

## Monitoring

### Check Backend Status
- Go to Railway dashboard
- Click your project
- View logs
- Check deployment status

### Check Email Logs
- Look for "Email sent to [email]"
- Look for errors
- Verify emails are being sent

### Check Cloudflare
- Cloudflare Pages → Functions → Logs
- Look for backend calls
- Verify connection is working

## Troubleshooting

### Deployment Failed
- Check Railway logs
- Verify environment variables
- Check `server.mjs` exists
- Check `package.json` exists

### Emails Not Sending
- Check Railway logs for errors
- Verify environment variables are set
- Check Gmail account for security alerts
- Verify backend URL in Cloudflare

### Can't Find Backend URL
- Go to Railway dashboard
- Click your project
- Look for "Domains" or "URL"
- Copy the URL

### Backend Keeps Crashing
- Check Railway logs
- Look for error messages
- Verify environment variables
- Check Gmail credentials

## Environment Variables

Make sure these are set in Railway:

```
EMAIL_USER=AuthorFSK@gmail.com
EMAIL_PASSWORD=peed qvhs ekmo kisv
EMAIL_FROM=AuthorFSK@gmail.com
EMAIL_SERVICE=gmail
```

These are required for Gmail to work.

## Costs

### Railway
- Free tier: $5/month credit
- Your backend: ~$0-2/month
- Total: Free for first few months

### Render
- Free tier: Limited
- Starter: $7/month
- Your backend: ~$7/month

### Heroku
- Paid only: $7/month
- Your backend: ~$7/month

## Keep Backend Running

All services keep your backend running 24/7 automatically.

## Next Steps

1. Choose deployment service (Railway recommended)
2. Deploy backend
3. Get backend URL
4. Update Cloudflare with URL
5. Test newsletter sending
6. Done!

## Summary

**To deploy:**

1. Go to https://railway.app
2. Sign up with GitHub
3. Deploy your repository
4. Add environment variables
5. Get backend URL
6. Update Cloudflare
7. Test

**That's it!** Your newsletter system is now ready to send real emails in production.

## Support

- Railway docs: https://docs.railway.app
- Render docs: https://render.com/docs
- Heroku docs: https://devcenter.heroku.com

## Questions?

See specific deployment guides:
- `DEPLOY_BACKEND_RAILWAY.md` - Railway setup
- `DEPLOY_BACKEND_RENDER.md` - Render setup
