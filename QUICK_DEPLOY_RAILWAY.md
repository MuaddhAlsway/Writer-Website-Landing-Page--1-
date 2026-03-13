# Deploy Backend to Railway (5 minutes)

## Step 1: Create Railway Account
- Go to https://railway.app
- Click "Start Project"
- Select "Deploy from GitHub"
- Connect your GitHub account

## Step 2: Select Repository
- Choose this repository
- Railway will auto-detect Node.js

## Step 3: Add Environment Variables
In Railway dashboard, click "Variables" and add:

```
EMAIL_USER=AuthorFSK@gmail.com
EMAIL_PASSWORD=peed qvhs ekmo kisv
NODE_ENV=production
```

## Step 4: Deploy
- Railway deploys automatically
- Wait for "Deployment Successful"
- Copy the public URL (e.g., `https://your-app.railway.app`)

## Step 5: Update Cloudflare
Edit `wrangler.toml`:
```
BACKEND_URL = "https://your-app.railway.app"
```

Then deploy:
```bash
npm run build
wrangler pages deploy dist
```

## Done!
Your emails will now send via Gmail SMTP through Railway backend.
