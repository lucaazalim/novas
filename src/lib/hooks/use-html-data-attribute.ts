"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true });
  return () => observer.disconnect();
}

/**
 * Reads a `data-*` attribute from <html> as an external store, so client components stay in
 * sync with the inline ThemeScript without effects or hydration mismatches.
 * Returns `null` during server rendering and hydration.
 */
export function useHtmlDataAttribute(name: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset[name] ?? null,
    () => null,
  );
}
