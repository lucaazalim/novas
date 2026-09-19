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
import type { NewsErrorCode } from "@/lib/news/types";

const BASE_URL = "https://gnews.io/api/v4";
/** The free plan returns at most 10 articles per request; higher plans allow more. */
const MAX_ARTICLES = 10;
/** The free plan allows one request per second; bursts are rejected outright. */
const MIN_INTERVAL_MS = 1100;

let queue: Promise<unknown> = Promise.resolve();
let lastRequestAt = 0;

/** Serialises GNews calls within this process so concurrent renders do not trip the burst limit. */
function throttled<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const wait = MIN_INTERVAL_MS - (Date.now() - lastRequestAt);
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    lastRequestAt = Date.now();
    return task();
  });
  queue = run.catch(() => undefined);
  return run;
}

const SUPPORTED_COUNTRIES = new Set(
  "ar au at bd be bw br bg ca cl cn co cu cz eg ee et fi fr de gh gr hk hu in id ie il it jp ke lv lb lt my mx ma na nl nz ng no pk pe ph pl pt ro ru sa sn sg sk si za kr es se ch tw tz th tr ug ua ae gb us ve vn zw".split(
    " ",
  ),
);

const articleSchema = z.object({
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  url: z.string(),
  image: z.string().nullable().optional(),
  publishedAt: z.string(),
  source: z.object({ name: z.string().nullable().optional() }).optional(),
});

const responseSchema = z.union([
  z.object({ totalArticles: z.number().optional(), articles: z.array(articleSchema) }),
  z.object({ errors: z.union([z.array(z.string()), z.record(z.string(), z.unknown())]) }),
]);

/**
 * GNews has its own query grammar (quotes, AND/OR/NOT, parentheses) and rejects bare
 * punctuation such as the dot in "next.js". Queries that do not use the grammar are quoted.
 */
function toGnewsQuery(q: string): string {
  const trimmed = q.trim();
  const usesGrammar = /["()]|\b(AND|OR|NOT)\b/.test(trimmed);
  const hasPunctuation = /[^\p{L}\p{N}\s]/u.test(trimmed);
  return !usesGrammar && hasPunctuation ? `"${trimmed.replace(/"/g, "")}"` : trimmed;
}

const STATUS_CODES: Record<number, NewsErrorCode> = {
  400: "bad-request",
  401: "invalid-key",
  403: "upgrade-required",
  429: "rate-limited",
};

async function request(
  endpoint: "top-headlines" | "search",
  params: Record<string, string | undefined>,
): Promise<ProviderResult> {
  const apiKey = getServerEnv("GNEWS_API_KEY");
  if (!apiKey) return providerError("gnews", "missing-key");

  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("max", String(MAX_ARTICLES));
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  let status: number;
  let body: unknown;
  try {
    ({ status, body } = await throttled(() => fetchJson(url)));
  } catch (error) {
    console.error("[gnews] request failed", error);
    return providerError("gnews", "unavailable");
  }

  const parsed = responseSchema.safeParse(body);
  if (!parsed.success) {
    console.error("[gnews] unexpected response shape", parsed.error.issues);
    return providerError("gnews", STATUS_CODES[status] ?? "unavailable");
  }
  if ("errors" in parsed.data) {
    const errors = parsed.data.errors;
    const message = Array.isArray(errors) ? errors.join(" ") : JSON.stringify(errors);
    // The free plan allows one request per second and reports bursts as "too many requests".
    const code = /too many requests/i.test(message)
      ? "rate-limited"
      : (STATUS_CODES[status] ?? "unavailable");
    return providerError("gnews", code);
  }

  const articles = parsed.data.articles.flatMap((raw) => {
    const article = normalizeArticle(
      {
        title: raw.title,
        description: raw.description,
        url: raw.url,
        imageUrl: raw.image,
        publishedAt: raw.publishedAt,
        sourceName: raw.source?.name,
        author: null,
      },
      "gnews",
    );
    return article ? [article] : [];
  });

  return { ok: true, articles };
}

/** gnews.io: Google News rankings for 70 countries, delayed by 12 hours on the free plan. */
export const gnewsProvider: NewsProvider = {
  id: "gnews",
  name: "GNews",
  isConfigured: () => getServerEnv("GNEWS_API_KEY") !== null,
  supportsCountry: (country) => SUPPORTED_COUNTRIES.has(country),
  fetchHeadlines: ({ country, category, language, q }) =>
    request("top-headlines", {
      country,
      category,
      lang: language,
      q: q ? toGnewsQuery(q.slice(0, MAX_QUERY_LENGTH)) : undefined,
    }),
  fetchSearch: ({ q, language, sortBy, from }) =>
    request("search", {
      q: toGnewsQuery(q.slice(0, MAX_QUERY_LENGTH)),
      lang: language,
      sortby: sortBy === "publishedAt" ? "publishedAt" : "relevance",
      from,
    }),
};
