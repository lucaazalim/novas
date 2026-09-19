import { SearchXIcon } from "lucide-react";
import { io } from "next/cache";

import { ArticleList } from "@/components/news/article-list";
import { PartialNotice } from "@/components/news/headlines";
import { NewsErrorState } from "@/components/news/news-error-state";
import { NewsJsonLd } from "@/components/news/news-json-ld";
import { Pagination } from "@/components/news/pagination";
import { SearchForm } from "@/components/news/search-form";
import { EmptyState } from "@/components/ui/empty-state";
import { searchEverything } from "@/lib/news/api";
import { searchHref, type SearchRoute } from "@/lib/news/params";

export async function SearchResults({ route }: { route: SearchRoute }) {
  if (!route.q) {
    return (
      <>
        <h1 className="text-2xl font-bold tracking-tight">Search the news</h1>
        <div className="mt-4">
          <SearchForm route={route} />
        </div>
        <p className="text-muted mt-6">
          Search across thousands of sources. Use quotes for exact phrases, <code>+</code> for
          required words and <code>-</code> to exclude them.
        </p>
      </>
    );
  }

  await io();
  const result = await searchEverything(route);
  const now = new Date();
  const title = `Results for “${route.q}”`;

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <div className="mt-4">
        <SearchForm route={route} />
      </div>

      {!result.ok ? (
        <div className="mt-6">
          <NewsErrorState error={result.error} />
        </div>
      ) : result.articles.length === 0 ? (
        <EmptyState
          icon={<SearchXIcon className="size-10" aria-hidden="true" />}
          title="Nothing matched"
          description="Try broader keywords, another language, or a wider date range."
          className="mt-6"
        />
      ) : (
        <section aria-labelledby="results-heading" className="mt-6">
          <h2 id="results-heading" className="text-muted mb-4 text-sm">
            {result.totalResults} {result.totalResults === 1 ? "article" : "articles"}
            {route.page > 1 ? ` · page ${route.page}` : ""}
          </h2>
          {result.partial ? <PartialNotice /> : null}
          <ArticleList articles={result.articles} now={now} />
          <Pagination
            page={route.page}
            totalPages={result.totalPages}
            hrefFor={(page) => searchHref({ ...route, page })}
          />
          <NewsJsonLd name={title} articles={result.articles} />
        </section>
      )}
    </>
  );
}
