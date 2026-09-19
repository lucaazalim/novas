import { SearchIcon } from "lucide-react";

import { DATE_RANGES, LANGUAGES, SORT_OPTIONS } from "@/lib/news/constants";
import type { SearchRoute } from "@/lib/news/params";

const selectClassName = "rounded-card border border-border bg-surface-muted px-3 py-2 text-sm";

/** Plain GET form so filtering works without JavaScript and every result page has a URL. */
export function SearchForm({ route }: { route: SearchRoute }) {
  return (
    <search>
      <form action="/search" method="get" className="card flex flex-col gap-3 p-4">
        <div className="flex gap-2">
          <label htmlFor="search-q" className="sr-only">
            Search query
          </label>
          <div className="relative w-full">
            <SearchIcon
              aria-hidden="true"
              className="text-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            />
            <input
              id="search-q"
              name="q"
              type="search"
              required
              defaultValue={route.q}
              placeholder="Search every article from the past month…"
              autoComplete="off"
              maxLength={200}
              className="rounded-card border-border bg-surface-muted w-full border py-2 pr-3 pl-9"
            />
          </div>
          <button
            type="submit"
            className="rounded-card bg-brand text-brand-fg hover:bg-brand-strong shrink-0 px-4 py-2 font-semibold transition-colors"
          >
            Search
          </button>
        </div>

        <fieldset className="flex flex-wrap gap-x-4 gap-y-2">
          <legend className="sr-only">Refine results</legend>

          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted">Sort</span>
            <select name="sortBy" defaultValue={route.sortBy} className={selectClassName}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted">Language</span>
            <select name="language" defaultValue={route.language ?? ""} className={selectClassName}>
              <option value="">Any language</option>
              {LANGUAGES.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted">Published</span>
            <select name="range" defaultValue={route.range} className={selectClassName}>
              {DATE_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
      </form>
    </search>
  );
}
