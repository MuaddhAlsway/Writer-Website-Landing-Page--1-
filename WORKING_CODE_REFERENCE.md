# Working Code Reference - Copy & Paste Ready

## 1. BACKEND - Newsletter Endpoint

### File: `functions/api/newsletters.ts`

**Key sections:**

#### Database Connection (Fixed)
```typescript
function initDb(env: any) {
  if (!db) {
    // Try TURSO_CONNECTION_URL first (new name), then TURSO_DATABASE_URL (old name)
    const connectionUrl = env.TURSO_CONNECTION_URL || env.TURSO_DATABASE_URL;
    const authToken = env.TURSO_AUTH_TOKEN;

    console.log('🔍 Database Connection Check:');
    console.log('   TURSO_CONNECTION_URL:', connectionUrl ? '✅ Set' : '❌ Missing');
    console.log('   TURSO_DATABASE_URL:', env.TURSO_DATABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('   TURSO_AUTH_TOKEN:', authToken ? '✅ Set' : '❌ Missing');

    if (!connectionUrl || !authToken) {
      const error = 'Turso not configured - missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN';
      console.error('❌', error);
      throw new Error(error);
    }

    try {
      console.log('📡 Connecting to Turso...');
      db = createClient({
        url: connectionUrl,
        authToken: authToken,
      });
      console.log('✅ Turso connected successfully');
    } catch (err: any) {
      console.error('❌ Turso connection failed:', err.message);
      throw new Error(`Database connection failed: ${err.message}`);
    }
  }
  return db;
}
```

#### GET Endpoint (Fixed)
```typescript
if (request.method === 'GET') {
  try {
    console.log('📋 Fetching newsletters from database...');
    const db_instance = initDb(env);
    
    const result = await db_instance.execute('SELECT * FROM newsletters ORDER BY sentAt DESC');
    const newsletters = result.rows.map((row: any) => ({
      id: row.id,
      subject: row.subject,
      content: row.content,
      sentAt: row.sentAt,
      recipientCount: row.recipientCount,
    }));

    console.log(`✅ Retrieved ${newsletters.length} newsletters`);
    return new Response(
      JSON.stringify({ 
        success: true,
        newsletters, 
        total: newsletters.length,
        message: `Found ${newsletters.length} newsletters`
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    console.error('❌ Database error:', err.message);
    
    // Check if it's a configuration error
    if (err.message.includes('not configured') || err.message.includes('missing')) {
      return new Response(
        JSON.stringify({ 
          error: 'Database not configured', 
          details: err.message,
          hint: 'Add TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN to Cloudflare environment variables'
        }),
        { status: 503, headers: corsHeaders }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get newsletters', 
        details: err.message,
        hint: 'Check if newsletters table exists in database'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}
```

---

## 2. FRONTEND - API Client

### File: `src/utils/api.ts`

**Key method:**

```typescript
async getNewsletters() {
  try {
    const response = await fetch(`/api/newsletters`, {
      headers: { 'Authorization': `Bearer ${this.accessToken}` },
    });
    if (!response.ok) throw new Error('Failed to get newsletters');
    return await response.json();
  } catch (err) {
    console.error('Get newsletters error:', err);
    throw err;
  }
}
```

---

## 3. FRONTEND - Newsletter Manager

### File: `src/app/components/admin/NewsletterManager.tsx`

**Key sections:**

#### Load Newsletters
```typescript
useEffect(() => {
  apiClient.setToken(accessToken);
  loadNewsletters();
}, [accessToken]);

const loadNewsletters = async () => {
  try {
    setError('');
    const data = await apiClient.getNewsletters();
    setNewsletters(data.newsletters || []);
  } catch (err: any) {
    console.error('Failed to load newsletters:', err);
    setError(err.message || 'Failed to load newsletters');
  }
};
```

