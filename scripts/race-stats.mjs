// Computes distance, moving time and pace (per mile) for every GPX file in public/gpx-files and
// writes race_stats.json. Mirrors leaflet-gpx (which the race pages use), so the
// numbers match: 3D haversine distance, and gaps of 15s or more don't count as
// moving time. Run with `npm run race-stats` after adding a GPX file.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const GPX_DIR = 'public/gpx-files';
const MAX_POINT_INTERVAL_MS = 15000;
const R = 6371000;

const rad = (deg) => (deg * Math.PI) / 180;

function dist3d(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  const planar = R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return Math.hypot(planar, Math.abs(b.ele - a.ele));
}

function parsePoints(segment) {
  const points = [];
  let ele = null;
  for (const [, attrs, body] of segment.matchAll(/<trkpt\b([^>]*)>([\s\S]*?)<\/trkpt>/g)) {
    const lat = parseFloat(/lat="([^"]+)"/.exec(attrs)[1]);
    const lon = parseFloat(/lon="([^"]+)"/.exec(attrs)[1]);
    const eleMatch = /<ele>([^<]+)<\/ele>/.exec(body);
    if (eleMatch) ele = parseFloat(eleMatch[1]); // missing <ele> keeps the previous one
    const timeMatch = /<time>([^<]+)<\/time>/.exec(body);
    const time = timeMatch ? Date.parse(timeMatch[1]) : 0;
    points.push({ lat, lon, ele, time });
  }
  return points;
}

function stats(gpx) {
  let meters = 0;
  let movingMs = 0;
  for (const [segment] of gpx.matchAll(/<trkseg>[\s\S]*?<\/trkseg>/g)) {
    const points = parsePoints(segment);
    for (let i = 1; i < points.length; i++) {
      const timeDiff = Math.abs(points[i].time - points[i - 1].time);
      meters += dist3d(points[i - 1], points[i]);
      if (timeDiff < MAX_POINT_INTERVAL_MS) movingMs += timeDiff;
    }
  }
  const miles = meters / 1609.34;
  return { distanceMi: +miles.toFixed(2), movingMs, paceMs: Math.round(movingMs / miles) };
}

const out = {};
for (const file of readdirSync(GPX_DIR).filter((f) => f.endsWith('.gpx')).sort()) {
  out[file] = stats(readFileSync(join(GPX_DIR, file), 'utf8'));
}
writeFileSync('race_stats.json', JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote stats for ${Object.keys(out).length} GPX files to race_stats.json`);
