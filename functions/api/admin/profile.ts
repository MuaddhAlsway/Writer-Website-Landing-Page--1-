export const onRequest: PagesFunction = async (context) => {
  if (context.request.method === 'GET') {
    try {
      const authHeader = context.request.headers.get('Authorization');
      if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Use real admin credentials from environment
      const adminEmail = context.env.ADMIN_EMAIL || 'admin@authorfatima.com';
      const adminName = context.env.ADMIN_NAME || 'Admin';

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
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'Failed to fetch profile' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else if (context.request.method === 'PUT') {
    try {
      const { email, username, name } = await context.request.json();
      
      // In production, this would update the database
      console.log('Update profile:', { email, username, name });

      return new Response(JSON.stringify({
        success: true,
        message: 'Profile updated successfully',
        admin: {
          id: '1',
          email: email || context.env.ADMIN_EMAIL || 'admin@authorfatima.com',
          name: name || context.env.ADMIN_NAME || 'Admin',
          username: username || (email || context.env.ADMIN_EMAIL || 'admin@authorfatima.com').split('@')[0],
        },
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'Update failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
};
