# Correct URLs - Frontend vs Backend

## ✅ Frontend (Cloudflare Pages)
**Admin Dashboard:**
https://main.author-fatima-76r-eis.pages.dev/admin

**Home Page:**
https://main.author-fatima-76r-eis.pages.dev

## ✅ Backend (Vercel API)
**Subscribers Endpoint:**
https://writer-website-landing-page-1.vercel.app/api/subscribers

**Status:** ✅ Working (HTTP 200)

## Architecture

```
User visits:
https://main.author-fatima-76r-eis.pages.dev/admin
    ↓
Cloudflare Pages serves frontend
    ↓
Frontend makes API calls to:
/api/subscribers
    ↓
Cloudflare proxy forwards to:
https://writer-website-landing-page-1.vercel.app/api/subscribers
    ↓
Vercel backend responds with subscriber data
```

## What You Were Trying

❌ https://writer-website-landing-page-1.vercel.app/admin
- This is the Vercel backend URL
- Backend only has API endpoints, not the frontend
- That's why you got 404 NOT_FOUND

## Correct Flow

✅ Go to: https://main.author-fatima-76r-eis.pages.dev/admin
- This is the Cloudflare Pages frontend
- Frontend loads the admin dashboard
- Frontend calls /api/subscribers
- Proxy forwards to Vercel backend
- Vercel returns subscriber data

## Test Now

1. Visit: https://main.author-fatima-76r-eis.pages.dev/admin
2. Login with credentials
3. Go to Subscribers tab
4. Should see subscriber list
5. Should NOT see 403 errors

## API Endpoints (Backend Only)

These are for testing, not for user access:

- GET https://writer-website-landing-page-1.vercel.app/api/subscribers
  - Requires: Authorization header
  - Returns: List of subscribers

- POST https://writer-website-landing-page-1.vercel.app/api/subscribers
  - Body: { email, language }
  - Returns: New subscriber

- DELETE https://writer-website-landing-page-1.vercel.app/api/subscribers
  - Body: { email }
  - Returns: Success

## Summary

| URL | Purpose | Status |
|-----|---------|--------|
| https://main.author-fatima-76r-eis.pages.dev | Frontend Home | ✅ 200 |
| https://main.author-fatima-76r-eis.pages.dev/admin | Admin Dashboard | ✅ 200 |
| https://writer-website-landing-page-1.vercel.app/api/subscribers | Backend API | ✅ 200 |

---

**Use the Cloudflare Pages URL for the admin dashboard!**
