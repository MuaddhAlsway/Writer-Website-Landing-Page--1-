export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Handle stats endpoint
  if (path.includes('/subscribers/stats') && context.request.method === 'GET') {
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

  // Handle GET subscribers
  if (context.request.method === 'GET') {
    try {
      const subscribers = [
        {
          email: 'subscriber@example.com',
          name: 'Example Subscriber',
          language: 'en',
        },
      ];

      return new Response(JSON.stringify({
        success: true,
        subscribers,
      }), {
        status: 200,
        headers: corsHeaders,
      });
    } catch (err: any) {
      console.error('Get subscribers error:', err);
      return new Response(JSON.stringify({ error: 'Failed to fetch subscribers' }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  }

  // Handle POST (add subscriber)
  if (context.request.method === 'POST') {
    try {
      const { email, language } = await context.request.json();
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Subscriber added',
      }), {
        status: 200,
        headers: corsHeaders,
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'Failed to add subscriber' }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  }

  // Handle DELETE
  if (context.request.method === 'DELETE') {
    try {
      return new Response(JSON.stringify({
        success: true,
        message: 'Subscriber deleted',
      }), {
        status: 200,
        headers: corsHeaders,
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'Failed to delete subscriber' }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: corsHeaders,
  });
};
