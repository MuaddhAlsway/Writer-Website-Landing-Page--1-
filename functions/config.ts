// Production Configuration - Fail Fast Pattern
export interface Config {
  turso: {
    connectionUrl: string;
    authToken: string;
  };
  gmail: {
    user: string;
    appPassword: string;
  };
}

export function validateConfig(env: any): Config {
  const errors: string[] = [];

  // Validate Turso
  if (!env.TURSO_CONNECTION_URL) {
    errors.push('TURSO_CONNECTION_URL is missing');
  }
  if (!env.TURSO_AUTH_TOKEN) {
    errors.push('TURSO_AUTH_TOKEN is missing');
  }

  // Validate Gmail
  if (!env.GMAIL_USER) {
    errors.push('GMAIL_USER is missing');
  }
  if (!env.GMAIL_APP_PASSWORD) {
    errors.push('GMAIL_APP_PASSWORD is missing');
  }

  if (errors.length > 0) {
    console.error('❌ CONFIGURATION ERRORS:');
    errors.forEach(err => console.error(`   - ${err}`));
    throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
  }

  return {
    turso: {
      connectionUrl: env.TURSO_CONNECTION_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    },
    gmail: {
      user: env.GMAIL_USER,
      appPassword: env.GMAIL_APP_PASSWORD,
    },
  };
}

export function logConfig(config: Config): void {
  console.log('✅ CONFIGURATION LOADED:');
  console.log(`   - Turso: ${config.turso.connectionUrl.substring(0, 30)}...`);
  console.log(`   - Gmail: ${config.gmail.user}`);
}
