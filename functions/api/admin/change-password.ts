export async function onRequestPost(context: any) {
  try {
    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify token exists (simple check for demo tokens)
    const token = authHeader.replace('Bearer ', '');
    if (!token || !token.startsWith('demo-token-')) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { currentPassword, newPassword } = await context.request.json();

    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (newPassword.length < 6) {
      return new Response(JSON.stringify({ error: 'Password must be at least 6 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get admin credentials from environment
    const adminPassword = context.env.ADMIN_PASSWORD || 'admin123';

    // Verify current password matches
    if (currentPassword !== adminPassword) {
      return new Response(JSON.stringify({ error: 'Current password is incorrect' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // In production, you would update the password in the database
    console.log('Password change requested');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Password changed successfully',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Change password error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to change password' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
