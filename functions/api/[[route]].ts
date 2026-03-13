// Simple in-memory store for demo purposes
const adminStore: { [key: string]: { email: string; password: string; name: string } } = {
  'admin@authorfatima.com': {
    email: 'admin@authorfatima.com',
    password: 'Admin@12345',
    name: 'Admin',
  },
};

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  console.log('API Request:', context.request.method, path);

  // CORS headers
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS requests
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Admin Login
  if (path === '/api/admin/login' && context.request.method === 'POST') {
    try {
      const { email, password } = await context.request.json();
      
      console.log('Login attempt:', email);
      
      if (!email || !password) {
        return new Response(JSON.stringify({ error: 'Email and password required' }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      // Check credentials
      const admin = adminStore[email];
      console.log('Admin found:', !!admin, 'Password match:', admin?.password === password);
      
      if (!admin || admin.password !== password) {
        return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
          status: 401,
          headers: corsHeaders,
        });
      }

      const mockToken = 'mock-jwt-token-' + Date.now();
      
      return new Response(JSON.stringify({
        success: true,
        accessToken: mockToken,
        refreshToken: mockToken,
        expiresIn: 900,
        admin: { id: '1', email: admin.email, name: admin.name },
      }), {
        status: 200,
        headers: corsHeaders,
      });
    } catch (err: any) {
      console.error('Login error:', err);
      return new Response(JSON.stringify({ error: 'Login failed: ' + err.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  }

  // Forgot Password
  if (path === '/api/admin/forgot-password' && context.request.method === 'POST') {
    try {
      const { email } = await context.request.json();
      
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
  }

  // Reset Password
  if (path === '/api/admin/reset-password' && context.request.method === 'POST') {
    try {
      const { token, newPassword } = await context.request.json();
      
      if (!token || !newPassword) {
        return new Response(JSON.stringify({ error: 'Token and new password required' }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      let email = token;
      try {
        email = Buffer.from(token, 'base64').toString('utf-8');
      } catch (e) {
        email = token;
      }

      if (adminStore[email]) {
        adminStore[email].password = newPassword;
      } else {
        adminStore[email] = {
          email,
          password: newPassword,
          name: 'Admin',
        };
      }
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Password reset successfully',
      }), {
        status: 200,
        headers: corsHeaders,
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'Reset failed: ' + err.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  }

  // Get Admin Profile
  if (path === '/api/admin/profile' && context.request.method === 'GET') {
    try {
      return new Response(JSON.stringify({
        success: true,
        admin: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin',
          username: 'admin',
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
  }

  // Get Subscriber Stats
  if ((path === '/api/subscribers/stats' || path === '/make-server-53bed28f/subscribers/stats') && context.request.method === 'GET') {
    console.log('Stats endpoint hit for path:', path);
    try {
      return new Response(JSON.stringify({
        success: true,
        stats: {
          totalSubscribers: 42,
          activeSubscribers: 42,
          monthlyStats: [
            { month: 'Jan', count: 10 },
            { month: 'Feb', count: 15 },
            { month: 'Mar', count: 42 },
          ],
        },
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
  }

  // Get Subscriber Stats (alternative path matching)
  if (path.includes('/subscribers/stats') && context.request.method === 'GET') {
    console.log('Stats endpoint hit (alternative) for path:', path);
    try {
      return new Response(JSON.stringify({
        success: true,
        stats: {
          totalSubscribers: 42,
          activeSubscribers: 42,
          monthlyStats: [
            { month: 'Jan', count: 10 },
            { month: 'Feb', count: 15 },
            { month: 'Mar', count: 42 },
          ],
        },
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
  }

  // Get Subscribers
  if ((path === '/api/subscribers' || path === '/make-server-53bed28f/subscribers') && context.request.method === 'GET') {
    try {
      return new Response(JSON.stringify({
        success: true,
        subscribers: [
          { email: 'subscriber1@example.com', name: 'Subscriber 1', language: 'en' },
          { email: 'subscriber2@example.com', name: 'Subscriber 2', language: 'ar' },
        ],
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
  }

  // Get Newsletters
  if ((path === '/api/newsletters' || path === '/make-server-53bed28f/newsletters') && context.request.method === 'GET') {
    try {
      return new Response(JSON.stringify({
        success: true,
        newsletters: [],
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
  }

  // Create Newsletter
  if ((path === '/api/newsletters' || path === '/make-server-53bed28f/newsletters') && context.request.method === 'POST') {
    try {
      const { title, content, language } = await context.request.json();
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Newsletter created',
        id: 'nl-' + Date.now(),
      }), {
        status: 200,
        headers: corsHeaders,
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'Failed to create newsletter' }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  }

  // Delete Newsletter
  if (path.match(/^\/api\/newsletters\/[^/]+$/) || path.match(/^\/make-server-53bed28f\/newsletters\/[^/]+$/)) {
    if (context.request.method === 'DELETE') {
      try {
        return new Response(JSON.stringify({
          success: true,
          message: 'Newsletter deleted',
        }), {
          status: 200,
          headers: corsHeaders,
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: 'Failed to delete newsletter' }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }
  }

  // Send Newsletter
  if (path.match(/^\/api\/newsletters\/[^/]+\/send$/) || path.match(/^\/make-server-53bed28f\/newsletters\/[^/]+\/send$/)) {
    if (context.request.method === 'POST') {
      try {
        return new Response(JSON.stringify({
          success: true,
          message: 'Newsletter sent',
          count: 42,
          recipientCount: 42,
        }), {
          status: 200,
          headers: corsHeaders,
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: 'Failed to send newsletter' }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }
  }

  // Send Email
  if ((path === '/api/send-email' || path === '/make-server-53bed28f/send-email') && context.request.method === 'POST') {
    try {
      const { recipients, subject, content } = await context.request.json();
      
      console.log('Email sent to:', recipients?.length, 'recipients');
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        count: recipients?.length || 0,
      }), {
        status: 200,
        headers: corsHeaders,
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  }

  // Default 404
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: corsHeaders,
  });
};
