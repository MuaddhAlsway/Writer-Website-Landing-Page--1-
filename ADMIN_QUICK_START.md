# Admin Panel - Quick Start

## 🚀 Get Started in 2 Minutes

### Step 1: Access Admin Panel
1. Run `npm run dev`
2. Open http://localhost:5173
3. Click the **Settings icon** (⚙️) in top-right corner

### Step 2: Create Admin Account
1. Click "Need an account? Sign up"
2. Fill in:
   - **Name**: Your name
   - **Email**: admin@example.com
   - **Password**: At least 6 characters
3. Click "Create Account"
4. You'll be automatically logged in

### Step 3: Start Managing

#### Add Subscribers
- Go to **Subscribers** tab
- Subscribers are added when people join the waitlist on the website
- View, search, filter, and delete subscribers

#### Send Emails
- Go to **Send Email** tab
- Select recipients (filter by language)
- Write subject and message
- Click "Send Email"

#### Create Newsletters
- Go to **Newsletters** tab
- Click "Create Newsletter"
- Write subject and content
- Choose target language
- Click "Create Newsletter"
- Click "Send Now" to send to subscribers

#### View Analytics
- Go to **Overview** tab
- See total subscribers, active count, and monthly growth
- View charts and monthly breakdown

## 🔑 Key Features

✅ **Token Persistence** - Stay logged in after refresh
✅ **Error Handling** - Clear error messages
✅ **Input Validation** - Email format, password strength
✅ **Rate Limiting** - Protection against spam
✅ **CSV Export** - Download subscriber list
✅ **Language Support** - Target English or Arabic subscribers
✅ **Search & Filter** - Find subscribers quickly

## ⚠️ Important Notes

- **Emails are simulated** - They're logged to console, not actually sent
- To send real emails, integrate SendGrid or Mailgun
- Tokens expire after 1 hour - you'll need to log in again
- All data is stored in Supabase KV store

## 🔧 For Production

Before deploying:

1. **Update CORS** in `supabase/functions/server/index.tsx`:
   ```typescript
   const allowedOrigins = ["https://yourdomain.com"];
   ```

2. **Integrate Email Service**:
   - Add SendGrid/Mailgun API keys
   - Update `/send-email` endpoint to actually send emails

3. **Set Environment Variables**:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 📝 Common Tasks

### Export Subscribers
1. Go to **Subscribers** tab
2. Click "Export CSV"
3. File downloads as `subscribers-YYYY-MM-DD.csv`

### Delete a Subscriber
1. Go to **Subscribers** tab
2. Find the subscriber
3. Click trash icon
4. Confirm deletion

### Send Email to Specific Language
1. Go to **Send Email** tab
2. Select language filter (English/Arabic)
3. Click "Select All"
4. Write and send email

### View Growth Stats
1. Go to **Overview** tab
2. See monthly signup chart
3. View cumulative growth line chart
4. Check monthly breakdown table

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't log in | Check email/password, try signing up again |
| Logged out after refresh | Clear browser cache, log in again |
| Can't see subscribers | Check network connection, refresh page |
| Email not sending | Check console for errors, verify recipients selected |
| CORS error | Update allowed origins for your domain |

## 📚 Full Documentation

See `ADMIN_SETUP.md` for complete documentation.

---

**Ready to go!** Click the settings icon and start managing your subscribers. 🎉
