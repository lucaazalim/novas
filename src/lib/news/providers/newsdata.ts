import { z } from "zod";

import { getServerEnv } from "@/lib/env";
import { MAX_QUERY_LENGTH } from "@/lib/news/constants";
import { normalizeArticle } from "@/lib/news/normalize";
import {
  fetchJson,
  providerError,
  type NewsProvider,
  type ProviderResult,
} from "@/lib/news/providers/types";
import type { Article, NewsErrorCode } from "@/lib/news/types";

const BASE_URL = "https://newsdata.io/api/1";
/** The free plan returns at most 10 articles per credit. */
const PAGE_SIZE = 10;
/** Pages (credits) spent per query. Two gives a decent pool while staying well inside 200/day. */
const PAGES_PER_QUERY = 2;
/** The free plan caps queries at 100 characters. */
const MAX_QUERY = 100;

const CATEGORY_MAP: Record<string, string> = { general: "top" };

const articleSchema = z.object({
  title: z.string().nullable().optional(),
  link: z.string(),
  description: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  pubDate: z.string(),
  pubDateTZ: z.string().nullable().optional(),
  source_name: z.string().nullable().optional(),
  creator: z.array(z.string()).nullable().optional(),
});

const responseSchema = z.union([
  z.object({
    status: z.literal("success"),
    totalResults: z.number().optional(),
    results: z.array(articleSchema),
    nextPage: z.string().nullable().optional(),
  }),
  z.object({
    status: z.literal("error"),
    results: z.object({ code: z.string().optional(), message: z.string().optional() }),
  }),
]);

const ERROR_CODES: Record<string, NewsErrorCode> = {
  Unauthorized: "invalid-key",
  ApiKeyMissing: "missing-key",
  RateLimitExceeded: "rate-limited",
  TooManyRequests: "rate-limited",
  UnsupportedFilter: "bad-request",
  FilterLimitExceed: "bad-request",
  ParameterInvalid: "bad-request",
  RequestNotAuthorised: "upgrade-required",
};

/** "2026-09-18 16:00:00" with pubDateTZ "UTC" becomes an ISO timestamp. */
function toIso(pubDate: string, timezone: string | null | undefined): string {
  const normalized = pubDate.trim().replace(" ", "T");
  if (!timezone || timezone.toUpperCase() === "UTC") return `${normalized}Z`;
  return normalized;
}

async function request(params: Record<string, string | undefined>): Promise<ProviderResult> {
  const apiKey = getServerEnv("NEWSDATA_API_KEY");
  if (!apiKey) return providerError("newsdata", "missing-key");

  const articles: Article[] = [];
  let page: string | undefined;

  // Pages are fetched sequentially on purpose: each request needs the previous cursor.
  for (let index = 0; index < PAGES_PER_QUERY; index++) {
    const url = new URL(`${BASE_URL}/latest`);
    url.searchParams.set("apikey", apiKey);
    url.searchParams.set("size", String(PAGE_SIZE));
    url.searchParams.set("removeduplicate", "1");
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value);
    }
    if (page) url.searchParams.set("page", page);

    let body: unknown;
    try {
      // oxlint-disable-next-line no-await-in-loop
      ({ body } = await fetchJson(url));
    } catch (error) {
      console.error("[newsdata] request failed", error);
      if (articles.length > 0) break;
      return providerError("newsdata", "unavailable");
    }

    const parsed = responseSchema.safeParse(body);
    if (!parsed.success) {
      console.error("[newsdata] unexpected response shape", parsed.error.issues);
      if (articles.length > 0) break;
      return providerError("newsdata", "unavailable");
    }
    if (parsed.data.status === "error") {
      const code = ERROR_CODES[parsed.data.results.code ?? ""] ?? "unavailable";
      if (articles.length > 0) break;
      return providerError("newsdata", code, parsed.data.results.message);
    }

    for (const raw of parsed.data.results) {
      const article = normalizeArticle(
        {
          title: raw.title,
          description: raw.description,
          url: raw.link,
          imageUrl: raw.image_url,
          publishedAt: toIso(raw.pubDate, raw.pubDateTZ),
          sourceName: raw.source_name,
          author: raw.creator?.[0],
        },
        "newsdata",
      );
      if (article) articles.push(article);
    }

    page = parsed.data.nextPage ?? undefined;
    if (!page) break;
  }

  return { ok: true, articles };
}

/** newsdata.io: broadest country coverage, articles delayed by 12 hours on the free plan. */
export const newsDataProvider: NewsProvider = {
  id: "newsdata",
  name: "NewsData.io",
  isConfigured: () => getServerEnv("NEWSDATA_API_KEY") !== null,
  supportsCountry: () => true,
  fetchHeadlines: ({ country, category, language, q }) =>
    request({
      country,
      category: CATEGORY_MAP[category] ?? category,
      language,
      q: q.slice(0, MAX_QUERY) || undefined,
    }),
  fetchSearch: ({ q, language }) =>
    request({ q: q.slice(0, Math.min(MAX_QUERY, MAX_QUERY_LENGTH)), language }),
};
