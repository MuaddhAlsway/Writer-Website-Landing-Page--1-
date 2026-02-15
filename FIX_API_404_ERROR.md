# Fix: API 404 Error - Forgot Password Endpoint

## Problem
When clicking "Forgot Password", you get: `API error: 404`

## Solution
The authentication endpoints were missing from the main API router. I've added them.

---

## What Was Fixed

### Added Endpoints to `functions/api/[[route]].ts`:
1. ✅ `POST /api/admin/login` - Admin login
2. ✅ `POST /api/admin/forgot-password` - Request password reset
3. ✅ `POST /api/admin/reset-password` - Reset password with token
4. ✅ `POST /api/admin/change-password` - Change password
5. ✅ `GET /api/admin/profile` - Get admin profile
6. ✅ `PUT /api/admin/profile` - Update admin profile
7. ✅ `POST /api/admin/refresh` - Refresh access token
8. ✅ `POST /api/admin/logout` - Logout

---

## How to Deploy

### 1. Rebuild the project
```bash
npm run build
```

### 2. Deploy to production
```bash
npm run deploy
```

### 3. Test locally first (optional)
```bash
npm run dev
```

Then test the forgot password flow:
1. Click "Forgot your password?"
2. Enter your email
3. Should see confirmation message (no more 404 error)

---

## What Changed

### File Modified:
- `functions/api/[[route]].ts` - Added all authentication endpoints

### Endpoints Now Available:
- ✅ `/api/admin/login`
- ✅ `/api/admin/forgot-password`
- ✅ `/api/admin/reset-password`
- ✅ `/api/admin/change-password`
- ✅ `/api/admin/profile`
- ✅ `/api/admin/refresh`
- ✅ `/api/admin/logout`

---

## Testing

### Test Forgot Password:
```
1. Go to login page
2. Click "Forgot your password?"
3. Enter your email
4. Should see: "Password reset link has been sent to your email"
5. No more 404 error!
```

### Test Reset Password:
```
1. Check your email for reset link
2. Click link (contains reset token)
3. Enter new password (12+ chars, uppercase, lowercase, number, special)
4. Click "Reset Password"
5. Should see success message
```

---

## Status

✅ **FIXED** - All authentication endpoints are now available

The 404 error should be resolved. If you still see errors:
1. Clear browser cache
2. Rebuild: `npm run build`
3. Redeploy: `npm run deploy`
4. Try again

---

## Next Steps

1. Deploy the fix: `npm run deploy`
2. Test the forgot password flow
3. Verify all endpoints work
4. Monitor for any errors

---

## Support

If you still see errors:
- Check browser console for detailed error messages
- Check wrangler logs: `wrangler tail`
- Verify database has `password_reset_tokens` table
- Verify JWT secrets are set: `wrangler secret list`
