# Backend Deployment Guide

Your backend API is ready to deploy. Here are your options:

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Set up Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Find your project "author-fatima-76r"
3. Go to Settings → Environment Variables
4. Add these variables:
   - `GMAIL_USER`: `AuthorFSK@gmail.com`
   - `GMAIL_APP_PASSWORD`: `peed qvhs ekmo kisv`
   - `NODE_ENV`: `production`

### Step 2: Deploy

```bash
vercel deploy --prod
```

The backend will be available at: `https://your-project.vercel.app/api`

---

## Option 2: Deploy to Railway

### Step 1: Create a Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub" or "Deploy from Repo"
4. Connect your repository

### Step 2: Add Environment Variables

In Railway dashboard:
- `GMAIL_USER`: `AuthorFSK@gmail.com`
- `GMAIL_APP_PASSWORD`: `peed qvhs ekmo kisv`
- `NODE_ENV`: `production`

### Step 3: Deploy

```bash
railway deploy
```

---

## Option 3: Run Locally (Development)

```bash
npm run server
```

The backend will run on `http://localhost:3002`

---

## API Endpoints

Once deployed, your backend provides these endpoints:

### Email Sending
- `POST /api/send-email` - Send email to recipients
- `POST /api/send-newsletter` - Send newsletter with HTML template

### Subscribers
- `POST /api/subscribers` - Add subscriber
- `GET /api/subscribers` - Get all subscribers
- `DELETE /api/subscribers/:email` - Remove subscriber

### Stats
- `GET /api/stats` - Get subscriber statistics

### Health Check
- `GET /api/health` - Check if backend is running

---

## Frontend Configuration

Your frontend is already configured to use the backend API:

**Development**: `http://localhost:3002`
**Production**: Update `wrangler.toml` with your deployed backend URL

```toml
BACKEND_URL = "https://your-backend-url.com"
VITE_BACKEND_URL = "https://your-backend-url.com"
```

Then rebuild and redeploy:
```bash
npm run build
npm run deploy:pages
```

---

## Testing the Backend

### Test locally:
```bash
npm run server
```

Then in another terminal:
```bash
curl -X POST http://localhost:3002/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["test@example.com"],
    "subject": "Test Email",
    "content": "<p>This is a test email</p>"
  }'
```

### Test production:
Replace `http://localhost:3002` with your deployed backend URL.

---

## Troubleshooting

### Email not sending?
1. Check Gmail credentials in environment variables
2. Verify Gmail app password is correct
3. Check Gmail account security settings

### CORS errors?
The backend is configured to accept requests from:
- `https://main.author-fatima-76r-339.pages.dev` (production)
- `http://localhost:5173` (development)

Add more origins in `server.mjs` if needed.

### Backend not responding?
1. Check if backend is running: `GET /api/health`
2. Verify environment variables are set
3. Check logs for errors

---

## Next Steps

1. Deploy backend to Vercel or Railway
2. Update `wrangler.toml` with the deployed backend URL
3. Rebuild and redeploy frontend
4. Test email sending from admin dashboard

