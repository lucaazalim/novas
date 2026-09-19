import { SearchIcon } from "lucide-react";

/** Plain GET form: works before hydration and lands on /search?q=... */
export function HeaderSearchForm() {
  return (
    <search className="w-full sm:w-auto">
      <form action="/search" method="get" className="flex w-full items-center sm:w-72">
        <label htmlFor="header-search" className="sr-only">
          Search all news
        </label>
        <div className="relative w-full">
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/70"
          />
          <input
            id="header-search"
            name="q"
            type="search"
            placeholder="Search all news…"
            autoComplete="off"
            maxLength={200}
            className="w-full rounded-full border border-white/20 bg-white/10 py-2 pr-4 pl-9 text-sm text-white placeholder:text-white/70 focus:border-white/60 focus:bg-white/15 focus:outline-none"
          />
        </div>
      </form>
    </search>
  );
}
