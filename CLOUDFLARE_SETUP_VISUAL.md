# Cloudflare Pages Setup - Visual Guide

## Dashboard Navigation

```
https://dash.cloudflare.com
        ↓
    [Your Account]
        ↓
    Left Sidebar → Pages
        ↓
    [author-fatima-76r] ← Click here
        ↓
    [Settings] Tab ← Click here
        ↓
    Scroll Down
```

---

## Where to Add Variables

```
┌─────────────────────────────────────────────────────────┐
│  Settings Tab                                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Environment variables                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [Add variable]                                   │  │
│  │                                                  │  │
│  │ Variable name: ENVIRONMENT                       │  │
│  │ Value: production                                │  │
│  │ Environment: Production                          │  │
│  │ [Save]                                           │  │
│  │                                                  │  │
│  │ Variable name: BACKEND_URL                       │  │
│  │ Value: https://writer-website-landing-page-1... │  │
│  │ Environment: Production                          │  │
│  │ [Save]                                           │  │
│  │                                                  │  │
│  │ Variable name: FRONTEND_URL                      │  │
│  │ Value: https://main.author-fatima-76r-eis...    │  │
│  │ Environment: Production                          │  │
│  │ [Save]                                           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Where to Add Secrets

```
┌─────────────────────────────────────────────────────────┐
│  Settings Tab (Scroll Down)                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Production                                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Secrets                                          │  │
│  │ [Add secret]                                     │  │
│  │                                                  │  │
│  │ Secret name: TURSO_CONNECTION_URL                │  │
│  │ Value: libsql://authorfsk-authorfsk...          │  │
│  │ [Save]                                           │  │
│  │                                                  │  │
│  │ Secret name: TURSO_AUTH_TOKEN                    │  │
│  │ Value: eyJhbGciOiJFZERTQSI...                   │  │
│  │ [Save]                                           │  │
│  │                                                  │  │
│  │ Secret name: GMAIL_USER                          │  │
│  │ Value: AuthorFSK@gmail.com                       │  │
│  │ [Save]                                           │  │
│  │                                                  │  │
│  │ Secret name: GMAIL_APP_PASSWORD                  │  │
│  │ Value: peed qvhs ekmo kisv                       │  │
│  │ [Save]                                           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## After Adding Everything

```
┌─────────────────────────────────────────────────────────┐
│  Settings Tab - Summary                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Environment variables (Production)                     │
│  ✅ ENVIRONMENT = production                            │
│  ✅ BACKEND_URL = https://writer-website-landing...    │
│  ✅ FRONTEND_URL = https://main.author-fatima-76r...   │
│                                                         │
│  Secrets (Production)                                   │
│  ✅ TURSO_CONNECTION_URL (hidden)                       │
│  ✅ TURSO_AUTH_TOKEN (hidden)                           │
│  ✅ GMAIL_USER (hidden)                                 │
│  ✅ GMAIL_APP_PASSWORD (hidden)                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Redeploy Steps

```
https://dash.cloudflare.com
        ↓
    [author-fatima-76r]
        ↓
    [Deployments] Tab ← Click here
        ↓
    Find Latest Deployment
        ↓
    Click [...]
        ↓
    [Redeploy]
        ↓
    Wait 1-2 minutes
        ↓
    ✅ Done!
```

---

## Testing After Setup

```
Browser Console (F12)
        ↓
Go to: https://main.author-fatima-76r-eis.pages.dev/admin
        ↓
Admin Dashboard loads
        ↓
Check Subscribers tab
        ↓
Should see: List of subscribers (or empty if none yet)
        ↓
Should NOT see: "Turso not configured" error
        ↓
Try adding a new subscriber
        ↓
✅ Success! Turso is working
```

---

## Troubleshooting Flowchart

```
Still seeing "Turso not configured"?
        ↓
    ┌───────────────────────────────────┐
    │ Did you add all 4 secrets?        │
    │ ✓ TURSO_CONNECTION_URL            │
    │ ✓ TURSO_AUTH_TOKEN                │
    │ ✓ GMAIL_USER                      │
    │ ✓ GMAIL_APP_PASSWORD              │
    └───────────────────────────────────┘
        ↓ NO → Go back and add them
        ↓ YES
    ┌───────────────────────────────────┐
    │ Did you click [Save] for each?    │
    └───────────────────────────────────┘
        ↓ NO → Go back and save them
        ↓ YES
    ┌───────────────────────────────────┐
    │ Did you redeploy?                 │
    │ (Deployments → ... → Redeploy)    │
    └───────────────────────────────────┘
        ↓ NO → Go redeploy
        ↓ YES
    ┌───────────────────────────────────┐
    │ Did you wait 2-3 minutes?         │
    └───────────────────────────────────┘
        ↓ NO → Wait and try again
        ↓ YES
    ┌───────────────────────────────────┐
    │ Clear browser cache               │
    │ (Ctrl+Shift+Delete)               │
    │ Refresh page (Ctrl+F5)            │
    └───────────────────────────────────┘
        ↓
    ✅ Should work now!
```

---

## Quick Checklist

```
□ Go to https://dash.cloudflare.com
□ Click Pages → author-fatima-76r
□ Click Settings tab
□ Add 3 variables:
  □ ENVIRONMENT = production
  □ BACKEND_URL = https://writer-website-landing-page-1.vercel.app
  □ FRONTEND_URL = https://main.author-fatima-76r-eis.pages.dev
□ Add 4 secrets:
  □ TURSO_CONNECTION_URL = (copy from .env.production)
  □ TURSO_AUTH_TOKEN = (copy from .env.production)
  □ GMAIL_USER = AuthorFSK@gmail.com
  □ GMAIL_APP_PASSWORD = peed qvhs ekmo kisv
□ Click Save after each entry
□ Go to Deployments tab
□ Click ... on latest deployment
□ Click Redeploy
□ Wait 1-2 minutes
□ Test: Go to admin dashboard
□ Verify: Subscribers load without errors
□ ✅ Done!
```

---

## What Each Section Does

### Environment Variables
- **Public** - Visible in your code
- **Used for** - Configuration that doesn't need to be secret
- **Examples** - URLs, environment names, feature flags

### Secrets
- **Private** - Hidden, encrypted, not visible in code
- **Used for** - Sensitive data like passwords, tokens, API keys
- **Examples** - Database credentials, API keys, passwords

---

## Important Notes

1. **Variables** are for non-sensitive config
2. **Secrets** are for sensitive data (passwords, tokens)
3. All 7 items (3 variables + 4 secrets) must be added
4. Must click **Save** after each entry
5. Must **Redeploy** after adding variables/secrets
6. Changes take 1-2 minutes to propagate
7. Clear browser cache if still seeing old errors

---

## Success Indicators

After setup, you should see:

✅ Admin dashboard loads without errors
✅ Subscribers list shows (even if empty)
✅ Can add new subscribers
✅ Data appears in database
✅ No "Turso not configured" errors
✅ Newsletters can be sent
✅ Data persists after page refresh

If you see any of these, setup is successful!
