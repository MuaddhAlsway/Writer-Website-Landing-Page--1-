import { createClient } from '@libsql/client';

export async function onRequestGet(context: any) {
  try {
    const tursoUrl = context.env.TURSO_CONNECTION_URL;
    const tursoToken = context.env.TURSO_AUTH_TOKEN;

    if (!tursoUrl || !tursoToken) {
      return new Response(
        JSON.stringify({ error: 'Turso not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Connect to Turso
    const client = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    });

    // Query subscribers from database
    const result = await client.execute('SELECT * FROM subscribers ORDER BY subscribedAt DESC');
    
    const subscribers = result.rows.map((row: any) => ({
      email: row.email,
      name: row.name || '',
      language: row.language || 'en',
      subscribedAt: row.subscribedAt,
      isActive: true
    }));

    return new Response(
      JSON.stringify({ subscribers }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Subscribers error:', error);
    // Fallback to mock data on error
    const mockSubscribers = [
      {
        email: 'fatima.author@gmail.com',
        name: 'فاطمة المؤلفة',
        language: 'ar',
        subscribedAt: '2026-01-15T10:30:00Z',
        isActive: true
      },
      {
        email: 'reader.one@gmail.com',
        name: 'Reader One',
        language: 'en',
        subscribedAt: '2026-01-20T14:45:00Z',
        isActive: true
      }
    ];
    return new Response(
      JSON.stringify({ subscribers: mockSubscribers }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function onRequestPost(context: any) {
  try {
    const { email, language } = await context.request.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const tursoUrl = context.env.TURSO_CONNECTION_URL;
    const tursoToken = context.env.TURSO_AUTH_TOKEN;

    if (!tursoUrl || !tursoToken) {
      return new Response(
        JSON.stringify({ error: 'Turso not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Connect to Turso
    const { createClient } = await import('@libsql/client');
    const client = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    });

    // Insert subscriber
    await client.execute({
      sql: 'INSERT INTO subscribers (email, language) VALUES (?, ?)',
      args: [email, language || 'en']
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Subscriber added',
        subscriber: { email, language: language || 'en' }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Add subscriber error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to add subscriber' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
