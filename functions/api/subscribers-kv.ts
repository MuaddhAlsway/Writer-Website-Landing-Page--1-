// Cloudflare KV-based Subscribers API
// This uses Cloudflare KV instead of Turso for persistent storage

export async function onRequest(context: any) {
  const { request } = context;
  const env = context.env;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Get KV namespace
    const kv = env.SUBSCRIBERS_KV;
    if (!kv) {
      console.error('❌ KV namespace not found');
      return new Response(
        JSON.stringify({ error: 'KV storage not configured' }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('✅ KV namespace connected');

    // POST - Subscribe
    if (request.method === 'POST') {
      const body = await request.json();
      const { email, language } = body;
      
      if (!email) {
        return new Response(
          JSON.stringify({ error: 'Email required' }),
          { status: 400, headers: corsHeaders }
        );
      }

      try {
        // Check if already subscribed
        const existing = await kv.get(`subscriber:${email}`);
        if (existing) {
          return new Response(
            JSON.stringify({ error: 'Already subscribed' }),
            { status: 400, headers: corsHeaders }
          );
        }

        // Create subscriber object
        const subscriber = {
          email,
          language: language || 'en',
          subscribedAt: new Date().toISOString(),
          name: '',
        };

        // Save to KV
        await kv.put(`subscriber:${email}`, JSON.stringify(subscriber));
        
        // Add to subscribers list
        const listKey = 'subscribers:list';
        const listData = await kv.get(listKey);
        const subscribers = listData ? JSON.parse(listData) : [];
        subscribers.push(email);
        await kv.put(listKey, JSON.stringify(subscribers));

        console.log(`✅ Subscriber saved to KV: ${email}`);

        return new Response(
          JSON.stringify({ success: true, subscriber }),
          { status: 200, headers: corsHeaders }
        );
      } catch (err: any) {
        console.error('❌ KV error:', err.message);
        return new Response(
          JSON.stringify({ error: 'Storage error', details: err.message }),
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // GET - List subscribers
    if (request.method === 'GET') {
      const token = request.headers.get('authorization')?.split(' ')[1];
      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: corsHeaders }
        );
      }

      try {
        const listKey = 'subscribers:list';
        const listData = await kv.get(listKey);
        const subscriberEmails = listData ? JSON.parse(listData) : [];

        // Get full subscriber data
        const subscribers = [];
        for (const email of subscriberEmails) {
          const data = await kv.get(`subscriber:${email}`);
          if (data) {
            subscribers.push(JSON.parse(data));
          }
        }

        console.log(`✅ Retrieved ${subscribers.length} subscribers from KV`);
        return new Response(
          JSON.stringify({ subscribers, total: subscribers.length }),
          { status: 200, headers: corsHeaders }
        );
      } catch (err: any) {
        console.error('❌ KV error:', err.message);
        return new Response(
          JSON.stringify({ error: 'Storage error', details: err.message }),
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // DELETE - Remove subscriber
    if (request.method === 'DELETE') {
      const token = request.headers.get('authorization')?.split(' ')[1];
      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: corsHeaders }
        );
      }

      try {
        const body = await request.json();
        const { email } = body;

        // Delete subscriber
        await kv.delete(`subscriber:${email}`);

        // Remove from list
        const listKey = 'subscribers:list';
        const listData = await kv.get(listKey);
        const subscribers = listData ? JSON.parse(listData) : [];
        const filtered = subscribers.filter((e: string) => e !== email);
        await kv.put(listKey, JSON.stringify(filtered));

        console.log(`✅ Subscriber deleted from KV: ${email}`);
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: corsHeaders }
        );
      } catch (err: any) {
        console.error('❌ KV error:', err.message);
        return new Response(
          JSON.stringify({ error: 'Storage error', details: err.message }),
          { status: 500, headers: corsHeaders }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    );
  } catch (err: any) {
    console.error('❌ API error:', err.message);
    return new Response(
      JSON.stringify({ error: 'Server error', details: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
