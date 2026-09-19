import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Headlines, headlinesTitle } from "@/components/news/headlines";
import { HeadlinesSkeleton } from "@/components/news/headlines-skeleton";
import { CATEGORIES, DEFAULT_COUNTRY, findCategory, findCountry } from "@/lib/news/constants";
import { headlinesHref, resolveHeadlinesRoute } from "@/lib/news/params";

type Props = PageProps<"/[country]/[category]">;

/** Prerender the default country's shells; every other combination renders on first visit. */
export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ country: DEFAULT_COUNTRY, category: category.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, category } = await params;
  const resolvedCountry = findCountry(country);
  const resolvedCategory = findCategory(category);
  if (!resolvedCountry || !resolvedCategory) return { title: "Page not found" };

  const path = headlinesHref({ country: resolvedCountry.code, category: resolvedCategory.key });
  const title = headlinesTitle({ country: resolvedCountry.code, category: resolvedCategory.key });
  const description = `${title}: ${resolvedCategory.description}. Updated every few minutes from the News API.`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    twitter: { title, description },
  };
}

/** Invalid or differently-cased params never reach here: src/proxy.ts answers those with 404/308. */
export default function HeadlinesPage({ params, searchParams }: Props) {
  return (
    <Suspense fallback={<HeadlinesSkeleton />}>
      <RouteHeadlines params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function RouteHeadlines({ params, searchParams }: Props) {
  const [{ country, category }, query] = await Promise.all([params, searchParams]);
  const route = resolveHeadlinesRoute(country, category, query);
  if (!route) notFound();
  return <Headlines route={route} />;
}
