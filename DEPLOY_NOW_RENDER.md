# Deploy to Render NOW - Quick Action Guide

## What You Need to Do

### 1. Go to Render
- Visit https://render.com
- Sign up with GitHub
- Authorize Render

### 2. Create Web Service
- Click "New +"
- Select "Web Service"
- Select your GitHub repo
- Click "Connect"

### 3. Configure
- **Name**: `email-server`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server-standalone.mjs`
- **Instance Type**: `Free`

### 4. Add Environment Variables
```
GMAIL_USER = AuthorFSK@gmail.com
GMAIL_APP_PASSWORD = peed qvhs ekmo kisv
NODE_ENV = production
```

### 5. Deploy
- Click "Create Web Service"
- Wait 3-5 minutes
- Copy the URL (looks like: https://email-server-production.onrender.com)

### 6. Update wrangler.toml
Replace this line:
```toml
BACKEND_URL = "https://email-server-production.up.railway.app"
```

With your Render URL:
```toml
BACKEND_URL = "https://email-server-production.onrender.com"
```

### 7. Deploy Frontend
```bash
npm run build
npm run deploy:pages
```

### 8. Test
```bash
curl https://email-server-production.onrender.com/health
curl https://email-server-production.onrender.com/verify-connection
```

### 9. Done!
Go to your Cloudflare Pages URL and test sending emails.

---

## Why Render?
- ✅ More reliable than Railway
- ✅ Easier setup
- ✅ Better logs
- ✅ Free tier is generous
- ✅ Auto-deploys on GitHub push

