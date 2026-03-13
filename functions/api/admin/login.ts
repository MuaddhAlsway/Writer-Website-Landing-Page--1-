import { createClient } from '@libsql/client';

export async function onRequestPost(context: any) {
  try {
    const { email, password } = await context.request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // For now, accept any login (demo mode)
    // In production, verify against database
    if (email && password) {
      const accessToken = 'demo-token-' + Date.now();
      const refreshToken = 'refresh-token-' + Date.now();

      return new Response(
        JSON.stringify({
          success: true,
          accessToken,
          refreshToken,
          user: { email, name: 'Admin' }
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid credentials' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Login failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
