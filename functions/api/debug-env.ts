export async function onRequest(context: any) {
  const env = context.env || {};
  return new Response(JSON.stringify({
    envKeys: Object.keys(env),
    hasTursoUrl: !!env.TURSO_CONNECTION_URL,
    hasTursoToken: !!env.TURSO_AUTH_TOKEN,
    hasGmailUser: !!env.GMAIL_USER,
    hasGmailPass: !!env.GMAIL_APP_PASSWORD,
    branch: env.CF_PAGES_BRANCH,
    commitSha: env.CF_PAGES_COMMIT_SHA,
    pagesUrl: env.CF_PAGES_URL,
    backendUrl: env.BACKEND_URL,
    environment: env.ENVIRONMENT,
  }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
