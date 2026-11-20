// .env.local helpers shared by the Strava scripts.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

export const ENV_FILE = '.env.local';

// Values from .env.local, or {} when it doesn't exist (e.g. in CI).
export function readEnvFile() {
  return existsSync(ENV_FILE) ? parseEnv(readFileSync(ENV_FILE, 'utf8')) : {};
}

// Sets STRAVA_REFRESH_TOKEN in .env.local, replacing any existing line.
export function saveRefreshToken(token) {
  const text = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, 'utf8') : '';
  const line = `STRAVA_REFRESH_TOKEN=${token}`;
  const pattern = /^STRAVA_REFRESH_TOKEN=.*$/m;
  writeFileSync(ENV_FILE, pattern.test(text) ? text.replace(pattern, line) : `${text.replace(/\n?$/, '\n')}${line}\n`);
}
