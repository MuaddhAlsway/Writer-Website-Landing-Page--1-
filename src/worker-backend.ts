import { Router } from 'itty-router';

const router = Router();

// CORS middleware - must be first
const addCorsHeaders = (response: Response) => {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return new Response(response.body, { status: response.status, headers });
};

// Handle OPTIONS requests
router.options('*', () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
});

// In-memory storage for demo (will be replaced with D1)
const admins: { [key: string]: { id: string; email: string; password: string; name: string } } = {
  'admin@authorfatima.com': {
    id: '1',
    email: 'admin@authorfatima.com',
    password: 'Admin@12345',
    name: 'Admin',
  },
};

const subscribers: { email: string; name: string; language: string; subscribedAt: string }[] = [
  { email: 'john@example.com', name: 'John Doe', language: 'en', subscribedAt: new Date().toISOString() },
  { email: 'jane@example.com', name: 'Jane Smith', language: 'en', subscribedAt: new Date().toISOString() },
  { email: 'ahmed@example.com', name: 'أحمد', language: 'ar', subscribedAt: new Date().toISOString() },
  { email: 'muaddhalsway@gmail.com', name: 'Muadh', language: 'en', subscribedAt: new Date().toISOString() },
];
const newsletters: { id: string; title: string; content: string; language: string; status: string; createdAt: string; sentAt?: string }[] = [];

// Admin Login
router.post('/api/admin/login', async (req) => {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const admin = admins[email];
    if (!admin || admin.password !== password) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const token = Buffer.from(JSON.stringify({ id: admin.id, email: admin.email })).toString('base64');
    
    return new Response(JSON.stringify({
      success: true,
      accessToken: token,
      refreshToken: token,
      expiresIn: 900,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Login failed: ' + err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});

// Get Admin Profile
router.get('/api/admin/profile', async (req) => {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    let decoded;
    try {
      decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const admin = Object.values(admins).find(a => a.id === decoded.id);
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Admin not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        username: admin.email.split('@')[0],
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

    const admin = admins[email];
    if (!admin) {
      return new Response(JSON.stringify({
        success: true,
        message: 'If an account exists, a reset link has been sent',
      }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    const resetToken = Buffer.from(email).toString('base64');
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Reset link sent to your email',
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

    let email = token;
    try {
      email = Buffer.from(token, 'base64').toString('utf-8');
    } catch (e) {
      email = token;
    }

    if (admins[email]) {
      admins[email].password = newPassword;
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

// Get Subscribers
router.get('/make-server-53bed28f/subscribers', async (req) => {
  try {
    return new Response(JSON.stringify({
      success: true,
      subscribers: subscribers,
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

// Send Newsletter
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

    newsletter.status = 'sent';
    newsletter.sentAt = new Date().toISOString();

    return new Response(JSON.stringify({
      success: true,
      message: 'Newsletter sent',
      count: subscribers.length,
      newsletter,
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
});

// Send Email
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

    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Import nodemailer dynamically
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const results = [];
    let sentCount = 0;

    // Send emails to each recipient
    for (const recipient of recipients) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: recipient,
          subject: subject,
          html: content,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${recipient}:`, info.response);
        results.push({
          email: recipient,
          success: true,
          messageId: info.messageId,
        });
        sentCount++;
      } catch (err: any) {
        console.error(`Failed to send email to ${recipient}:`, err.message);
        results.push({
          email: recipient,
          success: false,
          error: err.message,
        });
      }
    }

    const failureCount = results.filter(r => !r.success).length;

    return new Response(JSON.stringify({
      success: true,
      message: `Sent to ${sentCount} recipients, ${failureCount} failed`,
      recipientCount: sentCount,
      results: results,
    }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    console.error('Send email error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send email', details: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// 404
router.all('*', () => new Response(JSON.stringify({ error: 'Not found' }), {
  status: 404,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
}));

export default {
  fetch: async (request: Request) => {
    const response = await router.handle(request);
    
    // Add CORS headers to all responses
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return new Response(response.body, {
      status: response.status,
      headers,
    });
  },
};
