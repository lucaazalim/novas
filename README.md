# Novas

Novas is an open-source news reader built with [Next.js](https://nextjs.org/) and
[Tailwind CSS](https://tailwindcss.com/). It merges headlines from several news APIs
([News API](https://newsapi.org/), [NewsData.io](https://newsdata.io/) and [GNews](https://gnews.io/))
to show top stories by country and category, and to search articles from thousands of sources.

## Features

- Top headlines by country and category, with keyword filtering and pagination.
- Full-text search across all sources, with language, sort order and date-range filters.
- Every filter lives in the URL, so any view can be bookmarked or shared. The last country and
  category you picked are remembered for the home page.
- Light and dark themes, an option to hide stories without images, and a fully keyboard and
  screen-reader friendly UI.
- Installable Progressive Web App with an offline fallback page.
- SEO-ready: canonical URLs, Open Graph image, JSON-LD, sitemap and robots.txt.

## Getting started

Requirements: Node.js 20.9 or newer (see `.nvmrc`) and at least one free API key from
[News API](https://newsapi.org/), [NewsData.io](https://newsdata.io/) or [GNews](https://gnews.io/).
Configure all three for the best coverage.

```bash
npm install
cp .env.example .env
```

Fill in the keys you have in `.env`, then start the development server:

```bash
npm run dev
```

The app is available at http://localhost:3000.

> **Free-plan caveats.** The News API developer plan only accepts requests from `localhost` and
> its `country` filter only returns US headlines these days, so it serves US headlines and search.
> NewsData.io and GNews cover the other countries; on their free plans articles arrive with a
> 12-hour delay and 10 per request. The app never calls any API at build time, so CI needs no keys.

## Scripts

| Script                 | What it does                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `npm run dev`          | Start the development server.                                                           |
| `npm run build`        | Create a production build.                                                              |
| `npm start`            | Serve the production build.                                                             |
| `npm run lint`         | Lint with [Oxlint](https://oxc.rs/docs/guide/usage/linter), including type-aware rules. |
| `npm run format`       | Format with [oxfmt](https://oxc.rs/docs/guide/usage/formatter).                         |
| `npm run format:check` | Fail if any file is not formatted.                                                      |
| `npm run typecheck`    | Generate route types and run the TypeScript compiler.                                   |
| `npm run check`        | Lint, format check and type check in one go.                                            |

The same checks, plus a production build, run in GitHub Actions on every push and pull request.

## Project structure

```
src/
  app/            Routes, layouts and metadata files (manifest, robots, sitemap, OG image)
    [country]/[category]/   Headline pages, e.g. /br/technology
    search/       Full-text search
    offline/      Page served by the service worker when offline
  components/
    layout/       Header, footer, theme toggle, skip link
    news/         Headline grid, article cards, filters, pickers, pagination
    pwa/          Service worker registration, install button, offline banner
    ui/           Small shared primitives (dialog, skeleton, empty state)
  lib/
    news/         Aggregator, cached API layer, normalisation, route helpers
      providers/  One client per upstream API (News API, NewsData.io, GNews)
    hooks/        Client hooks
    utils/        Formatting helpers
public/
  sw.js           Hand-written service worker (no build step)
  icons/          PWA icons
```

## How it works

- **Providers and merging.** Every configured provider in `src/lib/news/providers` is queried in
  parallel. The aggregator (`src/lib/news/aggregate.ts`) drops placeholder titles, listing pages
  and stale items, deduplicates the same story across providers (by URL and by title), and ranks
  by freshness with bonuses for an image, a description and a high position in the provider's
  own ranking. Pagination happens over the merged pool, so page 2 costs no extra API calls. If a
  provider fails, the others still serve and the page shows a small notice.
- **Rendering and caching.** The app uses Next.js Cache Components. Each page has a static
  shell that is served instantly, while the headline list streams in. Merged results are cached
  on the server with `"use cache"` and revalidated every 10 minutes (see the `news` profile in
  `next.config.ts`), so repeated visits do not hit the API quotas.
- **Environment variables.** API keys are read at request time only. `NEXT_PUBLIC_SITE_URL`
  must be set to the public URL of a deployment so canonical links, the sitemap and the Open
  Graph image point at the right host.
- **Images.** Article images come from arbitrary publisher CDNs, so `next/image` is configured to
  accept any HTTPS host. Plain-HTTP image URLs are upgraded to HTTPS, and broken images fall back
  to a placeholder.
- **PWA.** `src/app/manifest.ts` generates the web manifest, and `public/sw.js` caches hashed
  assets and visited pages, falling back to `/offline` when the network is unavailable. The
  worker is only registered in production builds.

## Deployment

Any platform that runs Next.js works. On Vercel, set the API keys and `NEXT_PUBLIC_SITE_URL`
in the project settings. Note that the default in-memory data cache does not persist across
serverless instances; for high-traffic deployments consider a shared cache handler.
