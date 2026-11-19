// Newest first, grouped by the YYYY prefix of each entry's date.
export function groupByYear<T extends { date: string }>(entries: T[]): [string, T[]][] {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const years = new Map<string, T[]>();
  for (const entry of sorted) {
    const year = entry.date.slice(0, 4);
    if (!years.has(year)) years.set(year, []);
    years.get(year).push(entry);
  }
  return [...years];
}
