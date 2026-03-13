# Deploy Backend to Railway

## Quick Start

1. **Go to Railway.app**
   - Visit https://railway.app
   - Sign up or login with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Connect your GitHub account
   - Select this repository

3. **Configure Environment Variables**
   - In Railway dashboard, go to Variables
   - Add these variables:
     ```
     EMAIL_USER=AuthorFSK@gmail.com
     EMAIL_PASSWORD=peed qvhs ekmo kisv
     NODE_ENV=production
     PORT=3002
     ```

4. **Deploy**
   - Railway will automatically deploy when you push to GitHub
   - Wait for deployment to complete
   - Copy the public URL (e.g., https://your-app.railway.app)

5. **Update Cloudflare Configuration**
   - Update `wrangler.toml` with your Railway URL:
     ```
     BACKEND_URL = "https://your-app.railway.app"
     ```
   - Redeploy frontend: `wrangler pages deploy dist`

## Environment Variables

- `EMAIL_USER`: Your Gmail address (AuthorFSK@gmail.com)
- `EMAIL_PASSWORD`: Your Gmail app password (16 characters, no spaces)
- `PORT`: Server port (default: 3002)
- `NODE_ENV`: Set to "production"

## Testing

Once deployed, test the email endpoint:

```bash
curl -X POST https://your-app.railway.app/make-server-53bed28f/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["test@example.com"],
    "subject": "Test Email",
    "content": "<h1>Hello</h1><p>This is a test email</p>"
  }'
```

## Logs

View logs in Railway dashboard:
- Click your project
- Go to "Deployments"
- Click the active deployment
- View logs in real-time

## Troubleshooting

If emails aren't sending:
1. Check environment variables are set correctly
2. Verify Gmail app password is correct (16 chars, no spaces)
3. Check Railway logs for errors
4. Ensure 2FA is enabled on Gmail account
5. Verify app password was generated in Gmail settings
