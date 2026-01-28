# Admin Panel Setup & Usage Guide

## Overview

The admin panel is now fully functional with all critical issues fixed. It provides complete management of subscribers, newsletters, and email campaigns.

## What's Fixed

### 1. **Token Persistence** ✅
- Admin login tokens are now saved to localStorage
- Users stay logged in after page refresh
- Automatic token expiration handling (1 hour default)

### 2. **Error Handling** ✅
- Comprehensive error messages throughout the app
- User-friendly error alerts with icons
- Proper error propagation from API calls

### 3. **Security** ✅
- CORS restricted to localhost (development) - update for production
- Input validation on all forms (email format, password length, etc.)
- Rate limiting on public subscriber endpoint (10 requests/hour per IP)
- Email validation and sanitization

### 4. **API Client** ✅
- Centralized API utility (`src/utils/api.ts`)
- Consistent error handling across all components
- Easy to maintain and extend

### 5. **Better UX** ✅
- Loading states for async operations
- Success/error notifications
- Disabled buttons during operations
- Input validation with helpful messages

## Accessing the Admin Panel

1. Click the **Settings icon** (⚙️) in the top-right corner of the website
2. You'll see the Admin Login page
3. **First time?** Click "Need an account? Sign up" to create an admin account
4. Enter your email, password (min 6 chars), and name
5. After login, you'll access the dashboard

## Admin Dashboard Features

### Overview Tab
- View total subscribers count
- See active subscribers
- Monthly signup statistics
- Charts showing growth trends
- Monthly breakdown table

### Subscribers Tab
- View all subscribers in a table
- Search by email or name
- Filter by language (English/Arabic)
- Delete individual subscribers
- Export subscriber list as CSV

### Send Email Tab
- Compose and send emails to selected subscribers
- Multi-select recipients with language filtering
- Select all/deselect all functionality
- Real-time recipient count
- Subject and message composition

### Newsletters Tab
- Create draft newsletters
- Target specific languages (English/Arabic/Both)
- Send newsletters to all matching subscribers
- View sent newsletters with recipient count
- Delete newsletters
- Track sent vs draft status

## API Endpoints

All endpoints are protected with admin authentication (except public subscriber signup).

```
POST   /admin/signup                    - Create admin account
GET    /subscribers                     - Get all subscribers (admin)
POST   /subscribers                     - Add new subscriber (public)
GET    /subscribers/stats               - Get subscriber statistics (admin)
DELETE /subscribers/:email              - Delete subscriber (admin)
GET    /newsletters                     - Get all newsletters (admin)
POST   /newsletters                     - Create newsletter (admin)
POST   /newsletters/:id/send            - Send newsletter (admin)
DELETE /newsletters/:id                 - Delete newsletter (admin)
POST   /send-email                      - Send email to recipients (admin)
```

## Configuration

### For Production

1. **Update CORS Origins** in `supabase/functions/server/index.tsx`:
```typescript
const allowedOrigins = [
  "https://yourdomain.com",
  "https://www.yourdomain.com",
];
```

2. **Email Service Integration**:
   - Currently emails are simulated (logged to console)
   - To send real emails, integrate SendGrid, Mailgun, or similar
   - Update the `/send-email` and `/newsletters/:id/send` endpoints

3. **Environment Variables**:
   - Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in Supabase

## Token Management

- Tokens are stored in localStorage with expiry time
- Tokens expire after 1 hour by default
- Expired tokens are automatically cleared
- Users must log in again after expiration

## Rate Limiting

- Public subscriber endpoint: 10 requests per hour per IP
- Prevents spam and abuse
- Returns 429 status code when limit exceeded

## Input Validation

- **Email**: Must be valid email format
- **Password**: Minimum 6 characters
- **Name**: Required for signup
- **Newsletter Subject/Content**: Required fields
- **Email Recipients**: At least one must be selected

## Troubleshooting

### "Unauthorized - Invalid token"
- Token has expired, log out and log in again
- Clear browser cache and localStorage

### "Failed to load subscribers"
- Check network connection
- Verify Supabase is running
- Check browser console for detailed errors

### "Email already subscribed"
- The email is already in the subscriber list
- Use a different email or delete the existing subscriber first

### CORS Errors
- Ensure your domain is in the `allowedOrigins` list
- Check that you're accessing from the correct domain

## Development

### Running Locally

```bash
# Start the dev server
npm run dev

# Access at http://localhost:5173
# Admin panel at http://localhost:5173 (click settings icon)
```

### Building for Production

```bash
npm run build
```

## File Structure

```
src/
├── app/
│   ├── App.tsx                          # Main app with token persistence
│   └── components/
│       └── admin/
│           ├── AdminLogin.tsx           # Login/signup form
│           ├── AdminDashboard.tsx       # Main dashboard
│           ├── DashboardStats.tsx       # Analytics & charts
│           ├── SubscribersList.tsx      # Subscriber management
│           ├── SendEmail.tsx            # Email composer
│           └── NewsletterManager.tsx    # Newsletter management
└── utils/
    └── api.ts                           # Centralized API client

supabase/functions/server/
├── index.tsx                            # All API endpoints
└── kv_store.tsx                         # Key-value store helpers
```

## Next Steps

1. **Email Integration**: Set up SendGrid/Mailgun for real email sending
2. **Database**: Consider migrating from KV store to PostgreSQL for better scalability
3. **Analytics**: Add more detailed analytics and reporting
4. **Automation**: Set up scheduled newsletters
5. **Templates**: Create email templates for newsletters

## Support

For issues or questions:
1. Check the browser console for error messages
2. Review the API response in Network tab
3. Verify Supabase configuration
4. Check that all environment variables are set correctly
