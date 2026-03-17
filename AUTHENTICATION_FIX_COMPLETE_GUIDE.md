# Complete Authentication & API Fix Guide

## Problem Summary
1. **Frontend**: Not sending Authorization header with token
2. **Backend**: Returning 500 instead of 401 for missing auth
3. **Token Storage**: Not properly persisted/retrieved
4. **API Routes**: Missing proper auth middleware
5. **Cloudflare**: Routes not properly configured

## Solution Overview

### 1. FRONTEND FIX
- Store token in localStorage after login
- Send `Authorization: Bearer <token>` header with every API request
- Handle 401 errors by redirecting to login
- Show proper error messages

### 2. BACKEND FIX
- Return 401 (not 500) for missing/invalid tokens
- Validate JWT properly
- Add auth middleware to all protected routes
- Ensure headers are not stripped by Cloudflare

### 3. CLOUDFLARE FIX
- Ensure environment variables are set
- Verify routing configuration
- Check that headers are passed through

### 4. DATABASE FIX
- Ensure newsletters table exists
- Verify Turso connection
- Check query results

## Step-by-Step Implementation

### STEP 1: Fix Frontend Token Handling
File: `src/utils/api.ts`
- ✅ Already has token storage in localStorage
- ✅ Already sends Authorization header
- Issue: Not all methods use the proper request() function

### STEP 2: Fix Backend Auth Middleware
File: `functions/api/newsletters.ts`
- ✅ Already checks for token
- Issue: Returns 500 instead of 401 when token missing
- Fix: Return 401 for missing token

### STEP 3: Fix Admin Dashboard
File: `src/app/components/admin/NewsletterManager.tsx`
- ✅ Already calls apiClient.getNewsletters()
- Issue: May not be handling 401 errors properly
- Fix: Add proper error handling

### STEP 4: Verify Cloudflare Config
File: `wrangler.toml`
- ✅ Already has environment variables
- Issue: May not be set in production
- Fix: Ensure secrets are set in Cloudflare Dashboard

## Testing Checklist

1. **Login Test**
   - Go to admin dashboard
   - Enter credentials
   - Check localStorage for token
   - Verify Network tab shows Authorization header

2. **Newsletter Fetch Test**
   - After login, check Network tab
   - Verify GET /api/newsletters has Authorization header
   - Check response status (should be 200, not 500)

3. **Error Handling Test**
   - Clear localStorage
   - Try to access dashboard
   - Should redirect to login (401 error)

4. **Cloudflare Test**
   - Check Cloudflare Dashboard → Settings → Secrets
   - Verify JWT_SECRET is set
   - Verify TURSO_CONNECTION_URL is set

## Files to Fix
1. functions/api/newsletters.ts - Fix 500 → 401
2. src/app/components/admin/NewsletterManager.tsx - Add error handling
3. Cloudflare Dashboard - Set environment variables
