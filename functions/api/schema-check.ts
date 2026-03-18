import { createClient } from "@libsql/client";

export async function onRequest(context: any) {
  const env = context.env;
  const url = env.TURSO_CONNECTION_URL?.split("?")[0];
  const authToken = env.TURSO_AUTH_TOKEN;
  const db = createClient({ url, authToken });
  
  try {
    const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table'");
    const results: any = { tables: tables.rows.map((r: any) => r.name) };
    
    for (const row of tables.rows) {
      const schema = await db.execute(`PRAGMA table_info(${row.name})`);
      results[String(row.name)] = schema.rows.map((r: any) => ({ name: r.name, type: r.type }));
    }
    
    return new Response(JSON.stringify(results, null, 2), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
