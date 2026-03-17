# Cloudflare Dashboard - Exact Location of Variables and Secrets

## Step-by-Step Navigation

### Step 1: Open Cloudflare
```
URL: https://dash.cloudflare.com
```

### Step 2: Go to Pages
```
Left Sidebar
    ↓
Click "Pages"
```

### Step 3: Select Your Project
```
Find "author-fatima-76r"
    ↓
Click on it
```

### Step 4: Go to Settings
```
Top Navigation Tabs:
    ├─ Overview
    ├─ Deployments
    ├─ Analytics
    ├─ Settings ← CLICK HERE
    └─ ...
```

### Step 5: Find Environment Variables Section
```
Settings Page (Scroll Down)
    ↓
Look for: "Environment variables"
    ↓
You'll see a section with:
    ├─ "Add variable" button
    └─ List of existing variables
```

---

## Where to Add VARIABLES

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
│  │ Environment: ▼ Production                        │  │
│  │ [Save]                                           │  │
│  │                                                  │  │
│  │ Variable name: BACKEND_URL                       │  │
│  │ Value: https://writer-website-landing-page-1... │  │
│  │ Environment: ▼ Production                        │  │
│  │ [Save]                                           │  │
│  │                                                  │  │
│  │ Variable name: FRONTEND_URL                      │  │
│  │ Value: https://main.author-fatima-76r-eis...    │  │
│  │ Environment: ▼ Production                        │  │
│  │ [Save]                                           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Where to Add SECRETS

```
Same Settings Page (Scroll Down More)
    ↓
Look for: "Production" section
    ↓
Inside Production, look for: "Secrets"
    ↓
You'll see:
    ├─ "Add secret" button
    └─ List of existing secrets (hidden)
```

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
│  │ Value: ••••••••••••••••••••••••••••••••••••••    │  │
│  │ [Save]                                           │  │
│  │                                                  │  │
│  │ Secret name: TURSO_AUTH_TOKEN                    │  │
│  │ Value: ••••••••••••••••••••••••••••••••••••••    │  │
│  │ [Save]                                           │  │
│  │                                                  │  │
│  │ Secret name: GMAIL_USER                          │  │
│  │ Value: ••••••••••••••••••••••••••••••••••••••    │  │
│  │ [Save]                                           │  │
│  │                                                  │  │
│  │ Secret name: GMAIL_APP_PASSWORD                  │  │
│  │ Value: ••••••••••••••••••••••••••••••••••••••    │  │
│  │ [Save]                                           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Full Dashboard Path

```
https://dash.cloudflare.com
    ↓
[Your Account]
    ↓
Left Sidebar → Pages
    ↓
[author-fatima-76r]
    ↓
Top Tabs → Settings
    ↓
Scroll Down → Environment variables
    ↓
Add 3 VARIABLES
    ↓
Scroll Down More → Production → Secrets
    ↓
Add 4 SECRETS
```

---

## Visual Map of Settings Page

```
Settings Page Layout:
┌─────────────────────────────────────────────────────────┐
│  Settings                                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Various Settings Options Above]                       │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│  Environment variables                                 │
│  [Add variable]                                         │
│  ├─ ENVIRONMENT = production                            │
│  ├─ BACKEND_URL = https://...                          │
│  └─ FRONTEND_URL = https://...                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Production                                             │
│  ├─ Secrets                                             │
│  │  [Add secret]                                        │
│  │  ├─ TURSO_CONNECTION_URL (hidden)                    │
│  │  ├─ TURSO_AUTH_TOKEN (hidden)                        │
│  │  ├─ GMAIL_USER (hidden)                              │
│  │  └─ GMAIL_APP_PASSWORD (hidden)                      │
│  │                                                      │
│  └─ [Other Production Settings]                         │
│                                                         │
│  [Other Settings Below]                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Key Points

1. **Environment variables** section is for VARIABLES (public)
2. **Secrets** section is under **Production** (private)
3. Both are in the **Settings** tab
4. Must select **Production** environment for variables
5. Secrets are automatically for Production only
6. Click **Save** after each entry
7. All 7 items (3 variables + 4 secrets) must be added

---

## After Adding Everything

You should see:

### Environment variables section:
```
✅ ENVIRONMENT = production
✅ BACKEND_URL = https://writer-website-landing-page-1.vercel.app
✅ FRONTEND_URL = https://main.author-fatima-76r-eis.pages.dev
```

### Production → Secrets section:
```
✅ TURSO_CONNECTION_URL (hidden)
✅ TURSO_AUTH_TOKEN (hidden)
✅ GMAIL_USER (hidden)
✅ GMAIL_APP_PASSWORD (hidden)
```

---

## Then Redeploy

1. Go to **Deployments** tab (top navigation)
2. Find your latest deployment
3. Click **...** (three dots)
4. Click **Redeploy**
5. Wait 1-2 minutes

---

## Summary

- **Variables** = Settings → Environment variables section
- **Secrets** = Settings → Production → Secrets section
- Both are types of environment variables
- Add all 7 items (3 + 4)
- Redeploy after adding
- Wait 1-2 minutes for changes to take effect
