import type { Article, ProviderId } from "@/lib/news/types";

/** Provider-agnostic shape every client maps its raw payload into before normalisation. */
export type RawArticleInput = {
  title: string | null | undefined;
  description: string | null | undefined;
  url: string;
  imageUrl: string | null | undefined;
  publishedAt: string;
  sourceName: string | null | undefined;
  author: string | null | undefined;
};

const REMOVED_TITLE = "[Removed]";
const TITLE_SEPARATOR = /\s+[-|–—]\s+(?=[^-|–—]*$)/;
/** Placeholder titles some feeds emit instead of a headline. */
const PLACEHOLDER_TITLES = new Set(["google news", "news", "home", "untitled"]);
/** Category and tag listing pages masquerading as articles. */
const LISTING_PATH = /\/(tag|tags|topic|topics|category|categories|search)\//i;

/**
 * Google-style titles end with " - Publisher" (sometimes twice, e.g. "… - Site news - Site").
 * Strip trailing segments that repeat the source; a short unknown tail is stripped once.
 */
function cleanTitle(title: string, sourceName: string): string {
  const source = sourceName.toLowerCase();
  const sourceStem = source.split(".")[0] ?? source;
  let current = title.trim();

  for (let pass = 0; pass < 3; pass++) {
    const match = TITLE_SEPARATOR.exec(current);
    if (!match) break;

    const head = current.slice(0, match.index).trim();
    const tail = current
      .slice(match.index + match[0].length)
      .trim()
      .toLowerCase();
    const repeatsSource =
      tail === source ||
      source.includes(tail) ||
      (sourceStem.length > 2 && tail.includes(sourceStem));

    if (head.length === 0 || !(repeatsSource || (pass === 0 && tail.length <= 40))) break;
    current = head;
  }

  return current;
}

/** Only absolute HTTPS images are rendered; HTTP is upgraded since nearly every CDN supports it. */
export function normalizeImageUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol === "http:") url.protocol = "https:";
    if (url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Drops entries that are not real stories: removed, placeholder, listing pages, unparseable. */
function isJunk(title: string, url: URL, sourceName: string): boolean {
  const lower = title.toLowerCase();
  return (
    title === REMOVED_TITLE ||
    PLACEHOLDER_TITLES.has(lower) ||
    lower === sourceName.toLowerCase() ||
    LISTING_PATH.test(url.pathname) ||
    title.length < 12
  );
}

export function normalizeArticle(raw: RawArticleInput, provider: ProviderId): Article | null {
  if (!raw.title || !URL.canParse(raw.url)) return null;
  const url = new URL(raw.url);
  const publishedAt = new Date(raw.publishedAt);
  if (Number.isNaN(publishedAt.getTime())) return null;

  const sourceName = raw.sourceName?.trim() || url.hostname.replace(/^www\./, "");
  const title = cleanTitle(raw.title, sourceName);
  if (isJunk(title, url, sourceName)) return null;

  const description = raw.description?.trim();

  return {
    url: raw.url,
    title,
    description:
      description && description !== REMOVED_TITLE && description !== title ? description : null,
    imageUrl: normalizeImageUrl(raw.imageUrl),
    publishedAt: publishedAt.toISOString(),
    sourceName,
    author: raw.author?.trim() || null,
    provider,
  };
}
