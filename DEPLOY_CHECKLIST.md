# Deployment Checklist

## Pre-Deployment

- [ ] `server.mjs` exists in repository
- [ ] `package.json` exists in repository
- [ ] `.env` file has Gmail credentials
- [ ] GitHub repository is up to date
- [ ] All code changes are committed

## Choose Service

- [ ] Decide on Railway, Render, or Heroku
- [ ] Create account on chosen service
- [ ] Connect GitHub account

## Deploy Backend

- [ ] Create new project/service
- [ ] Select your repository
- [ ] Configure build command: `npm install`
- [ ] Configure start command: `node server.mjs`
- [ ] Add environment variables:
  - [ ] `EMAIL_USER=AuthorFSK@gmail.com`
  - [ ] `EMAIL_PASSWORD=peed qvhs ekmo kisv`
  - [ ] `EMAIL_FROM=AuthorFSK@gmail.com`
  - [ ] `EMAIL_SERVICE=gmail`
- [ ] Deploy
- [ ] Wait for deployment to complete
- [ ] Get backend URL

## Update Cloudflare

- [ ] Copy backend URL from deployment service
- [ ] Run: `wrangler pages secret put BACKEND_URL`
- [ ] Paste backend URL
- [ ] Verify secret is set

## Test

- [ ] Go to Admin Dashboard
- [ ] Create a test newsletter
- [ ] Send newsletter
- [ ] Check email inbox
- [ ] Verify email received
- [ ] Check email formatting
- [ ] Test with Arabic content

## Monitor

- [ ] Check deployment service logs
- [ ] Verify backend is running
- [ ] Check for errors
- [ ] Monitor email sending

## Done!

- [ ] Backend deployed ✅
- [ ] Cloudflare updated ✅
- [ ] Newsletter sending works ✅
- [ ] Emails received ✅

## Troubleshooting

If something doesn't work:

1. Check deployment service logs
2. Verify environment variables
3. Check Gmail account
4. Check Cloudflare logs
5. Verify backend URL in Cloudflare

## Next Steps

- [ ] Deploy backend
- [ ] Update Cloudflare
- [ ] Test newsletter
- [ ] Monitor emails
- [ ] Done!
