import { z } from "zod";

import { getServerEnv } from "@/lib/env";
import { DEFAULT_COUNTRY, MAX_QUERY_LENGTH } from "@/lib/news/constants";
import { normalizeArticle } from "@/lib/news/normalize";
import {
  fetchJson,
  providerError,
  type NewsProvider,
  type ProviderResult,
} from "@/lib/news/providers/types";
import type { NewsErrorCode } from "@/lib/news/types";

/** Overridable so the UI can be exercised against a local fixture server. */
const BASE_URL = process.env.NEWS_API_BASE_URL?.trim() || "https://newsapi.org/v2";
/** The developer plan never returns more than 100 results; 50 keeps responses small. */
const PAGE_SIZE = 50;

const articleSchema = z.object({
  source: z.object({
    id: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
  }),
  author: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  url: z.string(),
  urlToImage: z.string().nullable().optional(),
  publishedAt: z.string(),
});

const responseSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("ok"), totalResults: z.number(), articles: z.array(articleSchema) }),
  z.object({ status: z.literal("error"), code: z.string(), message: z.string() }),
]);

const ERROR_CODES: Record<string, NewsErrorCode> = {
  apiKeyMissing: "missing-key",
  apiKeyInvalid: "invalid-key",
  apiKeyDisabled: "invalid-key",
  apiKeyExhausted: "rate-limited",
  rateLimited: "rate-limited",
  parametersMissing: "bad-request",
  parameterInvalid: "bad-request",
  parametersIncompatible: "bad-request",
  upgradeRequired: "upgrade-required",
  corsNotAllowed: "upgrade-required",
};

async function request(
  endpoint: "top-headlines" | "everything",
  params: Record<string, string | undefined>,
): Promise<ProviderResult> {
  const apiKey = getServerEnv("NEWS_API_KEY");
  if (!apiKey) return providerError("newsapi", "missing-key");

  const url = new URL(`${BASE_URL}/${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }
  url.searchParams.set("pageSize", String(PAGE_SIZE));

  let body: unknown;
  try {
    ({ body } = await fetchJson(url, { headers: { "X-Api-Key": apiKey } }));
  } catch (error) {
    console.error("[newsapi] request failed", error);
    return providerError("newsapi", "unavailable");
  }

  const parsed = responseSchema.safeParse(body);
  if (!parsed.success) {
    console.error("[newsapi] unexpected response shape", parsed.error.issues);
    return providerError("newsapi", "unavailable");
  }
  if (parsed.data.status === "error") {
    return providerError("newsapi", ERROR_CODES[parsed.data.code] ?? "unavailable");
  }

  const articles = parsed.data.articles.flatMap((raw) => {
    const article = normalizeArticle(
      {
        title: raw.title,
        description: raw.description,
        url: raw.url,
        imageUrl: raw.urlToImage,
        publishedAt: raw.publishedAt,
        sourceName: raw.source.name,
        author: raw.author,
      },
      "newsapi",
    );
    return article ? [article] : [];
  });

  return { ok: true, articles };
}

/**
 * newsapi.org. Its `country` filter only returns results for the United States nowadays and its
 * per-country sources are stale, so it serves US headlines and full-text search only.
 */
export const newsApiProvider: NewsProvider = {
  id: "newsapi",
  name: "News API",
  isConfigured: () => getServerEnv("NEWS_API_KEY") !== null,
  supportsCountry: (country) => country === DEFAULT_COUNTRY,
  fetchHeadlines: ({ country, category, q }) =>
    request("top-headlines", { country, category, q: q.slice(0, MAX_QUERY_LENGTH) || undefined }),
  fetchSearch: ({ q, language, sortBy, from }) =>
    request("everything", { q: q.slice(0, MAX_QUERY_LENGTH), language, sortBy, from }),
};
