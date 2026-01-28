# Deploy Newsletter App on Cloudflare Pages

## Overview

Your newsletter app is now configured for deployment on Cloudflare Pages with:
- **Frontend:** React app hosted on Cloudflare Pages
- **Backend:** Cloudflare Workers (serverless functions)
- **Database:** Cloudflare D1 (SQLite)
- **Email:** Resend API

---

## Prerequisites

1. **Cloudflare Account** - https://dash.cloudflare.com
2. **GitHub Account** - For connecting your repository
3. **Wrangler CLI** - Cloudflare's command-line tool
4. **Node.js** - v18 or higher

---

## Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

Verify installation:
```bash
wrangler --version
```

---

## Step 2: Authenticate with Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate. Follow the prompts.

---

## Step 3: Create D1 Database

```bash
wrangler d1 create newsletter-db
```

This will output your database ID. Save it for later.

---

## Step 4: Initialize Database Schema

```bash
wrangler d1 execute newsletter-db --file schema.sql
```

This creates all necessary tables.

---

## Step 5: Update wrangler.toml

Edit `wrangler.toml` and replace:
- `account_id` - Your Cloudflare account ID (from dashboard)
- `database_id` - The ID from Step 3

Find your account ID:
1. Go to https://dash.cloudflare.com
2. Click your profile icon → Accounts
3. Copy the Account ID

---

## Step 6: Set Environment Variables

Create `.env.production` with:

```env
RESEND_API_KEY=re_BsDneXUF_MgwUamRU1qnPHNCnDwGnrZ72
FROM_EMAIL=noreply@news.example.com
```

Add to Cloudflare:
```bash
wrangler secret put RESEND_API_KEY
# Paste: re_BsDneXUF_MgwUamRU1qnPHNCnDwGnrZ72

wrangler secret put FROM_EMAIL
# Paste: noreply@news.example.com
```

---

## Step 7: Deploy to Cloudflare Pages

### Option A: Using GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Cloudflare deployment"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to https://dash.cloudflare.com
   - Pages → Create a project
   - Connect to GitHub
   - Select your repository
   - Configure build settings:
     - **Build command:** `npm run build`
     - **Build output directory:** `dist`
     - **Root directory:** `/`

3. **Add Environment Variables**
   - In Pages settings → Environment variables
   - Add `RESEND_API_KEY` and `FROM_EMAIL`

4. **Deploy**
   - Click "Save and Deploy"
   - Your app will be live at `https://your-project.pages.dev`

### Option B: Using Wrangler CLI

```bash
# Build the app
npm run build

# Deploy Workers
wrangler deploy

# Deploy to Pages (if using Pages directly)
wrangler pages deploy dist
```

---

## Step 8: Verify Deployment

1. **Check Pages Deployment**
   - Go to https://dash.cloudflare.com → Pages
   - Your project should show "Active"

2. **Check Workers Deployment**
   - Go to https://dash.cloudflare.com → Workers
   - Your functions should be deployed

3. **Test API Endpoints**
   ```bash
   curl https://your-project.pages.dev/make-server-53bed28f/health
   ```

   Should return: `{"status":"ok"}`

---

## Step 9: Configure Custom Domain (Optional)

1. Go to Pages → Your project → Custom domains
2. Add your domain
3. Follow DNS setup instructions
4. Update FROM_EMAIL to use your domain

---

## Step 10: Verify Domain for Resend (Important!)

To send emails to all subscribers:

1. Go to https://app.resend.com/domains
2. Add your domain
3. Follow DNS verification steps
4. Once verified, emails will send to all recipients

---

## File Structure

```
your-project/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── components/
│   ├── main.tsx
│   └── styles/
├── functions/
│   └── api/
│       └── [[route]].ts          # API endpoints
├── wrangler.toml                 # Cloudflare config
├── schema.sql                    # Database schema
├── vite.config.ts               # Build config
├── package.json
└── .env.production              # Production env vars
```

---

## Environment Variables

### Required
- `RESEND_API_KEY` - Your Resend API key
- `FROM_EMAIL` - Email address to send from

### Optional
- `ENVIRONMENT` - Set to "production"

---

## Database Bindings

The D1 database is automatically bound as `DB` in your Worker functions.

Access it in your code:
```typescript
const { results } = await env.DB.prepare(
  'SELECT * FROM subscribers'
).all();
```

---

## API Endpoints

All endpoints are available at:
```
https://your-project.pages.dev/make-server-53bed28f/
```

### Available Endpoints

- `GET /health` - Health check
- `POST /subscribers` - Add subscriber
- `GET /subscribers` - Get all subscribers
- `GET /subscribers/stats` - Get stats
- `DELETE /subscribers/:email` - Delete subscriber
- `POST /newsletters` - Create newsletter
- `GET /newsletters` - Get newsletters
- `POST /newsletters/:id/send` - Send newsletter
- `DELETE /newsletters/:id` - Delete newsletter
- `POST /send-email` - Send direct email

---

## Troubleshooting

### Database Connection Issues
```bash
# Check database status
wrangler d1 info newsletter-db

# Re-run schema
wrangler d1 execute newsletter-db --file schema.sql
```

### Environment Variables Not Working
```bash
# List all secrets
wrangler secret list

# Re-add a secret
wrangler secret put RESEND_API_KEY
```

### Build Failures
```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### API Not Responding
1. Check Workers logs: `wrangler tail`
2. Verify database binding in `wrangler.toml`
3. Check environment variables are set

---

## Monitoring

### View Logs
```bash
wrangler tail
```

### Check Analytics
- Go to https://dash.cloudflare.com → Pages → Your project
- View requests, errors, and performance

### Monitor Database
- Go to https://dash.cloudflare.com → D1
- View query performance and usage

---

## Scaling

Cloudflare automatically scales your app:
- **Pages:** Unlimited requests
- **Workers:** 100,000 requests/day (free tier)
- **D1:** Unlimited reads, 100,000 writes/day (free tier)

For higher limits, upgrade your Cloudflare plan.

---

## Cost

**Free Tier:**
- Pages: Unlimited
- Workers: 100,000 requests/day
- D1: Unlimited reads, 100,000 writes/day
- Resend: 100 emails/day

**Paid Plans:**
- Pages: $20/month
- Workers: $0.50 per million requests
- D1: $0.75 per million reads, $15 per million writes
- Resend: $20/month for 100,000 emails

---

## Next Steps

1. ✅ Deploy to Cloudflare Pages
2. ✅ Verify domain in Resend
3. ✅ Test newsletter sending
4. ✅ Monitor analytics
5. ✅ Scale as needed

---

## Support

- **Cloudflare Docs:** https://developers.cloudflare.com
- **Wrangler Docs:** https://developers.cloudflare.com/workers/wrangler
- **Resend Docs:** https://resend.com/docs
- **D1 Docs:** https://developers.cloudflare.com/d1

---

## Your Deployment URL

Once deployed, your app will be available at:
```
https://your-project.pages.dev
```

Admin dashboard:
```
https://your-project.pages.dev/admin
```

---

**You're ready to deploy! 🚀**
