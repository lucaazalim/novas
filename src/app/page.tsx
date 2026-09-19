import { cookies } from "next/headers";
import { Suspense } from "react";

import { Headlines } from "@/components/news/headlines";
import { HeadlinesSkeleton } from "@/components/news/headlines-skeleton";
import { resolveHeadlinesRoute } from "@/lib/news/params";
import { PREFS_COOKIE, parsePrefs } from "@/lib/prefs";

export default function HomePage({ searchParams }: PageProps<"/">) {
  return (
    <Suspense fallback={<HeadlinesSkeleton />}>
      <HomeHeadlines searchParams={searchParams} />
    </Suspense>
  );
}

/** The home page honours the last country/category the visitor picked (stored in a cookie). */
async function HomeHeadlines({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const [cookieStore, params] = await Promise.all([cookies(), searchParams]);
  const saved = parsePrefs(cookieStore.get(PREFS_COOKIE)?.value);
  const route = resolveHeadlinesRoute(saved?.country, saved?.category, params);

  // Defaults are always valid, so this only guards the type.
  if (!route) return null;

  return <Headlines route={route} />;
}
