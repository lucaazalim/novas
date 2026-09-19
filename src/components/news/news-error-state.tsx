import { AlertTriangleIcon, KeyRoundIcon, TimerIcon } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import type { NewsError } from "@/lib/news/types";

const TITLES: Record<NewsError["code"], string> = {
  "missing-key": "No news API key configured",
  "invalid-key": "News API key rejected",
  "rate-limited": "Too many requests",
  "upgrade-required": "Not available on this plan",
  "bad-request": "Invalid query",
  unavailable: "News are temporarily unavailable",
};

export function NewsErrorState({ error }: { error: NewsError }) {
  const icon =
    error.code === "missing-key" || error.code === "invalid-key" ? (
      <KeyRoundIcon className="size-10" aria-hidden="true" />
    ) : error.code === "rate-limited" ? (
      <TimerIcon className="size-10" aria-hidden="true" />
    ) : (
      <AlertTriangleIcon className="size-10" aria-hidden="true" />
    );

  return (
    <EmptyState
      tone="error"
      icon={icon}
      title={TITLES[error.code]}
      description={
        <>
          {error.message}{" "}
          <a
            href="https://newsapi.org/docs"
            className="text-brand underline"
            rel="noopener noreferrer"
          >
            News API documentation
          </a>
          .
        </>
      }
    />
  );
}
