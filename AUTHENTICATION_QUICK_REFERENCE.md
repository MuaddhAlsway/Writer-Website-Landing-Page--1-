# Authentication Quick Reference Card

## The Problem
```
GET /api/newsletters
Status: 500 ❌
Response: { "error": "Unauthorized" }
```

## The Fix
```
GET /api/newsletters
Status: 401 ✅ (correct error code)
Response: { "error": "Unauthorized - Missing or invalid token" }
```

---

## Frontend: How to Send Token

### Step 1: Get Token (After Login)
```typescript
const response = await fetch('/api/admin/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});
const { accessToken } = await response.json();
```

### Step 2: Send Token in Every Request
```typescript
const response = await fetch('/api/newsletters', {
  headers: { 
    'Authorization': `Bearer ${accessToken}` 
  },
});
```

### Step 3: Handle Errors
```typescript
if (response.status === 401) {
  // Token missing or invalid - need to login again
  console.log('Please login again');
}
```

---

## Backend: How to Check Token

### Check for Token
```javascript
const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

### Extract Token
```javascript
const token = authHeader.substring(7); // Remove "Bearer "
```

### Verify Token (Optional)
```javascript
try {
  const decoded = jwt.verify(token, SECRET_KEY);
  // Token is valid, proceed
} catch (err) {
  return res.status(401).json({ error: 'Invalid token' });
}
```

---

## Common Patterns

### Pattern 1: API Client Class
```typescript
class ApiClient {
  private accessToken: string | null = null;

  async login(email: string, password: string) {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    this.accessToken = data.accessToken;
  }

  async getNewsletters() {
    return fetch('/api/newsletters', {
      headers: { 'Authorization': `Bearer ${this.accessToken}` },
    }).then(r => r.json());
  }
}
```

### Pattern 2: Middleware (Express)
```javascript
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.get('/api/newsletters', authMiddleware, (req, res) => {
  // Handle request
});
```

---

## Debugging Checklist

- [ ] Token exists in browser (check localStorage)
- [ ] Token is being sent in Authorization header
- [ ] Authorization header format is correct: `Bearer TOKEN`
- [ ] Backend is checking for Authorization header
- [ ] Backend returns 401 (not 500) for missing token
- [ ] Token hasn't expired
- [ ] CORS headers allow Authorization header

---

## Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| "Unauthorized" | No token sent | Add Authorization header |
| "Invalid token" | Token expired | Login again |
| "Missing token" | Token not in header | Check header format |
| 500 error | Wrong status code | Use 401 instead |

---

## Testing

### Browser Console Test
```javascript
// Get your token
const token = localStorage.getItem('admin_access_token');

// Test request
fetch('/api/newsletters', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log)
```

### curl Test
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-api.com/api/newsletters
```

---

## Status Codes

| Code | Use When |
|------|----------|
| 200 | ✅ Success |
| 400 | ❌ Bad request (missing field) |
| 401 | ❌ Unauthorized (no/invalid token) |
| 403 | ❌ Forbidden (valid token, no permission) |
| 500 | ❌ Server error (database crash) |

**Remember**: Use 401 for auth errors, not 500!

---

## Your App Status

✅ Frontend: Sending token correctly
✅ Backend: Checking token properly
✅ Error Code: Changed to 401
✅ CORS: Headers configured
✅ Deployment: Live on Vercel & Cloudflare

---

## Next Steps

1. Test the admin dashboard
2. Go to Newsletters tab
3. Should see list without errors
4. Try adding a newsletter
5. Check browser console (F12) - should be clean
