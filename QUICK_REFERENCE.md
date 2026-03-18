# Quick Reference Card

## 3-Step Setup

```
STEP 1: Connect GitHub (5 min)
├─ https://dash.cloudflare.com
├─ Workers & Pages → Pages → Create application
├─ Connect to Git → GitHub
├─ Select: Writer-Website-Landing-Page--1-
├─ Build: npm run build
├─ Output: dist
└─ Deploy ✅

STEP 2: Get Domain (5 min)
├─ https://www.namecheap.com
├─ Buy domain (e.g., authorfatima.com)
└─ Note domain name ✅

STEP 3: Connect Domain (5 min)
├─ Cloudflare: Custom domains → Add domain
├─ Copy nameservers
├─ Namecheap: Update nameservers
├─ Wait 24-48 hours
└─ Done ✅
```

---

## Your Workflow

```
git add .
git commit -m "Your change"
git push origin main
↓
Cloudflare auto-deploys
↓
Changes live in 2-3 minutes ✅
```

---

## Check Status

```
https://dash.cloudflare.com
→ Pages → author-fatima-76r → Deployments
→ See all deployments and status
```

---

## Your URLs

```
Cloudflare Default:
https://author-fatima-76r-eis.pages.dev

Your Custom Domain:
https://your-domain.com
```

---

## API Endpoints

```
GET  /api/newsletters
POST /api/newsletters
POST /api/send-email
GET  /api/subscribers
POST /api/subscribers
```

---

## Test Commands

```javascript
// Test database
fetch('/api/newsletters', {
  headers: { 'Authorization': 'Bearer test' }
}).then(r => r.json()).then(console.log)

// Test email
fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipients: ['test@example.com'],
    subject: 'Test',
    content: 'Hello'
  })
}).then(r => r.json()).then(console.log)
```

---

## Troubleshooting

```
Domain not working?
→ Check DNS at https://www.whatsmydns.net

Deployment failed?
→ Check error logs in Deployments tab

Changes not showing?
→ Hard refresh: Ctrl+Shift+R
→ Wait 2-3 minutes

503 error?
→ Check environment variables are set

Email not sending?
→ Check Gmail app password is correct
```

---

## Environment Variables

```
✅ TURSO_CONNECTION_URL (set)
✅ TURSO_AUTH_TOKEN (set)
✅ GMAIL_USER (set)
✅ GMAIL_APP_PASSWORD (set)
✅ BACKEND_URL (set)
✅ FRONTEND_URL (set)

No action needed!
```

---

## Admin Dashboard

```
URL: https://your-domain.com
Email: admin@authorfatima.com
Password: Admin@12345

Features:
├─ View subscribers
├─ Send newsletters
├─ View statistics
└─ Send emails
```

---

## Key Files

```
Frontend:
├─ src/app/App.tsx
├─ src/app/components/admin/AdminDashboard.tsx
└─ src/utils/api-client.ts

Backend:
├─ functions/api/newsletters.ts
├─ functions/api/send-email.ts
└─ functions/api/subscribers.ts

Config:
├─ wrangler.toml
├─ vite.config.ts
└─ package.json
```

---

## Deployment Flow

```
You push to GitHub
    ↓
GitHub notifies Cloudflare
    ↓
Cloudflare runs: npm run build
    ↓
Cloudflare deploys dist/
    ↓
Your domain updates
    ↓
Changes live in 2-3 minutes ✅
```

---

## Cost

```
Cloudflare Pages: FREE
Turso Database: FREE (or paid)
Gmail: FREE
Domain: $0.88-$15/year (or free)

Total: FREE to $15/year
```

---

## Support

```
Cloudflare Pages:
https://developers.cloudflare.com/pages/

GitHub:
https://docs.github.com/

Turso:
https://docs.turso.tech/

Nodemailer:
https://nodemailer.com/
```

---

## Status

```
✅ GitHub connected
✅ Cloudflare Pages configured
✅ Auto-deploy enabled
✅ Environment variables set
✅ Admin dashboard ready
✅ Newsletter system ready
✅ Email service ready
✅ Production-ready

Ready to go! 🚀
```

---

## Remember

```
Every push to GitHub = Automatic update
No manual deployment needed
Changes live in 2-3 minutes
Production-ready and scalable
```
