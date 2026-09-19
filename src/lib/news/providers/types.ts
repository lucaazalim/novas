import type { DateRange, SortBy } from "@/lib/news/constants";
import type { Article, NewsError, ProviderId } from "@/lib/news/types";

export type HeadlinesRequest = {
  country: string;
  category: string;
  /** Main language of the country; keeps foreign-language items out of the mix. */
  language: string;
  q: string;
};

export type SearchRequest = {
  q: string;
  language: string | undefined;
  sortBy: SortBy;
  range: DateRange;
  /** ISO timestamp lower bound derived from `range`, if any. */
  from: string | undefined;
};

export type ProviderResult = { ok: true; articles: Article[] } | { ok: false; error: NewsError };

/**
 * One upstream news API. Each provider returns as many relevant articles as its plan allows in
 * one go; the aggregator merges, deduplicates, ranks and paginates the union.
 */
export type NewsProvider = {
  id: ProviderId;
  name: string;
  /** Whether the provider has an API key configured. */
  isConfigured: () => boolean;
  /** Whether this provider can serve headlines for the given country. */
  supportsCountry: (country: string) => boolean;
  fetchHeadlines: (request: HeadlinesRequest) => Promise<ProviderResult>;
  fetchSearch: (request: SearchRequest) => Promise<ProviderResult>;
};

export const ERROR_MESSAGES: Record<NewsError["code"], string> = {
  "missing-key":
    "No news API key is configured. Add at least one of NEWS_API_KEY, NEWSDATA_API_KEY or GNEWS_API_KEY.",
  "invalid-key": "A news provider rejected its API key. Check the configured keys.",
  "rate-limited":
    "The news providers' rate limits were reached. Please try again in a few minutes.",
  "upgrade-required": "This request is not available on the current plan of the news provider.",
  "bad-request": "The news providers rejected this query. Try different filters.",
  unavailable: "The news providers are unavailable right now. Please try again shortly.",
};

export function providerError(
  provider: ProviderId,
  code: NewsError["code"],
  message: string = ERROR_MESSAGES[code],
): ProviderResult {
  return { ok: false, error: { provider, code, message } };
}

/** Shared fetch helper: JSON with a timeout, throwing on network failure only. */
export async function fetchJson(
  url: URL,
  init: RequestInit = {},
): Promise<{ status: number; body: unknown }> {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(10_000) });
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  return { status: response.status, body };
}
