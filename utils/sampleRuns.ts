// Placeholder run data until Strava is wired up: miles per day (YYYY-MM-DD),
// seeded so the server and client render the same grid.
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function sampleRuns(start: string, today: string): Record<string, number> {
  const random = seeded(Number(start.replace(/-/g, '')));
  const runs: Record<string, number> = {};
  for (let d = new Date(`${start}T00:00:00Z`); ; d.setUTCDate(d.getUTCDate() + 1)) {
    const date = d.toISOString().slice(0, 10);
    if (date > today) break;
    const isLongRunDay = d.getUTCDay() === 0;
    if (random() < (isLongRunDay ? 0.85 : 0.55)) {
      runs[date] = +(isLongRunDay ? 7 + random() * 9 : 2 + random() * 6).toFixed(1);
    }
  }
  return runs;
}
