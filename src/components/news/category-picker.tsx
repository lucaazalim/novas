"use client";

import { CategoryIcon } from "@/components/news/category-icon";
import { PickerDialog } from "@/components/ui/picker-dialog";
import { CATEGORIES, type Category } from "@/lib/news/constants";
import { cn } from "@/lib/utils/cn";

type CategoryPickerProps = {
  open: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (category: Category) => void;
};

export function CategoryPicker({ open, onClose, selected, onSelect }: CategoryPickerProps) {
  return (
    <PickerDialog open={open} onClose={onClose} title="Choose a category">
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((category) => {
          const isSelected = category.key === selected;
          return (
            <li key={category.key}>
              <button
                type="button"
                onClick={() => onSelect(category)}
                aria-current={isSelected ? "true" : undefined}
                className={cn(
                  "flex h-full w-full flex-col items-center gap-2 rounded-card bg-surface-muted p-4 text-center transition-colors hover:bg-brand-soft",
                  isSelected && "ring-2 ring-brand",
                )}
              >
                <CategoryIcon category={category.key} className="text-brand size-10" />
                <span className="text-lg font-semibold">{category.name}</span>
                <span className="text-muted text-xs">{category.description}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </PickerDialog>
  );
}
