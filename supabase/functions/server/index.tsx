import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
// Restrict to localhost for development, update for production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  // Add your production domain here: "https://yourdomain.com"
];

app.use(
  "/*",
  cors({
    origin: allowedOrigins,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Add simple rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(key: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// Middleware to verify admin auth
async function verifyAdmin(c: any, next: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user?.id) {
    return c.json({ error: 'Unauthorized - Invalid token' }, 401);
  }

  c.set('userId', user.id);
  await next();
}

// Health check endpoint
app.get("/make-server-53bed28f/health", (c) => {
  return c.json({ status: "ok" });
});

// ============= ADMIN AUTH ROUTES =============

// Admin signup
app.post("/make-server-53bed28f/admin/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'admin' },
      email_confirm: true, // Auto-confirm since email server isn't configured
    });

    if (error) {
      console.error('Admin signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Admin signup error:', error);
    return c.json({ error: 'Failed to create admin account' }, 500);
  }
});

// ============= SUBSCRIBER ROUTES =============

// Add new subscriber (public)
app.post("/make-server-53bed28f/subscribers", async (c) => {
  try {
    // Rate limiting for public endpoint
    const clientIp = c.req.header('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`subscriber:${clientIp}`, 10, 3600000)) {
      return c.json({ error: 'Too many requests. Please try again later.' }, 429);
    }

    const { email, name, language } = await c.req.json();
    
    if (!email || typeof email !== 'string') {
      return c.json({ error: 'Email is required' }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email format' }, 400);
    }

    const subscriberKey = `subscriber:${email.toLowerCase()}`;
    
    // Check if already exists
    const existing = await kv.get(subscriberKey);
    if (existing) {
      return c.json({ error: 'Email already subscribed' }, 400);
    }

    const subscriber = {
      email: email.toLowerCase(),
      name: (name && typeof name === 'string') ? name.slice(0, 100) : '',
      language: (language && ['en', 'ar'].includes(language)) ? language : 'en',
      subscribedAt: new Date().toISOString(),
      isActive: true,
    };

    await kv.set(subscriberKey, subscriber);

    // Update monthly stats
    const monthKey = new Date().toISOString().slice(0, 7); // YYYY-MM
    const statsKey = `stats:${monthKey}`;
    const stats = await kv.get(statsKey) || { month: monthKey, count: 0 };
    stats.count += 1;
    await kv.set(statsKey, stats);

    return c.json({ success: true, subscriber });
  } catch (error) {
    console.error('Subscriber creation error:', error);
    return c.json({ error: 'Failed to add subscriber' }, 500);
  }
});

// Get all subscribers (admin only)
app.get("/make-server-53bed28f/subscribers", verifyAdmin, async (c) => {
  try {
    const subscribers = await kv.getByPrefix('subscriber:');
    return c.json({ subscribers });
  } catch (error) {
    console.error('Get subscribers error:', error);
    return c.json({ error: 'Failed to fetch subscribers' }, 500);
  }
});

// Get subscriber statistics (admin only)
app.get("/make-server-53bed28f/subscribers/stats", verifyAdmin, async (c) => {
  try {
    const stats = await kv.getByPrefix('stats:');
    
    // Calculate total subscribers
    const subscribers = await kv.getByPrefix('subscriber:');
    const totalSubscribers = subscribers.length;
    const activeSubscribers = subscribers.filter((s: any) => s.isActive).length;

    // Get monthly stats for the last 12 months
    const monthlyStats = stats.sort((a: any, b: any) => 
      a.month.localeCompare(b.month)
    ).slice(-12);

    return c.json({
      totalSubscribers,
      activeSubscribers,
      monthlyStats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

// Delete subscriber (admin only)
app.delete("/make-server-53bed28f/subscribers/:email", verifyAdmin, async (c) => {
  try {
    const email = c.req.param('email');
    const subscriberKey = `subscriber:${email}`;
    
    await kv.del(subscriberKey);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    return c.json({ error: 'Failed to delete subscriber' }, 500);
  }
});

// ============= NEWSLETTER ROUTES =============

// Create newsletter (admin only)
app.post("/make-server-53bed28f/newsletters", verifyAdmin, async (c) => {
  try {
    const { subject, content, language } = await c.req.json();
    
    if (!subject || !content) {
      return c.json({ error: 'Subject and content are required' }, 400);
    }

    const id = `newsletter:${Date.now()}`;
    const newsletter = {
      id,
      subject,
      content,
      language: language || 'en',
      createdAt: new Date().toISOString(),
      sentAt: null,
      recipientCount: 0,
    };

    await kv.set(id, newsletter);

    return c.json({ success: true, newsletter });
  } catch (error) {
    console.error('Newsletter creation error:', error);
    return c.json({ error: 'Failed to create newsletter' }, 500);
  }
});

// Get all newsletters (admin only)
app.get("/make-server-53bed28f/newsletters", verifyAdmin, async (c) => {
  try {
    const newsletters = await kv.getByPrefix('newsletter:');
    return c.json({ newsletters: newsletters.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )});
  } catch (error) {
    console.error('Get newsletters error:', error);
    return c.json({ error: 'Failed to fetch newsletters' }, 500);
  }
});

// Send newsletter (admin only)
app.post("/make-server-53bed28f/newsletters/:id/send", verifyAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const newsletter = await kv.get(id);
    
    if (!newsletter) {
      return c.json({ error: 'Newsletter not found' }, 404);
    }

    const subscribers = await kv.getByPrefix('subscriber:');
    const activeSubscribers = subscribers.filter((s: any) => s.isActive);

    // Filter by language if newsletter has language specified
    const recipients = newsletter.language 
      ? activeSubscribers.filter((s: any) => s.language === newsletter.language)
      : activeSubscribers;

    // In a real application, you would integrate with an email service like SendGrid, Mailgun, etc.
    // For now, we'll just log the action
    console.log(`Sending newsletter "${newsletter.subject}" to ${recipients.length} recipients`);
    recipients.forEach((recipient: any) => {
      console.log(`  → ${recipient.email}`);
    });

    // Update newsletter with sent info
    newsletter.sentAt = new Date().toISOString();
    newsletter.recipientCount = recipients.length;
    await kv.set(id, newsletter);

    return c.json({ 
      success: true, 
      recipientCount: recipients.length,
      message: 'Newsletter sent successfully (simulated - integrate email service for production)'
    });
  } catch (error) {
    console.error('Send newsletter error:', error);
    return c.json({ error: 'Failed to send newsletter' }, 500);
  }
});

// Delete newsletter (admin only)
app.delete("/make-server-53bed28f/newsletters/:id", verifyAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete newsletter error:', error);
    return c.json({ error: 'Failed to delete newsletter' }, 500);
  }
});

// ============= EMAIL SENDING ROUTE =============

// Send individual email (admin only)
app.post("/make-server-53bed28f/send-email", verifyAdmin, async (c) => {
  try {
    const { recipients, subject, content } = await c.req.json();
    
    if (!recipients || !subject || !content) {
      return c.json({ error: 'Recipients, subject, and content are required' }, 400);
    }

    // In a real application, integrate with email service
    console.log(`Sending email "${subject}" to ${recipients.length} recipients`);
    recipients.forEach((email: string) => {
      console.log(`  → ${email}`);
    });

    return c.json({ 
      success: true, 
      recipientCount: recipients.length,
      message: 'Email sent successfully (simulated - integrate email service for production)'
    });
  } catch (error) {
    console.error('Send email error:', error);
    return c.json({ error: 'Failed to send email' }, 500);
  }
});

Deno.serve(app.fetch);