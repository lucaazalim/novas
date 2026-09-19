import { cacheLife } from "next/cache";

import {
  dedupeArticles,
  filterByAge,
  interleave,
  positionsOf,
  rankByFreshness,
} from "@/lib/news/aggregate";
import {
  DATE_RANGES,
  PAGE_SIZE,
  findCountry,
  type DateRange,
  type SortBy,
} from "@/lib/news/constants";
import { NEWS_PROVIDERS } from "@/lib/news/providers";
import { ERROR_MESSAGES, type NewsProvider, type ProviderResult } from "@/lib/news/providers/types";
import type { Article, NewsError, NewsResult } from "@/lib/news/types";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
/** Headlines older than this are not "top headlines" anymore, whatever the provider says. */
const MAX_HEADLINE_AGE = 3 * DAY;
/** Search results without an explicit range are limited to the past month. */
const MAX_SEARCH_AGE = 30 * DAY;

export type HeadlinesQuery = { country: string; category: string; q?: string; page: number };
export type SearchQuery = {
  q: string;
  language?: string;
  sortBy: SortBy;
  range: DateRange;
  page: number;
};

type Pool = {
  articles: Article[];
  errors: NewsError[];
  /** Number of providers that were asked. */
  attempted: number;
};

function rangeToMs(range: DateRange): number {
  const days = DATE_RANGES.find((item) => item.value === range)?.days;
  return days ? days * DAY : MAX_SEARCH_AGE;
}

/** Bucketed to the hour so cache keys stay stable between requests. */
function currentHour(): Date {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  return now;
}

async function collect(
  providers: NewsProvider[],
  run: (provider: NewsProvider) => Promise<ProviderResult>,
): Promise<{ lists: Article[][]; errors: NewsError[] }> {
  const settled = await Promise.allSettled(providers.map((provider) => run(provider)));
  const lists: Article[][] = [];
  const errors: NewsError[] = [];

  settled.forEach((outcome, index) => {
    const provider = providers[index];
    if (!provider) return;
    if (outcome.status === "rejected") {
      console.error(`[news] ${provider.id} threw`, outcome.reason);
      errors.push({
        provider: provider.id,
        code: "unavailable",
        message: ERROR_MESSAGES.unavailable,
      });
    } else if (outcome.value.ok) {
      lists.push(outcome.value.articles);
    } else {
      console.warn(`[news] ${provider.id} failed: ${outcome.value.error.code}`);
      errors.push(outcome.value.error);
    }
  });

  return { lists, errors };
}

/** Failures get a short lifetime so an outage or rate limit is retried soon. */
function applyCacheLife(pool: Pool): void {
  if (pool.errors.length === 0) {
    cacheLife("news");
  } else if (pool.articles.length > 0) {
    cacheLife({ stale: 60, revalidate: 120, expire: 300 });
  } else {
    cacheLife({ stale: 30, revalidate: 30, expire: 60 });
  }
}

async function getHeadlinesPool(country: string, category: string, q: string): Promise<Pool> {
  "use cache";
  const providers = NEWS_PROVIDERS.filter(
    (provider) => provider.isConfigured() && provider.supportsCountry(country),
  );
  const language = findCountry(country)?.language ?? "en";
  const { lists, errors } = await collect(providers, (provider) =>
    provider.fetchHeadlines({ country, category, language, q }),
  );
  const now = currentHour();
  const articles = rankByFreshness(
    dedupeArticles(filterByAge(lists.flat(), now, MAX_HEADLINE_AGE)),
    now,
    positionsOf(lists),
  );
  const pool = { articles, errors, attempted: providers.length };
  applyCacheLife(pool);
  return pool;
}

async function getSearchPool(
  q: string,
  language: string | undefined,
  sortBy: SortBy,
  range: DateRange,
): Promise<Pool> {
  "use cache";
  const now = currentHour();
  const maxAge = rangeToMs(range);
  const from = new Date(now.getTime() - maxAge).toISOString().slice(0, 19) + "Z";
  const providers = NEWS_PROVIDERS.filter((provider) => provider.isConfigured());
  const { lists, errors } = await collect(providers, (provider) =>
    provider.fetchSearch({ q, language, sortBy, range, from }),
  );

  const fresh = lists.map((list) => filterByAge(list, now, maxAge));
  const articles =
    sortBy === "publishedAt"
      ? rankByFreshness(dedupeArticles(fresh.flat()), now, positionsOf(fresh))
      : dedupeArticles(interleave(fresh));
  const pool = { articles, errors, attempted: providers.length };
  applyCacheLife(pool);
  return pool;
}

/** Turns a merged pool into one page, or into the most useful error when nothing came back. */
function paginate(pool: Pool, page: number): NewsResult {
  if (pool.articles.length === 0 && pool.errors.length > 0) {
    const missingEverywhere = pool.errors.every((error) => error.code === "missing-key");
    const error = pool.errors.find((item) => item.code !== "missing-key") ?? pool.errors[0] ?? null;
    if (!error) return paginateArticles([], page, false);
    return {
      ok: false,
      error: missingEverywhere ? { ...error, message: ERROR_MESSAGES["missing-key"] } : error,
    };
  }
  if (pool.attempted === 0) {
    return {
      ok: false,
      error: { provider: "newsapi", code: "missing-key", message: ERROR_MESSAGES["missing-key"] },
    };
  }
  return paginateArticles(pool.articles, page, pool.errors.length > 0);
}

function paginateArticles(articles: Article[], page: number, partial: boolean): NewsResult {
  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  return {
    ok: true,
    articles: articles.slice(start, start + PAGE_SIZE),
    totalResults: articles.length,
    page: current,
    pageSize: PAGE_SIZE,
    totalPages,
    partial,
  };
}

export async function getTopHeadlines(query: HeadlinesQuery): Promise<NewsResult> {
  const pool = await getHeadlinesPool(query.country, query.category, query.q ?? "");
  return paginate(pool, query.page);
}

export async function searchEverything(query: SearchQuery): Promise<NewsResult> {
  const pool = await getSearchPool(query.q, query.language, query.sortBy, query.range);
  return paginate(pool, query.page);
}
