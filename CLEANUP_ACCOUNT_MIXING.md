# Fix Account Mixing Issues

## Step 1: Logout Old Cloudflare Account
```bash
wrangler logout
```

## Step 2: Login with NEW Account
```bash
wrangler login
```

## Step 3: Update wrangler.toml
Replace entire file with:

```toml
name = "author-fatima"
compatibility_date = "2024-12-18"
compatibility_flags = ["nodejs_compat"]

pages_build_output_dir = "dist"

[vars]
ENVIRONMENT = "production"
EMAIL_SERVICE = "gmail"
EMAIL_USER = "AuthorFSK@gmail.com"
EMAIL_FROM = "AuthorFSK@gmail.com"
TURSO_CONNECTION_URL = "libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io"
BACKEND_URL = "https://your-backend-url.com"

[[d1_databases]]
binding = "DB"
database_name = "newsletter-db"
database_id = "fef0830f-e2fa-458e-a974-28644621ddeb"
```

## Step 4: Update .env
```
EMAIL_USER=AuthorFSK@gmail.com
EMAIL_PASSWORD=peed qvhs ekmo kisv
TURSO_CONNECTION_URL=libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io
TURSO_AUTH_TOKEN=your_token_here
```

## Step 5: Remove Old References
Delete these files (they contain old account info):
- `create-admin.mjs` (references old email)
- `server.mjs` (old implementation)
- `server-db.mjs` (old implementation)
- `server-secure.mjs` (old implementation)

Keep only:
- `backend-server.mjs` (current implementation)
- `server-turso-full.mjs` (if needed)

## Step 6: Deploy Fresh
```bash
npm run build
wrangler pages deploy dist
```

## Step 7: Deploy Backend
Use Replit or Glitch with:
- `EMAIL_USER=AuthorFSK@gmail.com`
- `EMAIL_PASSWORD=peed qvhs ekmo kisv`

## Step 8: Update Backend URL
Once backend is deployed, update `wrangler.toml`:
```
BACKEND_URL = "https://your-replit-or-glitch-url"
```

Then redeploy frontend.

## Done!
All account mixing issues resolved.
