import { NewspaperIcon } from "lucide-react";
import { io } from "next/cache";

import { ArticleList } from "@/components/news/article-list";
import { FeaturedGrid } from "@/components/news/featured-grid";
import { FilterBar } from "@/components/news/filter-bar";
import { NewsErrorState } from "@/components/news/news-error-state";
import { NewsJsonLd } from "@/components/news/news-json-ld";
import { Pagination } from "@/components/news/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { getTopHeadlines } from "@/lib/news/api";
import { findCategory, findCountry } from "@/lib/news/constants";
import { headlinesHref, type HeadlinesRoute } from "@/lib/news/params";

const FEATURED_COUNT = 3;

/** Shown when at least one upstream API failed; the others still delivered. */
export function PartialNotice() {
  return (
    <output className="text-muted block w-full text-sm">
      Some news sources are temporarily unavailable, so this list may be shorter than usual.
    </output>
  );
}

export function headlinesTitle(route: Pick<HeadlinesRoute, "country" | "category">): string {
  const country = findCountry(route.country);
  const category = findCategory(route.category);
  const topic = category?.key === "general" ? "Top" : (category?.name ?? "Top");
  return `${topic} headlines in ${country?.name ?? route.country}`;
}

type HeadlinesProps = {
  route: HeadlinesRoute;
};

/**
 * HeadlinesSkeleton mirrors this shape so the static shell reserves the right space.
 * `io()` keeps the News API out of the build-time prerender; the fetch itself is cached.
 */
export async function Headlines({ route }: HeadlinesProps) {
  await io();
  const result = await getTopHeadlines(route);
  const now = new Date();
  const title = headlinesTitle(route);
  const country = findCountry(route.country);
  const category = findCategory(route.category);
  const filterBar = <FilterBar country={route.country} category={route.category} q={route.q} />;

  if (!result.ok) {
    return (
      <>
        {filterBar}
        <h1 className="sr-only">{title}</h1>
        <NewsErrorState error={result.error} />
      </>
    );
  }

  const showFeatured = route.page === 1 && result.articles.length > FEATURED_COUNT;
  const featured = showFeatured ? result.articles.slice(0, FEATURED_COUNT) : [];
  const rest = showFeatured ? result.articles.slice(FEATURED_COUNT) : result.articles;

  return (
    <>
      {filterBar}

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          {route.q ? (
            <>
              {title} matching <q>{route.q}</q>
            </>
          ) : (
            title
          )}
        </h1>
        <p className="text-muted text-sm">
          {result.totalResults} {result.totalResults === 1 ? "story" : "stories"}
          {route.page > 1 ? ` · page ${route.page}` : ""}
        </p>
        {result.partial ? <PartialNotice /> : null}
      </div>

      {featured.length > 0 ? (
        <div className="mt-4">
          <FeaturedGrid articles={featured} />
        </div>
      ) : null}

      {result.articles.length === 0 ? (
        <EmptyState
          icon={<NewspaperIcon className="size-10" aria-hidden="true" />}
          title="No stories found"
          description={
            route.q
              ? "Try a different keyword, or clear the filter to see every headline."
              : `No recent ${category?.name.toLowerCase() ?? route.category} stories were found for ${country?.name ?? route.country}. Try the General category or another country.`
          }
          className="mt-8"
        />
      ) : (
        <section aria-labelledby="latest-heading" className="mt-8">
          <h2 id="latest-heading" className="sr-only">
            More stories
          </h2>
          <ArticleList articles={rest} now={now} />
          <Pagination
            page={route.page}
            totalPages={result.totalPages}
            hrefFor={(page) => headlinesHref({ ...route, page })}
          />
        </section>
      )}

      <NewsJsonLd name={title} articles={result.articles} />
    </>
  );
}
