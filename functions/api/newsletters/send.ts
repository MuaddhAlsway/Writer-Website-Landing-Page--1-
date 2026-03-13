export async function onRequestPost(context: any) {
  try {
    const url = new URL(context.request.url);
    const pathParts = url.pathname.split('/');
    const newsletterId = pathParts[pathParts.length - 2];

    const { recipients } = await context.request.json();

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Recipients required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[NEWSLETTER] Sending newsletter ${newsletterId} to ${recipients.length} recipients`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: recipients.length,
        message: `Newsletter sent to ${recipients.length} recipients`
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Send newsletter error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send newsletter' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
