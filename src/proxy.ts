import { NextResponse, type NextRequest } from "next/server";

import { CATEGORIES, COUNTRIES } from "@/lib/news/constants";

const countryCodes = new Set(COUNTRIES.map((country) => country.code));
const categoryKeys = new Set<string>(CATEGORIES.map((category) => category.key));

/**
 * Validates /[country]/[category] before rendering, so wrong URLs get a real 404 status and
 * differently-cased URLs a 308 redirect. Deciding this during streaming would ship a 200 first,
 * which search engines treat as a soft 404.
 */
export function proxy(request: NextRequest) {
  const [, country = "", category = ""] = request.nextUrl.pathname.split("/");
  const normalizedCountry = country.toLowerCase();
  const normalizedCategory = category.toLowerCase();

  if (!countryCodes.has(normalizedCountry) || !categoryKeys.has(normalizedCategory)) {
    // Rewriting to a path no route matches renders the app's not-found page with a 404 status.
    return NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
  }

  if (country !== normalizedCountry || category !== normalizedCategory) {
    const url = request.nextUrl.clone();
    url.pathname = `/${normalizedCountry}/${normalizedCategory}`;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Exactly two path segments, excluding Next.js internals and files with an extension.
  matcher: ["/((?!_next|api|search|offline|icons)[^/.]+)/([^/.]+)"],
};
