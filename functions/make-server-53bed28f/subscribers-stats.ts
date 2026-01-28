export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const method = request.method;

  if (method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Return mock stats for now
    return new Response(
      JSON.stringify({
        totalSubscribers: 0,
        activeSubscribers: 0,
        monthlyStats: [],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

