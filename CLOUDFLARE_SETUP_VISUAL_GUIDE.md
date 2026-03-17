# Cloudflare Setup - Visual Step-by-Step Guide

## 🎯 Goal
Add 4 environment variables to Cloudflare so your Turso database works in production.

---

## STEP 1: Open Cloudflare Dashboard

### 1.1 Go to https://dash.cloudflare.com
```
┌─────────────────────────────────────────┐
│  Cloudflare Dashboard                   │
│  https://dash.cloudflare.com            │
│                                         │
│  [Log In]                               │
└─────────────────────────────────────────┘
```

### 1.2 Log In
- Enter your email
- Enter your password
- Click "Log In"

---

## STEP 2: Navigate to Your Pages Project

### 2.1 Click "Pages" in Left Sidebar
```
┌─────────────────────────────────────────┐
│ Cloudflare Dashboard                    │
│                                         │
│ Left Sidebar:                           │
│ ├─ Home                                 │
│ ├─ Websites                             │
│ ├─ Workers & Pages                      │
│ │  └─ Pages  ← CLICK HERE               │
│ ├─ Analytics                            │
│ └─ ...                                  │
└─────────────────────────────────────────┘
```

### 2.2 Click Your Project: "author-fatima-76r"
```
┌─────────────────────────────────────────┐
│ Pages                                   │
│                                         │
│ Projects:                               │
│ ┌─────────────────────────────────────┐ │
│ │ author-fatima-76r                   │ │
│ │ https://main.author-fatima-76r-...  │ │
│ │ [Click Here]                        │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## STEP 3: Go to Settings

### 3.1 Click "Settings" Tab
```
┌─────────────────────────────────────────┐
│ author-fatima-76r                       │
│                                         │
│ Tabs:                                   │
│ ├─ Deployments                          │
│ ├─ Settings  ← CLICK HERE               │
│ └─ ...                                  │
└─────────────────────────────────────────┘
```

### 3.2 Click "Environment variables" in Left Sidebar
```
┌─────────────────────────────────────────┐
│ Settings                                │
│                                         │
│ Left Sidebar:                           │
│ ├─ General                              │
│ ├─ Builds & deployments                 │
│ ├─ Environment variables ← CLICK HERE   │
│ ├─ Custom domains                       │
│ └─ ...                                  │
└─────────────────────────────────────────┘
```

---

## STEP 4: Select Production Environment

### 4.1 Click "Production" Tab
```
┌─────────────────────────────────────────┐
│ Environment variables                   │
│                                         │
│ Tabs:                                   │
│ ├─ Production  ← CLICK HERE             │
│ └─ Preview                              │
│                                         │
│ Current Variables:                      │
│ (empty)                                 │
└─────────────────────────────────────────┘
```

---

## STEP 5: Add First Variable (TURSO_CONNECTION_URL)

### 5.1 Click "Add variable" Button
```
┌─────────────────────────────────────────┐
│ Production Environment                  │
│                                         │
│ [Add variable]  ← CLICK HERE            │
│                                         │
│ Variables:                              │
│ (empty)                                 │
└─────────────────────────────────────────┘
```

### 5.2 Fill in the Form
```
┌─────────────────────────────────────────┐
│ Add Variable                            │
│                                         │
│ Variable name:                          │
│ ┌─────────────────────────────────────┐ │
│ │ TURSO_CONNECTION_URL                │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Value:                                  │
│ ┌─────────────────────────────────────┐ │
│ │ libsql://authorfsk-authorfsk...     │ │
│ │ (paste from .env.production)        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Cancel]  [Save]  ← CLICK SAVE          │
└─────────────────────────────────────────┘
```

### 5.3 Click "Save"
- Variable is now saved
- You'll see it in the list

---

## STEP 6: Add Second Variable (TURSO_AUTH_TOKEN)

### 6.1 Click "Add variable" Again
```
┌─────────────────────────────────────────┐
│ Production Environment                  │
│                                         │
│ [Add variable]  ← CLICK HERE            │
│                                         │
│ Variables:                              │
│ ✅ TURSO_CONNECTION_URL                 │
└─────────────────────────────────────────┘
```

### 6.2 Fill in the Form
```
┌─────────────────────────────────────────┐
│ Add Variable                            │
│                                         │
│ Variable name:                          │
│ ┌─────────────────────────────────────┐ │
│ │ TURSO_AUTH_TOKEN                    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Value:                                  │
│ ┌─────────────────────────────────────┐ │
│ │ eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9 │ │
│ │ (paste from .env.production)        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Cancel]  [Save]  ← CLICK SAVE          │
└─────────────────────────────────────────┘
```

### 6.3 Click "Save"

---

## STEP 7: Add Third Variable (GMAIL_USER)

### 7.1 Click "Add variable"
```
┌─────────────────────────────────────────┐
│ Production Environment                  │
│                                         │
│ [Add variable]  ← CLICK HERE            │
│                                         │
│ Variables:                              │
│ ✅ TURSO_CONNECTION_URL                 │
│ ✅ TURSO_AUTH_TOKEN                     │
└─────────────────────────────────────────┘
```

### 7.2 Fill in the Form
```
┌─────────────────────────────────────────┐
│ Add Variable                            │
│                                         │
│ Variable name:                          │
│ ┌─────────────────────────────────────┐ │
│ │ GMAIL_USER                          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Value:                                  │
│ ┌─────────────────────────────────────┐ │
│ │ AuthorFSK@gmail.com                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Cancel]  [Save]  ← CLICK SAVE          │
└─────────────────────────────────────────┘
```

### 7.3 Click "Save"

---

## STEP 8: Add Fourth Variable (GMAIL_APP_PASSWORD)

### 8.1 Click "Add variable"
```
┌─────────────────────────────────────────┐
│ Production Environment                  │
│                                         │
│ [Add variable]  ← CLICK HERE            │
│                                         │
│ Variables:                              │
│ ✅ TURSO_CONNECTION_URL                 │
│ ✅ TURSO_AUTH_TOKEN                     │
│ ✅ GMAIL_USER                           │
└─────────────────────────────────────────┘
```

### 8.2 Fill in the Form
```
┌─────────────────────────────────────────┐
│ Add Variable                            │
│                                         │
│ Variable name:                          │
│ ┌─────────────────────────────────────┐ │
│ │ GMAIL_APP_PASSWORD                  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Value:                                  │
│ ┌─────────────────────────────────────┐ │
│ │ peed qvhs ekmo kisv                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Cancel]  [Save]  ← CLICK SAVE          │
└─────────────────────────────────────────┘
```

### 8.3 Click "Save"

---

## STEP 9: Verify All 4 Variables Are Set

### 9.1 Check Production Environment
```
┌─────────────────────────────────────────┐
│ Production Environment                  │
│                                         │
│ Variables:                              │
│ ✅ TURSO_CONNECTION_URL                 │
│ ✅ TURSO_AUTH_TOKEN                     │
│ ✅ GMAIL_USER                           │
│ ✅ GMAIL_APP_PASSWORD                   │
│                                         │
│ All 4 variables are set! ✅             │
└─────────────────────────────────────────┘
```

---

## STEP 10: Redeploy

### 10.1 Go to Deployments Tab
```
┌─────────────────────────────────────────┐
│ author-fatima-76r                       │
│                                         │
│ Tabs:                                   │
│ ├─ Deployments  ← CLICK HERE            │
│ ├─ Settings                             │
│ └─ ...                                  │
└─────────────────────────────────────────┘
```

### 10.2 Find Latest Deployment
```
┌─────────────────────────────────────────┐
│ Deployments                             │
│                                         │
│ Latest Deployment:                      │
│ ┌─────────────────────────────────────┐ │
│ │ Deployment #123                     │ │
│ │ Status: Success                     │ │
│ │ Date: 2026-03-17                    │ │
│ │ [Retry deployment]  ← CLICK HERE    │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 10.3 Click "Retry deployment"
- Deployment will start
- Wait 2-3 minutes for completion

