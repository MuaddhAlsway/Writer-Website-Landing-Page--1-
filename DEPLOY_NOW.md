# Deploy Backend Now - 5 Minutes

## The Easiest Way: Railway

### Step 1: Go to Railway (1 minute)
```
https://railway.app
```

### Step 2: Sign Up (1 minute)
- Click "Start Project"
- Select "Deploy from GitHub"
- Sign in with GitHub
- Authorize Railway

### Step 3: Deploy (1 minute)
- Select your repository
- Railway auto-detects `server.mjs`
- Click "Deploy"

### Step 4: Add Environment Variables (1 minute)
In Railway dashboard:
1. Go to "Variables"
2. Add:
   ```
   EMAIL_USER=AuthorFSK@gmail.com
   EMAIL_PASSWORD=peed qvhs ekmo kisv
   EMAIL_FROM=AuthorFSK@gmail.com
   EMAIL_SERVICE=gmail
   ```

### Step 5: Update Cloudflare (1 minute)
```bash
wrangler pages secret put BACKEND_URL
```

When prompted, paste your Railway URL (e.g., `https://your-app.railway.app`)

## Done! ✅

Your backend is now deployed and your newsletter system is ready to send real emails.

## Test It

1. Go to Admin Dashboard
2. Create a newsletter
3. Send it
4. Check your email inbox

## That's It!

Your newsletter system is now fully deployed and sending real emails via Gmail.

## Need Help?

- Railway docs: https://docs.railway.app
- See: `DEPLOY_COMPLETE_GUIDE.md` for detailed guide
- See: `DEPLOY_BACKEND_RAILWAY.md` for step-by-step
