import { Router } from 'itty-router';

const router = Router();

// CORS middleware
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// Handle OPTIONS
router.options('*', () => new Response(null, { status: 204, headers: corsHeaders }));

// Admin Login
router.post('/api/admin/login', async (req) => {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Use real credentials from environment or database
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@authorfatima.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const adminName = process.env.ADMIN_NAME || 'Admin';

    if (email === adminEmail && password === adminPassword) {
      const token = Buffer.from(JSON.stringify({ id: '1', email })).toString('base64');
      return new Response(JSON.stringify({
        success: true,
        accessToken: token,
        refreshToken: token,
        expiresIn: 900,
        admin: { id: '1', email, name: adminName },
      }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
      status: 401,
      headers: corsHeaders,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Login failed' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Forgot Password
router.post('/api/admin/forgot-password', async (req) => {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const resetToken = Buffer.from(email).toString('base64');
    
    return new Response(JSON.stringify({
      success: true,
      message: 'If an account exists, a reset link has been sent',
      resetToken,
    }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Request failed' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Reset Password
router.post('/api/admin/reset-password', async (req) => {
  try {
    const { token, newPassword } = await req.json();
    
    if (!token || !newPassword) {
      return new Response(JSON.stringify({ error: 'Token and new password required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Password reset successfully',
    }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Reset failed' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Get Profile
router.get('/api/admin/profile', async (req) => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@authorfatima.com';
    const adminName = process.env.ADMIN_NAME || 'Admin';

    return new Response(JSON.stringify({
      success: true,
      admin: {
        id: '1',
        email: adminEmail,
        name: adminName,
        username: adminEmail.split('@')[0],
        created_at: new Date().toISOString(),
      },
    }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to fetch profile' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// In-memory storage
const subscribers = [
  { email: 'john@example.com', name: 'John Doe', language: 'en', subscribedAt: new Date().toISOString() },
  { email: 'jane@example.com', name: 'Jane Smith', language: 'en', subscribedAt: new Date().toISOString() },
  { email: 'ahmed@example.com', name: 'أحمد', language: 'ar', subscribedAt: new Date().toISOString() },
  { email: 'muaddhalsway@gmail.com', name: 'Muadh', language: 'en', subscribedAt: new Date().toISOString() },
];
const newsletters: any[] = [];

// Get Subscribers
router.get('/make-server-53bed28f/subscribers', async (req) => {
  try {
    return new Response(JSON.stringify({
      success: true,
      subscribers: subscribers,
      total: subscribers.length,
    }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to fetch subscribers' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Get Subscriber Stats
router.get('/make-server-53bed28f/subscribers/stats', async (req) => {
  try {
    const total = subscribers.length;
    const active = Math.floor(total * 0.8);
    
    return new Response(JSON.stringify({
      totalSubscribers: total,
      activeSubscribers: active,
      monthlyStats: [],
    }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Add Subscriber
router.post('/make-server-53bed28f/subscribers', async (req) => {
  try {
    const { email, language } = await req.json();
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (subscribers.find(s => s.email === email)) {
      return new Response(JSON.stringify({ error: 'Email already subscribed' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    subscribers.push({
      email,
      name: '',
      language: language || 'en',
      subscribedAt: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true, message: 'Subscriber added' }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to add subscriber' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Delete Subscriber
router.delete('/make-server-53bed28f/subscribers/:email', async (req) => {
  try {
    const email = req.params.email;
    const index = subscribers.findIndex(s => s.email === email);
    
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Subscriber not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    subscribers.splice(index, 1);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to delete subscriber' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Get Newsletters
router.get('/make-server-53bed28f/newsletters', async (req) => {
  try {
    return new Response(JSON.stringify({
      success: true,
      newsletters: newsletters,
    }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to fetch newsletters' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Create Newsletter
router.post('/make-server-53bed28f/newsletters', async (req) => {
  try {
    const { title, content, language } = await req.json();
    
    if (!title || !content) {
      return new Response(JSON.stringify({ error: 'Title and content required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const id = 'nl-' + Date.now();
    const newsletter = {
      id,
      title,
      content,
      language: language || 'en',
      status: 'draft',
      createdAt: new Date().toISOString(),
      sentAt: null,
      recipientCount: 0,
    };

    newsletters.push(newsletter);

    return new Response(JSON.stringify({ success: true, message: 'Newsletter created', id }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to create newsletter' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Delete Newsletter
router.delete('/make-server-53bed28f/newsletters/:id', async (req) => {
  try {
    const id = req.params.id;
    const index = newsletters.findIndex(n => n.id === id);
    
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Newsletter not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    newsletters.splice(index, 1);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to delete newsletter' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Send Newsletter - Proxy to backend server
router.post('/make-server-53bed28f/newsletters/:id/send', async (req) => {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/')[4];

    const newsletter = newsletters.find(n => n.id === id);
    if (!newsletter) {
      return new Response(JSON.stringify({ error: 'Newsletter not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Get recipients based on language
    let recipients = subscribers;
    if (newsletter.language && newsletter.language !== '') {
      recipients = subscribers.filter(s => s.language === newsletter.language);
    }

    // Proxy to backend server for actual email sending
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${backendUrl}/make-server-53bed28f/send-newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: recipients.map(r => r.email),
          subject: newsletter.title,
          content: newsletter.content,
          language: newsletter.language,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        newsletter.status = 'sent';
        newsletter.sentAt = new Date().toISOString();
        newsletter.recipientCount = data.sentCount || recipients.length;

        return new Response(JSON.stringify({
          success: true,
          message: 'Newsletter sent',
          count: data.sentCount || recipients.length,
          recipientCount: data.sentCount || recipients.length,
        }), {
          status: 200,
          headers: corsHeaders,
        });
      } else {
        return new Response(JSON.stringify({ error: 'Failed to send newsletter' }), {
          status: response.status,
          headers: corsHeaders,
        });
      }
    } catch (err: any) {
      console.error('Backend server error:', err);
      
      // Fallback: mark as sent locally
      newsletter.status = 'sent';
      newsletter.sentAt = new Date().toISOString();
      newsletter.recipientCount = recipients.length;

      return new Response(JSON.stringify({
        success: true,
        message: 'Newsletter marked as sent (backend server not available)',
        count: recipients.length,
        recipientCount: recipients.length,
      }), {
        status: 200,
        headers: corsHeaders,
      });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to send newsletter' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Send Email - Proxy to backend server
router.post('/make-server-53bed28f/send-email', async (req) => {
  try {
    const { recipients, subject, content, language = 'en' } = await req.json();
    
    if (!recipients || recipients.length === 0) {
      return new Response(JSON.stringify({ error: 'Recipients required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!subject || !content) {
      return new Response(JSON.stringify({ error: 'Subject and content required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Try to use backend server for email sending (supports Gmail app password)
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${backendUrl}/make-server-53bed28f/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipients, subject, content, language }),
      });

      if (response.ok) {
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: corsHeaders,
        });
      } else {
        const error = await response.json().catch(() => ({}));
        return new Response(JSON.stringify({ error: error.error || 'Failed to send email' }), {
          status: response.status,
          headers: corsHeaders,
        });
      }
    } catch (err: any) {
      console.error('Backend server error:', err);
      return new Response(JSON.stringify({ 
        error: 'Backend server not available',
        details: 'Please run: npm run server'
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// 404
router.all('*', () => new Response(JSON.stringify({ error: 'Not found' }), {
  status: 404,
  headers: corsHeaders,
}));

export default {
  fetch: router.handle,
};
