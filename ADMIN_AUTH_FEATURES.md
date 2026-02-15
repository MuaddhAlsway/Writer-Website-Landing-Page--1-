# Admin Authentication & Account Management Features

## Overview

This document describes the new admin authentication and account management features implemented in the system.

## Features Implemented

### 1. Password Reset Flow

#### How It Works:
1. **Request Reset**: Admin clicks "Forgot your password?" on login page
2. **Email Entry**: Admin enters their email address
3. **Reset Link**: System sends a password reset link to their email
4. **Token Entry**: Admin copies the token from the email link
5. **New Password**: Admin enters and confirms their new password
6. **Confirmation**: Password is updated in the system

#### Components:
- `ResetPasswordFlow.tsx` - Multi-step password reset UI
- Backend endpoint: `/api/admin/forgot-password` - Sends reset email
- Backend endpoint: `/api/admin/reset-password` - Validates token and updates password

#### Database:
- `password_reset_tokens` table stores reset tokens with 1-hour expiration

---

### 2. Account Settings Tab

#### Features:
- **View Account Information**
  - Email address
  - Username
  - Full name
  - Account creation date

- **Update Profile**
  - Change username (must be unique, minimum 3 characters)
  - Change full name
  - Real-time validation
  - Success/error notifications

- **Change Password Manually**
  - Enter current password (for verification)
  - Enter new password (minimum 6 characters)
  - Confirm new password
  - Validates that new password differs from current
  - Updates password in system

#### Components:
- `AccountSettings.tsx` - English version
- `AccountSettingsAr.tsx` - Arabic version
- Backend endpoint: `/api/admin/profile` - Get/update profile
- Backend endpoint: `/api/admin/change-password` - Change password

#### Access:
- Available in admin dashboard under "Account" tab
- Requires valid authentication token
- Only accessible to logged-in admins

---

## User Flows

### Password Reset Flow

```
Login Page
    ↓
Click "Forgot your password?"
    ↓
Enter Email Address
    ↓
System sends reset link to email
    ↓
Admin receives email with reset link
    ↓
Copy token from email
    ↓
Enter token in reset form
    ↓
Enter new password
    ↓
Confirm new password
    ↓
Password updated successfully
    ↓
Redirect to login
```

### Account Management Flow

```
Admin Dashboard
    ↓
Click "Account" tab
    ↓
View current account information
    ↓
Option 1: Update Profile
    - Change username
    - Change name
    - Click "Save Changes"
    - Success notification
    
Option 2: Change Password
    - Enter current password
    - Enter new password
    - Confirm new password
    - Click "Update Password"
    - Success notification
```

---

## API Endpoints

### Authentication Endpoints

#### 1. Admin Login
```
POST /api/admin/login
Body: { email, password }
Response: { token, expiresIn, admin }
```

#### 2. Request Password Reset
```
POST /api/admin/forgot-password
Body: { email }
Response: { success, message }
```

#### 3. Reset Password
```
POST /api/admin/reset-password
Body: { token, newPassword }
Response: { success, message }
```

#### 4. Get Admin Profile
```
GET /api/admin/profile
Headers: Authorization: Bearer {token}
Response: { admin: { id, email, username, name, createdAt } }
```

#### 5. Update Admin Profile
```
PUT /api/admin/profile
Headers: Authorization: Bearer {token}
Body: { username?, name? }
Response: { success, message }
```

#### 6. Change Password
```
POST /api/admin/change-password
Headers: Authorization: Bearer {token}
Body: { currentPassword, newPassword }
Response: { success, message }
```

---

## Database Schema

### Admins Table
```sql
CREATE TABLE admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  username TEXT UNIQUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Password Reset Tokens Table
```sql
CREATE TABLE password_reset_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expiresAt DATETIME NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (email) REFERENCES admins(email) ON DELETE CASCADE
);
```

---

## Security Features

1. **Password Hashing**: Passwords are hashed using SHA-256
2. **JWT Tokens**: Authentication uses JWT with 1-hour expiration
3. **Token Expiration**: Reset tokens expire after 1 hour
4. **Email Verification**: Reset links sent via email
5. **Current Password Verification**: Required to change password
6. **Unique Constraints**: Email and username must be unique
7. **Minimum Requirements**:
   - Password: minimum 6 characters
   - Username: minimum 3 characters

---

## Email Templates

### Password Reset Email
- Contains reset link with token
- Includes security warning
- Expires in 1 hour
- Professional HTML template

---

## Configuration

### Environment Variables Required
```
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
JWT_SECRET=your_jwt_secret_key
```

### Email Service
- Uses Resend for email delivery
- Configurable sender email
- HTML email templates

---

## Testing

### Test Scenarios

1. **Password Reset**
   - Request reset with valid email
   - Check email for reset link
   - Copy token from link
   - Enter new password
   - Verify login with new password

2. **Update Profile**
   - Change username to new value
   - Verify username is unique
   - Change name
   - Verify changes saved

3. **Change Password**
   - Enter current password (correct)
   - Enter new password
   - Verify password changed
   - Try login with old password (should fail)
   - Try login with new password (should succeed)

4. **Error Cases**
   - Invalid email on reset
   - Expired reset token
   - Mismatched passwords
   - Duplicate username
   - Incorrect current password

---

## File Structure

```
src/app/components/admin/
├── AdminLogin.tsx                 # Login with reset password option
├── ResetPasswordFlow.tsx           # Multi-step password reset
├── AccountSettings.tsx             # Account management (English)
├── AccountSettingsAr.tsx           # Account management (Arabic)
├── AdminDashboard.tsx              # Dashboard with account tab
├── AdminDashboardAr.tsx            # Arabic dashboard with account tab
└── ...other admin components

functions/api/
└── [[route]].ts                    # Backend API endpoints
```

---

## Usage Instructions

### For End Users

#### Resetting Password
1. Go to admin login page
2. Click "Forgot your password?"
3. Enter your email address
4. Check your email for reset link
5. Copy the token from the link
6. Enter the token and new password
7. Click "Reset Password"
8. Login with new password

#### Managing Account
1. Login to admin dashboard
2. Click "Account" tab
3. Update username/name or change password
4. Click "Save Changes" or "Update Password"
5. Confirm changes with success message

### For Developers

#### Adding New Admin
```sql
INSERT INTO admins (email, password, name, username) 
VALUES ('admin@example.com', 'hashed_password', 'Admin Name', 'admin');
```

#### Verifying Password Reset Token
- Check `password_reset_tokens` table
- Verify token exists and hasn't expired
- Match email with admin account

---

## Troubleshooting

### Password Reset Email Not Received
- Check RESEND_API_KEY is configured
- Verify FROM_EMAIL is valid
- Check email spam folder
- Ensure email address is registered

### Token Expired
- Reset tokens expire after 1 hour
- Request a new reset link
- Tokens are deleted after successful reset

### Username Already Taken
- Choose a different username
- Usernames must be unique across all admins

### Password Change Failed
- Verify current password is correct
- New password must be at least 6 characters
- New password must differ from current

---

## Future Enhancements

- Two-factor authentication (2FA)
- Email verification for account changes
- Login history and activity logs
- Session management
- Password strength meter
- Account recovery options
- Admin role management
- Audit trail for account changes

---

## Support

For issues or questions about these features, please refer to the backend API documentation or contact the development team.
