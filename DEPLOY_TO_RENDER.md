# Deploy to Render (Alternative to Railway)

Render is a reliable alternative to Railway. It's often more stable and easier to deploy.

---

## Step 1: Create Render Account

1. Go to https://render.com
2. Click "Sign up"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your GitHub

---

## Step 2: Create New Web Service

1. Click "New +"
2. Select "Web Service"
3. Select your GitHub repository
4. Click "Connect"

---

## Step 3: Configure Service

Fill in the form:

**Name:** `email-server`

**Environment:** `Node`

**Build Command:** `npm install`

**Start Command:** `node server-standalone.mjs`

**Instance Type:** `Free` (or paid if needed)

---

## Step 4: Add Environment Variables

1. Scroll down to "Environment"
2. Click "Add Environment Variable"
3. Add these variables:

```
GMAIL_USER = AuthorFSK@gmail.com
GMAIL_APP_PASSWORD = peed qvhs ekmo kisv
NODE_ENV = production
```

**Make sure all three are added!**

---

## Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically deploy
3. Wait for deployment to complete (3-5 minutes)
4. You'll see a green checkmark when done

---

## Step 6: Get Your URL

1. In Render dashboard, click your service
2. Look at the top - you'll see a URL like:
```
https://email-server-production.onrender.com
```

Copy this URL.

---

## Step 7: Update wrangler.toml

Edit `wrangler.toml`:

```toml
[vars]
BACKEND_URL = "https://email-server-production.onrender.com"
```

Replace with your actual Render URL.

---

## Step 8: Deploy Frontend

```bash
npm run build
npm run deploy:pages
```

---

## Step 9: Test

```bash
# Test backend
curl https://email-server-production.onrender.com/health

# Test Gmail connection
curl https://email-server-production.onrender.com/verify-connection

# Test email sending
curl -X POST https://email-server-production.onrender.com/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["your-email@gmail.com"],
    "subject": "Test",
    "message": "<p>Test email</p>"
  }'
```

---

## Advantages of Render

✅ **Easier Setup**: Simpler configuration than Railway
✅ **Better Logs**: Clearer error messages
✅ **Free Tier**: Generous free tier
✅ **Reliable**: Very stable platform
✅ **Auto-Deploy**: Automatically deploys on GitHub push

---

## Troubleshooting

### Deployment Failed

**Check logs:**
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. Look for error messages

**Common issues:**
- Missing environment variables
- Incorrect start command
- Missing dependencies in package.json

### Backend Not Responding

```bash
curl https://email-server-production.onrender.com/health
```

If it fails:
1. Check Render logs
2. Verify environment variables
3. Restart service

### Emails Not Sending

```bash
curl https://email-server-production.onrender.com/verify-connection
```

If it fails:
1. Check GMAIL_USER
2. Check GMAIL_APP_PASSWORD
3. Create new app password

---

## Verify Deployment

### 1. Health Check
```bash
curl https://email-server-production.onrender.com/health
```
Should return: `{"status":"ok","service":"email-server"}`

### 2. Gmail Connection
```bash
curl https://email-server-production.onrender.com/verify-connection
```
Should return: `{"success":true,"message":"Gmail SMTP connected"}`

### 3. Send Email
```bash
curl -X POST https://email-server-production.onrender.com/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["test@gmail.com"],
    "subject": "Test",
    "message": "<p>Test</p>"
  }'
```
Should return: `{"success":true,"sent":1,"failed":0,"total":1}`

---

## Update Code

When you update the backend:

1. Make changes to `server-standalone.mjs`
2. Commit and push:
   ```bash
   git add server-standalone.mjs
   git commit -m "Update email server"
   git push
   ```
3. Render automatically redeploys
4. Wait for deployment to complete

---

## Cost

Render pricing:
- **Free tier**: 750 hours/month (enough for always-on service)
- **Paid**: $7/month for more resources
- **Email server**: Free tier is usually sufficient

---

## Comparison: Railway vs Render

| Feature | Railway | Render |
|---------|---------|--------|
| Setup | Medium | Easy |
| Logs | Good | Excellent |
| Reliability | Good | Excellent |
| Free Tier | $5 credit | 750 hours |
| Auto-Deploy | Yes | Yes |
| Support | Discord | Email |

**Recommendation: Use Render if Railway fails**

---

## Quick Checklist

- [ ] Render account created
- [ ] GitHub connected
- [ ] Web Service created
- [ ] Environment variables added (all 3)
- [ ] Start command set: `node server-standalone.mjs`
- [ ] Deployment successful
- [ ] Backend URL copied
- [ ] wrangler.toml updated
- [ ] Frontend deployed
- [ ] Backend health check works
- [ ] Gmail connection verified
- [ ] Test email sent

---

## Support

Render support:
- Documentation: https://render.com/docs
- Status: https://status.render.com
- Email: support@render.com
