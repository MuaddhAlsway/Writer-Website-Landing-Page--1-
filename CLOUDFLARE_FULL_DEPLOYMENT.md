# 🚀 Full Cloudflare Deployment Guide

## What We've Set Up

✅ **Frontend**: React app on Cloudflare Pages  
✅ **Backend**: API endpoints as Cloudflare Pages Functions  
✅ **Database**: KV storage for subscribers and newsletters  
✅ **Email**: Resend integration for sending emails  

---

## Step 1: Create KV Namespaces

You need to create two KV namespaces for storing data:

```bash
# Create subscribers namespace
wrangler kv:namespace create "SUBSCRIBERS_KV"

# Create newsletters namespace
wrangler kv:namespace create "NEWSLETTERS_KV"
```

This will output something like:
```
✨ Successfully created kv namespace with id: abc123def456
```

Copy the IDs and update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "SUBSCRIBERS_KV"
id = "abc123def456"
preview_id = "abc123def456"

[[kv_namespaces]]
binding = "NEWSLETTERS_KV"
id = "xyz789uvw012"
preview_id = "xyz789uvw012"
```

---

## Step 2: Set Environment Variables

In Cloudflare Dashboard:

1. Go to **Pages** → **author-fatima**
2. Click **Settings** → **Environment variables**
3. Add for **Production**:
   - `RESEND_API_KEY`: `re_BsDneXUF_MgwUamRU1qnPHNCnDwGnrZ72`
   - `FROM_EMAIL`: `noreply@news.example.com`
   - `EMAIL_SERVICE_PROVIDER`: `resend`

4. Add for **Preview**:
   - Same values as above

---

## Step 3: Deploy

```bash
# Build and deploy
npm run build
npm run deploy:pages
```

---

## Step 4: Verify Deployment

Visit: `https://author-fatima.pages.dev/`

Test the API:
```bash
# Health check
curl https://author-fatima.pages.dev/make-server-53bed28f/health

# Should return: {"status":"ok"}
```

---

## Project Structure

```
functions/
├── _middleware.ts                    # CORS headers
├── make-server-53bed28f/
│   ├── health.ts                    # Health check
│   ├── subscribers.ts               # Subscriber management
│   ├── newsletters.ts               # Newsletter management
│   ├── send-email.ts                # Send emails
│   └── subscribers-stats.ts         # Get stats
dist/
├── index.html                       # React app
└── assets/                          # CSS, JS, images
```

---

## API Endpoints

All endpoints are now available at your Cloudflare Pages URL:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/make-server-53bed28f/health` | GET | Health check |
| `/make-server-53bed28f/subscribers` | POST | Add subscriber |
| `/make-server-53bed28f/subscribers` | GET | List subscribers |
| `/make-server-53bed28f/subscribers/stats` | GET | Get stats |
| `/make-server-53bed28f/newsletters` | POST | Create newsletter |
| `/make-server-53bed28f/newsletters` | GET | List newsletters |
| `/make-server-53bed28f/newsletters/:id/send` | POST | Send newsletter |
| `/make-server-53bed28f/send-email` | POST | Send direct email |

---

## Features

✅ **Subscribers Management**
- Add subscribers
- List all subscribers
- Get subscriber stats
- Welcome emails sent automatically

✅ **Newsletter System**
- Create newsletters with rich text
- Send to all subscribers
- Track send status
- Rate limiting (500ms between sends)

✅ **Email Service**
- Powered by Resend
- HTML email templates
- Automatic rate limiting
- Error handling

✅ **Data Storage**
- KV storage for subscribers
- KV storage for newsletters
- Persistent across deployments

---

## Testing

### Test Subscriber Signup
```bash
curl -X POST https://author-fatima.pages.dev/make-server-53bed28f/subscribers \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","language":"en"}'
```

### Test Newsletter Creation
```bash
curl -X POST https://author-fatima.pages.dev/make-server-53bed28f/newsletters \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{"title":"Test","content":"Hello","language":"en"}'
```

---

## Troubleshooting

### KV Namespace Not Found
- Make sure you created the namespaces
- Verify IDs in `wrangler.toml`
- Redeploy after updating

### API Returns HTML Error
- Check environment variables are set
- Verify RESEND_API_KEY is correct
- Check Cloudflare dashboard for errors

### Emails Not Sending
- Verify RESEND_API_KEY is set
- Check FROM_EMAIL is correct
- Verify domain in Resend dashboard

### CORS Errors
- Middleware is configured to allow all origins
- Check browser console for specific errors

---

## Next Steps

1. ✅ Create KV namespaces
2. ✅ Set environment variables
3. ✅ Deploy to Cloudflare
4. ✅ Test API endpoints
5. ✅ Verify domain in Resend
6. ✅ Send test newsletter

---

## Monitoring

View logs:
```bash
wrangler tail
```

Or in Cloudflare Dashboard:
1. Go to **Pages** → **author-fatima**
2. Click **Deployments**
3. View logs for each deployment

---

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare KV Docs](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Cloudflare Functions Docs](https://developers.cloudflare.com/pages/functions/)
- [Resend Docs](https://resend.com/docs)

---

## Your App is Ready! 🎉

Everything is now deployed on Cloudflare:
- Frontend on Pages
- Backend as Functions
- Data in KV storage
- Emails via Resend

**Visit**: `https://author-fatima.pages.dev/`
