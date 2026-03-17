# Environment Variables - Explained

## What Are Environment Variables?

Environment variables are values that your application can access at runtime. They're used to configure your app without hardcoding values.

---

## In Cloudflare Pages

Cloudflare has **TWO types** of environment variables:

### 1. VARIABLES (Public)
- **Visibility:** Public - visible in your code
- **Security:** Not sensitive
- **Use for:** Configuration, URLs, feature flags
- **Examples:**
  - `ENVIRONMENT = production`
  - `BACKEND_URL = https://...`
  - `FRONTEND_URL = https://...`

### 2. SECRETS (Private)
- **Visibility:** Private - hidden, encrypted
- **Security:** Sensitive data
- **Use for:** Passwords, tokens, API keys
- **Examples:**
  - `TURSO_CONNECTION_URL = libsql://...`
  - `TURSO_AUTH_TOKEN = eyJ...`
  - `GMAIL_USER = email@gmail.com`
  - `GMAIL_APP_PASSWORD = password`

---

## How They Work

```
┌─────────────────────────────────────────┐
│  Cloudflare Pages Environment           │
├─────────────────────────────────────────┤
│                                         │
│  VARIABLES (Public)                     │
│  ├─ ENVIRONMENT = production            │
│  ├─ BACKEND_URL = https://...          │
│  └─ FRONTEND_URL = https://...         │
│                                         │
│  SECRETS (Private/Encrypted)            │
│  ├─ TURSO_CONNECTION_URL = ...         │
│  ├─ TURSO_AUTH_TOKEN = ...             │
│  ├─ GMAIL_USER = ...                   │
│  └─ GMAIL_APP_PASSWORD = ...           │
│                                         │
└─────────────────────────────────────────┘
         ↓
    Your Code Accesses Them
         ↓
    context.env.ENVIRONMENT
    context.env.TURSO_CONNECTION_URL
    etc.
```

---

## In Your Code

### How to Access Variables in Cloudflare Functions

```typescript
export async function onRequest(context: any) {
  const env = context.env;
  
  // Access VARIABLES (public)
  const environment = env.ENVIRONMENT;
  const backendUrl = env.BACKEND_URL;
  
  // Access SECRETS (private)
  const tursoUrl = env.TURSO_CONNECTION_URL;
  const tursoToken = env.TURSO_AUTH_TOKEN;
  const gmailUser = env.GMAIL_USER;
  const gmailPass = env.GMAIL_APP_PASSWORD;
  
  // Use them
  console.log(`Running in ${environment}`);
  console.log(`Connecting to Turso: ${tursoUrl}`);
}
```

---

## Comparison: Variables vs Secrets

| Aspect | Variables | Secrets |
|--------|-----------|---------|
| **Visibility** | Public | Private/Hidden |
| **Encryption** | No | Yes |
| **In Code** | Visible | Not visible |
| **Use For** | Config, URLs | Passwords, tokens |
| **Examples** | ENVIRONMENT, URLs | API keys, passwords |
| **Risk** | Low | High if exposed |

---

## Where to Add Them

### In Cloudflare Dashboard

1. Go to https://dash.cloudflare.com
2. Pages → author-fatima-76r
3. Settings tab
4. Scroll to **Environment variables**
5. Add VARIABLES here
6. Scroll to **Secrets** (under Production)
7. Add SECRETS here

---

## Your Setup

### VARIABLES to Add (3 total)
```
ENVIRONMENT = production
BACKEND_URL = https://writer-website-landing-page-1.vercel.app
FRONTEND_URL = https://main.author-fatima-76r-eis.pages.dev
```

### SECRETS to Add (4 total)
```
TURSO_CONNECTION_URL = libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io?authToken=...
TURSO_AUTH_TOKEN = eyJhbGciOiJFZERTQSI...
GMAIL_USER = AuthorFSK@gmail.com
GMAIL_APP_PASSWORD = peed qvhs ekmo kisv
```

---

## Why Both?

### Why not just use Secrets for everything?
- **Performance:** Secrets are encrypted, slightly slower to access
- **Clarity:** Variables show what's public config
- **Security:** Separates sensitive from non-sensitive data

### Why not just use Variables for everything?
- **Security:** Secrets are encrypted, safer for sensitive data
- **Best Practice:** Passwords/tokens should never be visible

---

## Relationship to .env Files

### Local Development (.env files)
```
ENVIRONMENT=production
BACKEND_URL=https://...
TURSO_CONNECTION_URL=libsql://...
TURSO_AUTH_TOKEN=eyJ...
GMAIL_USER=AuthorFSK@gmail.com
GMAIL_APP_PASSWORD=peed qvhs ekmo kisv
```

### Production (Cloudflare Pages)
```
VARIABLES:
  ENVIRONMENT = production
  BACKEND_URL = https://...
  FRONTEND_URL = https://...

SECRETS:
  TURSO_CONNECTION_URL = libsql://...
  TURSO_AUTH_TOKEN = eyJ...
  GMAIL_USER = AuthorFSK@gmail.com
  GMAIL_APP_PASSWORD = peed qvhs ekmo kisv
```

---

## Summary

**Environment Variables** = Umbrella term for all configuration values

**In Cloudflare Pages:**
- **Variables** = Public environment variables
- **Secrets** = Private/encrypted environment variables

Both are types of environment variables, but Secrets are encrypted for security.

---

## Next Steps

1. Go to Cloudflare Dashboard
2. Add 3 VARIABLES (public config)
3. Add 4 SECRETS (sensitive data)
4. Redeploy
5. Done!

All 7 items together = Your complete environment configuration for production.
