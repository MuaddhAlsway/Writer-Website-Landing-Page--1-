# Deploy Backend to Free Hosting (Replit or Glitch)

## Option 1: Replit (Recommended)

### Step 1: Create Replit Project
1. Go to https://replit.com
2. Sign up with GitHub
3. Click "Create" → "New Repl"
4. Select **Node.js**
5. Name it: `author-fatima-backend`

### Step 2: Upload Files
1. Click "Upload file"
2. Upload `backend-server.mjs`
3. Upload `package.json`

### Step 3: Set Environment Variables
1. Click "Secrets" (lock icon)
2. Add:
   - Key: `EMAIL_USER` → Value: `AuthorFSK@gmail.com`
   - Key: `EMAIL_PASSWORD` → Value: `peed qvhs ekmo kisv`
   - Key: `NODE_ENV` → Value: `production`

### Step 4: Run
1. Click "Run" button
2. Wait for server to start
3. Copy the URL from the top (e.g., `https://author-fatima-backend.replit.dev`)

### Step 5: Update Cloudflare
1. Update `wrangler.toml`:
   ```
   BACKEND_URL = "https://author-fatima-backend.replit.dev"
   ```
2. Run:
   ```bash
   npm run build
   wrangler pages deploy dist
   ```

---

## Option 2: Glitch

### Step 1: Create Glitch Project
1. Go to https://glitch.com
2. Click "New Project" → "Import from GitHub"
3. Select your repository

### Step 2: Set Environment Variables
1. Click ".env" file
2. Add:
   ```
   EMAIL_USER=AuthorFSK@gmail.com
   EMAIL_PASSWORD=peed qvhs ekmo kisv
   NODE_ENV=production
   ```

### Step 3: Update package.json
Make sure `start` script is:
```json
"start": "node backend-server.mjs"
```

### Step 4: Get URL
- Your project URL is shown at top (e.g., `https://your-project.glitch.me`)

### Step 5: Update Cloudflare
1. Update `wrangler.toml`:
   ```
   BACKEND_URL = "https://your-project.glitch.me"
   ```
2. Deploy frontend

---

## Testing

Once deployed, test your backend:

```bash
curl -X POST https://your-backend-url/make-server-53bed28f/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["your-email@gmail.com"],
    "subject": "Test Email",
    "content": "<h1>Hello</h1><p>This is a test email</p>"
  }'
```

You should receive the email in your inbox!

---

## Troubleshooting

### Email not sending?
1. Check backend logs for errors
2. Verify app password is correct (16 chars, no spaces)
3. Make sure 2FA is enabled on Gmail
4. Check if app password was generated in Gmail settings

### Backend URL not working?
1. Make sure backend is running
2. Test health endpoint: `https://your-url/health`
3. Check CORS headers are set correctly

### Cloudflare Pages not connecting?
1. Verify `BACKEND_URL` in `wrangler.toml`
2. Check browser console for errors
3. Make sure backend URL is accessible from browser
