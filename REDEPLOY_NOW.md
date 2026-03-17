# Redeploy to Cloudflare Pages - NOW

## Quick Deploy

Run this command to build and prepare for deployment:

```bash
npm run build
```

Then deploy using one of these methods:

### Option 1: Cloudflare Pages Dashboard
1. Go to https://dash.cloudflare.com
2. Select your Pages project
3. Go to "Deployments"
4. Click "Redeploy" on the latest deployment
5. Or connect your Git repo for automatic deployments

### Option 2: Wrangler CLI
```bash
npm install -g wrangler
wrangler pages deploy dist
```

### Option 3: Git Push (if connected)
```bash
git add .
git commit -m "Fix Turso integration - use backend proxy"
git push
```

## What Gets Deployed

✅ Updated `functions/api/subscribers.ts` - Now proxies to backend
✅ Removed `functions/api/stats.ts` - Stats endpoint deleted
✅ Updated admin dashboards - Stats display removed
✅ Updated API client - Stats method removed

## After Deployment

1. **Wait 1-2 minutes** for deployment to complete
2. **Visit your admin dashboard**
3. **Check browser console** for any errors
4. **Try adding a subscriber** to test the flow
5. **View subscribers list** to verify it works

## Expected Results

✅ Admin dashboard loads without errors
✅ No "Turso not configured" messages
✅ No "Failed to get stats" errors
✅ Subscribers list displays correctly
✅ Can add/delete subscribers

## If Something Goes Wrong

1. **Check Cloudflare Pages logs**:
   - Dashboard → Pages → Your Project → Deployments → View Build Log

2. **Check backend is running**:
   - Verify Vercel backend is deployed and running
   - Check backend logs for database errors

3. **Verify backend URL**:
   - Check `wrangler.toml` has correct `BACKEND_URL`
   - Should be your Vercel backend URL

4. **Check backend environment variables**:
   - Vercel Dashboard → Settings → Environment Variables
   - Verify `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` are set

## Deployment Status

After deployment, you should see:
- ✅ Build successful
- ✅ Deployment live
- ✅ Admin dashboard accessible
- ✅ No database errors

---

**Ready to deploy?** Run `npm run build` now!