### 10.4 Wait for Deployment to Complete
```
┌─────────────────────────────────────────┐
│ Deployments                             │
│                                         │
│ Latest Deployment:                      │
│ ┌─────────────────────────────────────┐ │
│ │ Deployment #124                     │ │
│ │ Status: Building... (2/3)           │ │
│ │ [Retry deployment]                  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Wait 2-3 minutes...                     │
└─────────────────────────────────────────┘
```

### 10.5 Deployment Complete
```
┌─────────────────────────────────────────┐
│ Deployments                             │
│                                         │
│ Latest Deployment:                      │
│ ┌─────────────────────────────────────┐ │
│ │ Deployment #124                     │ │
│ │ Status: ✅ Success                  │ │
│ │ Date: 2026-03-17                    │ │
│ │ URL: https://main.author-fatima...  │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## ✅ YOU'RE DONE!

Your environment variables are now set and deployed.

### Next: Test Your App

1. Go to https://main.author-fatima-76r-eis.pages.dev/admin
2. Login with:
   - Email: `admin@authorfatima.com`
   - Password: `Admin@12345`
3. Dashboard should load with newsletters

---

## 📊 Summary

| Step | Action | Time |
|------|--------|------|
| 1-4 | Navigate to Environment variables | 1 min |
| 5-8 | Add 4 variables | 3 min |
| 9 | Verify all set | 1 min |
| 10 | Redeploy | 2-3 min |
| **Total** | **Complete Setup** | **7-8 min** |

---

## 🎉 Success!

Your Turso database is now connected to Cloudflare Pages!
