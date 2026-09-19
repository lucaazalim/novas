"use client";

import { useDeferredValue, useState } from "react";

import { PickerDialog } from "@/components/ui/picker-dialog";
import { COUNTRIES, type Country } from "@/lib/news/constants";
import { cn } from "@/lib/utils/cn";
import { getFlagEmoji } from "@/lib/utils/flag";

type CountryPickerProps = {
  open: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (country: Country) => void;
};

export function CountryPicker({ open, onClose, selected, onSelect }: CountryPickerProps) {
  const [filter, setFilter] = useState("");
  const deferredFilter = useDeferredValue(filter.trim().toLowerCase());

  const countries = deferredFilter
    ? COUNTRIES.filter(
        (country) =>
          country.name.toLowerCase().includes(deferredFilter) || country.code === deferredFilter,
      )
    : COUNTRIES;

  return (
    <PickerDialog
      open={open}
      onClose={onClose}
      title="Choose a country"
      description="Headlines are merged from several news APIs for the country you pick."
    >
      <label htmlFor="country-filter" className="sr-only">
        Filter countries
      </label>
      <input
        id="country-filter"
        type="search"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Type to filter…"
        autoComplete="off"
        autoFocus
        className="rounded-card border-border bg-surface-muted mb-4 w-full border px-4 py-2"
      />

      {countries.length === 0 ? (
        <output className="text-muted block py-6 text-center">
          No country matches “{filter}”.
        </output>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((country) => {
            const isSelected = country.code === selected;
            return (
              <li key={country.code}>
                <button
                  type="button"
                  onClick={() => onSelect(country)}
                  aria-current={isSelected ? "true" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-card bg-surface-muted px-3 py-2 text-left text-lg transition-colors hover:bg-brand-soft",
                    isSelected && "ring-2 ring-brand",
                  )}
                >
                  <span aria-hidden="true" className="text-2xl leading-none">
                    {getFlagEmoji(country.code)}
                  </span>
                  <span>{country.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </PickerDialog>
  );
}
