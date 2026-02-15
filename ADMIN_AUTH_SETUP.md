# Admin Authentication Setup Guide

## Quick Start

### 1. Database Setup

The database tables are already created in `schema.sql`:
- `admins` - Stores admin accounts
- `password_reset_tokens` - Stores password reset tokens

Default admin account:
```
Email: admin@example.com
Password: admin123
```

### 2. Environment Variables

Add these to your `.env` file:

```env
# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=noreply@yourdomain.com

# JWT Secret for token generation
JWT_SECRET=your_secret_key_here
```

### 3. Features Overview

#### Password Reset
- Admin clicks "Forgot your password?" on login
- Enters email address
- Receives reset link via email
- Copies token from link
- Sets new password
- Logs in with new password

#### Account Management
- Access via "Account" tab in admin dashboard
- Update username and name
- Change password manually
- View account information

### 4. Testing the Features

#### Test Password Reset
1. Go to admin login page
2. Click "Forgot your password?"
3. Enter: `admin@example.com`
4. Check your email for reset link
5. Copy the token from the link
6. Enter token and new password
7. Click "Reset Password"

#### Test Account Settings
1. Login with admin credentials
2. Click "Account" tab in dashboard
3. Update username or name
4. Or change password by entering current and new password
5. Click save button

### 5. API Endpoints

All endpoints are in `functions/api/[[route]].ts`

**Authentication Endpoints:**
- `POST /api/admin/login` - Login
- `POST /api/admin/forgot-password` - Request password reset
- `POST /api/admin/reset-password` - Reset password with token
- `GET /api/admin/profile` - Get admin profile
- `PUT /api/admin/profile` - Update profile
- `POST /api/admin/change-password` - Change password

### 6. Components

**Frontend Components:**
- `AdminLogin.tsx` - Login page with reset option
- `ResetPasswordFlow.tsx` - Password reset flow
- `AccountSettings.tsx` - Account management (English)
- `AccountSettingsAr.tsx` - Account management (Arabic)
- `AdminDashboard.tsx` - Dashboard with account tab
- `AdminDashboardAr.tsx` - Arabic dashboard

### 7. Creating New Admin Accounts

#### Via Database
```sql
INSERT INTO admins (email, password, name, username) 
VALUES ('newadmin@example.com', 'hashed_password', 'New Admin', 'newadmin');
```

Note: Password should be hashed using SHA-256

#### Via API (if endpoint exists)
```javascript
const response = await fetch('/api/admin/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'newadmin@example.com',
    password: 'password123',
    name: 'New Admin',
    username: 'newadmin'
  })
});
```

### 8. Password Requirements

- **Minimum length**: 6 characters
- **Hashing**: SHA-256
- **Storage**: Hashed in database
- **Reset**: 1-hour expiration on reset tokens

### 9. Username Requirements

- **Minimum length**: 3 characters
- **Uniqueness**: Must be unique across all admins
- **Format**: Alphanumeric and underscores

### 10. Email Configuration

For password reset emails to work:

1. Get Resend API key from https://resend.com
2. Add to `.env`: `RESEND_API_KEY=your_key`
3. Configure sender email: `FROM_EMAIL=noreply@yourdomain.com`
4. Test by requesting password reset

### 11. Deployment

When deploying to Cloudflare Pages:

1. Set environment variables in Cloudflare dashboard
2. Ensure database is accessible
3. Deploy with `npm run deploy`
4. Test login and password reset

### 12. Troubleshooting

**Login fails:**
- Check email and password
- Verify admin exists in database
- Check JWT_SECRET is set

**Password reset email not received:**
- Verify RESEND_API_KEY is correct
- Check FROM_EMAIL is valid
- Check spam folder
- Verify email address exists

**Token expired:**
- Reset tokens expire after 1 hour
- Request new reset link

**Username already taken:**
- Choose different username
- Check database for existing usernames

### 13. Security Checklist

- [ ] JWT_SECRET is set and strong
- [ ] RESEND_API_KEY is configured
- [ ] FROM_EMAIL is valid
- [ ] Database is backed up
- [ ] Admin passwords are strong
- [ ] HTTPS is enabled in production
- [ ] Rate limiting is configured (optional)

### 14. Next Steps

1. Test all features locally
2. Deploy to staging environment
3. Test in staging
4. Deploy to production
5. Monitor for errors
6. Create additional admin accounts as needed

### 15. Support

For issues:
1. Check error messages in browser console
2. Check server logs
3. Verify environment variables
4. Check database connectivity
5. Review API endpoint responses

---

## File Locations

- **Frontend**: `src/app/components/admin/`
- **Backend**: `functions/api/[[route]].ts`
- **Database**: `schema.sql`
- **API Client**: `src/utils/api.ts`
- **Documentation**: `ADMIN_AUTH_FEATURES.md`

---

## Quick Reference

### Default Admin
- Email: `admin@example.com`
- Password: `admin123`

### Reset Password Flow
1. Click "Forgot your password?"
2. Enter email
3. Check email for link
4. Copy token
5. Enter new password
6. Login with new password

### Account Management
1. Login to dashboard
2. Click "Account" tab
3. Update profile or change password
4. Click save

### API Base URL
- Development: `http://localhost:3001`
- Production: Relative paths (same domain)

---

## Environment Variables Template

```env
# Email Service
RESEND_API_KEY=sk_live_xxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com

# Authentication
JWT_SECRET=your_super_secret_key_here_make_it_long_and_random

# Database (if needed)
DATABASE_URL=your_database_url

# Other
NODE_ENV=production
```

---

Done! Your admin authentication system is ready to use.
