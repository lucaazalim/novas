export type Category = { key: string; name: string; description: string };
export type Country = {
  code: string;
  name: string;
  /** ISO 639-1 code of the country's main news language, used to filter provider results. */
  language: string;
};
export type Language = { code: string; name: string };

export const CATEGORIES = [
  { key: "general", name: "General", description: "the biggest stories of the day" },
  { key: "business", name: "Business", description: "markets, companies and the economy" },
  { key: "technology", name: "Technology", description: "gadgets, software and the internet" },
  { key: "science", name: "Science", description: "research, space and discoveries" },
  { key: "health", name: "Health", description: "medicine, wellness and public health" },
  { key: "sports", name: "Sports", description: "results, transfers and competitions" },
  { key: "entertainment", name: "Entertainment", description: "film, music and celebrities" },
] as const satisfies readonly Category[];

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

/** Every country the News API documents for `top-headlines` or its sources catalogue, sorted by name. */
export const COUNTRIES: readonly Country[] = [
  { code: "ar", name: "Argentina", language: "es" },
  { code: "au", name: "Australia", language: "en" },
  { code: "at", name: "Austria", language: "de" },
  { code: "be", name: "Belgium", language: "nl" },
  { code: "br", name: "Brazil", language: "pt" },
  { code: "bg", name: "Bulgaria", language: "bg" },
  { code: "ca", name: "Canada", language: "en" },
  { code: "cn", name: "China", language: "zh" },
  { code: "co", name: "Colombia", language: "es" },
  { code: "cu", name: "Cuba", language: "es" },
  { code: "cz", name: "Czechia", language: "cs" },
  { code: "eg", name: "Egypt", language: "ar" },
  { code: "fr", name: "France", language: "fr" },
  { code: "de", name: "Germany", language: "de" },
  { code: "gr", name: "Greece", language: "el" },
  { code: "hk", name: "Hong Kong", language: "zh" },
  { code: "hu", name: "Hungary", language: "hu" },
  { code: "is", name: "Iceland", language: "is" },
  { code: "in", name: "India", language: "en" },
  { code: "id", name: "Indonesia", language: "id" },
  { code: "ie", name: "Ireland", language: "en" },
  { code: "il", name: "Israel", language: "he" },
  { code: "it", name: "Italy", language: "it" },
  { code: "jp", name: "Japan", language: "ja" },
  { code: "lv", name: "Latvia", language: "lv" },
  { code: "lt", name: "Lithuania", language: "lt" },
  { code: "my", name: "Malaysia", language: "ms" },
  { code: "mx", name: "Mexico", language: "es" },
  { code: "ma", name: "Morocco", language: "fr" },
  { code: "nl", name: "Netherlands", language: "nl" },
  { code: "nz", name: "New Zealand", language: "en" },
  { code: "ng", name: "Nigeria", language: "en" },
  { code: "no", name: "Norway", language: "no" },
  { code: "pk", name: "Pakistan", language: "ur" },
  { code: "ph", name: "Philippines", language: "en" },
  { code: "pl", name: "Poland", language: "pl" },
  { code: "pt", name: "Portugal", language: "pt" },
  { code: "ro", name: "Romania", language: "ro" },
  { code: "ru", name: "Russia", language: "ru" },
  { code: "sa", name: "Saudi Arabia", language: "ar" },
  { code: "rs", name: "Serbia", language: "sr" },
  { code: "sg", name: "Singapore", language: "en" },
  { code: "sk", name: "Slovakia", language: "sk" },
  { code: "si", name: "Slovenia", language: "sl" },
  { code: "za", name: "South Africa", language: "en" },
  { code: "kr", name: "South Korea", language: "ko" },
  { code: "es", name: "Spain", language: "es" },
  { code: "se", name: "Sweden", language: "sv" },
  { code: "ch", name: "Switzerland", language: "de" },
  { code: "tw", name: "Taiwan", language: "zh" },
  { code: "th", name: "Thailand", language: "th" },
  { code: "tr", name: "Turkey", language: "tr" },
  { code: "ua", name: "Ukraine", language: "uk" },
  { code: "ae", name: "United Arab Emirates", language: "en" },
  { code: "gb", name: "United Kingdom", language: "en" },
  { code: "us", name: "United States", language: "en" },
  { code: "ve", name: "Venezuela", language: "es" },
];

/** Languages accepted by the News API `everything` endpoint. */
export const LANGUAGES: readonly Language[] = [
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "zh", name: "Chinese" },
  { code: "nl", name: "Dutch" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "he", name: "Hebrew" },
  { code: "it", name: "Italian" },
  { code: "no", name: "Norwegian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "es", name: "Spanish" },
  { code: "sv", name: "Swedish" },
  { code: "ud", name: "Urdu" },
];

export const SORT_OPTIONS = [
  { value: "publishedAt", label: "Newest first" },
  { value: "relevancy", label: "Most relevant" },
  { value: "popularity", label: "Most popular" },
] as const;

export type SortBy = (typeof SORT_OPTIONS)[number]["value"];

export const DATE_RANGES = [
  { value: "any", label: "Any time", days: null },
  { value: "24h", label: "Past 24 hours", days: 1 },
  { value: "7d", label: "Past week", days: 7 },
  { value: "30d", label: "Past month", days: 30 },
] as const;

export type DateRange = (typeof DATE_RANGES)[number]["value"];

export const DEFAULT_COUNTRY = "us";
export const DEFAULT_CATEGORY: CategoryKey = "general";

/** Articles per page. Three go to the featured grid on the first page. */
export const PAGE_SIZE = 24;
/** The News API developer plan never returns more than 100 results per query. */
export const MAX_RESULTS = 100;
export const MAX_QUERY_LENGTH = 200;

export function findCountry(code: string | null | undefined): Country | undefined {
  if (!code) return undefined;
  const lower = code.toLowerCase();
  return COUNTRIES.find((country) => country.code === lower);
}

export function findCategory(key: string | null | undefined): Category | undefined {
  if (!key) return undefined;
  const lower = key.toLowerCase();
  return CATEGORIES.find((category) => category.key === lower);
}

export function findLanguage(code: string | null | undefined): Language | undefined {
  if (!code) return undefined;
  const lower = code.toLowerCase();
  return LANGUAGES.find((language) => language.code === lower);
}

export function isSortBy(value: string | null | undefined): value is SortBy {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export function isDateRange(value: string | null | undefined): value is DateRange {
  return DATE_RANGES.some((range) => range.value === value);
}
