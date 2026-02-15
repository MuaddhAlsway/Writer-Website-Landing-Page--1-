# Backend & API Deployment Guide

Deploy your backend and API to Cloudflare Workers and Pages.

## Prerequisites

- Cloudflare account
- Wrangler CLI installed: `npm install -g wrangler`
- Logged in to Cloudflare: `wrangler login`

## Step 1: Setup Cloudflare Project

```bash
# Login to Cloudflare
wrangler login

# Verify you're logged in
wrangler whoami
```

## Step 2: Create D1 Database

```bash
# Create the database
wrangler d1 create newsletter-db

# Initialize the schema
wrangler d1 execute newsletter-db --file schema.sql

# Verify database
wrangler d1 info newsletter-db
```

## Step 3: Set Cloudflare Secrets

Store sensitive credentials as Cloudflare secrets (not in wrangler.toml):

```bash
# Set Gmail credentials
wrangler secret put EMAIL_PASSWORD
# Paste: bovnptattnqmehhp

wrangler secret put EMAIL_USER
# Paste: muaddhalsway@gmail.com

wrangler secret put EMAIL_FROM
# Paste: muaddhalsway@gmail.com

# Set Resend API key (if using Resend)
wrangler secret put RESEND_API_KEY
# Paste your Resend API key

# Verify secrets are set
wrangler secret list
```

## Step 4: Update wrangler.toml

Ensure your `wrangler.toml` has the correct configuration:

```toml
name = "author-fatima"
compatibility_date = "2024-12-18"
pages_build_output_dir = "dist"

[vars]
ENVIRONMENT = "production"
EMAIL_SERVICE = "gmail"
EMAIL_USER = "muaddhalsway@gmail.com"
EMAIL_FROM = "muaddhalsway@gmail.com"

[[d1_databases]]
binding = "DB"
database_name = "newsletter-db"
database_id = "newsletter-db"

[env.production]
name = "author-fatima-prod"

[env.production.vars]
ENVIRONMENT = "production"
EMAIL_SERVICE = "gmail"
EMAIL_USER = "muaddhalsway@gmail.com"
EMAIL_FROM = "muaddhalsway@gmail.com"
```

## Step 5: Build Frontend

```bash
npm run build
```

This creates the `dist` folder with your frontend.

## Step 6: Deploy to Cloudflare Pages

### Option A: Using Wrangler CLI

```bash
# Deploy to Cloudflare Pages
wrangler pages deploy dist
```

### Option B: Using GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to Cloudflare Dashboard → Pages
3. Click "Create a project" → "Connect to Git"
4. Select your repository
5. Set build command: `npm run build`
6. Set build output: `dist`
7. Click "Save and Deploy"

## Step 7: Deploy Backend Functions

```bash
# Deploy Workers and Functions
wrangler deploy
```

This deploys:
- API routes in `functions/api/[[route]].ts`
- Middleware in `functions/_middleware.ts`
- Email sending function in `functions/make-server-53bed28f/send-email.ts`

## Step 8: Verify Deployment

```bash
# Check deployment status
wrangler deployments list

# View logs
wrangler tail

# Test API endpoint
curl https://your-domain.com/make-server-53bed28f/health
```

## Step 9: Configure Custom Domain (Optional)

1. Go to Cloudflare Dashboard
2. Select your Pages project
3. Go to Settings → Custom domains
4. Add your custom domain
5. Update DNS records as instructed

## Environment Variables Reference

### Required Variables
- `EMAIL_SERVICE`: "gmail" or "resend"
- `EMAIL_USER`: Gmail address
- `EMAIL_FROM`: From email address
- `EMAIL_PASSWORD`: Gmail app password (stored as secret)
- `RESEND_API_KEY`: Resend API key (if using Resend)

### Optional Variables
- `ENVIRONMENT`: "production" or "development"
- `DATABASE_URL`: D1 database connection string

## Troubleshooting

### Database Connection Issues
```bash
# Check database binding
wrangler d1 info newsletter-db

# Execute test query
wrangler d1 execute newsletter-db --command "SELECT COUNT(*) FROM subscribers;"
```

### Email Sending Failures
```bash
# Check email configuration
wrangler secret list

# View logs for errors
wrangler tail --format pretty
```

### Deployment Errors
```bash
# Clear build cache
rm -rf dist

# Rebuild
npm run build

# Redeploy
wrangler deploy
```

## Post-Deployment Checklist

- [ ] Database created and initialized
- [ ] Secrets set in Cloudflare
- [ ] Frontend deployed to Pages
- [ ] Backend functions deployed
- [ ] API endpoints responding
- [ ] Email service working
- [ ] Custom domain configured (if applicable)
- [ ] SSL/TLS enabled
- [ ] Monitoring and logs configured

## API Endpoints After Deployment

```
Health Check:
GET https://your-domain.com/make-server-53bed28f/health

Subscribers:
POST   https://your-domain.com/make-server-53bed28f/subscribers
GET    https://your-domain.com/make-server-53bed28f/subscribers
GET    https://your-domain.com/make-server-53bed28f/subscribers/stats
DELETE https://your-domain.com/make-server-53bed28f/subscribers/:email

Newsletters:
POST   https://your-domain.com/make-server-53bed28f/newsletters
GET    https://your-domain.com/make-server-53bed28f/newsletters
POST   https://your-domain.com/make-server-53bed28f/newsletters/:id/send
DELETE https://your-domain.com/make-server-53bed28f/newsletters/:id

Email:
POST https://your-domain.com/make-server-53bed28f/send-email
```

## Next Steps

1. Update frontend API client to use production domain
2. Configure email templates
3. Set up monitoring and alerts
4. Test all functionality in production
5. Update DNS records if using custom domain

---

For more help, see:
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
