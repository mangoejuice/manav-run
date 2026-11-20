// One-time Strava sign-in for scripts/strava-sync.mjs. Reads STRAVA_CLIENT_ID and
// STRAVA_CLIENT_SECRET from .env.local, and writes STRAVA_REFRESH_TOKEN back into
// it. Never prints secrets.
//
//   npm run strava-auth            prints the sign-in URL
//   npm run strava-auth -- <code>  exchanges the code from the redirect URL
import { ENV_FILE, readEnvFile, saveRefreshToken } from './env.mjs';

const SCOPE = 'activity:read_all';

const env = readEnvFile();
const { STRAVA_CLIENT_ID: clientId, STRAVA_CLIENT_SECRET: clientSecret } = env;
if (!clientId || !clientSecret) {
  console.error(`Add STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET to ${ENV_FILE} first.`);
  process.exit(1);
}

const code = process.argv[2];
if (!code) {
  const url = new URL('https://www.strava.com/oauth/authorize');
  url.search = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: 'http://localhost',
    approval_prompt: 'force',
    scope: SCOPE,
  });
  console.log(`Open this URL, approve, then copy the "code" from the localhost URL you land on:\n\n${url}\n`);
  console.log('Then run: npm run strava-auth -- <code>');
  process.exit(0);
}

const res = await fetch('https://www.strava.com/oauth/token', {
  method: 'POST',
  body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, code, grant_type: 'authorization_code' }),
});
const data = await res.json();
if (!res.ok || !data.refresh_token) {
  console.error(`Strava rejected the code (HTTP ${res.status}): ${data.message ?? 'unknown error'}. Codes are single-use; get a fresh one.`);
  process.exit(1);
}

saveRefreshToken(data.refresh_token);

console.log(`Saved STRAVA_REFRESH_TOKEN to ${ENV_FILE}. Next: npm run strava-sync`);

// Confirm the token can actually read activities (fails if the activity box was unchecked).
const check = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=1', {
  headers: { Authorization: `Bearer ${data.access_token}` },
});
console.log(check.ok ? 'Verified: can read activities.' : `Warning: reading activities failed (HTTP ${check.status}). Re-run and keep the activity permission checked.`);
