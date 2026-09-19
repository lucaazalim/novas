"use client";

import { ImageIcon, ImageOffIcon } from "lucide-react";

import { IconButton } from "@/components/ui/icon-button";
import { useHtmlDataAttribute } from "@/lib/hooks/use-html-data-attribute";

const STORAGE_KEY = "hide-imageless";

/** Toggles a CSS-only filter that hides stories without artwork. Persists per device. */
export function ViewOptions() {
  const hideImageless = useHtmlDataAttribute("hideImageless") === "true";

  function toggle() {
    const next = document.documentElement.dataset.hideImageless !== "true";
    if (next) {
      document.documentElement.dataset.hideImageless = "true";
    } else {
      delete document.documentElement.dataset.hideImageless;
    }
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Ignore storage failures; the preference simply will not persist.
    }
  }

  return (
    <IconButton
      onClick={toggle}
      label={hideImageless ? "Show stories without images" : "Hide stories without images"}
      pressed={hideImageless}
      tone="onBrand"
    >
      {hideImageless ? (
        <ImageOffIcon className="size-5" aria-hidden="true" />
      ) : (
        <ImageIcon className="size-5" aria-hidden="true" />
      )}
    </IconButton>
  );
}
