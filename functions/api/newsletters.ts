export async function onRequestGet(context: any) {
  try {
    const newsletters = [
      {
        id: 'nl-1',
        subject: 'Welcome Newsletter',
        content: '<p>Welcome to our newsletter!</p>',
        language: 'en',
        createdAt: new Date().toISOString(),
        sentAt: null,
        recipientCount: 0
      }
    ];

    return new Response(
      JSON.stringify({ newsletters }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Newsletters error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to load newsletters' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function onRequestPost(context: any) {
  try {
    const { subject, content, language } = await context.request.json();

    if (!subject || !content) {
      return new Response(
        JSON.stringify({ error: 'Subject and content required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newsletter = {
      id: 'nl-' + Date.now(),
      subject,
      content,
      language: language || 'en',
      createdAt: new Date().toISOString(),
      sentAt: null,
      recipientCount: 0
    };

    return new Response(
      JSON.stringify({ success: true, newsletter }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Create newsletter error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create newsletter' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
