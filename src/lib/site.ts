const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

/**
 * Static site-wide configuration. `NEXT_PUBLIC_SITE_URL` is inlined at build time and
 * drives canonical URLs, Open Graph metadata, robots.txt and the sitemap.
 */
export const siteConfig = {
  name: "Novas",
  tagline: "Top headlines from around the world",
  description:
    "Novas is an open-source news reader. Browse top headlines by country and category, and search articles from thousands of sources.",
  url: new URL(rawSiteUrl && rawSiteUrl.length > 0 ? rawSiteUrl : "http://localhost:3000"),
  repository: "https://github.com/lucaazalim/novas",
  brandColor: "#0c2faa",
  darkBackground: "#0b1020",
  locale: "en_US",
} as const;
