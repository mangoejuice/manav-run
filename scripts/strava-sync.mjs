// Pulls runs from Strava and writes run_miles.json: miles per local date
// (YYYY-MM-DD), from Jan 1 of the first race's year. Only dates and miles are
// saved. Run with `npm run strava-sync`, then commit run_miles.json.
//
// Needs STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET and STRAVA_REFRESH_TOKEN, from
// .env.local locally (see scripts/strava-auth.mjs) or environment variables in
// CI (.github/workflows/strava-sync.yml). If Strava rotates the refresh token,
// the new one is written back to .env.local; CI just warns.
import { readFileSync, writeFileSync } from 'node:fs';
import { ENV_FILE, readEnvFile, saveRefreshToken } from './env.mjs';

const OUT_FILE = 'run_miles.json';
const RUN_TYPES = new Set(['Run', 'TrailRun', 'VirtualRun']);
const METERS_PER_MILE = 1609.34;
const PAGE_SIZE = 200;

const fileEnv = readEnvFile();
const env = { ...process.env, ...fileEnv };
for (const key of ['STRAVA_CLIENT_ID', 'STRAVA_CLIENT_SECRET', 'STRAVA_REFRESH_TOKEN']) {
  if (!env[key]) {
    console.error(`Missing ${key} (set it in ${ENV_FILE} or the environment). See scripts/strava-auth.mjs.`);
    process.exit(1);
  }
}

// Same start as the heatmap (utils/heatmapStart.ts): Jan 1 of the first race's year.
const firstYear = [...readFileSync('race_registry.ts', 'utf8').matchAll(/date: '(\d{4})-/g)].map((m) => m[1]).sort()[0];
const since = `${firstYear}-01-01`;

const tokenRes = await fetch('https://www.strava.com/oauth/token', {
  method: 'POST',
  body: new URLSearchParams({
    client_id: env.STRAVA_CLIENT_ID,
    client_secret: env.STRAVA_CLIENT_SECRET,
    refresh_token: env.STRAVA_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  }),
});
const token = await tokenRes.json();
if (!tokenRes.ok) {
  console.error(`Strava token refresh failed (HTTP ${tokenRes.status}). Re-run scripts/strava-auth.mjs.`);
  process.exit(1);
}
if (token.refresh_token && token.refresh_token !== env.STRAVA_REFRESH_TOKEN) {
  if (fileEnv.STRAVA_REFRESH_TOKEN) {
    saveRefreshToken(token.refresh_token);
    console.log(`Strava rotated the refresh token; saved the new one to ${ENV_FILE}.`);
  } else {
    // GitHub Actions annotation; the old token may stop working, so refresh the secret.
    console.log('::warning::Strava rotated the refresh token. Run `npm run strava-auth` locally and update the STRAVA_REFRESH_TOKEN secret.');
  }
}

// `after` filters on UTC start time; back off a day so early-morning local runs aren't dropped.
const after = Date.parse(`${since}T00:00:00Z`) / 1000 - 86400;
const meters = {};
let runCount = 0;
for (let page = 1; ; page++) {
  const res = await fetch(`https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=${PAGE_SIZE}&page=${page}`, {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!res.ok) {
    // Strava's error body names the problem (e.g. a missing activity:read permission); no secrets in it.
    console.error(`Strava activities request failed (HTTP ${res.status}): ${await res.text()}`);
    if (res.status === 401) {
      console.error('The refresh token lacks activity access. Use the STRAVA_REFRESH_TOKEN from `npm run strava-auth`, not the token on Strava\'s API settings page.');
    }
    process.exit(1);
  }
  const activities = await res.json();
  for (const a of activities) {
    const date = a.start_date_local.slice(0, 10); // local wall-clock date
    if (RUN_TYPES.has(a.sport_type) && date >= since) {
      meters[date] = (meters[date] ?? 0) + a.distance;
      runCount++;
    }
  }
  if (activities.length < PAGE_SIZE) break;
}

const miles = Object.fromEntries(
  Object.keys(meters).sort().map((date) => [date, Math.round((meters[date] / METERS_PER_MILE) * 10) / 10])
);
writeFileSync(OUT_FILE, JSON.stringify(miles, null, 2) + '\n');
const total = Math.round(Object.values(miles).reduce((a, b) => a + b, 0));
console.log(`Wrote ${OUT_FILE}: ${runCount} runs on ${Object.keys(miles).length} days since ${since}, ${total} miles.`);
