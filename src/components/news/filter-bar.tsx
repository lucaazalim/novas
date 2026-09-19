"use client";

import { ChevronDownIcon, SearchIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { CategoryIcon } from "@/components/news/category-icon";
import { CategoryPicker } from "@/components/news/category-picker";
import { CountryPicker } from "@/components/news/country-picker";
import { findCategory, findCountry, type Category, type Country } from "@/lib/news/constants";
import { headlinesHref } from "@/lib/news/params";
import { PREFS_COOKIE, PREFS_MAX_AGE, serializePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils/cn";
import { getFlagEmoji } from "@/lib/utils/flag";

type FilterBarProps = {
  country: string;
  category: string;
  q: string;
};

function rememberPrefs(country: string, category: string) {
  document.cookie = `${PREFS_COOKIE}=${serializePrefs({ country, category })}; Path=/; Max-Age=${PREFS_MAX_AGE}; SameSite=Lax`;
}

/** "You are viewing news from [Country] about [Category]" plus an optional keyword filter. */
export function FilterBar({ country, category, q }: FilterBarProps) {
  const router = useRouter();
  const [openPicker, setOpenPicker] = useState<"country" | "category" | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentCountry = findCountry(country);
  const currentCategory = findCategory(category);

  function navigate(next: { country: string; category: string }) {
    rememberPrefs(next.country, next.category);
    setOpenPicker(null);
    startTransition(() => {
      router.push(headlinesHref({ ...next, q }));
    });
  }

  function selectCountry(selected: Country) {
    navigate({ country: selected.code, category });
  }

  function selectCategory(selected: Category) {
    navigate({ country, category: selected.key });
  }

  return (
    <section
      aria-label="Headline filters"
      className="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center"
    >
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-2 transition-opacity",
          isPending && "opacity-60",
        )}
        aria-busy={isPending}
      >
        <span className="hidden sm:inline">You are viewing news from</span>
        <PickerButton
          label={`Country: ${currentCountry?.name ?? country}. Change country`}
          onClick={() => setOpenPicker("country")}
        >
          <span aria-hidden="true">{getFlagEmoji(country)}</span>
          {currentCountry?.name ?? country}
        </PickerButton>
        <span className="hidden sm:inline">about</span>
        <PickerButton
          label={`Category: ${currentCategory?.name ?? category}. Change category`}
          onClick={() => setOpenPicker("category")}
        >
          <CategoryIcon category={category} className="size-4" />
          {currentCategory?.name ?? category}
        </PickerButton>
      </div>

      <search className="sm:ml-auto">
        <form action={`/${country}/${category}`} method="get" className="flex items-center gap-2">
          <label htmlFor="headline-filter" className="sr-only">
            Filter these headlines by keyword
          </label>
          <div className="relative w-full sm:w-56">
            <SearchIcon
              aria-hidden="true"
              className="text-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            />
            <input
              id="headline-filter"
              name="q"
              type="search"
              defaultValue={q}
              key={q}
              placeholder="Filter headlines…"
              autoComplete="off"
              maxLength={200}
              className="border-border bg-surface-muted w-full rounded-full border py-2 pr-3 pl-9 text-sm"
            />
          </div>
          {q ? (
            <Link
              href={headlinesHref({ country, category })}
              className="text-muted hover:bg-surface-muted inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm"
            >
              <XIcon className="size-4" aria-hidden="true" />
              Clear
            </Link>
          ) : null}
        </form>
      </search>

      <CountryPicker
        open={openPicker === "country"}
        onClose={() => setOpenPicker(null)}
        selected={country}
        onSelect={selectCountry}
      />
      <CategoryPicker
        open={openPicker === "category"}
        onClose={() => setOpenPicker(null)}
        selected={category}
        onSelect={selectCategory}
      />
    </section>
  );
}

function PickerButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-haspopup="dialog"
      className="bg-surface-muted hover:bg-brand-soft inline-flex items-center gap-2 rounded-xl px-3 py-2 font-bold transition-colors"
    >
      {children}
      <ChevronDownIcon className="text-muted size-4" aria-hidden="true" />
    </button>
  );
}
