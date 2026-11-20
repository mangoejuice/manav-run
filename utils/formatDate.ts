export const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2025-11-02" -> "Nov 2"
export function formatDate(dateString: string): string {
  const [, month, day] = dateString.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]} ${day}`;
}

// "2025-11-02" -> "Nov 2, 2025"
export function formatLongDate(dateString: string): string {
  return `${formatDate(dateString)}, ${dateString.slice(0, 4)}`;
}