#### Display Newsletters
```typescript
{error && (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
    <p className="text-sm text-red-700">{error}</p>
  </div>
)}

<div className="grid gap-4">
  {newsletters.map((newsletter) => (
    <Card key={newsletter.id} className="p-6 bg-white shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-stone-900 mb-2">
            {newsletter.subject}
          </h3>
          <div className="text-stone-700 line-clamp-3 prose prose-sm max-w-none" 
            dangerouslySetInnerHTML={{ __html: newsletter.content.substring(0, 200) }} 
          />
        </div>
      </div>
    </Card>
  ))}
</div>
```

---

## 4. ENVIRONMENT VARIABLES

### File: `.env.production`

```bash
# Database
TURSO_CONNECTION_URL=libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA

# Email
GMAIL_USER=AuthorFSK@gmail.com
GMAIL_APP_PASSWORD=peed qvhs ekmo kisv
```

### Cloudflare Dashboard Settings

**Production Environment Variables:**

| Name | Value |
|------|-------|
| TURSO_CONNECTION_URL | libsql://authorfsk-... |
| TURSO_AUTH_TOKEN | eyJhbGciOi... |
| GMAIL_USER | AuthorFSK@gmail.com |
| GMAIL_APP_PASSWORD | peed qvhs ekmo kisv |

---

## 5. TESTING COMMANDS

### Test 1: Login
```powershell
$response = Invoke-WebRequest -Uri "https://main.author-fatima-76r-eis.pages.dev/api/admin/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@authorfatima.com","password":"Admin@12345"}' `
  -UseBasicParsing

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

### Test 2: Get Newsletters
```powershell
$token = "demo-token-1234567890"
$response = Invoke-WebRequest -Uri "https://main.author-fatima-76r-eis.pages.dev/api/newsletters" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $token"} `
  -UseBasicParsing

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

### Test 3: Get Newsletters (Without Token - Should Fail)
```powershell
$response = Invoke-WebRequest -Uri "https://main.author-fatima-76r-eis.pages.dev/api/newsletters" `
  -Method GET `
  -UseBasicParsing

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

---

## 6. ERROR RESPONSES

### Success Response (200)
```json
{
  "success": true,
  "newsletters": [
    {
      "id": "nl-123",
      "subject": "Newsletter Title",
      "content": "<p>Content here</p>",
      "sentAt": "2026-03-17T10:30:00Z",
      "recipientCount": 5
    }
  ],
  "total": 1,
  "message": "Found 1 newsletters"
}
```

### Unauthorized Error (401)
```json
{
  "error": "Unauthorized - missing token"
}
```

### Database Not Configured (503)
```json
{
  "error": "Database not configured",
  "details": "Turso not configured - missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN",
  "hint": "Add TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN to Cloudflare environment variables"
}
```

### Database Error (500)
```json
{
  "error": "Failed to get newsletters",
  "details": "table newsletters does not exist",
  "hint": "Check if newsletters table exists in database"
}
```

---

## 7. DEPLOYMENT CHECKLIST

- [ ] Add TURSO_CONNECTION_URL to Cloudflare
- [ ] Add TURSO_AUTH_TOKEN to Cloudflare
- [ ] Add GMAIL_USER to Cloudflare
- [ ] Add GMAIL_APP_PASSWORD to Cloudflare
- [ ] Redeploy to Cloudflare Pages
- [ ] Wait 2-3 minutes for deployment
- [ ] Test login endpoint
- [ ] Test newsletter endpoint with token
- [ ] Test newsletter endpoint without token (should fail)
- [ ] Test in browser dashboard
- [ ] Check Network tab for Authorization header
- [ ] Verify response status is 200

---

## 8. QUICK REFERENCE

### Environment Variable Names
- ✅ TURSO_CONNECTION_URL (preferred)
- ✅ TURSO_DATABASE_URL (fallback)
- ✅ TURSO_AUTH_TOKEN (required)

### Status Codes
- 200 = Success
- 401 = Unauthorized (missing/invalid token)
- 503 = Service Unavailable (database not configured)
- 500 = Server Error (database error)

### Common Issues
- "Turso not configured" → Add variables to Cloudflare
- "Failed to get newsletters" → Check database table exists
- "Unauthorized" → Check token is sent in Authorization header
- "Backend unavailable" → Check Cloudflare deployment status
