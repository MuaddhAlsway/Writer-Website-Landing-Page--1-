# Cloudflare Pages - Gmail Quick Fix

## The Problem

Newsletter on Cloudflare Pages shows "0 recipients" and no emails sent.

## The Solution

Add Gmail credentials to Cloudflare Pages secrets (3 commands).

## Quick Setup

### 1. Add EMAIL_USER
```bash
wrangler pages secret put EMAIL_USER
```
Paste: `AuthorFSK@gmail.com`

### 2. Add EMAIL_PASSWORD
```bash
wrangler pages secret put EMAIL_PASSWORD
```
Paste: `peed qvhs ekmo kisv`

### 3. Add EMAIL_FROM
```bash
wrangler pages secret put EMAIL_FROM
```
Paste: `AuthorFSK@gmail.com`

### 4. Deploy
```bash
npm run build
wrangler pages deploy dist
```

Or push to GitHub (auto-deploys).

### 5. Test

1. Go to Cloudflare Pages URL
2. Admin Dashboard
3. Create newsletter
4. Send it
5. Check email inbox

## Done! ✅

Your newsletter system is now sending real emails via Gmail on Cloudflare Pages.

## How It Works

- Cloudflare fetches subscribers from Turso
- Cloudflare sends emails via Gmail API
- Emails arrive in subscriber inboxes
- No backend server needed
- No Resend needed
- No Railway needed

Just Gmail API with app password!
