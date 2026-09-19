import type { Article } from "@/lib/news/types";

const HOUR = 60 * 60 * 1000;

/** How much freshness (in hours) an image and a description are worth when ranking. */
const IMAGE_BONUS_HOURS = 24;
const DESCRIPTION_BONUS_HOURS = 4;
/** A provider's own #1 story gets this many hours of bonus, fading to zero further down. */
const POSITION_BONUS_HOURS = 12;
const POSITION_BONUS_DEPTH = 12;

/** Canonical form of a URL so the same story from two providers collapses into one. */
function urlKey(value: string): string {
  try {
    const url = new URL(value);
    const path = url.pathname.replace(/\/+$/, "").toLowerCase();
    return `${url.hostname.replace(/^www\./, "").toLowerCase()}${path}`;
  } catch {
    return value.toLowerCase();
  }
}

/** Loose title fingerprint: same headline syndicated under different URLs still deduplicates. */
function titleKey(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .slice(0, 80);
}

function richness(article: Article): number {
  return (article.imageUrl ? 2 : 0) + (article.description ? 1 : 0) + (article.author ? 0.5 : 0);
}

/** Prefer the copy with an image, then a description, then the more recent one. */
function pickBetter(a: Article, b: Article): Article {
  if (richness(a) !== richness(b)) return richness(a) > richness(b) ? a : b;
  return a.publishedAt >= b.publishedAt ? a : b;
}

/** Collapses duplicates across providers, keeping the richer copy in the original order. */
export function dedupeArticles(articles: Article[]): Article[] {
  const byKey = new Map<string, Article>();
  const keyOf = new Map<string, string>();

  for (const article of articles) {
    const keys = [`u:${urlKey(article.url)}`, `t:${titleKey(article.title)}`];
    const existingKey = keys.map((key) => keyOf.get(key)).find((key) => key !== undefined);

    if (existingKey === undefined) {
      byKey.set(keys[0] ?? article.url, article);
      for (const key of keys) keyOf.set(key, keys[0] ?? article.url);
      continue;
    }

    const existing = byKey.get(existingKey);
    if (existing) byKey.set(existingKey, pickBetter(existing, article));
    for (const key of keys) keyOf.set(key, existingKey);
  }

  return [...byKey.values()];
}

/** Drops stories older than `maxAgeMs` (bad feeds return years-old items) or from the future. */
export function filterByAge(articles: Article[], now: Date, maxAgeMs: number): Article[] {
  const oldest = now.getTime() - maxAgeMs;
  const latest = now.getTime() + HOUR;
  return articles.filter((article) => {
    const time = new Date(article.publishedAt).getTime();
    return time >= oldest && time <= latest;
  });
}

/** Bonus (in hours) for the position an article held in its provider's own ranking. */
function positionBonus(position: number | undefined): number {
  if (position === undefined || position >= POSITION_BONUS_DEPTH) return 0;
  return POSITION_BONUS_HOURS * (1 - position / POSITION_BONUS_DEPTH);
}

/** Each article's index within its provider's list, keyed by URL. */
export function positionsOf(lists: Article[][]): Map<string, number> {
  const positions = new Map<string, number>();
  for (const list of lists) {
    list.forEach((article, index) => {
      const current = positions.get(article.url);
      if (current === undefined || index < current) positions.set(article.url, index);
    });
  }
  return positions;
}

/**
 * Freshness first, with illustrated and described stories floated upwards: an image is worth
 * a day of recency, a description a few hours, and a provider's own top stories up to half a
 * day. Deterministic, so pagination is stable.
 */
export function rankByFreshness(
  articles: Article[],
  now: Date,
  positions?: Map<string, number>,
): Article[] {
  const score = (article: Article) => {
    const ageHours = (now.getTime() - new Date(article.publishedAt).getTime()) / HOUR;
    return (
      -ageHours +
      (article.imageUrl ? IMAGE_BONUS_HOURS : 0) +
      (article.description ? DESCRIPTION_BONUS_HOURS : 0) +
      positionBonus(positions?.get(article.url))
    );
  };
  return articles
    .map((article) => ({ article, score: score(article) }))
    .toSorted((a, b) => b.score - a.score || a.article.url.localeCompare(b.article.url))
    .map((entry) => entry.article);
}

/** Round-robin merge that preserves each provider's own relevance ordering. */
export function interleave(lists: Article[][]): Article[] {
  const merged: Article[] = [];
  const longest = Math.max(0, ...lists.map((list) => list.length));
  for (let index = 0; index < longest; index++) {
    for (const list of lists) {
      const article = list[index];
      if (article) merged.push(article);
    }
  }
  return merged;
}
