# Deploy Backend to Render (Free)

## Steps

1. **Go to https://render.com**
2. **Sign up with GitHub**
3. **Create new Web Service**
4. **Connect your GitHub repository**
5. **Select this repository**
6. **Configure:**
   - Name: `author-fatima-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node backend-server.mjs`
   - Plan: **Free**

7. **Add Environment Variables:**
   - `EMAIL_USER` = `AuthorFSK@gmail.com`
   - `EMAIL_PASSWORD` = `peed qvhs ekmo kisv`
   - `NODE_ENV` = `production`

8. **Deploy** - Render will auto-deploy

9. **Get your URL** - Copy the service URL (e.g., `https://author-fatima-backend.onrender.com`)

10. **Update wrangler.toml:**
    ```
    BACKEND_URL = "https://author-fatima-backend.onrender.com"
    ```

11. **Redeploy frontend:**
    ```bash
    npm run build
    wrangler pages deploy dist
    ```

## That's it!

Your emails will now be sent via Gmail SMTP using your app password through the Render backend.

## Free Tier Limits

- 750 hours/month (enough for always-on service)
- Auto-spins down after 15 min of inactivity (wakes up on request)
- Perfect for email sending

## Testing

Once deployed, test:
```bash
curl -X POST https://your-render-url.onrender.com/make-server-53bed28f/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["test@example.com"],
    "subject": "Test",
    "content": "<h1>Hello</h1>"
  }'
```
