# Deploy Backend to Vercel - Quick Guide

## ⚡ 5-Minute Setup

### Step 1: Go to Vercel (1 minute)

1. Open https://vercel.com
2. Click "Sign Up" or "Log In"
3. Choose "GitHub" to sign in

### Step 2: Import Project (1 minute)

1. Click "Add New..." → "Project"
2. Find your GitHub repository
3. Click "Import"

### Step 3: Set Environment Variables (2 minutes)

In the "Environment Variables" section, add:

```
EMAIL_USER = AuthorFSK@gmail.com
EMAIL_PASSWORD = peed qvhs ekmo kisv
NODE_ENV = production
PORT = 3001
```

Click "Add" for each one.

### Step 4: Deploy (1 minute)

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. You'll see: "Congratulations! Your project has been successfully deployed"

### Step 5: Get Your Backend URL

1. Go to "Deployments" tab
2. Click on the latest deployment
3. Copy the URL (e.g., `https://email-server-production.vercel.app`)

---

## 🔧 Update wrangler.toml

Edit `wrangler.toml`:

```toml
[env.production.vars]
ENVIRONMENT = "production"
BACKEND_URL = "https://email-server-production.vercel.app"  # ← YOUR VERCEL URL
FRONTEND_URL = "https://author-fatima-76r-339.pages.dev"
```

Replace `email-server-production` with your actual Vercel project name.

---

## 📤 Deploy Frontend

```bash
npm run build
npm run deploy:pages
```

---

## ✅ Test It Works

```bash
# Test backend health
curl https://email-server-production.vercel.app/health

# Should return:
# {"status":"ok","service":"email-backend","timestamp":"..."}

# Test email sending
curl -X POST https://email-server-production.vercel.app/make-server-53bed28f/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["test@gmail.com"],
    "subject": "Test Email",
    "content": "<p>This is a test email</p>"
  }'

# Should return:
# {"success":true,"message":"Sent to 1 recipients, 0 failed",...}
```

---

## 🎯 Done!

Your backend is now deployed on Vercel and emails will work! ✅

---

**Total time: 5 minutes**
