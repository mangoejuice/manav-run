import items from '../race_registry';

// The running heatmap starts on Jan 1 of the first race's year.
const firstRace = items.flatMap((year) => year.links).map((race) => race.date).sort()[0];
export const HEATMAP_START = `${firstRace.slice(0, 4)}-01-01`;
