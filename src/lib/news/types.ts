export type ProviderId = "newsapi" | "newsdata" | "gnews";

export type Article = {
  /** Canonical article URL; also used as the React key. */
  url: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  /** ISO 8601 timestamp. */
  publishedAt: string;
  sourceName: string;
  author: string | null;
  /** Which upstream API supplied the article. Never shown to visitors. */
  provider: ProviderId;
};

export type NewsErrorCode =
  | "missing-key"
  | "invalid-key"
  | "rate-limited"
  | "upgrade-required"
  | "bad-request"
  | "unavailable";

export type NewsError = {
  provider: ProviderId;
  code: NewsErrorCode;
  message: string;
};

export type NewsPage = {
  articles: Article[];
  totalResults: number;
  page: number;
  pageSize: number;
  totalPages: number;
  /** True when at least one provider failed but others still delivered. */
  partial: boolean;
};

export type NewsResult = ({ ok: true } & NewsPage) | { ok: false; error: NewsError };
