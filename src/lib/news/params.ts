import type { Route } from "next";

import {
  DEFAULT_CATEGORY,
  DEFAULT_COUNTRY,
  MAX_QUERY_LENGTH,
  MAX_RESULTS,
  PAGE_SIZE,
  findCategory,
  findCountry,
  findLanguage,
  isDateRange,
  isSortBy,
  type DateRange,
  type SortBy,
} from "@/lib/news/constants";

export type SearchParams = Record<string, string | string[] | undefined>;

const MAX_PAGE = Math.ceil(MAX_RESULTS / PAGE_SIZE);

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parsePage(value: string | string[] | undefined): number {
  const page = Number.parseInt(first(value) ?? "1", 10);
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.min(page, MAX_PAGE);
}

export function parseQuery(value: string | string[] | undefined): string {
  return (first(value) ?? "").trim().slice(0, MAX_QUERY_LENGTH);
}

export type HeadlinesRoute = {
  country: string;
  category: string;
  q: string;
  page: number;
};

/** Resolves a headlines route, falling back to the defaults for unknown values. */
export function resolveHeadlinesRoute(
  country: string | undefined,
  category: string | undefined,
  searchParams: SearchParams,
): HeadlinesRoute | null {
  const resolvedCountry = findCountry(country ?? DEFAULT_COUNTRY);
  const resolvedCategory = findCategory(category ?? DEFAULT_CATEGORY);
  if (!resolvedCountry || !resolvedCategory) return null;

  return {
    country: resolvedCountry.code,
    category: resolvedCategory.key,
    q: parseQuery(searchParams.q),
    page: parsePage(searchParams.page),
  };
}

export type SearchRoute = {
  q: string;
  language: string | undefined;
  sortBy: SortBy;
  range: DateRange;
  page: number;
};

export function resolveSearchRoute(searchParams: SearchParams): SearchRoute {
  const sortBy = first(searchParams.sortBy);
  const range = first(searchParams.range);

  return {
    q: parseQuery(searchParams.q),
    language: findLanguage(first(searchParams.language))?.code,
    sortBy: isSortBy(sortBy) ? sortBy : "publishedAt",
    range: isDateRange(range) ? range : "any",
    page: parsePage(searchParams.page),
  };
}

export function headlinesHref(
  route: Pick<HeadlinesRoute, "country" | "category"> & Partial<HeadlinesRoute>,
): Route {
  const params = new URLSearchParams();
  if (route.q) params.set("q", route.q);
  if (route.page && route.page > 1) params.set("page", String(route.page));
  const query = params.toString();
  const path = `/${route.country}/${route.category}`;
  return (query ? `${path}?${query}` : path) as Route;
}

export function searchHref(route: Partial<SearchRoute>): Route {
  const params = new URLSearchParams();
  if (route.q) params.set("q", route.q);
  if (route.language) params.set("language", route.language);
  if (route.sortBy && route.sortBy !== "publishedAt") params.set("sortBy", route.sortBy);
  if (route.range && route.range !== "any") params.set("range", route.range);
  if (route.page && route.page > 1) params.set("page", String(route.page));
  const query = params.toString();
  return query ? (`/search?${query}` as Route) : "/search";
}
