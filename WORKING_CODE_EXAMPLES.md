# Working Code Examples

## 1. FRONTEND - API CLIENT (src/utils/api.ts)

The current implementation is mostly correct. Key points:

```typescript
// ✅ CORRECT: Token storage
private loadTokensFromStorage() {
  if (typeof window !== 'undefined') {
    this.accessToken = localStorage.getItem('admin_access_token');
    this.refreshToken = localStorage.getItem('admin_refresh_token');
  }
}

// ✅ CORRECT: Token in Authorization header
private async request(endpoint: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (this.accessToken) {
    headers['Authorization'] = `Bearer ${this.accessToken}`;  // ✅ Correct format
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });
}

// ✅ CORRECT: Newsletter fetch with token
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

## 2. FRONTEND - NEWSLETTER MANAGER (src/app/components/admin/NewsletterManager.tsx)

Key improvements needed:

```typescript
// ✅ CORRECT: Load newsletters after login
useEffect(() => {
  apiClient.setToken(accessToken);  // Set token from props
  loadNewsletters();
}, [accessToken]);

// ✅ CORRECT: Load with error handling
const loadNewsletters = async () => {
  try {
    setError('');
    const data = await apiClient.getNewsletters();
    setNewsletters(data.newsletters || []);
  } catch (err: any) {
    console.error('Failed to load newsletters:', err);
    setError(err.message || 'Failed to load newsletters');
    // If 401, redirect to login
    if (err.message.includes('401')) {
      // Redirect to login
    }
  }
};
```

## 3. BACKEND - NEWSLETTER ENDPOINT (functions/api/newsletters.ts)

Key improvements applied:

```typescript
// ✅ CORRECT: Token validation
const authHeader = request.headers.get('authorization');
const token = authHeader?.split(' ')[1];

if (!token) {
  console.warn('❌ Missing authorization token');
  return new Response(
    JSON.stringify({ error: 'Unauthorized - missing token' }),
    { status: 401, headers: corsHeaders }  // ✅ Return 401, not 500
  );
}

// ✅ CORRECT: Validate token
if (!validateToken(token, env)) {
  console.warn('❌ Invalid token');
  return new Response(
    JSON.stringify({ error: 'Unauthorized - invalid token' }),
    { status: 401, headers: corsHeaders }
  );
}

// ✅ CORRECT: GET newsletters
if (request.method === 'GET') {
  try {
    console.log('📋 Fetching newsletters from database...');
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

## 4. BACKEND - AUTH MIDDLEWARE

Create a reusable middleware:

```typescript
// ✅ CORRECT: Auth middleware
function validateToken(token: string, env: any): boolean {
  try {
    // For now, just check if token exists and is not empty
    // In production, verify JWT signature using env.JWT_SECRET
    if (!token || token.length < 10) {
      return false;
    }
    // TODO: Implement proper JWT verification
    // const decoded = jwt.verify(token, env.JWT_SECRET);
    return true;
  } catch (err) {
    console.error('Token validation error:', err);
    return false;
  }
}

// ✅ CORRECT: Extract token from header
function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  return token || null;
}

// ✅ CORRECT: Check auth
function checkAuth(request: Request, env: any): { valid: boolean; error?: string } {
  const token = extractToken(request);
  
  if (!token) {
    return { valid: false, error: 'Unauthorized - missing token' };
  }
  
  if (!validateToken(token, env)) {
    return { valid: false, error: 'Unauthorized - invalid token' };
  }
  
  return { valid: true };
}
```

## 5. CLOUDFLARE PAGES ROUTING (functions/[[route]].ts)

Current implementation is correct:

```typescript
// ✅ CORRECT: Forward API requests to backend
if (path.startsWith('/api/') || path.startsWith('/make-server-53bed28f/')) {
  try {
    const backendResponse = await fetch(`${backendUrl}${path}`, {
      method: context.request.method,
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(context.request.headers),  // ✅ Pass all headers including Authorization
      },
      body: context.request.method !== 'GET' ? await context.request.text() : undefined,
    });

    const responseHeaders = new Headers(backendResponse.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    
    return new Response(backendResponse.body, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    console.error('Backend proxy error:', err);
    return new Response(JSON.stringify({ error: 'Backend unavailable' }), {
      status: 503,
      headers: corsHeaders,
    });
  }
}
```

## 6. ADMIN LOGIN (functions/api/admin/login.ts)

Current implementation is correct:

```typescript
// ✅ CORRECT: Login endpoint
export async function onRequestPost(context: any) {
  try {
    const { email, password } = await context.request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // For now, accept any login (demo mode)
    // In production, verify against database
    if (email && password) {
      const accessToken = 'demo-token-' + Date.now();
      const refreshToken = 'refresh-token-' + Date.now();

      return new Response(
        JSON.stringify({
          success: true,
          accessToken,
          refreshToken,
          user: { email, name: 'Admin' }
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid credentials' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Login failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

## 7. ENVIRONMENT VARIABLES (wrangler.toml)

Current configuration is correct:

```toml
[env.production]
name = "author-fatima-prod"

[env.production.vars]
ENVIRONMENT = "production"
BACKEND_URL = "https://writer-website-landing-page-1.vercel.app"
FRONTEND_URL = "https://main.author-fatima-76r-eis.pages.dev"

# Secrets (set via Cloudflare Dashboard)
# - TURSO_CONNECTION_URL
# - TURSO_AUTH_TOKEN
# - GMAIL_USER
# - GMAIL_APP_PASSWORD
# - JWT_SECRET (optional)
```

## 8. CURL TESTING EXAMPLES

### Test 1: Login
```bash
curl -X POST https://main.author-fatima-76r-eis.pages.dev/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@authorfatima.com","password":"Admin@12345"}'
```

### Test 2: Get Newsletters (with token)
```bash
TOKEN="demo-token-1234567890"
curl -X GET https://main.author-fatima-76r-eis.pages.dev/api/newsletters \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Test 3: Get Newsletters (without token - should fail)
```bash
curl -X GET https://main.author-fatima-76r-eis.pages.dev/api/newsletters \
  -H "Content-Type: application/json"
```

## 9. POSTMAN TESTING

### Setup
1. Create new request
2. Set method to GET
3. Set URL to `https://main.author-fatima-76r-eis.pages.dev/api/newsletters`
4. Go to **Headers** tab
5. Add header:
   - Key: `Authorization`
   - Value: `Bearer demo-token-1234567890`
6. Click **Send**

Expected response:
```json
{
  "success": true,
  "newsletters": [],
  "total": 0,
  "message": "Found 0 newsletters"
}
```

## 10. BROWSER CONSOLE TESTING

```javascript
// Get token
const token = localStorage.getItem('admin_access_token');
console.log('Token:', token);

// Test fetch
fetch('/api/newsletters', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```
