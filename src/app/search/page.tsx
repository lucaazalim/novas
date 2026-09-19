import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchResults } from "@/components/news/search-results";
import { Skeleton } from "@/components/ui/skeleton";
import { parseQuery, resolveSearchRoute } from "@/lib/news/params";

type Props = PageProps<"/search">;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = parseQuery((await searchParams).q);
  return {
    title: q ? `Results for “${q}”` : "Search",
    description: q
      ? `News articles about ${q} from thousands of sources, sorted and filtered your way.`
      : "Search news articles from thousands of sources by keyword, language and date.",
    // Search result pages are endless and thin; keep crawlers on the headline pages instead.
    robots: { index: false, follow: true },
    alternates: { canonical: "/search" },
  };
}

export default function SearchPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <ResolvedSearch searchParams={searchParams} />
    </Suspense>
  );
}

async function ResolvedSearch({ searchParams }: Pick<Props, "searchParams">) {
  const route = resolveSearchRoute(await searchParams);
  return <SearchResults route={route} />;
}

function SearchSkeleton() {
  return (
    <>
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-4 h-28" />
      <div className="mt-6 flex flex-col gap-5" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="grid grid-cols-1 gap-5 lg:grid-cols-8">
            <Skeleton className="aspect-video lg:col-span-3 lg:aspect-[4/3]" />
            <div className="flex flex-col gap-3 lg:col-span-5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
