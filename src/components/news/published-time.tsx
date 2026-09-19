import { formatDateTime, formatRelativeTime, parseDate } from "@/lib/utils/time";

type PublishedTimeProps = {
  publishedAt: string;
  now: Date;
  className?: string;
};

export function PublishedTime({ publishedAt, now, className }: PublishedTimeProps) {
  const date = parseDate(publishedAt);
  if (!date) return null;

  return (
    <time dateTime={date.toISOString()} title={formatDateTime(date)} className={className}>
      {formatRelativeTime(date, now)}
    </time>
  );
}
