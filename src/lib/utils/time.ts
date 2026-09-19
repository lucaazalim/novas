const relativeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const dateTimeFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});
const weekdayFormatter = new Intl.DateTimeFormat("en", { weekday: "short", timeZone: "UTC" });

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 1000 * 60 * 60 * 24 * 365],
  ["month", 1000 * 60 * 60 * 24 * 30],
  ["week", 1000 * 60 * 60 * 24 * 7],
  ["day", 1000 * 60 * 60 * 24],
  ["hour", 1000 * 60 * 60],
  ["minute", 1000 * 60],
];

/** "3 hours ago", "yesterday", "just now". */
export function formatRelativeTime(date: Date, now: Date): string {
  const diff = date.getTime() - now.getTime();
  const abs = Math.abs(diff);

  if (abs < 60_000) return "just now";

  for (const [unit, ms] of UNITS) {
    if (abs >= ms) {
      return relativeFormatter.format(Math.round(diff / ms), unit);
    }
  }

  return relativeFormatter.format(Math.round(diff / 60_000), "minute");
}

/** Absolute, timezone-stable label used in `title` attributes and `<time>` fallbacks. */
export function formatDateTime(date: Date): string {
  return `${dateTimeFormatter.format(date)} UTC`;
}

/** "Mon", "Tue"... for a UTC-based day boundary. */
export function formatWeekday(date: Date): string {
  return weekdayFormatter.format(date);
}

export function parseDate(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
