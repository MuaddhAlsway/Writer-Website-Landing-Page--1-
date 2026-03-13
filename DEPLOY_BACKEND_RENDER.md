# Deploy Backend to Render

Render is another easy option to deploy your Node.js backend server.

## Step 1: Create Render Account

1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub (recommended)
4. Authorize Render

## Step 2: Create New Service

1. Click "New +"
2. Select "Web Service"
3. Connect your GitHub repository
4. Select your repository

## Step 3: Configure Service

1. **Name:** `author-fatima-backend`
2. **Environment:** `Node`
3. **Build Command:** `npm install`
4. **Start Command:** `node server.mjs`
5. **Plan:** Free (or Starter for production)

## Step 4: Add Environment Variables

1. Scroll to "Environment"
2. Add these variables:

```
EMAIL_USER=AuthorFSK@gmail.com
EMAIL_PASSWORD=peed qvhs ekmo kisv
EMAIL_FROM=AuthorFSK@gmail.com
EMAIL_SERVICE=gmail
```

## Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Get your backend URL from Render dashboard

## Step 6: Update Cloudflare

1. Go to Cloudflare Pages
2. Set environment variable:
   ```bash
   wrangler pages secret put BACKEND_URL
   ```
3. Paste your Render URL (e.g., `https://author-fatima-backend.onrender.com`)

## Step 7: Test

1. Go to Admin Dashboard
2. Create a newsletter
3. Send it
4. Check your email inbox

## Done! ✅

Your backend is now deployed and your newsletter system is ready to send real emails.

## Render URL Format

Your backend URL will be something like:
```
https://author-fatima-backend.onrender.com
```

Use this URL in Cloudflare.

## Troubleshooting

### Deployment failed?
- Check Render logs
- Verify environment variables are set
- Check `server.mjs` exists

### Emails not sending?
- Check Render logs for errors
- Verify environment variables
- Check Gmail account for security alerts

### Can't find backend URL?
- Go to Render dashboard
- Click your service
- Look for "URL" at the top
- Copy the URL

## Keep Backend Running

Render keeps your backend running 24/7 automatically.

## Costs

- Render free tier: Limited
- Starter plan: $7/month
- Your backend should cost ~$7/month

## Next Steps

1. Deploy to Render
2. Get backend URL
3. Update Cloudflare with URL
4. Test newsletter sending
5. Done!
