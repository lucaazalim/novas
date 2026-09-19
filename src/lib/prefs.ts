import { findCategory, findCountry } from "@/lib/news/constants";

export const PREFS_COOKIE = "novas-prefs";
export const PREFS_MAX_AGE = 60 * 60 * 24 * 365;

export type Prefs = {
  country: string;
  category: string;
};

/** Cookie format: "<country>.<category>", e.g. "br.technology". */
export function parsePrefs(raw: string | undefined): Prefs | null {
  if (!raw) return null;
  const [country, category] = decodeURIComponent(raw).split(".");
  if (!country || !category) return null;
  if (!findCountry(country) || !findCategory(category)) return null;
  return { country: country.toLowerCase(), category: category.toLowerCase() };
}

export function serializePrefs(prefs: Prefs): string {
  return encodeURIComponent(`${prefs.country}.${prefs.category}`);
}
